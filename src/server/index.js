const http = require('http');
const express = require('express');
const methodOverride = require('method-override');
const db = require('./db');
const multer  = require('multer');
// const upload = multer({ dest: 'uploads/' });

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;

// make sure user defined env config exist
if (process.env.GOOGLE_APPLICATION_CREDENTIALS === undefined || process.env.GOOGLE_KNOWLEDGE_GRAPH_API_KEY === undefined) {
    onUnhandledError("Missing ENV config");
}

function onUnhandledError(err) {
  console.log('ERROR:', err);
  process.exit(1);
}

process.on('unhandledRejection', onUnhandledError);
process.on('uncaughtException', onUnhandledError);

const setupAppRoutes =
  process.env.NODE_ENV === 'development' ? require('./middlewares/development') : require('./middlewares/production');

const app = express();

app.set('env', process.env.NODE_ENV);


// Set up middleware
app.use(methodOverride('_method'));
app.use(
  express.urlencoded({
    extended: true
  })
);

// this is to enable request.body for post request
app.use(express.json());

// this is to enable request.body for multi-part form request
app.use(multer({dest:'./uploads/'}).single('file'));

// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

require('./routes')(app, db);

// application routes (this goes last)
setupAppRoutes(app);

http.createServer(app).listen(process.env.PORT, () => {
  console.log(`HTTP server is now running on http://localhost:${process.env.PORT}`);
});