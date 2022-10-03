const express = require("express");
const app = express();
const HTTP_PORT = 7000;
const db = require('./db/database.js');
const md5 = require("md5");
const bodyParser = require("body-parser");
const cors = require('cors')

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Root endpoint
app.get("/", (req, res) => {
    res.json({ "message": "Ok" })
});
import { getUsers, createUser, deleteUser, getUser, updateUser } from "../controllers/users.js";

//GetUsers
app.get("/api/users", getUsers);

//GetUser
app.get("/api/user/:id", getUser);

//CreateUser
app.post("/api/user/", createUser)

//UpdateUser
app.patch("/api/user/:id", (req, res) => {
    let data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password ? md5(req.body.password) : null
    }
    db.run(
        `UPDATE user set 
           name = COALESCE(?,name), 
           email = COALESCE(?,email), 
           password = COALESCE(?,password) 
           WHERE id = ?`,
        [data.name, data.email, data.password, req.params.id],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
        });
})

//DeleteUser
app.delete("/api/user/:id", (req, res) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({ "message": "deleted", changes: this.changes })
        });
})

// DefaultResponse
app.use(function (req, res) {
    res.status(404);
});

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});