const { Router } = require('express');
const router = Router();
const { requirePolicy } = require('../Middleware/auth');
const User = require('../Models/user');

// TODO: Create admin panel
// NOTE: Not urgent
router.get('/', requirePolicy, (req, res) => {
	res.render('admin/admin', { title: 'Pannello admin' });
});

router.get('/users', requirePolicy, (req, res) => {
	User.find({}, { password: 0}, (err, usersData) => {
		if (err) {
			res.status(500).render('error', {title: 'Gestione utenti', error: 'Impossibile ottenere gli utenti'});
		}
		res.locals.usersData = usersData;
		res.status(200).render('admin/users', {title: 'Gestione utenti'});
	});
});

module.exports = router;
