import React, { useState } from "react";
import { Plus, Edit3, Trash2, GripVertical } from "lucide-react";
type Status = "todo" | "pending" | "verify" | "done";
type Priority = "low" | "medium" | "high";

interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
}

interface Column {
  id: Status;
  title: string;
  color: string;
}

type Constructs = Record<string, Task[]>;

const KanbanBoard: React.FC = () => {
  const [sortByPriority, setSortByPriority] = useState<boolean>(false);
  const [currentConstruct, setCurrentConstruct] =
    useState<string>("Feature Tracker");
  const [showAddConstruct, setShowAddConstruct] = useState<boolean>(false);
  const [newConstructName, setNewConstructName] = useState<string>("");

  const initialTasks: Task[] = [
    {
      id: 1,
      title: "Table data refresh on row selection",
      description: "",
      status: "done",
      priority: "medium",
    },
    // ... rest of tasks
  ];

  const [constructs, setConstructs] = useState<Constructs>({
    "Feature Tracker": initialTasks,
  });

  const [tasks, setTasks] = useState<Task[]>(
    constructs[currentConstruct] || []
  );
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
  });

  const columns: Column[] = [
    { id: "todo", title: "To Do", color: "bg-blue-500" },
    { id: "pending", title: "Pending", color: "bg-yellow-500" },
    { id: "verify", title: "Verify", color: "bg-purple-500" },
    { id: "done", title: "Done", color: "bg-green-500" },
  ];

  const priorityColors: Record<Priority, string> = {
    low: "border-l-4 border-l-green-400",
    medium: "border-l-4 border-l-yellow-400",
    high: "border-l-4 border-l-red-400",
  };

  const getTasksByStatus = (status: Status): Task[] => {
    let filteredTasks = tasks.filter((task) => task.status === status);

    if (sortByPriority) {
      const priorityOrder: Record<Priority, number> = {
        high: 3,
        medium: 2,
        low: 1,
      };
      filteredTasks = [...filteredTasks].sort(
        (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
      );
    }

    return filteredTasks;
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: number
  ) => {
    e.dataTransfer.setData("text/plain", taskId.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    newStatus: Status
  ) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData("text/plain"), 10);

    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );

    setTasks(updatedTasks);
    setConstructs((prev) => ({
      ...prev,
      [currentConstruct]: updatedTasks,
    }));
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task = {
      id: Date.now(),
      ...newTask,
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    setConstructs((prev) => ({
      ...prev,
      [currentConstruct]: updatedTasks,
    }));
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
    });
    setShowAddForm(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
    });
    setShowAddForm(true);
  };

  const handleUpdateTask = () => {
    if (!newTask.title.trim()) return;

    const updatedTasks = tasks.map((task) =>
      task.id === editingTask?.id ? { ...editingTask, ...newTask } : task
    );

    setTasks(updatedTasks);
    setConstructs((prev) => ({
      ...prev,
      [currentConstruct]: updatedTasks,
    }));

    setEditingTask(null);
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
    });
    setShowAddForm(false);
  };

  const handleDeleteTask = (taskId: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    setConstructs((prev) => ({
      ...prev,
      [currentConstruct]: updatedTasks,
    }));
  };

  const handleConstructChange = (constructName: string) => {
    setCurrentConstruct(constructName);
    setTasks(constructs[constructName] || []);
  };

  const handleAddConstruct = () => {
    if (!newConstructName.trim()) return;

    const constructName = newConstructName.trim();
    if (constructs[constructName]) {
      alert("Construct already exists!");
      return;
    }

    setConstructs((prev) => ({
      ...prev,
      [constructName]: [],
    }));

    setCurrentConstruct(constructName);
    setTasks([]);
    setNewConstructName("");
    setShowAddConstruct(false);
  };

  const handleDeleteConstruct = () => {
    if (Object.keys(constructs).length <= 1) {
      alert("Cannot delete the last construct!");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete "${currentConstruct}" and all its tasks?`
      )
    ) {
      const newConstructs = { ...constructs };
      delete newConstructs[currentConstruct];

      setConstructs(newConstructs);
      const firstConstruct = Object.keys(newConstructs)[0];
      setCurrentConstruct(firstConstruct);
      setTasks(newConstructs[firstConstruct] || []);
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingTask(null);
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Construct Selector */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Project Tracker
            </h1>
            <div className="flex items-center gap-2">
              <select
                value={currentConstruct}
                onChange={(e) => handleConstructChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(constructs).map((construct) => (
                  <option key={construct} value={construct}>
                    {construct}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowAddConstruct(true)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
              >
                + New
              </button>
              {Object.keys(constructs).length > 1 && (
                <button
                  onClick={handleDeleteConstruct}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={sortByPriority}
                onChange={(e) => setSortByPriority(e.target.checked)}
                className="rounded border-gray-300"
              />
              Sort by Priority
            </label>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>
        </div>

        {/* Add Construct Modal */}
        {showAddConstruct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-semibold mb-4">Add New Construct</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Construct Name
                  </label>
                  <input
                    type="text"
                    value={newConstructName}
                    onChange={(e) => setNewConstructName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., A Tracker, B Tracker..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddConstruct(false);
                    setNewConstructName("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddConstruct}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Add Construct
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Task Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-semibold mb-4">
                {editingTask ? "Edit Task" : "Add New Task"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Task title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Task description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={newTask.status}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          status: e.target.value as Status,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="todo">To Do</option>
                      <option value="pending">Pending</option>
                      <option value="verify">Verify</option>
                      <option value="done">Done</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          priority: e.target.value as Priority,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={cancelForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingTask ? handleUpdateTask : handleAddTask}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  {editingTask ? "Update" : "Add"} Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="bg-white rounded-lg shadow-sm">
              <div className={`${column.color} text-white p-4 rounded-t-lg`}>
                <h2 className="font-semibold text-lg">{column.title}</h2>
                <span className="text-sm opacity-90">
                  {getTasksByStatus(column.id).length} items
                </span>
              </div>

              <div
                className="p-4 min-h-96 space-y-3"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {getTasksByStatus(column.id).map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className={`bg-gray-50 border rounded-lg p-3 cursor-move hover:shadow-md transition-shadow ${
                      priorityColors[task.priority]
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 text-sm leading-tight">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <GripVertical size={14} className="text-gray-400" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {task.priority}
                      </span>

                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {getTasksByStatus(column.id).length === 0 && (
                  <div className="text-gray-400 text-center py-8 text-sm">
                    No items in {column.title.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">
            Progress Summary - {currentConstruct}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {columns.map((column) => {
              const count = getTasksByStatus(column.id).length;
              const percentage =
                tasks.length > 0
                  ? ((count / tasks.length) * 100).toFixed(1)
                  : 0;

              return (
                <div key={column.id} className="text-center">
                  <div
                    className={`${column.color} text-white rounded-lg p-4 mb-2`}
                  >
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm opacity-90">{column.title}</div>
                  </div>
                  <div className="text-sm text-gray-600">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
