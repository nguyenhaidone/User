const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./users/users.router');
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/photoRaw', (error) => {
    if (error) {
        throw error;
    } else {
        console.log('Connect to mongodb success . . . ');
        const app = express();

        app.use(bodyParser.json());
        app.use(session({
            secret:'keyboard cat',
            
        }));

        app.use(express.static('public'));

        app.use('/users',userRouter);

        app.listen(3001, (err) => {
            if (err) {
                throw err;
            }
            console.log('Server listen on port 3001 ...');
        });
    }
});