---
title: 使用 AI 编写 Python 流体仿真代码
description: 使用 Claude Code AI 辅助编写 Python 流体仿真代码实战
category: 技术探索
tags: [流体仿真, Claude Code, Python, AI编程]
recommend: false
date: 2026-06-09
series:
  - id: series-fluid-simulation
    name: 流体仿真系列
    order: 3
    prev: /posts/流体仿真入门
    next:
---

# 使用 AI 编写 Python 流体仿真代码

## 前言

流体仿真代码通常绕不开复杂的偏微分方程、数值方法和边界条件，对数学功底和编程能力都不算友好。AI 编程助手的好处在于——你不必从零推导离散化格式，也不必一个人对着数值不稳定的 bug 干瞪眼，它可以帮你搭代码框架、解释物理原理、定位错误、优化性能。

Claude Code 是终端原生的 AI 编程工具，做科学计算项目挺合适。它能直接读你的项目文件、跑代码、看输出，凑成一个"编写—运行—调试"的闭环。下面分享用它写 Python 流体仿真代码的完整工作流，并用一个 2D 流体求解器的实战案例走一遍具体操作。

## 使用 Claude Code 编写流体仿真代码的工作流

### 创建项目结构

在动手编码前，先用 CLAUDE.md 文件写清项目背景和目标。Claude Code 启动时会自动读这个文件，借此理解你的项目上下文。

```bash
mkdir fluid-sim && cd fluid-sim
```

创建 CLAUDE.md：

```markdown
# 流体仿真项目

## 目标
使用 Python 实现基于格子玻尔兹曼方法（LBM）的 2D 流体仿真求解器。

## 技术栈
- Python 3.10+
- NumPy（数值计算）
- Matplotlib（可视化）

## 物理模型
- D2Q9 格子玻尔兹曼方法
- BGK 碰撞算子
- 顶盖驱动腔体流动（lid-driven cavity）

## 项目结构
- solver.py：核心求解器
- visualize.py：可视化模块
- main.py：入口脚本
```

有了这个文件，Claude Code 在后续交互里就能明白你的物理模型选择和代码组织方式，生成的代码也更有的放矢。

### 逐步构建仿真求解器

别指望一次让 AI 把全部代码吐出来。科学计算项目适合分步走：先实现核心算法，再加边界条件，最后做可视化和优化。每一步都跑一遍验证，确认没问题再往下。

### 使用 Claude Code 调试和优化代码

仿真结果不对时，直接把报错信息或异常现象描述给 Claude Code。它能帮你分析数值不稳定的成因（比如松弛参数超出范围、边界条件写错了），并给出修复建议。性能上，它也能找出 NumPy 代码里的瓶颈，建议向量化改写或上 Numba 加速。

## 实战示例：使用 Claude Code 从零开始编写一个 2D 流体求解器

下面演示用 Claude Code 分步搭一个基于 D2Q9 格子玻尔兹曼方法的顶盖驱动腔体流动求解器。

### 步骤1：描述需求让 Claude Code 生成初始代码框架

在 Claude Code 中输入：

```
请帮我创建 solver.py，实现 D2Q9 格子玻尔兹曼方法的核心数据结构：
- 定义 D2Q9 的 9 个离散速度方向和对应权重
- 实现分布函数的初始化（平衡态分布）
- 实现 BGK 碰撞步骤
- 实现流动步骤（streaming）
```

Claude Code 会生成类似如下的代码：

