const db = require('../database');

class Ingresso {
  static async criar(nome, tipo, email, preco) {
    const query = `
      INSERT INTO ingressos (nome, tipo, email, preco)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [nome, tipo, email, preco];
    try {
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Erro ao criar ingresso:', error);
      throw error;
    }
  }

  static async buscarTodos() {
    const query = 'SELECT * FROM ingressos ORDER BY id DESC;';
    try {
        const { rows } = await db.query(query);
        return rows;
    } catch (error) {
        console.error('Erro ao buscar todos os ingressos:', error);
        throw error;
    }
  }
}

module.exports = Ingresso;