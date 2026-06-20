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
  // Example of how your frontend should render the match
function renderPlayer(match) {
  const playerContainer = document.getElementById('player-container');
  
  if (match.type === 'iframe') {
    // This perfectly loads your researched KooraLive and Blogspot links
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
  } else if (match.type === 'hls') {
    // Standard video tag for raw .m3u8 files, if you find them in the future
    playerContainer.innerHTML = `
      <video id="my-video" class="video-js" controls preload="auto" width="100%" height="500px">
        <source src="${match.src}" type="application/x-mpegURL">
      </video>
    `;
  }
}

// Call the function with your first match
renderPlayer(matches[0]);
  {
    id: "wc3",
    home: "England",
    away: "Germany",
    competition: "FIFA World Cup",
    time: "2026-06-21T22:00:00+06:00",
    status: "live",
    type: "youtube",
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
    src: ""
  },
  {
    id: "wc6",
    home: "Netherlands",
    away: "USA",
    competition: "FIFA World Cup",
    time: "2026-06-23T00:30:00+06:00",
    status: "upcoming",
    type: "hls",
    src: ""
  }
];

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
