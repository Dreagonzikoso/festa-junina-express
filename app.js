document.addEventListener('DOMContentLoaded', () => {
    const comprarIngressoForm = document.getElementById('comprar-ingresso-form');
    const mensagemDiv = document.getElementById('mensagem');
    const ingressosList = document.getElementById('ingressos-list');

    // Função para exibir mensagens
    const showMessage = (message, type = 'success') => {
        mensagemDiv.textContent = message;
        mensagemDiv.className = `mensagem ${type}`;
        setTimeout(() => {
            mensagemDiv.textCorequire("dotenv").config();

const http = require("http");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

const requestHandler = async (req, res) => {
  const result = await sql`SELECT version()`;
  const { version } = result[0];
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(version);
};

http.createServer(requestHandler).listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});ntent = '';
            mensagemDiv.className = 'mensagem';
        }, 3000);
    };

    // Função para carregar e exibir os ingressos comprados
    const carregarIngressos = async () => {
        try {
            const response = await fetch('/api/ingressos');
            if (!response.ok) {
                throw new Error('Erro ao buscar ingressos.');
            }
            const ingressos = await response.json();
            ingressosList.innerHTML = ''; // Limpa a lista antes de adicionar os novos
            ingressos.forEach(ingresso => {
                const li = document.createElement('li');
                li.textContent = `${ingresso.nome} - ${ingresso.tipo} (R$ ${ingresso.preco}) - Email: ${ingresso.email}`;
                ingressosList.appendChild(li);
            });
        } catch (error) {
            console.error('Falha ao carregar ingressos:', error);
            showMessage('Não foi possível carregar os ingressos.', 'error');
        }
    };


    // Evento de submit do formulário de compra
    comprarIngressoForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const tipo = document.getElementById('tipo').value;
        const email = document.getElementById('email').value;

        try {
            const response = await fetch('/api/ingressos/comprar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, tipo, email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao comprar ingresso.');
            }

            const novoIngresso = await response.json();
            showMessage(`Ingresso ${novoIngresso.tipo} comprado com sucesso para ${novoIngresso.nome}!`);
            comprarIngressoForm.reset();
            carregarIngressos(); // Recarrega a lista de ingressos

        } catch (error) {
            console.error('Falha na compra:', error);
            showMessage(error.message, 'error');
        }
    });

    // Carrega os ingressos quando a página é carregada
    carregarIngressos();
});