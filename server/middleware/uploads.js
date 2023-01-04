const path = require("path");
const multer = require("multer");
// const {v4 :uuidv4}     = require("uuid")

var storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "./uploads/");
  },
  filename: function (req, file, cd) {
    let ext = path.extname(file.originalname);
    // cd(null,uuidv4()+'-' , Date.now() + ext )
    cd(null, Date.now() + ext);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if ("imgs/jpg" || "imgs/jpeg" || "imgs/png") {
      callback(null, true);
    } else {
      console.log("only jpg and png");
      callback(null, false);
    }
  },
  limits: {
    filesize: 1024 * 1024 * 2,
  },
});

// let uploadImage = ({storage , upload});
module.exports = upload;
