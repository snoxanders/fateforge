const appModule = require('../backend/src/app');
const app = appModule.default || appModule;

module.exports = (req, res) => {
    console.log(`API Request: ${req.method} ${req.url}`);
    app(req, res);
};
