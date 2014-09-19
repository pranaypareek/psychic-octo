var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('pages/index', { title: 'Here\'s logstuff1' });
});

/* GET about page. */
router.get('/about', function(req, res){
	res.render('pages/about');
});

/* Takes the user to a signup form */
router.get('/signup', function(req, res){
	res.render('pages/signup');
});

/* POST Add User Service */
router.post('/createUser', function(req, res){

	//Setting internal DB variable
	var db = req.db;

	//Getting values from the form; relying on the name attributes of the items; from newuser.jade
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var userName = req.body.userName;
	var email = req.body.email;
	var password =req.body.passwordInput;

	//Getting the user collection from MongoDB
	var collection = db.get("usercollection");

	//Submitting data to the DB
	collection.insert({
		"firstName": firstName,
		"lastName": lastName,
		"userName": userName,
		"userEmail" : userEmail,
		"password": passwordInput

	}, function(err, doc){
			if(err){
				//Send an error message if an error is encountered
				res.send("Problem adding to the DB");
			}else{
				//If successful, set the header bar to read /userlist instead of /adduser
				res.location("Created Successfully");
				//Then redirect to the success page
				res.render('pages/success');
			}
		}	
	);
});

module.exports = router;
