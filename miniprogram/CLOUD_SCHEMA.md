# 云开发集合设计

## users

用于登录用户和管理员权限。`cloudfunctions/login` 会在用户首次登录时自动创建 `role: "user"` 的记录。

```json
{
  "openid": "用户 openid",
  "nickname": "可选昵称",
  "role": "user | admin | super_admin",
  "enabled": true,
  "createdAt": "2026-06-09T00:00:00.000Z",
  "updatedAt": "2026-06-09T00:00:00.000Z"
}
```

## colleges

用于线上院校/专业数据。字段与 `miniprogram/shared/fujian-art-data.js` 保持一致。

```json
{
  "id": "福州大学|2025|history|设计学类",
  "school": "福州大学",
  "province": "福建",
  "level": "211",
  "year": 2025,
  "info": "设计学类",
  "subject": "history",
  "min": 552.75,
  "max": null,
  "status": "已核",
  "tags": ["public", "211"]
}
```

## audit_logs

用于记录后台维护动作。

```json
{
  "action": "create_college | update_college | delete_college | import_colleges | reset_local_data",
  "detail": "操作说明",
  "operator": "管理员 openid",
  "time": "2026-06-09T00:00:00.000Z"
}
```

## recommend_records

用于保存用户生成的志愿草表。

```json
{
  "id": "record-1780000000000",
  "userOpenid": "用户 openid",
  "options": {
    "subject": "history",
    "score": 535
  },
  "rows": [
    {
      "index": 1,
      "band": "冲",
      "school": "集美大学",
      "info": "视觉传达设计",
      "min": "536.5"
    }
  ],
  "createdAt": "2026-06-09T00:00:00.000Z"
}
```

## 权限建议

- `users`：仅管理员可读写，普通用户只允许通过云函数读取自己的用户信息。
- `colleges`：所有用户可读，管理员可写。
- `audit_logs`：管理员可读写。
- `recommend_records`：用户只读写自己的记录，管理员可按需查看。
