// ==========================================
// SMART CAMPUS - MAIN JAVASCRIPT
// ==========================================

'use strict';

// ========== VARIABLES ==========
const navbar = document.getElementById('navbar');
const mobileToggle = document.getElementById('mobile-toggle');
const mobileNav = document.getElementById('mobile-nav');
const navLinks = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-link');
const scrollTopBtn = document.getElementById('scroll-top');

// ========== NAVBAR SCROLL EFFECT ==========
function handleNavbarScroll() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// ========== MOBILE MENU TOGGLE ==========
function toggleMobileMenu() {
    mobileNav.classList.toggle('active');
    const icon = mobileToggle.querySelector('i');
    
    if (mobileNav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// ========== CLOSE MOBILE MENU ON LINK CLICK ==========
function closeMobileMenu() {
    mobileNav.classList.remove('active');
    const icon = mobileToggle.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
}

// ========== SMOOTH SCROLL TO SECTION ==========
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Update active nav link
        updateActiveNavLink(targetId);
        
        // Close mobile menu if open
        if (window.innerWidth <= 768) {
            closeMobileMenu();
        }
    }
}

// ========== UPDATE ACTIVE NAV LINK ==========
function updateActiveNavLink(targetId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// ========== SCROLL SPY ==========
function scrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ========== SCROLL TO TOP BUTTON ==========
function handleScrollTopButton() {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========== ANIMATE ON SCROLL (AOS) ==========
function animateOnScroll() {
    const elements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Add CSS for AOS animations
const style = document.createElement('style');
style.textContent = `
    [data-aos] {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    [data-aos].aos-animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    [data-aos="fade-up"] {
        opacity: 0;
        transform: translateY(50px);
    }
    
    [data-aos="fade-up"].aos-animate {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// ========== FEATURE CARDS TILT EFFECT ==========
function initTiltEffect() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });
}

function handleTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
}

function resetTilt(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
}

// ========== ENHANCED PARTICLE BACKGROUND ==========
function createParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 6 + 2;
        const colors = ['168, 85, 247', '236, 72, 153', '99, 102, 241'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(${randomColor}, ${Math.random() * 0.8 + 0.3}), transparent);
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 15 + 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
            filter: blur(${Math.random() * 2}px);
            box-shadow: 0 0 ${size * 2}px rgba(${randomColor}, 0.5);
        `;
        hero.appendChild(particle);
    }
}

// ========== INTERACTIVE CURSOR EFFECT ==========
function createCursorEffect() {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Create cursor glow
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursorGlow.style.left = cursorX + 'px';
        cursorGlow.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
}

// ========== FLOATING ORBS (Similar to Ballpit) ==========
function createFloatingOrbs() {
    const hero = document.querySelector('.hero');
    const orbCount = 15;
    
    for (let i = 0; i < orbCount; i++) {
        const orb = document.createElement('div');
        orb.classList.add('floating-orb');
        
        const size = Math.random() * 100 + 50;
        const colors = [
            'linear-gradient(135deg, #a855f7, #ec4899)',
            'linear-gradient(135deg, #3b82f6, #06b6d4)',
            'linear-gradient(135deg, #f97316, #ef4444)',
            'linear-gradient(135deg, #10b981, #059669)'
        ];
        const randomGradient = colors[Math.floor(Math.random() * colors.length)];
        
        orb.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${randomGradient};
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.3 + 0.1};
            animation: floatOrb ${Math.random() * 20 + 15}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
            filter: blur(40px);
        `;
        hero.appendChild(orb);
    }
}

// ========== COUNTER ANIMATION ==========
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasLessThan = text.includes('<');
    const number = parseInt(text.replace(/\D/g, ''));
    const duration = 2000;
    const increment = number / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        let displayText = Math.floor(current).toString();
        if (hasPlus) displayText += '+';
        if (hasLessThan) displayText = '<' + displayText + 'hrs';
        
        element.textContent = displayText;
    }, 16);
}

// ========== INITIALIZE EVERYTHING ==========
function init() {
    // Event Listeners
    window.addEventListener('scroll', () => {
        handleNavbarScroll();
        scrollSpy();
        handleScrollTopButton();
    });
    
    mobileToggle.addEventListener('click', toggleMobileMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    scrollTopBtn.addEventListener('click', scrollToTop);
    
    // Initialize features
    animateOnScroll();
    initTiltEffect();
    createParticles();
    createFloatingOrbs();
    createCursorEffect();
    animateCounters();
    
    // Initial calls
    handleNavbarScroll();
    handleScrollTopButton();
    
    console.log('🚀 Smart Campus initialized successfully!');
}

// ========== DOM CONTENT LOADED ==========
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ========== PREVENT SCROLLING WHEN MOBILE MENU IS OPEN ==========
mobileToggle.addEventListener('click', () => {
    if (mobileNav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// ========== CLOSE MOBILE MENU ON WINDOW RESIZE ==========
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
        closeMobileMenu();
        document.body.style.overflow = 'auto';
    }
});