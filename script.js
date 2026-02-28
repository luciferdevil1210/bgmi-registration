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
    const ownerWhatsAppNumber = '+918856984314'; // replace with actual number for direct notifications

    // ---------- LIVE TEAM PREVIEW ----------
    const previewTeam = document.getElementById('previewTeam');
    const previewIgl = document.getElementById('previewIgl');
    const previewBgmi = document.getElementById('previewBgmi');
    const previewPhone = document.getElementById('previewPhone');
    const previewCity = document.getElementById('previewCity');
    const previewMode = document.getElementById('previewMode');

    function setPreviewValue(element, value, fallback) {
        if (!element) return;
        element.innerText = value ? value : fallback;
    }

    function syncTeamPreview(form) {
        if (!form) return;
        setPreviewValue(previewTeam, form.teamName.value.trim(), 'Not provided');
        setPreviewValue(previewIgl, form.iglName.value.trim(), 'Not provided');
        setPreviewValue(previewBgmi, form.bgmiId.value.trim(), 'Not provided');
        setPreviewValue(previewPhone, form.whatsapp.value.trim(), 'Not provided');
        setPreviewValue(previewCity, form.city.value.trim(), 'Not provided');
        setPreviewValue(previewMode, form.matchType.value, 'Not selected');
    }

    // ---------- FORM VALIDATION + SUBMIT ----------
    const regForm = document.getElementById('registrationForm');
    if (regForm) {
        regForm.querySelectorAll('input, select').forEach((field) => {
            field.addEventListener('input', () => syncTeamPreview(regForm));
            field.addEventListener('change', () => syncTeamPreview(regForm));
        });
        syncTeamPreview(regForm);
    }

    if (regForm) regForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // validation
        const team = regForm.teamName.value.trim();
        const igl = regForm.iglName.value.trim();
        const bgmi = regForm.bgmiId.value.trim();
        const email = regForm.email.value.trim();
        const phone = regForm.whatsapp.value.trim();
        const city = regForm.city.value.trim();
        const matchType = regForm.matchType.value;
        const terms = regForm.terms.checked;

        if (!team || !igl || !bgmi || !email || !phone || !city || !matchType || !terms) {
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
        const formData = { team, igl, bgmi, email, phone, city, matchType, timestamp: new Date() };
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

        // send complete registration info directly to authorized owner
        const ownerMessage = [
            '🏆 New BGMI Team Registration',
            `Team: ${team}`,
            `IGL: ${igl}`,
            `BGMI ID: ${bgmi}`,
            `Email: ${email}`,
            `WhatsApp: ${phone}`,
            `Location: ${city}`,
            `Mode: ${matchType}`,
            `Submitted: ${new Date().toLocaleString()}`
        ].join('\n');
        const waLink = `https://wa.me/${ownerWhatsAppNumber}?text=${encodeURIComponent(ownerMessage)}`;
        window.open(waLink, '_blank');

        // reset form
        if (regForm) regForm.reset();
        syncTeamPreview(regForm);

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
        document.getElementById('registrationForm').scrollIntoView({ behavior: 'smooth' });
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thanks for reaching out! We will respond soon.');
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