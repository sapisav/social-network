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
        this.friendsRequests = [];
        this.friends = [];
        this.sentFriendRequest = [];
        this.notifactions = [];
        this.notifactionsToSee = 0;
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
        this.userProfile = 'userProfile'; //fix
        this.postID = "P" + currentUser.userName + parseInt(currentUser.postCount);
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
        this.userProfile = 'userProfile'; //fix
        this.commentID = "C" + currentUser.userName + parseInt(currentUser.commentCount);
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

function createIframe(link) {
    let iFrame = document.querySelector("#post-template").querySelector("#i-frame");
    clonedIframe = iFrame.cloneNode(true);
    clonedIframe.setAttribute('src', "https://www.youtube.com/embed/" + link);
    return clonedIframe;
}

function createImage(link) {
    let image = document.querySelector("#post-template").querySelector("#img");
    clonedImage = image.cloneNode(true);
    clonedImage.setAttribute('src', link);
    return clonedImage;
}

function createVideo(link) {
    let video = document.querySelector("#post-template").querySelector("#vid");
    clonedVideo = video.cloneNode(true);
    clonedVideo.querySelector('#vid-src').setAttribute('src', link);
    return clonedVideo;
}

function createFriendTemplate(user) {
    let friendTemplate = document.querySelector("#post-template").querySelector("#friend-template").cloneNode(true);
    friendTemplate.querySelector('img').setAttribute('src', user.pic);
    friendTemplate.querySelector('#full-name-search-friends').innerHTML = `${user.firstName} ${user.lastName}`;
    friendTemplate.querySelector('#full-name-search-friends').onclick = function () {
        localStorage.setItem('profile-of', user.userName);
        location.href = 'profile.html';
    }
    return friendTemplate;
}

function updateLocalStorage(currentUser) {
    localStorage.setItem('userObject', JSON.stringify(currentUser));
}

function loadSideBar(currentUser) {
    let $sideBar = $('.sidebar-nav');
    $sideBar.find('#a-img').attr('src', currentUser.pic);
    $sideBar.find('#a-img').on('click', function(){
        localStorage.setItem('profile-of', currentUser.userName);
        location.href = 'profile.html';
    })
    $sideBar.find('#a-full-name').text(`${currentUser.firstName} ${currentUser.lastName}`);
    $sideBar.find('#a-full-name').on('click', function(){
        localStorage.setItem('profile-of', currentUser.userName);
        location.href = 'profile.html';
    })
    $sideBar.find('#i-about-me').text(`${currentUser.info}`);


}

function deleteAccount(currentUser) {
    $.ajax({ // need to delete also all posts and comments
        url: `${URL}/users/${currentUser.id}`,
        type: 'DELETE',
        success: function (result) {
            location.href = 'index.html';
        }
    });
}

function getLikers(list) {
    let htmlString = '';
    for (let i = 0; i < list.length; i++) {
        let $a = document.createElement('a');
        $a.href = '#';
        $a.setAttribute('class', 'profile-of-user');
        $a.setAttribute('username', `${list[i]}`);
        $a.setAttribute('onclick', 'linkToProfile(event);');
        $a.style.display = 'block';
        $a.innerHTML = list[i]; // change to full name
        htmlString += $a.outerHTML;

    }
    return htmlString;
}

function linkToProfile(ev) {
    localStorage.setItem('profile-of', ev.currentTarget.getAttribute('username'));
    location.href = 'profile.html';
    
}

function toMyProfile(currentUser) {
    $('#my-profile-header').on('click', function () {
        localStorage.setItem('profile-of', currentUser.userName);
        location.href = 'profile.html';
    })
}

function notifyNotifications(currentUser) {
    if (currentUser.notifactionsToSee > 0) {
        $('#new-notifications').text(currentUser.notifactionsToSee);
    } else {
        $('#new-notifications').text('');
    }
    let notificationsContainer = $('#show-notification-data');
    for (let i = 0; i < currentUser.notifactions.length; i++) {
        notificationsContainer.prepend(createNotificationTemplate(currentUser.notifactions[i]));
    }

}

class MyNotification {
    constructor(from, msg) {
        this.senderName = `${from.firstName} ${from.lastName}`;
        this.senderUserName = from.userName;
        this.msg = msg;
    }
}

function createNotificationTemplate(notification) {
    let notificationTemplate = document.querySelector("#post-template").querySelector("#notification-template").cloneNode(true);
    notificationTemplate.querySelector('img').setAttribute('src', 'https://image.shutterstock.com/image-vector/new-friend-outline-social-media-450w-659921749.jpg');
    notificationTemplate.querySelector('#full-name-notification').innerHTML = notification.senderName;
    notificationTemplate.querySelector('#msg-notification').innerHTML = notification.msg;
    notificationTemplate.querySelector('#full-name-notification').onclick = function () {
        localStorage.setItem('profile-of', notification.senderUserName);
        location.href = 'profile.html';
    }
    return notificationTemplate;
}

$('#search-input').keyup(function (ev) {
    if (ev.keyCode === 13) {
        searchForUsers(ev.currentTarget.value);
    }
});

function searchForUsers(fullName) {
    let resultsContainer = $('#show-friends-data');
    resultsContainer.html('');
    fullName = fullName.split(' ');
    if (fullName.length === 1 && fullName[0] != '') {
        $.get(`${URL}/users?firstName=${fullName[0]}`)
            .done(function (response) {
                for (let i = 0; i < response.length; i++) {
                    resultsContainer.append(createFriendTemplate(response[i]));
                }
            })
    } else if(fullName.length === 2) {
        $.get(`${URL}/users?firstName=${fullName[0]}&lastName=${fullName[1]}`)
            .done(function (response) {
                for (let i = 0; i < response.length; i++) {
                    resultsContainer.append(createFriendTemplate(response[i]));
                }
            })
    }
    else {
        $.get(`${URL}/users`)
            .done(function (response) {
                console.log(response.length)
                for (let i = 0; i < response.length; i++) {
                    resultsContainer.append(createFriendTemplate(response[i]));
                }
            })
    }
    $('#show-friends-modal').modal('toggle');
}
$('#notifaction').on('click', function () {
    currentUser.notifactionsToSee = 0;
    updateServer();
    $('#new-notifications').html('');
    $('#notifaction-modal').modal('toggle');
})
/* find item inside array and delete it */
function findAndDelete(arr, item) {
    let index = arr.indexOf(item);
    if (index != -1) {
        arr.splice(index, 1)
    }
}

$('.fake-link').on('click', function(){
    localStorage.clear();
    location.href = 'index.html';
})

