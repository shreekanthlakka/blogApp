import mongoose from "mongoose";

const connectToDB = () => {
    mongoose
        .connect(process.env.MONGO_URL)
        .then((res) => {
            console.log(`MongoDB connected sucessfully`, res.connection.host);
        })
        .catch(() => console.log("DB Not connected ❌❌❌"));
};

export { connectToDB };
