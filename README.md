# Codeway Case — Frontend

A Vue.js frontend application for user authentication and configuration management, connected to a Node.js + Firebase backend.

## Tech Stack

- Vue.js 3 (via Vue CLI)
- Vue Router 4
- Axios for HTTP requests
- Firebase SDK (for auth integration)
- ESLint with Babel parser

## Features

- User sign up, sign in, sign out flows
- Configuration panel with create, update, delete features
- Responsive UI (for web and mobile view)

## Prerequisites

- Node.js v14 or higher
- npm or yarn installed
- Vue CLI installed globally (`npm install -g @vue/cli`)
- Backend API running and accessible

## Installation

```bash
git clone https://github.com/bilgesucakir/codeway-case.git
cd codeway-case/codeway-case-frontend
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## Environment Variables

Create a .env file in the project root with the backend API URL:
```bash
VUE_APP_API_BASE_URL=http://localhost:3000/api
```
Change this according to your backend url

## Pages

### Sign up page
- Allows users to register a new account by providing Name Surname, Email, Password, and Repeat Password.

- Validates email format and password strength (min 8 chars, at least one letter, one digit, one symbol).

- Password and repeated password must match.

- On successful sign-up, shows an alert and redirects users to the Sign in page.

- Shows error alerts if sign-up fails.

- Provides a link to the Sign in page if the user already has an account.

### Sign in page

- Enables existing users to log in using their Email and Password.

- On successful login, stores user info and token in localStorage and redirects to the Configuration panel (main page).

- Provides a link to the Sign up page if the user does not have an account yet.

- Shows error alerts if sign-in fails.

### Configuration panel

- Main user interface after login to view, add, edit, and delete configuration entries.

- Entries have fields: Parameter Key, Value, Description, and Create Date.

- Supports both web (table) and mobile (card list) views with responsive layout.

- Allows sorting entries by creation date ascending/descending.

- Displays user info in a dropdown with a Sign Out button.

- Signs out the user if the button is clicked and redirects to sign in page.

- Fetches entries on load, sends API requests to create, update, and delete configurations.

- Shows a modal popup to edit an entry.

## Currently deployed at
https://codeway-case-frontend-p9n1.onrender.com