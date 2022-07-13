import bcrypt from "bcrypt";

const validatePasswordExp = (password) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,32}$/;
  return regex.test(password);
};

export const validatePassword = (req, res, next) => {
  const password = req.body.password;

  if (Object.keys(req.body).length === 0) {
    res.status(500).json({
      success: false,
      message: "No Fields Passed In Request Body",
    });
  } else {
    if (password) {
      if (!validatePasswordExp(password)) {
        res.status(400).json({
          success: false,
          message:
            "Password must contain a special character, one lowercase & Uppercase character and atleast one number and length between 8-32",
        });
      } else {
        const passwordHash = async (password) => {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(password, salt);
          req.body.password = hash;
          next();
        };
        passwordHash(password);
      }
    } else {
      next();
    }
  }
};

export const validateLoginDetails = (req, res, next) => {
  const { email, password } = req.body;
  if (Object.keys(req.body).length === 0) {
    res.status(500).json({
      success: false,
      message: "Empty Body! Cannot Login",
    });
  } else if (!email || !password) {
    res
      .status(400)
      .json({ success: false, message: "Fields Cannot Stay Empty" });
  } else {
    next();
  }
};
