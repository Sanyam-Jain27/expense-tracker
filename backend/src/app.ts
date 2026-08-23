import express  from "express";
import cors from "cors"
import clerkRouter from "./routes/routes.clerk"
import incomeRouter from "./routes/routes.income"
import expenseRouter from "./routes/routes.expense"
import transactionRouter from "./routes/routes.transaction"
const app = express();
app.use(cors({origin:"http://localhost:3000"}))
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