```python
import numpy as np

# D2Q9 离散速度方向
#   6 2 5
#   3 0 1
#   7 4 8
e = np.array([
    [0, 0],   # 0: 静止
    [1, 0],   # 1: 右
    [0, 1],   # 2: 上
    [-1, 0],  # 3: 左
    [0, -1],  # 4: 下
    [1, 1],   # 5: 右上
    [-1, 1],  # 6: 左上
    [-1, -1], # 7: 左下
    [1, -1],  # 8: 右下
])

# D2Q9 权重
w = np.array([
    4/9,      # 0: 静止
    1/9, 1/9, 1/9, 1/9,  # 1-4: 轴向
    1/36, 1/36, 1/36, 1/36  # 5-8: 对角
])

# 反方向索引（用于 bounce-back 边界条件）
opp = np.array([0, 3, 4, 1, 2, 7, 8, 5, 6])


class LBMSolver:
    def __init__(self, nx: int, ny: int, tau: float):
        """
        D2Q9 LBM 求解器

        Args:
            nx: x 方向格子数
            ny: y 方向格子数
            tau: 松弛时间（控制粘度，nu = (tau - 0.5) / 3）
        """
        self.nx = nx
        self.ny = ny
        self.tau = tau
        self.nu = (tau - 0.5) / 3.0

        # 分布函数：shape = (9, ny, nx)
        self.f = np.zeros((9, ny, nx))
        # 宏观量
        self.rho = np.ones((ny, nx))
        self.ux = np.zeros((ny, nx))
        self.uy = np.zeros((ny, nx))

        # 初始化为平衡态
        self._init_equilibrium()

    def _init_equilibrium(self):
        """将分布函数初始化为平衡态（速度为零、密度为1）"""
        for i in range(9):
            self.f[i] = self._feq(i, self.rho, self.ux, self.uy)

    def _feq(self, i: int, rho: np.ndarray, ux: np.ndarray, uy: np.ndarray) -> np.ndarray:
        """计算第 i 个方向的平衡态分布函数"""
        eu = e[i, 0] * ux + e[i, 1] * uy  # e_i · u
        usq = ux ** 2 + uy ** 2              # |u|^2
        return w[i] * rho * (1.0 + 3.0 * eu + 4.5 * eu ** 2 - 1.5 * usq)

    def compute_macroscopic(self):
        """从分布函数计算宏观密度和速度"""
        self.rho = np.sum(self.f, axis=0)
        self.ux = np.sum(self.f * e[:, 0, np.newaxis, np.newaxis], axis=0) / self.rho
        self.uy = np.sum(self.f * e[:, 1, np.newaxis, np.newaxis], axis=0) / self.rho

    def collide(self):
        """BGK 碰撞步骤"""
        feq = np.zeros_like(self.f)
        for i in range(9):
            feq[i] = self._feq(i, self.rho, self.ux, self.uy)
        self.f += -(1.0 / self.tau) * (self.f - feq)

    def stream(self):
        """流动步骤：将分布函数沿各自方向移动一格"""
        for i in range(9):
            self.f[i] = np.roll(self.f[i], e[i, 0], axis=1)
            self.f[i] = np.roll(self.f[i], e[i, 1], axis=0)
```

### 步骤2：逐步完善求解器

初始框架缺少边界条件。继续让 Claude Code 补充：

```
请为 solver.py 添加顶盖驱动腔体的边界条件：
- 四面墙壁使用 bounce-back（无滑移）边界条件
- 顶盖（y=ny-1）以速度 u_lid 向右移动
- 添加 step() 方法整合碰撞、流动和边界条件
```

Claude Code 会在类中添加边界条件处理和步进方法：

```python
def apply_boundary(self, u_lid: float):
    """应用顶盖驱动腔体边界条件"""
    # 保存流动后的分布函数（用于 bounce-back）
    f_pre = self.f.copy()

    # 四面墙壁 bounce-back
    # 底壁 (y=0)
    for i in [2, 5, 6]:  # 指向y正方向的方向
        self.f[i, 0, :] = f_pre[opp[i], 0, :]

    # 顶壁 (y=ny-1)：顶盖移动，使用修正的 bounce-back
    for i in [4, 7, 8]:  # 指向y负方向的方向
        self.f[i, -1, :] = f_pre[opp[i], -1, :] - 2.0 * w[opp[i]] * 3.0 * e[opp[i], 0] * u_lid * self.rho[-1, :]

    # 左壁 (x=0)
    for i in [1, 5, 8]:  # 指向x正方向的方向
        self.f[i, :, 0] = f_pre[opp[i], :, 0]

    # 右壁 (x=nx-1)
    for i in [3, 6, 7]:  # 指向x负方向的方向
        self.f[i, :, -1] = f_pre[opp[i], :, -1]

def step(self, u_lid: float):
    """执行一个完整的 LBM 时间步"""
    self.compute_macroscopic()
    self.collide()
    self.stream()
    self.apply_boundary(u_lid)
```

### 步骤3：可视化结果

让 Claude Code 生成可视化脚本：

```
请创建 visualize.py，实现以下可视化功能：
- 绘制速度场的矢量图和大小云图
- 绘制中心线速度剖面（与 Ghia 等人的基准数据对比）
- 保存为 PNG 文件
```

生成的可视化代码：

