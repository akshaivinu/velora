import User from "../models/user.model.js";
import { connectDB } from "./config/db.config.js";
import { config } from "dotenv";

config();

const makeAdmin = async (email) => {
    try {
        await connectDB();
        const user = await User.findOneAndUpdate({ email }, { role: "admin" }, { returnDocument: 'after' });
        if (user) {
            console.log(`User ${email} is now an admin.`);
        } else {
            console.log(`User ${email} not found.`);
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const email = process.argv[2];
if (!email) {
    console.log("Please provide an email: node make_admin.js user@example.com");
    process.exit(1);
}

makeAdmin(email);
