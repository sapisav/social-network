const URL = 'http://localhost:3000';
class User {
    constructor(userName, pw) {
        this.userName = userName;
        this.password = pw;
        this.firstName = 'fName';
        this.lastName = 'lName';
        this.pic = '../imgs/empty.png';
        this.role = 'regular';
        this.userInfo = 'userInfo';
        this.privacy = 'public';
        this.friends = [];
        this.initProfile = false;
        this.gender = 'gender';
        this.dob = 'dob';
        this.postCount = 0;
        this.commentCount = 0;
    }

    // set firstName(firstName) {
    //     this.fName = firstName;
    // }

    // set lastName(lastName) {
    //     this.fName = lastName;
    // }
    // set pic(profilePicLink) {
    //     this.profilePicLink = profilePicLink;
    // }
    set premission(role) {
        this.role = role;
    }
    set info(userInfo) {
        this.userInfo = userInfo;
    }
    set myPrivacy(privacy) {
        this.privacy = privacy;
    }
    set myGender(gender) {
        this.gender = gender;
    }
    addFriend(friendUserName) {
        this.friends.push(friendUserName);
    }

}

class Post {
    constructor(currentUser, data) {
        this.userName = currentUser.userName;
        this.data = data;
        this.userProfile = 'userProfile';//fix
        this.postID = currentUser.userName + parseInt(currentUser.postCount);
        this.likes = 0;
        this.likers = [];
        this.creationTime = Date.now().toString();
        // this.hasComments = false;
    }
}

class Comment {
    constructor(currentUser, data, postID) {
        this.userName = currentUser.userName;
        this.data = data;
        this.userProfile = 'userProfile';//fix
        this.commentID = currentUser.userName + parseInt(currentUser.commentCount);
        this.postID = postID;
        this.likes = 0;
        this.likers = [];
        this.creationTime = Date.now().toString();
        // this.hasComments = false;
    }
}

function createPostHtmlTemplate() {
    let postHtmlTemplate = document.querySelector("#post-template").querySelector(".card-post");
    let clonedTemplate = postHtmlTemplate.cloneNode(true);
    return clonedTemplate;
}

function createCommentHtmlTemplate() {
    let commentHtmlTemplate = document.querySelector("#post-template").querySelector(".comment-post-template");
    let clonedTemplate = commentHtmlTemplate.cloneNode(true);
    return clonedTemplate;
}

function createCommentOfCommentHtmlTemplate() {
    let commentCommentHtmlTemplate = document.querySelector("#post-template").querySelector("#inner-cmnt");
    let clonedTemplate = commentCommentHtmlTemplate.cloneNode(true);
    return clonedTemplate;
}

function updateLocalStorage(currentUser) {
    localStorage.setItem('userObject', JSON.stringify(currentUser));
}

function loadSideBar(currentUser){
    let $sideBar = $('.sidebar-nav');
    $sideBar.find('#a-img').attr('src', currentUser.pic);
    $sideBar.find('#a-full-name').text(`${currentUser.firstName} ${currentUser.lastName}`);
    $sideBar.find('#i-about-me').text(`${currentUser.info}`);
   

}

function deleteAccount(currentUser){
    $.ajax({ // need to delete also all posts and comments
        url: `${URL}/users/${currentUser.id}`,
        type: 'DELETE',
        success: function(result) {
           location.href = 'index.html';
        }
    });
}