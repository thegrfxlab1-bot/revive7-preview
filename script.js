/* ============================================
   REVIVE7 — Interactive Scripts
   Scroll animations, FAQ, Navigation
   ============================================ */

(function () {
    'use strict';

    // --- Scroll Animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseInt(el.dataset.delay) || 0;
                setTimeout(() => {
                    el.classList.add('visible');
                }, delay);
                animationObserver.unobserve(el);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => animationObserver.observe(el));

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    function handleNavScroll() {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // --- Mobile Navigation ---
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(other => {
                other.classList.remove('active');
                other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --- Timeline Fill on Scroll ---
    const timelineFill = document.getElementById('timelineFill');
    const howSection = document.getElementById('how-it-works');

    if (timelineFill && howSection) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const rect = howSection.getBoundingClientRect();
                    const sectionHeight = howSection.offsetHeight;
                    const viewportHeight = window.innerHeight;
                    const scrolled = Math.max(0, viewportHeight - rect.top);
                    const progress = Math.min(1, scrolled / sectionHeight);
                    timelineFill.style.height = (progress * 100) + '%';
                }
            });
        }, { threshold: Array.from({ length: 20 }, (_, i) => i / 20) });

        timelineObserver.observe(howSection);

        window.addEventListener('scroll', () => {
            const rect = howSection.getBoundingClientRect();
            const sectionHeight = howSection.offsetHeight;
            const viewportHeight = window.innerHeight;

            if (rect.top < viewportHeight && rect.bottom > 0) {
                const scrolled = Math.max(0, viewportHeight - rect.top);
                const progress = Math.min(1, scrolled / (sectionHeight + viewportHeight * 0.3));
                timelineFill.style.height = (progress * 100) + '%';
            }
        }, { passive: true });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Parallax Gold Glow on Hero ---
    const heroGlow = document.querySelector('.hero-glow');
    if (heroGlow) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            heroGlow.style.transform = `translate(calc(-50% + ${x}px), ${y}px)`;
        }, { passive: true });
    }

    // --- Card Tilt Effect (subtle) ---
    const tiltCards = document.querySelectorAll('.trust-card, .goal-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            card.style.transform = `translateY(-4px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // --- Counter Animation for Step Numbers ---
    const stepMarkers = document.querySelectorAll('.step-marker');

    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.animation = 'step-pop 0.5s var(--ease-spring) forwards';
                stepObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stepMarkers.forEach(marker => stepObserver.observe(marker));

    // --- Add step-pop animation dynamically ---
    const style = document.createElement('style');
    style.textContent = `
        @keyframes step-pop {
            0% { transform: scale(0.8); opacity: 0.5; }
            60% { transform: scale(1.08); }
            100% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // --- Hero Logo "7" Counter Animation ---
    const counterMask = document.getElementById('heroCounterMask');
    const counterReel = document.getElementById('heroCounterReel');

    if (counterMask && counterReel) {
        function sizeCounterDigits() {
            const logo = counterMask.closest('.hero-brand-inner').querySelector('.hero-brand-logo');
            if (!logo) return;
            const maskHeight = counterMask.offsetHeight;
            const fontSize = maskHeight * 0.95;
            counterReel.querySelectorAll('span').forEach(span => {
                span.style.height = maskHeight + 'px';
                span.style.fontSize = fontSize + 'px';
            });
        }

        function runCounterAnimation() {
            sizeCounterDigits();
            const maskHeight = counterMask.offsetHeight;
            const targetIndex = 6; // 7th item (0-indexed)
            counterReel.style.transform = `translateY(-${targetIndex * maskHeight}px)`;

            setTimeout(() => {
                counterMask.classList.add('done');
                const logo = counterMask.closest('.hero-brand-inner').querySelector('.hero-brand-logo');
                if (logo) logo.classList.add('reveal-full');
            }, 2000);
        }

        const heroBrand = counterMask.closest('.hero-brand');
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(runCounterAnimation, 400);
                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        heroObserver.observe(heroBrand);
        window.addEventListener('resize', sizeCounterDigits, { passive: true });
    }

})();
