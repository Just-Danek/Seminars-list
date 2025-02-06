import { useState, useEffect } from 'react'
import './App.css'
import SeminarCard from './components/SeminarCard'
import DeleteModal from './components/DeleteModal'
import EditModal from './components/EditModal'

export default function App() {
  const [seminars, setSeminars] = useState([])
  const [selectedSeminar, setSelectedSeminar] = useState(null)
  
  // Функционал удаления семинара 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const handleDeleteClick = seminar => {
    setSelectedSeminar(seminar)
    setIsDeleteModalOpen(true)
  }
  
  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:3001/seminars/${selectedSeminar.id}`, {
        method: "DELETE",
      })
      setSeminars(seminars.filter(s => 
        s.id !== selectedSeminar.id
      ))
      setIsDeleteModalOpen(false)
    } catch(err) {
      console.error(`Ошибка удаления: ${err}`)
    }
  }
  
  // Функционал изменения семинара
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleEditClick = seminar => {
    setSelectedSeminar(seminar)
    setIsEditModalOpen(true)
  }

  const confirmEdit = async updatedSeminar => {
    try {
      const res = await fetch(`http://localhost:3001/seminars/${selectedSeminar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSeminar),
      })

      if (!res.ok) { 
        throw new Error(`Ошибка сервера: ${res.status}`)
      }
      
      const data = await res.json()
      setSeminars(seminars.map(s => 
        s.id === data.id ? data : s
      ))
    } catch(err) {
      console.error(`Ошибка редактирования: ${err}`)
    }
  }
  
  // Функционал отображения состояния загрузки семинаров
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getSeminars = async () => {
      try {
        const res = await fetch("http://localhost:3001/seminars")

        if (!res.ok){
          console.error(`Ошибка сервера: ${res.status}`)
          throw new Error("Ошибка загрузки")
        }

        const data = await res.json()
        setSeminars(data)
        setIsLoading(false)
      } catch(err) {
        setIsLoading(false)
        console.error(`Ошибка: ${err}`)
      }
    }

    getSeminars()
  }, [])
  
  if (isLoading) return <p classsname='loader'>Загрузка...</p>
  if (seminars.length === 0) return <p classname='empty-seminars'>Cеминаров нет</p>

  return (
    <>
      <div className='container'>
        <h1>Семинары:</h1>
        {
          seminars.map(seminar => 
            <SeminarCard 
              key={seminar.id}
              handleDeleteClick={() => handleDeleteClick(seminar)}
              handleEditClick={() => handleEditClick(seminar)}
            >
              {seminar}
            </SeminarCard>
        )}
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />

      <EditModal 
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        onConfirm={confirmEdit}
        selectedSeminar={selectedSeminar}
      />
    </>
  )
}


