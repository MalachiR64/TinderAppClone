# Tinder Database WEBAPP
## Project Description
This project aims to recreate the popular dating application Tinder as a web application. It provides users with features such as account creation, swiping through profiles, matching with other users based on mutual interest, and messaging functionality. Through intuitive user interfaces and smooth interactions, this web application aims to deliver an engaging and enjoyable user experience akin to the original Tinder application.

## Table of Contents
* Installation
* Features

## Installation
### 1. Setting up a Virtual Environment

First, create a virtual environment using `virtualenv` or `venv` to isolate the dependencies for this project:

```bash
# Using virtualenv
virtualenv venv
# Or using venv (Python 3)
python3 -m venv venv
```

Activate the virtual environment:

```bash
# On Windows
venv\Scripts\activate
# On Unix or MacOS
source venv/bin/activate
```

### 2. Installing Node.js and React

Install Node.js from the official website: [Node.js](https://nodejs.org/)

Once Node.js is installed, you can install React using npm (Node Package Manager):

```bash
npm install -g create-react-app
```

### 3. Installing Python Dependencies

Install the required Python dependencies using pip:

```bash
pip install fastapi uvicorn sqlalchemy pymysql
```

### 4. Installing React Elements

If you're using any specific React elements library, install it using npm. For example, to install Material-UI:

```bash
npm install @mui/material @emotion/react @emotion/styled
```

### 5. Additional Setup

Depending on your project's requirements, you might need to configure database connections or other environment variables. Refer to your project's documentation or configuration files for specific details.

### 6. Running the Application

Once everything is set up, you can run your FastAPI backend using Uvicorn:

```bash
uvicorn main:app --reload
```

And run your React frontend:

```bash
cd frontend
npm start
```

Your application should now be running locally. Access it through your web browser at the specified address (typically `localhost:3000` for React and `localhost:8000` for FastAPI).
## Features

This Tinder Clone Web Application comes with the following features:

1. **Account Creation**: Users can easily create accounts by providing necessary information such as name, email, and password.

2. **Profile Management**: Users have the ability to update and manage their profiles by adding photos, updating personal information, and adjusting preferences.

3. **Swiping Interface**: The application provides an intuitive swiping interface, allowing users to swipe left or right on profiles to express their interest or disinterest.

4. **Matching Algorithm**: Utilizing a sophisticated matching algorithm, the application suggests potential matches based on user preferences, mutual interests, and location.

5. **Real-time Messaging**: Once users mutually match with each other, they can engage in real-time messaging to communicate and get to know each other better.

6. **Responsive Design**: The web application is designed with a responsive layout, ensuring a seamless user experience across various devices including desktops, tablets, and smartphones.

7. **Notification System**: Users receive instant notifications for new matches, messages, and other relevant activities within the application, keeping them engaged and informed.
