
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const nodemailer = require('nodemailer');
const usersRoutes = require('./routes/users');
const chatbot = require('./routes/chatbot');
const borrow = require('./routes/borrow');
const inventory = require('./routes/inventory');
const events = require('./routes/events');
const notifications = require('./routes/notifications');
const dashboard = require('./routes/dashboard');
const reports = require('./routes/reports');
const maintenanceReports  = require('./routes/maintenance-reports')
const cors = require('cors');
require('dotenv').config();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    } 
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/users', usersRoutes);
app.use('/api/chatbot', chatbot);
app.use('/api/borrow-items',borrow );
app.use('/api/inventory', inventory);
app.use('/api/events', events);
app.use('/api/notifications', notifications);
app.use('/api/dashboard', dashboard);
app.use('/api/reports', reports);
app.use('/api/maintenance-reports', maintenanceReports);

app.post('/send-email', async (req, res) => {
  const { to, cc, bcc, subject, message, html } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: '"Ticketing System" <goldenpaper777@gmail.com>',
      to: Array.isArray(to) ? to.join(', ') : to,
      cc: Array.isArray(cc) ? cc.join(', ') : cc,
      bcc: Array.isArray(bcc) ? bcc.join(', ') : bcc,
      subject,
      text: message || (html ? html.replace(/<[^>]+>/g, '') : ''),
      html: html || message || '',
    });

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ message: 'Email failed to send.', error: error.message });
  }
});

const { checkUpcomingEvents } = require('./utils/checkEvent');
// setInterval(() => checkUpcomingEvents(io), 60 * 60 * 1000);
setInterval(() => checkUpcomingEvents(io), 10 * 1000);


const port = process.env.PORT || 3000;
server.listen(port, "0.0.0.0", () => {
  console.log(`Server is listening on http://0.0.0.0:${port}`);
});

io.on('connection', (socket) => {
    // console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        // console.log('User disconnected:', socket.id);
    });
});
