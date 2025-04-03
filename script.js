// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializeTypedText();
    initializeCustomCursor();
    initializeSkillsProgress();
    initializeNavigation();
    initializeProjectFilters();
    initializeAnimations();
    initializeScrollEvents();
    initializeContactForm();
    initializePuzzleGrid();
    
    // Show loading screen for a minimum time
    const loadingScreen = document.querySelector('.loading-screen');
    const minLoadingTime = 5000; // 5 seconds minimum to show loading animations
    
    const startTime = new Date().getTime();
    
    // Hide loading screen when everything is loaded
    window.addEventListener('load', function() {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - startTime;
        
        // If less than minimum time has passed, wait until minimum time
        if (elapsedTime < minLoadingTime) {
            setTimeout(function() {
                loadingScreen.classList.add('fade-out');
                document.body.style.overflow = 'visible';
                
                // Remove loading screen from DOM after animation completes
                setTimeout(function() {
                    loadingScreen.remove();
                }, 500);
            }, minLoadingTime - elapsedTime);
        } else {
            loadingScreen.classList.add('fade-out');
            document.body.style.overflow = 'visible';
            
            // Remove loading screen from DOM after animation completes
            setTimeout(function() {
                loadingScreen.remove();
            }, 500);
        }
    });
    
    // Initially hide scroll to prevent seeing content while loading
    document.body.style.overflow = 'hidden';
});

