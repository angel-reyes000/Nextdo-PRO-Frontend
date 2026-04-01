"use client"

import styles from '../styles/task.edit.module.scss'
import { FaTimes, FaSave } from 'react-icons/fa'
import { useState } from 'react'

export default function Task_edit({ edit, title }) {
    const [editing, setEditing] = useState(edit)
    const [editTitle, setEditTitle] = useState()
    if (editing === true) {
        return (
            <div className={styles.backgorund_task_edit}>
                <div className={styles.card_edit}>
                    <div className={styles.edit_header}>
                        <div className={styles.edit_title}>
                            <h1>Title: </h1>
                            <input placeholder='Edit your title...'></input>
                        </div>
                        <button onClick={() => setEditing(!editing)}><FaTimes size={30}/></button>
                    </div>
                    <hr style={{backgroundColor: 'black', border: '2px solid black', width: '100%'}}/>
                    <div className={styles.edit_description}>
                        <h2>Description:</h2>
                        <textarea placeholder='Edit your description...'></textarea>
                    </div>
                    <div className={styles.edit_date_and_priority}>
                        <div className={styles.edit_date}>
                            <label htmlFor="date">Date:</label>
                            <input type='date' name='date' id="date"></input>
                        </div>
                        <div className={styles.edit_priority}>
                            <label htmlFor="priority">Priority:</label>
                            <select id="priority">
                                <option value='high'>High</option>
                                <option value='medium'>Medium</option>
                                <option value='low'>Low</option>
                            </select>
                        </div>
                        
                    </div>
                    <div className={styles.edit_save_and_close}>
                        <div className={styles.edit_button_close}>
                            <button>Cancel</button>
                        </div>
                        <div className={styles.edit_button_save}>
                            <button><FaSave style={{display: 'inline', marginBottom: '8%'}}/> Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    } 
}