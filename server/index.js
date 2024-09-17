import express from "express"
import cors from "cors"
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import path from 'path';

import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactsRoute.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";


dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors({
  origin: process.env.ORIGIN,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}))
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/messages', messagesRoutes);

// must add path
const __dirname = path.resolve();
app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads/profiles')))



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.taokb31.mongodb.net/chat-app?retryWrites=true&w=majority&appName=Cluster0`;

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    // await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoose.disconnect();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('chat app is running')
});
const server = app.listen(port, () => {
  console.log(`chat app is running on port : ${port}`);
})
setupSocket(server);