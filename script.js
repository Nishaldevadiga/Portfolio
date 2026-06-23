// ---------- Preloader ----------
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const countEl = document.getElementById('preloaderCount');
    if (!preloader || !countEl) return;

    if (sessionStorage.getItem('ns-visited')) {
        preloader.remove();
        return;
    }
    sessionStorage.setItem('ns-visited', '1');

    document.body.style.overflow = 'hidden';
    const start = performance.now();
    const duration = 900;

    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * 100);
        countEl.textContent = String(value).padStart(3, '0');
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            setTimeout(() => {
                preloader.classList.add('done');
                document.body.style.overflow = '';
                setTimeout(() => preloader.remove(), 500);
            }, 250);
        }
    }
    requestAnimationFrame(step);
}

// ---------- Scroll progress bar ----------
function initProgressBar() {
    const fill = document.getElementById('progress-fill');
    if (!fill) return;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        fill.style.width = pct + '%';
    });
}

// ---------- Header scroll state ----------
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.pageYOffset > 40);
    });
}

// ---------- Mobile menu ----------
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('open');
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('open');
        });
    });
}

// ---------- Smooth scroll with header offset ----------
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const headerHeight = document.getElementById('header')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        });
    });
}

// ---------- Scroll reveal ----------
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.fade-in, .section-line').forEach((el) => observer.observe(el));
}

// ---------- Hero word-group reveal ----------
function initHeroReveal() {
    const hero = document.getElementById('heroReveal');
    if (!hero) return;
    requestAnimationFrame(() => hero.classList.add('in'));
}

// ---------- Typing role text ----------
function typeDeleteLoop(element, words, { typeSpeed = 80, deleteSpeed = 45, pause = 1200 } = {}) {
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function step() {
        const current = words[wordIndex];
        if (!deleting) {
            element.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                deleting = true;
                setTimeout(step, pause);
                return;
            }
            setTimeout(step, typeSpeed);
        } else {
            element.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(step, 300);
                return;
            }
            setTimeout(step, deleteSpeed);
        }
    }
    step();
}

function initRoleTyping() {
    const roleEl = document.getElementById('role-text');
    if (!roleEl) return;
    const roles = ['Full Stack Developer', 'AI Engineer', 'ML Engineer', 'Backend Developer', 'Frontend Developer'];
    typeDeleteLoop(roleEl, roles);
}

// ---------- Animated stat counters ----------
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10) || 0;
            let current = 0;
            const duration = 1200;
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;

            const interval = setInterval(() => {
                current += increment;
                if (current >= target) {
                    el.textContent = target;
                    clearInterval(interval);
                } else {
                    el.textContent = Math.floor(current);
                }
            }, stepTime);

            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach((el) => observer.observe(el));
}

// ---------- Copy email to clipboard ----------
function initCopyEmail() {
    const button = document.getElementById('copyEmail');
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');
    if (!button || !toast) return;

    button.addEventListener('click', async () => {
        const email = button.dataset.email;
        try {
            await navigator.clipboard.writeText(email);
            toastText.textContent = 'Email copied to clipboard';
        } catch {
            toastText.textContent = email;
        }
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 1800);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initProgressBar();
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initHeroReveal();
    initRoleTyping();
    initCounters();
    initCopyEmail();
});
