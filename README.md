# Personal Log Blog

一个面向个人日志、项目复盘和链接分享的网页端博客系统。当前版本优先提供轻量、可运行、易扩展的基础骨架：可以浏览公开日志、编写 Markdown 日志，并为每篇日志生成独立分享链接。

## 功能

- 日志首页：展示公开日志、置顶日志、阅读时间和标签
- 写作入口：创建和更新日志，支持 Markdown 正文
- 发布状态：支持 `draft`、`public`、`unlisted`
- 分享链接：每篇日志自动生成 `shareToken`，可通过 `/share/[token]` 分享
- 链接配置：通过 `data/settings.json` 配置个人链接和站点信息
- 本地数据：开发阶段使用 JSON 存储，便于快速迭代和迁移

## 技术栈

- Next.js App Router：页面、动态路由和 API Route Handlers
- React + TypeScript：组件化开发和类型约束
- Tailwind CSS：原子化样式系统
- lucide-react：界面图标
- 本地 JSON 存储：后续可替换为 SQLite、Postgres 或云数据库

## 快速开始

```bash
npm install
npm run dev
```

打开：

```text
http://localhost:3000
```

## 常用脚本

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
```

## 目录结构

```text
app/
  api/posts/        后端接口
  post/[slug]/      文章详情页
  share/[token]/    分享阅读页
  write/            写作页
components/         页面组件
data/               本地日志和站点配置
lib/                数据存取、校验、Markdown、slug 等工具
```

## 数据说明

日志数据位于 `data/posts.json`。核心字段包括：

- `title`：文章标题
- `slug`：文章访问路径
- `status`：发布状态，支持 `draft`、`public`、`unlisted`
- `shareToken`：分享页 token
- `content`：Markdown 正文
- `tags`：标签列表

站点配置位于 `data/settings.json`，可修改站点标题、描述、作者和分享链接。

## API

- `GET /api/posts`：获取所有日志
- `POST /api/posts`：创建日志
- `GET /api/posts/[slug]`：获取单篇日志
- `PATCH /api/posts/[slug]`：更新日志
- `DELETE /api/posts/[slug]`：删除日志

## 后续路线

- 登录保护：接入 Auth.js、Clerk 或 GitHub OAuth
- 数据库：使用 Prisma + SQLite/Postgres 替换 JSON 文件
- 编辑器：接入 MDXEditor、TipTap 或 Plate
- 搜索：增加标签过滤和全文搜索
- 媒体：支持图片上传、封面图和附件
- 部署：适配 Vercel、Docker 或自托管 Node.js 服务
