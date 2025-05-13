const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/auth');

// GET /api/admin/dashboard
router.get('/dashboard', verifyToken, isAdmin, async (req, res) => {
  try {
    // Aggregate events with associated booking and user info
    const dashboardData = await Event.aggregate([
      {
        $lookup: {
          from: 'bookings', // collection name in MongoDB
          localField: '_id',
          foreignField: 'event',
          as: 'bookings'
        }
      },
      {
        $lookup: {
          from: 'users', // collection name from the User model
          let: { bookingUserIds: '$bookings.user' },
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$bookingUserIds'] } } },
            { $project: { password: 0 } } // Optionally remove sensitive data
          ],
          as: 'users'
        }
      }
    ]);
    
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
