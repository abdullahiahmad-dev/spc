require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/User');

const createSuperAdmin = async () => {

    try {

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB connected successfully');

        // Check whether Super Admin already exists
        const existingSuperAdmin = await User.findOne({
            role: 'superadmin'
        });

        if (existingSuperAdmin) {

            console.log('Super Admin already exists!');
            console.log('Name:', existingSuperAdmin.fullName);
            console.log('Email:', existingSuperAdmin.email);

            return;

        }

        // Create default Super Admin
        const superAdmin = await User.create({

            fullName: process.env.SUPERADMIN_NAME,

            username: 'superadmin',

            email: process.env.SUPERADMIN_EMAIL,

            password: process.env.SUPERADMIN_PASSWORD,

            role: 'superadmin',

            branch: null,

            isActive: true,

            mustChangePassword: true

        });

        console.log('================================');
        console.log('SUPER ADMIN CREATED SUCCESSFULLY');
        console.log('================================');

        console.log('Name:', superAdmin.fullName);
        console.log('Username:', superAdmin.username);
        console.log('Email:', superAdmin.email);
        console.log('Role:', superAdmin.role);

    } catch (error) {

        console.error('Error creating Super Admin:', error.message);

    } finally {

        await mongoose.disconnect();

        console.log('Database connection closed');

    }

};

createSuperAdmin();