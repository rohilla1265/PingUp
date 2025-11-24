import { Inngest } from 'inngest';
import Connection from '../models/connection';
import User from '../models/user'; // You need to import User model
import { connect, connection } from 'mongoose';
import nodemailer from 'nodemailer'; // Correct import for nodemailer

// Create Inngest client
export const inngest = new Inngest({
  id: "pingup-app",
  name: "PingUp Application"
});

// Create function
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data; // Fixed: email_addresses (not email_address)
    
    // Get the first email address
    const email = email_addresses[0].email_address;
    let username = email.split('@')[0];
    
    // Check if user exists and generate unique username if needed
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      username = username + Math.floor(Math.random() * 10000);
    }
    
    const userData = {
      _id: id,
      email_address: email,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
      username
    };
    
    await User.create(userData);
  }
);

// Update function
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data; // Fixed: email_addresses
    
    const email = email_addresses[0].email_address;
    const updatedUserData = {
      email_address: email,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
    };
    
    await User.findByIdAndUpdate(id, updatedUserData);
  }
);

// Deletion function
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

// Email configuration (you should configure this properly)
const transporter = nodemailer.createTransport({
  // Your email configuration here
  service: 'gmail', // or other service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendConnectionReminder = inngest.createFunction(
  { id: "send-new-connection-request-reminder" },
  { event: "app/connection-request" },
  async ({ event, step }) => {
    const { connectionId } = event.data;
    
    // Step 1: Send initial connection request email
    await step.run('send-connection-request-mail', async () => {
      const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id');
      
      if (!connection) {
        throw new Error(`Connection with ID ${connectionId} not found`);
      }
      
      const subject = "New Connection Request";
      const html = `<h1>You have a new connection request</h1>`;
      
      await transporter.sendMail({
        to: connection.to_user_id.email,
        subject,
        html
      });
    });
    
    // Step 2: Wait for 24 hours
    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil("wait-for-24-hours", in24Hours);
    
    // Step 3: Send reminder if not accepted
    await step.run("send-connection-request-reminder", async () => {
      const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id');
      
      if (!connection) {
        return { message: "Connection not found" };
      }
      
      if (connection.status === "accepted") {
        return { message: "Already accepted" };
      }
      
      const subject = "Reminder: Connection Request";
      const html = `<h1>You still have a pending connection request</h1>`;
      
      await transporter.sendMail({
        to: connection.to_user_id.email,
        subject,
        html
      });
      
      return { message: "Reminder sent successfully" };
    });
  }
);

export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
  sendConnectionReminder
];