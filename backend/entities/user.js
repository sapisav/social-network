const ACL = require("../service/acl");

class NullUser {
  constructor(role = ACL.userRoles.anonymous){
    this._role = role;
    this._permissions = [ACL.permissions[3]];
  }
}

class User extends NullUser{
  constructor(username, role = ACL.userRoles.REGULAR, password) {
    super(role);
    this.userName = username;
    this._role = role;
    this._permissions = [ACL.permissions[2], ACL.permissions[0]];
    this._password = password;
    this.firstName = 'First name';
    this.lastName = 'Last name';
    this.pic = '../imgs/empty.png';
    this.userInfo = 'about me';
    this.privacy = 'public';
    this.pendingFriendsRequests = [];
    this.friends = [];
    this.sentFriendRequest = [];
    this.notifactions = []; // need other table
    this.notifactionsToSee = 0;
    this.initProfile = false;
    this.gender = 'gender';
    this.dob = 'dob';
    this.postCount = 0;
    this.commentCount = 0;
  }

  get role() {
    return this._role;
  }

  get permissions() {
    return [...ACL.rolePermissions[this._role], ...this._permissions];
  }

  addPermission(...permission) {
    this._permissions.push(...permission);
  }

  hasPermission(permission) {
    return this.permissions.includes(permission);
  }
}

module.exports = User;