let loggedInUsername = localStorage.getItem("logged-in-as");
let currentUser = JSON.parse(localStorage.getItem('userObject'));
let myPosts = [];
let postsContainer = document.querySelector("#posts-container");
let collapseID = 0; // had some problem when id contain mail
loadSideBar(currentUser);
loadMyPosts(); // loading current logged in user posts from DB


async function loadMyPosts(){
    myPosts = await fetch(`http://localhost:3000/posts?userName=${currentUser.userName}`)
    .then(function (response) {
        return response.json();
    });
    bindPostsToTemplate();

}

function bindPostsToTemplate(){
    postsList = [];
    for(let i = 0; i<myPosts.length; i++){
        postsList[i] = createPostHtmlTemplate();

        postsList[i].querySelector("#post-header-pic").setAttribute("src", currentUser.pic);
        postsList[i].querySelector("#post-header-name").innerHTML = `${currentUser.firstName} ${currentUser.lastName}`
        postsList[i].querySelector("#post-header-date").innerHTML = myPosts[i].creationTime;
        postsList[i].setAttribute('id', myPosts[i].postID);
        postsList[i].querySelector(".show-cmnt-btn").setAttribute('data-target',`#collapse-${collapseID}`);
        // postsList[i].querySelector(".show-cmnt-btn").setAttribute('aria-controls',`cmnt${myPosts[i].postID}`);
        postsList[i].querySelector(".cola").setAttribute('id', `collapse-${collapseID}`);
        collapseID++;
        postsList[i].querySelector(".data").innerHTML = myPosts[i].data;
        postsList[i].querySelector(".creationTime").innerHTML = myPosts[i].creationTime;
        postsList[i].querySelector(".like-count").innerHTML = myPosts[i].likes;
        bindEvents(postsList[i]);
        // if(myPosts[i].hasComments)
        //     postsList[i].querySelector('.show-cmnt-btn').style.display = 'block';
        postsContainer.prepend(postsList[i]);
        loadComments(myPosts[i].postID, postsList[i]);
        
    }
}
function loadComments(postID, post){
    fetch(`${URL}/comments?postID=${postID}`)
    .then(function (response) {
        return response.json();
    }).then(function(res){
        if(res.length != 0){
            post.querySelector('.show-cmnt-btn').style.display = 'block';
        }
       let cmntList = res;
       let myCmntList = [];
       for(let i = 0; i<cmntList.length; i++){
           myCmntList[i] = createCommentHtmlTemplate();
           myCmntList[i].querySelector(".cmnt-username").innerHTML = cmntList[i].userName+": ";
           myCmntList[i].querySelector(".cmnt-data").innerHTML = cmntList[i].data;
           post.querySelector('.comments-container').append(myCmntList[i]);
       }

    })
}

function bindEvents(post){
    $(post).find('#comment-btn').on('click', function(){
        console.log('ok');
        let commentData = $(post).find('#comment-data').val();
        if(commentData.length == 0){
            //alert empty comment
        }
        else {
            postID = post.getAttribute("id");
            let newComment = new Comment(currentUser ,commentData, postID);
            $.ajax({
                type: 'POST',
                url: `${URL}/comments`,
                data: JSON.stringify(newComment),
                // success: function(data) { alert('data: ' + data); },
                contentType: "application/json",
                dataType: 'json'
            }).done(function(res){
                console.log(JSON.stringify(res));
                currentUser.commentCount++;
                updateServer();
            })
            .fail(function(err){
                console.log(err);
            });
        }
    })
    
}

$('#new-post-btn').on('click', function(){
    let postData = $('#new-post-text').val();
    if(postData.length == 0){
        //alert
    }
     else {
        let newPost = new Post(currentUser, postData);//currentUser.postCount++;
            //create comment obj ?
           
              $.ajax({
                type: 'POST',
                url: `${URL}/posts`,
                data: JSON.stringify(newPost),
                // success: function(data) { alert('data: ' + data); },
                contentType: "application/json",
                dataType: 'json'
            }).done(function(res){
                console.log(JSON.stringify(res));
                currentUser.postCount++;
                updateServer();
            })
            .fail(function(err){
                console.log(err);
            });
     }   
})

function updateServer(){// update profile info
    $.ajax({
        url: `${URL}/users/${currentUser.id}`,
        type: 'PUT',    
        data: JSON.stringify(currentUser),
        contentType: 'application/json',
        // success: function(result) {
        //     alert("success?");
        // }
        
    }).done(function(res){
        // $hiddenContainer.append($editProfile);
        updateLocalStorage(currentUser);
        // updateProfile();
        // $profileInfo.append($showProfile);
        //succes alert
    }).fail(function(err){
        
        console.log(err);
    });
}

