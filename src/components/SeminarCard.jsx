import { FaTrash } from "react-icons/fa"
import { MdModeEditOutline } from "react-icons/md"
import "./SeminarCard.css"

export default function SeminarItem({ children, handleDeleteClick, handleEditClick }){
    const { title, description, date, time, photo } = children

    return(
        <div className="item">
            <div className="item-photo">
            <img src={photo}/>

            </div>
            <h2>{title}</h2>
            <p className="desc">{description}</p>
            <p className="time-info">
                <span className="date">{date}</span> / <span className="time">{time}</span>
            </p>
            <div className="icons">

                <button onClick={handleEditClick}><MdModeEditOutline className="icon" /></button>
                <button onClick={handleDeleteClick}><FaTrash className="icon"/></button>
            </div>
        </div>
    )
}