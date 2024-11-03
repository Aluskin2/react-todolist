import React, { useState, useEffect } from 'react';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [filter, setFilter] = useState('all');
    const [isAscending, setIsAscending] = useState(true);

    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        setTasks(savedTasks);
    }, []);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (newTask.trim()) {
            const task = {
                text: newTask,
                completed: false,
                createdAt: new Date().toISOString(),
            };
            setTasks([...tasks, task]);
            setNewTask('');
        }
    };

    const toggleTask = (index) => {
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
    };

    const deleteTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    const editTask = (index, newText) => {
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, text: newText } : task
        );
        setTasks(updatedTasks);
    };

    const toggleSortOrder = () => {
        setIsAscending(!isAscending);
    };

    const sortedTasks = tasks
        .filter((task) => {
            if (filter === 'completed') return task.completed;
            if (filter === 'active') return !task.completed;
            return true;
        })
        .sort((a, b) => {
            if (isAscending) return new Date(a.createdAt) - new Date(b.createdAt);
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    return (
        <div className="App">
            <h1>ToDo List</h1>
            <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="New task"
            />
            <button onClick={addTask}>Add</button>

            <div>
                <label>
                    <input
                        type="radio"
                        name="filter"
                        value="all"
                        checked={filter === 'all'}
                        onChange={() => setFilter('all')}
                    />
                    All
                </label>
                <label>
                    <input
                        type="radio"
                        name="filter"
                        value="active"
                        checked={filter === 'active'}
                        onChange={() => setFilter('active')}
                    />
                    Active
                </label>
                <label>
                    <input
                        type="radio"
                        name="filter"
                        value="completed"
                        checked={filter === 'completed'}
                        onChange={() => setFilter('completed')}
                    />
                    Completed
                </label>
            </div>

            <button onClick={toggleSortOrder}>
                Sort by Date ({isAscending ? 'Ascending' : 'Descending'})
            </button>

            <ul>
                {sortedTasks.map((task, index) => (
                    <li key={index}>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(index)}
                        />
                        <EditableText
                            text={task.text}
                            onSave={(newText) => editTask(index, newText)}
                        />
                        <button onClick={() => deleteTask(index)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Komponent do edycji tekstu zadania
function EditableText({ text, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(text);

    const handleSave = () => {
        if (newText.trim()) {
            onSave(newText);
        }
        setIsEditing(false);
    };

    return isEditing ? (
        <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
        />
    ) : (
        <span onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>
      {text}
    </span>
    );
}

export default App;