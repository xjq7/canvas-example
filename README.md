# Canvas Animation Collection
# 画布动画合集

> **语言切换: [English](README.en.md) | [中文](README.md)**

这是一个使用 Canvas API 和 TypeScript 实现的动画合集，展示了高级图形编程技巧、游戏开发概念和交互式用户体验。

## 概览

该项目通过一系列互动应用程序探索了 HTML5 Canvas API 的能力，从经典游戏到创意可视化，每个实现都展示了不同的画布操作、游戏机制、动画技术和用户交互模式。

## 在线演示

访问在线演示: [https://canvas.xjq.icu](https://canvas.xjq.icu)

## 应用

### 2048 游戏

一个经典的滑动拼图游戏实现，带有平滑动画和手势支持。

**功能:**
- 响应式网格游戏玩法
- 分数跟踪和高分持久化
- 平滑的瓦片合并动画
- 键盘和触控控制

**技术栈:**
- TypeScript 基于类的架构
- Canvas 渲染优化
- 本地存储集成以支持游戏状态持久化

[试玩 2048](https://canvas.xjq.icu/2048) | [源码](https://github.com/xjq7/canvas-example/tree/main/src/pages/2048)

### 扫雷

经典扫雷游戏的一个完整实现，具有可定制的难度。

**功能:**
- 随机生成雷区
- 点击和标记功能
- 计时器和地雷计数器
- 三种难度级别

**技术栈:**
- TypeScript 类基础架构
- 矩阵运算和碰撞检测
- 本地存储集成以支持游戏状态持久化

[试玩扫雷](https://canvas.xjq.icu/minesweeper) | [源码](https://github.com/xjq7/canvas-example/tree/main/src/pages/minesweeper)

### 雪花模拟

一个模拟雪花场景的动画，展示粒子系统和物理效果。

**功能:**
- 随机生成雪花粒子
- 动态风向和速度控制
- 粒子碰撞检测
- 性能优化渲染

**技术栈:**
- 粒子系统架构
- 物理引擎集成
- Canvas 渲染优化

[查看雪花模拟](https://canvas.xjq.icu/snowflake) | [源码](https://github.com/xjq7/canvas-example/tree/main/src/pages/snowflake)

### 音乐律动键盘

一个音乐节奏可视化工具，响应键盘输入并生成动态视觉效果。

**功能:**
- 实时音频分析
- 键盘触发的声音和视觉效果
- 频率分析和可视化
- 动态背景动画

**技术栈:**
- Web Audio API 集成
- 傅里叶变换频率分析
- Canvas 渲染优化

[试玩音乐律动](https://canvas.xjq.icu/marching-music) | [源码](https://github.com/xjq7/canvas-example/tree/main/src/pages/marching-music)

### 翻页动画

一个真实的书页翻转动画演示，支持自定义参数。

**功能:**
- 3D 风格的页面翻转效果
- 自定义翻页参数
- 平滑过渡动画
- 响应式设计

**技术栈:**
- Bezier 曲线数学
- Canvas 渲染优化
- 交互式控件集成

[查看翻页动画](https://canvas.xjq.icu/pageflip) | [源码](https://github.com/xjq7/canvas-example/tree/main/src/pages/pageflip)

### 拼图游戏

一个完整的拼图游戏实现，带有拖放功能。

**功能:**
- 图像切分成拼图碎片
- 拖放碎片到正确位置
- 自动对齐机制
- 三种难度级别

**技术栈:**
- 碎片化算法
- 碰撞检测算法
- 拖放实现
- 图像操作技术

[玩拼图游戏](https://canvas.xjq.icu/jigsaw) | [源码](https://github.com/xjq7/canvas-example/tree/main/src/pages/jigsaw)

### Canvas 绘图练习

一个包含基本 Canvas 绘图练习和技术的集合。

**功能:**
- 基本绘图操作
- 动画和变换技巧
- 交互式绘图工具
- 多种示例场景

**技术栈:**
- Canvas 基础 API
- 动画和变换技术
- 事件处理系统
- 响应式设计

[查看绘图练习](https://canvas.xjq.icu/canvas) | [源码](https://github.com/xjq7/canvas-example/tree/main/src/pages/canvas)

## 快速上手

### 安装步骤

1. 克隆仓库
2. 使用 `pnpm install` 安装依赖
3. 使用 `pnpm dev` 启动开发服务器
4. 在浏览器中打开 `http://localhost:5173`

## 技术栈

- TypeScript
- React
- Vite
- HTML5 Canvas API
- Web Audio API
- CSS Modules

## 贡献指南

欢迎贡献！您可以自由提交拉取请求或提出问题以建议改进或添加新的 Canvas 示例。

## 许可证

本项目使用 MIT 许可证 - 详情请参见 LICENSE 文件。

> **语言切换: [English](README.en.md) | [中文](README.md)**