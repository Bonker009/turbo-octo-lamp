document.addEventListener('DOMContentLoaded', () => {

    // ─── Preloader ────────────────────────────────────────────
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => preloader?.classList.add('hidden-out'), 300);
    });

    // ─── Custom Cursor ────────────────────────────────────────
    const cursorDot  = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        cursorDot.classList.remove('opacity-0');
        cursorRing.classList.remove('opacity-0');
        cursorDot.style.opacity  = '1';
        cursorRing.style.opacity = '1';

        document.addEventListener('mousemove', e => {
            cursorDot.style.left  = e.clientX + 'px';
            cursorDot.style.top   = e.clientY + 'px';
            cursorRing.style.left = e.clientX + 'px';
            cursorRing.style.top  = e.clientY + 'px';
        });

        // Scale up ring on hoverable elements
        document.querySelectorAll('a, button, [role="button"], .skill-card, .project-card, .service-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.style.width  = '3rem';
                cursorRing.style.height = '3rem';
                cursorRing.style.borderColor = 'rgba(225,29,72,0.5)';
                cursorDot.style.transform = 'translate(-50%,-50%) scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.style.width  = '2rem';
                cursorRing.style.height = '2rem';
                cursorRing.style.borderColor = '';
                cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
            });
        });
    }

    // ─── AOS Init ──────────────────────────────────────────────
    AOS.init({
        once: true,
        offset: 60,
        duration: 750,
        easing: 'ease-out-cubic',
    });

    // ─── Theme ─────────────────────────────────────────────────
    const html = document.documentElement;
    const toggleIcons = [
        [document.getElementById('icon-moon'),   document.getElementById('icon-sun')],
        [document.getElementById('icon-moon-m'), document.getElementById('icon-sun-m')],
    ];

    function applyTheme(dark) {
        html.classList.toggle('dark', dark);
        toggleIcons.forEach(([moon, sun]) => {
            moon?.classList.toggle('hidden', dark);
            sun?.classList.toggle('hidden', !dark);
        });
    }

    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved === 'dark' || (!saved && prefersDark));

    function toggleTheme() {
        const isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        applyTheme(!isDark);
    }

    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
    document.getElementById('theme-toggle-mobile')?.addEventListener('click', toggleTheme);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) applyTheme(e.matches);
    });

    // ─── Typing Effect ─────────────────────────────────────────
    const typedEl = document.getElementById('typed-text');
    const words   = ['Spring Boot APIs.', 'Scalable Backends.', 'Jetpack Compose Apps.', 'Data Analytics workflows.'];
    let wIdx = 0, cIdx = 0, deleting = false;

    function typeLoop() {
        if (!typedEl) return;
        const current = words[wIdx];
        if (!deleting) {
            typedEl.textContent = current.slice(0, ++cIdx);
            if (cIdx === current.length) { deleting = true; return setTimeout(typeLoop, 2200); }
        } else {
            typedEl.textContent = current.slice(0, --cIdx);
            if (cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; }
        }
        setTimeout(typeLoop, deleting ? 45 : 85);
    }
    setTimeout(typeLoop, 900);

    // ─── Navbar Scroll, Back-to-Top & Progress Bar ─────────────
    const navbar        = document.getElementById('navbar');
    const backToTop     = document.getElementById('back-to-top');
    const scrollProg    = document.getElementById('scroll-progress');

    function handleScroll() {
        const y = window.scrollY;
        
        // Navbar
        navbar?.classList.toggle('scrolled', y > 40);

        // Parallax elements
        const parallaxElements = document.querySelectorAll('[data-speed]');
        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-speed');
            el.style.transform = `translateY(${y * speed * 0.1}px)`;
        });

        // Back to top
        if (y > 500) {
            backToTop?.classList.remove('opacity-0', 'invisible');
            backToTop?.classList.add('opacity-100', 'visible');
        } else {
            backToTop?.classList.add('opacity-0', 'invisible');
            backToTop?.classList.remove('opacity-100', 'visible');
        }

        // Scroll progress bar
        if (scrollProg) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height    = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled  = (winScroll / height) * 100;
            scrollProg.style.width = scrolled + '%';
        }

        updateScrollSpy();
        animateSkillBars();
        animateCounters();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ─── Scroll Spy ────────────────────────────────────────────
    const sections    = document.querySelectorAll('section[id]');
    const navLinks    = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function updateScrollSpy() {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY + 160 >= sec.offsetTop) current = sec.id;
        });
        [...navLinks, ...mobileLinks].forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
        });
    }

    // ─── Mobile Menu ───────────────────────────────────────────
    const mobileMenu    = document.getElementById('mobile-menu');
    const menuBtn       = document.getElementById('mobile-menu-btn');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon     = document.getElementById('close-icon');
    let menuOpen        = false;

    function setMenu(open) {
        menuOpen = open;
        mobileMenu?.classList.toggle('hidden', !open);
        hamburgerIcon?.classList.toggle('hidden', open);
        closeIcon?.classList.toggle('hidden', !open);
        menuBtn?.setAttribute('aria-expanded', open.toString());
    }

    menuBtn?.addEventListener('click', () => setMenu(!menuOpen));
    mobileLinks.forEach(l => l.addEventListener('click', () => setMenu(false)));
    document.addEventListener('click', e => {
        if (menuOpen && !mobileMenu?.contains(e.target) && !menuBtn?.contains(e.target)) setMenu(false);
    });

    // ─── Skill & Language Bars (IntersectionObserver) ──────────
    const animElements = document.querySelectorAll('.skill-bar, .lang-card');
    const barObs       = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                barObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });
    animElements.forEach(el => barObs.observe(el));

    function animateSkillBars() {
        animElements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 80) el.classList.add('animated');
        });
    }

    // ─── Count-Up Stats ────────────────────────────────────────
    const counters  = document.querySelectorAll('.stat-num[data-target]');
    let countersRun = false;

    function animateCounters() {
        if (countersRun) return;
        counters.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 60) countersRun = true;
        });
        if (!countersRun) return;

        counters.forEach(el => {
            const target   = parseInt(el.dataset.target, 10);
            const suffix   = el.dataset.target === '100' ? '%' : '+';
            const duration = 1800;
            const start    = performance.now();
            const step = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased    = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target) + (progress === 1 ? suffix : '');
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        });
    }

    // ─── Contact Form ──────────────────────────────────────────
    const form      = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText   = document.getElementById('btn-text');
    const btnIcon   = document.getElementById('btn-icon');
    const formSuccess = document.getElementById('form-success');

    form?.addEventListener('submit', async e => {
        e.preventDefault();
        let valid = true;
        form.querySelectorAll('[required]').forEach(f => {
            f.style.borderColor = '';
            f.style.boxShadow   = '';
            if (!f.value.trim()) {
                f.style.borderColor = '#e11d48';
                f.style.boxShadow   = '0 0 0 3px rgba(225,29,72,0.15)';
                valid = false;
            }
        });
        if (!valid) return;

        submitBtn.disabled  = true;
        btnText.textContent = 'Sending…';
        btnIcon.className   = 'fa-solid fa-spinner fa-spin';

        await new Promise(r => setTimeout(r, 1800));

        btnText.textContent = 'Message Sent!';
        btnIcon.className   = 'fa-solid fa-circle-check';
        formSuccess?.classList.remove('hidden');
        form.reset();

        setTimeout(() => {
            submitBtn.disabled  = false;
            btnText.textContent = 'Send Message';
            btnIcon.className   = 'fa-regular fa-paper-plane';
            formSuccess?.classList.add('hidden');
        }, 4000);
    });

    form?.querySelectorAll('[required]').forEach(f => {
        f.addEventListener('blur', () => {
            f.style.borderColor = f.value.trim() ? '' : '#e11d48';
            f.style.boxShadow   = f.value.trim() ? '' : '0 0 0 3px rgba(225,29,72,0.12)';
        });
        f.addEventListener('input', () => {
            if (f.value.trim()) { f.style.borderColor = ''; f.style.boxShadow = ''; }
        });
    });

});
