const { Router } = require('express');
const router = Router();
const { requirePolicy, requireAuth } = require('../Middleware/auth');
const { getRanks, getSpecialization } = require('../Middleware/utils');
const { getUserData, getPlayerData } = require('../Controllers/authController');

router.get('/', (req, res) => {
	res.redirect('/auth/login');
});

router.get('/login', (req, res) => {
	res.render('auth/login', {title: 'Accedi'});
});

router.get('/signup', requireAuth, requirePolicy, (req, res) => {
	res.render('auth/signup', {title: 'Creazione utenti'});
});

router.get('/logout', requireAuth, (req, res) => {
	res.cookie('JWT', '', {maxAge: 0});
	res.status(200).redirect('/');
});

router.get('/settings/:id', requireAuth, getRanks, getSpecialization, (req, res) => {
	const id = req.params.id;
	if (!(res.locals.isAdmin || res.locals.userPolicy.includes('manageruser')) && id != res.locals.userID) {
		res.status(403).render('error', { title: '403', error: 'Forbidden access!' });
	} else {
		getUserData(id, (user) => {
			if (user.err) res.status(500).render('error', {title: '500', error: user.err});
			
			res.locals.userData = user;
			
			if(res.locals.userData.hasPlayer) {
				getPlayerData(id, (player) => {
					if(player.err) res.status(500).render('error', {title: '500', error: user.err});

					res.locals.playerData = player;
					res.render('auth/settings', {title: 'Impostazioni'});
				});
			} else {
				res.render('auth/settings', {title: 'Impostazioni'});
			}
		});
	}
});

module.exports = router;