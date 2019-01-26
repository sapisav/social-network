let loggedInUsername = localStorage.getItem("logged-in-as");
let currentUser = JSON.parse(localStorage.getItem('userObject'));
let myPosts = [];
let postsContainer = document.querySelector("#posts-container");
let collapseID = 0; // had some problem when id contain mail
let collapseCommentButtonID = 0; // if i only use collapseID for all, conflict posiblle? lines 64-68
let collapseShowCommentButtonID = 0; // if i only use collapseID for all, conflict posiblle?
let loadedPosts = [];
loadedComments = [];
loadSideBar(currentUser);
loadMyPosts(); // loading current logged in user posts from DB


async function loadMyPosts() {
    myPosts = await fetch(`${URL}/posts?userName=${currentUser.userName}`)
        .then(function (response) {
            return response.json();
        });
      
    bindPostsToTemplate();

}

function bindPostsToTemplate() {
    postsList = [];
    for (let i = 0; i < myPosts.length; i++) {
        let pID = myPosts[i].postID;
        if(true){ //loadedPosts.indexOf(pID) === -1
            loadedPosts.push(pID);
        
        postsList[i] = createPostHtmlTemplate();

        postsList[i].querySelector("#post-header-pic").setAttribute("src", currentUser.pic);
        postsList[i].querySelector("#post-header-name").innerHTML = `${currentUser.firstName} ${currentUser.lastName}`
        postsList[i].querySelector("#post-header-date").innerHTML = myPosts[i].creationTime;
        postsList[i].setAttribute('id', myPosts[i].postID);
        postsList[i].querySelector(".show-cmnt-btn").setAttribute('data-target', `#collapse-${collapseID}`);
        // postsList[i].querySelector(".show-cmnt-btn").setAttribute('aria-controls',`cmnt${myPosts[i].postID}`);
        postsList[i].querySelector(".cola").setAttribute('id', `collapse-${collapseID}`);
        collapseID++;
        postsList[i].querySelector(".data").innerHTML = myPosts[i].data;
        postsList[i].querySelector(".creationTime").innerHTML = myPosts[i].creationTime;
        postsList[i].querySelector(".like-count").innerHTML = myPosts[i].likes;

        loadComments(myPosts[i].postID, postsList[i]);
        bindEvents(postsList[i]);
        // if(myPosts[i].hasComments)
        //     postsList[i].querySelector('.show-cmnt-btn').style.display = 'block';
        postsContainer.prepend(postsList[i]);

        }
    }
}

function loadComments(postID, post) {
    fetch(`${URL}/comments?postID=${postID}`)
        .then(function (response) {
            return response.json();
        }).then(function (res) {
            if (res.length != 0) {
                post.querySelector('.show-cmnt-btn').style.display = 'block';
            }
            let cmntList = res;
            let myCmntList = [];
            for (let i = 0; i < cmntList.length; i++) {
                myCmntList[i] = createCommentHtmlTemplate();

                myCmntList[i].querySelector('#inner').append(createCommentOfCommentHtmlTemplate());
                myCmntList[i].setAttribute('id', cmntList[i].commentID);
                //event + ajax when user comment to comment
                myCmntList[i].querySelector('#comment-btn').onclick = function () {
                    let commentData = $(myCmntList[i]).find('#com-com-data').val();
                    $(myCmntList[i]).find('#com-com-data').val('');
                    if (commentData.length == 0) {
                        //alert empty comment
                    } else {
                        postID = myCmntList[i].getAttribute("id"); //this case postID is actually comment id
                        let newComment = new Comment(currentUser, commentData, postID);
                        $.ajax({
                                type: 'POST',
                                url: `${URL}/comments`,
                                data: JSON.stringify(newComment),
                                // success: function(data) { alert('data: ' + data); },
                                contentType: "application/json",
                                dataType: 'json'
                            }).done(function (res) {
                                console.log(JSON.stringify(res));
                                currentUser.commentCount++;
                                updateServer();
                                loadThisComOfCom(newComment, myCmntList[i]);
                                
                                myCmntList[i].querySelector('#com-of-com-btn').style.display = 'inline';
                                // loadComments(postID, post);
                            })
                            .fail(function (err) {
                                console.log(err);
                            });
                    }
                }


                //ajax req for comments of comments
                // fetch(`${URL}/comments?postID=${cmntList[i].postID}`)
                //     .then(function (response) {
                //         let commentsRes = response.json();
                //         if (commentsRes.length > 0) {
                //             myCmntList[i].querySelector('#com-of-com-btn').style.display = 'block';
                //         }
                //         let commentContainer = myCmntList[i].querySelector('#com-of-com-show');
                //         for (let i = 0; i < commentsRes.length; i++) {
                //             commentContainer.append(createCommentHtmlTemplate());

                //         }
                //     })


                myCmntList[i].querySelector("#com-to-com-btn").setAttribute('data-target', `#collapse-ctc-${collapseCommentButtonID}`);
                myCmntList[i].querySelector("#com-to-com-input").setAttribute('id', `collapse-ctc-${collapseCommentButtonID}`);
                collapseCommentButtonID++;
                myCmntList[i].querySelector("#com-to-com-btn").onclick = function (e) {
                    if (e.currentTarget.value == 'show') {
                        e.currentTarget.value = 'hide';
                        e.currentTarget.innerHTML = 'Hide';
                    } else {
                        e.currentTarget.value = 'show';
                        e.currentTarget.innerHTML = 'Comment';
                    }
                }
                myCmntList[i].querySelector("#com-of-com-btn").onclick = function (e) {
                    if (e.currentTarget.value == 'show') {
                        e.currentTarget.value = 'hide';
                        e.currentTarget.innerHTML = 'Hide comments';
                    } else {
                        e.currentTarget.value = 'show';
                        e.currentTarget.innerHTML = 'Show comments';
                    }
                }

                myCmntList[i].querySelector("#com-of-com-btn").setAttribute('data-target', `#collapse-coc-${collapseShowCommentButtonID}`);
                myCmntList[i].querySelector("#com-of-com-show").setAttribute('id', `collapse-coc-${collapseShowCommentButtonID}`);
                collapseShowCommentButtonID++;

                myCmntList[i].querySelector(".cmnt-username").innerHTML = cmntList[i].userName + ": ";
                myCmntList[i].querySelector(".cmnt-data").innerHTML = cmntList[i].data;
                // myCmntList[i].querySelector('#inner').append(createCommentOfCommentHtmlTemplate());
                loadComOfCom(cmntList[i].commentID, myCmntList[i]);
                post.querySelector('.comments-container').append(myCmntList[i]);
            }

        })
}

