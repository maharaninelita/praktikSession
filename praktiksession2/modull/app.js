const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const stockRoutes = require('./routes/stock');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'fishstock2024',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

// Middleware untuk cek login
app.use((req, res, next) => {
    if (!req.session.user && req.path !== '/stock/login' && req.path !== '/stock/register') {
        return res.redirect('/stock/login');
    } else if (req.session.user && req.path === '/') {
        return res.redirect('/stock/dashboard');
    }
    next();
});

app.use('/stock', stockRoutes);

app.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/stock/dashboard');
    } else {
        return res.redirect('/stock/login');
    }
});

app.listen(3000, () => {
    console.log('Fish Stock Management System running on port 3000');
});