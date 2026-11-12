const model = require('../models/postsModel.js');

function parseId(value) {
	if (!/^\d+$/.test(value)) {
		return null;
	}

	const id = Number(value);
	return Number.isSafeInteger(id) && id > 0 && id <= 2147483647 ? id : null;
}

exports.allPosts = async (req, res) => {
	res.render('posts', {
		titulek: 'Příspěvky',
		prispevky: await model.nacistPrispevky(),
	});
};

exports.showPost = async (req, res) => {
	const id = parseId(req.params.id);
	const prispevek = id === null ? false : await model.nacistPrispevek(id);

	if (!prispevek) {
		res.status(404);
	}

	return res.render('post', {
		titulek: 'Příspěvek',
		prispevek,
	});
};

exports.deletePost = async (req, res) => {
	const id = parseId(req.params.id);

	if (id === null) {
		return res.status(400).render('error', {
			titulek: 'Neplatný příspěvek',
			zprava: 'ID příspěvku není platné.',
		});
	}

	const deleted = await model.smazatPrispevek(id);
	if (!deleted) {
		return res.status(404).render('error', {
			titulek: 'Příspěvek nenalezen',
			zprava: 'Příspěvek, který chcete smazat, neexistuje.',
		});
	}

	return res.redirect('/posts');
};

exports.addPost = async (req, res) => {
	const nadpis = typeof req.body.nadpis === 'string' ? req.body.nadpis.trim() : '';
	const obsah = typeof req.body.obsah === 'string' ? req.body.obsah.trim() : '';

	if (!nadpis || nadpis.length > 255 || !obsah) {
		return res.status(400).render('posts', {
			titulek: 'Příspěvky',
			prispevky: await model.nacistPrispevky(),
			chyba: 'Vyplňte nadpis a obsah. Nadpis může mít nejvýše 255 znaků.',
		});
	}

	await model.pridatPrispevek(nadpis, obsah);
	return res.redirect('/posts');
};
