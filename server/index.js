require("dotenv").config();
const fs = require("fs");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { Deepgram } = require("@deepgram/sdk");
const Transcription = require("./models/Transcription");

const deepgram = new Deepgram(
  process.env.DEEPGRAM_API_KEY
);
const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("This server is for transcribing audio files using Deepgram API");
});

app.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    const audio = fs.readFileSync(req.file.path);

    const response = await deepgram.transcription.preRecorded(
      {
        buffer: audio,
        mimetype: req.file.mimetype,
      },
      {
        punctuate: true,
        model: "nova",
        language: "en-US",
      }
    );

    const text =
      response.results.channels[0]
      .alternatives[0].transcript;

const savedTranscription = await Transcription.create({
  filename: req.file.originalname,
  transcription: text,
});

res.json({
  message: "Transcription successful",
  text,
  data: savedTranscription,
});

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Transcription failed",
    });
  }
});
app.get("/transcriptions", async (req, res) => {
  try {
    const transcriptions =
      await Transcription.find().sort({
        createdAt: -1,
      });

    res.json(transcriptions);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch transcriptions",
    });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
app.listen(5000, () => {
  console.log("Server running on port 5000");
});