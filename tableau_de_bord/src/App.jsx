
import './App.css'
import PageEleve from './page/PageEleve'
import Home from './page/accueil'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


function App() {

  return(
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eleve/:id" element={<PageEleve />} />
      </Routes>
    </Router>
  )
}

export default App
