# 🍽️ QR-MENU BACKEND

**QR-MENU BACKEND** is the server-side application for a digital menu platform. Built using **Node.js**, **NestJS**, and **MongoDB**, this backend allows restaurants or cafes to manage digital menus that customers can access by scanning QR codes.

---

## 🚀 Features

- **User Authentication**: Secure login and registration using JWT.
- **Menu Management**: Add, update, or remove menu items organized by category.
- **QR Code Integration**: Menus are accessible through unique QR codes.
- **Restaurant Profiles**: Manage information about restaurants.
- **Role-Based Access**: Different access for admins and restaurant managers.
- **Image Uploads**: Upload images for menu items via file handling.

---

## 🧰 Technologies Used

- **Node.js** – JavaScript runtime
- **NestJS** – Progressive Node.js framework
- **Express** – Underlying HTTP server framework
- **MongoDB** – NoSQL database for data storage
- **Mongoose** – MongoDB object modeling tool
- **JWT (jsonwebtoken)** – Authentication mechanism
- **Multer** – Middleware for handling `multipart/form-data` (file uploads)
- **bcryptjs** – Password hashing for secure login
- **pnpm** – Fast, disk space-efficient package manager

---

## 📁 Project Structure

QR-MENU BACKEND/
├── src/
│ ├── modules/ # Feature modules like auth, menu, user, etc.
│ ├── common/ # Shared utilities and middleware
│ ├── config/ # Configuration files (e.g., database)
│ └── core/ # Core services and interfaces
├── uploads/ # Image and file uploads
├── test/ # Automated test cases
├── dist/ # Compiled production files
├── .env # Environment variable definitions
├── package.json # Project metadata and scripts
├── tsconfig.json # TypeScript configuration
├── nest-cli.json # NestJS-specific CLI settings
└── README.md # Project documentation

yaml
Copy
Edit

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/QR-MENU-BACKEND.git
cd QR-MENU-BACKEND
2. Install Dependencies
bash
Copy
Edit
pnpm install
You can use npm install or yarn install if you're not using pnpm.

3. Configure Environment Variables
Create a .env file in the root directory and define:

env
Copy
Edit
MONGO_URI=mongodb://localhost:27017/qr_menu
JWT_SECRET=your_jwt_secret
PORT=5000
🏃 Running the Application
Development
bash
Copy
Edit
pnpm run start:dev
Production
bash
Copy
Edit
pnpm run build
pnpm run start:prod
Server runs on: http://localhost:5000 (or specified PORT)

🔑 Authentication
Users must register and login to access protected routes.

JWT tokens are issued on login and must be included in headers:

http
Copy
Edit
Authorization: Bearer <your_token>
🔗 Key API Endpoints
Test using Postman or any API client.

👤 Auth
POST /api/auth/register – Register new user

POST /api/auth/login – Login user

📋 Menu
GET /api/menu – Get all menu items

POST /api/menu – Add a menu item

PUT /api/menu/:id – Update a menu item

DELETE /api/menu/:id – Delete a menu item

🍽️ Restaurant
GET /api/restaurant – Get restaurant info

POST /api/restaurant – Create restaurant profile

📤 File Uploads
Use multipart/form-data to upload images for menu items. Files are stored in the uploads/ directory.

🧪 Testing
Run tests with:

bash
Copy
Edit
pnpm run test
🤝 Contributing
Contributions are welcome! To contribute:

Fork the repository

Create a new branch:

bash
Copy
Edit
git checkout -b feature/your-feature
Commit your changes:

bash
Copy
Edit
git commit -m "Add your feature"
Push to your branch:

bash
Copy
Edit
git push origin feature/your-feature
Open a pull request

📄 License
This project is licensed under the MIT License.

📬 Contact
For questions or suggestions, contact: [your-email@example.com]

vbnet
Copy
Edit

Let me know if you'd like to include images, database schema diagrams, or anything else in the README!