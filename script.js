// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header background opacity on scroll
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (scrolled > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.8)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Form submission
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate form submission
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert('Message sent successfully! I\'ll get back to you soon.');
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

// Add typing animation to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Type and delete loop for roles
function typeDeleteLoop(element, words, { typeSpeed = 80, deleteSpeed = 50, pause = 1000 } = {}) {
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

// Create network animation
function createNetworkAnimation() {
    const networkContainer = document.querySelector('.network-lines');
    
    function createHorizontalLine() {
        const line = document.createElement('div');
        line.className = 'network-line';
        line.style.top = Math.random() * window.innerHeight + 'px';
        line.style.width = Math.random() * 300 + 200 + 'px';
        line.style.animationDelay = Math.random() * 8 + 's';
        line.style.animationDuration = (Math.random() * 4 + 6) + 's';
        networkContainer.appendChild(line);
        
        // Remove line after animation
        setTimeout(() => {
            if (line.parentNode) {
                line.parentNode.removeChild(line);
            }
        }, 12000);
    }
    
    function createVerticalLine() {
        const line = document.createElement('div');
        line.className = 'network-line-vertical';
        line.style.left = Math.random() * window.innerWidth + 'px';
        line.style.height = Math.random() * 300 + 200 + 'px';
        line.style.animationDelay = Math.random() * 10 + 's';
        line.style.animationDuration = (Math.random() * 4 + 8) + 's';
        networkContainer.appendChild(line);
        
        // Remove line after animation
        setTimeout(() => {
            if (line.parentNode) {
                line.parentNode.removeChild(line);
            }
        }, 14000);
    }
    
    function createDot() {
        const dot = document.createElement('div');
        dot.className = 'network-dot';
        dot.style.left = Math.random() * window.innerWidth + 'px';
        dot.style.top = Math.random() * window.innerHeight + 'px';
        dot.style.animationDelay = Math.random() * 2 + 's';
        networkContainer.appendChild(dot);
        
        // Remove dot after some time
        setTimeout(() => {
            if (dot.parentNode) {
                dot.parentNode.removeChild(dot);
            }
        }, 6000);
    }
    
    // Create initial network elements
    for (let i = 0; i < 3; i++) {
        setTimeout(createHorizontalLine, i * 2000);
        setTimeout(createVerticalLine, i * 2500);
    }
    
    for (let i = 0; i < 5; i++) {
        setTimeout(createDot, i * 1000);
    }
    
    // Continue creating network elements
    setInterval(createHorizontalLine, 3000);
    setInterval(createVerticalLine, 4000);
    setInterval(createDot, 2000);
}

// Initialize network animation when page loads
window.addEventListener('load', () => {
    createNetworkAnimation();
    
    const roleEl = document.getElementById('role-text');
    const roles = ['Full Stack Dev', 'AI Engineer', 'ML Engineer','Backend Dev','Frontend Dev'];
    setTimeout(() => {
        typeDeleteLoop(roleEl, roles, { typeSpeed: 80, deleteSpeed: 40, pause: 900 });
    }, 500);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.3;
    
    hero.style.transform = `translateY(${rate}px)`;
});

// Add hover effects to skill tags
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add glitch effect to logo on hover
const logo = document.querySelector('.logo');
logo.addEventListener('mouseenter', function() {
    this.style.animation = 'none';
    this.offsetHeight; // Trigger reflow
    this.style.animation = 'glitch 0.3s ease-in-out';
}); 