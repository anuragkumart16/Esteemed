# Esteemed

Esteemed is a comprehensive habit-tracking and self-improvement platform designed to help users build positive habits and overcome challenges. The project utilizes a modern full-stack architecture, combining a responsive web interface, a dedicated mobile application, and a real-time backend server to provide a seamless user experience.

## Project Overview

The platform is built to support users in their journey towards self-improvement through data-driven insights and community support. It allows users to track their progress, analyze patterns in their behavior, and engage with a supportive community.

### Key Features

- **Habit Tracking**: Users can monitor their streaks, log urges, and record relapse reasons to gain better insight into their habits.
- **Advanced Analytics**: The application provides detailed statistics, including interactive graphs and heatmaps, to visualize progress over time.
- **Community Interaction**: Features such as leaderboards and real-time chat functionality foster a sense of community and shared goals.
- **Buddy AI**: An integrated AI companion offers support and helps users analyze their behavioral patterns.
- **Cross-Platform Access**: The service is accessible through both a web browser and a mobile application, ensuring users can stay connected wherever they are.

## Technical Architecture

The project is organized into three main components:

1.  **Client Side (`client_side`)**: A web application built with Next.js and React, utilizing Tailwind CSS for styling and Framer Motion for animations. It handles the primary user interface and visualization of data.
2.  **Mobile App (`mobile_app`)**: A mobile application developed with Expo and React Native, providing an optimized experience for mobile users.
3.  **Server Side (`server_side`)**: A backend server built with Node.js and Express. It manages API endpoints and utilizes Socket.io for real-time communication features like chat.

## Technology Stack

-   **Frontend**: Next.js, React, Tailwind CSS, Framer Motion, Recharts
-   **Mobile**: Expo, React Native
-   **Backend**: Node.js, Express, Socket.io
-   **Database**: MongoDB, Prisma ORM

## Getting Started

To run the project locally, you will need to set up each component separately.

### Prerequisites

-   Node.js installed on your machine.
-   MongoDB database instance (local or cloud).

### Installation and Running

**1. Server Side**

Navigate to the server directory, install dependencies, and start the server.

```bash
cd server_side
npm install
npm run dev
```

**2. Client Side**

Navigate to the client directory, install dependencies, and start the web application.

```bash
cd client_side
npm install
npm run dev
```

**3. Mobile App**

Navigate to the mobile app directory, install dependencies, and start the Expo development server.

```bash
cd mobile_app
npm install
npx expo start
```