// Puzzle grid interaction
function initializePuzzleGrid() {
    const puzzleContainer = document.querySelector('.puzzle-grid');
    if (!puzzleContainer) return;

    const puzzleCards = document.querySelectorAll('.puzzle-card');
    
    // Set initial rotation for animation
    puzzleCards.forEach(card => {
        // Extract the rotation from transform style
        const style = window.getComputedStyle(card);
        const transform = style.transform || style.webkitTransform;
        const matrix = new DOMMatrix(transform);
        const rotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
        
        // Store the rotation for use in animations
        card.style.setProperty('--rotate-deg', `${rotation}deg`);
        
        // Apply floating animation with different durations
        gsap.to(card, {
            y: "-=10",
            rotation: `${rotation - 2}deg`,
            duration: 1.5 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * 1
        });
        
        // Add occasional subtle rotation animation
        setInterval(() => {
            if (Math.random() > 0.7) {
                const currentRotation = parseFloat(card.style.getPropertyValue('--rotate-deg'));
                const newRotation = currentRotation + (Math.random() * 6 - 3);
                
                gsap.to(card, {
                    rotation: `${newRotation}deg`,
                    duration: 2,
                    ease: "elastic.out(1, 0.3)",
                    onComplete: () => {
                        card.style.setProperty('--rotate-deg', `${newRotation}deg`);
                    }
                });
            }
        }, 3000);
    });
    
    // Cards interact with each other on hover
    puzzleCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Find nearby cards and make them react
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            // Attract the hovered card
            gsap.to(card, {
                scale: 1.15,
                zIndex: 10,
                rotation: 0,
                duration: 0.4,
                ease: "power2.out"
            });
            
            // Make nearby cards tilt towards the hovered card
            puzzleCards.forEach(otherCard => {
                if (otherCard !== card) {
                    const otherRect = otherCard.getBoundingClientRect();
                    const otherCenterX = otherRect.left + otherRect.width / 2;
                    const otherCenterY = otherRect.top + otherRect.height / 2;
                    
                    // Calculate distance
                    const dx = otherCenterX - cardCenterX;
                    const dy = otherCenterY - cardCenterY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        // Close cards tilt towards hovered card
                        const angle = Math.atan2(dy, dx);
                        const tiltDirection = angle * (180 / Math.PI);
                        
                        gsap.to(otherCard, {
                            rotation: `${tiltDirection / 10}deg`,
                            scale: 1.05,
                            duration: 0.5,
                            ease: "power1.out",
                            overwrite: 'auto'
                        });
                    } else {
                        // Cards further away get repelled
                        const repulsionRadius = 250;
                        const repulsionFactor = Math.max(0, 1 - distance / repulsionRadius);
                        const repulsionX = dx / distance * repulsionFactor * 30;
                        const repulsionY = dy / distance * repulsionFactor * 30;
                        
                        const currentRotation = otherCard.style.getPropertyValue('--rotate-deg') || '0deg';
                        const rotationValue = parseFloat(currentRotation);
                        
                        gsap.to(otherCard, {
                            x: repulsionX,
                            y: repulsionY,
                            scale: 0.95 - repulsionFactor * 0.05,
                            rotation: `${rotationValue + (Math.random() * 8 - 4) * repulsionFactor}deg`,
                            duration: 0.5,
                            ease: "power2.out",
                            overwrite: 'auto'
                        });
                    }
                }
            });
        });
        
        // Reset on mouse leave
        card.addEventListener('mouseleave', () => {
            // Reset the hovered card
            const currentRotation = card.style.getPropertyValue('--rotate-deg');
            
            gsap.to(card, {
                scale: 1,
                rotation: currentRotation,
                duration: 0.6,
                ease: "elastic.out(1, 0.5)",
                overwrite: 'auto'
            });
            
            // Reset all cards
            puzzleCards.forEach(otherCard => {
                const otherRotation = otherCard.style.getPropertyValue('--rotate-deg');
                
                gsap.to(otherCard, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotation: otherRotation,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.5)",
                    overwrite: 'auto',
                    onComplete: () => {
                        // Restore floating animation
                        const rotation = parseFloat(otherRotation);
                        gsap.to(otherCard, {
                            y: "-=10",
                            rotation: `${rotation - 2}deg`,
                            duration: 1.5 + Math.random() * 2,
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut",
                            delay: Math.random() * 1
                        });
                    }
                });
            });
        });
    });
    
    // Click on any card to create chain reaction effect
    let isAnimating = false;
    puzzleCards.forEach(card => {
        card.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;
            
            // Create ripple effect through the cards
            const clickedCardIndex = Array.from(puzzleCards).indexOf(card);
            
            // First create a pulse effect on the clicked card
            gsap.to(card, {
                scale: 1.3,
                duration: 0.3,
                ease: "power2.out",
                onComplete: () => {
                    // Then explode all cards
                    puzzleCards.forEach((c, index) => {
                        // Calculate delay based on distance from clicked card
                        const delay = Math.abs(clickedCardIndex - index) * 0.04;
                        
                        // Random direction for explosion
                        const angle = Math.random() * Math.PI * 2;
                        const distance = 100 + Math.random() * 200;
                        const tx = Math.cos(angle) * distance;
                        const ty = Math.sin(angle) * distance;
                        
                        gsap.to(c, {
                            x: tx,
                            y: ty,
                            scale: 0,
                            opacity: 0,
                            rotation: Math.random() * 720 - 360,
                            duration: 0.8,
                            ease: "power3.out",
                            delay: delay
                        });
                    });
                    
                    // Scroll to projects after animation
                    setTimeout(() => {
                        const projectsSection = document.getElementById('projects');
                        if (projectsSection) {
                            const headerHeight = document.querySelector('header').offsetHeight;
                            const targetPosition = projectsSection.offsetTop - headerHeight;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                        
                        // Reset and bring cards back with cascade effect
                        setTimeout(() => {
                            puzzleCards.forEach((c, index) => {
                                const rotation = c.style.getPropertyValue('--rotate-deg');
                                
                                gsap.fromTo(c, 
                                    {
                                        y: -300,
                                        x: 0,
                                        opacity: 0,
                                        scale: 0.5,
                                        rotation: 0
                                    },
                                    {
                                        y: 0,
                                        opacity: 1,
                                        scale: 1,
                                        rotation: rotation,
                                        duration: 0.8,
                                        delay: 0.8 + index * 0.07,
                                        ease: "bounce.out",
                                        onComplete: () => {
                                            // Restore floating animation
                                            const rot = parseFloat(rotation);
                                            gsap.to(c, {
                                                y: "-=10",
                                                rotation: `${rot - 2}deg`,
                                                duration: 1.5 + Math.random() * 2,
                                                repeat: -1,
                                                yoyo: true,
                                                ease: "sine.inOut",
                                                delay: Math.random() * 1
                                            });
                                            
                                            if (index === puzzleCards.length - 1) {
                                                isAnimating = false;
                                            }
                                        }
                                    }
                                );
                            });
                        }, 800);
                    }, 700);
                }
            });
        });
    });
    
    // Initial animation - cards flying in with cascade effect
    puzzleCards.forEach((card, index) => {
        const rotation = card.style.getPropertyValue('--rotate-deg');
        
        gsap.fromTo(card,
            {
                y: Math.random() * 100 - 50,
                x: Math.random() * 100 - 50,
                opacity: 0,
                scale: 0,
                rotation: Math.random() * 90 - 45
            },
            {
                y: 0,
                x: 0,
                opacity: 1,
                scale: 1,
                rotation: rotation,
                duration: 0.8,
                delay: 0.1 + index * 0.08,
                ease: "back.out(1.7)",
                onComplete: () => {
                    // Start floating animation after entrance
                    const rot = parseFloat(rotation);
                    gsap.to(card, {
                        y: "-=10",
                        rotation: `${rot - 2}deg`,
                        duration: 1.5 + Math.random() * 2,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut",
                        delay: Math.random() * 1
                    });
                }
            }
        );
    });
    
    // Occasional random movement of all cards
    setInterval(() => {
        if (!isAnimating && Math.random() > 0.7) {
            puzzleCards.forEach((card, index) => {
                const smallMove = (Math.random() * 8 - 4);
                const smallRotate = (Math.random() * 4 - 2);
                const currentRotation = parseFloat(card.style.getPropertyValue('--rotate-deg'));
                
                gsap.to(card, {
                    x: smallMove,
                    y: smallMove,
                    rotation: `${currentRotation + smallRotate}deg`,
                    duration: 2,
                    ease: "sine.inOut",
                    onComplete: () => {
                        gsap.to(card, {
                            x: 0,
                            y: 0,
                            duration: 2,
                            ease: "sine.inOut"
                        });
                    }
                });
            });
        }
    }, 5000);
}

