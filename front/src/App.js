import React, { useContext, useReducer, useEffect, useRef, useState, createContext } from 'react';

//Tenemos una constante de la direccion url base que usaremos en el proyecto
const HOST_API = "http://localhost:8080/api";
const initialState = {
  todo: { list: [], item: {} }
};
const Store = createContext(initialState)


//Este formulario es el que tiene la potestad de agregar, actualizar y eliminar 

const Form = () => {
  const formRef = useRef(null);
  const { dispatch, state: { todo } } = useContext(Store);
  const item = todo.item;
  const [state, setState] = useState(item);

  const onAdd = (event) => {
    event.preventDefault();

    const request = {
      name: state.name,
      id: null,
      completed: false
    };


    fetch(HOST_API + "/todo", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((todo) => {
        dispatch({ type: "add-item", item: todo });
        setState({ name: "" });
        formRef.current.reset();
      });
  }

  const onEdit = (event) => {
    event.preventDefault();

    const request = {
      name: state.name,
      id: item.id,
      isCompleted: item.isCompleted
    };


    fetch(HOST_API + "/todo", {
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((todo) => {
        dispatch({ type: "update-item", item: todo });
        setState({ name: "" });
        formRef.current.reset();
      });
  }

  return <form ref={formRef}>
    <input
      type="text"
      name="name"
      placeholder="¿Qué piensas hacer hoy?"
      defaultValue={item.name}
      onChange={(event) => {
        setState({ ...state, name: event.target.value })
      }}  ></input>
    {item.id && <button onClick={onEdit}>Actualizar</button>}
    {!item.id && <button onClick={onAdd}>Crear</button>}
  </form>
}

//El list es el componente que trae la lista de elementos del todoList y los pinta a trabes 
//de un .map

const List = () => {
  const { dispatch, state: { todo } } = useContext(Store);
  const currentList = todo.list;

  useEffect(() => {
    fetch(HOST_API + "/todos")
      .then(response => response.json())
      .then((list) => {
        dispatch({ type: "update-list", list })
      })
  }, [dispatch]);


  const onDelete = (id) => {
    fetch(HOST_API + "/" + id + "/todo", {
      method: "DELETE"
    }).then((list) => {
      dispatch({ type: "delete-item", id })
    })
  };

  const onEdit = (todo) => {
    dispatch({ type: "edit-item", item: todo })
  };

  const onChange = (event, todo) => {
    const request = {
      name: todo.name,
      id: todo.id,
      completed: event.target.checked
    };
    fetch(HOST_API + "/todo", {
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((todo) => {
        dispatch({ type: "update-item", item: todo });
      });
  };

  const decorationDone = {
    textDecoration: 'line-through'
  };
  return <div>
    <table >
      <thead>
        <tr>
          <td>ID</td>
          <td>Tarea</td>
          <td>¿Completado?</td>
        </tr>
      </thead>
      <tbody>
        {currentList.map((todo) => {
          return <tr key={todo.id} style={todo.completed ? decorationDone : {}}>
            <td>{todo.id}</td>
            <td>{todo.name}</td>
            <td><input type="checkbox" defaultChecked={todo.completed} onChange={(event) => onChange(event, todo)}></input></td>
            <td><button onClick={() => onDelete(todo.id)}>Eliminar</button></td>
            <td><button onClick={() => onEdit(todo)}>Editar</button></td>
          </tr>
        })}
      </tbody>
    </table>
  </div>
}



//El reducer es una funcion pura que es la unica que tiene acceso a modificar el estado
//de la aplicacion y lo hace sin la necesidad de mutar el estado.

function reducer(state, action) {
  switch (action.type) {
    case 'update-item':
      const todoUpItem = state.todo;
      const listUpdateEdit = todoUpItem.list.map((item) => {
        if (item.id === action.item.id) {
          return action.item;
        }
        return item;
      });
      todoUpItem.list = listUpdateEdit;
      todoUpItem.item = {};
      return { ...state, todo: todoUpItem }
    case 'delete-item':
      const todoUpDelete = state.todo;
      const listUpdate = todoUpDelete.list.filter((item) => {
        return item.id !== action.id;
      });
      todoUpDelete.list = listUpdate;
      return { ...state, todo: todoUpDelete }
    case 'update-list':
      const todoUpList = state.todo;
      todoUpList.list = action.list;
      return { ...state, todo: todoUpList }
    case 'edit-item':
      const todoUpEdit = state.todo;
      todoUpEdit.item = action.item;
      return { ...state, todo: todoUpEdit }
    case 'add-item':
      const todoUp = state.todo.list;
      todoUp.push(action.item);
      return { ...state, todo: {list: todoUp, item: {}} }
    default:
      return state;
  }
}

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <Store.Provider value={{ state, dispatch }}>
    {children}
  </Store.Provider>

}

function App() {
  return <StoreProvider>
    <h3>To-Do List</h3>
    <Form />
    <List />
  </StoreProvider>
}

export default App;
