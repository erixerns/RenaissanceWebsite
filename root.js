// =======
// Imports
// =======
var express = require("express");
var router = express.Router();
var passport = require('passport');
var middleware = require('./middleware');

// ========
// Database
// ========
var Event = require("./models/eventModel");
var Stock = require("./models/stockModel");
//! Debug only

var sponsors = [
	"/images/newSponsors/1.jpg",
	"/images/newSponsors/2.png",
	"/images/newSponsors/3.jpg",
	"/images/newSponsors/download.png",
	"/images/newSponsors/outOfTheBlue.jpg",
	"/images/sponsors/cclothing.jpeg"
]

var partners = [
	"/images/partners/1.png",
	"/images/partners/2.jpg",
	"/images/partners/3.jpg",
	"/images/partners/4.png",
	"/images/partners/5.png",
	"/images/partners/6.jpg",
	"/images/partners/7.png",
	"/images/partners/8.jpg",
	"/images/partners/9.JPG"
]

var pastSponsorDetails = [{
		type: "Startup Ecosystem Partners",
		imageUrl: [
			"/images/sponsors/startup1.jpg",
			"/images/sponsors/startup2.jpg",
			"/images/sponsors/startup3.jpg",
			"/images/sponsors/startup4.jpg",
			"/images/sponsors/startup5.jpg",
			"/images/sponsors/startup6.jpg"
		]
	},
	{
		type: "Knowlege Partners",
		imageUrl: [
			"/images/sponsors/knowledge1.jpg",
			"/images/sponsors/knowledge2.jpg",
			"/images/sponsors/knowledge3.jpg"
		]
	},
	{
		type: "Technology Partners",
		imageUrl: [
			"/images/sponsors/tech1.jpg",
			"/images/sponsors/tech2.jpg"
		]
	},
	{
		type: "Event Partners",
		imageUrl: [
			"/images/sponsors/event1.jpg",
			"/images/sponsors/event2.jpg"
		]
	},
	{
		type: "Audio Partners",
		imageUrl: [
			"/images/sponsors/audio1.jpg"
		]
	},
	{
		type: "Media Partners",
		imageUrl: [
			"/images/sponsors/media1.jpg",
			"/images/sponsors/media2.jpg",
			"/images/sponsors/media3.jpg",
			"/images/sponsors/media4.jpg",
			"/images/sponsors/media5.jpg"
		]
	}
];
//! Debug end



// ===========
// Middlewares
// ===========
router.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	next();
});


// ===========
// Root Routes
// ===========

// Root
//stock markting
router.get("/stock", async function (req, res) {
	return res.render("stockTrading");
});

router.post("/stock", async function (req, res) {


	Stock.create({
			email: req.body.email,
			registrationno: req.body.register,
			name: req.body.name,
			number: req.body.number,
			whatsnumber: req.body.number2
		},
		function (err, doc) {
			if (err) {
				req.flash('error', 'Something went wrong.');
				console.log(err);
				return res.redirect("/stock");
			} else {
				req.flash('success', 'Registration  Successful.');
				return res.redirect("/stock");
			}
		}
	);
});

router.get("/admin/stock", middleware.isStockAdmin, async function (req, res) {
	var stockRegistrations = await Stock.find();
	return res.render("stockTradingAdmin", {
		stockRegistrations: stockRegistrations
	});
});

//
router.get("/", function (req, res) {
	Event.find({}, function (err, events) {
		if (err)
			console.log(err);
		else
			res.render("home", {
				events: events
			});
	});
});

// Past Sponsors
router.get("/sponsors", function (req, res) {
	res.render("sponsors", {
		pastSponsors: pastSponsorDetails,
		sponsors: sponsors,
		partners: partners
	});
});


// Feedback
router.post("/feedback", function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var message = req.body.feedbackMsg;
	var subject = req.body.subject;
	if (name === '' || email === '' || message === '') {
		res.send("ERROR: Field is empty");
		return;
	}
	var newfeedback = {
		name: name,
		email: email,
		feedbackText: message,
		subject: subject
	};

	Feedback.create(newfeedback, function (err, feedback) {
		if (err) {
			console.log(err);
			res.send("ERROR: Feedback could not be submitted");
		} else {
			console.log(newfeedback);
			res.send("SUCCESS");
		}
	});
});

// Login and Logout
router.get("/login", function (req, res) {
	console.log("/login, ref:", req.query.ref);

	return res.render("login", {
		error: req.query.error
	});
});

router.post("/login", passport.authenticate("local", {
	failureRedirect: "/login?error=" + 'Error: User doesnt exist!'
}), function (req, res) {
	console.log(req.user.username, " logged in!");
	// if(req.body.reference)
	// 	res.redirect(req.body.reference);
	// else
	// 	res.redirect("/user");
	res.redirect("/user")
});

router.get("/logout", function (req, res) {
	console.log("Logout: ", req.user.username);
	req.logout();
	res.redirect("/");
});


router.get("/partners", function(req, res){
	return res.render("partners");
})


module.exports = router;
