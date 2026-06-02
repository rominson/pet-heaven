# 宠物天堂 (Pet Heaven)

> 为每一个离开的小天使，保留永恒的温暖。
> 陪伴失去宠物的人度过最需要安慰的时光。

---

## 项目简介

宠物天堂是一个专注于情感陪伴的宠物纪念网站。用户可以为逝去的宠物创建纪念空间，写下共同回忆，并通过 AI 聊天功能与"宠物"对话，获得心灵慰藉。

**核心理念**：陪伴失去宠物的人度过最伤心的两三个月。简洁、温暖、治愈，不追求功能堆砌。

---

## 技术栈

| 技术 | 用途 |
|------|------|
| **Next.js 16** (App Router) | 前端框架 |
| **TypeScript** | 类型安全 |
| **Tailwind CSS v4** | 样式 |
| **Supabase** (PostgreSQL) | 数据库持久化 |
| **DeepSeek API** | AI 聊天角色扮演 |

### 数据存储策略

- **核心数据**（宠物资料、回忆）→ 同时写入 Supabase + localStorage，读取优先 Supabase，失败回退 localStorage
- **非核心数据**（聊天历史、API Key）→ 仅存 localStorage
- **设备标识**：浏览器生成 UUID 作为 device_id，不清浏览器则身份不变
- **无用户登录**：设计初衷为短期陪伴，不做账号系统

---

## 页面导航

| 路由 | 功能 |
|------|------|
| `/` | 首页。宠物照片轮播 + 功能介绍 + 温暖故事预览 |
| `/memorial/[id]` | 纪念空间。宠物档案 + 回忆列表 + 编辑/删除 + AI 聊天入口 |
| `/create-memory` | 写下回忆。表单：标题、内容、图片上传、情绪选择、公开/隐私 |
| `/community` | 温暖故事。螺旋散落布局展示所有公开回忆，左右翻页动画 |

---

## 功能详解

### 1. 纪念空间 (`/memorial/[id]`)

纪念空间是网站的核心页面，由三部分组成：

**宠物档案卡片**
- 头像、名字、种类/品种、性别、生卒日期
- 性格标签（如：温柔、活泼、贪吃）
- 介绍文字
- 右上角「💬 和它聊天」按钮 → 弹出 AI 聊天窗口

**回忆列表**
- 用户本地回忆 + 示例回忆（乐乐的故事）
- 每个卡片右上角悬浮显示编辑/删除按钮（仅用户创建的回忆可操作）
- 编辑弹窗复用创建表单的字段
- 空状态：引导用户写下第一篇回忆

**AI 聊天**
- 点击宠物卡片上的聊天按钮 → 全屏聊天窗口
- 需用户配置 DeepSeek API Key（首次使用）
- AI 扮演已逝宠物，根据宠物资料和回忆内容进行角色扮演对话
- 流式输出，逐字显示
- 角色规则：禁止括号动作描写，简短自然，像真实宠物说话

### 2. 写下回忆 (`/create-memory`)

表单字段：
- **标题**（必填）
- **回忆内容**（必填，多行文本）
- **配图**（本地图片上传，自动压缩至 800px 以内，转 base64 存储）
- **心情**（开心/怀念/平静/感伤，四选一）
- **是否公开**（公开则在温暖故事中展示）

### 3. 温暖故事 (`/community`)

- 所有公开回忆以向日葵螺旋算法（phyllotaxis）散布在页面上
- 圆形头像随机大小和浮动动画，营造自然散落感
- 每页 50 条，左右箭头翻页带滑出/滑入动画
- 鼠标悬浮弹出预览卡片
- 点击查看完整回忆弹窗

### 4. 首页 (`/`)

- 全屏宠物照片轮播（Ken Burns 缩放效果）
- 渐变遮罩确保文字可读
- 三个功能入口（纪念/记录/分享）居中展示
- 最新公开故事预览

---

## 项目结构

```
src/
├── app/
│   ├── page.tsx                 # 首页
│   ├── layout.tsx               # 根布局（Header + Footer + 背景）
│   ├── globals.css              # 全局样式 + 动画
│   ├── HeroClient.tsx           # Hero 区组件
│   ├── memorial/[id]/page.tsx   # 纪念空间
│   ├── create-memory/page.tsx   # 写回忆
│   └── community/page.tsx       # 温暖故事
├── components/
│   ├── Header.tsx               # 导航栏（含移动端汉堡菜单）
│   ├── MemoryCard.tsx           # 回忆卡片（含编辑/删除按钮）
│   ├── PetAvatar.tsx            # 宠物头像组件
│   ├── ScrollReveal.tsx         # 滚动触发动画
│   ├── ImageUpload.tsx          # 图片上传（压缩 + base64）
│   ├── AmbientBackground.tsx    # 环境背景（粒子/光晕）
│   ├── PetBackgroundSlideshow.tsx # 首页宠物照片轮播
│   ├── EditMemoryModal.tsx      # 编辑回忆弹窗
│   ├── DeleteConfirmDialog.tsx  # 删除确认弹窗
│   ├── MigrationHandler.tsx     # localStorage → Supabase 自动迁移
│   └── chat/
│       ├── ChatPanel.tsx        # AI 聊天主面板（全屏弹窗）
│       ├── ChatBubble.tsx       # 消息气泡
│       ├── ChatInput.tsx        # 输入框
│       └── ApiKeySetup.tsx      # DeepSeek API Key 配置
├── data/
│   └── sample.ts               # 示例数据 + Memory/Pet 类型
└── lib/
    ├── chat.ts                  # 聊天核心：提示词构建 + DeepSeek 流式调用
    ├── data-service.ts          # 数据访问层（Supabase + localStorage 双重读写）
    └── supabase.ts              # Supabase 客户端 + device_id
```

---

## API Key 配置（AI 聊天）

AI 聊天功能使用 DeepSeek API，用户需自行提供 API Key：

1. 访问 [platform.deepseek.com](https://platform.deepseek.com) 注册
2. 创建 API Key
3. 在聊天页面首次使用时粘贴 Key

Key 仅保存在浏览器 localStorage，不会上传到任何服务器。

---

## 数据库

### Supabase 表结构

```sql
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL DEFAULT '',
  breed TEXT NOT NULL DEFAULT '',
  gender TEXT NOT NULL DEFAULT '',
  birthday TEXT NOT NULL DEFAULT '',
  pass_away_date TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  personality TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE memories (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  pet_id TEXT NOT NULL,
  pet_name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  emotion TEXT NOT NULL DEFAULT 'calm',
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 环境变量

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## localStorage Key 说明

| Key | 类型 | 说明 |
|-----|------|------|
| `pet` | `StoredPet` | 宠物资料（JSON） |
| `memories` | `Memory[]` | 回忆列表 |
| `chat_messages` | `ChatMessage[]` | 聊天历史（最多 50 条） |
| `deepseek_api_key` | `string` | DeepSeek API Key |
| `pet_heaven_device_id` | `string` (UUID) | 设备标识 |
| `pet_heaven_migrated` | `string` | 数据是否已迁移到 Supabase |

---

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build

# 启动生产服务器
npm start
```

访问 http://localhost:3000

---

## 部署建议

Vercel 免费部署（国内可能有访问延迟）或使用字节 Coze 部署。部署前需：
1. 创建 Supabase 项目并建表
2. 配置 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
