const User = require("./User");

class Client extends User {
    constructor(data) {
        super(data);
        this.role = "Client";
    }
}

module.exports = Client;