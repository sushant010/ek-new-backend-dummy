const express = require('express');
const multer = require('multer');
const app = express();

require('dotenv').config();

const port = 4000;

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const opportunityRoutes = require('./routes/opportunity');
const communityRoutes = require('./routes/community');
const specialServiceRoutes = require('./routes/specialService');
const adminRoutes = require('./routes/admin');
const queryRoutes = require('./routes/query');
const joinRoutes = require('./routes/join');

const mongoose = require('mongoose');
//Set up default mongoose connection

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(express.static('public'));

//app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:3000']
}));


// database configuration
const db = process.env.MONGODB;

mongoose.set('strictQuery', true);

mongoose.connect(db).then(() => {
  console.log('DB Connected');
});

//using middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/opportunity', opportunityRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/specialService', specialServiceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/join', joinRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(422).json({
      status: 'fail',
      message: `${err.message}! File size must be less than or equal to 2mb.`,
    });
  } else {
    res.status(err.statusCode || 500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Define your routes here

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
