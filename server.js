// Load environment variables from the .env file
require('dotenv').config();

const express = require('express');
const path = require('path'); // Import the 'path' module

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable for port or default to 3000

// Retrieve the API key from environment variables
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

// Serve static files (HTML, CSS, JS) from the 'public' directory
// express.static will automatically serve 'index.html' on the root path '/'
app.use(express.static(path.join(__dirname, 'public')));

// Define the API endpoint that the frontend will call
app.get('/api/images', async (req, res) => {
    const { q, per_page } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Search query (q) is required.' });
    }

    if (!PIXABAY_API_KEY || PIXABAY_API_KEY === 'YOUR_PIXABAY_API_KEY_HERE') {
        return res.status(500).json({ error: 'API key is not configured on the server.' });
    }

    const pixabayURL = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(q)}&image_type=photo&per_page=${per_page}&safesearch=true`;

    try {
        const response = await fetch(pixabayURL);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching from Pixabay:', error);
        res.status(500).json({ error: 'Failed to fetch images from Pixabay.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
