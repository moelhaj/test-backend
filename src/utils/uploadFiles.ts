import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname + "/../../public/"));
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + "-" + file?.originalname);
	},
});

export const upload = multer({ storage: storage });
