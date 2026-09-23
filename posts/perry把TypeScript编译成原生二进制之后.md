---
title: perry 把 TypeScript 编译成 wasm：从慢 1757 倍，修到只慢原生 2.8 倍
description: 把 perry 的 Rust 运行时编译成 wasm 模块跑在 WAMR 上，程序跑通了，但解释器下慢原生 1757 倍。拆因子后发现引擎无辜、问题出在 codegen 类型擦除；改上游发射点后，AOT 下从 122ms 压到 3.9ms，相对原生只慢 2.8 倍。
category: WebAssembly
tags: [perry, TypeScript, WebAssembly, WAMR, Rust, 编译器, 性能]
recommend: false
date: 2026-09-21
---

# perry 把 TypeScript 编译成 wasm：从慢 1757 倍，修到只慢原生 2.8 倍

## 前言

写服务端或嵌入式程序，选语言基本是两条路。

一条走 C、C++、Rust，编出机器码，性能好，产物小。麻烦在并发上：标准库里没有事件循环，写个网络服务得自己搭一套，或者手写状态机；用多线程就得自己管锁，防数据竞争。

另一条走 JS/TS。运行时自带事件循环，`async/await` 是语法的一部分，同一时刻只有一段代码在跑，共享状态不用加锁，写并发比 C 省心得多。代价是性能：代码跑在解释器或 JIT 里，V8 动辄几十 MB，嵌入式设备放不下。

还有一层问题，跟性能和并发都无关，却在很多项目选型时绕不开：TypeScript 程序的交付，长期以来等同于交付源码。编译成 JS 之后仍是可读文本，打包、压缩只改变读起来的难易，暴露的语义一点没少。业务逻辑即核心资产的场景里，产物就是源码。

编译成原生二进制能解决源码外流，代价是把"一次编写、到处运行"换成"一次编写、到处编译"，交叉编译矩阵随平台数量线性膨胀。WebAssembly 是第三条路：产物是平台无关的字节码，只分发一次；运行只需要一个 wasm 运行时，"到处运行"由运行时侧提供，不必让编译器侧穷举。

