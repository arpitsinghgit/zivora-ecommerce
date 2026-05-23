const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product.cjs');
const User = require('./models/User.cjs');
const Order = require('./models/Order.cjs');
const products = require('./data.cjs');
const bcrypt = require('bcryptjs');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zivora');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.create([
      {
        name: 'Admin User',
        email: 'admin@zivora.in',
        password: 'password123',
        role: 'admin'
      },
      {
        name: 'Test User',
        email: 'user@zivora.in',
        password: 'password123',
        role: 'user'
      }
    ]);

    await Product.insertMany(products);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
