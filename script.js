// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mobile navigation toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        navToggle.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            bar.style.transform = navToggle.classList.contains('active') 
                ? `rotate(${index === 1 ? 0 : index === 0 ? 45 : -45}deg) translateY(${index === 1 ? 0 : index === 0 ? 8 : -8}px)`
                : 'none';
        });
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
            
            // Reset hamburger bars
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.9)';
        navbar.style.backdropFilter = 'blur(20px)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Special animations for different elements
            if (entry.target.classList.contains('feature-card')) {
                entry.target.style.animationDelay = entry.target.dataset.delay || '0ms';
                entry.target.classList.add('animate-in');
            }
            
            if (entry.target.classList.contains('stat-item')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .step, .stat-item, .contact-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Counter animation for stats
function animateCounter(element) {
    const numberElement = element.querySelector('.stat-number');
    if (!numberElement || numberElement.dataset.animated) return;
    
    const finalNumber = numberElement.textContent;
    const isPercentage = finalNumber.includes('%');
    const hasPlus = finalNumber.includes('+');
    const isRatio = finalNumber.includes('/');
    
    let numericValue = parseInt(finalNumber.replace(/[^\d]/g, ''));
    
    if (isNaN(numericValue)) return;
    
    numberElement.dataset.animated = 'true';
    let currentValue = 0;
    const increment = numericValue / 50;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(currentValue);
        if (finalNumber.includes('K')) {
            displayValue = Math.floor(currentValue) + 'K';
        } else if (finalNumber.includes('M')) {
            displayValue = Math.floor(currentValue) + 'M';
        } else if (isPercentage) {
            displayValue = Math.floor(currentValue) + '%';
        } else if (hasPlus) {
            displayValue = Math.floor(currentValue) + '+';
        } else if (isRatio) {
            displayValue = Math.floor(currentValue) + '/7';
        }
        
        if (finalNumber === '24/7') {
            displayValue = '24/7';
            clearInterval(timer);
        }
        
        numberElement.textContent = displayValue;
    }, 50);
}

// Form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('.form-submit');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success state
        submitButton.innerHTML = '<i class="fas fa-check"></i> <span>Sent Successfully!</span>';
        submitButton.style.background = 'linear-gradient(135deg, #00ff80 0%, #00cc66 100%)';
        
        // Reset form
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            submitButton.style.background = '';
        }, 3000);
        
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00ff80 0%, #00cc66 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
        color: white;
        padding: 16px 24px;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        max-width: 400px;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background 0.3s ease;
        }
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Parallax effect for floating cards
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.floating-card');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    cards.forEach((card, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX - 0.5) * speed * 20;
        const y = (mouseY - 0.5) * speed * 20;
        
        card.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Add mobile menu styles dynamically
const mobileMenuStyles = document.createElement('style');
mobileMenuStyles.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 80px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 80px);
            background: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(20px);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 60px;
            transition: left 0.3s ease;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .nav-menu.show {
            left: 0;
        }
        
        .nav-link {
            font-size: 24px;
            margin: 20px 0;
            padding: 16px 32px;
            border-radius: 12px;
            transition: all 0.3s ease;
        }
        
        .nav-link:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .nav-toggle.active .bar:nth-child(1) {
            transform: rotate(45deg) translateY(8px);
        }
        
        .nav-toggle.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active .bar:nth-child(3) {
            transform: rotate(-45deg) translateY(-8px);
        }
    }
`;
document.head.appendChild(mobileMenuStyles);

// Smooth scroll for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add a fun easter egg
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        triggerEasterEgg();
        konamiCode = [];
    }
});

function triggerEasterEgg() {
    // Create rainbow effect
    document.body.style.animation = 'rainbow 2s infinite';
    
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);
    
    showNotification('🎉 Konami Code activated! You found the secret!', 'success');
    
    // Reset after 5 seconds
    setTimeout(() => {
        document.body.style.animation = '';
        rainbowStyle.remove();
    }, 5000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Add some random sparkle effects
    createSparkles();
});

// Sparkle effect function
function createSparkles() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createSparkle();
        }, Math.random() * 5000);
    }
}

function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.cssText = `
        position: fixed;
        pointer-events: none;
        font-size: ${Math.random() * 20 + 10}px;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        z-index: 9999;
        animation: sparkleFloat 3s ease-out forwards;
    `;
    
    const sparkleKeyframes = document.createElement('style');
    sparkleKeyframes.textContent = `
        @keyframes sparkleFloat {
            0% { 
                opacity: 1; 
                transform: translateY(0) rotate(0deg) scale(0);
            }
            50% { 
                opacity: 1; 
                transform: translateY(-50px) rotate(180deg) scale(1);
            }
            100% { 
                opacity: 0; 
                transform: translateY(-100px) rotate(360deg) scale(0);
            }
        }
    `;
    
    document.head.appendChild(sparkleKeyframes);
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
        sparkleKeyframes.remove();
    }, 3000);
}

// Periodic sparkles
setInterval(() => {
    if (Math.random() < 0.1) { // 10% chance every interval
        createSparkle();
    }
}, 2000);

console.log('🚀 Prompt Solve website loaded! Try the Konami Code for a surprise!'); 