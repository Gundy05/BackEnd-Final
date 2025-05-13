const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const { verifyToken } = require('../middleware/auth');
const { sendBookingConfirmation } = require('../utils/mailer');
const User = require('../models/User');


router.post('/', verifyToken, async (req, res) => {
  try {
    const { event: eventId, quantity } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    
    if (event.bookedSeats + quantity > event.seatCapacity) {
      return res.status(400).json({ error: 'Not enough available seats.' });
    }

    let booking = new Booking({
      user: req.user.id,
      event: eventId,
      quantity
    });
    booking = await booking.save(); 

    // Generate QR code as before
    const qrContent = `BookingID:${booking._id}`;
    QRCode.toDataURL(qrContent, async (err, url) => {
      if (!err) {
        booking.qrCode = url;
        await booking.save();
      } else {
        console.error('QR Code generation error:', err);
      }
      event.bookedSeats += quantity;
      await event.save();
      
      // Retrieve user email from the User collection
      const user = await User.findById(req.user.id);
      
      // Send booking confirmation email
      if (user && user.email) {
        await sendBookingConfirmation(user.email, {
          event: event,
          quantity: booking.quantity,
          bookingDate: booking.bookingDate,
          qrCode: booking.qrCode
        });
      }
      
      res.status(201).json(booking);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
