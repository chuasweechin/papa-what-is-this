module.exports = (app) => {
  const analyze = require('./controllers/analyze')();

  app.post('/analyzeImage', analyze.getImageDescription);
  app.post('/analyzeText', analyze.getTextAudio);
};