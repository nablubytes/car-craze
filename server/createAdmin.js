const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const readline = require("readline");

const Admin = require("./models/Admin");

dotenv.config();


// ==========================================
// TERMINAL INPUT
// ==========================================

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const askQuestion = (question) => {

    return new Promise((resolve) => {

        rl.question(question, (answer) => {

            resolve(answer.trim());

        });

    });

};


// ==========================================
// CREATE OR UPDATE ADMIN
// ==========================================

const manageAdmin = async () => {

    try {

        // Connect to MongoDB

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "\nConnected to MongoDB successfully.\n"
        );


        // Ask for username

        const username =
            await askQuestion(
                "Enter admin username: "
            );


        if (!username) {

            throw new Error(
                "Username cannot be empty."
            );

        }


        // Ask for password

        const password =
            await askQuestion(
                "Enter admin password: "
            );


        if (!password) {

            throw new Error(
                "Password cannot be empty."
            );

        }


        // Check password length

        if (password.length < 8) {

            throw new Error(
                "Password must contain at least 8 characters."
            );

        }


        // Find existing admin

        const existingAdmin =
            await Admin.findOne({
                username: username
            });


        // Hash password

        const hashedPassword =
            await bcrypt.hash(
                password,
                12
            );


        // ==========================================
        // UPDATE EXISTING ADMIN
        // ==========================================

        if (existingAdmin) {

            existingAdmin.password =
                hashedPassword;

            await existingAdmin.save();

            console.log(
                "\nAdmin password updated successfully! 🔐"
            );

        }


        // ==========================================
        // CREATE NEW ADMIN
        // ==========================================

        else {

            await Admin.create({

                username: username,

                password: hashedPassword

            });

            console.log(
                "\nAdmin account created successfully! 🔐"
            );

        }


        console.log(
            `Username: ${username}`
        );

        console.log(
            "Password has been securely hashed and stored."
        );


    } catch (error) {

        console.error(
            "\nError:",
            error.message
        );

    } finally {

        rl.close();

        await mongoose.connection.close();

        console.log(
            "\nDatabase connection closed."
        );

    }

};


// ==========================================
// RUN SCRIPT
// ==========================================

manageAdmin();