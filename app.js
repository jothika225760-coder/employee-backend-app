const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware to parse incoming JSON data and enable CORS
app.use(express.json());
app.use(cors());

// Serve static frontend build files from dist/Frontend
app.use(express.static(path.join(__dirname, 'dist', 'Frontend')));

// -------------------------------------------------------------
// Database Connection
// Replace the URI string below with your actual MongoDB Atlas connection URL
// -------------------------------------------------------------
const MONGODB_URI = 'mongodb+srv://Jothika:jothika@cluster0.ktnftxi.mongodb.net/employeeDB?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// -------------------------------------------------------------
// Employee Schema and Model
// -------------------------------------------------------------
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);

// -------------------------------------------------------------
// REST API Routes
// -------------------------------------------------------------

// 1. GET - Fetch all employees
app.get('/api/employeeList', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
});

// 2. GET - Fetch a single employee by ID
app.get('/api/employeeList/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee', error: error.message });
  }
});

// 3. POST - Add a new employee
app.post('/api/employeeList', async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(400).json({ message: 'Error creating employee', error: error.message });
  }
});

// 4. PUT - Update employee information
app.put('/api/employeeList', async (req, res) => {
  try {
    const id = req.body._id || req.body.id;
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: 'Error updating employee', error: error.message });
  }
});

// 5. DELETE - Delete a single employee by ID
app.delete('/api/employeeList/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted successfully', data: deletedEmployee });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error: error.message });
  }
});

// Serve index.html for any frontend route fallback
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'Frontend', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



