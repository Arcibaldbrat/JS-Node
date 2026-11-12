const fs = require('node:fs');
const path = require('node:path');

const databasePath = path.resolve(__dirname, '../../../data/favorites.json');

function readFavorites() {
	const favorites = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

	if (!Array.isArray(favorites)) {
		throw new Error('Databáze oblíbených jídel musí obsahovat pole.');
	}

	return favorites;
}

function writeFavorites(favorites) {
	const temporaryPath = `${databasePath}.tmp`;
	fs.writeFileSync(temporaryPath, `${JSON.stringify(favorites, null, 2)}\n`, 'utf8');
	fs.renameSync(temporaryPath, databasePath);
}

exports.initializeDatabase = async () => {
	if (!fs.existsSync(databasePath)) {
		writeFavorites([]);
	}
};

exports.nacistOblibenaJidla = async () => readFavorites();

exports.pridatOblibeneJidlo = async (nazev) => {
	const jidla = readFavorites();

	if (jidla.some((jidlo) => jidlo.nazev.toLocaleLowerCase('cs') === nazev.toLocaleLowerCase('cs'))) {
		return false;
	}

	const noveId = jidla.reduce((nejvyssiId, jidlo) => Math.max(nejvyssiId, jidlo.id), 0) + 1;
	jidla.push({ id: noveId, nazev });
	writeFavorites(jidla);
	return true;
};

exports.odebratOblibeneJidlo = async (id) => {
	const jidla = readFavorites();
	const aktualizovanaJidla = jidla.filter((jidlo) => jidlo.id !== id);

	if (aktualizovanaJidla.length === jidla.length) {
		return false;
	}

	writeFavorites(aktualizovanaJidla);
	return true;
};
