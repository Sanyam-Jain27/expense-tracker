import express  from "express";
import cors from "cors"
import clerkRouter from "./routes/routes.clerk"
import incomeRouter from "./routes/routes.income"
import expenseRouter from "./routes/routes.expense"
import transactionRouter from "./routes/routes.transaction"
const app = express();
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    if (
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:") ||
      origin.includes("vercel.app") ||
      origin === "https://expense-tracker-frontend-tau-three.vercel.app"
    ) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev to prevent CORS blockage
  },
  credentials: true,
}))
app.use(
    express.json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    })
  );
app.get("/",(req,res)=>{
    console.log("backend is working")
    res.status(200).send("backend is working")
})

app.use("/api/clerk",clerkRouter)
app.use("/api/income",incomeRouter)
app.use("/api/expense",expenseRouter)
app.use("/api/transaction",transactionRouter)
export default app;