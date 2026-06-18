import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import voiceRoute from "./routes/voiceRoute.js";

// app.use("/api/voice", voiceRoute);

//app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middlewares
app.use(cors());
app.use(express.json());

// api end points
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user',userRouter )
app.use("/api/voice", voiceRoute);

app.get('/',(req,res)=>{
     res.send('API woroking ')
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})