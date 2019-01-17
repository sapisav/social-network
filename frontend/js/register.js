/*eslint-env browser*/

/* ########## register.html ########## */
//global vars
let $em1 = document.getElementById("em1");
let $em2 = document.getElementById("em2");
let $pw1 = document.getElementById("pw1");
let $pw2 = document.getElementById("pw2");
let $alert = document.querySelector(".alert");
let alertOn = false;
let alertTrigger = "";

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
function User(userName, pw) {
	this.userName = userName;
	this.password = pw;
}

// validate with db if username available
em1.onblur = function (e) {
	if (em1.value != "")
		checkIfExist($em1.value).catch(error => console.error(error));
	

}

async function checkIfExist(userName) { // need to fix  
	try {
		let res = await fetch(`http://localhost:3000/posts?title=${userName}`);
		let res2 = await res.json();
		console.log(res2);
		if (res2.length != 0) 
			showAlert(true , "Email already in use", "em1");
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
	
	else if(!alertOn && $em2.value != $em1.value)
		showAlert(true, "Second email not equal to the first email", "em2");
	
}
// check if pw1 length is 4-10
$pw1.onblur = function () {
	console.log("pw1");
	if (($pw1.value.length < 4 || $pw1.value.length > 10) && !alertOn && $pw1.value.length != 0) {
		showAlert(true, "Password must be 4-10 characters","pw1");
	}
	else if((($pw1.value.length >= 4 && $pw1.value.length <= 10) || $pw1.value.length == 0) && (alertTrigger == "pw1")){
		showAlert(false);
	}
}
//check if pw2 is equal to pw1;
$pw2.onblur = function(){
	if(($pw2.value != $pw1.value) && !alertOn)
		showAlert(true, "Password does not match", "pw2");
	else if(alertTrigger == "pw2" && ($pw2.value == $pw1.value || $pw2.value == ""))
		showAlert(false);	
}