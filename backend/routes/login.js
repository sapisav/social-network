const express = require("express");
const router = express.Router();

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