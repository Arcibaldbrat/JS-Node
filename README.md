# Vývoj aplikací v jazyce JavaScript

## Obsah repozitáře

```text
zaklady/                      samostatná cvičení spouštěná v konzoli
├── 01_hello.js               výpis textu do konzole
├── 02_syntaxe.js             proměnné, datové typy, pole, objekty, funkce
└── 03_http_server.js         server na portu 8000 nad modulem http

src/                          webová aplikace nad Expressem
├── Server.js                 ← tímto souborem se aplikace spouští (npm run dev)
├── .env.example              vzor nastavení portu
├── package.json              seznam použitých balíčků (npm install)
├── app/                      backend aplikace
│   ├── index.js              nastavení Expressu (šablony, statické soubory, router)
│   ├── routes/               obsluha adres
│   │   └── defaultRouter.js  /, /index, /hello a chybová stránka pro ostatní
│   └── views/                šablony stránek v EJS
│       ├── index.ejs
│       └── error.ejs
└── public/                   staticky servírované soubory
    └── css/
        └── style.css
```

---

> *Kód je vyvíjen ve Visual Studio Code a závisí na Node.js 26*

## Spuštění webové aplikace

V adresáři `src` nainstalujte závislosti a spusťte aplikaci. Není potřeba
nastavovat externí databázi: příspěvky se ukládají do `data/posts.json`.
Při prvním spuštění se tento soubor vytvoří podle vzorových dat
`data/posts.json.example`. Port lze změnit v souboru `.env`.

```powershell
cd src
npm install
npm run dev
```

Příspěvky lze přidávat a mazat na stránce `/posts`.

Uživatelé se mohou registrovat na `/register`, přihlásit na `/login` a svůj
účet spravovat na `/account`. Účet lze zrušit po potvrzení heslem. Uživatelské
účty se ukládají do `data/users.json`; hesla jsou uložena pouze jako bezpečné
hashe. Do souboru `.env` nastavte vlastní náhodný `SESSION_SECRET`; v produkci
je navíc potřeba HTTPS a trvalé úložiště session. Nabídka přihlášeného účtu
nebo odkazů na přihlášení a registraci je dostupná na všech stránkách.
