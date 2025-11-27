// content.js (runs on LinkedIn profile pages)
(async function scrapeAndSend() {
  try {
    const nameEl = document.querySelector('h1');
    const locationEl = document.querySelector('.text-body-small.inline.t-black--light');
    const aboutEl = document.querySelector('.pv-about-section p');
    const bioEl = document.querySelector('.pv-top-card--experience-list');
    const followerEl = document.querySelector('.t-bold'); // adapt selector
    const connectionEl = document.querySelector('.pv-top-card--list-bullet');

    const data = {
      name: nameEl?.innerText || '',
      url: window.location.href,
      location: locationEl?.innerText || '',
      about: aboutEl?.innerText || '',
      bio: bioEl?.innerText || '',
      followerCount: followerEl?.innerText?.replace(/\D/g, '') || 0,
      connectionCount: connectionEl?.innerText || ''
    };

    console.log('Scraped Data:', data);

    const response = await fetch('http://localhost:3000/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log('Data sent to backend successfully:', result);

  } catch (err) {
    console.error('Error scraping/sending data:', err);
  }
})();
