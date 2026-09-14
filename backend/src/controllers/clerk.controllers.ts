import { Request, Response } from "express";
import { User } from "../models/user.model";

const clerkWebhook = async (req: Request, res: Response) => {
    try {
        console.log("🔥 CONTROLLER REACHED");
        // return res.status(200).send("lets go you can do it ")

        const { type: eventType, data } = req.body;

        console.log("Event type:", eventType);

        if (!data) {
            return res.status(400).json({
                message: "No data received from Clerk"
            });
        }

        const clerkId = data.id;

        const firstName = data.first_name || "";
        const lastName = data.last_name || "";
        const imageUrl = data.image_url || "";

        const fullName = [firstName, lastName]
            .filter(Boolean)
            .join(" ");
            
        console.log(fullName)
    //     // Email may not exist in Clerk's sample payload
        const email =
            data.email_addresses?.[0]?.email_address || null;

        console.log("Extracted data:", {
            clerkId,
            fullName,
            email,
            imageUrl
        });

        switch (eventType) {
            case "user.created": {
                if (!clerkId) {
                    return res.status(400).json({
                        message: "Clerk user ID is missing"
                    });
                }

                let existingUser = await User.findOne({ clerkId });
                if (!existingUser && email) {
                    existingUser = await User.findOne({ email });
                }

                if (existingUser) {
                    existingUser.clerkId = clerkId;
                    if (fullName) existingUser.fullname = fullName;
                    if (imageUrl) existingUser.imageUrl = imageUrl;
                    await existingUser.save();
                    return res.status(200).json({
                        message: "User updated with Clerk ID"
                    });
                }

                const user = await User.create({
                    clerkId,
                    fullname: fullName || "User",
                    email: email || undefined,
                    imageUrl: imageUrl || undefined,
                    expenses: [],
                    incomes: []
                });

                console.log("✅ MongoDB user created:", user._id);
                return res.status(201).json({
                    message: "User created successfully"
                });
            }

            case "user.updated": {
                if (clerkId) {
                    await User.findOneAndUpdate(
                        { clerkId },
                        {
                            ...(fullName && { fullname: fullName }),
                            ...(email && { email }),
                            ...(imageUrl && { imageUrl }),
                        }
                    );
                }
                return res.status(200).json({ message: "User updated" });
            }

            case "user.deleted": {
                if (clerkId) {
                    await User.findOneAndDelete({ clerkId });
                }
                return res.status(200).json({ message: "User deleted" });
            }

            default:
                return res.status(200).json({
                    message: `Event ${eventType} received`
                });
        }

    }catch(error) {

        console.error("❌ CONTROLLER ERROR:");
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export { clerkWebhook };