require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/app", express.static(path.join(__dirname, "/public")));

const lista_produtos = {
  produtos: [
    {
      id: 1,
      descricao: "Arroz parboilizado 5Kg",
      valor: 25.0,
      marca: "Tio João",
    },
    { id: 2, descricao: "Maionese 250gr", valor: 7.2, marca: "Helmans" },
    { id: 3, descricao: "Iogurte Natural 200ml", valor: 2.5, marca: "Itambé" },
    {
      id: 4,
      descricao: "Batata Maior Palha 300gr",
      valor: 15.2,
      marca: "Chipps",
    },
    { id: 5, descricao: "Nescau 400gr", valor: 8.0, marca: "Nestlé" },
  ],
};

app.get("/", (req, res) =>
  res.json({
    post: "/api/produtos",
    getAll: "/api/produtos",
    GetById: "/api/produtos/:id",
    Put: "/api/produtos/:id",
    Delete: "/api/produtos/:id",
  })
);

app.post("/api/produtos", (req, res) => {
  const { id, descricao, valor, marca } = req.body;

  if (id && descricao && valor && marca) {
    let currentId = Number.parseInt(id);
    let idx = lista_produtos.produtos.findIndex((e) => e.id == currentId);

    if (idx < 0) {
      let newProduct = {
        id: id,
        descricao: descricao,
        valor: valor,
        marca: marca,
      };
      lista_produtos.produtos.push(newProduct);
    } else if (lista_produtos.produtos[idx].id != id) {
      let newProduct = {
        id: id,
        descricao: descricao,
        valor: valor,
        marca: marca,
      };
      lista_produtos.produtos.push(newProduct);
    } else {
      res.status(400).send(`ID ${id} já cadastradoF`);
    }

    res.status(200).send("Salvo com sucesso");
  } else {
    res.status(400).send("Favor, preencher todos os campos");
  }
});

app.get("/api/produtos", (req, res) => {
  res.json(lista_produtos.produtos);
});

app.get("/api/produtos/:id", (req, res) => {
  let id = Number.parseInt(req.params.id);
  let idx = lista_produtos.produtos.findIndex((e) => e.id == id);
  if (idx > -1) {
    res.json(lista_produtos.produtos[idx]);
  } else {
    res.status(400).json({ message: "Produto nao encontrado!" });
  }
});

app.put("/api/produtos/:id", (req, res) => {
  let id = Number.parseInt(req.params.id);
  let idx = lista_produtos.produtos.findIndex((e) => e.id == id);
  if (idx > -1) {
    const { descricao, valor, marca } = req.body;

    descricao ? (lista_produtos.produtos[idx].descricao = descricao) : null;
    valor ? (lista_produtos.produtos[idx].valor = valor) : null;
    marca ? (lista_produtos.produtos[idx].marca = marca) : null;

    res.status(200).send(`id ${id} alterado com sucesso`);
  } else {
    res.status(400).send("Produto nao encontrado!");
  }
});

app.delete("/api/produtos/:id", (req, res) => {
  let id = Number.parseInt(req.params.id);
  let idx = lista_produtos.produtos.findIndex((e) => e.id == id);
  if (idx > -1) {
    lista_produtos.produtos.splice(idx, 1);
    res.json({
      message: "Exlcuido com sucesso",
    });
  } else {
    res.status(400).json({ message: "Produto nao encontrado!" });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

let port = process.env.PORT || 3000;
app.listen(port);
