import { Webhook } from "svix";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const clerkWebhook = async (req, res) => {
    try {
        console.log("Webhook received:", req.body); // Log the incoming webhook payload

        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const payload = JSON.stringify(req.body);
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-signature": req.headers["svix-signature"],
            "svix-timestamp": req.headers["svix-timestamp"],
        };

        if (!headers["svix-id"] || !headers["svix-signature"] || !headers["svix-timestamp"]) {
            throw new Error("Missing required svix headers");
        }

        await whook.verify(payload, headers);
        console.log("Webhook verified successfully");

        const { data, type } = req.body;

        // Respond immediately to avoid timeout
        res.status(200).json({ success: true });

        // Process webhook asynchronously
        switch (type) {
            case 'user.created':
                console.log("User registered:", data);
                await User.create({
                    _id: data.id,
                    name: `${data.first_name} ${data.last_name}`,
                    email: data.email_addresses[0].email_address,
                    imageUrl: data.image_url,
                });
                res.status(200).json({ success: true , message: "User created successfully"});
                break;

            case 'user.updated':
                console.log("User updated:", data);
                await User.findByIdAndUpdate(data.id, {
                    name: `${data.first_name} ${data.last_name}`,
                    email: data.email_addresses[0].email_address,
                    imageUrl: data.image_url,
                });
                res.status(200).json({ success: true, message: "User updated successfully"});
                break;

            case 'user.deleted':
                console.log("User deleted:", data);
                await User.findByIdAndDelete(data.id);
                res.status(200).json({ success: true, message: "User deleted successfully"});
                break;

            default:
                console.log("Unhandled webhook type:", type);
                break;
        }
    } catch (error) {
        console.error("Error processing webhook:", error);
        // Ensure response is sent even if an error occurs
        if (!res.headersSent) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};

export default clerkWebhook;