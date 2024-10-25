/* eslint-disable react/react-in-jsx-scope */
import { useNavigate } from 'react-router-dom'
import Eleve from '../../components/eleve'
import './style.scss'

function PageEleve() {
  const navig = useNavigate()

  const handleBack = () => {
    navig('/')
  }

  return (
    <div className="divEleveCalendrier">
      <button className="monBouton" onClick={handleBack}>
        Retour
      </button>
      <Eleve />
    </div>
  )
}

export default PageEleve
