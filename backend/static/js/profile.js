let currentUser = JSON.parse(localStorage.getItem('userObject'));
$.get(`${URL}/users/${currentUser.id}`)
    .done(function (res) {
        updateLocalStorage(res);
        currentUser = JSON.parse(localStorage.getItem('userObject'));
        notifyNotifications(currentUser);
    });
let profileOf = localStorage.getItem('profile-of'); //
let otherUser = null;
let $profileInfo = document.querySelector(".profile-info");
let $hiddenContainer = document.querySelector("#hidden-container");
let $showProfile = $hiddenContainer.querySelector("#show-profile");
let $editProfile = $hiddenContainer.querySelector("#edit-profile");
let $otherProfile = $hiddenContainer.querySelector("#show-other-profile");
let $privateProfile = $hiddenContainer.querySelector("#show-private-profile");

if(currentUser.role == 'admin'){
    if(currentUser.userName == profileOf){
        updateProfile(currentUser);
        $profileInfo.append($showProfile);
    }
    else{
        $.get(`${URL}/users?userName=${profileOf}`)
        .done(function (response) {
            updateProfile(response[0]);
            $profileInfo.append($showProfile);
           
        })
    }
}
else if (profileOf == currentUser.userName) {
    if (currentUser.initProfile) {
        updateProfile(currentUser);
        // loadSideBar(currentUser);
        $profileInfo.append($showProfile);
    } else $profileInfo.append($editProfile);
} else { //show other profile
    getOtherProfile();
}



$editProfile.querySelector('#update-btn').onclick = function () {
    if (!currentUser.initProfile) currentUser.initProfile = true; //first time user edit profile
    currentUser.firstName = $('#input-fname').val();
    currentUser.lastName = $('#input-lname').val();
    let tmp = $('#input-pic').val().split('\\');
    tmp = tmp[tmp.length - 1];
    currentUser.pic = `../imgs/${tmp}`;

    currentUser.dob = $('#input-dob').val();
    currentUser.info = $('#input-info').val();
    currentUser.gender = $('#input-gender').val();
    currentUser.privacy = $('#input-privacy').val();
    // console.log(currentUser);

    updateServer();
    loadSideBar(currentUser);
}

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
        $hiddenContainer.append($editProfile);
        updateLocalStorage(currentUser);
        updateProfile(currentUser);
        $profileInfo.append($showProfile);
        //succes alert
    }).fail(function (err) {

        console.log(err);
    });
}

$showProfile.querySelector('#edit-btn').onclick = function () {
    $hiddenContainer.append($showProfile);
    $profileInfo.append($editProfile);

}

function updateProfile(user) { //update ui
    $showProfile.querySelector('#fname-span').innerHTML = user.firstName;
    $showProfile.querySelector('#lname-span').innerHTML = user.lastName;
    $showProfile.querySelector('#dob-span').innerHTML = user.dob;
    $showProfile.querySelector('#gender-span').innerHTML = user.gender;
    $showProfile.querySelector('#info-span').innerHTML = user.info;
    $showProfile.querySelector('#card-img').setAttribute('src', user.pic);
    $profileInfo.append($showProfile);
}




loadSideBar(currentUser);

function getOtherProfile() {
    $.get(`${URL}/users?userName=${profileOf}`)
        .done(function (response) {
            otherUser = response[0];
            if (otherUser.privacy == 'public') {
                initOtherProfile();
            } else if ((otherUser.privacy == 'friends' && currentUser.friends.includes(otherUser.userName)) || otherUser.sentFriendRequest.includes(currentUser.userName)) {
                initOtherProfile();
            } else { // not friends or private account
                showPrivateAcc()
            }
        })
}
function showPrivateAcc(){
    $profileInfo.append($privateProfile);
}

function initOtherProfile() {
    $otherProfile.querySelector('#fname-span').innerHTML = otherUser.firstName;
    $otherProfile.querySelector('#lname-span').innerHTML = otherUser.lastName;
    $otherProfile.querySelector('#dob-span').innerHTML = otherUser.dob;
    $otherProfile.querySelector('#gender-span').innerHTML = otherUser.gender;
    $otherProfile.querySelector('#info-span').innerHTML = otherUser.info;
    $otherProfile.querySelector('#card-img').setAttribute('src', otherUser.pic);
    
    //current user got new friend request from other user
    if (currentUser.friendsRequests.includes(otherUser.userName)) {
        $('#add-friend-btn').css('display', 'none');
        $('#accept-friend-btn').css('display', 'inline');
        //current user and other are friends
    } else if (currentUser.friends.includes(otherUser.userName)) {
        $('#add-friend-btn').css('display', 'none');
        $('#un-friend-btn').css('display', 'inline');
        //current user sent friend request
    } else if (currentUser.sentFriendRequest.includes(otherUser.userName)) {
        $('#add-friend-btn').html('Cancel friend request');
    } else {
        //current user and other user did nothing
    }
    $profileInfo.append($otherProfile);
}

$('#delete-btn').on('click', function () {
    let pw = $('#input-delete-acc').val();
    if (currentUser.password == pw) {
        deleteAccount(currentUser);
    }
})

