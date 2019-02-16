const User = require("../entities/user");
const dbPath = "./backend/DB/db.json";
const db = require("../DB/db.json");
const MD5 = require("md5");
const fs = require('fs');

/* check 3 things: 
    1. username(email) has the right pattern
    2. password length is 4 - 10
    3. username(email) is available to use
    then: 
        if all tests are fine, create and add new user to the DB 
*/
function tryToCreateNewUser(username, password) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username) == false) {
        return {
            status: false,
            reason: "You must enter a valid email address"
        };
    }
    if (password.length < 4 || password.length > 10) {
        return {
            status: false,
            reason: "Password length must be 4 - 10"
        };
    }
    for (let i = 0; i < db.users.length; i++) {
        if (db.users[i].userName == username) {
            return {
                status: false,
                reason: "Email already in use"
            };
        }
    }
    createNewUser(username, MD5(password));
    return {
        status: true,
        reason: "Account created succesfully"
    };
}

function createNewUser(username, password) {
    db.users.push(new User(username, password));
    fs.writeFile(dbPath, JSON.stringify(db), function (err) {
        if (err) return console.log(err);
      });
}

module.exports = tryToCreateNewUser;
