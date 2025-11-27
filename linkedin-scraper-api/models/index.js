const { Sequelize, DataTypes } = require('sequelize');

// Using SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite'
});

const Profile = sequelize.define('Profile', {
  name: { type: DataTypes.STRING },
  url: { type: DataTypes.STRING, unique: true },
  about: { type: DataTypes.TEXT },
  bio: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  followerCount: { type: DataTypes.INTEGER },
  connectionCount: { type: DataTypes.STRING }
}, {
  timestamps: true
});

module.exports = { sequelize, Profile };
