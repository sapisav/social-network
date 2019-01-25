let currentUser = JSON.parse(localStorage.getItem('userObject'));
let $profileInfo =  document.querySelector(".profile-info");
let $hiddenContainer = document.querySelector("#hidden-container");
let $showProfile = $hiddenContainer.querySelector("#show-profile");
let $editProfile = $hiddenContainer.querySelector("#edit-profile");



$editProfile.querySelector('#update-btn').onclick = function(){
    if(!currentUser.initProfile) currentUser.initProfile = true; //first time user edit profile
    currentUser.firstName = $('#input-fname').val();
    currentUser.lastName = $('#input-lname').val();
    tmp = $('#input-pic').val().split('\\');
    tmp = tmp[tmp.length-1];
    currentUser.pic = `../imgs/${tmp}`;
    console.log(tmp);
    currentUser.dob = $('#input-dob').val();
    currentUser.info = $('#input-info').val();
    currentUser.gender = $('#input-gender').val();
    currentUser.privacy = $('#input-privacy').val();
    // console.log(currentUser);
    updateServer();
    loadSideBar(currentUser);
}
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
        $hiddenContainer.append($editProfile);
        updateLocalStorage(currentUser);
        updateProfile();
        $profileInfo.append($showProfile);
        //succes alert
    }).fail(function(err){
        
        console.log(err);
    });
}

$showProfile.querySelector('#edit-btn').onclick = function(){
    $hiddenContainer.append($showProfile);
    $profileInfo.append($editProfile);

}

function updateProfile(){ //update ui
    $showProfile.querySelector('#fname-span').innerHTML = currentUser.firstName;
    $showProfile.querySelector('#lname-span').innerHTML = currentUser.lastName;
    $showProfile.querySelector('#dob-span').innerHTML = currentUser.dob;
    $showProfile.querySelector('#gender-span').innerHTML = currentUser.gender;
    $showProfile.querySelector('#info-span').innerHTML = currentUser.info;
    $showProfile.querySelector('#card-img').setAttribute('src', currentUser.pic);
}

//for first time user logging
if(currentUser.initProfile){
    updateProfile();
    loadSideBar(currentUser);
    $profileInfo.append($showProfile);
}
else{
    $profileInfo.append($editProfile);
}

loadSideBar(currentUser);


$('#delete-btn').on('click', function(){
   let pw =  $('#input-delete-acc').val();
   if(currentUser.password == pw){
       deleteAccount(currentUser);
   }
})

$('#cancel-btn').on('click', function(){
    $hiddenContainer.append($editProfile);
    $profileInfo.append($showProfile);
 })
 



