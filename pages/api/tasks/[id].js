import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../lib/mongodb';
import Task from '../../../models/Task';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await connectToDatabase();

    switch (req.method) {
      case 'GET':
        // Get single task
        try {
          const task = await Task.findOne({ 
            _id: id, 
            userId: session.user.id 
          });
          
          if (!task) {
            return res.status(404).json({ message: 'Task not found' });
          }
          
          res.status(200).json(task);
        } catch (error) {
          console.error('Error fetching task:', error);
          res.status(500).json({ message: 'Error fetching task' });
        }
        break;

      case 'PUT':
        // Update task
        try {
          const { title, description, category, priority, dueDate, completed } = req.body;

          const updateData = {
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(category !== undefined && { category }),
            ...(priority !== undefined && { priority }),
            ...(completed !== undefined && { completed }),
            ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
            updatedAt: new Date()
          };

          const task = await Task.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            updateData,
            { new: true, runValidators: true }
          );

          if (!task) {
            return res.status(404).json({ message: 'Task not found' });
          }

          res.status(200).json(task);
        } catch (error) {
          console.error('Error updating task:', error);
          
          if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
          }
          
          res.status(500).json({ message: 'Error updating task' });
        }
        break;

      case 'PATCH':
        // Toggle task completion
        try {
          const task = await Task.findOne({ _id: id, userId: session.user.id });
          
          if (!task) {
            return res.status(404).json({ message: 'Task not found' });
          }

          task.completed = !task.completed;
          task.updatedAt = new Date();
          await task.save();

          res.status(200).json(task);
        } catch (error) {
          console.error('Error toggling task:', error);
          res.status(500).json({ message: 'Error toggling task' });
        }
        break;

      case 'DELETE':
        // Delete task
        try {
          const task = await Task.findOneAndDelete({ 
            _id: id, 
            userId: session.user.id 
          });

          if (!task) {
            return res.status(404).json({ message: 'Task not found' });
          }

          res.status(200).json({ message: 'Task deleted successfully' });
        } catch (error) {
          console.error('Error deleting task:', error);
          res.status(500).json({ message: 'Error deleting task' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}