let currentUser = JSON.parse(localStorage.getItem('userObject'));
let $profileInfo =  document.querySelector(".profile-info");
if(!currentUser.initProfile){
    $profileInfo.innerHTML = "";
    $profileInfo.append(document.querySelector("#hidden-container").querySelector("#show-profile"))
}
else{
    let $editProfile = document.querySelector("#hidden-container").querySelector("#edit-profile");
    $profileInfo.innerHTML = "";
    $profileInfo.append($editProfile);

}