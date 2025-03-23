import { Webhook } from "svix";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const clerkWebhook = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-signature": req.headers["svix-signature"],
            "svix-timestamp": req.headers["svix-timestamp"],
        });

        const { data, type } = req.body;

        switch (type) {
            case 'user.created': {
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
                break;
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

export default clerkWebhook;