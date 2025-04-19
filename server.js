const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS

const app = express();

// Use CORS middleware to allow requests from localhost:5174
app.use(cors({
  origin: 'http://localhost:5174', // Allow requests only from your frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json()); // To parse JSON bodies

// MongoDB connection URI from Atlas
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/test?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('MongoDB connection error:', err));
  
  // Define a UserMembership schema
  const userMembershipSchema = new mongoose.Schema({
    username: { type: String, required: true },
    plan: { type: String, default: 'Free Plan' },
  });
  
  const UserMembership = mongoose.model('UserMembership', userMembershipSchema);
  
  // API route to handle form submission
  app.post('/api/submit-form', async (req, res) => {
    const { username } = req.body;
  
    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required' });
    }
  
    const newUser = new UserMembership({
      username,
      plan: 'Free Plan',
    });
  
    try {
      await newUser.save();
      res.status(200).json({ success: true, message: 'User added successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error saving user to database' });
    }
  });
  
  // Start the server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });