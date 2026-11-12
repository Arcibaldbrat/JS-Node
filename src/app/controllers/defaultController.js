// indexova stranka
exports.index = (req, res) => {
	res.render('index', {
		titulek: 'Můj web',
		jmeno: 'Jakub Šenkýř',
		datum: new Date().toLocaleDateString(),
	});
}

// chybova stranka
exports.error = (req, res) => {
    res.status(404).render('error', {
		titulek: 'Chyba',
		zprava: 'Požadovaná stránka nebyla nalezena.',
	});
}
