import { useState, useEffect } from "react";
import "./style.scss";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

function BoutonAjoutEleve() {
    const [students, setStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/eleve", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                });
    
                if (!response.ok) {
                    throw new Error("Une erreur s'est produite lors de la récupération des données.");
                }
    
                const data = await response.json();
                console.log('Données récupérées :', data);
                setStudents(data); // Stockage des données dans l'état
    
            } catch (error) {
                console.error("Une erreur est survenue", error);
            }
        };
    
        fetchData();
    }, [showModal]);
    

    const handleclick = () => {
        setShowModal(!showModal);
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 300);
    };

    const addStudent = () => {
        setShowModal(false); 
    };


    return (
        <div>
            <button className={`btnAjoutEleve ${isClicked ? 'clicked' : ''}`} onClick={handleclick}>
                <Plus className="plusIcon" size={40} />
            </button>
            {showModal ? <Modal addStudent={addStudent} /> : <ListeEleve students={students} />}
        </div>
    );
}

export default BoutonAjoutEleve;

function ListeEleve({ students }) {
    return (
        <div className="divTDB">
            {students.map((student) => (
                <div key={student._id} className="divName">
                    <Link to={`/eleve/${student._id}`} state={{ student }} className="btnName">
                        {`${student.firstName} ${student.lastName}`}
                    </Link>
                    
                </div>
            ))}
        </div>
    );
}

function Modal({ addStudent }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [remainingClasses, setRemainingClasses] = useState(0);

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!firstName || !lastName || remainingClasses <= 0) {
            alert("Veuillez renseigner tous les champs correctement.");
            return;
        }

        const newStudent = {
            userId: "azeertrtrgrgg",
            id: Date.now(),
            firstName,
            lastName,
            remainingClasses: Number(remainingClasses), // Assurez-vous que ce soit un nombre
            completedClasses: 0,
            canceledClasses: 0,
            scheduledClasses: 0,
        };

        try {
            // Envoie la requête POST à l'API
            const response = await fetch("http://localhost:3000/api/eleve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newStudent),
            });

            if (!response.ok) {
                throw new Error("Une erreur s'est produite lors de l'ajout de l'étudiant.");
            }

            // Réinitialise les champs après soumission réussie
            setFirstName("");
            setLastName("");
            setRemainingClasses(0);
            alert("Étudiant ajouté avec succès !");
            addStudent()
            
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur lors de l'ajout de l'étudiant. Veuillez réessayer.");
        }
    };

    return (
        <div className="form">
            <h2>Ajouter un nouvel élève</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Prénom</label>
                    <input
                        type="text"
                        placeholder="Prénom"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Nom</label>
                    <input
                        type="text"
                        placeholder="Nom"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Nombre de cours achetés</label>
                    <input
                        type="number"
                        value={remainingClasses}
                        onChange={(e) => setRemainingClasses(e.target.value)}
                    />
                </div>
                <input className="formSubmit" type="submit" value="Ajouter" />
            </form>
        </div>
    );
}
