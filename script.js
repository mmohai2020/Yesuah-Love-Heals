/* =====================================================
   YESUAH'S LOVE HEALS — Main Script
   ===================================================== */

// ---- Utilities ----

function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    // Focus first focusable element for accessibility
    const focusable = modal.querySelector('input, button, select, textarea, a[href]');
    if (focusable) setTimeout(() => focusable.focus(), 50);
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
}

function closeAllModals() {
    document.querySelectorAll('.modal.is-open').forEach(m => m.classList.remove('is-open'));
    document.body.style.overflow = '';
}

// ---- Modal Wiring ----
document.addEventListener('DOMContentLoaded', () => {

    // Open buttons
    const modalTriggers = {
        'nav-give-btn':        'modal-donation',
        'mobile-give-btn':     'modal-donation',
        'give-now-btn':        'modal-donation',
        'monthly-partner-btn': 'modal-partnership',
        'speaking-btn':        'modal-speaking',
        'speaking-btn-about':  'modal-speaking',
    };
    Object.entries(modalTriggers).forEach(([btnId, modalId]) => {
        const btn = document.getElementById(btnId);
        if (btn) btn.addEventListener('click', () => openModal(modalId));
    });

    // Close buttons (data-close attribute)
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.dataset.close));
    });

    // Close on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal.id);
        });
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    // ---- Mobile Nav Overlay ----
    const navToggle  = document.getElementById('nav-toggle');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileClose   = document.getElementById('mobile-close');

    function openMobileNav() {
        mobileOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeMobileNav() {
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (navToggle) navToggle.addEventListener('click', openMobileNav);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);

    // Close mobile nav when a link is clicked
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    // ---- Navbar — transparent → solid on scroll ----
    const navbar = document.getElementById('navbar');
    function updateNavbar() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // ---- Active nav link on scroll ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 120) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }
    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // ---- Smooth scroll for all anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const offset = target.offsetTop - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || 72);
            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    });

    // ---- Scroll Reveal (Intersection Observer) ----
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ---- Stat Counter Animation ----
    const statNums = document.querySelectorAll('.stat-num[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const duration = 1800;
            const start = performance.now();
            function step(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = target;
            }
            requestAnimationFrame(step);
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    statNums.forEach(el => counterObserver.observe(el));

    // ---- Service Countdown Timer ----
    function updateCountdown() {
        const now = new Date();
        // Next Sunday at 10:30 AM CST (UTC-6)
        const nextSunday = new Date(now);
        const day = now.getDay(); // 0 = Sunday
        let daysUntil = (7 - day) % 7;
        // If today is Sunday but after 10:30 AM local, go to next Sunday
        if (day === 0 && (now.getHours() > 10 || (now.getHours() === 10 && now.getMinutes() >= 30))) {
            daysUntil = 7;
        }
        nextSunday.setDate(now.getDate() + daysUntil);
        nextSunday.setHours(10, 30, 0, 0);

        const diff = nextSunday.getTime() - now.getTime();
        const days  = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins  = Math.floor((diff % 3600000)  / 60000);

        const el = document.getElementById('service-countdown');
        if (!el) return;
        if (days > 0) {
            el.textContent = `${days}d ${hours}h ${mins}m until service`;
        } else if (hours > 0) {
            el.textContent = `${hours}h ${mins}m until service`;
        } else {
            el.textContent = `${mins}m until service`;
        }
    }
    updateCountdown();
    setInterval(updateCountdown, 60000);

    // ---- Testimonials Carousel ----
    const track  = document.getElementById('t-track');
    const dots   = document.querySelectorAll('.t-dot');
    const cards  = track ? Array.from(track.querySelectorAll('.t-card')) : [];
    let activeIndex = 0;
    let autoTimer;

    // On mobile (≤ 900px) show only one card at a time
    function isMobileCarousel() { return window.innerWidth <= 900; }

    function showSlide(index) {
        if (!isMobileCarousel()) return;
        cards.forEach((card, i) => {
            card.classList.toggle('active-slide', i === index);
            card.style.display = i === index ? 'block' : 'none';
        });
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        activeIndex = index;
    }

    function initCarousel() {
        if (isMobileCarousel()) {
            showSlide(0);
        } else {
            cards.forEach(card => { card.style.display = ''; card.classList.remove('active-slide'); });
            dots.forEach((dot, i) => dot.classList.toggle('active', i === 0));
        }
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            clearInterval(autoTimer);
            showSlide(parseInt(dot.dataset.index, 10));
            startAuto();
        });
    });

    function startAuto() {
        autoTimer = setInterval(() => {
            if (!isMobileCarousel()) return;
            showSlide((activeIndex + 1) % cards.length);
        }, 5000);
    }

    initCarousel();
    startAuto();
    window.addEventListener('resize', initCarousel);

    // ---- Generic AJAX form handler for Formspree ----
    function handleFormspreeForm(form, { onSuccess }) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalHTML = btn ? btn.innerHTML : null;

            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
            }

            try {
                const res = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (res.ok) {
                    form.reset();
                    onSuccess(btn, originalHTML);
                } else {
                    throw new Error('Server error');
                }
            } catch {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = originalHTML;
                }
                alert('Something went wrong. Please try again or email us directly.');
            }
        });
    }

    // Prayer form
    const prayerForm = document.getElementById('prayer-form');
    if (prayerForm) {
        handleFormspreeForm(prayerForm, {
            onSuccess(btn, originalHTML) {
                if (btn) {
                    btn.innerHTML = '<i class="fas fa-check"></i> Prayer submitted — God bless you!';
                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                        btn.disabled = false;
                    }, 5000);
                }
            }
        });
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        handleFormspreeForm(newsletterForm, {
            onSuccess(btn) {
                if (btn) {
                    btn.textContent = '✓ Subscribed!';
                    btn.disabled = true;
                }
            }
        });
    }

    // Speaking engagement form
    const speakingForm = document.getElementById('speaking-form');
    if (speakingForm) {
        handleFormspreeForm(speakingForm, {
            onSuccess() {
                closeModal('modal-speaking');
            }
        });
    }

});
