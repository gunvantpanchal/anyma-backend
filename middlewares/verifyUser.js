const jwt = require("jsonwebtoken");
const User = require("../model/user");
const VerifyUser = async (req, res, next) => {
  try {
    const id = jwt.verify(
      req.headers.authorization,
      process.env.SECRET || "yourSecretKey"
    );
    const user = await User.findById(id);
    if (!id || !user) {
      return res.status(401).json("Your are not authorize");
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = VerifyUser;
