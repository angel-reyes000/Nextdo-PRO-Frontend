"use client"

import styles from '../styles/task_searcher_and_filter.module.scss'
import styless from '../styles/task.edit.module.scss'
import { FaPlus, FaCalendar, FaSearch, FaTimes, FaSave } from 'react-icons/fa'
import { useState, useRef, useEffect } from 'react'
import Task from './task_searcher_and_filter.jsx'
import Task_edit from './task_edit.jsx'
import Modal from './modal_expired_token.jsx'
import { useRouter } from 'next/navigation';
import 'aos/dist/aos.css';
import AOS from 'aos';

let ids = 0;
let list_tasks = []

export default function Tasks () {
    const refPriorityHigh = useRef(null)
    const refPriorityMedium = useRef(null)
    const refPriorityLow = useRef(null)
    const [priorityStateButton, setPriorityStateButton] = useState('')
    const [inputCreateTask, setInputCreateTask] = useState('')
    const [inputCreateDescriptionTask, setInputCreateDescriptionTask] = useState('')
    const [inputCreateDeadLineTask, setInputCreateDeadLineTask] = useState('')
    const [fieldId, setFieldId] = useState(1)
    const [tasks, setTasks] = useState(list_tasks)
    const [inputSearchTask, setInputSearchTask] = useState('')
    const [selectPriority, setSelectPriority] = useState('all')
    const [selectDeadLine, setSelectDeadLine] = useState('asc')
    const [editingTask, setEditingTask] = useState(null)
    const [expiredToken, setExpiredToken] = useState(false)
    const router = useRouter()

    const date = new Date().toLocaleDateString();

    const handleUpdateTask = (updatedTask) => {
        setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
        setEditingTask(null)
    }

    const handleToggleTask = (id, completed) => {
        setTasks(prev => prev.map(task => task.id === id ? { ...task, completed } : task))
    }

    const handleDeleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    }
    
    let refHigh = refPriorityHigh.current
    let refMedium = refPriorityMedium.current
    let refLow = refPriorityLow.current
    useEffect(() => {
        if (priorityStateButton === 'high') {
            refHigh.style.backgroundColor = '#fca5a5';
            refHigh.style.outline = '2px solid #0f172a'

            refMedium.style.backgroundColor = '#fef3c7'
            refMedium.style.outline = '0px'

            refLow.style.backgroundColor = '#dcfce7'
            refLow.style.outline = '0px'

        } else if (priorityStateButton === 'medium') {
            refMedium.style.backgroundColor = '#fcd34d';
            refMedium.style.outline = '2px solid #0f172a'

            refHigh.style.backgroundColor = '#fee2e2'
            refHigh.style.outline = '0px'

            refLow.style.backgroundColor = '#dcfce7'
            refLow.style.outline = '0px'

        } else if (priorityStateButton === 'low') {
            refLow.style.backgroundColor = '#86efac';
            refLow.style.outline = '2px solid #0f172a'

            refHigh.style.backgroundColor = '#fee2e2'
            refHigh.style.outline = '0px'

            refMedium.style.backgroundColor = '#fef3c7'
            refMedium.style.outline = '0px'
        }
        console.log("Cambio de prioridad")
    }, [priorityStateButton])

    function activeDialog ({ bool }) {
        setExpiredToken(bool)
        if (typeof window !== 'undefined'){
            localStorage.removeItem('token');
        }
    }

     
    const getData = async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        try {
            const res = await fetch(` https://${process.env.NEXT_PUBLIC_RUTE_BACKEND}/api/notes`, {
                headers: {
                    'Authorization': token
                }
            });
            if(!res.ok) {
                activeDialog({ bool:true })
            }
            const data = await res.json();
            setTasks(data.response || [])
        } catch (error) {
            console.log("Error al obtener datos", error.messasge);    
            setTasks([])
        }
    }

    useEffect(() => {
        getData()
    }, []);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            delay: 0,
            once: true
        })
    }, [])

    async function sendTaskDataBase () {
        try {
            const res = await fetch(`https://${process.env.NEXT_PUBLIC_RUTE_BACKEND}/api/notes`, {
            method: "POST",
            headers: {
                'Authorization': typeof window !== 'undefined' ? localStorage.getItem('token') : null,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: fieldId,
                title: inputCreateTask,
                description: inputCreateDescriptionTask,
                deadline: inputCreateDeadLineTask,
                priority: priorityStateButton
            })
        })
        const data = await res.json();
        return data
        } catch (error) {
            console.log("Error guardando tarea:", error);
        }
    }

    return (
        <>  
            <div className={styles.tasks_window}>
                <div className={styles.all_about_tasks}>
                    {/* -------------------------------- Create Tasks --------------------------------- */}
                    <div data-aos='zoom-in' className={styles.create_task}>
                        <div className={styles.create_task_row_1}>
                            <div>
                                <h1>Create New Task</h1>
                            </div>
                            <div className={styles.create_task_row_1_buttons}>
                                <p>Priority:</p>
                                <button ref={refPriorityHigh} onClick={() => setPriorityStateButton('high')} style={{backgroundColor: '#fee2e2'}}>High</button>
                                <button ref={refPriorityMedium} onClick={() => setPriorityStateButton('medium')} style={{backgroundColor: '#fef3c7'}}>Medium</button>
                                <button ref={refPriorityLow} onClick={() => setPriorityStateButton('low')} style={{backgroundColor: '#dcfce7'}}>Low</button>
                            </div>
                        </div>
                        <div className={styles.create_task_row_2}>
                            <div className={styles.input_new_task}>
                                <input value={inputCreateTask} onChange={(e) => setInputCreateTask(e.target.value)} placeholder='Input new task' aria-label='New task title'></input>
                            </div>
                            <div className={styles.label_input_deadline}>
                                <label htmlFor='deadline'>Deadline: </label>
                                <input value={inputCreateDeadLineTask} onChange={(e) => setInputCreateDeadLineTask(e.target.value)} type='date' placeholder='Deadline' id="deadline" name="deadline"></input>
                            </div>
                            <button onClick={async () => {
                                //setFieldId(fieldId + 1)
                                const data = await sendTaskDataBase()
                                setTasks(prev => [...prev, data.respuesta[0]])
                                setInputCreateTask('')
                                setInputCreateDescriptionTask('')
                                setInputCreateDeadLineTask('')
                                setPriorityStateButton('')
                                refHigh.style.backgroundColor = '#fee2e2'
                                refHigh.style.outline = '0px'
                                refMedium.style.backgroundColor = '#fef3c7'
                                refMedium.style.outline = '0px'
                                refLow.style.backgroundColor = '#dcfce7'
                                refLow.style.outline = '0px'
                                }}>
                                <FaPlus aria-hidden='true' size={20} style={{display: 'inline-block', alignContent: 'center', marginBottom: '2%'}}/> Add Task
                            </button>
                        </div>
                        {inputCreateTask.length > 0 ? (
                            <div className={styles.description_task}>
                                <textarea value={inputCreateDescriptionTask} onChange={(e) => setInputCreateDescriptionTask(e.target.value)} placeholder='Write the description for your task...' cols={2} rows={5}></textarea>
                            </div>
                        ) : null}
                    </div>
                    <hr data-aos='fade-down'/>
                    {/* -------------------------- Filtros y busqueda -------------------------------- */} 
                    <div data-aos='fade-left' className={styles.filters_and_search}>
                        <div className={styles.input_filters_and_search}>
                            <FaSearch aria-hidden='true' size={20}/>
                            <input value={inputSearchTask} onChange={(e) => setInputSearchTask(e.target.value)} placeholder='Search Task...' aria-label='Search task'></input>
                        </div>
                        <div className={styles.select_filters_and_search_filter}>
                            <select value={selectPriority} onChange={(e) => setSelectPriority(e.target.value)} aria-label='Filter by priority'>
                                <option value='all'>Filter by: [All Tasks]</option>
                                <option value='high'>Filter by: [High Tasks]</option>
                                <option value='medium'>Filter by: [Medium Tasks]</option>
                                <option value='low'>Filter by: [Low Tasks]</option>
                            </select>
                        </div>
                        <div className={styles.select_filters_and_search_sort}>
                            <select value={selectDeadLine} onChange={(e) => setSelectDeadLine(e.target.value)} aria-label='Sort by deadline'>
                                <option value='asc'>Sort by: [Deadline Asc]</option>
                                <option value='desc'>Sort by: [Deadline Descs]</option>
                            </select>
                        </div>
                        <div className={styles.priority_filters_and_search}>
                            <p style={{backgroundColor: '#fee2e2', color: '#b91c1c'}}>High</p>
                            <p style={{backgroundColor: '#fef3c7', color: '#92400e'}}>Medium</p>
                            <p style={{backgroundColor: '#dcfce7', color: '#166534'}}>Low</p>
                        </div>
                    </div>
                    {/* ---------------------------- Tasks -------------------------------*/}
                    {editingTask && <Task_edit task={editingTask} onClose={() => setEditingTask(null)} onSave={handleUpdateTask} />}
                    <Task tasks={tasks} inputSearchTask={inputSearchTask} selectPriority={selectPriority} selectDeadLine={selectDeadLine} onSelectTask={setEditingTask} onDeleteTask={handleDeleteTask} onToggleTask={handleToggleTask}/>
                    <Modal />
                </div>
            </div>
        </>
    )
}