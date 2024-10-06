import mongoose from "mongoose";

const userSchema = mongoose.Schema({
   username: {
      type: String,
      required: [true, "[✘] username missed!]"],
      trim: true,
   },

   email: {
      type: String,
      required: [true, "[✘] email missed!]"],
      trim: true,
   },

   phoneNum: {
      type: String,
      required: [true, "[✘] phone number missed!]"],
      trim: true,
   },

   password: {
      type: String,
      required: [true, "[✘] password missed!]"],
      trim: false,
   },

   salt: {
      type: String,
      required: [true, "[✘] salt missed!"],
   }
});

const userModel = mongoose.model("users", userSchema);

export default userModel;