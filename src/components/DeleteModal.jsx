import Modal from "react-modal"
import "./Modals.css"

export default function DeleteModal({ isOpen, onConfirm, onRequestClose }){
    return(
        <Modal
            className="modal"
            overlayClassName="overlay"
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Подтверждение удаления семинара"
            ariaHideApp={false}
        >
            <h2>Вы уверены, что хотите удалить семинар?</h2>
            <div className="modal-actions">
                <button onClick={onRequestClose}>Отмена</button>
                <button onClick={onConfirm}>Удалить</button>
            </div>
        </Modal>
    )
}