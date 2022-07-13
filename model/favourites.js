import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [true, "ID Feild Is Required"],
  },
  favBy: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    red: "User",
  },
});

const Favourite = new mongoose.model("Favourite", favouriteSchema);

export default Favourite;
