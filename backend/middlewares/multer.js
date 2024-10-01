import multer from "multer";

const DiskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        cb(null, `${Math.floor(Math.random() * 90000)}#${file.originalname}`);
    },
});

const MemoryStorage = multer.memoryStorage();

const uploadDiskStorage = multer({ storage: DiskStorage });
const uploadMemoryStorage = multer({ storage: MemoryStorage });

export { uploadDiskStorage, uploadMemoryStorage };
