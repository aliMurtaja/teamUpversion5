var express = require('express');
const path = require('path');
var router = express.Router();
// var appDir = path.dirname(require.main);
var appRoot = require('app-root-path');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile(path.join(appRoot.path, 'data', 'product.json'))
  // console.log(res.sendFile(path.join(__dirname, 'data', 'product.json')))
  // console.log(appRoot.path)
  // res.end()
});

module.exports = router;
