const startBtn = document.getElementById('startBtn');
const statusEl = document.getElementById('status');

startBtn.addEventListener('click', async () => {
  const raw = document.getElementById('links').value.trim();
  const api = document.getElementById('api').value.trim();
  if (!raw) return statusEl.textContent = 'Paste at least 3 LinkedIn profile URLs.';
  const links = raw.split('\n').map(s => s.trim()).filter(Boolean);
  if (links.length < 3) return statusEl.textContent = 'Please provide at least 3 links.';
  statusEl.textContent = 'Starting... (make sure you are logged in to LinkedIn in Chrome)';
  // send to background
  chrome.runtime.sendMessage({ action: 'start-scrape', links, api });
  statusEl.textContent = `Queued ${links.length} links — background will open them.`;
});
