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

                if (!fullName) {
                    return res.status(400).json({
                        message: "User name is missing"
                    });
                }

    //             // Check user using Clerk ID
                const existingUser = await User.findOne({
                    clerkId
                });

                if (existingUser) {
                    return res.status(200).json({
                        message: "User already exists"
                    });
                }

                const user = await User.create({
                    fullname: fullName,
                    email: email || undefined,
                    imageUrl: imageUrl || undefined
                });

                console.log(
                    "✅ MongoDB user created:",
                    user._id
                );

    //             return res.status(200).json({
    //                 message: "User created successfully"
    //             });
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