# 亦 Yi — Personal Portfolio

[![Lighthouse](https://img.shields.io/badge/Performance-95%2B-brightgreen)](https://developers.google.com/web/tools/lighthouse)
[![Accessibility](https://img.shields.io/badge/Accessibility-95%2B-brightgreen)](https://developers.google.com/web/tools/lighthouse)
[![Best Practices](https://img.shields.io/badge/Best_Practices-100-brightgreen)](https://developers.google.com/web/tools/lighthouse)
[![SEO](https://img.shields.io/badge/SEO-100-brightgreen)](https://developers.google.com/web/tools/lighthouse)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://portfolio-kohl-beta-zit57zqdmb.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> 计算机科学与技术应届毕业生 · 前端开发 & AI 应用方向
> 纯原生 HTML/CSS/JS · 零依赖 · 零构建 · 零框架

---

## 在线预览

| 平台 | 链接 |
|---|---|
| **Vercel** | [portfolio-kohl-beta-zit57zqdmb.vercel.app](https://portfolio-kohl-beta-zit57zqdmb.vercel.app) |
| **GitHub Pages** | [y2588952-glitch.github.io/portfolio](https://y2588952-glitch.github.io/portfolio) |

---

## 功能亮点

| 功能 | 说明 |
|---|---|
| 🎨 亮/暗主题 | 跟随系统偏好，手动切换自动 localStorage 持久化 |
| 🔄 滚动入场动画 | IntersectionObserver 驱动，Section 级 Fade Up / Left / Right + 子元素 stagger |
| 📊 技能进度条 | 进入视口后从 0 动画增长（rAF + easeOutCubic），支持 reduced-motion |
| 🖱 项目卡片 | 悬停放大 + 涟漪反馈 + 状态徽章 + 外链点击 |
| 📥 简历下载 | Hero 按钮一键下载 PDF |
| ⬆ 返回顶部 | 弹性入场 + 点击回弹 + 平滑滚动 |
| 📝 联系表单 | 前端验证（实时 feedback）+ mailto 提交 + Toast 通知 |
| ⏳ Loading 页 | 首次访问全屏 Logo + 1.5s 淡出，sessionStorage 刷新不重复 |
| 📄 404 页面 | 匹配主站风格，自动返回引导 |
| ♿ 无障碍 | Skip-link + aria-label + prefers-reduced-motion + 标题层级 |
| 📱 响应式 | 768px / 480px 双断点，移动端自动禁用视差 |

---

## 技术栈

```
HTML5 · CSS3 · JavaScript (ES5+)
├── 语义化标签：header / main / nav / section / article
├── 70+ CSS Variables 设计令牌（亮/暗双主题）
├── IntersectionObserver ×4
├── requestAnimationFrame 动画引擎
├── 事件委托 (Event Delegation)
├── localStorage / sessionStorage
└── 零依赖 · 零构建 · 零框架
```

| 类别 | 技术 |
|---|---|
| 语言 | HTML5 · CSS3 · JavaScript (ES5+) |
| 部署 | Vercel · GitHub Pages |
| 工具 | Git · GitHub · VS Code · Claude Code |
| 设计 | Apple / Notion 极简风 · SF Pro Display 字体栈 |
| SEO | JSON-LD · Open Graph · Twitter Card · robots.txt · sitemap.xml |
| 可访问性 | ARIA · Skip-link · prefers-reduced-motion · WCAG 2.2 |

---

## 项目结构

```
portfolio/
├── index.html           # 主页面（678 行）
├── style.css            # 全局样式（~2150 行，70+ CSS Variables）
├── script.js            # 交互脚本（~826 行，10 个模块）
├── 404.html             # 自定义 404 页面
├── favicon.svg          # Yi 首字母矢量图标
├── resume.pdf           # 简历 PDF（当前为占位，请替换）
├── 11.jpg               # 个人头像
├── robots.txt           # SEO 爬虫规则
├── sitemap.xml          # 站点地图
├── README.md            # 本文件
├── .gitignore           # Git 忽略 .vercel
└── .vercel/             # Vercel 项目配置（不提交）
```

### JavaScript 模块速览

```
script.js（826 行）
├── 〇、Loading        ── 首次加载动画
├── 一、Navigation     ── 导航栏（滚动阴影 + Scroll Spy + 按钮滚动）
├── 二、Theme          ── 亮/暗主题切换
├── 三、Animations     ── 滚动入场动画 + Hero + 图片淡入
├── 四、Skills         ── 技能进度条动画
├── 五、Projects       ── 项目卡片交互
├── 六、BackToTop      ── 返回顶部按钮
├── 七、Parallax       ── 视差 + 移动端优化
├── 八、Utilities      ── 涟漪 + 统一滚动调度
├── 九、Toast          ── 通知系统
└── 十、ContactForm    ── 表单验证
```

---

## 本地运行

项目为纯静态页面，无需安装任何依赖。

```bash
# 1. 克隆仓库
git clone https://github.com/y2588952-glitch/portfolio.git
cd portfolio

# 2. 直接双击打开
#    或用命令行：
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux

# 3. 或用任意本地服务器（可选）
npx serve .             # Node.js（需安装 Node）
python -m http.server   # Python 3
```

---

## Lighthouse 评分

| 指标 | 预估 | 说明 |
|---|---|---|
| Performance | 95+ | 零外部依赖、preload 图片、rAF 节流、IO 异步 |
| Accessibility | 95+ | Skip-link、aria-label、prefers-reduced-motion、标题层级 |
| Best Practices | 100 | HTTPS、无漏洞库、图片宽高比、无废弃 API |
| SEO | 100 | OG ×9、Twitter Card ×5、JSON-LD、robots.txt、sitemap.xml |

---

## 后续开发计划

### V3.0

- [ ] 项目真实截图 + 在线演示
- [ ] 项目详情 Modal 弹窗
- [ ] GitHub API 实时数据展示
- [ ] 个人数据统计看板（计数动画）
- [ ] PDF 简历打印优化版
- [ ] 中/英文多语言（i18n）
- [ ] 技术文章聚合展示

### 长期

- [ ] 联系表单接入真实后端（Web3Forms / Formspree）
- [ ] 自定义主题生成器
- [ ] 性能监控仪表盘

---

## 作者

**亦 Yi** — Frontend Developer & AI Learner

- GitHub：[y2588952-glitch](https://github.com/y2588952-glitch)
- Email：[y2588952@gmail.com](mailto:y2588952@gmail.com)
- LinkedIn：[y2588952](https://linkedin.com/in/y2588952)
- Location：中国 · 成都

## License

MIT © 2026 亦 Yi
