// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize, Profile } = require('./models');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

// Health check
app.get('/', (req, res) => res.send('LinkedIn scraper API running'));

// POST API to store profile data
app.post('/api/profiles', async (req, res) => {
  try {
    const payload = req.body;

    if (!payload.url || !payload.name) {
      return res.status(400).json({ error: 'url and name required' });
    }

    // Insert new profile
    const profile = await Profile.create({
      name: payload.name,
      url: payload.url.trim(),  // trim spaces
      about: payload.about || '',
      bio: payload.bio || '',
      location: payload.location || '',
      followerCount: payload.followerCount ? parseInt(payload.followerCount) : null,
      connectionCount: payload.connectionCount || ''
    });

    console.log('Inserted profile:', profile.name, profile.url);

    res.json({ success: true });
  } catch (err) {
    console.error('Error inserting profile:', err);
    res.status(500).json({ error: 'server error' });
  }
});

const PORT = process.env.PORT || 3000;

(async () => {
  await sequelize.sync({ alter: true });

  // Clear table on server start
  

  app.listen(PORT, () => console.log(`API listening on ${PORT}`));
})();
