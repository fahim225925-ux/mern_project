import express from 'express';
import EventRegistry from '../models/EventRegistry.js';

const router = express.Router();

// 1. Fetch all events (Dashboard list)
router.get('/', async (req, res) => {
  try {
    const list = await EventRegistry.find().sort({ scheduledDate: 1 });
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Fetch single event by ID (For editing)
router.get('/:id', async (req, res) => {
  try {
    const item = await EventRegistry.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Create a new event
router.post('/', async (req, res) => {
  try {
    const { title, summary, scheduledDate, location, attendeeCount } = req.body;
    const createdEvent = new EventRegistry({
      title,
      summary,
      scheduledDate,
      location,
      attendeeCount: attendeeCount ? Number(attendeeCount) : 0
    });
    const saved = await createdEvent.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 4. Update an existing event
router.put('/:id', async (req, res) => {
  try {
    const updated = await EventRegistry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 5. Delete an event
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await EventRegistry.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'Event removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;