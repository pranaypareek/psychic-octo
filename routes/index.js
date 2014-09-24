var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	
	if(req.session.user){
		res.render("pages/index", {x:"logged In"});	
	}
	else{
		res.render("pages/index", {x:"logged out"});
	}
	
    
});

router.get('/index', function(req, res) {
	
	res.render("pages/index");
    
});


router.get('/goBack', function(req, res) {
	
	res.render("pages/index", {x:"logged In"});	
    
});

/* GET about page. */
router.get('/about', function(req, res){
	res.render('pages/about');
});

/* Takes the user to a signup form */
router.get('/signup2', function(req, res){
	res.render('pages/signup2');
});


router.post('/loginUser', function(req, res){

	console.log("logging in user");
	var db = req.db;
	var form_userName = req.body.userName;
	var form_password = req.body.inputPassword;
	console.log("form_username: " + form_userName);
	console.log("form_password: " + form_password);

	var usercollection = db.get("usercollection");
	
	/*usercollection.find({"userName": form_userName}, function(err, data){
		console.log(data);
		console.log(data[0]['userName']);
	});*/

	usercollection.find({"userName": form_userName}, function(err, data){
		if(err){
			console.log("User not found");
		}

		//console.log("DATA________________>>>"+userName);
		//var obj = JSON.parse(data);
		//var au_userName = JSON.parse(data);
		//console.log("---------------->"+au_userName.userName);
		var au_userName=data[0]['userName'];
		console.log("logging in "+ au_userName);
		
		usercollection.find({"userName" : au_userName}, {password:1}, function(err, result){
			var au_password=result[0]['password'];

			console.log("au_password: " + au_password);
			console.log("form_password: " + form_password);

			if(form_password == au_password){
				console.log("------ matching passwords ------");
				req.session.regenerate(function(){
					req.session.user = au_userName;
					req.session.success = 'Authenticated as ' + au_userName	;
					console.log(req.session.success);
					res.render('pages/loggedIn',{x: au_userName});
				});
			}else {
				
				req.session.error = 'Authentication Failed';
				res.render('pages/index',{x:'incorrect password or username'});
			}
		});
	});
});

function restrict(req, res, next){
	if(req.session.user){
		next();
	} else {
		req.session.error = 'Access denied!';
		res.render('pages/restrictedArea', {x:"NOT ALLOWED"});
		//res.send("Not accessible");
		//res.redirect('/index');
	}
}

router.get('/logOut', function(req, res){
	req.session.destroy(function(){
		res.render("pages/index",{x:"logged out"});
	});
});

router.get('/restricted', restrict, function(req, res){
	res.render('pages/restrictedArea', {x:"restricted area accessible after logging in"});
	//res.send("restricted area accessible after logging in");
});

router.post('/stuff', function(req, res){
	console.log("stuff");
	function reD(){
		res.redirect('/about');	
	}
	reD();
});


/* POST Add User Service */
router.post('/createUser', function(req, res){
	console.log("in createUser");
	//res.redirect('/index');
	
	//res.render('/loginUser', {x: "In through the create door"});
	
	//Setting internal DB variable
	var db = req.db;
	console.log("parsed db");
	//Getting values from the form; relying on the name attributes of the items; from newuser.jade
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var userName = req.body.userName;
	var email = req.body.userEmail;
	var password =req.body.passwordInput;

	//Getting the user collection from MongoDB
	var collection = db.get("usercollection");

	//Submitting data to the DB
	collection.insert({
		"firstName": firstName,
		"lastName": lastName,
		"userName": userName,
		"userEmail" : email,
		"password": password

	}, function(err, doc){
			console.log("collection insertion");
			if(err){
				//Send an error message if an error is encountered
				res.send("Problem adding to the DB");
			}else{
				//If successful, set the header bar to read /userlist instead of /adduser
				res.location("Created Successfully");
				//Then redirect to the success page
				res.redirect('/about');
			}
		}	
	); 
}); 


module.exports = router;