// Typed text effect for hero section
function initializeTypedText() {
    const options = {
        strings: [
            'Web Developer',
            'Frontend Engineer',
            'UI/UX Designer',
            'Creative Coder'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        cursorChar: '|'
    };

    const typed = new Typed('.typed-text', options);
}

// Custom cursor effect
function initializeCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;

    document.addEventListener('mousemove', function(e) {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
        
        gsap.to(cursorFollower, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.3
        });
    });

    // Show cursor when mouse enters the page
    document.addEventListener('mouseenter', function() {
        gsap.to([cursor, cursorFollower], {
            opacity: 1,
            duration: 0.3
        });
    });

    // Hide cursor when mouse leaves the page
    document.addEventListener('mouseleave', function() {
        gsap.to([cursor, cursorFollower], {
            opacity: 0,
            duration: 0.3
        });
    });

    // Cursor effects for links and buttons
    const links = document.querySelectorAll('a, button, .btn, input, textarea');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', function() {
            gsap.to(cursor, {
                scale: 1.5,
                duration: 0.3
            });
            
            gsap.to(cursorFollower, {
                scale: 1.5,
                duration: 0.3
            });
        });
        
        link.addEventListener('mouseleave', function() {
            gsap.to(cursor, {
                scale: 1,
                duration: 0.3
            });
            
            gsap.to(cursorFollower, {
                scale: 1,
                duration: 0.3
            });
        });
    });
}

// Animate skill progress bars
function initializeSkillsProgress() {
    const skillBars = document.querySelectorAll('.progress-bar');
    
    if (!skillBars.length) return;

    const animateSkills = () => {
        skillBars.forEach(bar => {
            const percent = bar.getAttribute('data-percent');
            gsap.to(bar, {
                width: percent + '%',
                duration: 1.5,
                ease: 'power2.out'
            });
        });
    };

    // Animate when the skills section is in view
    const skillsSection = document.querySelector('.skills');
    
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(skillsSection);
    }
}

// Mobile navigation
function initializeNavigation() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const header = document.querySelector('header');

    // Toggle navigation on mobile
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
            
            // Animate links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    });

    // Shrink header on scroll
    window.addEventListener('scroll', () => {
        if (header && window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        } else if (header) {
            header.style.padding = '';
            header.style.boxShadow = '';
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links li a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Project filtering
function initializeProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-item');
    
    if (!filterBtns.length || !projects.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter projects
            projects.forEach(project => {
                const category = project.getAttribute('data-category');
                
                if (filter === 'all' || filter === category) {
                    gsap.to(project, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                        clearProps: 'visibility',
                        onComplete: () => {
                            project.style.display = 'block';
                        }
                    });
                } else {
                    gsap.to(project, {
                        scale: 0.8,
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.out',
                        onComplete: () => {
                            project.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// Initialize AOS animations
function initializeAnimations() {
    // Initialize AOS animation library if it exists
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    // Hero section animations
    const heroText = document.querySelector('.hero-text');
    const heroRight = document.querySelector('.hero-right');
    
    if (heroText && heroRight) {
        gsap.from(heroText, {
            opacity: 0,
            x: -50,
            duration: 1,
            ease: 'power3.out'
        });
        
        gsap.from(heroRight, {
            opacity: 0,
            x: 50,
            duration: 1,
            ease: 'power3.out',
            delay: 0.3
        });
    }
}

// Smooth scrolling and scroll events
function initializeScrollEvents() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length) {
        const revealOnScroll = () => {
            revealElements.forEach(element => {
                const windowHeight = window.innerHeight;
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < windowHeight - elementVisible) {
                    element.classList.add('active');
                }
            });
        };
        
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Check for elements in view on load
    }
}

// Contact form handling
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill out all required fields.');
                return;
            }
            
            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Here you would normally send the form data to a server
            // For demonstration, we'll just log it and show a success message
            console.log('Form submitted:', { name, email, subject, message });
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Helper function to check if an element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
} 