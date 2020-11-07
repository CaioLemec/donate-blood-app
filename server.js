    // configurando o servidor
const express = require("express")
const server = express()

    // configurar servidor para arquivos estáticos
server.use(express.static('public'))

    // habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

    // configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '550012',
    host: 'localhost',
    port: 5432,
    database: 'bloodonation',
})

    // configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true
})

    // configurando a apresentação da página
server.get("/", function(req, res) {
    const donors = []
    return res.render("index.html", { donors })
})

    // configurando a apresentação da página
server.post("/", function(req, res) {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    // condição para campos vazios no form
    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    // coloca valores dentro do banco de dados. 
    const query = `
    INSERT INTO donors ("name", "email", "blood")    
    VALUES ($1, $2, $3)`

    const values = [name, email, blood]


    db.query(query, values, function(err) {
        if (err) {
          console.log(err)
          return res.send("erro no banco de dados.")
        }

        return res.redirect("/")
    })

})

    // ligar servidor e permitir acesso na port 3000.
server.listen(3000, function () {
    console.log("Iniciei o servidor.")
})