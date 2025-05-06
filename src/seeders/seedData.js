let { MONGO_URI } = require('../config/serverConfig');
const userModel = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const createSeedUsers = async function () {
    try {
        console.log('STARTED');
        await mongoose.connect("mongodb://localhost:27017/gatepassDB");

        const existingUsers = await userModel.find();
        // if (existingUsers.length) { // Check if collection is empty
        //     process.exit();
        //     // return;
        // }
        
        const hashedDummyPwd1 = await bcrypt.hash('dummyPassword7', 10);
        const hashedDummyPwd2 = await bcrypt.hash('dummyPassword8', 10);
        const hashedDummyPwd3 = await bcrypt.hash('dummyPassword9', 10);

        const users = [
            // Dummy Admin2
            {
                username: 'dummyAdmin2',
                email: 'dummyadmin2@example.com',
                name: 'Dummy Admin4',
                role: 'admin',
                rollNo: '1234567890',
                password: hashedDummyPwd1
            },
            // Dummy Student2
            {
                username: 'dummystudentnext2',
                email: 'dummystudentnext2@example.com',
                name: 'Dummy Student5',
                password: hashedDummyPwd2,
                role: 'student',
                rollNo: '112897987879833',
                college: 'XYZ College',
                year: '2nd Year',
                course: 'B.Tech',
                department: 'CSE',
                mobNum: '1234567890',
                gatePassCount: 0
            },
            // Dummy HOD1
            {
                username: 'dummyHOD4',
                email: 'dummyHOD4@example.com',
                name: 'Dummy HOD4',
                password: hashedDummyPwd3,
                role: 'hod',
                rollNo: '4455667',
                college: 'XYZ College',
                department: 'CSE',
                mobNum: '0987654321'
            }
        ];

        await userModel.insertMany(users);
        console.log('Dummy Users Added Successfully');
        process.exit();
    }
    catch (err) {
        console.log(err);
        process.exit();
    }
}

createSeedUsers();
