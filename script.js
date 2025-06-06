document.addEventListener('DOMContentLoaded', () => {
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .cta-button-nav[href^="#"], .hero-content a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            let targetId = this.getAttribute('href');
            // Ensure targetId is not just "#" to prevent errors
            if (targetId.length > 1) {
                let targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70, // Adjust for fixed header height
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Initialize Vanta.js WAVES effect ONLY on desktop
    const heroSection = document.getElementById('hero');
    if (heroSection && typeof VANTA !== 'undefined' && !isMobile && !prefersReducedMotion) {
        VANTA.WAVES({
            el: "#hero",
            mouseControls: true,
            touchControls: false, // Disabled for better performance
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x005588,      // Dark Blue from image
            shininess: 45.00,   // From image
            waveHeight: 40.00,  // From image
            waveSpeed: 0.55,    // From image
            zoom: 0.80          // From image (slider value)
        });
    } else if (heroSection && isMobile) {
        // Create simple, clean background for mobile
        heroSection.style.background = 'linear-gradient(135deg, #1C2541 0%, #0A0F1A 50%, #1C2541 100%)';
        heroSection.classList.add('mobile-hero-bg');
    }

    // Email subscription form handling
    const interestForm = document.getElementById('interest-form');
    const emailInput = document.getElementById('email-input');
    const formMessage = document.getElementById('form-message');

    if (interestForm) {
        interestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = emailInput.value;
            if (email && validateEmail(email)) {
                formMessage.textContent = 'Thank you for your interest! We will keep you updated.';
                formMessage.style.color = '#00ffff';
                emailInput.value = ''; // Clear input
            } else {
                formMessage.textContent = 'Please enter a valid email address.';
                formMessage.style.color = '#ff00ff';
            }
            setTimeout(() => {
                formMessage.textContent = '';
            }, 5000);
        });
    }

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Simplified scroll animations for mobile (or disabled entirely)
    const sections = document.querySelectorAll('.content-section, .cta-section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (isMobile || prefersReducedMotion) {
                    // Instant reveal on mobile for performance
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                } else {
                    // Smooth animation on desktop
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
                // observer.unobserve(entry.target); // Optional: stop observing once animated
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (isMobile || prefersReducedMotion) {
            // No initial transform on mobile
            section.style.opacity = 1;
            section.style.transform = 'translateY(0)';
        } else {
            // Desktop gets the smooth fade-in effect
            section.style.opacity = 0;
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        }
        observer.observe(section);
    });

    // Listen for resize to handle orientation changes
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile && heroSection && !heroSection.classList.contains('mobile-hero-bg')) {
            // Switch to mobile background if window becomes mobile-sized
            heroSection.style.background = 'linear-gradient(135deg, #1C2541 0%, #0A0F1A 50%, #1C2541 100%)';
            heroSection.classList.add('mobile-hero-bg');
        }
    });

}); 