# Chrome-Extension-Linkedin-scraper
🌐 LinkedIn Profile Collector — Chrome Extension + NodeJS Backend

This project is built as part of an internship task.
It consists of:

A Chrome Extension that opens LinkedIn profiles one by one

Extracts profile details from each page

Sends that data to a NodeJS + Express + Sequelize backend

Stores it in a SQLite database


This README explains how to install, run, and test the entire system.


---

🚀 Features

🔹 Chrome Extension

Takes a list of LinkedIn profile URLs (min 3)

Opens each link automatically in a new tab

Extracts:

Name

Bio Line

Location

About Section

Followers

Connections


Sends the extracted data to backend using POST /api/profiles

Closes the tab and moves to the next profile


🔹 Backend (Node + Express)

REST API to receive profile data

Uses Sequelize ORM

Stores data in SQLite (database.sqlite)

Easy local setup



---

📁 Project Structure

Chrome-Extension-2/
│
├── extension/
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── icon.png
│
└── api/
    ├── index.js
    ├── package.json
    ├── package-lock.json
    └── db.sqlite


---

