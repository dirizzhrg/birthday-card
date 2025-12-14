document.addEventListener('DOMContentLoaded', () => {
// =================================================
// =========== NAVIGATION LOGIC ====================
// =================================================
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const mainSong = document.getElementById('birthday-song'); // << เพลงหลัก
const hbdSong = document.getElementById('hbd-song');     // << เพลง HBD

function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

if (pages.length > 0 && navLinks.length > 0) {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            // --- จัดการเพลง ---
            if (mainSong) mainSong.pause(); // หยุดเพลงหลักเสมอเมื่อเปลี่ยนหน้า
            if (hbdSong) hbdSong.pause();  // หยุดเพลง HBD เสมอเมื่อเปลี่ยนหน้า

            if (targetId === 'cake') {
                // ถ้าไปหน้าเค้ก -> เล่นเพลง HBD
                if (hbdSong) {
                    hbdSong.currentTime = 0;
                    hbdSong.play();
                }
            } else {
                // ถ้าไปหน้าอื่น -> กลับไปเล่นเพลงหลัก (ถ้ามี)
                // (Note: เพลงหลักจะเริ่มเล่นจริงๆ ตอนกด Welcome Overlay)
                // เราแค่เตรียมให้มันเล่นถ้าผู้ใช้กดกลับมา
                if (mainSong && !document.getElementById('welcome-overlay') || document.getElementById('welcome-overlay').classList.contains('hidden') ) {
                   // เล่นเพลงหลักต่อ ถ้าหน้า welcome หายไปแล้ว
                   mainSong.play();
                }
            }
            // ------------------

            // แสดงหน้าที่เลือก
            if (targetId === 'main-menu') {
                showPage('main-menu');
            } else {
                showPage(targetId);
            }
        });
    });

    // แสดงหน้าเมนูหลักตอนเริ่ม (ถ้าอยู่หน้านี้)
    if (document.getElementById('main-menu-page')) {
        showPage('main-menu');
    }
}

    // =================================================
    // =========== LOGIN PAGE LOGIC ====================
    // =================================================
// --- LOGIN PAGE LOGIC ---
const passwordDisplay = document.getElementById('password-display');
const keypad = document.querySelector('.keypad');
const heartExplosionContainer = document.getElementById('heart-explosion-container'); // << เพิ่ม container

if (keypad) {
    const correctPassword = '211225'; // << แก้ไขรหัสผ่านตรงนี้
    let enteredPassword = '';

    keypad.addEventListener('click', (e) => {
        if (e.target.classList.contains('key')) {
            const key = e.target.textContent;
            if (key === 'C') {
                enteredPassword = '';
            } else if (key === 'OK') {
                if (enteredPassword === correctPassword) {
                    // --- 1. สั่งให้หัวใจระเบิด ---
                    if (heartExplosionContainer) {
                        // สร้างหัวใจหลายๆ ดวง
                        heartExplosionContainer.innerHTML = ''; // เคลียร์ของเก่า
                        for (let i = 0; i < 100; i++) { // สร้าง 20 ดวง
                            const heart = document.createElement('div');
                            heart.classList.add('explosion-heart');

                            // สุ่มทิศทางที่จะพุ่งไป
                            const angle = Math.random() * Math.PI * 2;
                            const distance = Math.random() * 300 + 200; // ระยะทาง 100-250px
                            const tx = `${Math.cos(angle) * distance}px`;
                            const ty = `${Math.sin(angle) * distance - 50}px`; // -50 ให้มันดูลอยขึ้นนิดๆ

                            heart.style.setProperty('--tx', tx);
                            heart.style.setProperty('--ty', ty);

                            heartExplosionContainer.appendChild(heart);
                        }
                        // เพิ่ม class 'explode' เพื่อเริ่ม animation
                        heartExplosionContainer.classList.add('explode');

                        // ลบ class ออกหลังจาก animation จบ (เผื่อกดซ้ำ)
                         setTimeout(() => {
                             heartExplosionContainer.classList.remove('explode');
                         }, 800); // 800ms คือระยะเวลา animation
                    }
                    // --------------------------

                    sessionStorage.setItem('unlocked', 'true');

                    // --- 2. หน่วงเวลาเปลี่ยนหน้าให้นานขึ้นนิดหน่อย ---
                    setTimeout(() => {
                        window.location.href = 'menu.html';
                    }, 800); // หน่วง 0.8 วินาที ให้ animation เล่น

                } else {
                    alert('รหัสไม่ถูกต้อง ลองใหม่อีกครั้งนะ');
                    enteredPassword = '';
                }
            } else if (enteredPassword.length < 6) {
                enteredPassword += key;
            }
            passwordDisplay.textContent = '•'.repeat(enteredPassword.length);
        }
    });
}

    // =================================================
    // =========== OTHER PAGES LOGIC ===================
    // =================================================

    // --- Music Player Logic ---
    const song = document.getElementById('birthday-song');
    const welcomeOverlay = document.getElementById('welcome-overlay');
    if (sessionStorage.getItem('unlocked') === 'true' && song && welcomeOverlay) {
        welcomeOverlay.addEventListener('click', () => {
            song.play();
            welcomeOverlay.classList.add('hidden');
            sessionStorage.removeItem('unlocked');
        }, { once: true });
    } else {
        if (welcomeOverlay) {
            welcomeOverlay.style.display = 'none';
        }
    }

