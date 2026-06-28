// import * as dotenv from "dotenv";
// dotenv.config();
import "dotenv/config";

import app from "./server.js";

import mongodb from "mongodb";

const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;
console.log(port);

MongoClient.connect(
    process.env.MONGO_URI,
    {
        // poolSize: 50,
        waitQueueTimeoutMS: 2500,
        // useNewUrlParse: true
    }
)
    .catch(err => {
        console.error(err);
        process.exit(1);
    })
    .then(async client => {
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        })
    })