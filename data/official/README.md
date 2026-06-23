# 院校基础档案官方数据源

- `moe-colleges-20260618.json`：中华人民共和国教育部“全国普通高等学校名单”公开查询数据，抓取日期 2026-06-22，页面最后更新 2026-06-18。
- `double-first-class-2022.txt`：教育部第二轮“双一流”建设高校及建设学科名单 PDF 的文本提取结果。

官方来源：

- https://hudong.moe.gov.cn/qggxmd/
- https://www.moe.gov.cn/srcsite/A22/s7065/202202/W020220214318455516037.pdf

运行 `node scripts/build-school-metadata.js` 可重新生成 `shared/fujian-art-school-metadata.js` 和审计表。