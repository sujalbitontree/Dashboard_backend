// 1. External Imports
import express from 'express'; 
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/v1/auth',userRoutes)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});