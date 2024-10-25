/* eslint-disable react/react-in-jsx-scope */
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './style.scss'
import { Calendar } from 'primereact/calendar'
import { InputText } from 'primereact/inputtext'

function Eleve() {
  const { id } = useParams()
  const navigate = useNavigate() // Pour rediriger après suppression
  const [showModal, setShowModal] = useState(false) // État pour gérer l'ouverture de la modal
  const [newClasses, setNewClasses] = useState(0) // État pour gérer le nombre de cours ajoutés
  const [planModal, setPlanModal] = useState(false)
  const [datetime24h, setDateTime24h] = useState('')
  const [value, setValue] = useState('')
  const [plannedCourses, setPlannedCourses] = useState([])
  const [student, setStudent] = useState([])

  // AFFICHER ELEVE

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/eleve/${id}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(
            "Une erreur s'est produite lors de la récupération des données.",
          )
        }

        const data = await response.json()
        console.log('Données récupérées :', data)
        setStudent(data) // Stockage des données dans l'état
      } catch (error) {
        console.error('Une erreur est survenue', error)
      }
    }

    fetchData()
  }, [showModal, planModal, plannedCourses])

  // SUPPRIMER ELEVE

  const handleDelete = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`http://localhost:3000/api/eleve/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(
          "Une erreur s'est produite lors de la suppression de l'étudiant.",
        )
      }

      alert('Étudiant supprimé avec succès !')
      navigate('/') // Redirection après suppression
    } catch (error) {
      console.error('Erreur lors de la suppression :', error)
      alert("Erreur lors de la suppression de l'étudiant.")
    }
  }

  const handleAddCours = () => {
    setShowModal(!showModal)
    setNewClasses(0)
  }

  // ACHETER DES COURS

  const handleSubmit = async (e) => {
    e.preventDefault()

    const updatedRemainingClasses = newClasses

    try {
      const response = await fetch(`http://localhost:3000/api/eleve/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ remainingClasses: updatedRemainingClasses }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du cours.")
      }

      const data = await response.json()
      console.log('Cours ajoutés avec succès : ', data)
      setShowModal(!showModal)
      newClasses(0)

      //handleCloseModal()
    } catch (error) {
      console.error('Erreur : ', error)
    }
  }

  const handleScheduleCours = () => {
    setPlanModal(!planModal)
  }

  // AJOUTER UN COURS

  const handleValidateCours = async (e) => {
    e.preventDefault()

    const courseData = {
      title: value,
      start: datetime24h,
      end: datetime24h,
    }
    try {
      const response = await fetch(
        `http://localhost:3000/api/eleve/${id}/courses`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(courseData),
        },
      )

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du cours.")
      }

      const data = await response.json()
      console.log('Cours ajoutés avec succès : ', data)

      // Fermer la modal après succès
      setPlanModal(!planModal)
      fetchCourses()
    } catch (error) {
      console.error('Erreur : ', error)
    }
  }
  // AFFICHER LES COURS
  const fetchCourses = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/eleve/${id}/courses`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )

      if (!response.ok) {
        throw new Error('Erreur lors de la recupération des cours.')
      }

      const data = await response.json()
      console.log('Cours récupérés avec succès : ', data)
      setPlannedCourses(data)
    } catch (error) {
      console.error('Erreur : ', error)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  // SUPPRIMER COURS

  const handleDeleteCours = async (coursId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/eleve/${id}/courses/${coursId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erreur lors de la suppression :', errorData.message)
        throw new Error(`Erreur: ${errorData.message}`)
      }

      setPlannedCourses((prevCourses) =>
        prevCourses.filter((cours) => cours._id !== coursId),
      )

      console.log('Cours supprimé avec succès')
    } catch (error) {
      console.error('Erreur lors de la suppression :', error)
    }
  }

  // ANNULER COURS

  const handleCanceledCours = async (coursId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/eleve/${id}/courses/${coursId}?action=cancel`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erreur lors de la suppression :', errorData.message)
        throw new Error(`Erreur: ${errorData.message}`)
      }

      setPlannedCourses((prevCourses) =>
        prevCourses.filter((cours) => cours._id !== coursId),
      )

      console.log('Cours supprimé avec succès')
    } catch (error) {
      console.error('Erreur lors de la suppression :', error)
    }
  }

  const handleDoneCours = async (coursId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/eleve/${id}/courses/${coursId}`,
        {
          method: 'PUT', // Utilisez PATCH ou PUT selon vos besoins
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ completed: true }), // Indiquez que le cours est complété
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erreur lors de la mise à jour :', errorData.message)
        throw new Error(`Erreur: ${errorData.message}`)
      }

      setPlannedCourses((prevCourses) =>
        prevCourses.map(
          (cours) =>
            cours._id === coursId ? { ...cours, completed: true } : cours, // Met à jour le cours dans l'état
        ),
      )

      console.log('Cours marqué comme complété avec succès')
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error)
    }
  }

  return (
    <div className="pageEleveContainer">
      <div className="divHeaderEleve">
        <div className="eleveName">
          <h1>{student.firstName}</h1>
          <h2>{student.lastName}</h2>
        </div>
        <div className="navButton">
          <button onClick={handleDelete}>Supprimer élève</button>
          <button onClick={handleAddCours}>Ajouter cours payés</button>
          <button onClick={handleScheduleCours}>Planifier cours</button>
        </div>
      </div>
      <div className="divClasseEtPlanning">
        <div className="divClassesInfo">
          <div
            className={`eleveCoursDetail ${student.remainingClasses <= 0 ? 'empty' : ''}`}
          >
            <p>Cours achetés restant</p> <span>{student.remainingClasses}</span>
          </div>
          <div className="eleveCoursDetail">
            <p>Cours planifiés</p> <span>{student.scheduledClasses}</span>
          </div>
          <div className="eleveCoursDetail">
            <p>Cours faits</p> <span>{student.completedClasses}</span>
          </div>
          <div className="eleveCoursDetail">
            <p>Cours supprimés</p> <span>{student.canceledClasses}</span>
          </div>
        </div>
        <div className="coursPlanned">
          <h2>Prochains cours</h2>
          {plannedCourses.map((cours) => (
            <div
              key={cours._id}
              className={`divTitleAndDate ${cours.completed ? 'completed' : ''}`}
            >
              <p>{cours.title}</p>
              <span>{cours.start}</span>
              <button onClick={() => handleDeleteCours(cours._id)}>X</button>
              {!cours.completed && (
                <button onClick={() => handleCanceledCours(cours._id)}>
                  A
                </button>
              )}
              {!cours.completed && (
                <button onClick={() => handleDoneCours(cours._id)}>Done</button>
              )}
            </div>
          ))}
        </div>

        {(showModal && (
          <div className="modalOverlay">
            <div className="modalContent">
              <h2>Ajouter des cours payés</h2>
              <form onSubmit={handleSubmit}>
                <label htmlFor="newClasses">Nombre de cours à ajouter :</label>
                <input
                  type="number"
                  id="newClasses"
                  value={newClasses}
                  onChange={(e) => setNewClasses(Number(e.target.value))}
                  required
                />
                <button type="submit">Ajouter</button>
              </form>
            </div>
          </div>
        )) ||
          (planModal && (
            <div className="modalPlanningModal">
              <form onSubmit={handleValidateCours}>
                <label htmlFor="titleCours">Titre</label>
                <InputText
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <label htmlFor="dateHeure">Date et heure</label>
                <Calendar
                  value={datetime24h}
                  onChange={(e) => setDateTime24h(e.value)}
                  showTime
                  hourFormat="24"
                />
                <button type="submit">Valider</button>
              </form>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Eleve
