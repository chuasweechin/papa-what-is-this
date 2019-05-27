module.exports = (app, db) => {
  const products = require('./controllers/products')(db);

  app.post('/products', products.getAll);

};