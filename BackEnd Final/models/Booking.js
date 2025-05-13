const mongoose = require('mongoose');


const BookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Booking must be associated with a user.']
  },
  event: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: [true, 'Booking must be associated with an event.']
  },
  quantity: { 
    type: Number, 
    required: [true, 'Booking quantity is required.'] 
  },
  bookingDate: { 
    type: Date, 
    default: Date.now 
  },
  qrCode: String   // Optional, for bonus QR code generation
});

module.exports = mongoose.model('Booking', BookingSchema);
