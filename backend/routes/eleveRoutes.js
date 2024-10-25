const express = require('express')
const router = express.Router()

const eleveCtrl = require('../controllers/eleve')

router.get('/', eleveCtrl.getAllEleve)
router.get('/:id', eleveCtrl.getOneEleve)
router.post('/', eleveCtrl.createEleve)
router.put('/:id', eleveCtrl.modifyEleve)
router.delete('/:id', eleveCtrl.deleteEleve)

router.post('/:id/courses', eleveCtrl.addCourse);
router.get('/:id/courses', eleveCtrl.getCourses);
router.put('/:id/courses/:courseId', eleveCtrl.updateCourse);
router.delete('/:id/courses/:courseId', eleveCtrl.deleteCourse);
router.delete('/:id/courses/:courseId?action=cancel', eleveCtrl.deleteCourse)



module.exports = router
