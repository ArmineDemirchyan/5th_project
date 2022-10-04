import express from "express";

import { getUsers, createUser, deleteUser, getUser, updateUser } from "../controllers/users.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.post("/user", createUser);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

export default router;