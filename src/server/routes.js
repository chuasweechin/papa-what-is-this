module.exports = (app) => {
  const analyze = require('./controllers/analyze')();

  app.post('/analyze', analyze.getAll);

};