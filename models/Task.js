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
    enum: ['daily', 'personal', 'shopping', 'health', 'school', 'finance', 'family', 'pets'],
    default: 'personal'

  },

  priority: {

    type: String,
    required: [true, 'Priority is required'],
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'

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

// indexes
TaskSchema.index({ userId: 1, createdAt: -1 });
TaskSchema.index({ userId: 1, category: 1 });
TaskSchema.index({ userId: 1, priority: 1 });
TaskSchema.index({ userId: 1, completed: 1 });

// makes sure it doesnt get needlesly re-compiled mid dev
export default mongoose.models.Task || mongoose.model('Task', TaskSchema);