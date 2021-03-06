/*eslint-env browser*/

let $userName = document.querySelector("#userName");
let $pw = document.querySelector("#pw");
let $alert = document.querySelector(".alert");
// redirect to feed after login button is clicked if verification succed, else will show bootstrap alert
document.getElementById("loginBTN").onclick = function () {
	validateUsernameAndPw();
};
// alert user when username or pw wrong for 3seconds
function showAlert(bool){
	if(bool){
		$alert.style.display = 'block';
		setTimeout(showAlert,3000,false);
	}else $alert.style.display = 'none';

}



async function validateUsernameAndPw(){
	let user = await fetch(`http://localhost:3000/users?userName=${$userName.value}`)
        .then(function (response) {
            return response.json();
        }).catch(error => console.log(error));

    
    if(user.length == 0){
		showAlert(true);
		
	}
	else if(user[0].password != $pw.value){
		showAlert(true);
	}
	else {
		let count = await fetch(`http://localhost:3000/posts?userName=${$userName.value}`)
		.then(function (response) {
			return response.json();})
		.catch(error => console.error('Error:', error));
		// localStorage.setItem("postsCount", count.length);
		// localStorage.setItem("logged-in-as", `${user[0].userName}`);
		localStorage.setItem("userObject",JSON.stringify(user[0]));
		localStorage.setItem('profile-of', user[0].userName);
		localStorage.setItem('anonymous', 'false');
		if(user[0].initProfile)
			location.href = "feed.html";
		else location.href = "profile.html";
	}
}

async function countPosts(){
	let count = await fetch(`http://localhost:3000/posts?userName=${$userName.value}`)
		.then(function (response) {
            return response.json();
		})
		
}

$('#anonymous-login').on('click', function(){
	localStorage.setItem('anonymous', 'true');
	location.href = 'feed.html';
})

