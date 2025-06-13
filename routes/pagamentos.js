const express = require('express');
const router = express.Router();
const Pagamento = require('../models/Pagamento');

// Esta é uma rota de exemplo, a lógica de pagamento já foi simplificada na rota de ingressos.
router.get('/', async (req, res) => {
    res.send('Rota de pagamentos funcionando. A criação de pagamentos ocorre na compra do ingresso.');
});

module.exports = router;