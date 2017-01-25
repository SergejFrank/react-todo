import React, {Component} from 'react';
import './App.css';

var STORAGE_KEY = 'todos';

window.uuid = 0;

var taskLocalDB = {
    getAll: function () {
        var tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        tasks.forEach(function (task, index) {
            task.id = index
        })
        window.uuid = tasks.length;
        return tasks
    },
    save: function (tasks) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }
}

const TaskForm = ({addTask}) => {
    let input;

    function handleKeyPress(e) {
        if (e.charCode === 13 && input.value.replace(/\s/g, '') !== '') {
            addTask(input.value);
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

const Task = ({task, remove, status}) => {
    let checkbox;

    return <li className={task.done ? 'done': ''}>
        <input  checked={task.done} onChange={() => {status(task,checkbox)}} ref={elem => { checkbox = elem }} type="checkbox"/>
        <span>{task.text}</span>
        <button onClick={() => {remove(task.id)}} className="delete-button">X</button></li>;
}

const TaskList = ({tasks, remove,status}) => {
    const list = tasks.map((task) => {
        return (<Task task={task} key={task.id} remove={remove} status={status}/>)
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
        this.setState({data:taskLocalDB.getAll()});
    }

    updateData(data) {
        this.setState({data: data});
        taskLocalDB.save(data);
    }

    addTask(val) {
        const task = {text: val, id: window.uuid++, done: false}
        this.state.data.push(task);
        this.updateData(this.state.data);
    }

    handleRemove(id) {
        const remainder = this.state.data.filter((task) => {
            if (task.id !== id) return task;
        });
        this.updateData(remainder);
    }

    setTaskStatus(task, checkbox) {
        task.done = checkbox.checked;
        this.updateData(this.state.data);
    }

    render() {
        return (
            <div className="wrap">
                <TaskList
                    tasks={this.state.data}
                    remove={this.handleRemove.bind(this)}
                    status={this.setTaskStatus.bind(this)}
                />
                <TaskForm addTask={this.addTask.bind(this)}/>
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
