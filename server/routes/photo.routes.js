PhotoController = require("../controllers/photo.controller");
const upload = require("../middleware/uploads");


module.exports = function (app) {
  app.post("/api/photo", upload.single("avatar"), PhotoController.Avatar);
};