```python
import numpy as np
import matplotlib.pyplot as plt


def plot_velocity_magnitude(solver, save_path: str = "velocity_magnitude.png"):
    """绘制速度大小云图和矢量图"""
    fig, ax = plt.subplots(figsize=(8, 8))

    speed = np.sqrt(solver.ux ** 2 + solver.uy ** 2)
    im = ax.imshow(speed, origin="lower", cmap="jet", extent=[0, solver.nx, 0, solver.ny])
    plt.colorbar(im, ax=ax, label="|u|")

    # 矢量图（稀疏采样）
    skip = max(solver.nx // 20, 1)
    x = np.arange(0, solver.nx, skip)
    y = np.arange(0, solver.ny, skip)
    X, Y = np.meshgrid(x, y)
    ax.quiver(X, Y, solver.ux[::skip, ::skip], solver.uy[::skip, ::skip],
              color="white", scale=None, alpha=0.7)

    ax.set_title("Velocity Magnitude & Vectors")
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    plt.savefig(save_path, dpi=150, bbox_inches="tight")
    plt.close()


def plot_centerline_profile(solver, u_lid: float, save_path: str = "centerline_profile.png"):
    """绘制竖直中心线上的 ux 剖面"""
    fig, ax = plt.subplots(figsize=(6, 8))

    mid_x = solver.nx // 2
    ux_profile = solver.ux[:, mid_x] / u_lid
    y_norm = np.linspace(0, 1, solver.ny)

    # Ghia et al. (1982) 基准数据 (Re=100)
    y_ghia = [0.0, 0.0547, 0.0625, 0.1016, 0.1719, 0.2813,
              0.4531, 0.5, 0.6172, 0.7344, 0.8281, 0.8906,
              0.9375, 0.9453, 1.0]
    u_ghia = [0.0, -0.03717, -0.04119, -0.06436, -0.08081, -0.08420,
              0.01374, 0.05702, 0.14563, 0.25812, 0.38569, 0.50267,
              0.63356, 0.65590, 1.0]

    ax.plot(ux_profile, y_norm, "b-", linewidth=2, label="LBM")
    ax.plot(u_ghia, y_ghia, "ro", markersize=4, label="Ghia et al. (Re=100)")
    ax.set_xlabel("u_x / u_lid")
    ax.set_ylabel("y / L")
    ax.set_title("Centerline Velocity Profile")
    ax.legend()
    ax.grid(True, alpha=0.3)
    plt.savefig(save_path, dpi=150, bbox_inches="tight")
    plt.close()
```

然后创建主入口脚本 main.py：

```python
from solver import LBMSolver
from visualize import plot_velocity_magnitude, plot_centerline_profile


def main():
    # 参数设置
    nx, ny = 100, 100
    u_lid = 0.1
    Re = 100
    nu = u_lid * ny / Re
    tau = 3.0 * nu + 0.5

    print(f"网格: {nx}x{ny}, Re={Re}, tau={tau:.4f}, nu={nu:.6f}")

    solver = LBMSolver(nx, ny, tau)

    # 运行仿真
    n_steps = 10000
    for step in range(n_steps):
        solver.step(u_lid)
        if step % 1000 == 0:
            speed = (solver.ux ** 2 + solver.uy ** 2).max() ** 0.5
            print(f"Step {step}/{n_steps}, max speed = {speed:.6f}")

    # 可视化
    plot_velocity_magnitude(solver, "velocity_magnitude.png")
    plot_centerline_profile(solver, u_lid, "centerline_profile.png")
    print("结果已保存")


if __name__ == "__main__":
    main()
```

运行仿真：

```bash
python main.py
```

### 步骤4：性能优化

原始实现用 Python 循环处理碰撞和流动，跑得慢。让 Claude Code 优化一下：

```
solver.py 中的 collide() 和 stream() 使用了 Python 循环，性能较差。
请用 NumPy 向量化重写这两个方法，消除所有 for 循环。
```

优化后的关键方法：

```python
def collide(self):
    """BGK 碰撞步骤（向量化版本）"""
    feq = np.zeros_like(self.f)
    for i in range(9):
        eu = e[i, 0] * self.ux + e[i, 1] * self.uy
        usq = self.ux ** 2 + self.uy ** 2
        feq[i] = w[i] * self.rho * (1.0 + 3.0 * eu + 4.5 * eu ** 2 - 1.5 * usq)
    self.f += -(1.0 / self.tau) * (self.f - feq)

def stream(self):
    """流动步骤（向量化版本）"""
    for i in range(9):
        self.f[i] = np.roll(self.f[i], e[i, 0], axis=1)
        self.f[i] = np.roll(self.f[i], e[i, 1], axis=0)
```

想再快一点，可以让 Claude Code 加上 Numba JIT 编译：