// --- Calendar Page Logic ---
const countdownElement = document.getElementById('countdown');
const timeSinceElement = document.getElementById('time-since'); // << บล็อกใหม่

if (countdownElement && timeSinceElement) {
    // !!! 📌 วันครบรอบ (แก้ตรงนี้) !!!
    const anniversaryDate = new Date('Oct 6, 2026 00:00:00').getTime();

    // !!! 📌 วันที่เจอกันครั้งแรก (แก้ตรงนี้ - ใช้ข้อมูลจากคุณ) !!!
    const metDate = new Date('Oct 6, 2025 00:00:00').getTime(); // << 🚨🚨🚨 ใส่วันที่เจอกันตรงนี้ 🚨🚨🚨

    const updateCounters = setInterval(() => {
        const now = new Date().getTime();

        // --- 1. คำนวณ Countdown วันครบรอบ ---
        const distanceAnniversary = anniversaryDate - now;
        if (distanceAnniversary >= 0) {
            const days = Math.floor(distanceAnniversary / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distanceAnniversary % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distanceAnniversary % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distanceAnniversary % (1000 * 60)) / 1000);
            document.getElementById('days').innerText = days;
            document.getElementById('hours').innerText = hours;
            document.getElementById('minutes').innerText = minutes;
            document.getElementById('seconds').innerText = seconds;
        } else {
             document.getElementById('countdown').innerHTML = "ถึงวันครบรอบแล้ว!";
        }

        // --- 2. คำนวณเวลาตั้งแต่เจอกัน ---
        const distanceSince = now - metDate;
        if (distanceSince >= 0) {
             const sinceDays = Math.floor(distanceSince / (1000 * 60 * 60 * 24));
             const sinceHours = Math.floor((distanceSince % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
             const sinceMinutes = Math.floor((distanceSince % (1000 * 60 * 60)) / (1000 * 60));
             const sinceSeconds = Math.floor((distanceSince % (1000 * 60)) / 1000);
             document.getElementById('since-days').innerText = sinceDays;
             document.getElementById('since-hours').innerText = sinceHours;
             document.getElementById('since-minutes').innerText = sinceMinutes;
             document.getElementById('since-seconds').innerText = sinceSeconds;
        }

    }, 1000);
}
    // --- Monthly Calendar Modal Logic ---
    const monthlyMemories = [
        { month: 'ม.ค.', image: 'jan.jpg' }, { month: 'ก.พ.', image: 'feb.jpg' },
        { month: 'มี.ค.', image: 'mar.jpg' }, { month: 'เม.ย.', image: 'apr.jpg' },
        { month: 'พ.ค.', image: 'may.jpg' }, { month: 'มิ.ย.', image: 'jun.jpg' },
        { month: 'ก.ค.', image: 'jul.jpg' }, { month: 'ส.ค.', image: 'aug.jpg' },
        { month: 'ก.ย.', image: 'sep.jpg' }, { month: 'ต.ค.', image: 'oct.jpg' },
        { month: 'พ.ย.', image: 'nov.jpg' }, { month: 'ธ.ค.', image: 'dec.jpg' }
    ];
    const openModalBtn = document.getElementById('open-monthly-modal');
    const closeModalBtn = document.getElementById('close-monthly-modal');
    const modalOverlay = document.getElementById('monthly-modal-overlay');
    const monthGrid = document.getElementById('month-grid');
    const monthlyImage = document.getElementById('monthly-image');
    if (openModalBtn) {
        monthGrid.innerHTML = '';
        monthlyMemories.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'month-btn';
            btn.textContent = item.month;
            btn.dataset.image = item.image;
            monthGrid.appendChild(btn);
        });
        const monthButtons = monthGrid.querySelectorAll('.month-btn');
        if (monthButtons.length > 0) {
            monthButtons[0].classList.add('active');
            monthlyImage.src = monthButtons[0].dataset.image;
        }
        monthButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                monthlyImage.src = btn.dataset.image;
                monthButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        openModalBtn.addEventListener('click', () => { modalOverlay.style.display = 'flex'; });
        closeModalBtn.addEventListener('click', () => { modalOverlay.style.display = 'none'; });
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) { modalOverlay.style.display = 'none'; }
        });
    }

