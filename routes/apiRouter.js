const express = require("express");
const apiRouter = express.Router();

const endpoint = "/api";
const knex = require("knex")({
  client: "pg",
  debug: true,
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  },
});

apiRouter.get(endpoint + "produtos", (req, res) => {
  knex
    .select("*")
    .from("produto")
    .then((produtos) => res.status(200).json(produtos))
    .catch((err) => {
      res.status(500).json({
        message: "Error to get products - " + err.message,
      });
    });
});

apiRouter.get(endpoint + "produtos/:id", (req, res) => {
  if (req.params.id) {
    knex
      .select("*")
      .from("produto")
      .where("id", req.params.id)
      .then((produto) => {
        if (produto.length > 0) {
          res.status(200).json(produto);
        } else {
          res.status(404).json({ message: "Not Found" });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "Error to get products - " + err.message,
        });
      });
  } else {
    res.json({ message: "Id is required" });
  }
});

apiRouter.post(endpoint + "produtos", (req, res) => {
  const { id, descricao, valor, marca } = req.body;

  if (id && descricao && valor && marca) {
    knex("produto")
      .insert({
        id: id,
        descricao: descricao,
        valor: valor,
        marca: marca,
      })
      .then(() => {
        res.status(200).json({ message: "Success" });
      })
      .catch((err) => {
        res.status(400).json({ message: err.detail });
      });
  }
});

apiRouter.put(endpoint + "produtos/:id", (req, res) => {
  const { descricao, valor, marca } = req.body;

  knex("produto")
    .update({
      descricao: descricao ? descricao : null,
      valor: valor ? valor : null,
      marca: marca ? marca : null,
    })
    .where("id", req.params.id)
    .then((row) => {
      if (row) {
        res.status(200).json({ message: "Success update" });
      } else {
        res.status(400).json({ message: "Id does not exists" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.detail });
    });
});

apiRouter.delete(endpoint + "produtos/:id", (req, res) => {
  knex("produto")
    .where("id", req.params.id)
    .del()
    .then((row) => {
      if (row) {
        res.status(200).json({ message: "Success to delete", product: row });
      } else {
        res.status(400).json({ message: "Id does not exists" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.detail });
    });
});

module.exports = apiRouter;
