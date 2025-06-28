# 🚇 Hyderabad Metro Route Finder - Backend

A Node.js + Express backend system to calculate optimal metro routes between two stations in the Hyderabad Metro Rail network using Dijkstra’s algorithm and PostgreSQL for station/line data.

---

## 📌 Features

- Find shortest path between any two stations
- Calculate total fare, estimated travel time, and interchanges
- Uses PostgreSQL for real-time metro data
- RESTful API design
- Scalable architecture ready for frontend integration

---

## 🏗️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Algorithm:** Dijkstra's Algorithm
- **Environment:** dotenv for environment config
- **API Client:** Postman (for testing)

---

## 📁 Project Structure

metro-backend/
│
├── db/
│ └── db.js # PostgreSQL DB connection using pg
│
├── routes/
│ └── route.js # Metro route-finding logic and API
│
├── schema.sql # SQL script to create and populate DB
├── .env # DB credentials and config
├── server.js # Express server
