const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
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
  robloxUsername: { type: String, required: true },
  discordId: { type: String, required: true },
  plan: { type: String, default: 'Free Plan' },
});

const UserMembership = mongoose.model('UserMembership', userMembershipSchema);

// API route to handle form submission
app.post('/api/submit-form', async (req, res) => {
  console.log('Request Body:', req.body); // Log incoming data

  const { robloxUsername, discordId } = req.body;

  if (!robloxUsername || !discordId) {
    return res.status(400).json({ success: false, message: 'Roblox Username and Discord ID are required' });
  }

  const newUser = new UserMembership({
    robloxUsername,
    discordId,
    plan: 'Free Plan', // Default plan
  });

  try {
    await newUser.save();
    res.status(200).json({ success: true, message: 'User added successfully' });
  } catch (error) {
    console.error('Error saving user to database:', error);
    res.status(500).json({ success: false, message: 'Error saving user to database' });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