function loadThisComOfCom(newComment, comElement){
    let commentsContainer = comElement.querySelector('#inner').querySelector('.colaa');
    let cc = createCommentHtmlTemplate();
    cc.querySelector('.cmnt-username').innerHTML = newComment.userName;
    cc.querySelector('.cmnt-data').innerHTML = newComment.data;
    cc.querySelector('.like-count').innerHTML = newComment.likes;
    commentsContainer.append(cc);//
}

function loadComOfCom(comID, comElement) {
    // console.log(comElement);
    fetch(`${URL}/comments?postID=${comID}`)
        .then(function (response) {
            return response.json();

        }).then(function (res) {
            let commentsRes = res;
            let commentsContainer = comElement.querySelector('#inner').querySelector('.colaa');
            // commentsContainer.innerHTML = "";
            commentsContainer.setAttribute('class', 'collapse cola colaa c-of-c');
            console.log(commentsRes);
            if (commentsRes.length > 0) {
                comElement.querySelector('#com-of-com-btn').style.display = 'inline';
                
                for (let i = 0; i < commentsRes.length; i++) {
                    let cc = createCommentHtmlTemplate();
                    cc.querySelector('.cmnt-username').innerHTML = commentsRes[i].userName;
                    cc.querySelector('.cmnt-data').innerHTML = commentsRes[i].data;
                    cc.querySelector('.like-count').innerHTML = commentsRes[i].likes;
                    commentsContainer.append(cc);//
                    console.log(cc);

                }
            }

        })
}

function bindEvents(post) {
    // comment button event
    $(post).find('#comment-btn').on('click', function () {
        
        let commentData = $(post).find('textarea#comment-data').val();
        $(post).find('textarea#comment-data').val('');
        // console.log(commentData);
        if (commentData.length == 0) {
            //alert empty comment
        } else {
            postID = post.getAttribute("id");
            let newComment = new Comment(currentUser, commentData, postID);
            $.ajax({
                    type: 'POST',
                    url: `${URL}/comments`,
                    data: JSON.stringify(newComment),
                    // success: function(data) { alert('data: ' + data); },
                    contentType: "application/json",
                    dataType: 'json'
                }).done(function (res) {
                    console.log(JSON.stringify(res));
                    currentUser.commentCount++;
                    updateServer();
                    post.querySelector('.show-cmnt-btn').style.display = 'inline';
                    loadComments(postID, post);
                    // loadThisComment(post, newComment);
                    // commentData.val('');
                })
                .fail(function (err) {
                    console.log(err);
                });
        }
    })
    // show/hide comments button event
    $(post).find('#show-cmnt-btn').on('click', function (e) {
        if (e.currentTarget.value == 'show') {
            e.currentTarget.value = 'hide';
            e.currentTarget.innerHTML = 'Hide comments';
        } else {
            e.currentTarget.value = 'show';
            e.currentTarget.innerHTML = 'Show comments';
        }
    })

    // like event


    //

}

$('#new-post-btn').on('click', function () {
    let postData = $('#new-post-text').val();
    $('#new-post-text').val('');
    if (postData.length == 0) {
        //alert
    } else {
        let newPost = new Post(currentUser, postData); //currentUser.postCount++;
        //create comment obj ?

        $.ajax({
                type: 'POST',
                url: `${URL}/posts`,
                data: JSON.stringify(newPost),
                // success: function(data) { alert('data: ' + data); },
                contentType: "application/json",
                dataType: 'json'
            }).done(function (res) {
                console.log(JSON.stringify(res));
                currentUser.postCount++;
                updateServer();
                loadMyPosts();
            })
            .fail(function (err) {
                console.log(err);
            });
    }
})

function updateServer() { // update profile info
    $.ajax({
        url: `${URL}/users/${currentUser.id}`,
        type: 'PUT',
        data: JSON.stringify(currentUser),
        contentType: 'application/json',
        // success: function(result) {
        //     alert("success?");
        // }

    }).done(function (res) {
        // $hiddenContainer.append($editProfile);
        updateLocalStorage(currentUser);
        // updateProfile();
        // $profileInfo.append($showProfile);
        //succes alert
    }).fail(function (err) {

        console.log(err);
    });
}

// loadThisComment(post, newComment){

// }