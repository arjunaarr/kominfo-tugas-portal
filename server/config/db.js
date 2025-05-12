
// Dummy database untuk menangani data
// Dalam aplikasi produksi, ini harus diganti dengan database sebenarnya seperti MongoDB atau MySQL

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/db.json');

// Struktur awal database
const initialDB = {
  users: [
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      password: "$2a$10$xL5tcGNIW.1GO3OmfP8WnusZNR.K7snZQ5GkeIBu9UFQqiwWl.xyC", // hashed "password"
      role: "admin",
      universitas: "Admin University",
      bidang: "System Administration",
      photo: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "2",
      name: "Regular User",
      email: "user@example.com",
      password: "$2a$10$xL5tcGNIW.1GO3OmfP8WnusZNR.K7snZQ5GkeIBu9UFQqiwWl.xyC", // hashed "password"
      role: "user",
      universitas: "User University",
      bidang: "Student Intern",
      photo: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  tasks: [],
  logins: []
};

// Buat folder data jika belum ada
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Buat file database jika belum ada
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2));
}

const readDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return initialDB;
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    return false;
  }
};

module.exports = { readDB, writeDB };
