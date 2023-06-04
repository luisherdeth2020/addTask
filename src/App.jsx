import { useState, useEffect } from 'react'
import './App.css'
import trash from './assets/trash.svg'
import pencil from './assets/pencil.svg'

function App() {
  const [openModal, setOpenModal] = useState(false)
  const [todos, setTodo] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [selecciona, setSelecciona] = useState('todas')



  const deleteTodo = (task) => {
    // Creo un nuevo array con las tareas que sean distinto a la task que quiero eliminar
    const updateTask = todos.filter(todo => todo !== task)
    // actualizo el localStorage
    localStorage.setItem('task', JSON.stringify(updateTask));
    setTodo(updateTask)
  }
  const taskSelected = (task) => {
    const updatedTasks = todos.map((checked) => {

      console.log('task ', task)
      console.log('checked ', checked)

      // recorro todas las tareas y cambio el valor de la propiedad del objecto a false/true
      if (checked === task) {
        return { ...checked, completas: !checked.completas };
      }
      return checked;
    });
    localStorage.setItem('task', JSON.stringify(updatedTasks));
    setTodo(updatedTasks);
  };




  const onAddTodo = () => {
    if (newTodo.trim() !== '') {
      // Necesito guardar el valor de check del input, necesito el objeto y dentro le agrego la propiedad "completas"
      // su valor es "false"
      const newTask = { task: newTodo, completas: false }
      const allTodos = [...todos, newTask];
      // Guardo en el LocalStorage
      localStorage.setItem('task', JSON.stringify(allTodos));
      setTodo(allTodos);
    } else {
      return
    }
    setOpenModal(false);
    setNewTodo('');
  }
  const editTodo = (task) => {
    setOpenModal(true)
  }

  useEffect(() => {
    // Necesito mostrar las tareas que tengo guardado en localStorage
    const getTask = JSON.parse(localStorage.getItem('task'))
    if (getTask) {
      setTodo(getTask);
    }


  }, [])

  return (
    <>
      {openModal &&
        <div className="modalContainer">
          <div className="modalClosed">
            <h2>New Task</h2>
            <button className="modalExit" onClick={() => setOpenModal(false)}>X</button>
          </div>
          <input placeholder="New task" className='textInput' type='text' value={newTodo} onChange={e => setNewTodo(e.target.value)} />
          <button className="sendTask" onClick={onAddTodo}>Create Task</button>
        </div>
      }
      <div className="container" >
        <h1>Todo List</h1>
        <div className="container__header">
          <button className="openModal" onClick={() => setOpenModal(true)}>Add Task</button>
          <div className="filters">
            <select className='openModal' name="list" id="todos" onChange={e => setSelecciona(e.target.value)}>
              {/* {console.log('-----', setSelected(e.target.value))} */}
              <option value="todas">Todas</option>
              <option value="activas">Activas</option>
              <option value="completas">Completadas</option>
            </select>
          </div>
        </div>
        <div className="container__body">
          {
            selecciona === 'todas' ? (
              todos.map((task, index) => (
                <>
                  <div className="container__tasks" key={index}>
                    <label
                      className={task.completas ? 'completas' : 'taskLabel'}
                      onClick={() => taskSelected(task)}
                    >
                      <div className="noCompleted"></div>
                      {/* como es un objeto, tengo que añadir task */}
                      <div className="task">{task.task}</div>
                    </label>
                    <div className="container__icons">
                      <button className="delete" onClick={() => deleteTodo(task)}> <img src={trash} alt="trash" /> </button>
                      <button className="delete" onClick={() => editTodo(task)}> <img src={pencil} alt="pencil" /> </button>
                    </div>
                  </div>
                </>
              ))
            )
              : (
                //Me devuelve todas las tareas que este completas
                todos.filter(task => task.completas === (selecciona === 'completas')).map((task, index) => (
                  <>
                    <div className="container__tasks" key={index}>
                      <label
                        className={task.completas ? 'completas' : 'taskLabel'}
                        onClick={() => taskSelected(task)}
                      >
                        <div className="noCompleted"></div>
                        <div className="task">{task.task}</div>
                      </label>
                      <div className="container__icons">
                        <button className="delete" onClick={() => deleteTodo(task)}> <img src={trash} alt="trash" /> </button>
                        <button className="delete" onClick={() => editTodo(task)}> <img src={pencil} alt="pencil" /> </button>
                      </div>
                    </div>

                  </>
                ))
              )
          }
          {
            (selecciona === 'completas' && todos.filter((task) => task.completas).length === 0) || (selecciona === 'activas' && todos.filter((task) => !task.completas).length === 0) ?
              <div className="counter">No hay tareas {selecciona} </div> :
              ''
          }
          {
            selecciona === 'todas' && todos.length === 0 && (
              <div className="counter">No hay tareas</div>
            )
          }
        </div>
        <div className="counters">
          <div className="counter"><strong>Completas:</strong> {todos.filter((task) => task.completas).length}</div>
          <div className="counter"><strong>Activa:</strong> {todos.filter((task) => !task.completas).length}</div>
          <div className="counter"><strong>Todas:</strong> {todos.length}</div>
        </div>
      </div>
    </>
  )
}

export default App