// --- Puzzle Game Logic ---
const puzzleContainer = document.getElementById('puzzle-container');
if (puzzleContainer) {
    // --- เพิ่มตัวแปรเสียงสำหรับเกม ---
    const flipSound = document.getElementById('flip-sound');
    const matchSound = document.getElementById('match-sound');
    const noMatchSound = document.getElementById('no-match-sound');
    const winSound = document.getElementById('win-sound');
    // ---------------------------------

    const images = ['puzzle1.jpg', 'puzzle2.jpg', 'puzzle3.jpg', 'puzzle4.jpg', 'puzzle5.jpg', 'puzzle6.jpg', 'puzzle7.jpg', 'puzzle8.jpg'];
    const cardSources = [...images, ...images];
    cardSources.sort(() => 0.5 - Math.random());
    let flippedCards = [];
    let matchedPairs = 0;

    // --- เคลียร์การ์ดเก่าก่อนเริ่ม ---
    puzzleContainer.innerHTML = '';

    cardSources.forEach(src => {
        const card = document.createElement('div');
        card.classList.add('puzzle-card');
        card.dataset.src = src;
        card.innerHTML = `<div class="card-face card-front">?</div><div class="card-face card-back"><img src="${src}" alt="Puzzle Image"></div>`;
        puzzleContainer.appendChild(card);

        card.addEventListener('click', () => {
            if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
                // << เล่นเสียงพลิกการ์ด >>
                if(flipSound) { flipSound.currentTime = 0; flipSound.play(); }

                card.classList.add('flipped');
                flippedCards.push(card);
                if (flippedCards.length === 2) {
                    setTimeout(checkForMatch, 1000);
                }
            }
        });
    });

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.src === card2.dataset.src) {
            // --- กรณีจับคู่ถูก ---
            // << เล่นเสียงจับคู่ถูก >>
            if(matchSound) { matchSound.currentTime = 0; matchSound.play(); }

            matchedPairs++;
            if (matchedPairs === images.length) {
                document.getElementById('win-message').textContent = '061025 คือวันที่เราเจอกันวันแรกนะ ดีใจมากๆ (รหัสเข้าอ่านจดหมาย)';
                // << เล่นเสียงชนะเกม >>
                if(winSound) { winSound.currentTime = 0; winSound.play(); }
            }
        } else {
            // --- กรณีจับคู่ผิด ---
            // << เล่นเสียงจับคู่ผิด >>
            if(noMatchSound) { noMatchSound.currentTime = 0; noMatchSound.play(); }

            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }
        flippedCards = [];
    }
}
    // --- Letter Page Logic ---
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    const letterContent = document.getElementById('letter-content');
        const flipSound = document.getElementById('flip-sound'); // << ✨ เพิ่มบรรทัดนี้
if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', () => {
        // --- ✨ เล่นเสียงก่อนเปิด ---
        if (flipSound) {
            flipSound.currentTime = 0;
            flipSound.play();
        }
        // ------------------------

        envelopeWrapper.classList.add('open');
        setTimeout(() => {
            envelopeWrapper.style.display = 'none';
            letterContent.classList.remove('hidden');
        }, 2000);
    });
}
// --- Letter Password Modal Logic ---
const openLetterModalBtn = document.getElementById('open-letter-modal');
const letterPasswordOverlay = document.getElementById('letter-password-overlay');
const letterPasswordOk = document.getElementById('letter-password-ok');
const letterPasswordCancel = document.getElementById('letter-password-cancel');
const letterPasswordInput = document.getElementById('letter-password-input');
const matchSound = document.getElementById('match-sound'); // << ✨ เพิ่มบรรทัดนี้
const correctLetterPassword = '061025'; // รหัสเดียวกับหน้าแรก

