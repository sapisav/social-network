let currentUser = JSON.parse(localStorage.getItem('userObject'));
let collapseID = 0;
loadSideBar(currentUser);
loadPosts();
/* ### FLOW of loadPosts(); ###
send GET request to get all posts of current user
    for each post:
        than: bind post to template
        than: add events to post template
        than: send GET request to get all comments that belong to this post
            for each comment:
                than: bind comment to template
                than: add events to comment template
                then: send GET request to get all comments that belong to this comment
                    for each comment of comment:
                        than: bind comment of comment to template
                        than: add events to comment of comment template
                        than: continue to the next post if exist (end of single iteration)
*/
function loadPosts() {
    $.get(`${URL}/posts?userName=${currentUser.userName}`)
        .done(function (response) {
            bindPostsToTemplate(response);
        })
}

function bindPostsToTemplate(posts) {
    for (let i = 0; i < posts.length; i++) {
        let postTemplate = $(createPostHtmlTemplate());

        postTemplate.attr('id', posts[i].postID);
        postTemplate.find("#post-header-pic").attr("src", currentUser.pic);
        postTemplate.find("#post-header-name").html(`${currentUser.firstName} ${currentUser.lastName}`);
        postTemplate.find("#post-header-date").html(posts[i].creationTime);
        postTemplate.find(".show-cmnt-btn").attr('data-target', `#collapse-${collapseID}`);
        postTemplate.find('.cola').attr('id', `collapse-${collapseID++}`);
        postTemplate.find('.data').html(posts[i].data);
        postTemplate.find('creationTime').html(posts[i].creationTime);
        postTemplate.find('.like-count').html(posts[i].likes);

        postTemplate.find('#show-likers-btn').attr('data-content', `${getLikers(posts[i].likers)}`);//
        
        addPostEvents(postTemplate, posts[i]);
        

        loadCom(postTemplate, posts[i].postID);

        $('#psts').prepend(postTemplate);
    }
    $('[data-toggle="popover"]').popover({
        html: true}
    );
    
        
      
}
/* POST EVENTS */
function addPostEvents(postTemplate, post) {
    /* Comment to post */
    postTemplate.find('#comment-btn').on('click', function () {
        let commentData = postTemplate.find('textarea#comment-data').val();
        if (commentData.length == 0) {
            //alret empty
        } else {
            postID = postTemplate.attr('id');
            let newComment = new Comment(currentUser, commentData, postID);
            $.ajax({
                    type: 'POST',
                    url: `${URL}/comments`,
                    data: JSON.stringify(newComment),
                    contentType: "application/json",
                    dataType: 'json'
                }).done(function (res) {
                    currentUser.commentCount++;
                    updateServer();
                    console.log(postTemplate);
                    postTemplate.find('#show-cmnt-btn').css('display', 'inline');
                    bindComsToTemplate([newComment], postTemplate);
                    // loadComments(postID, post); appen new comm
                    // loadThisComment(post, newComment);
                    // commentData.val('');
                })
                .fail(function (err) {
                    console.log(err);
                });
        }
    });
    /* like to post */
    postTemplate.find('.emoji').on('click', function (ev) {
        let notification;
        if (post.likers.includes(currentUser.userName)) {
            post.likers.pop(currentUser.userName);
            post.likes--;
            notification = `${currentUser.userName} liked ur post`;
        } else {
            post.likers.push(currentUser.userName);
            post.likes++;
            notification = `${currentUser.userName} unliked ur post`;
        }
        updateLikes(ev, 'posts', post, notification);

    });
    /* show/hide comments of post */
    postTemplate.find('#show-cmnt-btn').on('click', function (ev) {
        if (ev.currentTarget.value == 'show') {
            ev.currentTarget.value = 'hide';
            ev.currentTarget.innerHTML = 'Hide comments';
        } else {
            ev.currentTarget.value = 'show';
            ev.currentTarget.innerHTML = 'Show comments';
        }
    })

}

