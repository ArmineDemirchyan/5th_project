import db from '../db/database.js';
import bcrypt from "bcrypt";

export const getUsers = (req, res) => {
    let sql = "select id, name, surname, email,phone  from user ";

    db.all(sql, (err, rows) => {
        console.log(rows)
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows,
            "users": rows.length
        })
    });
}

export const getUser = (req, res) => {
    let sql = "select id, name, surname, email, phone from user where id = ?"
    let params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    });
}

export const createUser = async (req, res) => {
    let errors = [];
    const salt = await bcrypt.genSalt(10);
    let data = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        phone: req.body.phone,
        password: await bcrypt.hash(req.body.password, salt)
    }

    if (!req.body.email) {
        errors.push("No email specified");
    }
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }

    let sql = `INSERT INTO user (name, surname, email, phone, password) VALUES (?,?,?,?,?)`;
    let params = [data.name, data.surname, data.email, data.phone];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message })
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
}
export const updateUser = async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    let data = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password ? await bcrypt.hash(req.body.password, salt) : null
    }
    db.run(`UPDATE user set 
    name = COALESCE(?,name), 
    surname = COALESCE(?,surname), 
    email = COALESCE(?,email), 
    phone = COALESCE(?,phone),
    password = COALESCE(?,password) 
    WHERE id = ?`,


        [data.name, data.surname, data.email, data.phone, data.password, req.params.id],
        function (err) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({
                message: "updated",
                data: data,
            })
        });
}
export const deleteUser = (req, res) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({ "message": "deleted", changes: this.changes })
        });
}