if (openLetterModalBtn) {
    // 1. เปิด Modal
    openLetterModalBtn.addEventListener('click', () => {
        letterPasswordInput.value = ''; // เคลียร์ค่าเก่า
        letterPasswordOverlay.style.display = 'flex';
    });

    // 2. ปิด Modal
    function closeLetterModal() {
        letterPasswordOverlay.style.display = 'none';
    }
    letterPasswordCancel.addEventListener('click', closeLetterModal);
    letterPasswordOverlay.addEventListener('click', (e) => {
        if (e.target === letterPasswordOverlay) {
            closeLetterModal();
        }
    });

    // 3. ตรวจสอบรหัส
letterPasswordOk.addEventListener('click', () => {
    if (letterPasswordInput.value === correctLetterPassword) {
        // --- ✨ เล่นเสียงก่อน ---
        if (matchSound) {
            matchSound.currentTime = 0;
            matchSound.play();
        }
        // --------------------

        // --- ✨ หน่วงเวลาก่อนไปหน้าจดหมาย ---
        setTimeout(() => {
            closeLetterModal();
            showPage('letter');
        }, 300); // หน่วง 0.3 วินาที
        // ---------------------------------

    } else {
        alert('รหัสไม่ถูกต้อง ลองอีกครั้งนะ!');
        letterPasswordInput.value = '';
        // (อาจจะเพิ่มเสียง "ผิดพลาด" ตรงนี้ก็ได้ ถ้าต้องการ)
        // if(noMatchSound) { noMatchSound.currentTime = 0; noMatchSound.play(); }
    }
});

    // (แถม) กด Enter เพื่อตกลง
    letterPasswordInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            letterPasswordOk.click();
        }
    });
}
// --- Cake Game Logic ---
const cakePage = document.getElementById('cake-page');
if (cakePage) {
    const cakeContainer = cakePage.querySelector('.cake-container');
    const winMessage = document.getElementById('cake-win-message');
    const confettiContainer = document.getElementById('confetti-container');
    const blowSound = document.getElementById('blow-sound');
    const winSound = document.getElementById('win-sound');
    const hbdWishSound = document.getElementById('hbd-wish'); // << เสียงอวยพร

    const candlePositions = [
        [5, 28], [0, 38], [-1, 48], [0, 58], [5, 68] ];
    let flames = [];

    function setupCakeGame() {
        cakeContainer.innerHTML = '<img src="cake.png" alt="Birthday Cake">';
        winMessage.classList.add('hidden');
        confettiContainer.innerHTML = '';
        flames = [];
        candlePositions.forEach(pos => {
            const candle = document.createElement('div');
            candle.className = 'candle';
            candle.style.top = pos[0] + '%';
            candle.style.left = pos[1] + '%';
            const flame = document.createElement('div');
            flame.className = 'flame';
            candle.appendChild(flame);
            cakeContainer.appendChild(candle);
            flames.push(flame);
        });
        flames.forEach(flame => {
            flame.addEventListener('click', () => {
                if (blowSound) {
                    blowSound.currentTime = 0;
                    blowSound.play();
                }
                flame.classList.add('out');
                checkWin();
            });
        });
    }

    function checkWin() {
        const allOut = flames.every(f => f.classList.contains('out'));
        if (allOut) {
            // เล่นเสียง Win ก่อน
            if (winSound) {
                winSound.currentTime = 0;
                winSound.play();
            }

            // หน่วงเวลาเล็กน้อยแล้วค่อยเล่นเสียงอวยพร
            setTimeout(() => {
                if (hbdWishSound) {
                    hbdWishSound.currentTime = 0;
                    hbdWishSound.play();
                }
            }, 0); // หน่วง 1 วินาที (1000ms)

            winMessage.classList.remove('hidden');
            launchConfetti();
        }
    }

    function launchConfetti() {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            const colors = ['#ff8a8a', '#ffdada', '#fff0f0', '#fdf5e6', '#d4af37'];
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confettiContainer.appendChild(confetti);
        }
    }

    document.querySelectorAll('a[href="#cake"]').forEach(link => {
        link.addEventListener('click', setupCakeGame);
    });
}
// --- Proposal Page Intro Animation & Form Logic ---
const proposalPage = document.getElementById('proposal-page');
const introLines = document.querySelectorAll('#proposal-intro-text .intro-line');
const proposalForm = document.getElementById('proposal-form');
const proposalLink = document.querySelector('a[href="#proposal"]'); // ปุ่มเมนู Proposal

