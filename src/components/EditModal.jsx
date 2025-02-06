import Modal from "react-modal"
import "./Modals.css"
import { useState, useEffect } from "react"
import { parse, isValid } from "date-fns"

export default function EditModal({ isOpen, onConfirm, onRequestClose, selectedSeminar }){
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        photo: "",
        date: "",
        time: ""
    })

    const handleChange = e => {
        const { name, value } = e.target
    
        if (name === "date") {
            const cleanedDate = value.replace(/\D/g, "")
            let formattedDate = ""
    
            if (cleanedDate.length >= 0 && cleanedDate.length <= 2) {
                formattedDate = cleanedDate
            } else if (cleanedDate.length > 2 && cleanedDate.length <= 4) {
                formattedDate = `${cleanedDate.slice(0, 2)}.${cleanedDate.slice(2, 4)}`
            } else if (cleanedDate.length > 4 && cleanedDate.length <= 8) {
                formattedDate = `${cleanedDate.slice(0, 2)}.${cleanedDate.slice(2, 4)}.${cleanedDate.slice(4, 8)}`
            } else {
                return
            }
    
            setFormData({ ...formData, [name]: formattedDate })
            return
        }
    
        if (name === "time") {
            const cleanedTime = value.replace(/\D/g, "")
            let formattedTime = ""
    
            if (cleanedTime.length >= 0 && cleanedTime.length <= 2) {
                formattedTime = cleanedTime
            } else if (cleanedTime.length > 2 && cleanedTime.length <= 4) {
                formattedTime = `${cleanedTime.slice(0, 2)}:${cleanedTime.slice(2, 4)}`
            } else {
                return
            }
    
            setFormData({ ...formData, [name]: formattedTime })
            return
        }
    
        setFormData({ ...formData, [name]: value })
    }
    
    const handleSubmit = async e => {
        e.preventDefault()
        if (validation(formData)) {
            try {
                await onConfirm(formData)
                onRequestClose()
            } catch (error) {
                console.error("Ошибка сохранения:", error)
            }
        } else {
            console.error("Данные не валидны")
        }
    }

    function validation(data){
        const { title, description, photo, date, time } = data

        const titleValidation1 = (title.replace(/\s/g, "")).length !== 0
        const titleValidation2 = title[0] !== " "
        if (!titleValidation1 || !titleValidation2 ) {
            console.error("Заголовок не корректен")
            return false
        }

        const descValidation1 = (description.replace(/\s/g, "")).length !== 0
        const descValidation2 = description[0] !== " "
        if (!descValidation1 || !descValidation2) {
            console.error("Описание не корректно")
            return false
        }

        const photoURLValidation = photo[0] !== " "
        if (!photoURLValidation) {
            console.error("Ссылка на фотографию не корректна")
            return false
        }

        const dateValidation = isValid(parse(date, "dd.MM.yyyy", new Date()))
        if (!dateValidation) {
            console.error("Дата не валидна. Введите в формате дд.мм.гггг")
            return false
        }

        const timeValidation = isValid(parse(time, "HH:mm", new Date()))
        if (!timeValidation) {
            console.error("Время не валидно. Введите в формате чч:мм")
            return false
        }
        
        return true
    }

    useEffect(() => {
        if (selectedSeminar) {
            setFormData({
                title: selectedSeminar.title,
                description: selectedSeminar.description,
                photo: selectedSeminar.photo,
                date: selectedSeminar.date,
                time: selectedSeminar.time
            })
        }
    }, [selectedSeminar])

    return(
        <Modal
            className="modal"
            overlayClassName="overlay"
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Редактирование семинара"
            ariaHideApp={false}
        >
            <h2>Редактировать семинар</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="title">Заголовок:</label>
                    <input 
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Введите заголовок"
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="description">Описание:</label>
                    <textarea 
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Введите описание"
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="photo">Ссылка на фотографию:</label>
                    <input 
                        type="url"
                        name="photo"
                        id="photo"
                        value={formData.photo}
                        onChange={handleChange}
                        placeholder="http://..." 
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="date">Дата:</label>
                    <input 
                        type="text"
                        name="date"
                        id="date"
                        value={formData.date}
                        onChange={handleChange}
                        placeholder="дд.мм.гг" 
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="time">Время:</label>
                    <input 
                        type="text" 
                        name="time"
                        id="time"
                        value={formData.time}
                        onChange={handleChange}
                        placeholder="чч:мм"
                        required
                    />
                </div>
                <div className="modal-actions">
                    <button type="button" onClick={onRequestClose}>Отмена</button>
                    <button type="submit">Сохранить</button>
                </div>
            </form>
        </Modal>
    )
}