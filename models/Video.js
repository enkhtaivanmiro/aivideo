import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  videoKey: { type: String, required: true, unique: true },
  title: String,
  userId: String,
  createdAt: { type: Date, default: Date.now },
  reviewLabel: {
    type: String,
    enum: ['Rejected', 'Accepted', 'In Review'],
    default: 'In Review',
  },
});

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);
