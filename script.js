// script.js

(() => {
    'use strict';

    // ---------- PRELOADER ----------
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => preloader.style.display = 'none', 500);
            }, 800);
        });
    }

    // ---------- SCROLL PROGRESS ----------
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => {
        if (!progressBar) return;
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (!height) return;
        progressBar.style.width = (winScroll / height) * 100 + '%';
    });

    // ---------- HAMBURGER MENU ----------
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    // ---------- SLOT COUNTER (localStorage simulation) ----------
    let totalSlots = 25;
    let remaining = parseInt(localStorage.getItem('bgmiRemainingSlots')) || 25;
    if (remaining > totalSlots) remaining = totalSlots;
    const remainingSpan = document.getElementById('remainingSlots');
    const slotFill = document.getElementById('slotFill');
    function updateSlotUI() {
        if (remainingSpan) remainingSpan.innerText = remaining;
        if (slotFill) slotFill.style.width = (remaining / totalSlots) * 100 + '%';
    }
    updateSlotUI();

    // ---------- REGISTRATION ARRAY ----------
    const registrations = [];

    // ---------- FORM VALIDATION + SUBMIT ----------
    const regForm = document.getElementById('registrationForm');
    if (regForm) regForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // validation
        const team = regForm.teamName.value.trim();
        const igl = regForm.iglName.value.trim();
        const bgmi = regForm.bgmiId.value.trim();
        const email = regForm.email.value.trim();
        const phone = regForm.whatsapp.value.trim();
        const terms = regForm.terms.checked;

        if (!team || !igl || !bgmi || !email || !phone || !terms) {
            alert('Please fill all required fields and accept terms.');
            return;
        }
        const phonePattern = /^[0-9]{10,12}$/;
        if (!phonePattern.test(phone)) {
            alert('Enter a valid 10-12 digit WhatsApp number.');
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Enter a valid email.');
            return;
        }

        // if slots remain
        if (remaining <= 0) {
            alert('Sorry, no slots left. Try tomorrow.');
            return;
        }

        // push to array
        const formData = { team, igl, bgmi, email, phone, timestamp: new Date() };
        registrations.push(formData);
        console.log('Registered teams:', registrations);

        // decrease slot, store in localStorage
        remaining--;
        localStorage.setItem('bgmiRemainingSlots', remaining);
        updateSlotUI();

        // success popup
        alert(`Registration successful! Welcome ${team}`);

        // redirect to whatsapp auto message
        const waMsg = `Hello%20I%20have%20registered%20my%20team%20${encodeURIComponent(team)}`;
        window.open(`https://chat.whatsapp.com/BS4wofjg0eQJGhiMbrkg3q?mode=gi_t&text=${waMsg}`, '_blank');

        // reset form
        if (regForm) regForm.reset();

        // bonus hidden admin show
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.style.display = 'block';
            setTimeout(() => (adminPanel.style.display = 'none'), 2500);
        }
    });

    // ---------- REVEAL ROOM PASSWORD (toggle blur) ----------
    const revealBtn = document.getElementById('revealBtn');
    const roomPass = document.getElementById('roomPass');
    if (revealBtn && roomPass) {
        revealBtn.addEventListener('click', () => {
            roomPass.classList.toggle('blur');
            revealBtn.innerHTML = roomPass.classList.contains('blur') ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
            if (!roomPass.classList.contains('blur')) roomPass.innerText = 'ELITE-7788 (pw: bgmi@123)';
            else roomPass.innerText = '●●●●●●●●';
        });
    }

    // ---------- SMOOTH SCROLL (already using css) but ensure buttons work
    const registerNowBtn = document.getElementById('registerNowBtn');
    if (registerNowBtn) registerNowBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector('#register');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });

    // ---------- SOUND TOGGLE (bonus) ----------
    const soundToggle = document.getElementById('soundToggle');
    const clickSound = document.getElementById('clickSound');
    let soundOn = false;
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundOn = !soundOn;
            soundToggle.innerHTML = soundOn ? '<i class="fas fa-volume-off"></i> SFX' : '<i class="fas fa-volume-up"></i> SFX';
            if (soundOn && clickSound && typeof clickSound.play === 'function') clickSound.play().catch(e => null);
        });
    }

    // play sound on any button click if enabled (optional)
    document.querySelectorAll('button, .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (soundOn && clickSound && typeof clickSound.play === 'function') clickSound.play().catch(e => null);
        });
    });

    // ---------- SCROLL REVEAL (simple intersection observer) ----------
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.style.opacity = 1, entry.target.style.transform = 'translateY(0)';
        });
    }, { threshold: 0.2 });
    sections.forEach(s => { s.style.opacity = 0; s.style.transform = 'translateY(30px)'; s.style.transition = 'all 0.6s'; observer.observe(s); });

    // ---------- INSTAGRAM & WHATSAPP REDIRECT (ensure working links) ----------
    document.querySelectorAll('a[target="_blank"]').forEach(a => {
        try {
            if (!a.href || !a.href.includes('https://chat.whatsapp.com/BS4wofjg0eQJGhiMbrkg3q?mode=gi_t')) a.href = 'https://instagram.com/crz_gaming_4'; // fallback
        } catch (e) { /* ignore */ }
    });
    // whatsapp group link (simulate dummy)
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn) whatsappBtn.href = 'https://chat.whatsapp.com/BS4wofjg0eQJGhiMbrkg3q?mode=gi_t';

    // ---------- SCROLL TOP BUTTON ----------
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---------- SIMPLE CONTACT FORM (prevent default + alert) ----------
    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thanks for contacting. We’ll reply soon.');
        contactForm.reset();
    });

    // ---------- FIX HAMBURGER CLOSE ON CLICK (mobile) ----------
    if (navLinks) navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('active')));

    // ---------- COUNTDOWN TIMER (bonus: next match) ----------
    const timerDiv = document.createElement('div');
    timerDiv.className = 'countdown-timer glass';
    timerDiv.style = 'position:fixed; bottom:80px; left:20px; background:#111a; padding:0.5rem 1rem; border-radius:50px; backdrop-filter:blur(5px); z-index:99; border:1px solid cyan;';
    document.body.appendChild(timerDiv);
    function updateCountdown() {
        const now = new Date();
        const target = new Date();
        target.setHours(21, 0, 0, 0); // 9pm
        if (now > target) target.setDate(target.getDate() + 1);
        const diff = target - now;
        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        timerDiv.innerHTML = `<i class="fas fa-clock"></i> Next match: ${hours}h ${mins}m ${secs}s`;
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

})();