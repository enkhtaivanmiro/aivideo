import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String },
  videoKey: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  reviewLabel: { 
    type: String, 
    required: true, 
    enum: ['Rejected', 'Accepted', 'In Review'], 
    default: 'In Review' 
  },
});

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);
