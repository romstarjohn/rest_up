const express = require('express');
const router = new express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource Users');
});

module.exports = router;