$('#cancel-btn').on('click', function () {
    $hiddenContainer.append($editProfile);
    $profileInfo.append($showProfile);
})

$('#add-friend-btn').on('click', function (ev) {
    if (!otherUser.friendsRequests.includes(currentUser.userName)) {
        otherUser.friendsRequests.push(currentUser.userName);
        currentUser.sentFriendRequest.push(otherUser.userName);
        otherUser.notifactions.push(new MyNotification(currentUser, 'Sent a friend request'));
        otherUser.notifactionsToSee++;

        updateFriendship(currentUser, otherUser, ev, 'add');
        // $.ajax({
        //     url: `${URL}/users/${otherUser.id}`,
        //     type: 'PUT',
        //     data: JSON.stringify(otherUser),
        //     contentType: 'application/json',

        // }).done(function (res) {
        //     ev.currentTarget.innerHTML = 'Sent'
        //     // currentUser.sentFriendRequest.push(otherUser.userName);
        //     updateLocalStorage(currentUser);
        //     updateServer();
        //     // updateProfile();
        //     // $profileInfo.append($showProfile);
        //     //succes alert
        // }).fail(function (err) {

        //     console.log(err);
        // });

    } else {
        let index = currentUser.sentFriendRequest.indexOf(otherUser.userName);
        currentUser.sentFriendRequest.splice(index, 1);
        index = otherUser.friendsRequests.indexOf(currentUser.userName);
        otherUser.friendsRequests.splice(index, 1);
        updateFriendship(currentUser, otherUser, ev, 'cancel friend request');
    }

})
$('#accept-friend-btn').on('click', function (ev) {
    currentUser.friends.push(otherUser.userName);
    let index = currentUser.friendsRequests.indexOf(otherUser.userName);
    currentUser.friendsRequests.splice(index, 1);
    otherUser.friends.push(currentUser.userName);
    index = otherUser.sentFriendRequest.indexOf(currentUser.userName);
    otherUser.sentFriendRequest.splice(index, 1);
    currentUser.notifactions.push(new MyNotification(otherUser, 'Is your friend now'));
    otherUser.notifactions.push(new MyNotification(currentUser, 'Is your friend now'));
    currentUser.notifactionsToSee++;
    otherUser.notifactionsToSee++;

    updateFriendship(currentUser, otherUser, ev, 'accept');

})

function updateFriendship(currentUser, otherUser, ev, action) {
    // update for other user
    $.ajax({
        url: `${URL}/users/${otherUser.id}`,
        type: 'PUT',
        data: JSON.stringify(otherUser),
        contentType: 'application/json',

    }).done(function (res) {
        otherUser = res;
    }).fail(function (err) {

        console.log(err);
    });
    // update for current user
    $.ajax({
        url: `${URL}/users/${currentUser.id}`,
        type: 'PUT',
        data: JSON.stringify(currentUser),
        contentType: 'application/json',

    }).done(function (res) {
        updateLocalStorage(res);
        if (action == 'accept') {
            $('#un-friend-btn').css('display', 'inline');
            ev.currentTarget.style.display = 'none';
        } else if (action == 'unfriend') {
            ev.currentTarget.style.display = 'none';
            $('#add-friend-btn').css('display', 'inline');
        } else if (action == 'add') {
            $('#add-friend-btn').html('Cancel friend request');
        } else {
            $('#add-friend-btn').html('Add friend');
        }

    }).fail(function (err) {

        console.log(err);
    });

}

$('#un-friend-btn').on('click', function (ev) {
    let index = currentUser.friends.indexOf(otherUser.userName);
    currentUser.friends.splice(index, 1);
    index = otherUser.friends.indexOf(currentUser.userName);
    otherUser.friends.splice(index, 1);

    updateFriendship(currentUser, otherUser, ev, 'unfriend');

})

$('#my-friends-btn').on('click', function () {
    if (currentUser.friends.length === 0);
    else {
        let friendsContainer = $('#my-friends-data');
        friendsContainer.html('');
        let str = '?'
        for (let i = 0; i < currentUser.friends.length; i++) {
            str += `userName=${currentUser.friends[i]}&`; // i know its almost the worst way to get all friends
            // but cant find other way because my db design
        }
        str = str.substring(0, str.length - 1)
        $.get(`${URL}/users${str}`)
            .done(function (res) {
                for (let i = 0; i < res.length; i++) {
                    friendsContainer.append(createFriendTemplate(res[i]));
                }
            })
    }
})

$('#other-friends-btn').on('click', function () {
    if (otherUser.friends.length === 0);
    else {
        let friendsContainer = $('#my-friends-data');
        friendsContainer.html('');
        let str = '?'
        for (let i = 0; i < otherUser.friends.length; i++) {
            str += `userName=${otherUser.friends[i]}&`; // i know its almost the worst way to get all friends
            // but cant find other way because my db design

        }
        str = str.substring(0, str.length - 1)

        $.get(`${URL}/users${str}`)
            .done(function (res) {
                for (let i = 0; i < res.length; i++) {
                    friendsContainer.append(createFriendTemplate(res[i]));
                }
            })
    }
})

$('#my-profile').on('click', function () {
    localStorage.setItem('profile-of', currentUser.userName);
    location.href = 'profile.html';
})