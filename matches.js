// FIFA World Cup Live - Match Data
// Created by Mahdi
// 
// HOW TO ADD/EDIT STREAMS:
// 1. Find the match below
// 2. Set type: "youtube" | "hls" | "iframe"
// 3. Set src: your stream URL
// 
// Tested working HLS URLs (HTTPS, CORS-friendly):
// - https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
// - https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8
// - https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8
// Live test: https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8
// 
// YouTube: src: "https://www.youtube.com/embed/VIDEO_ID?autoplay=1"
// iframe:  src: "https://example.com/embed/123"

const MATCHES = [
  {
    id: "wc1",
    home: "Argentina",
    away: "Brazil",
    competition: "FIFA World Cup",
    time: "2026-06-21T00:00:00+06:00", // Bangladesh Time (BST, UTC+6)
    status: "live",
    type: "iframe",
    src: "https://8.kooralive360.com/albaplayer/bein-sports-hd-1/?serv=10"
  },
  {
    id: "wc2",
    home: "France",
    away: "Spain",
    competition: "FIFA World Cup",
    time: "2026-06-21T02:30:00+06:00",
    status: "live",
    type: "iframe",
    src: "https://cswc6.blogspot.com/p/match1.html"
  },
  {
    id: "wc3",
    home: "England",
    away: "Germany",
    competition: "FIFA World Cup",
    time: "2026-06-21T22:00:00+06:00",
    status: "live",
    type: "iframe", // Changed to iframe to correctly process the blogspot web URL structure
    src: "https://cswc6.blogspot.com/p/match1.html"
  },
  {
    id: "wc4",
    home: "Portugal",
    away: "Morocco",
    competition: "FIFA World Cup",
    time: "2026-06-22T01:00:00+06:00",
    status: "upcoming",
    type: "hls",
    src: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
  },
  {
    id: "wc5",
    home: "Japan",
    away: "Croatia",
    competition: "FIFA World Cup",
    time: "2026-06-22T21:00:00+06:00",
    status: "upcoming",
    type: "hls",
    src: "" // Add stream link when available
  },
  {
    id: "wc6",
    home: "Netherlands",
    away: "USA",
    competition: "FIFA World Cup",
    time: "2026-06-23T00:30:00+06:00",
    status: "upcoming",
    type: "hls",
    src: "" // Add stream link when available
  }
];

// Core Rendering Engine
function renderPlayer(match) {
  const playerContainer = document.getElementById('player-container');
  
  // Defensive Check: stop execution if the DOM container element is missing
  if (!playerContainer) {
    console.error("Target container '#player-container' not found in the DOM.");
    return;
  }
  if (!match) {
    console.error("No valid match object provided to the player engine.");
    return;
  }

  // Handle direct web links or embeds via frame container
  if (match.type === 'iframe' || match.type === 'youtube') {
    playerContainer.innerHTML = `
      <iframe 
        src="${match.src}" 
        width="100%" 
        height="500px" 
        frameborder="0" 
        scrolling="no" 
        allowfullscreen="true"
        allow="encrypted-media">
      </iframe>
    `;
  } 
  // Handle raw stream configurations (.m3u8 playlist manifests)
  else if (match.type === 'hls') {
    if (!match.src) {
      playerContainer.innerHTML = `
        <div class="player-error-fallback" style="padding: 40px; text-align: center; background: #1a1a1a; color: #fff;">
          <h3>Stream URL Unassigned</h3>
          <p>This match setup has no operational video feed configured yet.</p>
        </div>
      `;
      return;
    }
    
    playerContainer.innerHTML = `
      <video id="my-video" class="video-js" controls preload="auto" width="100%" height="500px">
        <source src="${match.src}" type="application/x-mpegURL">
      </video>
    `;
  }
}

// Helper: format Bangladesh time nicely
function formatBST(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString('en-GB', {
    timeZone: 'Asia/Dhaka',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }) + ' BST';
}

// Lifecycle Initialization: Ensures script executes safely after the structural HTML elements load
document.addEventListener('DOMContentLoaded', () => {
  // Finds the first available active match containing a source URL configuration
  const activeMatch = MATCHES.find(m => m.status === 'live' && m.src !== "") || MATCHES[0];
  if (activeMatch) {
    renderPlayer(activeMatch);
  }
});
