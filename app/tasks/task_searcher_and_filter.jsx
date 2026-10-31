"use client"

import styles from '../styles/task_searcher_and_filter.module.scss'
import { FaCalendar, FaPlus } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function OpenThreeDots ({ id, onDeleteTask }) {
    const [optionDelete, setOptionDelete] = useState(false);
    const router = useRouter()

    const deleteTaskDataBase = async (e) => {
        await fetch(`https://${process.env.NEXT_PUBLIC_RUTE_BACKEND}/api/notes`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id
            })
        })
    }

    return (
        <div className={styles.three_dots_tasks} style={{backgroundColor: optionDelete ? 'rgb(232, 230, 230)' : ''}}>
            <h2 onClick={(e) => {
                e.stopPropagation()
                setOptionDelete(!optionDelete)
            }}>...</h2>
            {optionDelete ?  <h6 onClick={async (e) => {
                setOptionDelete(!optionDelete)
                e.stopPropagation()
                await deleteTaskDataBase()
                onDeleteTask(id)
                // router.refresh()
                //location.reload()
            }}>Delete</h6> : null}
        </div>
    )
}

function TaskCheckbox ({ task, onToggleTask }) {
    const [checked, setChecked] = useState(Boolean(task.completed))

    useEffect(() => {
        setChecked(Boolean(task.completed))
    }, [task.completed])

    const handleChange = async (e) => {
        const newValue = e.target.checked
        setChecked(newValue)
        try {
            const res = await fetch(`https://${process.env.NEXT_PUBLIC_RUTE_BACKEND}/api/notes/completed`, {
                method: "PATCH",
                headers: {
                    'Authorization': typeof window !== 'undefined' ? localStorage.getItem('token') : null,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: task.id,
                    completed: newValue
                })
            })
            if (!res.ok) throw new Error('Error al guardar el estado')
            if (onToggleTask) onToggleTask(task.id, newValue)
        } catch (error) {
            console.log("Error al guardar estado de la tarea:", error.message)
            setChecked(!newValue)
        }
    }

    return (
        <input type="checkbox" checked={checked} onChange={handleChange} onClick={(e) => e.stopPropagation()}></input>
    )
}

export default function Task ({ tasks, inputSearchTask, selectPriority, selectDeadLine, onSelectTask, onDeleteTask, onToggleTask }) {

    function Warning() {
        const [showWarning, setShowWarning] = useState(false);

        useEffect(() => {
            const token = localStorage.getItem('token');
                    if (!token) setShowWarning(true);
                }, []);

            if (!showWarning) return null;            

            return (
                <div className={styles.warning_login}>
                    <p>Log in for save your tasks!</p>
                </div>    
            ) 
    }

    useEffect(() => {
        console.log("Fecha: ", tasks.map(task => console.log(task)))
    }, [])

    if (tasks.length === 0) {
        return (
            <>
                <div className={styles.empty_tasks}>
                    <FaPlus style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}/><h1> Create a task!</h1>
                </div>
                <Warning />
            </>
        )
    }

    const priorityColor = (priority) => priority === 'high' ? 'red' : priority === 'medium' ? 'yellow' : 'green'

    const visibleTasks = tasks
        .filter(task => inputSearchTask === '' || task.title.toLowerCase().includes(inputSearchTask.toLowerCase()))
        .sort((primero, segundo) => selectDeadLine === 'desc'
            ? new Date(segundo.deadline) - new Date(primero.deadline)
            : new Date(primero.deadline) - new Date(segundo.deadline))
        .filter(task => selectPriority === 'all' || task.priority === selectPriority)

    return (
        <>
            {visibleTasks.map((task) => (
                <div key={task.id} onClick={() => onSelectTask(task)} className={styles.tasks} style={{borderLeft: `7px solid ${priorityColor(task.priority)}`}}>
                    <div className={styles.tasks_checkbox}>
                        <TaskCheckbox task={task} onToggleTask={onToggleTask}/>
                    </div>
                    <div className={styles.information_tasks}>
                        <div className={styles.header_tasks}>
                            <p style={{backgroundColor: `${priorityColor(task.priority)}`}}>{task.priority ? task.priority : 'Low'}</p>
                            <h2>{task.title}</h2>
                        </div>
                        <div className={styles.description_tasks}>
                            <p>{task.description}</p>
                        </div>
                        <div className={styles.date_tasks}>
                            <p><FaCalendar style={{display: 'inline'}}/> {task.deadline ? task.deadline.split('T')[0] : ''}</p>
                        </div>
                    </div>
                    <OpenThreeDots id={task.id} onDeleteTask={onDeleteTask}/>
                </div>
            ))}
        </>
    )
}
