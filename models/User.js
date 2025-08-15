import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({


  name: {

    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']

  },


  email: {

    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']

  },


  password: {

    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // doesnt include pw in the query; should be a bit more secure this way?

  },


  createdAt: {

    type: Date,
    default: Date.now

  },

  updatedAt: {

    type: Date,
    default: Date.now

  }
  
}, {
  timestamps: true
});

// to avoid re-compiling mid dev, same as in Task.js
export default mongoose.models.User || mongoose.model('User', UserSchema);