import express from 'express'

// nastaveni
const app = express()

//staticke soubory (HTML, CSS, obrazky)
app.use(express.static('public'));

// custom URL mimo staticke stranky
app.get('/', (req, res) => {
  res.send('Hello World')
})

// spusteni serveru
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})

