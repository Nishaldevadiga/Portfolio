// ---------- Three.js 3D background ----------
function initThreeBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const isSmallScreen = window.innerWidth < 768;
    const shapeCount = isSmallScreen ? 5 : 9;
    const particleCount = isSmallScreen ? 110 : 250;

    const colors = [0x8b5cf6, 0x22d3ee, 0xec4899];
    const shapes = [];
    const geometries = [
        new THREE.IcosahedronGeometry(0.6, 0),
        new THREE.OctahedronGeometry(0.55, 0),
        new THREE.TorusGeometry(0.45, 0.16, 16, 60),
        new THREE.TetrahedronGeometry(0.6, 0),
        new THREE.DodecahedronGeometry(0.5, 0)
    ];

    for (let i = 0; i < shapeCount; i++) {
        const geo = geometries[i % geometries.length];
        const mat = new THREE.MeshStandardMaterial({
            color: colors[i % colors.length],
            emissive: colors[i % colors.length],
            emissiveIntensity: 0.25,
            metalness: 0.4,
            roughness: 0.35,
            wireframe: i % 3 === 0
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 6 - 2
        );
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        mesh.userData = {
            speedX: (Math.random() - 0.5) * 0.004,
            speedY: (Math.random() - 0.5) * 0.004,
            floatSpeed: 0.3 + Math.random() * 0.4,
            floatOffset: Math.random() * Math.PI * 2,
            baseY: mesh.position.y
        };
        scene.add(mesh);
        shapes.push(mesh);
    }

    // Particle field
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 22;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0x9ca3ff,
        size: 0.035,
        transparent: true,
        opacity: 0.6
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const light1 = new THREE.PointLight(0x8b5cf6, 1.2, 20);
    light1.position.set(5, 5, 5);
    scene.add(light1);
    const light2 = new THREE.PointLight(0x22d3ee, 1, 20);
    light2.position.set(-5, -3, 4);
    scene.add(light2);

    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.pageYOffset;
    });

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        shapes.forEach((mesh) => {
            mesh.rotation.x += mesh.userData.speedX * 5;
            mesh.rotation.y += mesh.userData.speedY * 5;
            mesh.position.y = mesh.userData.baseY + Math.sin(time * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 0.4;
        });

        particles.rotation.y += 0.0006;

        camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.03;
        camera.position.y += (mouseY * 0.4 - camera.position.y) * 0.03;
        camera.position.y += (-scrollY * 0.0015 - (camera.position.y - mouseY * 0.4)) * 0;
        camera.lookAt(0, -scrollY * 0.0012, 0);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ---------- Cursor glow ----------
function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    if (!glow) return;
    window.addEventListener('mousemove', (e) => {
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
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

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
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
                    el.textContent = target + '+';
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

// ---------- 3D tilt on project cards ----------
function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach((card) => {
        card.style.transformStyle = 'preserve-3d';
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y / rect.height) - 0.5) * -10;
            const rotateY = ((x / rect.width) - 0.5) * 10;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ---------- Profile frame tilt ----------
function initProfileTilt() {
    const frame = document.querySelector('.profile-frame');
    if (!frame) return;
    frame.addEventListener('mousemove', (e) => {
        const rect = frame.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -12;
        const rotateY = ((x / rect.width) - 0.5) * 12;
        frame.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    frame.addEventListener('mouseleave', () => {
        frame.style.transform = 'rotateX(0) rotateY(0)';
    });
}

// ---------- Contact form ----------
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Message sent successfully! I\'ll get back to you soon.');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1200);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initThreeBackground();
    initCursorGlow();
    initProgressBar();
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initRoleTyping();
    initCounters();
    initTiltCards();
    initProfileTilt();
    initContactForm();
});
