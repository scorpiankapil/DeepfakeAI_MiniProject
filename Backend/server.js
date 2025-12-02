// Example of how your main backend file should look (assuming server.js)
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); 
const corsOptions = {
    // CHANGE THIS PORT from 3000 to 8080
    origin: 'http://localhost:8080', 
    
    // ... (rest of the configuration)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,x-auth-token', 
};

const authRoutes = require('./routes/auth'); // Import the new routes
const analysisRoutes = require('./routes/analysis');

const app = express();


// --- Database Connection ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // You may need to remove deprecated options like useCreateIndex: true
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

connectDB();
app.use(cors(corsOptions));

// --- Middleware ---
// 1. Body Parser (to accept JSON data)
app.use(express.json({ extended: false })); 

// 2. Define the Auth Route endpoint
app.use('/api/auth', authRoutes);

// 3. Define the Deepfake Analysis endpoint
app.use('/api/analysis', analysisRoutes);

// --- Simple Root Route (for testing) ---
app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));