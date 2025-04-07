import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { Button, TextField, Typography, Paper, Box, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const { user, logout } = useContext(AuthContext);
  const { toggleTheme, mode } = useContext(ThemeContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:3001/tasks', {
      headers: { 'Authorization': `Bearer ${user.token}` }
    });
    const data = await res.json();
    setTasks(data);
  };

  const createTask = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({ title })
    });
    setTitle('');
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:3001/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${user.token}` }
    });
    fetchTasks();
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
  };

  const saveEdit = async (id) => {
    await fetch(`http://localhost:3001/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({ title: editedTitle })
    });
    setEditingTaskId(null);
    fetchTasks();
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditedTitle('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">Tasks</Typography>
          <IconButton onClick={toggleTheme} color="inherit">
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
          <Button variant="contained" color="error" onClick={logout}>
            Logout
          </Button>
        </Box>
        <form onSubmit={createTask}>
          <Box display="flex" gap={2} mb={3}>
            <TextField
              label="New Task"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </Box>
        </form>
        <List>
          {tasks.map(task => (
            <ListItem
              key={task.id}
              sx={{ mb: 1, borderRadius: 1 }}
            >
              {editingTaskId === task.id ? (
                <Box display="flex" alignItems="center" width="100%" gap={2}>
                  <TextField
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => saveEdit(task.id)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <>
                  <ListItemText primary={task.title} />
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => startEditing(task)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteTask(task.id)}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                </>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Tasks;