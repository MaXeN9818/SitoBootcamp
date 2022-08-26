const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
	res.render('news/posts', {title: 'Articoli'});
});

router.get('/eventi', (req, res) => {
	res.render('news/events', {title: 'Storico Eventi'});
});

router.get('/rapporti', (req, res) => {
	res.render('news/reports', {title: 'Rapporti'});
});

router.get('/safenet', (req, res) => {
	res.render('news/safeNet', {title: 'SafeNet Radio'});
});

router.get('/navi', (req, res) => {
	res.render('news/shipsForum', {title: 'Forum Navi'});
});

module.exports = router;