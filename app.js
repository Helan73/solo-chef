const express=require('express');
const expressLayouts=require("express-ejs-layouts");
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');

const app=express();
const port=process.env.PORT || 3000;

require('dotenv').config();

app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(cookieParser('SoloChefSecure'));
app.use(session({
    secret: 'SoloChefSecretSession',
    saveUninitialized: false,//i changed these 2 to false from true
    resave: false
}));
app.use(flash());
app.use(fileUpload());

app.use(passport.initialize());
app.use(passport.session());
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

app.set('layout', './layouts/main');
app.set('view engine','ejs');

const routes = require('./server/routes/recipeRoutes.js')
app.use('/',routes);
app.listen(port,()=> console.log(`Listeniing to the port ${port}`));
