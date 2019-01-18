let postHtmlTemplate = document.querySelector("#post-template").querySelector(".card-post");

function Post(userName, data, creationTime){
    this.author = userName;
    this.data = data;
    this.likes = 0;
    this.creationTime = creationTime;
}

function createPostHtmlTemplate(){
    let clonedTemplate = postHtmlTemplate.cloneNode(true);
    return clonedTemplate;
}