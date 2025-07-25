
# 🎉 Eventify - Smart Event Management Platform

Eventify is a modern, full-stack web application for planning, hosting, managing, and attending events. It supports multiple user roles including **User**, **Owner**, **Co-Host**, **Guest**, and **Admin**, and is built using the powerful **MERN stack**.

---

## 🔧 Features

- 🌐 Public Pages (before login): Home, About, Features, Events, User Directory, Sign In/Register
- 🔐 Role-Based Dashboards (after login): 
  - **User**: Join events
  - **Owner**: Create/manage events, add co-hosts, view guests
  - **Co-Host**: Assist owners, manage guests
  - **Guest**: RSVP to events
  - **Admin**: Manage users/events, feature/flag events
- 💡 Role Detection and Auto-Routing after Login
- 🔄 Multiple Roles per User (e.g., User + Guest + Owner)
- 🎨 Beautiful UI with Tailwind CSS
- 🔐 JWT Authentication and Role Handling
- 🔍 View Events by All Creators on Home and Directory

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT, bcrypt
- **Others**: Context API, REST API, Git

---

## ⚙️ Installation Guide

### 1. Clone the repository

```bash
git clone https://github.com/your-username/eventify.git
cd eventify
````

### 2. Set Up Backend (Node.js)

```bash
cd backend
npm install
npm run dev
```

### 3. Set Up Frontend (React)

```bash
cd frontend
npm install
npm start
```

### 4. Environment Variables

Create a `.env` file in the `backend/` folder with the following content:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 📁 Folder Structure

```
eventify/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── routes/
│   └── context/
```

---

## 📌 Future Enhancements

* 📧 Email notifications and reminders
* 📅 Event calendar integration
* 🔍 Advanced search and filtering
* 🤖 AI-based event recommendations
* 💬 Event chat or live Q\&A modules

---

## 👨‍💻 Author

**Sayali Kulkarni**
📬 Email: [saylikulkarni0645@gmail.com](mailto:saylikulkarni0645@gmail.com)
🔗 GitHub: [@saylik365](https://github.com/saylik365)

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📣 Contribute

Feel free to **fork this repo**, raise issues, submit PRs, or drop a ⭐ if you like the project!

---

