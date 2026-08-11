const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");


// ==========================================
// ADMIN LOGIN
// ==========================================

const loginAdmin = async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;


        // Check if fields are provided

        if (!username || !password) {

            return res.status(400).json({

                message:
                    "Username and password are required."

            });

        }


        // Find admin

        const admin =
            await Admin.findOne({
                username
            });


        if (!admin) {

            return res.status(401).json({

                message:
                    "Invalid username or password."

            });

        }


        // Compare password

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                admin.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({

                message:
                    "Invalid username or password."

            });

        }


        // Create JWT token

        const token =
            jwt.sign(

                {
                    id: admin._id,
                    username: admin.username
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "1d"
                }

            );


        // Send token

        res.status(200).json({

            message:
                "Login successful.",

            token,

            admin: {

                id:
                    admin._id,

                username:
                    admin.username

            }

        });


    } catch (error) {

        console.error(
            "Admin login error:",
            error
        );


        res.status(500).json({

            message:
                "Server error."

        });

    }

};


module.exports = {
    loginAdmin
};