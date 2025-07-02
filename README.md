The Hungry Table - Restaurant Website Backend

The backend of **The Hungry Table** is built using the MEAN stack (MongoDB, Express.js, Angular, Node.js). It manages user authentication, menu retrieval, order processing, and table reservations. Designed for scalability and security, it includes email notifications and supports future extensions like payments and admin dashboards.

##Features
-  Secure user registration and login with bcrypt
-  Food order processing and cart handling
-  Table reservation with time conflict validation
-  Email confirmation via Nodemailer
-  RESTful APIs
-  MVC architecture for clean separation
-  MongoDB for dynamic and scalable data storage

##  Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- bcryptjs
- Nodemailer

##  Folder Structure

## 📌 API Endpoints
| Method | Endpoint           | Description               |
|--------|--------------------|---------------------------|
| POST   | /api/register      | Register a user           |
| POST   | /api/login         | Login user                |
| GET    | /api/menu          | Get menu items            |
| POST   | /api/orders        | Place an order            |
| POST   | /api/reservations  | Book a reservation        |

##  Testing
-  Manual testing with Postman
-  Valid user registration/login
-  Wrong password or existing email → error
-  Menu fetch & order submit
-  Reservation conflict → handled
Future Plans
Admin Dashboard

JWT Authentication

Online Payments (Stripe/Razorpay)

SMS/Email Notifications

Customer Reviews
 Developer
Ch.Navya Jeevani, M. Sumalatha, D.Sowmya – Backend Developer (Node.js, MongoDB)
