import { NextFunction, Request, Response } from "express";
import { Webhook } from "svix";

const verifyClerkWebhook = async (
    req: Request, 
    res: Response,
    next: NextFunction
) => {
    console.log("========== CLERK WEBHOOK ==========");

    console.log("Body:", req.body);
    console.log(
        "Raw body exists:",
        !!(req as any).rawBody
    );
    // 1. Check for casing mismatch in env key ('CLERK' is usually all uppercase)
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET 
    console.log(
        "Webhook secret exists:",
        !!WEBHOOK_SECRET
    );
    if (!WEBHOOK_SECRET) {
        console.error("❌ CLERK_WEBHOOK_SECRET is missing from .env file");
        return res.status(500).json({ message: "please provide webhook secret in env" });
    }

    // 2. FIX: Use hyphens instead of underscores, and singular 'timestamp'
    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];
    console.log(`this is svix thing : svix id : ${svix_id},\nsvix timestamps${svix_timestamp},\n svix_sign: ${svix_signature}`)
    // Validate headers exist cleanly
    if (!svix_id || !svix_signature || !svix_timestamp) {
        console.error("❌ Missing required Svix headers from Clerk payload");
        return res.status(400).json({ message: "error occurred - no svix headers found" });
    }

    // // 3. FIX: Structure the validation payload using standard Svix object keys
    const svixHeaders = {
        "svix-id": svix_id as string,
        "svix-timestamp": svix_timestamp as string,
        "svix-signature": svix_signature as string,
    };


    const payload = (req as any).rawBody.toString("utf8"); ;
    console.log(`\n this is payload ${payload}`)
    if (!payload) {
        return res.status(400).json({
            message: "Raw body missing"
        });
    }
    const wh = new Webhook(WEBHOOK_SECRET);
    if (!wh) {
        console.log("wh not exist")
    }

    try {
        const evt = wh.verify(payload, svixHeaders);
        console.log("\n\nVerified event object:", evt);
        console.log("✅ Clerk webhook signature verified1213");
        // Pass control safely to your database controller
        next();
    } catch (error: any) {
        console.error("❌ Webhook Signature Matching Failed:", error.message);
        return res.status(401).json({ message: "webhook secret is not matched" });
    }
};

export { verifyClerkWebhook };






// import { NextFunction,Request,Response } from "express";
// import { Webhook } from "svix";

// const verifyClerkWebhook = async (
//    req:Request, 
//    res:Response,
    
//     next:NextFunction
// )=>{
//     const WEBHOOK_SECRET = process.env.ClERK_WEBHOOK_SECRET;
//     if(!WEBHOOK_SECRET){
//         return res.status(500).json({message:"please provide webhook secret in env"})
//     }
//     const svix_id = (req.headers["svix_id"]||"").toString();
//     const svix_timestamps = (req.headers["svix_timestamps"]||"").toString();
//     const svix_signature = (req.headers["svix_signature"]||"").toString();
//     if(!svix_id||!svix_signature||!svix_timestamps){
//         return res.status(400).json({message:"error occured - no svx header"})
//     }
//     const headers = {
//         "svix_id":svix_id,
//         "svix_timestamps":svix_timestamps,
//         "svix_signature":svix_signature,
//     }
//     const payload = JSON.stringify(req.body);
//     const wh=new Webhook(WEBHOOK_SECRET);
//     try{
//         await wh.verify(payload,headers)
//         next();
//     }
//     catch(error){
//         return res.status(500).json({message:"webhook secret is not matched"})
//     }
// }
// export {verifyClerkWebhook}






// const verifyClerkWebhook = (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {   
//     console.log("🔥🔥🔥 MIDDLEWARE STARTED");
//     console.log("Headers received:");
//     console.log(req.headers);
//     console.log("Raw body exists:", !!(req as any).rawBody);
//     console.log("🔥🔥🔥 ABOUT TO CALL NEXT");
//     next();
//     console.log("🔥🔥🔥 NEXT() CALLED");
// };
// export { verifyClerkWebhook };




