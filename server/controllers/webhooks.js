import { Webhook } from "svix";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const clerkWebhook = async (req, res) => {
    try {
        console.log("Webhook received:", req.body); // Log the incoming webhook payload

        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-signature": req.headers["svix-signature"],
            "svix-timestamp": req.headers["svix-timestamp"],
        });

        const { data, type } = req.body;

        switch (type) {
            case 'user.created': {
                console.log("User registered:", data);
                const userData = {
                    _id: data.id,
                    name: data.first_name + " " + data.last_name,
                    email: data.email_addresses[0].email_address,
                    imageUrl: data.image_url,
                }

                await User.create(userData);
                res.json({});
                break;
            }

            case 'user.updated': {
                console.log("User updated:", data);
                const updatedUserData = {
                    _id: data.id,
                    name: data.first_name + " " + data.last_name,
                    email: data.email_address[0].email_address,
                    imageUrl: data.image_url,
                }

                await User.findByIdAndUpdate(data.id, updatedUserData);
                res.json({});
                break;
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                res.json({});
                break;
            }
        
            default:
                console.log("Unhandled webhook type:", type);
                break;
        }
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.json({ success: false, message: error.message });
    }
}

export default clerkWebhook;