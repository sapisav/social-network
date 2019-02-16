const User = require("../entities/user");
const db = require("../DB/db.json");
const MD5 = require("md5");

const nullUser = new NullUser();

function login(username, password){
    for(let i = 0; i < db.users.length; i++){
        if(db.users[i].userName == username){
            if(db.users[i].password == MD5(password)){
                return db.users[i];
            }
            return nullUser
        }
    }
    return nullUser;
}