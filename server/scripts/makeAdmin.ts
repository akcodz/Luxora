import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

const makeAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    if (!email) throw new Error("ADMIN_EMAIL is not defined");

    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { upsert: false, returnDocument: "after" }
    );
    if (!user) throw new Error("User not found");

    await clerkClient.users.updateUserMetadata(
      user.clerkId as string,
      { publicMetadata: { role: "admin" } }
    );

    console.log(`✅ ${email} promoted to admin`);
  } catch (error: any) {
    console.error("❌ Admin promotion failed:", error.message);
  }
};

export default makeAdmin;