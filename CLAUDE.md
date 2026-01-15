# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

灵棋经占卜应用 - 一个基于中国古代占卜工具"灵棋经"的移动端 Web 应用。

## 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器（端口 3000）
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 6
- **样式**: Tailwind CSS（通过 CDN 加载）
- **AI 集成**: Gemini API（需在 `.env.local` 中配置 `GEMINI_API_KEY`）

## 架构设计

### 导航系统

应用使用基于状态的简单路由，而非 React Router：
- `App.tsx` 通过 `useState` 管理当前屏幕状态
- `Screen` 枚举定义所有可用页面（12 个）
- `navigate` 函数用于页面切换
- `TabBar` 组件仅在特定页面（Profile、History、Culture）显示

### 数据流

页面间数据传递通过 props 实现：
- `selectedDetailId`: 卦象详情页的 ID
- `selectedArticleId`: 文化文章详情页的 ID
- `onNavigate`: 导航回调函数

### 核心类型（types.ts）

- `Screen`: 页面枚举
- `Coin`: 棋子数据结构
- `HexagramData`: 卦象数据（包含卦号、名称、性质、指导等）
- `HistoryItem`: 占卜历史记录
- `ArticleData`: 文化知识文章

### 数据源（constants.ts）

- `MOCK_HEXAGRAMS`: 卦象数据库
- `MOCK_HISTORY`: 占卜历史记录
- `MOCK_ARTICLES`: 文化知识文章

## 自定义主题色

在 `index.html` 中通过 Tailwind 配置定义：
- `primary`: #11b4d4（青蓝色）
- `background-dark`: #101f22
- `surface-dark`: #18282b
- `seal-red`: #b91c1c（印章红）
- `gold`: #d4af37

## 注意事项

- 项目未配置测试框架和 ESLint
- 部分页面（Settings、Feedback、Collection）为占位实现
- 字体使用 Google Fonts：Noto Sans SC、Noto Serif SC、Ma Shan Zheng
