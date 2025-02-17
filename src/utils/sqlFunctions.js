const mysql2 = require("mysql2");
const config = require("../db/config");
const pool = mysql2.createPool(config);

// Função para criar tabelas
const createTable = (schema) => {
  return new Promise((resolve, reject) => {
    pool.query(schema, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Função genérica para buscar registros
const queryRecord = (query, values = []) => {
  return new Promise((resolve, reject) => {
    pool.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Função para inserir registros
const insertRecord = (tableName, record) => {
  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
    return Promise.reject(new Error("Invalid table name"));
  }

  return new Promise((resolve, reject) => {
    const query = `INSERT INTO ${tableName} SET ?`;

    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve({ insertId: results.insertId, ...record });
      }
    });
  });
};

module.exports = {
  createTable,
  queryRecord,
  insertRecord,
};
