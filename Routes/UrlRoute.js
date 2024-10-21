const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const Url = require('../models/Url');

// @route   POST /shorten
// @desc    Create short URL
router.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    const shortUrl = shortid.generate(); // Create a unique short URL

    try {
        let url = new Url({ originalUrl, shortUrl });
        await url.save();
        res.json({ originalUrl, shortUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

// @route   GET /:shortUrl
// @desc    Redirect to the original URL
router.get('/:shortUrl', async (req, res) => {
    try {
        const url = await Url.findOne({ shortUrl: req.params.shortUrl });

        if (url) {
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json('No URL found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

module.exports = router;
