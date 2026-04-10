class User {
    constructor({ name, username, email, password }) {
      this.name = name.trim();
      this.username = username.trim().toLowerCase();
      this.email = email.trim().toLowerCase();
      this.password = password;
    }
  }
  
  module.exports = User;