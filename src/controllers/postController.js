import 'dotenv/config';
import sql from 'mssql';

function getDbConfig() {
    const requiredVariables = ['DB_USER', 'DB_PASSWORD', 'DB_SERVER', 'DB_NAME'];
    const missingVariables = requiredVariables.filter((name) => !process.env[name]);

    if (missingVariables.length > 0) {
        throw new Error(`Chybí nastavení databáze: ${missingVariables.join(', ')}`);
    }

    return {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER,
        database: process.env.DB_NAME,
        options: {
            encrypt: process.env.DB_ENCRYPT === 'true',
            trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false'
        }
    };
}

export async function addPost(req, res) {
    try {
        const { title, content } = req.body ?? {};

        if (
            typeof title !== 'string' ||
            typeof content !== 'string' ||
            !title.trim() ||
            !content.trim()
        ) {
            return res.status(400).send('Všechna pole musí být vyplněna.');
        }

        const pool = await sql.connect(getDbConfig());

        await pool.request()
            .input('title', sql.NVarChar, title)
            .input('content', sql.NVarChar, content)
            .query('INSERT INTO Posts (Title, Content) VALUES (@title, @content)');

        res.redirect('/');
    } catch (error) {
        console.error('Chyba při vkládání do DB:', error);
        res.status(500).send('Nastala chyba při ukládání dat do databáze.');
    }
}

export async function deletePost(req, res) {
    try {
        const rawId = req.body?.id;
        const id = typeof rawId === 'string' && /^\d+$/.test(rawId)
            ? Number(rawId)
            : rawId;

        if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
            return res.status(400).send('ID záznamu je povinné pro smazání.');
        }

        const pool = await sql.connect(getDbConfig());

        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Posts WHERE Id = @id');

        res.redirect('/');
    } catch (error) {
        console.error('Chyba při mazání z DB:', error);
        res.status(500).send('Nastala chyba při mazání dat z databáze.');
    }
}
