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
    let sql = "select id, name, surname, email,phone from user where id = ?"
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
    
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }
    
    //const hashedPassword = await bcrypt.hash(data.password, salt);
    console.log(data.password);
    let sql =`INSERT INTO user (name, surname, email, phone, password) VALUES (?,?,?,?,?)`;
    //db.execute.execute("INSERT INTO user (name, surname, email, phone, password) VALUES (?,?,?,?,?)", (req.get("name", "surname", "email", "phone"), hashedPassword))
    let params = [data.name, data.surname, data.email, data.phone];
    db.run(sql, params, function (err, result) {
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
        password:req.body.password ? await bcrypt.hash(req.body.password, salt): null
    }
    db.run(
        `UPDATE user set 
           name = COALESCE(?,name), 
           surname = COALESCE(?,surname), 
           email = COALESCE(?,email), 
           phone = COALESCE(?,phone),
           password = COALESCE(?,password) 
           WHERE id = ?`,
        [data.name, data.surname, data.email, data.phone, req.params.id],
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
}
export const deleteUser = (req, res) => {
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
}