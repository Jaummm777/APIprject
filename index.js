const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const TINY_API_TOKEN = 'private_token'; //token privado para segurança do cliente.
const BASE_URL_PEDIDOS = 'https://api.tiny.com.br/api2/pedidos.obter.php';

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bem-vindo à API! Use /pedidos para listar todos os pedidos.');
});

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
      res.json(data.retorno.pedidos);
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

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});