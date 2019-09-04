const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_port = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute ='mongodb://127.0.0.1:27017/Users';

//connects our backend code to our database.
mongoose.connect(dbRoute, { useNewUrlParser: true});

//Deprecated error 
mongoose.set('useFindAndModify', false);

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

//check if connection with database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error'));

//(optional) only made for logging and 
//body parse, parses the request body to be a readble json format.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));

//this is our get method
//this method fetches all the available data in our database
router.get('/getData', (req, res) => {
	Data.find((err, data) =>{
		if(err) return res.json({success: false, error: err});
		return res.json({success: true, data: data});
	});
});

//this is our update method
//this method overwrites existing data in our database
router.post('/updateData', (req, res) => {
	const {id, update} = req.body;
	console.log(id);
	console.log(update);
	Data.findByIdAndUpdate(id, update, (err) => {
		if(err) return res.json({ success: false, error: err});
		return res.json({success: true});
	});
});


//this is our delete method
//this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
	const { id } = req.body;
	console.log(id);
	Data.findByIdAndRemove(id, (err) => {
		if(err) return res.send(err);
		return res.json({ success: true });
	});
});

//this is our create method
//this method add a new data in our database
router.post('/putData', (req, res) => {
	let data = new Data();
	const {id, message} = req.body;
	if((!id && id !== 0) || !message){
		return res.json({
			success: false,
			error: 'INVALID INPUTS'
		});
	}
	data.message = message;
	data.id = id;
	data.save((err) => {
		if(err) return res.json({ success: false, error: err});
		return res.json({success: true});
	});
});


//append /api for http requests
app.use('/api', router);

//launch our backend into a port
app.listen(API_port, () => console.log(`Listening on port ${API_port}`)); 