const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Substitua pelo seu token de autenticação
const TINY_API_TOKEN = 'b1cbdd9d331fb3fddff654944bdc4de7e3adb1cefcae9f2bec9546dde73ce1a9';
const BASE_URL_PEDIDOS = 'https://api.tiny.com.br/api2/pedidos.obter.php'; // Verifique este endpoint

// Middleware para lidar com JSON
app.use(express.json());

// Rota para a URL raiz
app.get('/', (req, res) => {
  res.send('Bem-vindo à API! Use /pedidos para listar todos os pedidos.');
});

// Rota para listar todos os pedidos
app.get('/pedidos', async (req, res) => {
  try {
    const response = await axios.get(BASE_URL_PEDIDOS, {
      params: {
        token: TINY_API_TOKEN,
        formato: 'json',
      },
    });

    const data = response.data;

    if (data.retorno && data.retorno.status === 'OK') {
      res.json(data.retorno.pedidos); // Ajuste conforme a estrutura real do retorno
    } else {
      res.status(400).json({
        error: data.retorno ? data.retorno.erros.map((erro) => erro.erro).join(', ') : 'Erro desconhecido',
      });
    }
  } catch (error) {
    if (error.response) {
      console.error('Erro ao acessar a API do Tiny:', error.response.data);
      res.status(500).send(`Erro ao acessar a API do Tiny: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error('Erro ao acessar a API do Tiny:', error.message);
      res.status(500).send('Erro ao acessar a API do Tiny.');
    }
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});