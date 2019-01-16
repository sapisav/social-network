/*eslint-env browser*/

/* ########## register.html ########## */
//global vars
var em1 = document.getElementById("em1");
var em2 = document.getElementById("em2");
var pw1 = document.getElementById("pw1");
var pw2 = document.getElementById("pw2");
var errMsg = document.getElementById("err");

//some js validation
document.getElementById("btn").onclick = function () {

	if (em1.value != em2.value) {
		errMsg.innerHTML = "email does not match";
		errMsg.style.display = 'block';

	} else if (pw1.value != pw2.value) {
		errMsg.innerHTML = "password does not match";
		errMsg.style.display = 'block';
	} else {
		errMsg.style.display = 'none';
	}


}