[perry](https://github.com/PerryTS/perry) 让这条路从设想变成可以摸的东西。它是 Rust 写的 TS/JS 编译器，SWC 解析、自研 HIR，native 后端基于 LLVM 产出原生可执行文件；wasm 后端单独抽出来发成 npm 包 [`@typerry/node`](https://github.com/fn-a/typerry)，链路是 SWC → HIR → wasm codegen。两条后端对运行时的处理截然不同：

- native 后端把 `perry-runtime`（Rust 写的 GC、JSValue、内置对象）静态链进可执行文件，运行时本身就是产物的一部分。
- wasm 后端把运行时操作声明成来自宿主的导入。perry 这么设计是为了产出"自包含 HTML + base64 wasm"，把运行时委托给 JS 宿主层，于是每个宿主都得实现一遍运行时。

下面记的是这次折腾的全过程。中间有两处我完全没料到的转向，一处在 ABI 的取证方式上，一处在性能排查上，都留在正文里，没抹平成一条直线。

先说结果：跑通了，六步全过，输出和 perry 自带的 JS 宿主层逐字节一致。慢也是真的慢，解释器下比手写 C 慢 1757 倍。拆到最后引擎是干净的，锅在 perry wasm codegen 的类型擦除，它把本可以内联的算术改成了跨边界的桥接调用。改掉上游的发射点之后，AOT 从 122.112 ms 掉到 3.891 ms，快 31.4 倍。

## 211 个导入

perry 的 wasm 后端产出的是一个完整程序，导出 `_start` 和 `memory`，程序入口在启动时把全部业务逻辑执行完毕。它同时声明了 211 个 `rt.*` 导入，覆盖字符串、console、Math、JSON、Date、Map/Set、Buffer、crypto 等运行时能力；程序用不用是另一回事，实例化时要求全部可解析。

拿到手先看结构：

```text
Export:  _start / memory / __indirect_function_table / ...
Import[211]:
func[0] sig=1 <rt.string_new> <- rt.string_new
func[1] sig=2 <rt.console_log> <- rt.console_log
...
```

这 211 个是 perry 一次铺开的固定接口面，跟具体程序用到哪些能力无关，任何 perry 编译的 wasm 都带这套导入。按导入名前缀分布（计数来自从导入段生成的符号表）：

| 前缀 | 桩 | 前缀 | 桩 |
|---|---:|---|---:|
| `array_*` | 28 | `date_*` | 12 |
| `string_*` | 17 | `url_*` | 10 |
| `buffer_*` | 13 | `set_*` | 10 |
| `object_*` | 12 | `map_*` | 10 |
| `math_*` | 12 | `class_*` | 9 |
| `closure_*` | 7 | `crypto_*` | 4 |

其余分散在 `searchparams_*`/`response_*`/`path_*`（各 6）、`uint8array_*`（5）、`promise_*`（3）以及 `json_*`/`fetch_*`/`regexp_*`/`process_*` 等更小的族。13 个真实现分属 `string_*`/`console_*`/`js_*`/`is_*`/`mem_*`。

前言里那个源码交付的问题，到这里能回答一部分。查 `app.wasm` 的段表，没有 name 自定义段（只有 type / import / func / table / memory / global / export / element / datacount / code / data 共十一段），函数名与局部变量名都不在产物里，能提取出的标识符全是程序自己的字符串字面量。看上去源码保护是成立的。但导入名这一项不轻：198 个桩的名字（`array_new`、`json_parse`、`fetch_url` 等）直接来自导入段，等于标明了程序会触及哪些运行时能力。门槛只是从"打开源码"抬到"反编译一遍再读"，说不上真正的保护。

## 让它跑起来

### 装包就撞了两个坑

`@typerry/node` 装到的是 0.0.3，跑不起来，报 `Cannot find module '@typerry/node-linux-x64-gnu'`。napi-rs 的包分主包和平台包，0.0.3 的 `optionalDependencies` 点名了六个平台包，registry 上却只有 0.0.2。主包自己是个不带 `.node` 文件的空壳。降到 0.0.2 才装上，平台包还得从 `registry.npmjs.org` 手动取 tarball。

包解决之后，README 里的 CLI 用法又行不通。`typerry input.ts --bare` 执行完什么都没有：没有报错，没有文件，退出码 0。翻了 `main.js` 才发现它靠 `process.argv[1]` 和 `import.meta.url` 比对来判断自己是不是被直接执行，而 `node_modules/.bin/typerry` 是个软链，路径对不上。绕开的办法是用库 API：

```js
import { wasmBare, wasmBoot } from '@typerry/node';
const wasm = wasmBare(source);              // 裸 wasm
const ref  = wasmBoot(source, '', true);    // wasm + perry 自带的 JS 宿主层
```

`wasmBare` 产裸 wasm 模块，`wasmBoot` 额外产一份 JS 宿主层。这份 112 KB 的宿主层，后来成了整个探索里最有价值的东西。

### 摸清 211 个导入的调用约定：拿参考实现当基准

真正的难点在 211 个 `rt.*` 导入的实现约定。调用约定是 perry 内部的，没有文档。好在 perry 自带的宿主层本身就是一份现成的参考实现，那 211 个函数的定义都在里面。我没有去读源码猜，而是给它的 `mem_call` 插了一行打印：

```js
process.stderr.write(`MEMCALL ${name} args=${JSON.stringify(args)}\n`);
```

跑一遍，事实全有了：

```text
MEMCALL js_add args=[6764,4181]
MEMCALL js_add args=["fib(0..19) sum = ",10945]
MEMCALL console_log args=["fib(0..19) sum = 10945"]
```

一个 20 行的程序，真正用到的导入只有 `string_new`、`mem_call`、`mem_call_i32` 三个，所有动态调用（字符串相加、console 输出、`.length`）都收敛到 `mem_call` 这一个入口。其余 200 多个导入在实例化时被解析，之后不会被调用。

::: tip 提示
没有规范，但有能跑的参考实现时，插桩取证比读源码推测快得多。我一开始想靠读 wat 反推参数含义，盯了半小时 `i64.const 9223090561878065386` 也不知道那是什么；插一行 print 两分钟就全清楚了。
:::

ABI 就这么摸出来了。值编码是 NaN-boxing，i64 里装 f64 位模式，高 16 位是标签：

| 值 | 位模式 |
| --- | --- |
| `undefined` / `null` / `false` / `true` | `0x7FFC…0001` ~ `0x7FFC…0004` |
| 对象/数组/闭包（handle） | 高 16 位 `0x7FFD`，低 32 位是 handle id |
| int32 快路径 | 高 16 位 `0x7FFE` |
| 字符串 | 高 16 位 `0x7FFF`，低 32 位是字符串表下标 |
| 其他 | 就是普通 double |

字符串表是隐式契约：wasm 启动时按固定顺序逐个调用 `rt.string_new(offset, len)` 注册字面量，宿主必须按同样顺序 append，下标即 id，两边计数错一位所有字符串就全乱了。动态调用协议是 `mem_call(nameId, argc, base)`：参数以 u64 槽位写在 wasm 线性内存 `base` 处，返回值也写回 `base`。为什么不直接按 f64 传参？源码没解释。我的判断是 f64 过 FFI 边界时 NaN 位模式可能被规范化，两边都按 u64 读写原始位模式最稳。这一条是推断，没有实证。

`rt.*` 要是做成 WASI，任何 wasm 运行时都能跑，听起来更划算。但两者不在同一层。WASI（preview1）是系统调用级接口，形态统一成"(指针, 长度, …) → errno"，操作对象是字节缓冲和资源句柄；`rt.*` 是语言运行时，字符串表、NaN-boxed 值的编解码、对象/数组的 handle store，外加一个按名字动态分派的 `mem_call` 入口。WASI 里没有"字符串"这个概念，也没有堆对象、属性与原型链。位置关系因此很清楚：WASI 在 `rt` 下面一层，拿两者谈兼容还早。

### 运行时放哪儿：三条路线

放置运行时有三条路，按改动量排序：

| 路线 | 做法 | 状态 |
|---|---|---|
| 一·C 桥接 | 宿主里用 C 手写 `rt.*`，编成 `libperry_rt.so`，`iwasm --native-lib` 动态载入 | 已实施为探针，后废弃 |
| 二·AOT 内联 | `wasm-ld` 把运行时静态库与 codegen 输出链成单模块 | 未实施 |
| 三·运行时 wasm 模块 | 运行时编成独立 wasm 模块，业务模块 import 它，WAMR 多模块链接 | **当前实现，已实测** |

路线一是探针，不是终点。ABI 清楚了，最直接的做法是宿主把 `rt.*` 实现一遍。我用 C 写了 13 个函数，值编码用一套宏直接照抄 perry 的 `perry-runtime/src/value.rs`，编成共享库 dlopen 进 WAMR，纯计算程序能跑。问题出在成本上：换成用数组的程序立刻报错。要把对象、原型链、闭包、GC、异步补齐，等于把 `perry-runtime` 在 C 里重写一遍，成千上万行，还得跟着上游 ABI 走。

成本随程序用到的语言特性线性增长。这条路走到头，就是每个平台各写一遍运行时。

路线三的思路来自 native 后端：既然 native 后端能把运行时静态链进产物，wasm 后端为什么不能把同一份运行时按 wasm 目标编译，跟业务模块一起分发？`perry-runtime` 本来就是 Rust 源码。我照这个思路搭了 `runtime-wasm/`，一个 `#![no_std]` 的 Rust crate，620 行，release 用 `opt-level="s"` + `lto` + `panic="abort"`，编译出 `rt.wasm`。业务模块 import 它的 memory 和 211 个 `rt.*`，WAMR 的多模块机制把两个模块链接执行，宿主只剩 WASI 的 `fd_write` 写 stdout/stderr。

```mermaid
graph LR
  A["src/app.ts"] -->|perry| B["build/app.wasm"]
  B -->|"import rt.memory + 211 个 rt.*"| C["build/rt.wasm<br/>Rust #![no_std] 运行时<br/>13 实现 + 198 桩"]
  C -->|"export rt.* + memory"| D["WAMR 多模块 runner<br/>host/perry_link.c"]
  D -->|"WASI fd_write"| E["stdout / stderr"]
```

这条路行得通的原因很实在：211 个 `rt.*` 签名只用到 i32/i64/f32/f64，指针就是业务线性内存里的偏移，跨模块不存在"类型不匹配"这一层；运行时模块 import 业务那块内存之后，`mem_call`/`string_new` 直接读写同一块内存，零拷贝约定原样成立。

几个构造上的关键点：

- 同一块线性内存只能有一个定义者。业务模块原本自带 memory 段，patch 脚本把它删掉，改成向运行时模块 import `rt.memory`。memory/table 的 import 不占函数索引空间，所以业务模块 code 段一个字节不用动。
- 地址布局要错开。运行时的数据得避开业务模块的低地址区，`.cargo/config.toml` 里用 `--global-base=2097152` 把 data/bss/stack 放到 2 MiB 以上。
- 198 个桩在编译期生成。`gen-rt-symbols.mjs` 从业务模块导入段读出全部 `rt.*` 名字和签名，源文件里已实现（`rt_<名字>(`）的只登记符号，其余生成"调用即报错"的桩。wasm 链接检查的是声明，211 个导入必须全部有主，哪怕一个都不会被调用。桩被调用时写 stderr 实名报错后 trap，绝不静默返回假数据，否则程序会在不知道哪里悄悄算错。

13 个真实现覆盖 string（new/len/eq/concat/to_string）、number 与 bool 的 NaN-box 值、plus、console（log/warn/error），以及动态分派（`mem_call`/`mem_call_i32`）。宿主 runner `perry_link.c` 的 main 只做四件事：load rt 模块、注册为 `"rt"`、给 rt 配 WASI 参数、load 业务模块并实例化执行。整个文件一行 `rt.*` 的实现都没有，这就是它和路线一最大的不同。

### 六步全过

`demo.sh` 把整个流程串成六步：依赖 → 编译（TS → `app.wasm` + JS 宿主层参照）→ 运行时（生成 198 个桩 → cargo build 出 `rt.wasm`）→ 链接（patch memory + 编 runner）→ 正向跑（与 JS 宿主层逐字节比对）→ 负向（用数组的 TS 程序应当报未实现且退出码非 0）。6/6 步 PASS，正向输出与 perry 官方 JS 宿主层逐字节一致：

```text
fib(0..19) sum = 10945
Hello, WAMR!
msg.length = 12
string compare ok
template: Hello, WAMR! (sum=10945)
```

负向用一段碰数组的程序 `const xs: number[] = [1, 2, 3]; console.log(xs.length);`，立刻报错，退出码 1，实名点出没实现的是哪个函数：

```text
Exception: bridge function 'array_new' is not implemented
execute _start: Exception: unreachable
```

产物尺寸：`app.wasm` 10650 B、patch 后 `app_link.wasm` 10658 B、`rt.wasm` 16798 B。能跑、输出正确、产物自包含。第一部分到此收工。

## 一个 1757 倍的怪数字

架构验证通过，跑出来的数字立刻显出异常。同一份 `src/bench.ts`（递归 `fib(29)` 加一次 10⁶ 次求和循环），在 WAMR 解释器里跑是 2470.678 ms，手写 C 原生是 1.406 ms。1757 倍。

这个数字本身没有信息量。引擎代差、编译器产出的指令形态、桥接实现效率全混在一起。照这个数说"wasm 比原生慢 1757 倍"，读者自然读成"wasm 不行"，真实情况却可能是某个编译器的某个后端没做特化。得把这句话拆开，拆到每一步都能被独立证据约束。

### 六路对照

共享同一份源码与同一组常量的六条执行路径：

| 路 | 宿主 / 引擎 | 说明 |
|---|---|---|
| A | WAMR FAST_INTERP | perry wasm 模块 + rt.wasm 双模块，解释执行 |
| B | Node V8 | perry wasm 模块 + perry 自带 JS 宿主层 |
| C | 手写原生 | `gcc -O2`，i64 实现 |
| D | perry 原生 | TS → LLVM → 可执行文件 |
| E | WAMR AOT | `wamrc` O3，合并单模块（rt 代码也进机器码） |
| F | QuickJS | 纯解释器跑同一算法的 JS 版本 |

六条路各答一个问题：C 给出这块硬件能有多快的地板，D 问 perry 自己的两条后端差多少，E 问换成 AOT 引擎后还剩多少差距，B 和 F 提供独立引擎的参照系。F 尤其要紧，它刻意避开 wasm 和桥接调用，只回答一个问题：纯解释器跑同样的算法要多久。

稳态 P50（同一台机器，AMD Ryzen 7 5800H）：

| 目标 | P50 | ÷C 原生 |
|---|---:|---:|
| E. WAMR AOT（perry wasm，合并单模块） | 146.829 ms | 104.4× |
| E′. WAMR AOT（干净 wasm 对照） | 1.362 ms | 0.97× |
| A. WAMR 解释器 | 2470.678 ms | 1757.2× |
| B. Node V8（扣除启动 24 ms） | 1280.000 ms | 910.4× |
| C. 原生 gcc -O2 | 1.406 ms | 1× |
| D. perry 原生（进程级，含启动） | 6.286 ms | 4.5× |
| F. QuickJS（进程级） | 85.532 ms | 61× |

### 1.471 ms 物理上不可能

结果出来先挨了自己一记质疑：原生基线 1.471 ms 在物理上可疑。按 1,664,079 次逻辑调用均摊，每层递归只摊到 0.6–0.9 ns，这做不到。质疑指向的正是基准方法本身。

我没有复测一遍了事，查了三条线。

先换编译器。同一份 `bench_native.c` 在 gcc -O1/-O2/-O3/-Ofast/-Os 和 clang -O2 下，五条独立编译管线聚在 1.2–3.6 ms 同一数量级，真有病态折叠就该出现离群值，没有。

再查指令数。callgrind 实测 gcc -O2 单次执行 16.71 M 条指令，IPC 约 3.8，对简单整数的短依赖链算合理。如果 gcc 跨 `printf` 把两次 fib 调用合并了，每轮指令增量会减半，实测每轮恒为 16.71 M。

最后拆开计时：fib 部分 P50 0.84 ms 加循环部分 0.30 ms 约 1.13 ms，跟整体 1.47 ms 对得上。

三条都指向同一处。计时数字是成立的，矛盾出在 gcc -O2 把 fib 深度自内联了：1,664,079 次"逻辑调用"里只有 91,759 次真实 call，两个独立实测互相印证，gdb 断点在 warmup+1 个 RUN 上命中 183,519，除以 2 次顶层执行得 91,759，callgrind 调用图上 fib 与内联克隆体 fib'2 的入口合计同为 183,519。按真实 call 折算，fib 部分 0.84 ms / 91,759 ≈ 9.2 ns 一次真实调用。

计时数字没错，错的是我对"调用次数"的理解。

这条修正影响的不只是基线本身。原生基线执行的动态指令量，远少于 wasm 路径在同语义下的指令量，"1757×"里有一部分是代码形态差异，不全由解释器和桥接调用的运行时代价构成。下面的乘积分解已经把这一点计入引擎因子的分母一侧，数字不用改，但要按因子乘积来读。

### 把总倍数拆成两个因子

方法很朴素。先取一份与基准完全同算法的干净对照 wasm（纯 i64 指令、无 NaN-box、零 `rt.*` 导入，手工书写），跑在同一台 WAMR 上（A′）和 node V8 上（B′），于是总倍数可以写成两个因子的乘积：

$$\text{总倍数} = \underbrace{\frac{\text{干净 wasm} \times \text{引擎}}{\text{原生}}}_{\text{引擎因子}} \times \underbrace{\frac{\text{perry wasm} \times \text{引擎}}{\text{干净 wasm} \times \text{引擎}}}_{\text{codegen 因子}}$$

两个因子相乘必须还原出实测总倍数，还原不出来就说明还有第三个成分没识别出来。这是硬约束，过不了就是方法有问题。再换一个引擎重跑一遍，两个因子都该保持可解释，否则结论只对 WAMR 成立。

A 路（解释器）分解，全部实测：

| 成分 | 倍数 | 证据 |
|---|---:|---|
| WAMR FAST_INTERP vs 原生（干净代码下） | ~35× | A′ 干净 wasm 50.8 ms ÷ 同形原生 1.47 ms |
| perry codegen 差 + rt 桥接实现 vs 干净 wasm | ~49× | A 2470.678 ms ÷ A′ 50.8 ms |
| **乘积闭合校验** | 34.6×48.6 ≈ **1682** vs 实测 1757（误差 4.3%） | 闭合 ✓ |

E 路（AOT）分解，全部实测：

| 成分 | 倍数 | 证据 |
|---|---:|---|
| WAMR AOT vs 原生（干净代码下） | **~0.97×**（与原生同速） | E′ 干净 wasm 1.362 ms ÷ 原生 1.406 ms |
| perry codegen 差 + rt 桥接实现 | **~108×** | E 146.829 ms ÷ E′ 1.362 ms |
| **乘积闭合校验** | 0.97×108 ≈ **105** vs 实测 104.4（误差 <1%） | 闭合 ✓ |

两张表并排看，第一条就说明引擎因子归零：干净 wasm 在 WAMR AOT 下和 `gcc -O2` 原生同速（0.97×），解释器那 35× 是纯引擎开销，跟 perry 没关系。

还有个意外。E 路 146.8 ms 比 B 路（V8 加 JS 宿主层）的 1280 ms 快 8.7 倍。同一份 perry wasm，WAMR AOT 配 wasm 运行时桥接，比 V8 配 JS 宿主桥接快一个数量级。

perry 的定位也清楚了：换到 AOT 之后，perry wasm 路和 perry 原生路差约 23 倍（解释器下是 393 倍），而这 23 倍几乎全在 codegen 的桥接调用形态上，引擎已经归零。

引擎查清了。那 23 倍到底是什么，还得再切一刀。

### 隔离实验：25.4 ns/次的桥接调用

乘积分解给出了因子，"codegen 因子 108×"却还是个黑箱。于是做了一组第一性原理隔离实验：

| 变体 | 构造 | P50 |
|---|---|---:|
| `nohost` 直接调用版 | 与 perry fib 完全相同的调用图（每层 2 次跨模块调用），被调方是平凡 wasm 函数 | **1.371 ms** |
| `nohost_box` 版 | 同上，但用 `call_indirect` 防内联，被调方做最小的 NaN-box i64↔f64 往返 | **5.913 ms** |
| rt 侧 `mem_call` 函数体 | 余项 | 135.5 ms |
| **合计** | | **141.4 ms**，闭合 ✓ |

先看调用图。和 perry 完全相同的调用图，配上一个空壳被调方，AOT 编译器把它整个内联吸收，1.371 ms 和 fib 纯机器码的 1.309 ms 基本相等，调用图形态本身不是瓶颈。

再看最保守的情况。哪怕强制走"不可内联的间接调用加 NaN-box 往返"，也只到 5.9 ms。

剩下的 141.4 减 5.9 等于 135.5 ms，全是 rt 侧 `mem_call` 函数体的执行成本：NaN-box 解码、nameId 直查、tag 分派、f64 算术、编码。折算每次桥接调用约 25.4 ns，NaN-box 往返约 1.4 ns。rt 侧代码在合并后也进机器码，占 E 的 95.8%。

### QuickJS 反超

分析结论得在别的引擎上复现，否则排除不掉"WAMR 特有现象"这种可能。

V8 那边，`node --no-liftoff` 强制 TurboFan 全优化，稳态 3.400 ms，引擎因子修正为 2.5×；纯 Liftoff baseline 是 9.482 ms。

最硬的一条来自 QuickJS。一个纯解释器跑 JS，fib 每层 37 ns，比 WAMR AOT 执行 perry 包装的字节码还快，后者每层 2 次桥接调用 × 26.8 ns 加 fib 本体约 55 ns。QuickJS 是"没有桥接调用的慢解释器"，E 是"带桥接调用的机器码"，桥接那 25.4 ns 已经超过 QuickJS 解释一层 fib 除调用外的全部开销。

干净 wasm 在 AOT 下和手写 C 同速，引擎本身没问题。

三个引擎、三条实现路径指向同一处：perry wasm codegen 的类型擦除，把 `+` 和条件判定改写成跨边界的桥接调用，而不是内联成算术指令。

## 修：两种改法，从 7.3× 到 31.4×

### 哪些是缺陷，哪些本来就该走桥接

不是所有桥接调用都是缺陷。用反汇编和上游 codegen 源码双重证实：

| 操作 | 路径 |
|---|---|
| `+`（js_add） | **走桥接路径**（`mem_call`），注释 "handles string+number etc." |
| `-` `*` `/` | **内联** f64.sub/mul/div |
| `<` `<=` `>` `>=` | **内联** f64.lt/le/gt/ge |
| if/while/for 条件 | **走桥接路径**（`mem_call_i32`，is_truthy） |
| `===` / `==` | 走桥接路径（js_strict_eq） |
| 字符串操作、console | 走桥接路径（**本来就必须**） |

bench 热路径的 2 次/层桥接调用就是 `js_add`（加法）加 `is_truthy`（条件判定），不是全部算术。判断这是"值模型的必然"还是"可修复的缺陷"，三条线索都指向后者。

wasm codegen 的 `Cargo.toml` 只依赖 perry-hir / perry-codegen-js / perry-dispatch，根本不依赖类型化的 LLVM codegen，而类型化 ABI、i32 快路径、`Type::Int32` 消费全在原生后端。

HIR 那边类型基础设施是齐的。`perry-hir/src/types.rs` 定义了 `Int32`（注释写着 "optimization for known integers"），有完整的值类型推断。TS 是静态类型语言，`let sum = 0; sum += i` 的类型完全能静态获知。

int32 快路径的编码同样有解码路径，wasm 后端却从不发射。`PERRY_BOX_INT32`（`0x7FFE`）在 ABI、runtime、JS 宿主三处都有解码，wasm emit 全目录 grep `0x7FFE` 零命中。

所以我的判断很明确：codegen 没做类型特化与内联，这就是缺陷。同一个编译器家族的原生后端已经实现了同等特化，wasm 后端这块是功能缺口。真正属于统一设计的只有一条，所有用户值一律 NaN-box 成 f64 位模式，这个保守值模型本身没错。

正式 rt 的 `invoke()` 原本对 10 项 `BRIDGES` 逐项 memcmp，而 nameId 本来就是稳定整数索引。先做一个 rt 侧的最小优化，加 `NAME_CACHE` 缓存直查快路径，A 路从 4009.746 ms 降到 2470.678 ms（−38%），codegen 因子从 79× 降到约 49×，产物 16798 → 16928 B。这是桥接实现本身的低效，跟 codegen 缺陷是两码事。

### 先试现成工具：wasm-opt

对合并产物跑 binaryen `wasm-opt`，最优组合（`--inlining-optimizing --always-inline-max-function-size=5000 --precompute-propagate --dce`）把 E 从 122.112 ms 降到 93.497 ms（−23%）。`wasm-dis` 确认整条 `mem_call` + `invoke` 被强制内联进 fib/loop，字面 nameId/argCount 的常量传播成功。

但内联体里仍残留 11 路 `br_table`，索引来自 `NAME_CACHE` 的运行时内存 load。binaryen 没有内存常量传播，内存内容要到运行时才确定，switch 就消不掉。纯后处理能把 E 降到约 93 ms，内联下来的只是整段搬进来的大 switch 分派代码，到不了特化的量级。

### 先测天花板：手工特化

不真改上游，对 perry 原样字节码做等价手工特化，替换的正是 codegen 类型特化会发射的指令，先看天花板在哪：

| 变体 | 改动 | P50 |
|---|---|---:|
| E（perry 原样） | — | 122.112 ms |
| **B1** | 热路径 `+` 内联 `f64.add`，`is_truthy` 仍走桥接 | 71.612 ms |
| **B2** | B1 + `is_truthy` 内联为 `i64.ne` 与包装假值的比较 | **17.185 ms**（快 7.1×） |
| V3 | 纯 f64：无包装的表示、无影子栈、全内联 | 3.325 ms |
| E′ | clean_bench（纯 i64，同批） | 1.216 ms |

B2 的乘积分解：E 减 B2 约 105 ms 是桥接调用本体（4.16 M 次 × 25.4 ns/次 ≈ 106 ms），类型特化把这部分全部消除；B2 减 E′ 约 16 ms 是 perry 的影子栈内存访问纪律，每个值经 global sp 存/取内存，fib 每层约 20 条辅助指令。这不是 NaN-box 的开销，reinterpret 对在机器码层面是空操作，box 本身近零成本；16 ms 是"值经内存而非寄存器存取"的调用纪律成本。

但 B2 能成，靠的是人手看过 `src/bench.ts`、知道那里是 number，这份类型知识在 perry 产物里已被 codegen 擦除，所以 B2 只是上界估计器，不是可用修复。

### 一个能自己恢复类型的 pass

不改上游就没法改发射点，那就写一个通用后处理 pass，约 800 行 JS，wat→wat，让它自己从模块里恢复类型信息。pass 的值域有三格：`NUM`（原始 f64 位模式 = JS number）/ `BOOLBOX`（`TAG_TRUE`/`TAG_FALSE` 二值包装的布尔）/ `OTHER`。抽象解释在每个函数内按语句顺序走，控制流合并取保守并。两处改写都与 rt 侧实现逐位等价：

```wat
;; js_add（nameId 8, argc 2）
(drop (call $mem_call (f64.const 8) (f64.const 2) BASE))
→ (i64.store BASE (i64.reinterpret_f64 (f64.add
     (f64.reinterpret_i64 (i64.load BASE))
     (f64.reinterpret_i64 (i64.load (BASE+8))))))

;; is_truthy（nameId 12, argc 1）
(call $mem_call_i32 (f64.const 12) (f64.const 1) BASE)
→ (i64.ne (i64.load BASE) (i64.const TAG_FALSE))
```

number 条件要保守回退：JS truthiness 里 `0`/`-0`/`NaN` 均 falsy，不是二值的，不内联，仍经由桥接调用。其余桥接调用（`console_log`、`string_concat`、`string_len`、`js_strict_eq` 等）一律不动。

泛化验证用 4 个程序 × 7 个变体：bench（纯 number 热循环）、probe_str（字符串密集）、probe_mixed（混合类型）、probe_nested（跨函数）。正确性 28/28 逐字节一致，误判清单为空。性能：

| 程序 | base | pass | pass+wasmopt |
|---|---:|---:|---:|
| bench | 123.098 | **16.958**（快 7.3×） | 16.034 |
| probe_str | 30.297 | **14.942**（快 2.0×） | 10.213 |
| probe_mixed | 21.261 | **5.918**（快 3.6×） | 4.421 |
| probe_nested | 0.521 | **0.280**（快 1.9×） | 0.236 |

probe_nested 的保守结果和 `--closed-world` 差 6.4 倍（0.280 vs 0.044 ms），差距全部来自"导出函数参数是否可当 number"。这就是这套方法的天花板：perry 把每个用户函数都导出（`__wasm_func_N`），保守模式没法排除"宿主用字符串调它"，于是 `dbl(n) { return n + n }` 的参数不可证；合并后的 AOT 模块实际是封闭世界，只有 `_start` 一个入口，显式声明之后跨函数推断全部贯通。类型知识在模块里不可恢复时，pass 只能保守拒绝，而防护规则保证了误判不会静默发生。

### 上游 patch：从源头改发射点

后处理 pass 解决的是"不能改上游时怎么办"，它有个绕不开的缺陷：依赖 perry 产物的指令形态，perry 一升级 codegen 就可能失配。真正的修复在源头。

patch 的对象是 vendored perry，目标是 `crates/perry-codegen-wasm`（无 LLVM 依赖），diff 规模 6 文件 / +487 −20。新增一份保守类型事实（419 行），收集声明类型加轻量数据流，提供 `expr_is_number` / `expr_is_boolean`；然后改两个发射点：

```rust
// 1. 加法（BinaryOp::Add）
if self.expr_is_number(left) && self.expr_is_number(right) {
    self.emit_expr(func, left);   F64ReinterpretI64;
    self.emit_expr(func, right);  F64ReinterpretI64;
    F64Add; I64ReinterpretF64;
} else { /* 原 emit_frame_begin(2) + store_arg×2 + emit_memcall("js_add", 2) */ }

// 2. 条件（if / while / do-while / for 4 处）
if self.expr_is_boolean(condition) {
    self.emit_expr(func, condition);          // 栈上盒布尔 i64
    I64Const(TAG_FALSE); I64Ne;               // → i32
} else { /* 原 emit_frame_begin(1) + store_arg + emit_memcall_i32("is_truthy", 1) */ }
```

等价性可以逐位论证：perry 的 number 表示就是裸 f64 位模式，若运行时两侧确为 number，`js_add(Num(a), Num(b))` 返回 `Num(a+b)`，与内联的 `i64.reinterpret_f64(f64.add(...))` 逐位相同（含 NaN/±0/Inf 传播）；影子栈方面，原路径 sp 净增减为 0，特化路径完全不触及 sp，净效果一致。字符串分支只有两侧都可证 number 才内联，`string + anything` 恒经原桥接调用，JS `+` 的字符串拼接语义保留。不可证的地方一律回退：字符串 `+`、number 条件、`Mod`/`Pow`、`Eq`/`Ne`、闭包捕获。

结果（同口径，12 轮弃第 1 轮取 11 样本中位数）：

| 变体 | P50 | 相对 E |
|---|---:|---:|
| E（perry 原样） | 122.112 ms | 1× |
| **patch 后（codegen 特化）** | **3.891 ms**（min 3.673 / max 4.009） | **0.0319×（快 31.4×）** |
| B2（等价手工特化） | 17.185 ms | 0.141× |
| V3（无包装的表示） | 3.325 ms | 0.027× |
| E′（clean i64） | 1.216 ms | 0.010× |

正确性：`fib(29) = 514229`、`sum = 499999500000`，`./demo.sh` 6/6 PASS，3 个泛化探针经完整 E 路输出与参照逐字节一致。反汇编证据：`call $mem_call` 8 → 6，`call $mem_call_i32` 2 → 0，`f64.add` 0 → 3，`i64.ne` 0 → 2。剩下 6 处 `mem_call` 全是字符串拼接（`"fib(" + … + ") = " + f` 这类），正符合"可证 number 才内联"的设计边界。

上游 patch 反而比手工特化快 4.4 倍。B2 的手工替换只改了 `mem_call` 调用本身，外围的帧建立与影子栈内存槽往返指令原样保留；codegen 发射点特化则让整条帧建立与内存槽往返都不再发射，产物更紧凑，AOT 后端因此能更好地优化。patch 产物因此跨过 B2 天花板 17.185 ms，逼近 V3 的 3.325 ms。这条因果解释属推断。

### 两个数不在同一根线上

标题里那两个数，1757 倍和 31.4 倍，不能相除。

1757× 是解释器（A 路）下 perry wasm 相对手写 C 原生的总倍数，混着引擎开销和 codegen 缺陷；31.4× 是 AOT（E 路）下 patch 后相对 perry 原样 codegen 的提速，只发生在引擎开销已经归零的 AOT 上，消的是 codegen 缺陷那一半。`1757 ÷ 31.4 ≈ 56` 是错的算法。

修复后 3.891 ms 到底什么水平，放回坐标里看：

| 对照 | 时间 | 慢多少 |
|---|---:|---:|
| 手写 C 原生 | 1.406 ms | 慢 2.8× |
| 干净 i64 wasm（同批） | 1.216 ms | 慢 3.2× |
| perry 原生（纯执行） | 1.6–2.6 ms | **基本同速**，慢 1.5–2.4× |
| 无包装的表示上界 V3 | 3.325 ms | 只差 1.17× |

patch 之后，perry wasm 已经和 perry 原生基本同速，相对手写 C 只慢 2.8 倍。剩下的差距全是影子栈内存访问纪律，每个值经 global sp 存/取内存，fib 每层约 20 条辅助指令，不是 NaN-box 本身，reinterpret 对在机器码层面是空操作，box 近零成本。这一块在 paper 第 7.3 章"typed ABI 化"的"阶段 4 去影子栈"里有明确的计划，预计 3.3–5.0 ms。剩下的这 2.8 倍有明确的去处，不是黑箱。

### 两条路的取舍

| 手段 | 实测 P50 | vs E | 零上游依赖 | 风险 |
|---|---:|---:|---|---|
| E：perry 原样 | 123.098 | 1× | 是 | — |
| wasm-opt 强内联 | 93.497 | 0.76× | 是 | 低（体积 74 KB → 1.35 MB aot） |
| **通用桥内联 pass** | **16.958** | **0.138×（快 7.3×）** | 是 | 中：依赖产物指令形态，perry 升级即失配 |
| B2：等价手工特化 | 17.185 | 0.141× | 是（不可复用） | 上界估计器 |
| **上游 patch** | **3.891** | **0.0319×（快 31.4×）** | 否 | 见下文缺口 |

不改上游，能把 122 ms 压到 20 ms 以内（16.0–17.0 ms，也就是 B2 上界水平），最省事的做法是单个 wat→wat 后处理 pass，构建链只多一行命令；代价是约 10 小时的一次性投入，外加随 perry 版本回归的风险。改了上游直接到 3.891 ms，这时候后处理 pass 可以整体退役，codegen 发射点特化是源头修，产物更紧。

## 结论与边界

回到开头那两个问题：这条路可行不可行，慢不慢。它们可以分开测。代价能拆成引擎和 codegen 两部分，换到 AOT 之后引擎那部分归零，剩下的几乎全在 codegen 产出的指令形态上。WebAssembly 查过了，引擎也查过了，都没问题；出问题的是编译器发射指令的那一步。

三件事分开说：

1. 能跑。perry 的 Rust 运行时编成 wasm 模块，与业务模块经 WAMR 多模块链接，宿主只剩 WASI 的一个调用（`fd_write`）。`rt.*` 的调用约定、业务代码、codegen 均未改动，6/6 步通过，输出与 perry 官方 JS 宿主层逐字节一致。源码保护大体成立：产物无 name 段，泄漏的是字符串字面量与导入名，门槛从"打开源码"抬到"反编译一遍再读"。
2. 慢在哪。总倍数必须读作两个因子的乘积：解释器下 1757× = 引擎因子 34.6× × codegen 因子 48.6×（闭合误差 4.3%）；换 AOT 引擎后 104× = 0.97× × 108×（闭合误差 <1%），引擎因子在 AOT 下归零。问题出在 perry wasm codegen 的类型擦除，可内联的 `+` 与条件判定被改写为跨边界桥接调用，桥接函数体占 AOT 方法耗时的 95.8%，每次 25.4 ns。三处独立证据支持：隔离实验、V8 TurboFan、QuickJS 反超。
3. 能修。零上游依赖的 wat 后处理 pass 把 bench 从 123.1 ms 降到 16.9 ms（快 7.3×），4 程序 × 7 变体共 28 次逐字节一致、零误判；上游 patch 改两个发射点并加一份保守类型事实，把 122.112 ms 降到 3.891 ms（快 31.4×），跨过手工特化上界，逼近无包装的表示的 3.325 ms。

边界要交代清楚：

- 性能结论建立在单个基准上（`fib(29)` + 10⁶ 次求和循环），是调用密集的最坏情形，把所有"倍数"都放到最大。这些倍数都该读作这一形态下的倍数，不是 wasm 路线的普遍性能。
- 运行时只覆盖语言的一个子集。13 个实现覆盖字符串、number/bool、console 与动态分派，对象、数组、闭包、类一概没有。补齐的量级不是"再加几十个函数"，而是等于重写 `perry-runtime`。适合这套方案的是宿主可控、语言子集可裁剪的场景，比如嵌入式规则脚本、计算密集的插件、既不想源码外流又不想放弃 TS 写法的内部交付。
- perry 上游在快速迭代，行号与内部结构都在变动。patch 目标锚定在 commit `87ecb02b`；移植到上游 main 有冲突但可手工解决，且确认上游没有自己做同样的特化，需要主动提 PR。自写类型推断（419 行）应该换成消费 `perry-hir` 现成的 `HirTypeEnv`/`infer_expr_type`，那是长期形态，patch 的价值在于快速验证收益。

方法论上改动最小、影响却最大的一步是审计自己的基线。面对"1.471 ms 物理上不可能"的质疑，光复测一遍没用，得查清 1,664,079 次逻辑调用里其实只有 91,759 次真实 call，gdb 断点与 callgrind 双证。数字一个没改，改的是 1757× 的解释方式：基准里写的"调用次数"，未必是硬件看到的调用次数。

## 上游项目

- [PerryTS/perry](https://github.com/PerryTS/perry) — perry 编译器（Rust，SWC + LLVM），patch 目标 commit `87ecb02b`
- [fn-a/typerry](https://github.com/fn-a/typerry) — perry wasm 后端的 npm 包 `@typerry/node`
- [bytecodealliance/wasm-micro-runtime](https://github.com/bytecodealliance/wasm-micro-runtime) — WAMR 2.4.3，多模块链接、AOT（`wamrc`）与 `fd_write` 支持
- Bellard QuickJS、binaryen（`wasm-opt`/`wasm-merge`/`wasm-dis`）、WABT（`wasm2wat`/`wat2wasm`/`wasm-as`）
