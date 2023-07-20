const UserService = require("../services/UserService");

const login = async (req, res) => {
  const { matNo, password, courseCode } = req.body;
  try {
    const user = await UserService.findUserByParams({
      matNo: matNo.trim().toUpperCase(),
    });
    if (!user) return res.status(401).send({ code:'invalid-credential', message: "Invalid login details" });
    const isMatch = await UserService.doesPasswordMatch(
      password,
      user.password
    );
    if (!isMatch) return res.status(401).send({ code:'invalid-credential', message: "Invalid login details" });
    
    // Verify if user is registered for a course. If not, return error message
    const isCourseRegistered = user.registeredCourses.includes(courseCode);
    if(!isCourseRegistered) return res.status(401).send({ code: 'invalid-course', message: "You are not registered for this course" });

    const token = await user.generateToken();
    res.status(200).send({ user, token, isAdmin: false});
  } catch (err) {
    return res.status(500).send({ code:'internal-error', message: "A server error occurred while trying to login user" });
  }
}

const adminLogin  = async (req, res) => {
  const { password, username } = req.body;
  try {
    const user = await UserService.findAdminByParams({
      username: username.trim(),
    });
    if (!user) return res.status(400).send({ code:'invalid-credential', message: "Invalid login details" });
    const isMatch = await UserService.doesPasswordMatch(
      password,
      user.password
    );
    if (!isMatch) return res.status(400).send({ code:'invalid-credential', message: "Invalid login details" });
    
    const token = await user.generateToken();
    res.status(200).send({ user, token, isAdmin: true });
  }catch (err) {
    return res.status(500).send({ code:'internal-error', message: "A server error occurred while trying to login user" });
  }
}

module.exports = {login, adminLogin}