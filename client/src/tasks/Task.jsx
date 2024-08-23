import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { CirclePlus, Pencil, Trash2, ChevronRight, Save } from "lucide-react";
import Navbar from "../Navbar";
import Cookies from "js-cookie";

function Tasks() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const token = Cookies.get("token");
  const [values, setValues] = useState({
    task: "",
  });
  const [editTask, setEditTask] = useState("");
  const [errors, setErrors] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);

  function TaskValidation(values) {
    let error = {};

    if (values.task === "") {
      error.task = "Please enter a task";
    } else {
      error.task = "";
    }

    return error;
  }

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          setName(res.data.name);
        } else {
          navigate("/");
        }
      })
      .then((err) => console.log(err));

    getTasks();
  }, []);

  const getTasks = () => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = TaskValidation(values);
    setErrors(err);
    if (err.task === "") {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/task`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.Status === "Success") {
            console.log(res);
            getTasks();
            setValues({ task: "" });
          } else {
            console.log(res.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const handleInput = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditInput = (e) => {
    setEditTask(e.target.value);
  };

  const handleDelete = (task_id) => {
    console.log(task_id);
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/delete/` + task_id)
      .then((res) => {
        getTasks();
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const handleComplete = (task_id) => {
    console.log(task_id);
    axios
      .put(`${import.meta.env.VITE_BACKEND_URL}/complete/` + task_id)
      .then((res) => {
        setData(data.filter((task) => task.task_id !== task_id));
        getTasks();
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (task_id) => {
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/edit/` + task_id,
        { task: editTask },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.Status === "Success") {
          console.log(res);
          setEditingTaskId(null);
          getTasks();
        } else {
          alert("Error updating task.");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Navbar page="tasks" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-left text-3xl font-semibold leading-9 tracking-tight text-gray-900">
            {name}'s Tasks
          </h1>
        </div>
        <div className="mt-10 w-full">
          <form noValidate onSubmit={handleSubmit}>
            <div className="mt-2 flex items-start">
              <div className="flex-grow flex flex-col">
                <div>
                  <input
                    id="task"
                    name="task"
                    type="text"
                    value={values.task}
                    placeholder="Add a new task"
                    required
                    onChange={handleInput}
                    className={`block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6 ${
                      errors.task ? "border-red-500" : "border-0"
                    }`}
                  />
                </div>
                {errors.task && (
                  <span className="block mt-2 text-sm text-red-500 text-left">
                    Please enter your task
                  </span>
                )}
              </div>

              <button className="flex sticky top-0 items-center rounded-md ml-2 px-3 py-1.5 text-sm text-blue-700 leading-6 hover:text-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                <CirclePlus size={16} className="mr-2" /> Add
              </button>
            </div>
          </form>
          <ul role="list" className="divide-y divide-gray-100 mt-6">
            {data.length === 0 ? (
              <li className="py-5 text-center text-gray-500">
                You have no tasks
              </li>
            ) : (
              data.map((task) => (
                <li
                  key={task._id}
                  className="flex justify-between gap-x-6 py-5"
                >
                  <div className="flex min-w-0 flex-grow gap-x-4 items-center">
                    <button
                      onClick={() => handleComplete(task._id)}
                      className="flex rounded-full w-4 h-4 border border-gray-400 shrink-0 hover:bg-gray-400"
                    ></button>
                    <div className="min-w-0 flex-auto">
                      {editingTaskId === task._id ? (
                        <input
                          className="block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6 border-0"
                          value={editTask}
                          onChange={handleEditInput}
                        />
                      ) : (
                        <p className="font-semibold truncate leading-9 text-gray-900 text-left">
                          {task.task}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex gap-x-4 ml-6">
                    {editingTaskId === task._id ? (
                      <button
                        onClick={() => handleEdit(task._id)}
                        className="flex items-center rounded-md px-3 py-1.5 text-sm text-blue-700 leading-6 hover:text-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                      >
                        <Save size={16} className="mr-2" />
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingTaskId(task._id);
                          setEditTask(task.task);
                        }}
                        className="flex items-center rounded-md px-3 py-1.5 text-sm text-blue-700 leading-6 hover:text-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                      >
                        <Pencil size={16} className="mr-2" />
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="flex items-center rounded-md px-3 py-1.5 text-sm text-red-600 leading-6 hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Tasks;
