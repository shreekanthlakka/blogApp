import nodemailer from "nodemailer";

const sendEmail = async (url) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        host: process.env.HOST,
        port: process.env.PORT,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS,
        },
    });
};
