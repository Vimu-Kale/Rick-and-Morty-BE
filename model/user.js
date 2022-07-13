import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name Feild Is Required"],
    lowercase: true,
    minLength: [2, "First Name must be grater than or equal to two letters"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name Feild Is Required"],
    lowercase: true,
    minLength: [2, "Last Name must be grater than or equal to two letters"],
  },
  email: {
    type: String,
    required: [true, "Email Field Is Required"],
    unique: [true, "Email ID Already Taken"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: {
    type: String,
    required: [true, "Password Field Is Required"],
  },
});

const User = new mongoose.model("User", userSchema);

export default User;
