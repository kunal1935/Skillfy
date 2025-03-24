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

        console.log("Webhook type:", type);
        console.log("Webhook data:", data);
        res.status(200).json({ success: true, message: "Webhook received successfully", data, type});

        // Process webhook asynchronously
        if (type === "user.created") {
            const user = User.create({
                _id: data.id,
                name: `${data?.first_name} ${data?.last_name}`,
                email: data?.email_addresses[0]?.email_address,
                imageurl: data?.image_url,   
            });
            await user.save();
            console.log("User created:", user);
            // Add any additional processing logic here
        }
        else if (type === "user.updated") {
            const { id, emailAddress, firstName, lastName } = data;
            const user = await User.findById(id);
            if (!user) {
                throw new Error("User not found");
            }
            user.name = `${firstName} ${lastName}`;
            user.email = emailAddress;
            await user.save();
            console.log("User updated:", user);
            // Add any additional processing logic here
        }
        else if (type === "user.deleted") {
            const { id } = data;
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                throw new Error("User not found");
            }
            console.log("User deleted:", user);
            // Add any additional processing logic here
        }
        else {
            console.log("Unhandled webhook type:", type);
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