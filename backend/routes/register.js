const express = require("express");
const router = express.Router();
const registerService = require("../service/register-service");


/* GET register page. */
router.get("/", function (req, res, next) {
	res.sendFile('C:/Users/sapis/Desktop/web development/Project_v3/social-network/backend/static/html/register.html');
})

/* POST register new user. */
router.post("/", function (req, res, next) {
	// validate username and pass
	const registrationTest = registerService(req.body.username, req.body.password);
	if (registrationTest.status) { // create new user
		res.send(registrationTest.reason);
	} else { //cannot create new user because registrationTest.reason
		res.statusCode = 400;
		res.send(registrationTest.reason);
	}

})



module.exports = router;