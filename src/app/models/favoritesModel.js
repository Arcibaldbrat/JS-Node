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

exports.nacistOblibenaJidla = async (autorId) => {
	return readFavorites().filter((jidlo) => jidlo.autor?.id === autorId);
};

exports.pridatOblibeneJidlo = async (nazev, autor) => {
	const jidla = readFavorites();

	if (jidla.some((jidlo) => {
		return jidlo.autor?.id === autor.id
			&& jidlo.nazev.toLocaleLowerCase('cs') === nazev.toLocaleLowerCase('cs');
	})) {
		return false;
	}

	const noveId = jidla.reduce((nejvyssiId, jidlo) => Math.max(nejvyssiId, jidlo.id), 0) + 1;
	jidla.push({ id: noveId, nazev, autor: { id: autor.id, email: autor.email } });
	writeFavorites(jidla);
	return true;
};

exports.odebratOblibeneJidlo = async (id, autorId) => {
	const jidla = readFavorites();
	const aktualizovanaJidla = jidla.filter((jidlo) => {
		return jidlo.id !== id || jidlo.autor?.id !== autorId;
	});

	if (aktualizovanaJidla.length === jidla.length) {
		return false;
	}

	writeFavorites(aktualizovanaJidla);
	return true;
};

exports.smazatOblibenaJidlaAutora = async (autorId) => {
	const jidla = readFavorites();
	const aktualizovanaJidla = jidla.filter((jidlo) => jidlo.autor?.id !== autorId);

	if (aktualizovanaJidla.length === jidla.length) {
		return 0;
	}

	writeFavorites(aktualizovanaJidla);
	return jidla.length - aktualizovanaJidla.length;
};
