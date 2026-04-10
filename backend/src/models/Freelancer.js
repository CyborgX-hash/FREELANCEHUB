const User = require("./User");

class Freelancer extends User {
    constructor(data) {
        super(data);
        this.role = "Freelancer";
    }
}

module.exports = Freelancer;