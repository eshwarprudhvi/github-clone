# GitHub Clone (MERN Stack) 🚀

A full-stack GitHub clone that allows users to manage repositories through a web interface and a custom Command Line Interface (CLI). Synchronize your local code with the cloud using our specialized git-like commands.

## 🔗 Live Links
- **Frontend:** [https://prudhvi-github.netlify.app/](https://prudhvi-github.netlify.app/)
- **Backend API:** [https://github-clone-3ibr.onrender.com](https://github-clone-3ibr.onrender.com)

## ✨ Features
- **Repository Management:** Create, view, and track repositories.
- **Custom CLI:** Perform `init`, `add`, `commit`, and `push` directly from your terminal.
- **Cloud Storage:** Integrated with **Dropbox API** for remote file storage and **MongoDB** for version tracking.
- **Social Features:** Follow users and star repositories.
- **Security:** JWT-based authentication and secure password hashing.

---

## 💻 CLI Usage Guide

To use the custom CLI, navigate to your local project folder and use the following commands through the `backend/server.js` entry point.

### 1. Initialize a Repository
First, create a repository on the web interface. Navigate to the **Repository Detail** page for your new repo and copy the **Repo ID** displayed there. Then run:
```bash
node server.js init <REPO_ID>
```
*This creates a hidden `.pgit` folder and links your local directory to the cloud repository.*

### 2. Stage Files
Add specific files to the staging area before committing:
```bash
node server.js add <file_path>
```
*Example: `node server.js add index.js`*

### 3. Commit Changes
Save your staged changes locally with a descriptive message:
```bash
node server.js commit "Your commit message"
```

### 4. Push to Cloud
Upload your local commits and files to the cloud (MongoDB & Dropbox):
```bash
node server.js push
```

### 5. Pull from Cloud
Download the latest version of the repository:
```bash
node server.js pull
```

### 6. Revert to a Commit
Undo changes and go back to a previous state:
```bash
node server.js revert <COMMIT_ID>
```

---

## 🛠️ Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/eshwarprudhvi/github-clone.git
   ```

2. **Backend Setup:**
   - Navigate to `backend/`
   - Run `npm install`
   - Create a `.env` file with:
     ```env
     MONGODB_URL=your_mongodb_uri
     JWT_SECRET=your_secret
     DROPBOX_ACCESS_TOKEN=your_token
     ```
   - Start server: `npm run start`

3. **Frontend Setup:**
   - Navigate to `frontend/`
   - Run `npm install`
   - Start development server: `npm run dev`

---

## 🛡️ Tech Stack
- **Frontend:** React.js, Tailwind CSS, Axios, React Router.
- **Backend:** Node.js, Express.js, Mongoose.
- **Database:** MongoDB Atlas.
- **Storage:** Dropbox API.
- **CLI Logic:** Yargs, FS modules.

Developed by [Prudhvishwar](https://github.com/eshwarprudhvi).
