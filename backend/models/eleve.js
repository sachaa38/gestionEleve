const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String },
  start: { type: Date },
  end: { type: Date },
  completed: { type: Boolean, default: false },
})

const eleveSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  remainingClasses: { type: Number, required: true },
  completedClasses: { type: Number, default: 0 },
  canceledClasses: { type: Number, default: 0 },
  scheduledClasses: { type: Number, default: 0 },
  plannedCourses: [courseSchema], // Ajout du tableau des cours planifiés
})

module.exports = mongoose.model('Eleve', eleveSchema)
