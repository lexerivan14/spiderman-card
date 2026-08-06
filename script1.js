document.addEventListener('DOMContentLoaded', () => {

    const previewBox = document.getElementById('cursor-preview');
    const previewVideo = document.getElementById('cursor-preview-video');
    const previewCaption = document.getElementById('cursor-preview-caption');

    if (!previewBox || !previewVideo) return;

    // Browsers block unmuted autoplay until the user has directly clicked
    // something on the page (hovering alone doesn't count as a "gesture").
    // Start muted so the preview always plays instantly, then switch to
    // unmuted the moment the visitor clicks anywhere.
    previewVideo.muted = true;
    let soundUnlocked = false;
    document.addEventListener('click', () => { soundUnlocked = true; }, { once: true });

    // Map each issue to its own placeholder clip + caption.
    // Replace these src paths with your own local files, e.g. "media/tobey.mp4".
    const eraContent = {
        tobey:  { src: 'media/tobey.mp4',  caption: 'ISSUE #01 — 2002–2007' },
        andrew: { src: 'media/andrew.mp4', caption: 'ISSUE #02 — 2012–2014' },
        tom:    { src: 'media/tom.mp4',    caption: 'ISSUE #03 — 2016–Present' }
    };

    let mouseX = 0;
    let mouseY = 0;

    function positionPreview() {
        const offset = 24;
        const rect = previewBox.getBoundingClientRect();
        let x = mouseX + offset;
        let y = mouseY + offset;

        if (x + rect.width > window.innerWidth) x = mouseX - rect.width - offset;
        if (y + rect.height > window.innerHeight) y = mouseY - rect.height - offset;

        previewBox.style.left = `${Math.max(0, x)}px`;
        previewBox.style.top = `${Math.max(0, y)}px`;
    }

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (previewBox.classList.contains('active')) positionPreview();
    });

    document.querySelectorAll('.issue').forEach(card => {
        const era = card.getAttribute('data-era');
        const content = eraContent[era];
        if (!content) return;

        const reveal = () => {
            if (!previewVideo.src.endsWith(content.src)) {
                previewVideo.src = content.src;
            }
            previewCaption.textContent = content.caption;
            previewVideo.muted = !soundUnlocked;
            previewVideo.currentTime = 0;
            previewVideo.play().catch(err => console.log('Playback error (add a real clip at ' + content.src + '):', err));
            previewBox.classList.add('active');
            positionPreview();
        };

        const hide = () => {
            previewVideo.pause();
            previewBox.classList.remove('active');
        };

        card.addEventListener('mouseenter', reveal);
        card.addEventListener('mouseleave', hide);

        // Keyboard accessibility: focus/blur mirrors hover behavior
        card.addEventListener('focus', reveal);
        card.addEventListener('blur', hide);
    });

    document.addEventListener('mouseleave', () => {
        previewVideo.pause();
        previewBox.classList.remove('active');
    });

});