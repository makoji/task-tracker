import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Work', 'Daily', 'Shopping', 'Health', 'Education', 'Finance'],
    default: 'Daily'
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: ['Low', 'Normal', 'High', 'Urgent'],
    default: 'Normal'
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  }
}, {
  timestamps: true
});

//indexing
TaskSchema.index({ userId: 1, createdAt: -1 });

// delete previouslyched tm
delete mongoose.models.Task;

export default mongoose.model('Task', TaskSchema);