const fs = require('node:fs');
const path = require('node:path');

const databasePath = path.resolve(__dirname, '../../../data/posts.json');
const examplePath = path.resolve(__dirname, '../../../data/posts.json.example');

function readPosts() {
	const posts = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

	if (!Array.isArray(posts)) {
		throw new Error('Databáze příspěvků musí obsahovat pole.');
	}

	return posts;
}

function writePosts(posts) {
	const temporaryPath = `${databasePath}.tmp`;
	fs.writeFileSync(temporaryPath, `${JSON.stringify(posts, null, 2)}\n`, 'utf8');
	fs.renameSync(temporaryPath, databasePath);
}

exports.initializeDatabase = async () => {
	if (!fs.existsSync(databasePath)) {
		fs.copyFileSync(examplePath, databasePath);
	}
};

exports.nacistPrispevky = async () => readPosts();

exports.nacistPrispevek = async (id) => {
	return readPosts().find((prispevek) => prispevek.id === id) || false;
};

exports.smazatPrispevek = async (id, autorId) => {
	const prispevky = readPosts();
	const aktualizovanePrispevky = prispevky.filter((prispevek) => {
		return prispevek.id !== id || prispevek.autor?.id !== autorId;
	});

	if (aktualizovanePrispevky.length === prispevky.length) {
		return false;
	}

	writePosts(aktualizovanePrispevky);
	return true;
};

exports.smazatPrispevkyAutora = async (autorId) => {
	const prispevky = readPosts();
	const aktualizovanePrispevky = prispevky.filter((prispevek) => prispevek.autor?.id !== autorId);

	if (aktualizovanePrispevky.length === prispevky.length) {
		return 0;
	}

	writePosts(aktualizovanePrispevky);
	return prispevky.length - aktualizovanePrispevky.length;
};

exports.pridatPrispevek = async (nadpis, obsah, autor) => {
	const prispevky = readPosts();
	const noveId = prispevky.reduce((nejvyssiId, prispevek) => {
		return Math.max(nejvyssiId, prispevek.id);
	}, 0) + 1;

	prispevky.push({
		id: noveId,
		nadpis,
		obsah,
		autor: { id: autor.id, email: autor.email },
	});
	writePosts(prispevky);
};
