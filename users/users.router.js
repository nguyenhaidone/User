const express = require('express');
const UserModel = require("./users.model");
const bcryptjs = require('bcryptjs');

const userRouter = express.Router();
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

userRouter.get('/test', (req, res) => {
    console.log('Current User: ',req.session.currentUser);
    res.json({
        success: true,
    });
});

userRouter.post('/register', (req, res) => {
    const { email, password, fullName } = req.body;

    if (!email || !emailRegex.test(email)) {
        res.status(400).json({
            success: false,
            message: 'Invalid email address',
        });
        window.alert("Email incorrect!");
    }

    if (!password || password.length < 6) {
        res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters',
        });
        window.alert('Password incorrect');
    }

    if (!fullName) {
        res.status(400).json({
            success: false,
            message: 'Please input your full name',
        });
        window.alert('Plz input your full name');
    }

    UserModel.findOne({ email: email }, (error, data) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        } else if (data) {
            res.status(400).json({
                success: false,
                message: 'Email has been used',
            });
        } else {
            //hash password
            const hashPassword = bcryptjs.hashSync(password, 10);

            UserModel.create({
                ...req.body,
                password: hashPassword,
            }, (err, newUser) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                } else {
                    res.status(201).json({
                        success: true,
                        data: {
                            ...newUser._doc,
                            password: '',
                        }
                    });
                }
            });
        }

    });
});

userRouter.post('/login', (req, res) => {
    const { email, password } = req.body;

    UserModel.findOne({ email: email }, (error, data) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        } else if (!data) {
            res.status(400).json({
                success:false,
                message:'Email didnt exist',
            });
        } else if(!bcryptjs.compareSync(password, data.password)){
            res.status(400).json({
                success:false,
                message: 'Wrong password',
            });
        } else {
            //session storage
            req.session.currentUser = {
                _id: data._id,
                email: data.email,
                fullName: data.fullName,
            };
            
            res.status(200).json({
                success: true,
                message: 'login success',
            });
        }


    })
});

userRouter.get('/logout',(req,res)=>{
    req.session.destroy((error)=>{
        if(error){
            res.status(500).json({
                success:false,
                message: error.message,
            });
        } else {
            res.status(500).json({
                success: true,
                message: 'Logout success',
            });
        };
    });
});

module.exports = userRouter;