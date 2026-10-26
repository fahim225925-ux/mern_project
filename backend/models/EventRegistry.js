import mongoose from 'mongoose';

const EventRegistrySchema = new mongoose.Schema(
  {
    eventCode: {
      type: String,
      unique: true,
      trim: true,
      default: () => `EVT-${Math.floor(1000 + Math.random() * 9000)}`
    },
    title: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true
    },
    summary: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Event date is required']
    },
    location: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true
    },
    attendeeCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model('EventRegistry', EventRegistrySchema);