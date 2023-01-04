const User = require("../controllers/user.controller");
const { authenticate } = require("../config/jwt");

module.exports = (app) => {
  app.post("/api/register", User.register);
  app.post("/api/login", User.login);
  app.get("/api/users/loggedin", authenticate, User.getLoggedInUser);
  app.get("/api/users/registered", authenticate, User.getRegisteredUser);
  app.get("/api/users/logout", User.logout);
  app.get("/api/allusers", User.getAllUsers);
};
