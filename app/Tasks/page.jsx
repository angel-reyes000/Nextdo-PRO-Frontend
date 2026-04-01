"use client"

import styles from '../styles/task_searcher_and_filter.module.scss'
import styless from '../styles/task.edit.module.scss'
import { FaPlus, FaCalendar, FaSearch, FaTimes, FaSave } from 'react-icons/fa'
import { useState, useRef, useEffect } from 'react'
import Task from './task_searcher_and_filter.jsx'
import Task_edit from './task_edit.jsx'

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
    const [tasks, setTasks] = useState(list_tasks)
    const [inputSearchTask, setInputSearchTask] = useState('')
    const [selectPriority, setSelectPriority] = useState('all')
    const [selectDeadLine, setSelectDeadLine] = useState('asc')

    // function Task_edit () {
    //     const [editing, setEditing] = useState(false)
    //     const [editTitle, setEditTitle] = useState()
    //     if (editing === true) {
    //         return (
    //             <div className={styless.backgorund_task_edit}>
    //                 <div className={styless.card_edit}>
    //                     <div className={styless.edit_header}>
    //                         <div className={styless.edit_title}>
    //                             <h1>Title: </h1>
    //                             <input placeholder='Edit your title...'></input>
    //                         </div>
    //                         <button onClick={() => setEditing(!editing)}><FaTimes size={30}/></button>
    //                     </div>
    //                     <hr style={{backgroundColor: 'black', border: '2px solid black', width: '100%'}}/>
    //                     <div className={styless.edit_description}>
    //                         <h2>Description:</h2>
    //                         <textarea placeholder='Edit your description...'></textarea>
    //                     </div>
    //                     <div className={styless.edit_date_and_priority}>
    //                         <div className={styless.edit_date}>
    //                             <label htmlFor="date">Date:</label>
    //                             <input type='date' name='date' id="date"></input>
    //                         </div>
    //                         <div className={styless.edit_priority}>
    //                             <label htmlFor="priority">Priority:</label>
    //                             <select id="priority">
    //                                 <option value='high'>High</option>
    //                                 <option value='medium'>Medium</option>
    //                                 <option value='low'>Low</option>
    //                             </select>
    //                         </div>
                            
    //                     </div>
    //                     <div className={styless.edit_save_and_close}>
    //                         <div className={styless.edit_button_close}>
    //                             <button>Cancel</button>
    //                         </div>
    //                         <div className={styless.edit_button_save}>
    //                             <button><FaSave style={{display: 'inline', marginBottom: '8%'}}/> Save</button>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         )
    //     } 
    // }


    let refHigh = refPriorityHigh.current
    let refMedium = refPriorityMedium.current
    let refLow = refPriorityLow.current
    useEffect(() => {
        if (priorityStateButton === 'high') {
            refHigh.style.backgroundColor = 'red';
            refHigh.style.outline = '3px solid black'

            refMedium.style.backgroundColor = 'rgb(253, 255, 136)'
            refMedium.style.outline = '0px'

            refLow.style.backgroundColor = 'rgb(189, 255, 193)'
            refLow.style.outline = '0px'

        } else if (priorityStateButton === 'medium') {
            refMedium.style.backgroundColor = 'yellow';
            refMedium.style.outline = '3px solid black'

            refHigh.style.backgroundColor = 'rgb(255, 132, 132)'
            refHigh.style.outline = '0px'

            refLow.style.backgroundColor = 'rgb(189, 255, 193)'
            refLow.style.outline = '0px'

        } else if (priorityStateButton === 'low') {
            refLow.style.backgroundColor = 'green';
            refLow.style.outline = '3px solid black'

            refHigh.style.backgroundColor = 'rgb(255, 132, 132)'
            refHigh.style.outline = '0px'

            refMedium.style.backgroundColor = 'rgb(253, 255, 136)'
            refMedium.style.outline = '0px'
        }
        console.log("Cambio de prioridad")
    }, [priorityStateButton])

    return (
        <>  
            <div className={styles.tasks_window}>
                <div className={styles.all_about_tasks}>
                    {/* -------------------------------- Create Tasks --------------------------------- */}
                    <div className={styles.create_task}>
                        <div className={styles.create_task_row_1}>
                            <div>
                                <h1>Create New Task</h1>
                            </div>
                            <div className={styles.create_task_row_1_buttons}>
                                <p>Priority:</p>
                                <button ref={refPriorityHigh} onClick={() => setPriorityStateButton('high')} style={{backgroundColor: 'rgb(255, 132, 132)'}}>High</button>
                                <button ref={refPriorityMedium} onClick={() => setPriorityStateButton('medium')} style={{backgroundColor: 'rgb(253, 255, 136)'}}>Medium</button>
                                <button ref={refPriorityLow} onClick={() => setPriorityStateButton('low')} style={{backgroundColor: 'rgb(189, 255, 193)'}}>Low</button>
                            </div>
                        </div>
                        <div className={styles.create_task_row_2}>
                            <div className={styles.input_new_task}>
                                <input value={inputCreateTask} onChange={(e) => setInputCreateTask(e.target.value)} placeholder='Input new task'></input>
                            </div>
                            <div className={styles.label_input_deadline}>
                                <label htmlFor='deadline'>Deadline: </label>
                                <input value={inputCreateDeadLineTask} onChange={(e) => setInputCreateDeadLineTask(e.target.value)} type='date' placeholder='Deadline' id="deadline" name="deadline"></input>
                            </div>
                            <button onClick={() => {
                                setTasks([...tasks, {id: ids++, title: inputCreateTask, description: inputCreateDescriptionTask, deadline: inputCreateDeadLineTask, priority: priorityStateButton !== '' ? priorityStateButton : 'low'}])
                                setInputCreateTask('')
                                setInputCreateDescriptionTask('')
                                setInputCreateDeadLineTask('')
                                setPriorityStateButton('')
                                refHigh.style.backgroundColor = 'rgb(255, 132, 132)'
                                refHigh.style.outline = '0px'
                                refMedium.style.backgroundColor = 'rgb(253, 255, 136)'
                                refMedium.style.outline = '0px'
                                refLow.style.backgroundColor = 'rgb(189, 255, 193)'
                                refLow.style.outline = '0px'
                                }}>
                                <FaPlus size={20} style={{display: 'inline-block', alignContent: 'center', marginBottom: '2%'}}/> Add Task
                            </button>
                        </div>
                        {inputCreateTask.length > 0 ? (
                            <div className={styles.description_task}>
                                <textarea value={inputCreateDescriptionTask} onChange={(e) => setInputCreateDescriptionTask(e.target.value)} placeholder='Write the description for your task...' cols={2} rows={5}></textarea>
                            </div>
                        ) : null}
                    </div>
                    <hr style={{margin: '1% 0% 1% 0%', border: '3px solid rgb(208, 208, 208)', width: '100%', borderRadius: '10px'}} />
                    {/* -------------------------- Filtros y busqueda -------------------------------- */}
                    <div className={styles.filters_and_search}>
                        <div className={styles.input_filters_and_search}>
                            <FaSearch size={20}/>
                            <input value={inputSearchTask} onChange={(e) => setInputSearchTask(e.target.value)} placeholder='Search Task...'></input>
                        </div>
                        <div className={styles.select_filters_and_search_filter}>
                            <select value={selectPriority} onChange={(e) => setSelectPriority(e.target.value)}>
                                <option value='all'>Filter by: [All Tasks]</option>
                                <option value='high'>Filter by: [High Tasks]</option>
                                <option value='medium'>Filter by: [Medium Tasks]</option>
                                <option value='low'>Filter by: [Low Tasks]</option>
                            </select>
                        </div>
                        <div className={styles.select_filters_and_search_sort}>
                            <select value={selectDeadLine} onChange={(e) => setSelectDeadLine(e.target.value)}>
                                <option value='asc'>Sort by: [Deadline Asc]</option>
                                <option value='desc'>Sort by: [Deadline Descs]</option>
                            </select>
                        </div>
                        <div className={styles.priority_filters_and_search}>
                            <p style={{backgroundColor: 'red'}}>High</p>
                            <p style={{backgroundColor: 'yellow'}}>Medium</p>
                            <p style={{backgroundColor: 'green'}}>Low</p>
                        </div>
                    </div>
                    {/* ---------------------------- Tasks -------------------------------*/}
                    <Task tasks={tasks} inputSearchTask={inputSearchTask} selectPriority={selectPriority} selectDeadLine={selectDeadLine}/>
                </div>
            </div>
        </>
    )
}