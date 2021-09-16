const router = require('express').Router();
const apiRputes = require('./api');

router.use('/api', apiRputes);

router.use((req, res) => {
    res.status(404).send(`<h1> Uh Oh...Something's not right<h1>`);
});

module.exports = router;