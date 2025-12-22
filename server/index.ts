import express from "express";
import runAlgorithmRouter from "./routes/runAlgothims"
import cors from "cors";
const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use("/api/run", runAlgorithmRouter);
app.listen(3001, ()=>{
    console.log("Server is running on port 3001");
})