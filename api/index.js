// Vercel Serverless Function Entrypoint
// Precisamos apontar para o arquivo JS compilado
const app = require('../backend/dist/app').default;

module.exports = app;
