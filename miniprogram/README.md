# 福建美术与设计类志愿填报助手小程序

## 数据同步

H5 页面和小程序共用同一份数据：

- `miniprogram/shared/fujian-art-data.js`

如果原网站 `index.html` 中的院校数据更新，可在项目根目录运行：

```bash
node scripts/sync-h5-to-miniprogram.js
```

脚本会从 `index.html` 抽取 `colleges` 和 `schoolLinks`，覆盖小程序共享数据文件。

也可以使用：

```bash
npm run sync
```

## 打开方式

用微信开发者工具打开项目根目录，并使用根目录的 `project.config.json`。当前 `appid` 是体验用的 `touristappid`，正式发布前需要替换成真实小程序 AppID。

## 当前功能

- 输入文化分、专业分，自动计算 2024/2025 福建美术与设计类综合分。
- 支持按综合分差值推荐，也支持导入 2025 / 2026 两年一分一段表后按位次换算推荐。
- 支持历史/物理、待补数据、民办、中外合作、省内优先、公办和高层级院校筛选。
- 生成 40 条冲稳保建议。
- 查看院校详情、复制官方来源链接。
- 收藏目标院校，便于反复比较。
- “我的”页支持微信登录、本地管理员开关和后台入口。
- 管理后台支持新增、编辑、删除院校/专业记录；保存后会立即参与推荐。

## 位次推荐算法

按位次模式已内置 2025 福建美术与设计类历史组/物理组综合分一分一段表，只需要导入 2026 表：

- 内置 `2025 一分一段表`：用于把院校 2025 录取最低分换算成 2025 位次。
- `2026 一分一段表`：用于把该位次换算成 2026 等位分。

2026 表粘贴格式为 `score,rank,count`，每行一条，例如：

```text
560,100,5
550,180,8
540,260,9
```

如果只导入其中一年，小程序会提示补齐数据，不会按不完整位次表生成推荐。

小程序会在本地缓存已粘贴的 2025 / 2026 一分一段表，重新打开页面后仍可继续使用；也可以在首页清空缓存。

## 校验

项目根目录运行：

```bash
node scripts/verify-miniprogram.js
```

该脚本会检查小程序/云函数 JS 语法、JSON 配置、共享数据加载、分数模式推荐和位次模式推荐。

也可以使用：

```bash
npm run verify
```

## 登录与后台

当前已经预留微信云开发：

- `cloudfunctions/login`：用于获取 openid，并读取/创建 `users` 用户记录后返回角色。
- `miniprogram/shared/auth.js`：管理登录状态和管理员判断。
- `miniprogram/shared/data-store.js`：优先读取云数据库 `colleges` 集合；未配置云开发时使用本地数据。

正式上线前需要：

1. 在微信开发者工具中开通云开发。
2. 把 `miniprogram/app.js` 里的 `cloudEnvId` 填成真实环境 ID，或保持为空使用默认环境。
3. 上传并部署 `cloudfunctions/login` 云函数。
4. 建立 `users` / `colleges` / `audit_logs` 等集合。
5. 把管理员 openid 对应的 `users.role` 改为 `admin` 或 `super_admin`；当前“管理员模式”开关仅用于开发测试。

云数据库字段参考 [CLOUD_SCHEMA.md](./CLOUD_SCHEMA.md)。
