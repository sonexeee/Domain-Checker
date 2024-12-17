const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

// GoDaddy API credentials
const API_KEY = process.env.GODADDY_API_KEY;
const API_SECRET = process.env.GODADDY_API_SECRET;

app.use(bodyParser.json());

// Check domain availability
app.get('/check-domain', async (req, res) => {
  const domain = req.query.domain;

  try {
    const response = await axios.get('https://api.godaddy.com/v1/domains/available', {
      params: { domain: domain },
      headers: {
        Authorization: `sso-key ${API_KEY}:${API_SECRET}`,
      },
    });

    if (response.data.available) {
      res.json({ available: true });
    } else {
      res.json({ available: false });
    }
  } catch (error) {
    console.error('Error checking domain availability:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Register the domain
app.post('/register-domain', async (req, res) => {
  const { domain, contactInfo } = req.body; // User contact info for registration (replace with real data)

  try {
    const response = await axios.post(
      'https://api.godaddy.com/v1/domains/purchase',
      {
        domain: domain,
        contact: contactInfo,
        period: 1, // Register for 1 year (adjust as needed)
      },
      {
        headers: {
          Authorization: `sso-key ${API_KEY}:${API_SECRET}`,
        },
      }
    );

    if (response.status === 200) {
      res.json({ success: true, message: 'Domain successfully registered!' });
    } else {
      res.json({ success: false, message: 'Domain registration failed' });
    }
  } catch (error) {
    console.error('Error registering domain:', error);
    res.status(500).json({ error: 'Domain registration failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
