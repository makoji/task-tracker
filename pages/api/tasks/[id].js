import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import connectToDatabase from '../../../lib/mongodb';
import Task from '../../../models/Task';

export default async function handler(req, res) {

  const { id } = req.query;

  try {
    // check auth
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    //  connect to mongodb
    await connectToDatabase();


    switch (req.method) {
      case 'GET':
         // get A task
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
        // update a task
        try {
          const { title, description, category, priority, dueDate, completed } = req.body;

          // check that its filled correctly
          if (title !== undefined && (!title || title.trim().length === 0)) {
            return res.status(400).json({ message: 'Task title cannot be empty' });
          }

          if (title !== undefined && title.trim().length > 100) {
            return res.status(400).json({ message: 'Task title must be less than 100 characters' });
          }

          if (description !== undefined && description && description.length > 500) {
            return res.status(400).json({ message: 'Task description must be less than 500 characters' });
          }

          if (category !== undefined) {
            const validCategories = ['Work', 'Daily', 'Shopping', 'Health', 'Education', 'Finance'];
            if (!validCategories.includes(category)) {
              return res.status(400).json({ message: 'Please select a valid category' });
            }
          }

          if (priority !== undefined) {
            const validPriorities = ['Low', 'Normal', 'High', 'Urgent'];
            if (!validPriorities.includes(priority)) {
              return res.status(400).json({ message: 'Please select a valid priority' });
            }
          }

          if (dueDate !== undefined && dueDate) {
            const date = new Date(dueDate);
            if (isNaN(date.getTime())) {
              return res.status(400).json({ message: 'Please enter a valid due date' });
            }
          }

          const updateData = {
            ...(title !== undefined && { title: title.trim() }),
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
          
          if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid task ID format' });
          }
          
          res.status(500).json({ message: 'Error updating task' });
        }
        break;


      case 'PATCH':
        ///  completion toggle 
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
          
          if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid task ID format' });
          }
          
          res.status(500).json({ message: 'Error toggling task' });
        }
        break;


      case 'DELETE':
        // delete a task
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
          
          if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid task ID format' });
          }
          
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