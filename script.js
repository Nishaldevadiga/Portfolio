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

// ---------- Hero 3D DNA / network visual ----------
function initHeroVisual() {
    const canvas = document.getElementById('hero-canvas');
    const hero = document.getElementById('home');
    if (!canvas || !hero || typeof THREE === 'undefined') return;
    if (window.innerWidth < 900) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const width = hero.clientWidth;
    const height = hero.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const group = new THREE.Group();
    scene.add(group);

    const blue = 0x3b82f6;
    const cream = 0xeae4d5;

    // DNA double helix backbone
    const turns = 5;
    const pointsPerTurn = 16;
    const total = turns * pointsPerTurn;
    const helixHeight = 8;
    const radius = 1.3;

    const strandA = [];
    const strandB = [];
    for (let i = 0; i <= total; i++) {
        const t = (i / pointsPerTurn) * Math.PI * 2;
        const y = (i / total) * helixHeight - helixHeight / 2;
        strandA.push(new THREE.Vector3(Math.cos(t) * radius, y, Math.sin(t) * radius));
        strandB.push(new THREE.Vector3(Math.cos(t + Math.PI) * radius, y, Math.sin(t + Math.PI) * radius));
    }

    function strandLine(points, color, opacity) {
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
        return new THREE.Line(geo, mat);
    }
    group.add(strandLine(strandA, blue, 0.45));
    group.add(strandLine(strandB, cream, 0.3));

    // base-pair rungs
    const rungPoints = [];
    const nodePoints = [];
    for (let i = 0; i < strandA.length; i += 3) {
        rungPoints.push(strandA[i], strandB[i]);
        nodePoints.push(strandA[i], strandB[i]);
    }
    const rungGeo = new THREE.BufferGeometry().setFromPoints(rungPoints);
    const rungMat = new THREE.LineBasicMaterial({ color: blue, transparent: true, opacity: 0.22 });
    group.add(new THREE.LineSegments(rungGeo, rungMat));

    // glowing nodes
    const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodePoints);
    const nodeMat = new THREE.PointsMaterial({
        color: blue,
        size: 0.1,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    group.add(new THREE.Points(nodeGeo, nodeMat));

    // network-graph overlay: connect nearby nodes across the helix
    const networkPositions = [];
    const threshold = 1.7;
    for (let i = 0; i < nodePoints.length; i++) {
        for (let j = i + 1; j < nodePoints.length; j++) {
            if (nodePoints[i].distanceTo(nodePoints[j]) < threshold) {
                networkPositions.push(nodePoints[i], nodePoints[j]);
            }
        }
    }
    const netGeo = new THREE.BufferGeometry().setFromPoints(networkPositions);
    const netMat = new THREE.LineBasicMaterial({ color: cream, transparent: true, opacity: 0.07 });
    group.add(new THREE.LineSegments(netGeo, netMat));

    group.position.set(2.4, 0, -1);
    group.rotation.z = 0.2;

    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.0035;
        group.rotation.y = time;
        group.rotation.x += (mouseY * 0.15 - group.rotation.x) * 0.04;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        if (window.innerWidth < 900) return;
        const w = hero.clientWidth;
        const h = hero.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
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
    initHeroVisual();
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
