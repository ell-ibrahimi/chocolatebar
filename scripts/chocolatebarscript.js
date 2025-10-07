(function(){
    const btn = document.querySelector('.btn');
    const modal = document.getElementById('previewModal');
    const video = document.getElementById('previewVideo');
    const closeBtn = document.getElementById('modalClose');
    let autoCloseTimer = null;
    const AUTO_CLOSE_MS = 3000; // 3 seconds

    function showModal(){
        if (!modal || !btn) return;
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        try { if (closeBtn) closeBtn.focus(); } catch (e) {}
        document.addEventListener('keydown', onKeyDown);

        // try to play the video; many browsers allow play because this is a user gesture
        if (video) {
            video.currentTime = 0;
            // listen for the natural ended event to close when video finishes
            video.addEventListener('ended', onVideoEnded);
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(()=>{ /* ignore play errors */ });
            }
        }

        // fallback auto-close after 3 seconds
        clearTimeout(autoCloseTimer);
        autoCloseTimer = setTimeout(hideModal, AUTO_CLOSE_MS);
    }

    function hideModal(){
        if (!modal) return;
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        try { btn.focus(); } catch (e) {}
        document.removeEventListener('keydown', onKeyDown);

        // stop and reset video
        if (video) {
            video.removeEventListener('ended', onVideoEnded);
            try { video.pause(); } catch (e) {}
            try { video.currentTime = 0; } catch (e) {}
        }

        clearTimeout(autoCloseTimer);
        autoCloseTimer = null;
    }

    function onKeyDown(e){
        if (e.key === 'Escape' || e.key === 'Esc') hideModal();
    }

    function onVideoEnded(){
        // Ensure modal hides when the video ends
        hideModal();
    }

    if (btn) {
        btn.addEventListener('click', showModal);
        btn.addEventListener('keydown', function(e){
            if(e.key === 'Enter' || e.key === ' ' || e.code === 'Space') { e.preventDefault(); showModal(); }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', hideModal);
        closeBtn.addEventListener('keydown', function(e){
            if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') { e.preventDefault(); hideModal(); }
        });
    }

    // click outside modal-content closes modal
    if (modal) {
        modal.addEventListener('click', function(e){
            if (e.target === modal) hideModal();
        });
    }
})();