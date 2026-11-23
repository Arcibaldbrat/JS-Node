function createAccountLink(label, href) {
	const link = document.createElement('a');
	link.href = href;
	link.textContent = label;
	return link;
}

function createAccountMenu(user) {
	const menu = document.createElement('nav');
	menu.className = 'account-menu';
	menu.setAttribute('aria-label', 'Uživatelský účet');

	if (user) {
		const status = document.createElement('span');
		status.textContent = `Přihlášen: ${user.email}`;
		menu.append(status);
		menu.append(createAccountLink('Můj účet', '/account'));
		menu.append(createAccountLink('Zrušit účet', '/account#zrusit-ucet'));

		const form = document.createElement('form');
		form.action = '/logout';
		form.method = 'post';
		const logoutButton = document.createElement('button');
		logoutButton.type = 'submit';
		logoutButton.textContent = 'Odhlásit se';
		form.append(logoutButton);
		menu.append(form);
	} else {
		menu.append(document.createTextNode('Nepřihlášen'));
		menu.append(createAccountLink('Přihlásit se', '/login'));
		menu.append(createAccountLink('Zaregistrovat se', '/register'));
	}

	return menu;
}

async function loadAccountMenu() {
	const response = await fetch('/auth/status', {
		headers: { Accept: 'application/json' },
		cache: 'no-store',
	});

	if (!response.ok) {
		throw new Error(`Stav účtu se nepodařilo načíst (HTTP ${response.status}).`);
	}

	const result = await response.json();
	document.body.prepend(createAccountMenu(result.user));
}

loadAccountMenu().catch((error) => {
	console.error('Nepodařilo se zobrazit nabídku účtu:', error);
	const menu = document.createElement('nav');
	menu.className = 'account-menu';
	menu.setAttribute('aria-label', 'Uživatelský účet');
	menu.setAttribute('role', 'alert');
	menu.textContent = 'Stav účtu se nepodařilo načíst.';
	document.body.prepend(menu);
});
