import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import fs from "fs";

const uploadToCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) return;
        const result = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto",
        });
        fs.unlinkSync(localfilepath);
        return result;
    } catch (error) {
        fs.unlinkSync(localfilepath);
        return null;
    }
};

const destroyFromCloudinary = async (file) => {
    try {
        if (!file) return;
        const res = await cloudinary.uploader.destroy(file);
        console.log("destroy  ==>", res);
        return res;
    } catch (error) {
        return null;
    }
};

const uploadFromBuffer = (req) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
            },
            (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            }
        );
        streamifier.createReadStream(req.buffer).pipe(uploadStream);
    });
};

export { uploadToCloudinary, destroyFromCloudinary, uploadFromBuffer };
