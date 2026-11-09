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

// staticke soubory (CSS, obrazky, ...)
app.use(express.static('public'));

// o zpracovani URL se stara router
app.use(require('./routes/defaultRouter'));

// vyexportovani kodu aplikace pro pouziti v server.js
module.exports = app;
