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
    constructor(currentUser, data, video = null, pic = null, link = null) {
        this.userName = currentUser.userName;
        this.fullName = currentUser.firstName + " " + currentUser.lastName;
        this.data = data;
        this.userProfile = 'userProfile';//fix
        this.postID = "P"+currentUser.userName + parseInt(currentUser.postCount);
        this.likes = 0;
        this.likers = [];
        this.creationTime = new Date();
        this.video = video;
        this.pic = pic;
        this.link = link;
        // this.hasComments = false;
    }
}

class Comment {
    constructor(currentUser, data, postID, fullName, video = null, pic = null, link = null) {
        this.userName = currentUser.userName;
        this.fullName = fullName;
        this.data = data;
        this.userProfile = 'userProfile';//fix
        this.commentID = "C"+currentUser.userName + parseInt(currentUser.commentCount);
        this.postID = postID;
        this.likes = 0;
        this.likers = [];
        this.creationTime = new Date();
        this.video = video;
        this.pic = pic;
        this.link = link;
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

function createCommentOfCommentHtmlTemplate() { // TODO: change name
    let commentCommentHtmlTemplate = document.querySelector("#post-template").querySelector("#inner-cmnt");
    let clonedTemplate = commentCommentHtmlTemplate.cloneNode(true);
    return clonedTemplate;
}

function createIframe(link){
    let iFrame = document.querySelector("#post-template").querySelector("#i-frame");
    clonedIframe = iFrame.cloneNode(true);
    clonedIframe.setAttribute('src', "https://www.youtube.com/embed/" + link);
    return clonedIframe;
}
function createImage(link){
    let image = document.querySelector("#post-template").querySelector("#img");
    clonedImage = image.cloneNode(true);
    clonedImage.setAttribute('src', link);
    return clonedImage;
}
function createVideo(link){
    let video = document.querySelector("#post-template").querySelector("#vid");
    clonedVideo = video.cloneNode(true);
    clonedVideo.querySelector('#vid-src').setAttribute('src', link);
    return clonedVideo;
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

function getLikers(list){
    let htmlString = '';
    for(let i = 0; i< list.length; i++){
        let $a = document.createElement('a');
        $a.href = '#';
        $a.setAttribute('class', 'profile-of-user');
        $a.setAttribute('username', `${list[i]}`);
        $a.setAttribute('onclick', 'linkToProfile(event);');
        $a.style.display = 'block';
        $a.innerHTML = list[i];
        htmlString+= $a.outerHTML;

    }
    return htmlString;
}

function linkToProfile(ev){
    localStorage.setItem('profile-of', ev.currentTarget.getAttribute('username'));
    // location.href = 'profile.html';
    // console.log('wow');
}