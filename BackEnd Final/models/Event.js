const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Event title is required.'] 
  },
  description: String,
  category: String,
  venue: String,
  date: { 
    type: Date, 
    required: [true, 'Event date is required.'] 
  },
  time: String,
  seatCapacity: { 
    type: Number, 
    required: [true, 'Seat capacity is required.'] 
  },
  bookedSeats: { 
    type: Number, 
    default: 0 
  },
  price: { 
    type: Number, 
    required: [true, 'Event price is required.'] 
  }
});

module.exports = mongoose.model('Event', EventSchema);