/* update likes of POST/COMMENT */
function updateLikes(ev, path, post, notification) {
    $.ajax({
        url: `${URL}/${path}/${post.id}`,
        type: 'PUT',
        data: JSON.stringify(post),
        contentType: 'application/json',
    }).done(function (res) {
        $(ev.currentTarget).next().text(post.likes);
    }).fail(function (err) {
        console.log(err);
    });
}
/* Update current user */
function updateServer() { // better name
    $.ajax({
        url: `${URL}/users/${currentUser.id}`,
        type: 'PUT',
        data: JSON.stringify(currentUser),
        contentType: 'application/json',
    }).done(function (res) {
        updateLocalStorage(currentUser);
    }).fail(function (err) {
        console.log(err);
    });
}
/* Load comments for single post -> bind them to template -> add events for each comment */
function loadCom(postTemplate, postID) {
    $.get(`${URL}/comments?postID=${postID}`)
        .done(function (response) {
            if (response.length > 0) {
                postTemplate.find('.show-cmnt-btn').css('display', 'block');
                bindComsToTemplate(response, postTemplate);
            }
        })

}
/* bind them to template -> add events for each comment */
function bindComsToTemplate(comments, postTemplate) {
    for (let i = 0; i < comments.length; i++) {
        let commentTemplate = $(createCommentHtmlTemplate());
        commentTemplate.find('.cmnt-username').text(comments[i].userName);
        commentTemplate.find('.cmnt-data').text(comments[i].data);
        commentTemplate.find('.like-count').text(comments[i].likes);
        commentTemplate.find('#show-likers-btn').attr('data-content', `${getLikers(comments[i].likers)}`);
        commentTemplate.find('#inner').append(createCommentOfCommentHtmlTemplate());
        commentTemplate.find("#com-to-com-btn").attr('data-target', `#collapse-${collapseID}`);
        commentTemplate.find("#com-to-com-input").attr('id', `collapse-${collapseID++}`);
        commentTemplate.find("#com-of-com-btn").attr('data-target', `#collapse-${collapseID}`);
        commentTemplate.find("#com-of-com-show").attr('id', `collapse-${collapseID++}`);
        commentTemplate.attr('id', comments[i].commentID);

        addCommentEvents(commentTemplate, comments[i]);
        loadCommentsOfComment(comments[i].commentID, commentTemplate);

        postTemplate.find('#com-container').append(commentTemplate);
    }
    $('[data-toggle="popover"]').popover({
        html: true}
    );
}
/* COMMENT OF POST EVENTS */
function addCommentEvents(commentTemplate, comment) {
    /* comment to comment */
    commentTemplate.find('#comment-btn').on('click', function () {
        let commentData = commentTemplate.find('#com-com-data').val();
        
        if (commentData.length == 0) {
            //alret empty
            
        } else {
            postID = commentTemplate.attr('id');
            let newComment = new Comment(currentUser, commentData, postID);
            $.ajax({
                    type: 'POST',
                    url: `${URL}/comments`,
                    data: JSON.stringify(newComment),
                    contentType: "application/json",
                    dataType: 'json'
                }).done(function (res) {
                    currentUser.commentCount++;
                    commentTemplate.find('#com-com-data').val(''); // avoid multiple clicks
                    updateServer();
                    commentTemplate.find('#com-of-com-btn').css('display', 'inline'); // in case of first comment
                    bindCommentsOfCommentToTemplate([newComment], commentTemplate);
                })
                .fail(function (err) {
                    console.log(err);
                });
        }
    })
    /* show/hide comments of comment */
    commentTemplate.find('#com-to-com-btn').on('click', function(ev){
        if (ev.currentTarget.value == 'show') {
            ev.currentTarget.value = 'hide';
            ev.currentTarget.innerHTML = 'Hide';
        } else {
            ev.currentTarget.value = 'show';
            ev.currentTarget.innerHTML = 'Comment';
        }
    })
    /* show/hide comments to comment */
    commentTemplate.find('#com-of-com-btn').on('click', function(ev){
        if (ev.currentTarget.value == 'show') {
            ev.currentTarget.value = 'hide';
            ev.currentTarget.innerHTML = 'Hide comments';
        } else {
            ev.currentTarget.value = 'show';
            ev.currentTarget.innerHTML = 'Show comments';
        }
    })
    /* like to comment */
    commentTemplate.find('.emoji').on('click', function (ev) {
        let notification;
        if (comment.likers.includes(currentUser.userName)) {
            comment.likers.pop(currentUser.userName);
            comment.likes--;
            notification = `${currentUser.userName} liked ur post`;
        } else {
            comment.likers.push(currentUser.userName);
            comment.likes++;
            notification = `${currentUser.userName} unliked ur post`;
        }
        updateLikes(ev, 'comments', comment, notification);

    });
    
}

function loadCommentsOfComment(commentID, commentTemplate){
    $.get(`${URL}/comments?postID=${commentID}`)
        .done(function (response) {
            if (response.length > 0) {
                commentTemplate.find('#com-of-com-btn').css('display', 'inline');
                bindCommentsOfCommentToTemplate(response, commentTemplate);
            }
        })
}
/* COMMENT OF COMMENT EVENTS */
function bindCommentsOfCommentToTemplate(commentsOfComment, commentTemplate){
    for(let i = 0; i<commentsOfComment.length; i++){
        let commentOfCommentTemplate = $(createCommentHtmlTemplate());
        commentOfCommentTemplate.find('.cmnt-username').text(commentsOfComment[i].userName);
        commentOfCommentTemplate.find('.cmnt-data').text(commentsOfComment[i].data);
        commentOfCommentTemplate.find('.like-count').text(commentsOfComment[i].likes);
        commentOfCommentTemplate.find('#show-likers-btn').attr('data-content', `${getLikers(commentsOfComment[i].likers)}`);
        commentOfCommentTemplate.attr('id', commentsOfComment[i].commentID);
        addCommentOfCommentsEvents(commentOfCommentTemplate, commentsOfComment[i]);
        commentTemplate.find('.colaa').addClass('com-of-com').append(commentOfCommentTemplate);
        
        
    }
    $('[data-toggle="popover"]').popover({
        html: true}
    );
  
}

function addCommentOfCommentsEvents(commentOfCommentTemplate, commentOfComment){
    commentOfCommentTemplate.find('.emoji').on('click', function (ev) {
        let notification;
        if (commentOfComment.likers.includes(currentUser.userName)) {
            commentOfComment.likers.pop(currentUser.userName);
            commentOfComment.likes--;
            notification = `${currentUser.userName} liked ur post`;
        } else {
            commentOfComment.likers.push(currentUser.userName);
            commentOfComment.likes++;
            notification = `${currentUser.userName} unliked ur post`;
        }
        updateLikes(ev, 'comments', commentOfComment, notification);

    });


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
                // console.log(JSON.stringify(res));
                currentUser.postCount++;
                updateServer();
                // loadMyPosts();
                bindPostsToTemplate([newPost]);
            })
            .fail(function (err) {
                console.log(err);
            });
    }
})