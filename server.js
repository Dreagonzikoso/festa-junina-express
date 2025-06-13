const express = require('express');
const cors = require('cors');
const path = require('path');
const ingressosRouter = require('./routes/ingressos');
const pagamentosRouter = require('./routes/pagamentos');

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // Adiciona o middleware para parsear JSON
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (front-end)
app.use(express.static(path.join(__dirname, '..', 'festa-junina-express')));


// Rotas da API
app.use('/api/ingressos', ingressosRouter);
app.use('/api/pagamentos', pagamentosRouter);

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'festa-junina-express', 'index.html'));
});

app.listen(port, () => {
    console.log(`🎉 Servidor da Festa Junina rodando em http://localhost:${port}`);
});