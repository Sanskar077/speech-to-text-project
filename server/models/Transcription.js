const mongoose = require("mongoose");

const transcriptionSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  transcription: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "Transcription",
  transcriptionSchema
);