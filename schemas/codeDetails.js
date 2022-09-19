const mongoose = require("mongoose");

const saveCode = new mongoose.Schema({
  userDetails: {
    type: String,
    required: true,
  },

  html: {
    type: String,
    required: true,
  },
  css: {
    type: String,
    required: true,
  },
  round: {
    type: Number,
    required: true,
  },
  time: { type: Date, default: Date.now },
}, { timestamps: true });
const CodeBase = mongoose.model("Codebase", saveCode);
module.exports = CodeBase;
