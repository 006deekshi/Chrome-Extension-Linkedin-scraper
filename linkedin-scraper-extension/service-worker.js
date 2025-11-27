// service-worker.js
console.log("Service Worker Loaded!!!");

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === 'start-scrape') {
    const links = msg.links;
    // Updated backend URL using 127.0.0.1
    const api = "http://localhost:3000/api/profiles";
    // start sequential processing
    processLinksSequentially(links, api);
  }
});

// helper to open tab & inject function to scrape LinkedIn
async function processLinksSequentially(links, api) {
  for (const url of links) {
    try {
      const tab = await chrome.tabs.create({ url, active: true });
      await waitForTabComplete(tab.id, 15000); // 15s timeout

      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: scrapeLinkedInProfile,
        args: [url]
      });

      if (result && result.error) {
        console.error('Scrape error', url, result.error);
      } else {
        await postToApi(api, result);
      }

      await chrome.tabs.remove(tab.id);
      await sleep(800);
    } catch (err) {
      console.error('Processing error for', url, err);
    }
  }
  console.log('All done');
}

// function executed inside the page context to read the DOM
function scrapeLinkedInProfile(expectedUrl) {
  try {
    const data = {};
    data.url = expectedUrl || location.href;

    const nameEl = document.querySelector('.text-heading-xlarge') || document.querySelector('.top-card-layout__title') || document.querySelector('.pv-top-card-section__name');
    data.name = nameEl ? nameEl.innerText.trim() : '';

    const locEl = document.querySelector('.text-body-small.inline.t-black--light.break-words') || document.querySelector('.pv-top-card-section__location') || document.querySelector('.pv-top-card--list-bullet li');
    data.location = locEl ? locEl.innerText.trim() : '';

    const headlineEl = document.querySelector('.text-body-medium.break-words') || document.querySelector('.pv-top-card-section__headline') || document.querySelector('.pv-top-card--experience-list');
    data.bio = headlineEl ? headlineEl.innerText.trim() : '';

    let about = '';
    const aboutEl = document.querySelector('.pv-about__summary-text .lt-line-clamp__raw-line') || document.querySelector('.pv-about-section .pv-about__summary-text') || document.querySelector('#about');
    if (aboutEl) {
      about = aboutEl.innerText.trim();
    } else {
      const heading = Array.from(document.querySelectorAll('h2, h3')).find(h => /about/i.test(h.innerText));
      if (heading && heading.nextElementSibling) about = heading.nextElementSibling.innerText.trim();
    }
    data.about = about;

    const followerNode = Array.from(document.querySelectorAll('span')).find(s => /followers/i.test(s.innerText)) || document.querySelector('.pv-recent-activity-section__follower-count') || document.querySelector('a[href*="followers"] span.t-bold');
    data.followerCount = followerNode ? followerNode.innerText.replace(/\D/g,'') : null;

    const connNode = Array.from(document.querySelectorAll('span')).find(s => /connections/i.test(s.innerText) || /connections/.test(s.getAttribute('aria-label') || '')) || document.querySelector('a[href*="connections"] span.t-bold') || document.querySelector('.pv-top-card-v2-section__connections');
    data.connectionCount = connNode ? connNode.innerText.replace(/\D/g,'') : '';

    const bioLineEl = document.querySelector('.pv-top-card-section__summary') || document.querySelector('.top-card-layout__second-subline') || document.querySelector('.core-section-container__content .display-flex');
    data.bioLine = bioLineEl ? bioLineEl.innerText.trim() : '';

    return data;
  } catch (error) {
    console.error('Error extracting LinkedIn profile data:', error);
    return {};
  }
}

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

function waitForTabComplete(tabId, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const interval = setInterval(async () => {
      try {
        const tab = await chrome.tabs.get(tabId);
        if (tab.status === 'complete') {
          clearInterval(interval);
          resolve();
        } else if (Date.now() - start > timeout) {
          clearInterval(interval);
          resolve();
        }
      } catch (err) {
        clearInterval(interval);
        reject(err);
      }
    }, 500);
  });
}

async function postToApi(api, data) {
  try {
    console.log("Sending to backend:", JSON.stringify(data, null, 2));

    const res = await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    console.log("Backend Response:", JSON.stringify(json, null, 2));
  } catch (err) {
    console.error("Failed to POST", err);
  }
}

