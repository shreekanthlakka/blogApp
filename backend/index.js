import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { connectToDB } from "./DB/connectToDB.js";
import { configCloudinary } from "./DB/configCloudinary.js";

configCloudinary();

app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on port ${process.env.APP_PORT} !!`);
    connectToDB();
});
