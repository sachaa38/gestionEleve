const Eleve = require('../models/eleve')
const mongoose = require('mongoose')

// Dans le fichier controllers/eleve.js
exports.addCourse = async (req, res) => {
  const { title, start, end } = req.body

  try {
    const eleve = await Eleve.findById(req.params.id)
    if (!eleve) return res.status(404).json({ message: 'Élève non trouvé' })

    const newCourse = { title, start, end }
    eleve.plannedCourses.push(newCourse)

    eleve.remainingClasses -= 1
    eleve.scheduledClasses += 1

    await eleve.save()
    res.status(201).json(newCourse)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Récupérer les cours d'un élève
exports.getCourses = async (req, res) => {
  try {
    const eleve = await Eleve.findById(req.params.id)
    if (!eleve) return res.status(404).json({ message: 'Élève non trouvé' })

    res.json(eleve.plannedCourses)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Modifier un cours
exports.updateCourse = async (req, res) => {
  const { title, start, end, completed } = req.body

  try {
    const eleve = await Eleve.findById(req.params.id)
    if (!eleve) return res.status(404).json({ message: 'Élève non trouvé' })

    const course = eleve.plannedCourses.id(req.params.courseId)
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' })

    course.title = title || course.title
    course.start = start || course.start
    course.end = end || course.end

    if (completed) {
      course.completed = true
      eleve.completedClasses += 1
    }

    await eleve.save()
    res.json(course)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Supprimer un cours
exports.deleteCourse = async (req, res) => {
  try {
    const eleve = await Eleve.findById(req.params.id)
    if (!eleve) return res.status(404).json({ message: 'Élève non trouvé' })

    const course = eleve.plannedCourses.id(req.params.courseId)
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' })

    eleve.plannedCourses.pull(req.params.courseId)

    if (req.query.action === 'cancel') {
      eleve.remainingClasses += 1
      eleve.scheduledClasses -= 1
    } else {
      eleve.scheduledClasses -= 1
    }

    await eleve.save()

    res.json({ message: 'Cours supprimé' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.createEleve = async (req, res) => {
  try {
    const newEleve = new Eleve(req.body)
    await newEleve.save()
    res.status(201).json(newEleve)
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'élève :", error) // Log de l'erreur
    res.status(400).json({ error: error.message })
  }
}

exports.getOneEleve = async (req, res) => {
  Eleve.findOne({ _id: req.params.id })
    .then((eleve) => res.status(200).json(eleve))
    .catch((error) => res.status(404).json({ error }))
}

exports.modifyEleve = async (req, res, next) => {
  try {
    const eleve = await Eleve.findOne({ _id: req.params.id })

    if (!eleve) {
      return res.status(404).json({ message: 'Élève non trouvé' })
    }

    // Utiliser req.body.remainingClasses pour seulement ajouter la nouvelle valeur
    const newRemainingClasses =
      eleve.remainingClasses + Number(req.body.remainingClasses)

    await Eleve.updateOne(
      { _id: req.params.id },
      { $set: { remainingClasses: newRemainingClasses } }
    )

    res.status(200).json({ message: 'Élève modifié avec succès !' })
  } catch (error) {
    res.status(400).json({ error })
  }
}

exports.deleteEleve = async (req, res) => {
  try {
    const { id } = req.params
    console.log('ID reçu pour suppression:', id)

    const result = await Eleve.findByIdAndDelete(
      new mongoose.Types.ObjectId(id)
    ) // Convertir en ObjectId
    console.log('ID reçu pour suppression:', id)

    if (!result) {
      return res.status(404).json({ message: 'Élève non trouvé.' })
    }
    res.status(200).json({ message: 'Élève supprimé avec succès.' })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'élève." })
  }
}

exports.getAllEleve = async (req, res) => {
  try {
    const eleves = await Eleve.find()
    res.status(200).json(eleves)
  } catch (error) {
    res.status(400).json({ error })
  }
}
