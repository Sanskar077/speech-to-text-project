const mongoose = require("mongoose");

const transcriptionSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    transcription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Transcription",
  transcriptionSchema
);