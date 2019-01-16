/*eslint-env browser*/


/* ########## feed - wall.html ########## */

var globalY = -500;
window.onscroll = function () {
	if (document.body.getBoundingClientRect().y < globalY) {
		// you're at the bottom of the page

		//hidden container contains all posts without duplication to avoid exp grow of the feed.
		var posts = document.querySelector("#hidden-container").querySelectorAll(".card-post");
		//		console.log(posts);
		var postlist = [];
		var postsContainer = document.querySelector("#posts-container");
		for (let i = 0; i < posts.length; i++) {
			postlist[i] = posts[i].cloneNode(true);
			postsContainer.append(postlist[i]);

		}

		addEv(postlist);
		//		addEvents(); 
		globalY = globalY - 1100;
		// for the new posts


	}


};
/// add events for new data
function addEv(list) {
	for (let i = 0; i < list.length; i++) {
		list[i].querySelector(".cmnt-btn").onclick = function (ev) {
			var obj = ev.currentTarget;
			obj = obj.parentElement;

			var txt = obj.querySelector(".form-control").value;
			//	console.log(txt);
			obj = obj.parentElement.querySelector("ul");
			var cmnt = document.createElement("li");
			cmnt.innerHTML = "<b>userF </b>" + txt;
			obj.append(cmnt);
		}
		list[i].querySelector(".emoji").onclick = function (ev) {
			var ob = ev.currentTarget.parentElement.querySelector("span");
			var num = parseInt(ob.innerHTML)
			num++;
			ob.innerHTML = num;
			console.log(ob.textContent);

		}
	}
}




//init events
document.querySelector("body").onload = function () {
	addEvents();
}



function addEvents() {
	/// comment button
	var cmntButtons = document.querySelectorAll(".cmnt-btn");
	for (let i = 0; i < cmntButtons.length; i++) {

		cmntButtons[i].onclick = function (ev) {
			var obj = ev.currentTarget;
			obj = obj.parentElement;

			var txt = obj.querySelector(".form-control").value;
			//	console.log(txt);
			obj = obj.parentElement.querySelector("ul");
			var cmnt = document.createElement("li");
			cmnt.innerHTML = "<b>userF </b>" + txt;
			obj.append(cmnt);
		}
	}
	/// like clickable
	var likes = document.querySelectorAll(".emoji");
	console.log(likes);
	for (let i = 0; i < likes.length; i++) {
		likes[i].onclick = function (ev) {
			var ob = ev.currentTarget.parentElement.querySelector("span");
			var num = parseInt(ob.innerHTML)
			num++;
			ob.innerHTML = num;
			console.log(ob.textContent);

		}
	}

}

//sort function need to fix
document.querySelector("#sort-by").onchange = function () {
//	console.log("sort");
//	var list = document.querySelectorAll(".card-post");
//	for (let i = 0; i < list.length; i++){
//		var biggest = list[i];
//		var biggestNum = parseInt(biggest.querySelector("span").innerHTML)
//		for(let j=i+1; j>list.length; j++){
//			var check = list[j];
//			var checkNum = parseInt(check.querySelector("span").innerHTML);
//			if(checkNum > biggestNum){
//				biggestNum = checkNum;
//				var tmp = check.cloneNode(true);
//				list[i] = biggest;
//				list[j] = tmp;
//				
//			}
//		}
//	}
//	var list2 = new Array(list);
//	var cnt = document.querySelector("#posts-container");
//	cnt.innerHTML = "";
//	
//	for(let i = 0; i<list2.length; i++){
//		cnt.append(list2[i]);
//	}
}

// make new post
document.getElementById("new-post-btn").onclick = function () {
	//	var pic = document.getElementById("pic-file").v
	var txt = document.getElementById("new-post-text").value;
	var post = document.querySelector(".card-post");
	var postClone = post.cloneNode(true);

	postClone.querySelector(".p-txt").innerHTML = txt;
	
	document.querySelector("#posts-container").prepend(postClone);
	var list = [];
	list.push(postClone);
	addEv(list);
	var postClone2 = postClone.cloneNode(true);
	document.querySelector("#hidden-container").prepend(postClone2);


}


// adding all comment buttons event
document.querySelector("#posts-container").onchange = function () {



}
