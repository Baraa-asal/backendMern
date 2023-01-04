AttendanceController = require("../controllers/attendance.controller");

module.exports = function (app) {
  app.post("/api/findface", AttendanceController.createAttendance);
  app.get("/api/attendance", AttendanceController.getAllAttendance);
  app.get("/api/attendance/:id", AttendanceController.findOneAttendance);
  //show all the attendances that belong to a user given id
  app.get(
    "/api/attendance/user/:userId",
    AttendanceController.findAttendancesBelongingToUser
  );
};
