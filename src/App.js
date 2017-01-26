import React, {Component} from 'react';
import './App.css';
import axios from 'axios';
import uuid from 'uuid';


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
    let checkboxId = "checkbox-"+task.id;

    return <li className={task.done ? 'done': ''}>
        <button onClick={() => {remove(task.id)}} className="delete-button">X</button>

        <label htmlFor={checkboxId} className="control control--checkbox">
            <span>{task.text}</span>
            <input id={checkboxId} checked={task.done} onChange={() => {status(task,checkbox)}} ref={elem => { checkbox = elem }}  type="checkbox"/>
            <div className="control__indicator"></div>
        </label>

    </li>;
}

const TaskList = ({tasks, remove, status, filter}) => {
    let list = tasks.map((task) => {
        return (<Task task={task} key={task.id} remove={remove} status={status}/>)
    });

    list = list.filter((item) => {
        let taskStatus = item.props.task.done;
        if (!filter) {
            return true;
        }
        else if (filter == "done" && taskStatus) {
            return true;
        }
        else if (filter == "undone" && !taskStatus) {
            return true;
        }
        return false;
    });

    return (<ul className="task-list">{list}</ul>);
}


class TodoApp extends React.Component {
    constructor(props) {
        super();

        this.state = {
            data: [],
            filter: null,
        };

        this.apiUrl = 'http://58876c6942c3cb120016724c.mockapi.io/api/task/';
    }

    componentDidMount(){
        this.updateData();
    }

    updateData() {
        fetch(this.apiUrl)
        .then(result=>result.json())
        .then(tasks=>this.setState({data: tasks}))
    }

    addTask(val) {
        const task = {text: val, done: false};
        console.log(task);
        axios.post(this.apiUrl, task)
        .then((res) => {
                this.state.data.push(res.data);
            console.log(this.state.data);
                this.setState({data: this.state.data});
        });
    }

    handleRemove(id) {
        axios.delete(this.apiUrl+id)
        .then((res) => {
            this.updateData();
        });
    }

    setTaskStatus(task, checkbox) {
        task.done = checkbox.checked;

        axios.put(this.apiUrl+task.id, task)
            .then((res) => {
                this.setState({data: this.state.data});
            });
    }

    tasksLeft(){
        var tasks = this.state.data.filter((item) => {
            return !item.done;
        });

        return tasks.length;
    }

    render() {
        return (
            <div className="wrap">
                <TaskList
                    tasks={this.state.data}
                    remove={this.handleRemove.bind(this)}
                    status={this.setTaskStatus.bind(this)}
                    filter={this.state.filter}
                />
                <div className="filters">
                    <span>{this.tasksLeft()} item{this.tasksLeft() > 1 || this.tasksLeft() == 0 ? 's': ''} left</span>
                    <ul>
                        <li onClick={() => this.setState({filter: null})}       className={this.state.filter == null      ? 'active': ''}>All</li>
                        <li onClick={() => this.setState({filter: "undone"})}   className={this.state.filter == "undone"  ? 'active': ''}>Active</li>
                        <li onClick={() => this.setState({filter: "done"})}     className={this.state.filter == "done"    ? 'active': ''}>Completed</li>
                    </ul>
                </div>
                <TaskForm addTask={this.addTask.bind(this)}/>
            </div>
        );
        let tasksLeft = this.tasksLeft();
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
