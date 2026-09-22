import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Todo({ session, onLogout }) {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState("");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.token}`,
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tasks`, {
          headers: authHeaders,
        });

        if (!res.ok) throw new Error("Failed to fetch tasks");
        setTasks(await res.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [session?.token]);

  const addTask = async () => {
    const title = task.trim();
    if (!title) return;

    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          title,
          priority,
          dueDate: dueDate || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to add task");

      const newTask = await res.json();
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      setTask("");
      setPriority("medium");
      setDueDate("");
    } catch (error) {
      console.error(error);
    }
  };

  const completeTask = async (id, completed) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          completed: !completed,
        }),
      });

      if (!res.ok) throw new Error("Failed to update task status");

      const updatedTask = await res.json();

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks((prevTasks) => prevTasks.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = async (id) => {
    const title = editedTask.trim();
    if (!title) return;

    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to update task");

      const updatedTask = await res.json();
      setTasks((prevTasks) =>
        prevTasks.map((item) => (item._id === id ? updatedTask : item))
      );
      setEditingId(null);
      setEditedTask("");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="status-message">Loading tasks...</p>;

  return (
    <main className="todo-shell">
      <header className="todo-header">
        <div className="topbar">
          <div>
            <p className="eyebrow">Daily focus</p>
            <h1>Make room for what matters.</h1>
          </div>
          <button className="logout-button" onClick={onLogout}>Logout</button>
        </div>
        <p className="subtitle">Welcome back, {session?.user?.name || "friend"}.</p>
      </header>

      <section className="todo-panel">
        <div className="add-task">
          <input
            type="text"
            placeholder="What needs doing?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-label="Due date"
          />
          <button className="add-button" onClick={addTask}>Add task</button>
        </div>

        <div className="list-heading">
          <h2>Your tasks</h2>
          <span className="task-count">
            {tasks.length} {tasks.length === 1 ? "item" : "items"}
          </span>
        </div>

        {tasks.length === 0 ? (
          <p className="empty-state">Nothing here yet. Add your first task above.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((item) => (
              <li className="task-row" key={item._id}>
                {editingId === item._id ? (
                  <div className="edit-row">
                    <input
                      value={editedTask}
                      onChange={(e) => setEditedTask(e.target.value)}
                      autoFocus
                    />
                    <button className="save-button" onClick={() => updateTask(item._id)}>Save</button>
                    <button className="cancel-button" onClick={() => { setEditingId(null); setEditedTask(""); }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="task-content">
                      <div className="task-main">
                        <span className={`task-check ${item.completed ? "done" : "pending"}`}>
                          {item.completed ? "✓" : "○"}
                        </span>
                        <div className="task-copy">
                          <span className={`task-title ${item.completed ? "done" : ""}`}>
                            {item.title}
                          </span>
                          <p className={`task-status ${item.completed ? "done" : "pending"}`}>
                            {item.completed ? "✅ Completed" : "⏳ Pending"}
                          </p>
                          <div className="task-details">
                            <span className={`priority priority-${item.priority || "medium"}`}>
                              {item.priority || "medium"} priority
                            </span>
                            {item.dueDate && (
                              <span>Due {new Date(item.dueDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="task-actions">
                      <button
                        className={`complete-button ${item.completed ? "done" : "pending"}`}
                        onClick={() => completeTask(item._id, item.completed)}
                      >
                        {item.completed ? "Undo" : "Complete"}
                      </button>
                      <button className="edit-button" onClick={() => { setEditingId(item._id); setEditedTask(item.title); }}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => deleteTask(item._id)}>Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default Todo;
