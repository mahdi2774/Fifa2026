// FIFA World Cup Live Player - Created by Mahdi
// Smooth HLS with auto-retry, loading spinner, quality switch

(function() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const match = MATCHES.find(m => m.id === id) || MATCHES.find(m => m.status === 'live');

  const titleEl = document.getElementById('match-title');
  const container = document.getElementById('player-container');
  const infoEl = document.getElementById('stream-status');
  const loadingEl = document.getElementById('player-loading');
  const loadingText = document.getElementById('loading-text');
  const errorEl = document.getElementById('player-error');
  const errorMsg = document.getElementById('error-msg');
  const retryBtn = document.getElementById('retry-btn');

  let hls, plyr;
  let retryCount = 0;
  const MAX_RETRIES = 10;
  let retryTimer = null;

  function setStatus(text, ok = true) {
    if (infoEl) {
      infoEl.textContent = text;
      infoEl.style.color = ok ? '#00ff88' : '#ff6b6b';
    }
  }
  function showLoading(t) {
    if(loadingText && t) loadingText.textContent = t;
    if(loadingEl) loadingEl.classList.remove('hidden');
  }
  function hideLoading() {
    if(loadingEl) loadingEl.classList.add('hidden');
  }
  function showError(msg, canRetry = true) {
    if(errorEl) errorEl.classList.add('show');
    if(errorMsg) errorMsg.textContent = msg;
    if(retryBtn) retryBtn.style.display = canRetry ? 'inline-block' : 'none';
  }
  function hideError() {
    if(errorEl) errorEl.classList.remove('show');
  }

  if (!match) {
    titleEl.textContent = 'Match not found';
    container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#777;">No match selected. <a href="index.html" style="color:#00ff88;margin-left:6px">Go back</a></div>';
    hideLoading();
    return;
  }

  titleEl.innerHTML = `${match.home} vs ${match.away} <span class="live-pill">● LIVE</span>`;
  document.title = `${match.home} vs ${match.away} - FIFA Live`;

  if (!match.src) {
    hideLoading();
    container.querySelector('.player-loading')?.remove();
    const placeholder = document.createElement('div');
    placeholder.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:#888';
    placeholder.innerHTML = `<div>Stream will be available at match time</div><div style="font-size:.9em;color:#555">${formatBST(match.time)}</div>`;
    container.appendChild(placeholder);
    setStatus('Offline', false);
    return;
  }

  function destroyPlayer() {
    try { if (hls) { hls.destroy(); } } catch(e){}
    try { if (plyr) { plyr.destroy(); } } catch(e){}
    hls = null; plyr = null;
  }

  function loadHls(src) {
    destroyPlayer();
    hideError();
    showLoading(retryCount > 0 ? `Reconnecting… (${retryCount}/${MAX_RETRIES})` : 'Loading stream…');
    setStatus('Connecting…');

    // remove old video if any
    container.querySelectorAll('video, iframe').forEach(el => el.remove());

    const video = document.createElement('video');
    video.id = 'video-player';
    video.controls = true;
    video.crossOrigin = 'anonymous';
    video.playsInline = true;
    video.style.width = '100%';
    video.style.height = '100%';
    container.appendChild(video);

    const plyrOptions = {
      controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'pip', 'airplay', 'fullscreen'],
      settings: ['quality', 'speed'],
      speed: { selected: 1, options: [0.75, 1, 1.25, 1.5] },
      fullscreen: { enabled: true, fallback: true, iosNative: true },
      clickToPlay: true,
      hideControls: true
    };

    const doRetry = (reason) => {
      if (retryCount >= MAX_RETRIES) {
        showError('Stream failed after multiple retries. Check your connection.', true);
        setStatus('Failed', false);
        return;
      }
      retryCount++;
      const delay = Math.min(1500 * retryCount, 8000);
      setStatus(`Reconnecting… ${retryCount}`, false);
      showLoading(`Reconnecting… ${retryCount}/${MAX_RETRIES}`);
      showError(`Connection lost: ${reason}. Retrying in ${Math.round(delay/1000)}s…`, true);
      clearTimeout(retryTimer);
      retryTimer = setTimeout(() => loadHls(src), delay);
    };

    if (Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        maxBufferSize: 60 * 1000 * 1000,
        lowLatencyMode: true,
        backBufferLength: 30,
        enableWorker: true,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 4,
        levelLoadingTimeOut: 10000,
        fragLoadingTimeOut: 20000,
        startLevel: -1
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
        retryCount = 0;
        hideError();
        const availableQualities = hls.levels.map(l => l.height).filter(Boolean);
        availableQualities.sort((a,b) => b-a);

        if (availableQualities.length > 1) {
          plyrOptions.quality = {
            default: availableQualities[0],
            options: availableQualities,
            forced: true,
            onChange: (q) => {
              hls.levels.forEach((level, i) => {
                if (level.height === q) hls.currentLevel = i;
              });
            }
          };
        }

        plyr = new Plyr(video, plyrOptions);
        
        video.addEventListener('playing', () => { hideLoading(); setStatus('Live', true); hideError(); retryCount = 0; });
        video.addEventListener('waiting', () => { setStatus('Buffering…', true); });
        video.addEventListener('playing', () => { setStatus('Live', true); });

        // Autoplay
        plyr.play().catch(() => {
          // Autoplay blocked - show UI, user can click
          hideLoading();
          setStatus('Paused - Click to play', true);
        });
      });

      hls.on(Hls.Events.ERROR, function(event, data) {
        console.warn('HLS error', data);
        if (data.fatal) {
          switch(data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setStatus('Network error', false);
              hls.startLoad();
              doRetry('Network');
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setStatus('Recovering…', false);
              hls.recoverMediaError();
              break;
            default:
              doRetry('Fatal');
              break;
          }
        }
      });

      // Auto-retry on stall / ended unexpectedly
      video.addEventListener('stalled', () => {
        setTimeout(() => { if (video.paused || video.readyState < 2) doRetry('Stalled'); }, 4000);
      });
      video.addEventListener('error', () => doRetry('Video error'));

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS
      video.src = src;
      plyr = new Plyr(video, plyrOptions);
      video.addEventListener('playing', () => { hideLoading(); setStatus('Live', true); });
      video.addEventListener('waiting', () => setStatus('Buffering…', true));
      video.addEventListener('stalled', () => doRetry('Stalled'));
      video.addEventListener('error', () => doRetry('Error'));
      video.play().catch(()=>{});
    } else {
      hideLoading();
      showError('HLS not supported in this browser. Try Chrome / Firefox.', false);
      setStatus('Unsupported', false);
    }

    // PIP button
    const pipBtn = document.getElementById('pip-btn');
    if (pipBtn) {
      pipBtn.onclick = async () => {
        try {
          if (document.pictureInPictureElement) await document.exitPictureInPicture();
          else if (video.requestPictureInPicture) await video.requestPictureInPicture();
        } catch(e){}
      };
    }
    const reloadBtn = document.getElementById('reload-btn');
    if (reloadBtn) {
      reloadBtn.onclick = () => {
        retryCount = 0;
        loadHls(src);
      };
    }
    if (retryBtn) {
      retryBtn.onclick = () => {
        retryCount = 0;
        loadHls(src);
      };
    }
  }

  // YouTube embed
  if (match.type === 'youtube') {
    hideLoading();
    container.querySelectorAll('video').forEach(el => el.remove());
    const iframe = document.createElement('iframe');
    iframe.src = match.src;
    iframe.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.style.cssText = 'width:100%;height:100%;border:0;background:#000';
    container.appendChild(iframe);
    setStatus('Live', true);
    return;
  }

  // Iframe embed
  if (match.type === 'iframe') {
    hideLoading();
    container.querySelectorAll('video').forEach(el => el.remove());
    const iframe = document.createElement('iframe');
    iframe.src = match.src;
    iframe.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.style.cssText = 'width:100%;height:100%;border:0;background:#000';
    container.appendChild(iframe);
    setStatus('Live', true);
    return;
  }

  // HLS
  if (match.type === 'hls') {
    loadHls(match.src);
    return;
  }

  hideLoading();
  showError('Unknown stream type', false);
})();
