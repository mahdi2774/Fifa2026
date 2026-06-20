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
    type: "hls",
    src: "https://8.kooralive360.com/albaplayer/bein-sports-hd-1/?serv=10"
  },
  {
    id: "wc2",
    home: "France",
    away: "Spain",
    competition: "FIFA World Cup",
    time: "2026-06-21T02:30:00+06:00",
    status: "live",
    type: "hls",
    src: "https://vjs.zencdn.net/7.20.3/video-js.css"
  },
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
