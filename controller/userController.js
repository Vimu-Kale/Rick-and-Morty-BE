import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../model/user.js";
import Favourite from "../model/favourites.js";

// ===============================================================================
//ERROR HANDLERS
const handleValidationError = (err) => {
  let message;
  const key = Object.keys(err.errors);

  if (err.errors[key[0]] && err.errors[key[0]].properties) {
    message = err.errors[key[0]].properties.message;
  }
  return message;
};
const handleDuplicateField = (err) => {
  let message;
  const keys = Object.keys(err.keyValue);
  if (keys.includes("email")) message = "User already exists";
  return message;
};
// ===============================================================================

//USER REGISTRATION
export const handleSignUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User({
      firstName,
      lastName,
      email,
      password,
    });

    const newUser = await user.save();

    res.status(201).json({
      success: true,
      message: "User Saved Successfully",
      payload: newUser,
    });
  } catch (e) {
    let message = "something went wrong";
    if (e.code === 11000) message = handleDuplicateField(e);
    if (e.name === "ValidationError") message = handleValidationError(e);
    return res.status(400).json({
      success: false,
      message: message,
    });
  }
};

//USER LOGIN
export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userLogin = await User.findOne({
      email: email,
    });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      if (!isMatch) {
        res
          .status(400)
          .json({ success: false, message: "Invalid Credientials" });
      } else {
        const accessToken = jwt.sign(
          userLogin.toJSON(),
          process.env.ACCESS_TOKEN_SECRET
        );

        res.status(200).json({
          success: true,
          message: "Login Successfull",
          payload: userLogin,
          accessToken: accessToken,
        });
      }
    } else {
      res.status(400).json({ success: true, message: "Invalid Credientials" });
    }
  } catch (e) {
    res.status(500).json({ success: "false", message: "Unable To Login User" });
  }
};

//ADD TO FAVOURITE BY USER
export const handleAddToFavourite = async (req, res) => {
  const { id, _id } = req.query;

  try {
    const favourite = await Favourite({
      id: id,
      favBy: _id,
    });

    const newFavourite = await favourite.save();

    res.status(201).json({
      success: true,
      message: "Added To Favourites",
      payload: newFavourite,
    });
  } catch (e) {
    let message = "something went wrong";
    if (e.code === 11000) message = handleDuplicateField(e);
    if (e.name === "ValidationError") message = handleValidationError(e);
    return res.status(400).json({
      success: false,
      message: message,
    });
  }
};

//REMOVE FAVOURITE BY USER
export const handleRemoveFromFavourite = async (req, res) => {
  try {
    const deletedFav = await Favourite.findOneAndDelete({
      id: req.query.id,
      favBy: req.query._id,
    });
    if (!deletedFav) {
      res.status(404).json({ success: false, message: "Favourite not found" });
    } else {
      res.status(200).json({
        success: true,
        message: "Removed From Favourites",
        payload: deletedFav,
      });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "couldn't remove from favourite" });
  }
};

// FETCH ALL FAVOURITES BY USER
export const handleFetchFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find({ favBy: req.query._id });
    if (!favourites) {
      res
        .status(500)
        .json({ success: true, message: "Unable To Fetch Favourites" });
    } else if (favourites.length === 0) {
      res.status(404).json({
        success: true,
        message: "No Favourites",
        payload: favourites,
      });
    } else {
      res.status(200).json({ success: true, favourites });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: true, message: "Unable To Fetch Favourites" });
  }
};
