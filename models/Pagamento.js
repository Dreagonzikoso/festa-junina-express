const db = require('../database');

class Pagamento {
    static async criar(ingressoId, valor, metodoPagamento) {
        const query = `
            INSERT INTO pagamentos (ingresso_id, valor, metodo_pagamento, status)
            VALUES ($1, $2, $3, 'Confirmado')
            RETURNING *;
        `;
        const values = [ingressoId, valor, metodoPagamento];
        try {
            const { rows } = await db.query(query, values);
            return rows[0];
        } catch (error) {
            console.error('Erro ao criar pagamento:', error);
            throw error;
        }
    }
}

module.exports = Pagamento;