const { MONGO_URI } = require('../config/serverConfig');
const userModel = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');  // Use crypto to generate random values

// Function to generate a random string of specified length
function generateRandomString(length) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

// Function to generate a random phone number
function generateRandomPhoneNumber() {
    return `+1${Math.floor(Math.random() * 1000000000)}`;
}

const createSeedUsers = async function () {
    try {
        console.log('STARTED');
        console.log("Mongo URI being used:", MONGO_URI || 'mongodb://mongo:27017/gatepassDB');

        // Connect to MongoDB
        await mongoose.connect(MONGO_URI || 'mongodb://mongo:27017/gatepassDB');

        // Check if there are any users in the collection
        const existingUsers = await userModel.find();
        if (existingUsers.length > 0) {
            console.log('Users already exist, exiting...');
            return;
        }

        // Hash passwords for the dummy users
        const hashedDummyPwd1 = await bcrypt.hash('dummyPassword7', 10);
        const hashedDummyPwd2 = await bcrypt.hash('dummyPassword8', 10);
        const hashedDummyPwd3 = await bcrypt.hash('dummyPassword9', 10);

        // Enum values for the "year" field
        const years = ['1st year', '2nd Year', '3rd Year', '4th Year'];

        // Create dummy users with randomized information
        const users = [
            {
                username: `admin_${generateRandomString(8)}`,  // Randomized username
                email: `admin_${generateRandomString(5)}@example.com`,  // Randomized email
                name: `Admin User ${generateRandomString(3)}`,
                role: 'admin',
                //rollno: //generateRandomString(10),  // Random 10 character roll number
                password: hashedDummyPwd1
            },
            {
                username: `student_${generateRandomString(8)}`,
                email: `student_${generateRandomString(5)}@example.com`,
                name: `Student User ${generateRandomString(3)}`,
                password: hashedDummyPwd2,
                role: 'student',
                rollno: "20H51A7653",//generateRandomString(10),
                college: `College ${generateRandomString(6)}`,
                year: years[Math.floor(Math.random() * years.length)], // Randomly select a valid year value
                course: 'B.Tech',
                department: 'CSE',
                mobNum: generateRandomPhoneNumber(),
                gatePassCount: 0
            },
            {
                username: `hod_${generateRandomString(8)}`,
                email: `hod_${generateRandomString(5)}@example.com`,
                name: `HOD User ${generateRandomString(3)}`,
                password: hashedDummyPwd3,
                role: 'hod',
                rollno: "20H51A7652",//generateRandomString(7),
                college: `College ${generateRandomString(6)}`,
                department: 'CSE',
                mobNum: generateRandomPhoneNumber()
            }
        ];

        // Insert the users into the database
        await userModel.insertMany(users);
        console.log('Dummy Users Added Successfully');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        // Close the process
        mongoose.connection.close();
    }
};

createSeedUsers();
