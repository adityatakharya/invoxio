# Invoxio

Check description for description and deployement.

## ✨ Features

- 🔄 **Real-time Messaging:** Instant communication using WebSockets.
- 🌐 **Meet Strangers:** Meet new people from around the world for one-on-one in our strangers room.
- 🏛️ **Public and Private Rooms:** Join public discussions or create private rooms with ease.
- 📱 **Responsive Design:** Sleek and user-friendly interface built with Next.js, DaisyUI, and Tailwind CSS.
- 📈 **Scalable Architecture:** Efficient message handling with Apache Kafka and Redis Pub/Sub.
- 🔒 **Reliable Storage:** Secure message storage using PostgreSQL, managed by Prisma ORM.
- 🚀 **Seamless Deployment:** Backend on Railway and frontend on Vercel for smooth and efficient operations.

## 🛠️ Technologies Used

- **Frontend:** Next.js, DaisyUI, Tailwind CSS, Custom CSS Animations
- **Backend:** Railway, WebSockets (Socket.io), Redis Pub/Sub, PostgreSQL (Aiven), Prisma ORM, Apache Kafka
- **Deployment:** Vercel (Frontend), Railway (Backend)
- **Development Workflow:** TurboRepo for monorepo structure

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### 📋 Prerequisites

- Node.js
- npm or yarn
- Aiven for Caching.
- Aiven for Kafka.
- Aiven for PostgreSQL.

### ⚙️ Installation

1. Clone the repo
   ```
   git clone https://github.com/adityatakharya/invoxio.git
   ```

2. Install NPM packages
    ```
    npm install
    ```
    or
    ```
    yarn install
    ```

3. Set up the PostgreSQL database and configure the .env file with your database credentials.

### 🏃 Running the Application

1. Enter the required environment variables (for e.g., Kafka, Redis, PostgreSQL credentials) in a .env file.

2. Store PostgreSQL certicficate provided by aiven as ca.pem in the apps/server/prisma directory and modify your **DATABASE_URL** with ```&sslcert=ca.pem``` at the end of it.

3. Change the Server API URL on **SocketContextProvider.tsx** at *apps/web/context* to your server's hosting address (localhost:8000, if you're running it locally)

4. Run database migrations on *apps/server* folder
    ```
    npx prisma migrate dev
    ```
    and
    ```
    npx prisma generate
    ```

5. Start the development server on root directory.
    ```
    npm run dev
    ```
    or
    ```
    yarn dev
    ```

### 🌐 Deployment
The application can be deployed using Vercel for the frontend and Railway for the backend. Ensure that all environment variables are properly configured.

### 🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

### 👨🏻‍💻 Fork the Project

1. Create your Feature Branch **(git checkout -b feature/AmazingFeature)**
2. Commit your Changes **(git commit -m 'Add some AmazingFeature')**
3. Push to the Branch **(git push origin feature/AmazingFeature)**
4. Open a Pull Request

Feel free to contribute and help the project grow. ❤️