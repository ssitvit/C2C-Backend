const mongoose = require("mongoose");

const loginDetailsSchema = new mongoose.Schema({
  registration_number: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  mobile_number: {
    type: String,
    required: true,
  },
  emailIsVerified: {
    type: Boolean,
    default: false,
  },
  refreal: {
    type: Number,
  },
  universityName: {
    type: String,
    required: true,
  },
  round1: {
    type: Boolean,
    default: false,
  },
  round2: {
    type: Boolean,
    default: false,
  },
  round3: {
    type: Boolean,
    default: false,
  },
  round10Score: {
    type: Number,
    default: 0,
  },
  round11Score: {
    type: Number,
    default: 0,
  },
  round1Score: {
    type: Number,
    default: 0,
  },
  round2Score: {
    type: Number,
    default: 0,
  },
  round3Score: {
    type: Number,
    default: 0,
  },
  position: {
    type: Number,
    default: -1,
  },
});



const loginData = mongoose.model("participants", loginDetailsSchema);
module.exports = loginData;
