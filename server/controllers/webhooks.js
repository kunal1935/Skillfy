import { Webhook } from "svix";
import User from "../models/User.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
import event from "events";
import { response } from "express";
dotenv.config();

const clerkWebhook = async (req, res) => {
  try {
    console.log("Webhook received:", req.body);

    // Check if MongoDB connection is ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB connection is not established");
    }

    // Initialize the webhook verifier
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Extract and verify headers
    const payload = JSON.stringify(req.body);
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-signature": req.headers["svix-signature"],
      "svix-timestamp": req.headers["svix-timestamp"],
    };

    if (
      !headers["svix-id"] ||
      !headers["svix-signature"] ||
      !headers["svix-timestamp"]
    ) {
      throw new Error("Missing required svix headers");
    }

    await whook.verify(payload, headers);
    console.log("Webhook verified successfully");

    // Extract event data
    const { data, type } = req.body;
    const normalizedType = type?.toLowerCase();
    console.log("Webhook type:", normalizedType);
    console.log("Webhook data:", data);

    // Send response immediately
    res
      .status(200)
      .json({ success: true, message: "Webhook verified successfully" });

    // Use Promise.resolve() for async operations
    Promise.resolve().then(async () => {
      try {
        switch (normalizedType) {
          case "user.created":
            console.log("Processing 'user.created' event...");
            const user = await User.create({
              _id: data?.id,
              name: `${data?.first_name} ${data?.last_name}`,
              email: data?.email_addresses[0]?.email_address,
              imageurl: data?.image_url,
            });
            const userToUpdate = await User.findById(data?.id);
            if (userToUpdate) {
              userToUpdate.name = `${data?.first_name} ${data?.last_name}`;
              userToUpdate.email = data?.email_addresses[0]?.email_address;
              userToUpdate.imageUrl = data?.image_url;
              await userToUpdate.save();
              console.log("User updated in MongoDB:", userToUpdate);
            } else {
              console.error("User not found for update:", data?.id);
            }
            break;

          case "user.deleted":
            console.log("Processing 'user.deleted' event...");
            const deletedUser = await User.findByIdAndDelete(data?.id);
            if (deletedUser) {
              console.log("User deleted from MongoDB:", deletedUser);
            } else {
              console.error("User not found for deletion:", data?.id);
            }
            break;

          default:
            console.log("Unhandled webhook type:", normalizedType);
            break;
        }
      } catch (error) {
        console.error("Error processing webhook asynchronously:", error);
      }
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    if (!res.headersSent) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
export const stripeWebhooks = async (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    // Construct the Stripe event
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Error verifying Stripe webhook:", error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Ensure the event object is valid before proceeding
  if (!event || !event.type) {
    console.error("Invalid Stripe event object");
    return response.status(400).send("Invalid event object");
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId);
      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(purchaseData.courseId.toString());

      courseData.enrolledStudents.push(userData);
      await courseData.save();

      userData.enrolledCourses.push(courseData._id);
      await userData.save();

      purchaseData.status = "completed";
      await purchaseData.save();

      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId);
      purchaseData.status = "failed";
      await purchaseData.save();

      break;
    }

    // Handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.json({ received: true });
};

export default clerkWebhook;
