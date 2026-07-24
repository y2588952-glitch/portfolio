/**
 * Portfolio V2 — 主交互脚本
 * ================================================================
 * 所有 JavaScript 代码集中在此文件，使用原生 JS 实现。
 * 按功能模块划分，每个模块独立封装，互不污染。
 *
 * 模块索引：
 *   〇、Loading      —— 首次访问全屏 Loading 动画，1.5s 淡出
 *   一、Navigation   —— 导航栏滚动效果 + Scroll Spy + Hero 按钮
 *   二、Theme        —— 亮/暗主题切换，localStorage 持久化
 *   三、Animations   —— IntersectionObserver 驱动的滚动入场动画
 *   四、Skills       —— 技能进度条从 0 到目标的增长动画
 *   五、Projects     —— 项目卡片 hover 交互 + 外部链接点击
 *   六、BackToTop    —— 返回顶部按钮显隐 + 弹性动画 + 平滑滚动
 *   七、Parallax     —— 视差滚动 + 移动端性能优化
 *   八、Utilities    —— 按钮涟漪效果 + 图片淡入 + 统一滚动调度
 * ================================================================
 */

(function () {
    'use strict';

    /* ================================================================
     * 全局：检测 prefers-reduced-motion
     * ================================================================
     * 如果用户在操作系统中开启了"减少动效"，则跳过 JS 动画。
     * ================================================================ */

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    /* ================================================================
     * 〇、Loading（页面加载动画）
     * ================================================================
     * 首次访问时全屏展示 Logo + Loading 文字，1.5s 后淡出。
     * 使用 sessionStorage 确保同标签页内刷新不重复显示。
     * 不影响 SEO（页面内容仍在 HTML 中，仅被遮罩覆盖）。
     * ================================================================ */

    (function () {
        var loader = document.getElementById('loading-screen');
        if (!loader) return;

        var STORAGE_KEY = 'portfolio-loaded';     // sessionStorage 键
        var DURATION    = 1500;                   // 最短显示时长 (ms)
        var FADE_TIME   = 500;                    // 淡出动画时长 (ms，与 CSS 同步)

        // 同标签页内已加载过 → 直接跳过
        if (sessionStorage.getItem(STORAGE_KEY)) {
            loader.classList.add('hidden');
            return;
        }

        // 页面完全加载后开始计时
        function hideLoader() {
            // ① 触发淡出动画
            loader.classList.add('fade-out');

            // ② 标记已加载（刷新不再显示）
            sessionStorage.setItem(STORAGE_KEY, '1');

            // ③ 淡出动画完成后从 DOM 中移除
            setTimeout(function () {
                loader.classList.add('hidden');
            }, FADE_TIME);
        }

        // window.load 确保所有资源加载完毕；同时保证至少显示 DURATION ms
        var startTime = Date.now();

        window.addEventListener('load', function () {
            var elapsed = Date.now() - startTime;
            var delay   = Math.max(DURATION - elapsed, 0);   // 补足到 1.5s

            setTimeout(hideLoader, delay);
        });
    })();


    /* ================================================================
     * 一、Navigation（导航栏）
     * ================================================================
     * 功能：
     *   1.1 滚动检测 —— 页面滚动 > 50px，导航栏背景变不透 + 阴影
     *   1.2 Scroll Spy —— 自动高亮当前可视 Section 对应的导航链接
     *   1.3 Hero 按钮 —— View Projects / Contact Me 平滑滚动到目标
     * ================================================================ */

    // ---- DOM 引用 ----
    var nav       = document.querySelector('nav');                       // 导航栏
    var navLinks  = document.querySelectorAll('nav a[href^="#"]');      // 导航链接
    var sections  = document.querySelectorAll('section[id]');           // 所有 Section

    // ---- 1.1 滚动状态切换 ----
    var SCROLL_THRESHOLD = 50;   // 触发阈值（px）
    var navScrolled = false;     // 当前状态标记

    /**
     * 根据滚动距离切换导航栏样式
     * 状态未变化时不操作 DOM，避免无效重绘
     */
    function updateNavScrollState(scrollY) {
        var shouldBeScrolled = scrollY > SCROLL_THRESHOLD;
        if (shouldBeScrolled === navScrolled) return;   // 状态未变，跳过

        navScrolled = shouldBeScrolled;
        if (!nav) return;

        // 添加/移除 CSS 类 → 触发 background + box-shadow 过渡
        if (shouldBeScrolled) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    }
    // 初始化：处理页面刷新时已在滚动位置的情况
    updateNavScrollState(window.scrollY);

    // ---- 1.2 Scroll Spy（导航高亮）----
    var sectionVisibility = {};   // 记录每个 Section 的可见状态

    if (sections.length && navLinks.length) {
        // 初始化可见状态
        sections.forEach(function (s) {
            sectionVisibility[s.id] = false;
        });

        var scrollSpyObserver = new IntersectionObserver(
            function (entries) {
                // ① 更新每个 Section 的可见状态
                entries.forEach(function (entry) {
                    sectionVisibility[entry.target.id] = entry.isIntersecting;
                });

                // ② 找到第一个（最靠上的）可见 Section
                var activeId = null;
                for (var i = 0; i < sections.length; i++) {
                    if (sectionVisibility[sections[i].id]) {
                        activeId = sections[i].id;
                        break;
                    }
                }

                // ③ 更新导航链接高亮
                if (activeId) {
                    navLinks.forEach(function (link) {
                        var isActive = link.getAttribute('href') === '#' + activeId;
                        link.classList.toggle('nav-active', isActive);
                    });
                }
            },
            {
                threshold: 0.3,
                rootMargin: '-80px 0px -50% 0px'  // 顶部 80px = 导航高度
            }
        );

        sections.forEach(function (s) { scrollSpyObserver.observe(s); });
    }

    // ---- 1.3 Hero 按钮平滑滚动 ----
    var scrollButtons = document.querySelectorAll('[data-scroll-to]');
    scrollButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();                              // 阻止默认 # 锚点跳转
            var targetId = btn.getAttribute('data-scroll-to');
            var target   = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    /* ================================================================
     * 二、Theme（主题切换）
     * ================================================================
     * - 首访跟随系统偏好（prefers-color-scheme）
     * - 手动切换后写入 localStorage，不再跟随系统
     * - 监听系统变化（仅限用户未手动设置时生效）
     * ================================================================ */

    (function () {
        var html        = document.documentElement;
        var toggle      = document.getElementById('themeToggle');
        if (!toggle) return;

        var STORAGE_KEY = 'portfolio-theme';

        /** 获取初始主题：localStorage > 系统偏好 > light */
        function getInitialTheme() {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored === 'dark' || stored === 'light') return stored;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        /** 应用主题到 <html data-theme="..."> */
        function applyTheme(theme) {
            if (theme === 'dark') {
                html.setAttribute('data-theme', 'dark');
            } else {
                html.removeAttribute('data-theme');
            }
        }

        /** 临时启用过渡动画类，500ms 后自动移除 */
        function enableTransition() {
            html.classList.add('transitioning');
            setTimeout(function () {
                html.classList.remove('transitioning');
            }, 500);
        }

        // 初始化
        var initial = getInitialTheme();
        applyTheme(initial);
        // 不在初始化时写 localStorage → 系统变化监听才能生效
        // 仅用户手动切换时才写入（见下方）

        // 按钮点击
        toggle.addEventListener('click', function () {
            enableTransition();
            var isDark = html.hasAttribute('data-theme');
            var next   = isDark ? 'light' : 'dark';
            applyTheme(next);
            localStorage.setItem(STORAGE_KEY, next);
        });

        // 跟随系统变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            if (!localStorage.getItem(STORAGE_KEY)) {
                enableTransition();
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    })();


    /* ================================================================
     * 三、Animations（滚动入场动画系统）
     * ================================================================
     * 使用 IntersectionObserver 检测 Section 是否进入视口。
     *
     * Section 级：data-scroll 属性控制方向
     *   fade-up   → translateY(48px) → 0
     *   fade-left → translateX(-48px) → 0
     *   fade-right→ translateX(48px) → 0
     *
     * 子元素级：.reveal 类控制淡入，支持：
     *   data-stagger="N" → 子元素间隔 N ms 交错出现
     *   data-delay="N"   → 单个元素延迟 N ms
     * ================================================================ */

    // ---- 3.1 Section 级入场动画 ----
    var sectionObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                var section = entry.target;

                // ① 触发 Section 自身的方向性动画
                section.classList.add('revealed');

                // ② 处理 data-stagger 交错容器
                var staggerContainers = section.querySelectorAll('[data-stagger]');
                staggerContainers.forEach(function (container) {
                    var delay    = parseInt(container.getAttribute('data-stagger')) || 60;
                    var children = container.querySelectorAll('.reveal');
                    children.forEach(function (child, i) {
                        child.style.transitionDelay = (i * delay) + 'ms';
                        child.classList.add('revealed');
                    });
                });

                // ③ 处理独立的 .reveal 子元素（跳过已被 stagger 处理的）
                var revealEls = section.querySelectorAll('.reveal');
                revealEls.forEach(function (el, i) {
                    var inStagger = false;
                    staggerContainers.forEach(function (c) {
                        if (c.contains(el)) inStagger = true;
                    });
                    if (inStagger) return;

                    var customDelay = el.getAttribute('data-delay');
                    el.style.transitionDelay = customDelay
                        ? customDelay + 'ms'
                        : (i * 80) + 'ms';
                    el.classList.add('revealed');
                });

                // 动画只触发一次
                sectionObserver.unobserve(section);
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );

    document.querySelectorAll('section[data-scroll]').forEach(function (s) {
        sectionObserver.observe(s);
    });


    // ---- 3.2 Hero 入场动画 ----
    (function () {
        var hero = document.querySelector('.hero-animate');
        if (!hero) return;

        // 双重 rAF：等浏览器完成首帧布局后再触发
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                hero.classList.add('entered');
            });
        });
    })();


    // ---- 3.3 图片淡入 ----
    var imgObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('loaded');
                imgObserver.unobserve(entry.target);
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('img.anim-img').forEach(function (img) {
        if (img.complete) {
            img.classList.add('loaded');           // 缓存命中 → 直接显示
        } else {
            img.addEventListener('load', function () {
                img.classList.add('loaded');       // 加载完成 → 显示
            });
        }
        imgObserver.observe(img);                  // IO 兜底
    });


    /* ================================================================
     * 四、Skills（技能进度条动画）
     * ================================================================
     * Skills Section 进入视口后，6 个进度条依次从 0% 增长到目标值。
     *
     * 实现：
     *   1. CSS 初始 width: 0
     *   2. IntersectionObserver 监听 #skills
     *   3. 从 style="--w: N%" 读取目标百分比
     *   4. requestAnimationFrame + easeOutCubic 缓动
     *   5. 每个条间隔 100ms 启动 → "逐个填充"的视觉效果
     * ================================================================ */

    (function () {
        var skillsSection = document.getElementById('skills');
        var skillFills    = document.querySelectorAll('.skill-fill');
        if (!skillsSection || !skillFills.length) return;

        var skillsAnimated = false;    // 只执行一次

        // 尊重用户"减少动效"偏好：立即设置最终宽度，跳过过渡动画
        if (prefersReducedMotion) {
            skillFills.forEach(function (fill) {
                var targetStr = fill.style.getPropertyValue('--w');
                if (!targetStr) targetStr = getComputedStyle(fill).getPropertyValue('--w');
                fill.style.width = (parseFloat(targetStr) || 0) + '%';
            });
            return;
        }

        /** easeOutCubic：t 从 0→1，输出先快后慢 */
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        /**
         * 驱动单个进度条从 0 → target
         * @param {HTMLElement} fillEl   - .skill-fill 元素
         * @param {number}      target   - 目标百分比 0~100
         * @param {number}      duration - 动画时长 ms
         * @param {Function}    callback - 完成回调
         */
        function animateSkillBar(fillEl, target, duration, callback) {
            var startTime = performance.now();

            function step(now) {
                var elapsed        = now - startTime;
                var linearProgress = Math.min(elapsed / duration, 1);
                var easedProgress  = easeOutCubic(linearProgress);
                var currentWidth   = easedProgress * target;

                fillEl.style.width = currentWidth + '%';

                if (linearProgress < 1) {
                    requestAnimationFrame(step);         // 继续下一帧
                } else {
                    fillEl.style.width = target + '%';   // 精确归位
                    if (callback) callback();            // 通知完成
                }
            }

            requestAnimationFrame(step);
        }

        var skillsObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting || skillsAnimated) return;
                    skillsAnimated = true;

                    // 收集所有条的目标数据
                    var barData = [];
                    skillFills.forEach(function (fill) {
                        var targetStr = fill.style.getPropertyValue('--w');
                        if (!targetStr) {
                            targetStr = getComputedStyle(fill).getPropertyValue('--w');
                        }
                        var target = parseFloat(targetStr) || 0;
                        barData.push({ el: fill, target: target });
                    });

                    // 递归逐个启动，间隔 100ms
                    var STAGGER_DELAY = 100;
                    function startNext(index) {
                        if (index >= barData.length) return;
                        var item = barData[index];
                        if (item.target > 0) {
                            animateSkillBar(item.el, item.target, 900, function () {
                                setTimeout(function () {
                                    startNext(index + 1);
                                }, STAGGER_DELAY);
                            });
                        } else {
                            startNext(index + 1);       // target = 0，跳过
                        }
                    }

                    startNext(0);
                    skillsObserver.unobserve(skillsSection);
                });
            },
            { threshold: 0.25 }
        );

        skillsObserver.observe(skillsSection);
    })();


    /* ================================================================
     * 五、Projects（项目卡片交互）
     * ================================================================
     * 使用事件委托在 .projects-grid 上统一管理：
     *   5.1 鼠标悬停 → 卡片放大 + 阴影
     *   5.2 点击按钮 → window.open() 打开 GitHub / Live Demo
     * ================================================================ */

    (function () {
        var projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;

        // ---- 5.1 鼠标悬停 ----
        // mouseenter/mouseleave 不冒泡，通过捕获阶段实现事件委托
        projectsGrid.addEventListener('mouseenter', function (e) {
            var card = e.target.closest('.project-card');
            if (card) card.classList.add('project-card-hovered');
        }, true);

        projectsGrid.addEventListener('mouseleave', function (e) {
            var card = e.target.closest('.project-card');
            if (card) card.classList.remove('project-card-hovered');
        }, true);

        // ---- 5.2 按钮点击 ----
        projectsGrid.addEventListener('click', function (e) {
            var link = e.target.closest('.project-link');
            if (!link) return;

            // 禁用按钮（控制台应用 / 开发中）
            if (link.classList.contains('project-link-disabled')) {
                e.preventDefault();
                return;
            }

            var href = link.getAttribute('href');
            if (!href || href === '#') return;

            e.preventDefault();
            window.open(href, '_blank', 'noopener');
        });
    })();


    /* ================================================================
     * 六、BackToTop（返回顶部按钮）
     * ================================================================
     * 显隐：滚动 > 300px 显示（弹性入场动画）
     * 点击：回弹动画 → 120ms 后平滑滚动到顶部
     * ================================================================ */

    var backToTop = document.getElementById('backToTop');
    var BACK_TO_TOP_THRESHOLD = 300;    // 显示阈值
    var backToTopVisible = false;       // 当前可见状态

    /**
     * 根据滚动距离控制返回顶部按钮的显隐
     * 仅在状态变化时操作 DOM
     */
    function updateBackToTop(scrollY) {
        var shouldShow = scrollY > BACK_TO_TOP_THRESHOLD;
        if (shouldShow === backToTopVisible) return;
        backToTopVisible = shouldShow;
        if (!backToTop) return;

        if (shouldShow) {
            backToTop.classList.add('visible');      // 弹性入场
        } else {
            backToTop.classList.remove('visible');   // 淡出
        }
    }
    updateBackToTop(window.scrollY);   // 处理页面刷新时的初始状态

    // ---- 点击交互 ----
    if (backToTop) {
        var isScrollingToTop = false;   // 防抖锁

        backToTop.addEventListener('click', function () {
            if (isScrollingToTop) return;           // 动画进行中，忽略
            isScrollingToTop = true;

            // ① 回弹动画
            backToTop.classList.add('popping');

            // ② 120ms 后开始平滑滚动
            setTimeout(function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 120);

            // ③ 350ms 后清理动画类 + 重置防抖
            setTimeout(function () {
                backToTop.classList.remove('popping');
                isScrollingToTop = false;
            }, 350);
        });
    }


    /* ================================================================
     * 七、Parallax（视差滚动 + 移动端优化）
     * ================================================================
     * 视差：Hero 中的元素以不同 data-speed 系数随滚动位移
     * 移动端：自动禁用视差 + 清除 will-change（省 GPU）
     * ================================================================ */

    var parallaxEls = document.querySelectorAll('.parallax');

    // ---- 7.1 视差计算 ----
    function applyParallax(scrollY) {
        parallaxEls.forEach(function (el) {
            // 仅对已 reveal 或非 reveal 的元素生效
            if (!el.classList.contains('revealed') && el.classList.contains('reveal')) return;

            var speed = parseFloat(el.getAttribute('data-speed')) || 0.08;
            var shift = scrollY * speed;
            if (shift < 120) {
                el.style.transform = 'translateY(' + shift + 'px)';
            }
        });
    }

    // ---- 7.2 移动端禁用 ----
    (function () {
        var isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (!isMobile) return;

        parallaxEls.forEach(function (el) {
            el.style.transform  = 'none';
            el.style.willChange = 'auto';
        });
    })();


    /* ================================================================
     * 八、Utilities（工具模块）
     * ================================================================
     * 8.1 按钮涟漪 —— 点击时在点击位置扩散圆形波纹
     * 8.2 统一滚动 —— rAF 节流调度所有滚动相关回调
     * ================================================================ */

    // ---- 8.1 按钮涟漪效果 ----
    document.addEventListener('click', function (e) {
        var rippleEl = e.target.closest(
            '.btn, .project-link, .social-icon, .theme-toggle, .contact-card'
        );
        if (!rippleEl) return;

        // 创建涟漪 span
        var ripple    = document.createElement('span');
        ripple.className = 'btn-ripple';

        // 计算位置和尺寸
        var rect = rippleEl.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        ripple.style.width  = ripple.style.height = size + 'px';
        ripple.style.left   = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top    = (e.clientY - rect.top  - size / 2) + 'px';

        rippleEl.appendChild(ripple);

        // 动画结束自动清理
        ripple.addEventListener('animationend', function () {
            ripple.remove();
        });
    });


    // ---- 8.2 统一滚动调度器 ----
    var scrollTicking = false;   // rAF 节流锁

    /**
     * 所有 scroll 相关逻辑的统一入口
     * 通过单一个 rAF 回调降低滚动事件开销
     */
    function onScroll() {
        if (scrollTicking) return;
        scrollTicking = true;

        requestAnimationFrame(function () {
            var y = window.scrollY;

            // 导航栏滚动状态（模块一）
            updateNavScrollState(y);

            // 返回顶部显隐（模块六）
            updateBackToTop(y);

            // 视差效果（模块七）
            applyParallax(y);

            scrollTicking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

})();
