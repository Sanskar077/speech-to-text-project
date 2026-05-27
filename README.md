# Speech-to-Text MERN Application

## Project Overview

This is a full-stack Speech-to-Text web application built using the MERN stack.
Users can upload or record audio files, convert speech into text using the Deepgram Speech-to-Text API, and store transcriptions in MongoDB Atlas.

The project includes:

* Audio recording
* Audio file upload
* Speech-to-text transcription
* MongoDB storage
* Authentication APIs
* Responsive frontend UI
* Full frontend and backend deployment

---

# Features

* Record audio directly from browser
* Upload audio files
* Convert speech to text using Deepgram API
* Store transcriptions in MongoDB Atlas
* View transcription history
* JWT Authentication APIs
* Error handling and validation
* Responsive modern UI
* Full-stack deployment using Vercel and Render

---

# Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Multer
* Deepgram Speech-to-Text API

## Deployment

* Vercel (Frontend)
* Render (Backend)

---

# Folder Structure

```bash
speech-to-text-project/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── models/
│   ├── uploads/
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/Sanskar077/speech-to-text-project.git
cd speech-to-text-project
```

---

# Backend Setup

## 2. Navigate to Server

```bash
cd server
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Create `.env`

Create a `.env` file inside `server/`

```env
MONGO_URI=your_mongodb_connection_string
DEEPGRAM_API_KEY=your_deepgram_api_key
JWT_SECRET=your_secret_key
```

## 5. Run Backend

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# Frontend Setup

## 6. Navigate to Client

```bash
cd client
```

## 7. Install Dependencies

```bash
npm install
```

## 8. Run Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# API Routes

## Authentication

### Register

```http
POST /register
```

### Login

```http
POST /login
```

---

# Transcription

### Upload Audio

```http
POST /upload
```

### Fetch Transcriptions

```http
GET /transcriptions
```

---

# Deployment Links

## Frontend (Vercel)

[https://speech-to-text-project-c9y9.vercel.app/](https://speech-to-text-project-c9y9.vercel.app)

## Backend (Render)

[https://speech-to-text-project-ikq6.onrender.com](https://speech-to-text-project-ikq6.onrender.com)

---

# Screenshots

Add screenshots here:

* Homepage
<img width="1342" height="644" alt="image" src="https://github.com/user-attachments/assets/f325f01a-0ece-4157-a85f-361b6d4c7e98" />

* Upload Section
<img width="718" height="261" alt="image" src="https://github.com/user-attachments/assets/1191ed9d-7349-48dd-9ad8-9f543d4fea3e" />

* Recording Feature
<img width="715" height="204" alt="image" src="https://github.com/user-attachments/assets/53422390-634b-4964-8c1e-47e831486c30" />

* Transcription Result
<img width="732" height="504" alt="image" src="https://github.com/user-attachments/assets/6a802217-8bd5-4cc9-8135-68c8fe8ba8a6" />
  


---

# Future Improvements

* Full frontend authentication pages
* User-specific transcription history
* Protected routes
* Download transcription as TXT/PDF
* Real-time speech transcription
* Dark/Light mode toggle

---

# Error Handling

The application handles:

* Invalid audio file types
* Empty uploads
* Large file uploads
* API failures
* Network issues
* Backend validation errors

---

# Author

## Sanskar Alave

GitHub:
[https://github.com/Sanskar077](https://github.com/Sanskar077)

---

# License

This project is created for educational and internship purposes.
