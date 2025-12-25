# VSTREAM - Premium Video Platform

VSTREAM is a high-performance, multi-tenant video streaming application featuring real-time AI thumbnail generation, sensitivity analysis, and secure streaming with role-based access control.

## 🚀 Key Features

- **Multi-Tenant Architecture**: Complete data isolation between organizations.
- **RBAC (Role-Based Access Control)**: Admin, Editor, and Viewer roles.
- **AI-Powered Previews**: Dynamic cinematic thumbnails generated via **Pollination.ai** based on video titles.
- **Smart Sensitivity Analysis**: Automated content scanning with safety flagging.
- **Custom Media Player**: Support for HTTP Range Requests (206) for smooth seeking and playback.
- **System Admin Dashboard**: Global overview of users, organizations, and content.
- **Premium UI**: Modern glassmorphic design using Vanilla CSS.

## 🛠 Tech Stack

- **Frontend**: React (Vite), Lucide Icons, Socket.io-client, Axios, React Toastify.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io, Multer, fluent-ffmpeg.
- **AI Integration**: Pollination.ai.

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or on Atlas)

### Local Setup

1. **Install Dependencies**:
   ```bash
   npm install && npm run postinstall
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/video_stream_db
   JWT_SECRET=your_super_secret_key
   CORS_ORIGIN=http://localhost:5173
   UPLOAD_DIR=uploads/
   ```

3. **Run the Application**:
   - Backend: `cd backend && npm start`
   - Frontend: `cd frontend && npm run dev`

## ☁️ Deployment (Render)

This project is configured for **Unified Deployment** on Render using the included `render.yaml` blueprint.

1. Push this code to a GitHub repository.
2. In the Render Dashboard, click **New +** -> **Blueprint**.
3. Select your repository.
4. Render will automatically set up the Web Service and MongoDB instance.

## 📄 License

Internal Project - All Rights Reserved.
