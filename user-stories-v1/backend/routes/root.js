const express = require("express");
const router = express.Router();
const path = require("path");
const regex = new RegExp("^/$|/index(.html)?");

router.get(regex, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
})

module.exports = router;