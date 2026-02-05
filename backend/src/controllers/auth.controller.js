const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // keep in .env file outside my code

//Register User
exports.register = async (req, res) => {
    try{
        const { username, email, password, location } = req.body;

        //check if mail already exists
        const existing = await User.findOne({ where: { email } });
        if(existing){
            return res.status(400).json({ error: "Email already registered" });
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //insert the new user to the database
        const user = await User.create({ username, email, password: hashedPassword, location});

        return res.status(201).json({
            message: "User registered successfully",
            user: { id: user.id, username: user.username, email: user.email, location: user.location }
        });
    }catch(error){
        console.error('Registration error:', error);
        return res.status(500).json({ error: error.message});
    }
};

//Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ Include user object in response
    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
