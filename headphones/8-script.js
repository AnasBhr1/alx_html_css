/**
 * Headphones Landing Page JavaScript
 * Enhanced Hamburger Menu Implementation
 */

class HeadphonesApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupFormValidation();
    }

    setupElements() {
        // Navigation elements
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navOverlay = document.getElementById('navOverlay');
        this.navLinks = document.querySelectorAll('.nav__link');
        this.body = document.body;

        // Form elements
        this.contactForm = document.getElementById('contactForm');
        this.formInputs = this.contactForm ? this.contactForm.querySelectorAll('.form-input') : [];

        // Animation elements
        this.animateElements = document.querySelectorAll('.animate-on-scroll');

        // State
        this.isMenuOpen = false;
        this.isClosing = false;
    }

    setupEventListeners() {
        // Hamburger menu toggle
        this.navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });

        // Overlay click to close menu
        this.navOverlay.addEventListener('click', () => {
            this.closeMenu();
        });

        // Navigation links click
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (this.isMenuOpen) {
                    this.closeMenu();
                }
                
                // Smooth scroll to section
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href);
                }
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Close menu on window resize (if desktop)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 480 && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Prevent menu close when clicking inside menu
        this.navMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    toggleMenu() {
        if (this.isClosing) return;

        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isMenuOpen = true;
        
        // Add active classes
        this.navToggle.classList.add('active');
        this.navMenu.classList.add('active');
        this.navOverlay.classList.add('active');
        this.body.classList.add('menu-open');

        // Add aria attributes for accessibility
        this.navToggle.setAttribute('aria-expanded', 'true');
        this.navMenu.setAttribute('aria-hidden', 'false');

        // Focus management
        this.navMenu.querySelector('.nav__link').focus();
    }

    closeMenu() {
        if (!this.isMenuOpen || this.isClosing) return;

        this.isClosing = true;

        // Add closing animation class
        this.navMenu.classList.add('closing');

        // Remove active classes after animation
        setTimeout(() => {
            this.navToggle.classList.remove('active');
            this.navMenu.classList.remove('active', 'closing');
            this.navOverlay.classList.remove('active');
            this.body.classList.remove('menu-open');

            // Update aria attributes
            this.navToggle.setAttribute('aria-expanded', 'false');
            this.navMenu.setAttribute('aria-hidden', 'true');

            this.isMenuOpen = false;
            this.isClosing = false;
        }, 300); // Match CSS transition duration
    }

    scrollToSection(target) {
        const targetElement = document.querySelector(target);
        if (targetElement) {
            const headerHeight = 80; // Account for fixed header
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements with animate-on-scroll class
        this.animateElements.forEach(el => {
            observer.observe(el);
        });
    }

    setupFormValidation() {
        if (!this.contactForm) return;

        // Add focus/blur animations and validation
        this.formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('form-group--focused');
            });
            
            input.addEventListener('blur', () => {
                if (input.value === '') {
                    input.parentElement.classList.remove('form-group--focused');
                }
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.value !== '') {
                    input.parentElement.classList.add('form-group--filled');
                } else {
                    input.parentElement.classList.remove('form-group--filled');
                }
                this.clearError(input);
            });
        });
        
        // Form submission
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }

    validateField(input) {
        let isValid = true;
        
        if (input.hasAttribute('required') && !input.value.trim()) {
            this.showError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                this.showError(input, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        if (isValid) {
            this.clearError(input);
        }
        
        return isValid;
    }

    showError(input, message) {
        const errorSpan = input.parentElement.querySelector('.form-error');
        errorSpan.textContent = message;
        input.parentElement.classList.add('form-group--error');
    }

    clearError(input) {
        const errorSpan = input.parentElement.querySelector('.form-error');
        errorSpan.textContent = '';
        input.parentElement.classList.remove('form-group--error');
    }

    handleFormSubmit() {
        let isValid = true;
        
        this.formInputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            this.simulateFormSubmission();
        }
    }

    simulateFormSubmission() {
        const submitBtn = this.contactForm.querySelector('.btn--submit');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'SENDING...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.textContent = 'MESSAGE SENT!';
            submitBtn.style.background = '#28a745';
            
            // Reset form after success message
            setTimeout(() => {
                this.contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                
                // Clear form states
                this.formInputs.forEach(input => {
                    input.parentElement.classList.remove('form-group--focused', 'form-group--filled');
                });
            }, 2000);
        }, 1000);
    }
}

// Utility functions for smooth animations
const AnimationUtils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Smooth scroll polyfill for older browsers
    smoothScrollTo(target, duration = 800) {
        const targetPosition = target.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = AnimationUtils.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        requestAnimationFrame(animation);
    },

    // Easing function for smooth animations
    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeadphonesApp();
    
    // Add loading class removal for smoother initial load
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Handle page visibility changes (for performance)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.classList.add('paused');
    } else {
        // Resume animations when page becomes visible
        document.body.classList.remove('paused');
    }
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HeadphonesApp, AnimationUtils };
}