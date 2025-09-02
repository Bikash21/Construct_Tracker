import React, { useState } from 'react';
import { Plus, Edit3, Trash2, GripVertical } from 'lucide-react';

const KanbanBoard = () => {
  const [sortByPriority, setSortByPriority] = useState(false);
  const [currentConstruct, setCurrentConstruct] = useState('Feature Tracker');
  const [showAddConstruct, setShowAddConstruct] = useState(false);
  const [newConstructName, setNewConstructName] = useState('');
  
  const initialTasks = [
    {
      id: 1,
      title: "Table data refresh on row selection",
      description: "",
      status: "done",
      priority: "medium"
    },
    {
      id: 2,
      title: "Accept header creation/ view data load, doing static",
      description: "acceptHeader for every refType needs to be explicitly created",
      status: "done",
      priority: "medium"
    },
    {
      id: 3,
      title: "Verify custom prop data",
      description: "",
      status: "verify",
      priority: "high"
    },
    {
      id: 4,
      title: "More/Additional field as slider drawer",
      description: "Changes in the width of the drawer for tables, check multivalue property working or not",
      status: "done",
      priority: "medium"
    },
    {
      id: 5,
      title: "Assign empty value for drawerStyle or check other feasible solution",
      description: "duplicate code for regular and slide drawer",
      status: "done",
      priority: "low"
    },
    {
      id: 6,
      title: "Enabling actions for edit",
      description: "",
      status: "done",
      priority: "medium"
    },
    {
      id: 7,
      title: "Create dataToSave/ payload",
      description: "",
      status: "done",
      priority: "medium"
    },
    {
      id: 8,
      title: "Changes for view only table",
      description: "",
      status: "pending",
      priority: "medium"
    },
    {
      id: 9,
      title: "Delete old floorplans",
      description: "",
      status: "pending",
      priority: "medium"
    },
    {
      id: 10,
      title: "Make sure every parent has correct op i.e on edit op = replace",
      description: "",
      status: "done",
      priority: "medium"
    },
    {
      id: 11,
      title: "Unsaved Changes popup handling in cancel and breadcrumbnavigation",
      description: "",
      status: "pending",
      priority: "high"
    },
    {
      id: 12,
      title: "Error message for each row in different table, done at page level",
      description: "",
      status: "done",
      priority: "medium"
    },
    {
      id: 13,
      title: "Add Button Enable and disabled",
      description: "When page loads with data all Add are disabled, check with every data load in table which one needs enabling of add based on parent info.",
      status: "pending",
      priority: "high"
    },
    {
      id: 14,
      title: "Add row Disabled Expectation",
      description: "Disabled all table add when add row is in progress. When Add row action is completed for any row, recalculate and enable only particular table add action",
      status: "todo",
      priority: "high"
    },
    {
      id: 15,
      title: "All the RefType in floorplans should have proper acceptHeader",
      description: "Add for any new refType",
      status: "done",
      priority: "medium"
    },
    {
      id: 16,
      title: "Save and cancel should work",
      description: "",
      status: "done",
      priority: "high"
    },
    {
      id: 17,
      title: "Create mode yet to be done",
      description: "",
      status: "done",
      priority: "high"
    },
    {
      id: 18,
      title: "All the flow that user will do in view and create mode",
      description: "",
      status: "verify",
      priority: "medium"
    },
    {
      id: 19,
      title: "For create mode - automagically add period and trache",
      description: "not possible - business rule - asks for sub resources",
      status: "done",
      priority: "low"
    },
    {
      id: 20,
      title: "CoverWithhold in edit mode by default when coming to edit mode",
      description: "",
      status: "done",
      priority: "medium"
    },
    {
      id: 21,
      title: "Adjustment in the column width",
      description: "",
      status: "pending",
      priority: "low"
    },
    {
      id: 22,
      title: "Header level delete/edit",
      description: "",
      status: "done",
      priority: "medium"
    },
    {
      id: 23,
      title: "Copy Feature",
      description: "Row table - only for ctl and cwr, Coverage regime label",
      status: "pending",
      priority: "medium"
    },
    {
      id: 24,
      title: "Download on coverwithhold rule",
      description: "",
      status: "done",
      priority: "medium"
    },
    {
      id: 25,
      title: "Deeplink from claims page, disable delete when in deeplink",
      description: "",
      status: "verify",
      priority: "medium"
    }
  ];

  const [constructs, setConstructs] = useState({
    'Feature Tracker': initialTasks
  });
  
  const [tasks, setTasks] = useState(constructs[currentConstruct] || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium'
  });

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-blue-500' },
    { id: 'pending', title: 'Pending', color: 'bg-yellow-500' },
    { id: 'verify', title: 'Verify', color: 'bg-purple-500' },
    { id: 'done', title: 'Done', color: 'bg-green-500' }
  ];

  const priorityColors = {
    low: 'border-l-4 border-l-green-400',
    medium: 'border-l-4 border-l-yellow-400',
    high: 'border-l-4 border-l-red-400'
  };

  const getTasksByStatus = (status) => {
    let filteredTasks = tasks.filter(task => task.status === status);
    
    if (sortByPriority) {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      filteredTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    }
    
    return filteredTasks;
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('text/plain'));
    
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    
    setTasks(updatedTasks);
    setConstructs(prev => ({
      ...prev,
      [currentConstruct]: updatedTasks
    }));
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    
    const task = {
      id: Date.now(),
      ...newTask
    };
    
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    setConstructs(prev => ({
      ...prev,
      [currentConstruct]: updatedTasks
    }));
    setNewTask({ title: '', description: '', status: 'todo', priority: 'medium' });
    setShowAddForm(false);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority
    });
    setShowAddForm(true);
  };

  const handleUpdateTask = () => {
    if (!newTask.title.trim()) return;
    
    const updatedTasks = tasks.map(task =>
      task.id === editingTask.id ? { ...editingTask, ...newTask } : task
    );
    
    setTasks(updatedTasks);
    setConstructs(prev => ({
      ...prev,
      [currentConstruct]: updatedTasks
    }));
    
    setEditingTask(null);
    setNewTask({ title: '', description: '', status: 'todo', priority: 'medium' });
    setShowAddForm(false);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    setConstructs(prev => ({
      ...prev,
      [currentConstruct]: updatedTasks
    }));
  };

  const handleConstructChange = (constructName) => {
    setCurrentConstruct(constructName);
    setTasks(constructs[constructName] || []);
  };

  const handleAddConstruct = () => {
    if (!newConstructName.trim()) return;
    
    const constructName = newConstructName.trim();
    if (constructs[constructName]) {
      alert('Construct already exists!');
      return;
    }
    
    setConstructs(prev => ({
      ...prev,
      [constructName]: []
    }));
    
    setCurrentConstruct(constructName);
    setTasks([]);
    setNewConstructName('');
    setShowAddConstruct(false);
  };

  const handleDeleteConstruct = () => {
    if (Object.keys(constructs).length <= 1) {
      alert('Cannot delete the last construct!');
      return;
    }
    
    if (confirm(`Are you sure you want to delete "${currentConstruct}" and all its tasks?`)) {
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
    setNewTask({ title: '', description: '', status: 'todo', priority: 'medium' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Construct Selector */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Project Tracker</h1>
            <div className="flex items-center gap-2">
              <select
                value={currentConstruct}
                onChange={(e) => handleConstructChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(constructs).map(construct => (
                  <option key={construct} value={construct}>{construct}</option>
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
                    setNewConstructName('');
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
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
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
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
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
                      onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
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
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
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
                  {editingTask ? 'Update' : 'Add'} Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map(column => (
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
                {getTasksByStatus(column.id).map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className={`bg-gray-50 border rounded-lg p-3 cursor-move hover:shadow-md transition-shadow ${priorityColors[task.priority]}`}
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
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
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
          <h3 className="text-lg font-semibold mb-4">Progress Summary - {currentConstruct}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {columns.map(column => {
              const count = getTasksByStatus(column.id).length;
              const percentage = tasks.length > 0 ? ((count / tasks.length) * 100).toFixed(1) : 0;
              
              return (
                <div key={column.id} className="text-center">
                  <div className={`${column.color} text-white rounded-lg p-4 mb-2`}>
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