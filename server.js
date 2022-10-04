import express from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import UserRouter  from './routes/api.js';

const app = express();
const HTTP_PORT = 7000;


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', UserRouter);

// RootEndpoint
app.get("/", (req, res) => {
    res.json({ "message": "Ok" });
});

// DefaultResponse
app.use(function (req, res) {
    res.status(404);
});

// StartServer
app.listen(HTTP_PORT, () => {
    console.log(`Server running on port http://localhost:${HTTP_PORT}`);
});