```python
from numba import njit

@njit
def collide_numba(f, rho, ux, uy, tau):
    """Numba 加速的碰撞步骤"""
    ny, nx = rho.shape
    for j in range(ny):
        for i in range(nx):
            for k in range(9):
                eu = e[k, 0] * ux[j, i] + e[k, 1] * uy[j, i]
                usq = ux[j, i] ** 2 + uy[j, i] ** 2
                feq = w[k] * rho[j, i] * (1.0 + 3.0 * eu + 4.5 * eu ** 2 - 1.5 * usq)
                f[k, j, i] += -(1.0 / tau) * (f[k, j, i] - feq)
    return f
```

Numba 版本通常能带来 10 到 50 倍的加速，100×100 网格跑 10000 步几秒就完事。

## 使用 Claude Code 的技巧

### 精确描述物理方程和边界条件

AI 不是万能的，描述越模糊，生成的代码越不靠谱。与其说"帮我写一个流体仿真"，不如把话说清楚：

- 使用什么方法（如"格子玻尔兹曼 D2Q9"而非"某种数值方法"）
- 碰撞算子类型（BGK、MRT 等）
- 边界条件的具体实现方式（bounce-back、Zou-He 等）
- 雷诺数和松弛参数的关系

把话说精确，Claude Code 往往一次就能给出能用的代码，省掉反复改的来回。

### 分步骤开发而非一次性生成全部代码

科学计算代码的正确性得一步步验。推荐的顺序是这样：

1. 先实现核心算法并验证守恒律（质量和动量守恒）
2. 添加边界条件并检查边界处的物理行为
3. 加入可视化并与已知基准解对比
4. 最后做性能优化

每一步都跑代码、看结果，确认没问题再往下。一口气生成全部代码，往往会在某一步埋下错误，而事后定位的代价远大于分步验证。

### 让 Claude Code 解释代码原理

当 Claude Code 生成的代码你没完全看懂时，直接问它。比如：

```
请解释顶盖边界条件中这行代码的物理含义：
self.f[i, -1, :] = f_pre[opp[i], -1, :] - 2.0 * w[opp[i]] * 3.0 * e[opp[i], 0] * u_lid * self.rho[-1, :]
```

Claude Code 会讲清 bounce-back 边界条件的推导、修正项从哪来、为什么用 `opp[i]` 方向的权重和速度分量。理解原理比照搬代码重要得多——尤其仿真结果出问题时，懂原理你才排查得了。

## 从 Claude Code 辅助开发到自主开发的过渡

用 AI 辅助开发，目标不是永远靠它，而是借它把学习过程加快。大致可以这样过渡：

1. **初期**：让 Claude Code 生成完整代码，逐行理解每一部分的含义
2. **中期**：自己写出代码框架和关键算法，让 Claude Code 补充细节和边界条件
3. **后期**：独立编写代码，仅在遇到疑难问题时咨询 Claude Code

哪天你能独立判断 Claude Code 生成的代码对不对，说明这块知识你已经拿下了。有个实用的检验办法：等它生成完代码，先别看，自己想一遍怎么实现，再对比。思路一致，就是懂了；如果有出入，就琢磨哪种更好、为什么。

## 拓展方向

2D LBM 求解器跑通之后，还可以接着往这些方向探：

- **3D 仿真**：将 D2Q9 扩展为 D3Q19 或 D3Q27，模拟三维流动问题
- **多松弛时间（MRT）模型**：替代 BGK 碰撞算子，提高数值稳定性
- **多相流**：使用 Shan-Chen 模型或自由能方法模拟气液界面
- **热对流**：耦合温度场，模拟 Rayleigh-Benard 对流
- **湍流模拟**：结合大涡模拟（LES）方法处理高雷诺数流动
- **GPU 加速**：使用 CuPy 或 Taichi 将计算迁移到 GPU，处理更大规模的网格

每个方向都可以套用同一套工作流：先把目标和物理模型写进 CLAUDE.md，再分步让 Claude Code 帮你实现。

## 总结

AI 编程工具把流体仿真代码的开发门槛压低了不少。借 Claude Code，你可以用自然语言描述物理模型，快速搭出代码框架；分步构建、逐步验证，保证每一步站得住；遇到看不懂的代码让它讲原理，加快对数值方法的理解；还能让它找性能瓶颈、做优化。

说到底，关键是三件事：把需求说精确、把结果分步验、把代码原理弄懂。AI 是加速器，不是替代品，真正的工程判断力还得靠实践攒。从简单的 2D 问题起步，再一点点往更复杂的物理模型上够，AI 辅助开发能让这条学习曲线顺不少。
