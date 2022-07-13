import express from "express";
const router = express.Router();
import userRouter from "./userRoutes.js";

/**
 * @openapi
 * /:
 *  get:
 *     tags:
 *     - Root Route
 *     description: This is The Root Route Of Node Application
 *     responses:
 *       200:
 *         description: API is  running
 */
router.get("/", (req, res) => {
  console.log("On To The Root Route!");
  res.sendStatus(200);
});

router.use("/api/users", userRouter);

export default router;
