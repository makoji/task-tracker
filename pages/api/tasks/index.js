import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../lib/mongodb';
import Task from '../../../models/Task';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await connectToDatabase();

    switch (req.method) {
      case 'GET':
        // Get all tasks for the authenticated user
        try {
          const tasks = await Task.find({ userId: session.user.id })
            .sort({ createdAt: -1 });
          
          res.status(200).json(tasks);
        } catch (error) {
          console.error('Error fetching tasks:', error);
          res.status(500).json({ message: 'Error fetching tasks' });
        }
        break;

      case 'POST':
        // Create a new task
        try {
          const { title, description, category, priority, dueDate } = req.body;

          // Validation
          if (!title || !category || !priority) {
            return res.status(400).json({ message: 'Title, category, and priority are required' });
          }

          const task = await Task.create({
            title,
            description,
            category,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            userId: session.user.id
          });

          res.status(201).json(task);
        } catch (error) {
          console.error('Error creating task:', error);
          
          if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
          }
          
          res.status(500).json({ message: 'Error creating task' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}