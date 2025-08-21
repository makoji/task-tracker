import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import connectToDatabase from '../../../lib/mongodb';
import Task from '../../../models/Task';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  try {
    // check auth
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // check user ID format
    console.log('Session user ID:', session.user.id, 'Type:', typeof session.user.id);

    // Validate user ID format
    if (!session.user.id || !mongoose.Types.ObjectId.isValid(session.user.id)) {
      console.error('Invalid user ID format:', session.user.id);
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // connect to mongoDB
    await connectToDatabase();



    switch (req.method) {

      case 'GET':
        //  get the existing tasks for the logged in user
        try {
          const tasks = await Task.find({ userId: session.user.id })
            .sort({ createdAt: -1 });
          
          console.log('📋 Found tasks:', tasks.length);
          res.status(200).json(tasks);
        } catch (error) {
          console.error('Error fetching tasks:', error);
          res.status(500).json({ message: `Error fetching tasks: ${error.message}` });
        }
        break;


      case 'POST':
        // add a bew task
        try {
          const { title, description, category, priority, dueDate } = req.body;

          // log incoming data  (debugging)
          console.log('Creating task for user:', session.user.id);
          console.log('Task data:', { title, category, priority });

          // validate whether the info submitted is valid
          if (!title || title.trim().length === 0) {
            return res.status(400).json({ message: 'Task title is required' });
          }

          if (title.trim().length > 100) {
            return res.status(400).json({ message: 'Task title must be less than 100 characters' });
          }

          if (description && description.length > 500) {
            return res.status(400).json({ message: 'Task description must be less than 500 characters' });
          }

          const validCategories = ['Work', 'Daily', 'Shopping', 'Health', 'School', 'Finance', 'Friends', 'Family'];
          if (!category || !validCategories.includes(category)) {
            return res.status(400).json({ message: 'Please select a valid category' });
          }

          const validPriorities = ['Low', 'Normal', 'High', 'Urgent'];
          if (!priority || !validPriorities.includes(priority)) {
            return res.status(400).json({ message: 'Please select a valid priority' });
          }

          if (dueDate) {
            const date = new Date(dueDate);
            if (isNaN(date.getTime())) {
              return res.status(400).json({ message: 'Please enter a valid due date' });
            }
          }

          const task = await Task.create({
            title: title.trim(),
            description: description || '',
            category,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            userId: session.user.id
          });


          console.log('Task created successfully:', task._id); // more logging
          res.status(201).json(task);
        } catch (error) {
          console.error('Error creating task:', error);
          
          if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
          }
          
          if (error.name === 'CastError') {
            return res.status(400).json({ message: `Invalid data format: ${error.message}` });
          }
          
          res.status(500).json({ message: `Error creating task: ${error.message}` });
        }
        break;


      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
        
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
}