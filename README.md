# 一人食 · 治愈小厨房 🍳

为独居/忙碌用户打造的轻量级一人食烹饪模拟 Web 应用。选择一道快手菜，在洗菜 → 切配 → 调味 → 烘烤四步趣味动画中慢慢感受烟火气，完成后打卡，累计天数即可解锁可爱的厨房摆件与围裙皮肤。所有数据本地持久化，clone 下来即可运行。

## ✨ 功能特性

- **🍳 菜品选择**：6 道精选快手菜卡片，难度与时长一目了然
- **🧼 四步烹饪动画**：洗菜、切配、调味、烘烤，每步都有精心设计的交互动画与粒子反馈
- **📅 打卡系统**：今日完成烹饪后一键打卡，自动记录连续天数与累计天数
- **🏆 成就解锁**：累计打卡达到阈值即可解锁 7 款厨房摆件与 6 款围裙皮肤
- **👗 自由换装**：选择喜欢的围裙和摆件，它们会出现在你的厨房中
- **💾 本地持久化**：所有进度自动保存在浏览器 localStorage，关页不丢失

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 生产构建
npm run build

# 4. 本地预览构建产物
npm run preview
```

启动后访问终端提示的本地地址（通常为 `http://localhost:5173`）即可。

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3.4 + Composition API + `<script setup>` |
| 语言 | TypeScript |
| 构建 | Vite 5 |
| 路由 | Vue Router 4（hash 模式，免后端配置） |
| 状态 | Pinia 2 + pinia-plugin-persistedstate（自动 localStorage 持久化） |
| 样式 | Tailwind CSS 3 + 自定义 CSS Variables |
| 图标 | Lucide Vue Next + Emoji |
| 字体 | Google Fonts：ZCOOL KuaiLe（手写标题）+ Noto Sans SC（正文） |

## 📁 目录结构

```
lyt-23/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── public/
└── src/
    ├── main.ts                 # 应用入口
    ├── App.vue                 # 根组件（路由切换动画）
    ├── style.css               # 全局样式 + 主题变量
    ├── router/index.ts         # 路由定义
    ├── stores/cooking.ts       # Pinia Store：打卡/解锁/换装状态
    ├── data/                   # 静态数据（菜品 & 解锁项）
    ├── views/                  # 3 个页面视图
    │   ├── HomeView.vue        # 首页：菜品选择
    │   ├── CookingView.vue     # 烹饪模拟页
    │   └── AchievementsView.vue# 成就与换装页
    └── components/             # 可复用组件
        ├── TopStatusBar.vue
        ├── DishCard.vue
        ├── FinishModal.vue
        ├── UnlockModal.vue
        ├── cooking/            # 4 步烹饪动画组件
        └── achievements/       # 日历/进度/换装组件
```

## 🎨 设计风格

- 暖杏色 `#FFE8D6` 为主背景，蜜橘橙 `#FF8C42` 为强调色，抹茶绿 `#A7C957` 为辅
- 圆角大卡片 + 柔和投影 + 手写感字体，营造温暖治愈的厨房烟火气
- 所有交互带有微动画反馈：浮动、弹跳、缩放、粒子、蒸汽等

## 📝 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（带热更新） |
| `npm run build` | 类型检查 + 生产构建 |
| `npm run preview` | 本地预览生产构建 |
| `npm run check` | 仅运行 TypeScript 类型检查 |
| `npm run lint` | 运行 ESLint |
| `npm run lint:fix` | 自动修复 Lint 问题 |

## 💡 使用提示

- 首次打卡后即可在 **成就 & 换装** 页面查看进度
- 每天只能打卡一次，连续打卡会累积 🔥 连续天数
- 打卡数据完全保存在本地浏览器，清除浏览器数据会重置进度
- 推荐使用现代浏览器（Chrome / Edge / Firefox / Safari）获得最佳动画体验

---

Made with 🧡 · 好好吃饭，慢慢生活