if (proposalPage && introLines.length > 0 && proposalForm && proposalLink) {

    function startProposalAnimation() {
        // 1. ซ่อนฟอร์ม และ รีเซ็ตข้อความ intro ก่อน
        proposalForm.classList.add('hidden');
        proposalForm.style.display = 'none'; // ซ่อนสนิท
        introLines.forEach(line => line.classList.remove('visible'));

        // 2. แสดงข้อความ Intro ทีละบรรทัด
        let delay = 500; // เริ่มดีเลย์ 0.5 วินาที
        introLines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('visible');
            }, delay);
            delay += 1500; // เพิ่มดีเลย์ 1 วินาทีสำหรับบรรทัดต่อไป
        });

        // 3. แสดงฟอร์มหลังจากข้อความสุดท้ายปรากฏ + อีกนิดหน่อย
        setTimeout(() => {
            proposalForm.style.display = 'block'; // ทำให้มองเห็นได้ก่อน fade in
            // หน่วงอีกนิดเพื่อให้ display มีผลก่อนเริ่ม transition
            requestAnimationFrame(() => { 
                proposalForm.classList.remove('hidden');
            });
        }, delay - 1500); // แสดงฟอร์มเร็วขึ้นเล็กน้อย
    }

    // --- เพิ่ม Event Listener ให้กับปุ่มเมนู ---
    proposalLink.addEventListener('click', (e) => {
        // ไม่ต้อง preventDefault เพราะ Navigation Logic จัดการแล้ว

        // รอให้หน้า proposal แสดงขึ้นมาก่อน แล้วค่อยเริ่ม animation
        // ใช้ setTimeout เล็กน้อยเพื่อให้ showPage ทำงานเสร็จก่อน
        setTimeout(startProposalAnimation, 50); 
    });

    // --- (ถ้าต้องการ) เริ่ม Animation ถ้าเข้าหน้านี้โดยตรง (เผื่อกรณีรีเฟรช) ---
    // ใช้ MutationObserver เพื่อตรวจจับว่าหน้านี้ active หรือยัง
    const observer = new MutationObserver((mutationsList) => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (proposalPage.classList.contains('active')) {
                   // ถ้าหน้านี้เพิ่ง active (แต่ไม่ใช่การกดลิงก์ครั้งแรก) ให้เริ่ม animation
                   // อาจจะต้องเช็คเงื่อนไขเพิ่มเติม ถ้าไม่อยากให้มันเล่นซ้ำตอนกดกลับมา
                   // startProposalAnimation(); // << ถ้าอยากให้เล่นซ้ำตอนกลับมา ให้ uncomment บรรทัดนี้
                }
            }
        }
    });
    observer.observe(proposalPage, { attributes: true });

    // --- ส่วนของ Formspree (ไม่ต้องแก้ไข ถ้าใส่ action ใน HTML ถูกแล้ว) ---
    // Formspree จะทำงานอัตโนมัติเมื่อกดปุ่ม type="submit"
}
    // --- Floating Hearts Background Logic ---
    const heartsContainer = document.getElementById('background-hearts');
    if (heartsContainer) {
        setInterval(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = Math.random() * 8 + 7 + 's';
            const scale = Math.random() * 0.8 + 0.4;
            heart.style.transform = `scale(${scale}) rotate(-45deg)`;
            heart.style.opacity = Math.random() * 0.5 + 0.3;
            heartsContainer.appendChild(heart);
            setTimeout(() => {
                heart.remove();
            }, 15000);
        }, 500);
    }
    
    // --- Sound Logic (แยกเสียง) ---
    const clickSound = document.getElementById('click-sound');
    const keyPressSound = document.getElementById('key-press-sound');
    const generalButtons = document.querySelectorAll('.menu-button, .back-button, .key.enter, .key.clear');
    if (clickSound && generalButtons.length > 0) {
        generalButtons.forEach(button => {
            button.addEventListener('click', () => {
                clickSound.volume = 0.5;
                clickSound.currentTime = 0;
                clickSound.play();
            });
        });
    }
    const keypadNumberButtons = document.querySelectorAll('.key:not(.enter):not(.clear)');
    if (keyPressSound && keypadNumberButtons.length > 0) {
        keypadNumberButtons.forEach(button => {
            button.addEventListener('click', () => {
                keyPressSound.volume = 0.7;
                keyPressSound.currentTime = 0;
                keyPressSound.play();
            });
        });
    }
});