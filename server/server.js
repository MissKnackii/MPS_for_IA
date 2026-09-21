const express = require('express');

class Server {
    PORT = 3000;

    constructor(app) {
        this.app = app;
    }

    start() {
        // this.app.use('/', express.static(__dirname + '/client'));
        // this.app.use('/pdf', express.static(__dirname + '/pdf'));


        this.app.listen(this.PORT, '0.0.0.0', function() {
            console.log(`Server running on port ${this.PORT}`);
        }.bind(this));
    }
}

module.exports = Server;