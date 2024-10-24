import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./style.scss"
import { Calendar } from 'primereact/calendar';
import { InputText } from "primereact/inputtext";
        

function Eleve() {
    const location = useLocation()
    const { student } = location.state
    const navigate = useNavigate(); // Pour rediriger après suppression
    const [showModal, setShowModal] = useState(false); // État pour gérer l'ouverture de la modal
    const [newClasses, setNewClasses] = useState(0);   // État pour gérer le nombre de cours ajoutés
    const [planModal, setPlanModal] =useState(false)
    const [datetime24h, setDateTime24h] = useState('')
    const [value, setValue] = useState('');
    const [plannedCourses, setPlannedCourses] = useState([])

    // Fonction pour supprimer l'étudiant
    const handleDelete = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch(`http://localhost:3000/api/eleve/${student._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Une erreur s'est produite lors de la suppression de l'étudiant.");
        }
  
        alert("Étudiant supprimé avec succès !");
        navigate("/"); // Redirection après suppression
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        alert("Erreur lors de la suppression de l'étudiant.");
      }
    };
  
    // Fonction pour ouvrir la modal
    const handleAddCours = () => {
      setShowModal(true);
    };
  
    // Fonction pour fermer la modal
    const handleCloseModal = () => {
      setShowModal(false);
      setNewClasses(0); // Réinitialiser la valeur une fois la modal fermée
    };
  
    // Fonction pour soumettre le formulaire et ajouter le cours
const handleSubmit = async (e) => {
    e.preventDefault();

    // Assurez-vous que newClasses contient la valeur à ajouter
    const updatedRemainingClasses = newClasses; // Supposons que newClasses soit la nouvelle valeur à ajouter
    try {
        const response = await fetch(`http://localhost:3000/api/eleve/${student._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ remainingClasses: updatedRemainingClasses }), // Envoie la valeur à ajouter
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout du cours.");
        }

        const data = await response.json();
        console.log("Cours ajoutés avec succès : ", data);

        handleCloseModal();
    } catch (error) {
        console.error("Erreur : ", error);
    }
}

const handleScheduleCours = () => {
  setPlanModal(!planModal)

}

const handleValidateCours = async (e) => {
  e.preventDefault();

    const courseData = {
      title: value,
      start: datetime24h,
      end: datetime24h,
    }
    try {
        const response = await fetch(`http://localhost:3000/api/eleve/${student._id}/courses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(courseData),
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout du cours.");
        }

        const data = await response.json();
        console.log("Cours ajoutés avec succès : ", data);

        // Fermer la modal après succès
        setPlanModal(!planModal)
        fetchCourses()
    } catch (error) {
        console.error("Erreur : ", error);
    }
}

const fetchCourses = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/eleve/${student._id}/courses`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la recupération des cours.");
        }

        const data = await response.json();
        console.log("Cours récupérés avec succès : ", data);
        setPlannedCourses(data)

    } catch (error) {
        console.error("Erreur : ", error);
    }
}

useEffect(() => {
  fetchCourses();
}, []);

  
    return (
      <div className='pageEleveContainer'>
        <div className="divHeaderEleve">
          <div className='eleveName'>
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
          <div className='divClassesInfo'>
            <div className='eleveCoursDetail'>
              <p>Cours achetés restant</p> <span>{student.remainingClasses}</span>
            </div>
            <div className='eleveCoursDetail'>
              <p>Cours planifiés</p> <span>{student.scheduledClasses}</span>
            </div>
            <div className='eleveCoursDetail'>
              <p>Cours faits</p> <span>{student.completedClasses}</span>
            </div>
            <div className='eleveCoursDetail'>
              <p>Cours supprimés</p> <span>{student.canceledClasses}</span>
            </div>
          </div>
          <div className="coursPlanned">
            <h2>Prochains cours</h2>
            {plannedCourses.map((cours) => (
              <div key={cours._id} className="divTitleAndDate">
                <p>{cours.title}</p>
                <span>{cours.start}</span>
              </div>
            ))}
          </div>
            
        </div>
        
  
        {showModal && (
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
                <button type="button" onClick={handleCloseModal}>Annuler</button>
              </form>
            </div>
          </div>
        )}
        {planModal && (<div className="modalPlanningModal"> 
          <form onSubmit={handleValidateCours}>
            <label htmlFor="titleCours">Titre</label>
            <InputText value={value} onChange={(e) => setValue(e.target.value)} />
            <label htmlFor="dateHeure">Date et heure</label>
            <Calendar value={datetime24h} onChange={(e) => setDateTime24h(e.value)} showTime hourFormat="24" />
              <button type="submit">Valider</button>
          </form>
        </div>
        )}
      </div>
  )}


  
  export default Eleve;