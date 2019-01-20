/*eslint-env browser*/

/* ########## register.html ########## */
//global vars
let $em1 = document.getElementById("em1");
let $em2 = document.getElementById("em2");
let $pw1 = document.getElementById("pw1");
let $pw2 = document.getElementById("pw2");
let $alert = document.querySelector(".alert-warning");
let $successAlert = document.querySelector(".alert-success")
let $registerButton = document.querySelector("#btn");
let alertOn = false;
let alertTrigger = "";
let url = 'http://localhost:3000/users';


// show/hide alert
// trigger is the input id that triggered the alert.
function showAlert(bool, alertMsg, trigger) {
	if (bool == true) {
		$alert.innerHTML = alertMsg;
		$alert.style.display = 'block';
		alertOn = true;
		alertTrigger = trigger;
	} else {
		$alert.style.display = 'none';
		alertOn = false;
		alertTrigger = "";

	}
}

//create user obj
// function User(userName, pw, fullName, profilePicLink, role = "regular", userInfo ="", privacy) {
// 	this.userName = userName;
// 	this.password = pw;
// 	this.fullName = fullName;
// 	this.profilePicLink = profilePicLink;
// 	this.role = role;
// 	this. userInfo = userInfo;
// 	this.privacy = privacy;
// }

// validate with db if username available
em1.onblur = function (e) {
	if (em1.value != "" && ValidateEmail())
		checkIfExist($em1.value).catch(error => console.error(error));
	else showAlert(true, "Email adress not valid", "em1");


}

function ValidateEmail() {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($em1.value)) {
		return true;
	}
	return false;
}


async function checkIfExist(userName) { // need to fix  
	try {
		let res = await fetch(`http://localhost:3000/users?userName=${userName}`);
		let res2 = await res.json();
		console.log(res2);
		if (res2.length != 0)
			showAlert(true, "Email already in use", "em1");
		else if (alertTrigger == "em1")
			showAlert(false);
	} catch (e) {
		console.log("catched", e)
	}
}

//check if second email equal to the first
$em2.onblur = function () {
	if ((($em2.value == "") || ($em2.value == $em1.value)) && alertTrigger == "em2")
		showAlert(false);

	else if (!alertOn && $em2.value != $em1.value && $em2.value.length != 0)
		showAlert(true, "Second email not equal to the first email", "em2");

}
// check if pw1 length is 4-10
$pw1.onblur = function () {
	console.log("pw1");
	if (($pw1.value.length < 4 || $pw1.value.length > 10) && !alertOn && $pw1.value.length != 0) {
		showAlert(true, "Password must be 4-10 characters", "pw1");
	} else if ((($pw1.value.length >= 4 && $pw1.value.length <= 10) || $pw1.value.length == 0) && (alertTrigger == "pw1")) {
		showAlert(false);
	}
}
//check if pw2 is equal to pw1;
$pw2.onblur = function () {
	if (($pw2.value != $pw1.value) && !alertOn)
		showAlert(true, "Password does not match", "pw2");
	else if (alertTrigger == "pw2" && ($pw2.value == $pw1.value || $pw2.value == ""))
		showAlert(false);
}

$registerButton.onclick = function () {
	if (lastVerification()) {
		let newUser = new User($em1.value, $pw1.value);
		$registerButton.style.display = 'none';
		addNewUserToDB(newUser);

	} else {
		showAlert(true, "Cannot register, Please fill the alerted fields", alertTrigger);
		if (alertTrigger.length == 0) {
			setTimeout(showAlert, 5000, false);
		}
	}
}

function lastVerification() {
	if (!alertOn) {
		if ($em1.value == $em2.value && $em2.value.length != 0) {
			if ($pw1.value == $pw2.value) {
				return true;
			} else return false;
		} else return false;
	} else return false;
}

async function addNewUserToDB(newUser) {
	await fetch(url, {
			method: 'POST', // or 'PUT'
			body: JSON.stringify(newUser), // data can be `string` or {object}!
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(response => {
			$successAlert.style.display = 'block';
			setTimeout(goToIndex, 3000);
		})
		.catch(error => console.error('Error:', error));
}

function goToIndex() {
	location.href = "index.html";
}