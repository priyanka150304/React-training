const clockEl = document.getElementById('clock');
const timerEl = document.getElementById('timer');
const typingArea = document.getElementById('typingArea');
const charCountEl = document.getElementById('charCount');
const wordCountEl = document.getElementById('wordCount');
const sentenceCountEl = document.getElementById('sentenceCount');
const wpsEl = document.getElementById('wps');
const cpsEl = document.getElementById('cps');
const spmEl = document.getElementById('spm');
const resetBtn = document.getElementById('resetBtn');

let startTime = null;
let interval = null;

// Update clock every second
setInterval(() => {
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString();
}, 1000);

function formatTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  let minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  let seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function updateMetrics() {
  if (!startTime) return;
  const elapsed = Date.now() - startTime;
  timerEl.textContent = formatTime(elapsed);

  const text = typingArea.value;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0).length;

  // Update counts
  charCountEl.textContent = chars;
  wordCountEl.textContent = words;
  sentenceCountEl.textContent = sentences;

  // Update rates
  const seconds = elapsed / 1000;
  const minutes = elapsed / 60000;

  wpsEl.textContent = seconds > 0 ? (words / seconds).toFixed(2) : 0;
  cpsEl.textContent = seconds > 0 ? (chars / seconds).toFixed(2) : 0;
  spmEl.textContent = minutes > 0 ? (sentences / minutes).toFixed(2) : 0;
}

typingArea.addEventListener('focus', () => {
  if (!startTime) {
    startTime = Date.now();
    interval = setInterval(updateMetrics, 500);
  }
});

typingArea.addEventListener('blur', () => {
  clearInterval(interval);
  interval = null;
});

resetBtn.addEventListener('click', () => {
  clearInterval(interval);
  interval = null;
  startTime = null;
  typingArea.value = '';
  timerEl.textContent = '00:00:00';
  charCountEl.textContent = '0';
  wordCountEl.textContent = '0';
  sentenceCountEl.textContent = '0';
  wpsEl.textContent = '0';
  cpsEl.textContent = '0';
  spmEl.textContent = '0';
});
