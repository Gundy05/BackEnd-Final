const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { verifyToken, isAdmin } = require('../middleware/auth');

// GET /api/events - Return all events or filter by category/date
router.get('/', async (req, res) => {
  try {
    const { category, date } = req.query;
    let query = {};
    
    if (category) {
      query.category = category;
    }
    if (date) {
      // Convert YYYY-MM-DD into start and end of that day
      const selectedDate = new Date(date);
      query.date = {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999))
      };
    }
    
    const events = await Event.find(query);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/events/:id - Return a single event's details
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/events - Create a new event (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/events/:id - Update an event (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const currentEvent = await Event.findById(req.params.id);
    if (!currentEvent) return res.status(404).json({ error: 'Event not found.' });
    
    // Do not allow updating seatCapacity below bookedSeats
    if (req.body.seatCapacity && req.body.seatCapacity < currentEvent.bookedSeats) {
      return res.status(400).json({ error: 'Seat capacity cannot be less than booked seats.' });
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/events/:id - Delete an event (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    // You might also check for any associated bookings before deletion
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully', event: deletedEvent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
