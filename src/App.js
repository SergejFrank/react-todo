import React, {Component} from 'react';
import './App.css';

var STORAGE_KEY = 'todos';

window.uuid = 0;

var todoLocalDB = {
    fetch: function () {
        var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        todos.forEach(function (todo, index) {
            todo.id = index
        })
        window.uuid = todos.length;
        return todos
    },
    save: function (todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
}

const TodoForm = ({addTodo}) => {
    let input;

    function handleKeyPress(e) {
        if (e.charCode == 13 && input.value.replace(/\s/g, '') != '') {
            addTodo(input.value);
            input.value = '';
        }
    }

    return (
        <div className="add-new-task">
            <input placeholder="Add a new task..." type="text" ref={elem => {
                input = elem
            }} onKeyPress={handleKeyPress}/>
        </div>
    );
};

const Todo = ({todo, remove, status}) => {
    let checkbox;

    return <li className={todo.done ? 'done': ''}>
        <input  checked={todo.done} onChange={() => {status(todo,checkbox)}} ref={elem => { checkbox = elem }} type="checkbox"/>
        <span>{todo.text}</span>
        <button onClick={() => {remove(todo.id)}} className="delete-button">X</button></li>;
}

const TodoList = ({todos, remove,status}) => {
    const list = todos.map((todo) => {
        return (<Todo todo={todo} key={todo.id} remove={remove} status={status}/>)
    });

    return (<ul className="task-list">{list}</ul>);
}


class TodoApp extends React.Component {
    constructor(props) {
        super();

        this.state = {
            data: []
        }
    }

    componentDidMount(){
        this.setState({data:todoLocalDB.fetch()});
    }

    updateData(data) {
        this.setState({data: data});
        todoLocalDB.save(this.state.data);
    }

    addTodo(val) {
        const todo = {text: val, id: window.uuid++, done: false}
        this.state.data.push(todo);
        this.updateData(this.state.data);
    }

    handleRemove(id) {
        const remainder = this.state.data.filter((todo) => {
            if (todo.id !== id) return todo;
        });

        this.updateData(remainder);
    }

    toggleDone(todo,checkbox) {
        todo.done = checkbox.checked;
        this.updateData(this.state.data);
    }

    render() {
        return (
            <div className="wrap">
                <TodoList
                    todos={this.state.data}
                    remove={this.handleRemove.bind(this)}
                    status={this.toggleDone.bind(this)}
                />
                <TodoForm addTodo={this.addTodo.bind(this)}/>
            </div>
        );
    }
}

class App extends Component {
    render() {
        return (
            <div className="App">
                <TodoApp />
            </div>
        );
    }
}

export default App;
