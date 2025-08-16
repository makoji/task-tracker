import bcrypt from 'bcryptjs';
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';


export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });

  }


  try {

    const { name, email, password } = req.body;

    // check if fields are all filled
    if (!name || !email || !password) {

      return res.status(400).json({ message: 'All fields are required' });

    }

    // pw length 
    if (password.length < 6) {

      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    }


    await connectToDatabase();


    // check if the email isnt already in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {

      return res.status(400).json({ message: 'User already exists with this email' });

    }

    // hash the pw
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    // add the new user
    const user = await User.create({

      name,
      email,
      password: hashedPassword

    });


    // return user without password
    const { password: _, ...userWithoutPassword } = user.toObject();

    
    // success message for logging
    res.status(201).json({

      message: 'User created successfully',
      user: userWithoutPassword

    });

  } catch (error) {
    
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    res.status(500).json({ message: 'Internal server error' });
    
  }
}