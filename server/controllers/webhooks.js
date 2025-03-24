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

        // Send response immediately after verification
        res.status(200).json({ success: true, message: "Webhook verified successfully", data, type });

        // Process webhook asynchronously using setImmediate
        setImmediate(async () => {
            if (type === "user.created") {
                console.log("Processing 'user.created' event...");
                try {
                    const user = await User.create({
                        _id: data?.id,
                        name: `${data?.first_name} ${data?.last_name}`,
                        email: data?.email_addresses[0]?.email_address,
                        imageUrl: data?.image_url,
                    });
                    console.log("User created in MongoDB:", user);
                } catch (dbError) {
                    console.error("Error creating user in MongoDB:", dbError);
                }
            } else if (type === "user.updated") {
                console.log("Processing 'user.updated' event...");
                try {
                    const user = await User.findById(data?.id);
                    if (!user) {
                        console.error("User not found for update:", data?.id);
                        return;
                    }
                    user.name = `${data?.first_name} ${data?.last_name}`;
                    user.email = data?.email_addresses[0]?.email_address;
                    user.imageUrl = data?.image_url;
                    const updatedUser = await user.save();
                    console.log("User updated in MongoDB:", updatedUser);
                } catch (dbError) {
                    console.error("Error updating user in MongoDB:", dbError);
                }
            } else if (type === "user.deleted") {
                console.log("Processing 'user.deleted' event...");
                try {
                    const deletedUser = await User.findByIdAndDelete(data?.id);
                    if (!deletedUser) {
                        console.error("User not found for deletion:", data?.id);
                        return;
                    }
                    console.log("User deleted from MongoDB:", deletedUser);
                } catch (dbError) {
                    console.error("Error deleting user from MongoDB:", dbError);
                }
            } else {
                console.log("Unhandled webhook type:", type);
            }
        });
    } catch (error) {
        console.error("Error processing webhook:", error);
        // Ensure response is sent even if an error occurs
        if (!res.headersSent) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};

export default clerkWebhook;