# 칼퇴하자! / Clock Out! (下班消除) | Toss 消除小游戏

React 18 + TypeScript + Vite + Apps in Toss WebView。设计灵感来自三消叠层卡牌游戏，但所有品牌视觉和图标均为独立绘制的 SVG。

## 玩法

- 韩国时间每天 00:00 更换当天的固定布局。
- 第 1 关：3×3 × 2 层，共 18 张方块；只有 3 种图标，每种 6 张。任意点击顺序都不会因收集槽溢出而失败，必能通关。
- 第 2 关：9×9 底盘 + 2 层密集覆盖，共 135 张方块；使用 9 种图标，选择不当可能失败。
- 点击未被上层盖住的牌送入底部七格收集槽，集齐三个同款自动消除，槽满即失败。
- 撤销、提示、洗牌、重玩；每日完成时间保存到本地浏览器。
- 关卡生成是确定性的；第一关任意点击顺序都可通关（甚至洗牌后依然不会因槽位溢出失败）；第二关在未洗牌时有一条完整参考通关路径，但玩家随意选择仍可能失败，洗牌后不保证一定可通关。

## 零安装离线试玩

完整前端源码在 `src/`，本地执行 `npm install && npm run dev` 即可试玩。

## React + TypeScript 开发

```bash
npm install
npm run dev
```

浏览器访问 `http://localhost:5173`。

```bash
npm run typecheck
npm run build:web
```

## GitHub Pages 网页分享

仓库已包含 `.github/workflows/pages.yml`。推送到 main 后会尝试构建并部署。首次使用需要在 GitHub 仓库 Settings → Pages → Build and deployment 中设置 Source: GitHub Actions。

上线后预期访问路径为 `https://vioniasoft.github.io/clockout/`，在确认部署成功之前该网址并非可用保证。

## Apps in Toss 打包

1. 在 https://apps-in-toss.toss.im/ 创建游戏小程序。
2. 把 `granite.config.ts` 的 `appName` 改成开发者后台实际值，设置已上传的游戏图标 URL。
3. `npm install && npm run build` 生成 `.ait`（须按官方 SDK/Console 的当前要求确认）。
4. 上传到 Apps in Toss Console，完成 Toss App 真机测试、游戏分级、审核后才能上线。

**当前交付不是已经发布的公开 URL，也不是经过 Toss 测试/审核的文件。**
当前游戏数据仅保存在浏览器 localStorage，尚未接入 Toss 登录、广告、用户数据同步与反作弊功能。