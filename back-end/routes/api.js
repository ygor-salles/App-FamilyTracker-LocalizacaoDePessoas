const express = require('express');
const router = express.Router();

// Simple GET API listing
router.get('/api', (req, res) => {
    res.send('api works');
});

module.exports = router;