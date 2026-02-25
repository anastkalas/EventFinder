# EventFinder

## Overview
EventFinder is a full-stack web application designed for event discovery and management. It allows users to find upcoming events, create their own events, and manage event details efficiently.

## Table of Contents
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Installation](#installation)
4. [Usage](#usage)
5. [API Endpoints](#api-endpoints)
6. [Front-end](#front-end)
7. [Back-end](#back-end)
8. [Contributing](#contributing)
9. [License](#license)

## Features
- Event discovery through a search interface.
- Create and manage personal events.
- User authentication and profile management.
- Responsive design for mobile and desktop users.

## Technologies Used
- **Frontend:** React, Redux, Bootstrap
- **Backend:** Node.js, Express
- **Database:** MongoDB

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/anastkalas/EventFinder.git
   ```
2. Install dependencies:
   ```bash
   cd EventFinder
   npm install
   ```
3. Set up environment variables and database connections.

## Usage
- To start the server:
  ```bash
  npm start
  ```
- Navigate to `http://localhost:3000` in your browser to access the application.

## API Endpoints
| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | /api/events | Retrieve all events |
| POST   | /api/events | Create a new event |
| GET    | /api/events/:id | Retrieve a specific event |
| PUT    | /api/events/:id | Update a specific event |
| DELETE | /api/events/:id | Delete a specific event |

## Front-end
The front-end is built using React, which provides a clean and interactive user interface. Components are structured in a modular fashion, making it easy to maintain and enhance the application.

## Back-end
The back-end is built with Node.js and Express, providing a robust API for the application. MongoDB is used for data storage, allowing for scalability and flexibility.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
