import Navig from "../../components/navig"
import TableauDeBord from "../../components/tableau_de_bord"
import "./style.scss"

function Home() {

    return(
        <div>
    <Navig />
    <div className="pageFormat">
    <TableauDeBord /> 
    </div>
    </div>
    )
}
export default Home