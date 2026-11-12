const model = require('../models/favoritesModel');

function parseId(value) {
	if (!/^\d+$/.test(value)) {
		return null;
	}

	const id = Number(value);
	return Number.isSafeInteger(id) && id > 0 && id <= 2147483647 ? id : null;
}

exports.zobrazitMenu = async (req, res) => {
	return res.render('menu', {
		titulek: 'Trattoria Luna - Menu',
		oblibenaJidla: await model.nacistOblibenaJidla(),
		chyba: req.query.chyba || '',
	});
};

exports.pridatOblibeneJidlo = async (req, res) => {
	const nazev = typeof req.body.nazev === 'string' ? req.body.nazev.trim() : '';

	if (!nazev || nazev.length > 100) {
		return res.status(400).render('menu', {
			titulek: 'Trattoria Luna - Menu',
			oblibenaJidla: await model.nacistOblibenaJidla(),
			chyba: 'Zadejte název jídla (nejvýše 100 znaků).',
		});
	}

	const added = await model.pridatOblibeneJidlo(nazev);
	if (!added) {
		return res.status(400).render('menu', {
			titulek: 'Trattoria Luna - Menu',
			oblibenaJidla: await model.nacistOblibenaJidla(),
			chyba: 'Toto jídlo už mezi oblíbenými máte.',
		});
	}

	return res.redirect('/Menu.html');
};

exports.odebratOblibeneJidlo = async (req, res) => {
	const id = parseId(req.params.id);
	if (id === null) {
		return res.status(400).render('error', {
			titulek: 'Neplatné jídlo',
			zprava: 'ID oblíbeného jídla není platné.',
		});
	}

	const deleted = await model.odebratOblibeneJidlo(id);
	if (!deleted) {
		return res.status(404).render('error', {
			titulek: 'Jídlo nenalezeno',
			zprava: 'Oblíbené jídlo, které chcete odebrat, neexistuje.',
		});
	}

	return res.redirect('/Menu.html');
};
