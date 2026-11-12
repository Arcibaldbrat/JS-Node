<<<<<<< Updated upstream
// nacteni nastaveni ze souboru .env
require('dotenv').config();

// pouzite nastaveni
const port = process.env.PORT;

// spusteni serveru pro aplikaci
require('http').createServer(require('./app'))
.listen(port, () => {
    // hlaska pri spusteni serveru
    console.log(`Server běží na http://localhost:${port}`);
});
=======
import express from 'express';
import router from './router.js'; // Připojení tvého souboru s routami

// nastaveni
const app = express();

// Middleware pro zpracování dat z HTML formulářů (bez tohoto by POST data byla undefined)
app.use(express.urlencoded({ extended: true }));
// Middleware pro zpracování JSON dat (pokud bys posílal data přes fetch/AJAX)
app.use(express.json());

// staticke soubory (HTML, CSS, obrazky)
app.use(express.static('public'));

// Použití tvého custom routeru pro definici cest k databázi
app.use('/', router);

// custom URL mimo staticke stranky (nechávám původní pro test, i když se to běžně dává do routeru)
app.get('/test', (req, res) => {
  res.send('Hello World');
});

// spusteni serveru
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
>>>>>>> Stashed changes
