const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// DB connection
mongoose.connect('mongodb+srv://suryanatarajan04:fkObrY6zYDf5d1Bi@lab3.u6d2bst.mongodb.net/', {
  
});

// Student Schema
const Student = mongoose.model('Student', {
  name: String,
  email: String,
});

// Middleware
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', async (req, res) => {
  const students = await Student.find();
  res.render('index', { students });
});

app.post('/add', async (req, res) => {
  const { name, email } = req.body;
  await Student.create({ name, email });
  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render('edit', { student });
});

app.post('/update/:id', async (req, res) => {
  const { name, email } = req.body;
  await Student.findByIdAndUpdate(req.params.id, { name, email });
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
