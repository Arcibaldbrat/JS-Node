require('dotenv').config();

const app = require('./app');
const postsModel = require('./app/models/postsModel');
const favoritesModel = require('./app/models/favoritesModel');
const port = Number(process.env.PORT || 8000);

Promise.all([postsModel.initializeDatabase(), favoritesModel.initializeDatabase()])
	.then(() => {
		app.listen(port, () => {
			console.log(`Server běží na http://localhost:${port}`);
		});
	})
	.catch((error) => {
		console.error('Nepodařilo se spustit aplikaci:', error);
		process.exitCode = 1;
	});
