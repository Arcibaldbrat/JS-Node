// nacteni balicku s knihovnou Express
const express = require('express');
const session = require('express-session');
// vytvoreni backendove aplikace
const app = express();

// volba jazyka pro sablony
app.set('view engine', 'ejs');
// volba slozky se sablonami
app.set('views', './app/views');

// prijem dat z formularu
app.use(express.urlencoded({ extended: false }));

app.use(session({
	secret: process.env.SESSION_SECRET || require('node:crypto').randomBytes(32).toString('hex'),
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
	},
}));
app.use((req, res, next) => {
	res.locals.user = req.session.user || null;
	next();
});

// Router zpracovava dynamicke URL a servira staticke soubory.
app.use(require('../router'));

app.use((error, req, res, next) => {
	console.error('Chyba při zpracování požadavku:', error);
	res.status(500).render('error', {
		titulek: 'Chyba serveru',
		zprava: 'Požadavek se nepodařilo zpracovat.',
	});
});

// vyexportovani kodu aplikace pro pouziti v server.js
module.exports = app;
