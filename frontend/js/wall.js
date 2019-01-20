let loggedInUsername = localStorage.getItem("logged-in-as");
let myPosts = [];
let postsContainer = document.querySelector("#posts-container");
loadMyPosts(); // loading current logged in user posts from DB

async function loadMyPosts(){
    myPosts = await fetch(`http://localhost:3000/posts?userName=${loggedInUsername}`)
    .then(function (response) {
        return response.json();
    });
    bindPostsToTemplate();

}

function bindPostsToTemplate(){
    postsList = [];
    for(let i = 0; i<myPosts.length; i++){
        postsList[i] = createPostHtmlTemplate();
        postsList[i].querySelector(".data").innerHTML = myPosts[i].data;
        postsList[i].querySelector(".creationTime").innerHTML = myPosts[i].creationTime;
        postsList[i].querySelector(".like-count").innerHTML = myPosts[i].likes;
        bindEvents(postsList[i]);
        postsContainer.append(postsList[i]);
        
    }
}

function bindEvents(post){
    
}

