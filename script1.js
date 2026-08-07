document.addEventListener('DOMContentLoaded', () => {

    const previewBox = document.getElementById('cursor-preview');
    const previewVideo = document.getElementById('cursor-preview-video');
    const previewCaption = document.getElementById('cursor-preview-caption');

    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    // Global sound unlock state
    let soundUnlocked = false;
    const unlockSound = () => { soundUnlocked = true; };
    document.addEventListener('click', unlockSound, { once: true });
    document.addEventListener('touchstart', unlockSound, { once: true });

    const eraContent = {
        tobey:  { src: 'media/tobey.mp4',  caption: 'ISSUE #01 — 2002–2007' },
        andrew: { src: 'media/andrew.mp4', caption: 'ISSUE #02 — 2012–2014' },
        tom:    { src: 'media/tom.mp4',    caption: 'ISSUE #03 — 2016–Present' }
    };

    let mouseX = 0;
    let mouseY = 0;

    function positionPreview() {
        if (!previewBox) return;
        const offset = 24;
        const rect = previewBox.getBoundingClientRect();
        let x = mouseX + offset;
        let y = mouseY + offset;

        if (x + rect.width > window.innerWidth) x = mouseX - rect.width - offset;
        if (y + rect.height > window.innerHeight) y = mouseY - rect.height - offset;

        previewBox.style.left = `${Math.max(0, x)}px`;
        previewBox.style.top = `${Math.max(0, y)}px`;
    }

    if (!isTouchDevice) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (previewBox && previewBox.classList.contains('active')) positionPreview();
        });
    }

    document.querySelectorAll('.issue').forEach(card => {
        const era = card.getAttribute('data-era');
        const content = eraContent[era];
        if (!content) return;

        const inlineVideo = card.querySelector('.card-inline-video');

        if (isTouchDevice) {
            // MOBILE / TOUCH INTERACTION
            card.addEventListener('click', (e) => {
                e.stopPropagation(); 
                
                // Force sound unlock since propagation is stopped
                soundUnlocked = true; 

                const isActive = card.classList.contains('touch-active');

                // Close and mute all other cards first
                document.querySelectorAll('.issue').forEach(c => {
                    c.classList.remove('touch-active');
                    const v = c.querySelector('.card-inline-video');
                    if (v) {
                        v.pause();
                        v.muted = true;
                    }
                });

                if (!isActive) {
                    card.classList.add('touch-active');
                    if (inlineVideo) {
                        // Explicitly unmute because a tap is a direct user interaction
                        inlineVideo.muted = false; 
                        inlineVideo.currentTime = 0;
                        
                        inlineVideo.play().catch(err => {
                            console.log('Mobile play error:', err);
                            // Fallback for strict iOS policies
                            inlineVideo.muted = true;
                            inlineVideo.play();
                        });
                    }
                }
            });
        } else {
            // DESKTOP HOVER INTERACTION
            const reveal = () => {
                if (!previewVideo || !previewBox) return;
                if (!previewVideo.src.endsWith(content.src)) {
                    previewVideo.src = content.src;
                }
                if (previewCaption) previewCaption.textContent = content.caption;
                previewVideo.muted = !soundUnlocked;
                previewVideo.currentTime = 0;
                previewVideo.play().catch(err => console.log('Playback error:', err));
                previewBox.classList.add('active');
                positionPreview();
            };

            const hide = () => {
                if (!previewVideo || !previewBox) return;
                previewVideo.pause();
                previewBox.classList.remove('active');
            };

            card.addEventListener('mouseenter', reveal);
            card.addEventListener('mouseleave', hide);
            card.addEventListener('focus', reveal);
            card.addEventListener('blur', hide);
        }
    });

    // Close mobile videos if tapping the background
    if (isTouchDevice) {
        document.addEventListener('click', () => {
            document.querySelectorAll('.issue').forEach(c => {
                c.classList.remove('touch-active');
                const v = c.querySelector('.card-inline-video');
                if (v) {
                    v.pause();
                    v.muted = true; // Re-mute when hiding
                }
            });
        });
    }

    document.addEventListener('mouseleave', () => {
        if (previewVideo && previewBox) {
            previewVideo.pause();
            previewBox.classList.remove('active');
        }
    });

});
