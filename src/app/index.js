// nacteni balicku s knihovnou Express
const express = require('express');
// vytvoreni backendove aplikace
const app = express();

// volba jazyka pro sablony
app.set('view engine', 'ejs');
// volba slozky se sablonami
app.set('views', './app/views');

// prijem dat z formularu
app.use(express.urlencoded({ extended: false }));

// routy menu se zpracovavaji pred statickymi soubory kvuli dynamickemu obsahu
app.use(require('./routes/menuRouter'));

// staticke soubory (CSS, obrazky, ...)
app.use(express.static('public'));

// o zpracovani URL se stara router
app.use(require('./routes/defaultRouter'));

app.use((error, req, res, next) => {
	console.error('Chyba při zpracování požadavku:', error);
	res.status(500).render('error', {
		titulek: 'Chyba serveru',
		zprava: 'Požadavek se nepodařilo zpracovat.',
	});
});

// vyexportovani kodu aplikace pro pouziti v server.js
module.exports = app;
