// utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can also use other providers like Outlook or SMTP details
  auth: {
    user: process.env.EMAIL_USER,       // Your email address (set in .env)
    pass: process.env.EMAIL_PASSWORD    // Your email password or app-specific password
  }
});

const sendBookingConfirmation = async (email, bookingData) => {
  // Customize your email message
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Booking Confirmation',
    html: `
      <h1>Booking Confirmation</h1>
      <p>Thank you for booking with us!</p>
      <p><strong>Event:</strong> ${bookingData.event.title}</p>
      <p><strong>Quantity:</strong> ${bookingData.quantity}</p>
      <p><strong>Booking Date:</strong> ${new Date(bookingData.bookingDate).toLocaleString()}</p>
      ${bookingData.qrCode ? `<p>Your QR Code: <br/><img src="${bookingData.qrCode}" alt="QR Code"/></p>` : ''}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent to', email);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendBookingConfirmation };
