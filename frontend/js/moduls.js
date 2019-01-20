
class User{
    constructor(userName, pw, fullName='full name', profilePicLink='piclink', role = "regular", userInfo ="user info", privacy='public', friends = []) {
        this.userName = userName;
        this.password = pw;
        this.fullName = fullName;
        this.profilePicLink = profilePicLink;
        this.role = role;
        this.userInfo = userInfo;
        this.privacy = privacy;
        this.friends = friends;
    }

    set name(fullName){
        this.fullName = fullName;
    }
    set pic(profilePicLink){
        this.profilePicLink = profilePicLink;
    }
    set premission(role){
        this.role = role;
    }
    set info(userInfo){
        this.userInfo = userInfo;
    }
    set myPrivacy(privacy){
        this.privacy = privacy;
    }
    addFriend(friendUserName) {
        this.friends.push(friendUserName);
    }
}

class Post{
    constructor(userName, data, userProfile){
        this.userName = userName;
        this.data = data;
        this.userProfile = userProfile;
        let postCounter = parseInt(localStorage.getItem("postsCount"));
        this.postID = userName + localStorage.getItem("postsCount");
        localStorage.setItem("postsCount", ++postCounter);
        this.likes = 0;
        this.likers = [];
        this.creationTime = Date.now();
    }
}

class Comment{
    constructor(userName, data, userProfile, postID){
        this.userName = userName;
        this.data = data;
        this.userProfile = userProfile;
        let commentCounter = parseInt(localStorage.getItem("commentsCount"));
        this.commentID = userName + localStorage.getItem("commentsCount");
        localStorage.setItem("commentsCount", ++postCounter);
        this.postID = postID;
        this.likes = 0;
        this.likers = [];
        this.creationTime = Date.now();
    }
}

function createPostHtmlTemplate(){
    let postHtmlTemplate = document.querySelector("#post-template").querySelector(".card-post");
    let clonedTemplate = postHtmlTemplate.cloneNode(true);
    return clonedTemplate;
}

function createCommentHtmlTemplate(){
    let commentHtmlTemplate = document.querySelector("#post-template").querySelector(".comment-post-template");
    let clonedTemplate = commentHtmlTemplate.cloneNode(true);
    return clonedTemplate;
}

function createCommentOfCommentHtmlTemplate(){
    let commentCommentHtmlTemplate = document.querySelector("#post-template").querySelector(".comment-comment-template");
    let clonedTemplate = commentCommentHtmlTemplate.cloneNode(true);
    return clonedTemplate;
}