import { clerkClient, getAuth } from "@clerk/express";
import { Request } from "express";
import { User } from "../models/user.model";

export const getOrCreateUser = async (req: Request) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return null;
  }

  // 1. Check if user already exists by clerkId
  let user = await User.findOne({ clerkId: userId });
  if (user) {
    return user;
  }

  // 2. Fetch user profile from Clerk
  const clerkUser = await clerkClient.users.getUser(userId);
  const email = clerkUser.primaryEmailAddress?.emailAddress;
  const firstName = clerkUser.firstName || "";
  const lastName = clerkUser.lastName || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || clerkUser.username || "User";
  const imageUrl = clerkUser.imageUrl || "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";

  // 3. Check if user exists by email (legacy or pre-existing)
  if (email) {
    user = await User.findOne({ email });
    if (user) {
      user.clerkId = userId;
      if (!user.imageUrl && imageUrl) user.imageUrl = imageUrl;
      await user.save();
      return user;
    }
  }

  // 4. Auto-provision user in MongoDB
  user = await User.create({
    clerkId: userId,
    fullname: fullName,
    email: email || undefined,
    imageUrl: imageUrl,
    expenses: [],
    incomes: [],
  });

  return user;
};

