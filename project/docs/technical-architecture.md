# 技术架构

## 1. 总体思路

采用“规则优先，AI 辅助”的架构：

- 规则负责安全关键判断
- AI 负责表达、摘要和低风险个性化

## 2. 建议技术栈

### 前端
- Next.js
- React
- TypeScript
- TailwindCSS

### 后端
- Next.js Route Handlers 或独立 Node API
- TypeScript
- PostgreSQL（后续可接 Prisma）

### 通知
- Cron / 消息推送 / Email / 本地通知（按部署环境）

### AI 能力
- 文本摘要
- 安全支持文本生成
- 日志提炼

## 3. 核心模块

### 数据层
- User
- Profile
- Medication
- MedicationSchedule
- MedicationLog
- DailyCheckin
- SideEffectLog
- CrisisContact

### 规则引擎
输入：
- 模式
- 睡眠
- 心情
- 焦虑
- 自伤意念
- 漏药频率
- 冲动/兴奋指标

输出：
- riskLevel: low | medium | high
- flags[]
- supportTemplate
- actionSuggestions[]

### 内容层
- 疾病知识条目
- 药物知识卡
- 安全文案模板
- 危机资源配置

## 4. API 草案

- `POST /api/checkins`
- `GET /api/checkins`
- `POST /api/medications`
- `POST /api/medication-logs`
- `POST /api/risk/evaluate`
- `POST /api/summary/visit`

## 5. 部署建议

第一阶段：
- Web 原型
- 单机部署
- 本地数据库或托管 PostgreSQL

后续：
- 权限系统
- 审计日志
- 内容审核后台
- 本地化危机资源中心
