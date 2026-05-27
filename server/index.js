require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
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

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/webm",
      "audio/ogg",
      "audio/mp4",
      "audio/x-m4a",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid audio file type"), false);
    }
  },

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

app.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

app.get("/", (req, res) => {
  res.send("This server is for transcribing audio files using Deepgram API");
});

app.post("/upload", upload.single("audio"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No audio file uploaded",
      });
    }

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

    const savedTranscription =
      await Transcription.create({
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
      message:
        error.message || "Transcription failed",
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

app.post("/register", async (req, res) => {
  try {

    const { name, email, password } =
      req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({
      message: "User registered",
      user,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Registration failed",
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