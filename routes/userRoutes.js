import express from "express";
const router = express.Router();
import {
  handleSignUp,
  handleLogin,
  handleAddToFavourite,
  handleRemoveFromFavourite,
  handleFetchFavourites,
} from "../controller/userController.js";
import {
  authenticateToken,
  isValidUserID,
} from "../middlewares/commonMiddleware.js";

import {
  validateLoginDetails,
  validatePassword,
} from "../middlewares/userMiddleware.js";

router.post("/signup", validatePassword, handleSignUp);
router.post("/login", validateLoginDetails, handleLogin);
router.get(
  "/favourites",
  [authenticateToken, isValidUserID],
  handleFetchFavourites
);

router.post(
  "/addtofav",
  [authenticateToken, isValidUserID],
  handleAddToFavourite
);

router.delete(
  "/removefromfav",
  [authenticateToken, isValidUserID],
  handleRemoveFromFavourite
);

export default router;
