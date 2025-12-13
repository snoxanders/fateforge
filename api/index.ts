// Vercel Serverless Function Entrypoint
// Precisamos garantir que o Express seja carregado corretamente

// Importa o app (note que em TS/ESM x CJS, a exportação default pode vir dentro de .default)
const appModule = require('../backend/src/app');
const app = appModule.default || appModule;

// Vercel espera que a função exportada trate (req, res)
module.exports = (req, res) => {
    // Log para debug no painel da Vercel
    console.log(`API Request: ${req.method} ${req.url}`);
    
    // Passa a requisição para o Express
    app(req, res);
};
