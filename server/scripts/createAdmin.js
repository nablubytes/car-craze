const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const Admin = require("../models/Admin");


dotenv.config();


const createAdmin = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Database connected");


        const hashedPassword = await bcrypt.hash(
            "Thaju@9995",
            10
        );


        const admin = new Admin({

            username: "thajuddeen",

            password: hashedPassword

        });


        await admin.save();


        console.log(
            "Admin created successfully"
        );


        process.exit();


    } catch(error) {

        console.log(error.message);

        process.exit(1);

    }

};


createAdmin();