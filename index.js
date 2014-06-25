var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var engines        = require('consolidate');

var app = express();

app.use(express.static(__dirname + '/public_html'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride());

app.engine('html',engines.ejs);
 
var router = express.Router();

router.use(function(req,res,next) {
	console.log('Request Filter in action');
	console.log(req.accepts());
	next();
});

router.route('/')
	.get(function(req, res) {
		res.send('Home')
	});
	
router.route('/widgets')
	
	.get( requestHandler ( 'html', function (req, res) {
		res.render('doc/widgets.html');
	}))
	
	.get( requestHandler ( 'json', function (req, res) {
		var widgets = [{ name : 'inputfield'}];
		res.json(widgets);
	}))
	
router.route('/widgets/:widget_id')
	
	.get(requestHandler('html',function(req,res, next) {
		res.render('widget/'+req.params.widget_id+'.html'); 
	}))
	
	.get(requestHandler('json',function(req,res, next){
		var widget = { name : req.params.widget_id};
		res.json(widget);
	}));
	
router.route('/doc/:widget_id')

	.get(requestHandler('html',function(req,res, next) {
		res.render('doc/'+req.params.widget_id+'.html');
	}));


function requestHandler(mediaType, fn) { 
	return function (req,res,next) {
		if (req.accepts(mediaType))
			fn(req,res,next);
		else 
			next();
	}
}

app.use(router);
app.listen(8080);
console.log('Widget catalog site available on port 8080');
