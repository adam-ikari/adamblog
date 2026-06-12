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

流体仿真代码通常涉及复杂的偏微分方程、数值方法和边界条件处理，对开发者的数学功底和编程能力都有较高要求。AI 编程助手的出现改变了这一局面——你不需要从零推导离散化格式，也不需要独自排查数值不稳定的 bug，AI 可以帮你生成代码框架、解释物理原理、定位错误并优化性能。

Claude Code 作为终端原生的 AI 编程工具，特别适合科学计算项目的开发。它能直接读取你的项目文件、运行代码、查看输出结果，形成一个完整的"编写-运行-调试"闭环。本文将分享使用 Claude Code 编写 Python 流体仿真代码的完整工作流，并通过一个 2D 流体求解器的实战案例演示具体操作。

## 使用 Claude Code 编写流体仿真代码的工作流

### 创建项目结构

在开始编码前，先用 CLAUDE.md 文件描述项目背景和目标。Claude Code 启动时会自动读取这个文件，从而理解你的项目上下文。

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

这样 Claude Code 在后续交互中就能理解你的物理模型选择和代码组织方式，生成的代码会更有针对性。

### 逐步构建仿真求解器

不要一次性让 AI 生成全部代码。科学计算项目适合分步构建：先实现核心算法，再添加边界条件，最后做可视化和优化。每一步都运行验证，确保正确后再进入下一步。

### 使用 Claude Code 调试和优化代码

当仿真结果不符合预期时，直接把错误信息或异常现象描述给 Claude Code。它能分析数值不稳定的原因（如松弛参数超出范围、边界条件实现错误），并给出修复建议。性能优化方面，Claude Code 可以识别 NumPy 代码中的瓶颈，建议向量化改写或使用 Numba 加速。

## 实战示例：使用 Claude Code 从零开始编写一个 2D 流体求解器

下面演示用 Claude Code 逐步构建一个基于 D2Q9 格子玻尔兹曼方法的顶盖驱动腔体流动求解器。

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

原始实现使用 Python 循环处理碰撞和流动，速度较慢。让 Claude Code 进行优化：

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

如果需要进一步加速，可以让 Claude Code 添加 Numba JIT 编译：

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

Numba 版本通常能带来 10-50 倍的加速，使得 100x100 网格的 10000 步仿真在几秒内完成。

## 使用 Claude Code 的技巧

### 精确描述物理方程和边界条件

AI 不是万能的，模糊的描述会产生模糊的代码。与其说"帮我写一个流体仿真"，不如明确指定：

- 使用什么方法（如"格子玻尔兹曼 D2Q9"而非"某种数值方法"）
- 碰撞算子类型（BGK、MRT 等）
- 边界条件的具体实现方式（bounce-back、Zou-He 等）
- 雷诺数和松弛参数的关系

精确的描述让 Claude Code 一次就能生成正确的代码，减少反复修改的次数。

### 分步骤开发而非一次性生成全部代码

科学计算代码的正确性需要逐步验证。推荐的开发顺序：

1. 先实现核心算法并验证守恒律（质量和动量守恒）
2. 添加边界条件并检查边界处的物理行为
3. 加入可视化并与已知基准解对比
4. 最后做性能优化

每一步都运行代码、检查结果，确认无误后再进入下一步。一次性生成全部代码往往会在某一步引入错误，而定位错误的代价远大于分步验证。

### 让 Claude Code 解释代码原理

当 Claude Code 生成的代码你不完全理解时，直接问它。例如：

```
请解释顶盖边界条件中这行代码的物理含义：
self.f[i, -1, :] = f_pre[opp[i], -1, :] - 2.0 * w[opp[i]] * 3.0 * e[opp[i], 0] * u_lid * self.rho[-1, :]
```

Claude Code 会解释 bounce-back 边界条件的推导过程、修正项的来源以及为什么使用 `opp[i]` 方向的权重和速度分量。理解原理比盲目使用代码更重要，尤其是当仿真结果异常时，理解原理才能有效排查问题。

## 从 Claude Code 辅助开发到自主开发的过渡

AI 辅助开发的目标不是永远依赖 AI，而是加速学习过程。建议的过渡路径：

1. **初期**：让 Claude Code 生成完整代码，逐行理解每一部分的含义
2. **中期**：自己写出代码框架和关键算法，让 Claude Code 补充细节和边界条件
3. **后期**：独立编写代码，仅在遇到疑难问题时咨询 Claude Code

当你能独立判断 Claude Code 生成的代码是否正确时，说明你已经掌握了相关知识。一个实用的检验方法：在 Claude Code 生成代码后，先不看代码，自己思考实现方案，然后对比两者。如果思路一致，说明理解到位；如果有差异，深入分析哪种方案更优以及为什么。

## 拓展方向

掌握 2D LBM 求解器后，可以继续探索：

- **3D 仿真**：将 D2Q9 扩展为 D3Q19 或 D3Q27，模拟三维流动问题
- **多松弛时间（MRT）模型**：替代 BGK 碰撞算子，提高数值稳定性
- **多相流**：使用 Shan-Chen 模型或自由能方法模拟气液界面
- **热对流**：耦合温度场，模拟 Rayleigh-Benard 对流
- **湍流模拟**：结合大涡模拟（LES）方法处理高雷诺数流动
- **GPU 加速**：使用 CuPy 或 Taichi 将计算迁移到 GPU，处理更大规模的网格

每个方向都可以用同样的工作流：先在 CLAUDE.md 中描述目标和物理模型，然后分步让 Claude Code 辅助实现。

## 总结

AI 编程工具让流体仿真代码的开发门槛大幅降低。通过 Claude Code，你可以：

- 用自然语言描述物理模型，快速生成代码框架
- 分步构建和验证，确保每一步的正确性
- 让 AI 解释代码原理，加速对数值方法的理解
- 识别性能瓶颈并自动优化

关键在于：精确描述需求、分步验证结果、理解代码原理。AI 是加速器而非替代品，真正的工程判断力仍然需要通过实践积累。从简单的 2D 问题开始，逐步挑战更复杂的物理模型，AI 辅助开发会让你的学习曲线更加平滑。
