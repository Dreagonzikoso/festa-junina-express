const express = require('express');
const router = express.Router();
const Ingresso = require('../models/Ingresso');
const Pagamento = require('../models/Pagamento');

// Rota para comprar um novo ingresso
router.post('/comprar', async (req, res) => {
    const { nome, tipo, email } = req.body;

    if (!nome || !tipo || !email) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    const precos = {
        'Pista': 50.00,
        'VIP': 100.00
    };
    const preco = precos[tipo];

    try {
        const novoIngresso = await Ingresso.criar(nome, tipo, email, preco);
        // Simulação de um pagamento logo após a compra do ingresso
        await Pagamento.criar(novoIngresso.id, preco, 'Cartão de Crédito');
        res.status(201).json(novoIngresso);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao processar a compra do ingresso.', error: error.message });
    }
});

// Rota para listar todos os ingressos
router.get('/', async (req, res) => {
    try {
        const ingressos = await Ingresso.buscarTodos();
        res.status(200).json(ingressos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar ingressos.', error: error.message });
    }
});


module.exports = router;