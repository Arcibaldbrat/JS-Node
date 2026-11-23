const usersModel = require('../models/usersModel');

function isValidEmail(email) {
	return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setSessionUser(req, user) {
	return new Promise((resolve, reject) => {
		req.session.regenerate((error) => {
			if (error) {
				reject(error);
				return;
			}

			req.session.user = user;
			req.session.save((saveError) => {
				if (saveError) {
					reject(saveError);
					return;
				}
				resolve();
			});
		});
	});
}

function destroySession(req, res, next) {
	req.session.destroy((error) => {
		if (error) {
			return next(error);
		}
		res.clearCookie('connect.sid');
		return res.redirect('/');
	});
}

exports.requireAuth = async (req, res, next) => {
	if (!req.session.user) {
		return res.redirect('/login');
	}

	const user = await usersModel.findById(req.session.user.id);
	if (!user) {
		req.session.destroy((error) => {
			if (error) {
				return next(error);
			}
			return res.redirect('/login');
		});
		return;
	}

	res.locals.user = { id: user.id, email: user.email };
	return next();
};

exports.loginPage = (req, res) => {
	res.render('login', {
		titulek: 'Přihlášení',
		chyba: '',
		email: '',
	});
};

exports.login = async (req, res) => {
	const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
	const password = typeof req.body.password === 'string' ? req.body.password : '';

	if (!isValidEmail(email) || password.length === 0 || password.length > 128) {
		return res.status(400).render('login', {
			titulek: 'Přihlášení',
			chyba: 'Zadejte platný e-mail a heslo.',
			email,
		});
	}

	const user = await usersModel.findByEmail(email);
	if (!user || !(await usersModel.verifyPassword(user, password))) {
		return res.status(400).render('login', {
			titulek: 'Přihlášení',
			chyba: 'E-mail nebo heslo není správné.',
			email,
		});
	}

	await setSessionUser(req, { id: user.id, email: user.email });
	return res.redirect('/account');
};

exports.registerPage = (req, res) => {
	res.render('register', {
		titulek: 'Registrace',
		chyba: '',
		email: '',
	});
};

exports.sessionStatus = async (req, res, next) => {
	res.set('Cache-Control', 'no-store');
	if (!req.session.user) {
		return res.json({ user: null });
	}

	const user = await usersModel.findById(req.session.user.id);
	if (!user) {
		return req.session.destroy((error) => {
			if (error) {
				return next(error);
			}
			res.clearCookie('connect.sid');
			return res.json({ user: null });
		});
	}

	return res.json({ user: { email: user.email } });
};

exports.register = async (req, res) => {
	const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
	const password = typeof req.body.password === 'string' ? req.body.password : '';
	const confirmPassword = typeof req.body.confirmPassword === 'string' ? req.body.confirmPassword : '';

	if (!isValidEmail(email)) {
		return res.status(400).render('register', {
			titulek: 'Registrace',
			chyba: 'Zadejte platnou e-mailovou adresu.',
			email,
		});
	}
	if (password.length < 8 || password.length > 128) {
		return res.status(400).render('register', {
			titulek: 'Registrace',
			chyba: 'Heslo musí mít 8 až 128 znaků.',
			email,
		});
	}
	if (password !== confirmPassword) {
		return res.status(400).render('register', {
			titulek: 'Registrace',
			chyba: 'Zadaná hesla se neshodují.',
			email,
		});
	}

	const user = await usersModel.createUser(email, password);
	if (!user) {
		return res.status(400).render('register', {
			titulek: 'Registrace',
			chyba: 'Účet s tímto e-mailem už existuje.',
			email,
		});
	}

	await setSessionUser(req, user);
	return res.redirect('/account');
};

exports.accountPage = (req, res) => {
	res.render('account', {
		titulek: 'Můj účet',
		chyba: '',
	});
};

exports.logout = destroySession;

exports.deleteAccount = async (req, res) => {
	const password = typeof req.body.password === 'string' ? req.body.password : '';
	const user = await usersModel.findById(req.session.user.id);

	if (!user || !(await usersModel.verifyPassword(user, password))) {
		return res.status(400).render('account', {
			titulek: 'Můj účet',
			chyba: 'Heslo není správné. Účet nebyl zrušen.',
		});
	}

	await usersModel.deleteUser(user.id);
	return destroySession(req, res, (error) => {
		console.error('Nepodařilo se ukončit session po zrušení účtu:', error);
		if (!res.headersSent) {
			res.status(500).render('error', {
				titulek: 'Chyba serveru',
				zprava: 'Účet byl zrušen, ale nepodařilo se ukončit přihlášení.',
			});
		}
	});
};
