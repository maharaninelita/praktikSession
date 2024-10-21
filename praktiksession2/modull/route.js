const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// CRUD Routes untuk stok ikan
router.get('/dashboard', (req, res) => {
    if (req.session.user) {
        const query = "SELECT * FROM fish_stock";
        db.query(query, (err, stocks) => {
            if (err) throw err;
            res.render('dashboard', { 
                user: req.session.user,
                stocks: stocks 
            });
        });
    } else {
        res.redirect('/stock/login');
    }
});

router.post('/add-stock', (req, res) => {
    const { fish_name, quantity, price, supplier } = req.body;
    const query = "INSERT INTO fish_stock (fish_name, quantity, price, supplier) VALUES (?, ?, ?, ?)";
    db.query(query, [fish_name, quantity, price, supplier], (err, result) => {
        if (err) throw err;
        res.redirect('/stock/dashboard');
    });
});

router.post('/update-stock/:id', (req, res) => {
    const { fish_name, quantity, price, supplier } = req.body;
    const query = "UPDATE fish_stock SET fish_name = ?, quantity = ?, price = ?, supplier = ? WHERE id = ?";
    db.query(query, [fish_name, quantity, price, supplier, req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/stock/dashboard');
    });
});

router.get('/delete-stock/:id', (req, res) => {
    const query = "DELETE FROM fish_stock WHERE id = ?";
    db.query(query, [req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/stock/dashboard');
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const query = "SELECT * FROM users WHERE username = ?";
    db.query(query, [username], (err, result) => {
        if (err) throw err;
        
        if (result.length > 0) {
            const user = result[0];
            if (bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                res.redirect('/stock/dashboard');
            } else {
                res.send('Password salah');
            }
        } else {
            res.send('User tidak ditemukan');
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/stock/login');
});

module.exports = router;