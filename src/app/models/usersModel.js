const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { promisify } = require('node:util');

const scrypt = promisify(crypto.scrypt);
const databasePath = path.resolve(__dirname, '../../../data/users.json');

function readUsers() {
	const users = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

	if (!Array.isArray(users)) {
		throw new Error('Databáze uživatelů musí obsahovat pole.');
	}

	return users;
}

function writeUsers(users) {
	const temporaryPath = `${databasePath}.tmp`;
	fs.writeFileSync(temporaryPath, `${JSON.stringify(users, null, 2)}\n`, 'utf8');
	fs.renameSync(temporaryPath, databasePath);
}

exports.initializeDatabase = async () => {
	if (!fs.existsSync(databasePath)) {
		writeUsers([]);
	}
};

exports.findByEmail = async (email) => {
	return readUsers().find((user) => user.email === email) || null;
};

exports.findById = async (id) => {
	return readUsers().find((user) => user.id === id) || null;
};

exports.createUser = async (email, password) => {
	const salt = crypto.randomBytes(16).toString('hex');
	const passwordHash = await scrypt(password, salt, 64);
	const users = readUsers();
	if (users.some((user) => user.email === email)) {
		return null;
	}

	const id = users.reduce((highestId, user) => Math.max(highestId, user.id), 0) + 1;
	const user = { id, email, salt, passwordHash: passwordHash.toString('hex') };

	users.push(user);
	writeUsers(users);
	return { id: user.id, email: user.email };
};

exports.verifyPassword = async (user, password) => {
	const actualHash = await scrypt(password, user.salt, 64);
	const expectedHash = Buffer.from(user.passwordHash, 'hex');

	return actualHash.length === expectedHash.length
		&& crypto.timingSafeEqual(actualHash, expectedHash);
};

exports.deleteUser = async (id) => {
	const users = readUsers();
	const remainingUsers = users.filter((user) => user.id !== id);

	if (remainingUsers.length === users.length) {
		return false;
	}

	writeUsers(remainingUsers);
	return true;
};
