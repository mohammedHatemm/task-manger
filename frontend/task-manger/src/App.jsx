import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Dashboard from './pages/Admin/Dashboard';
import ManagerTasks from './pages/Admin/MangerTask';
import MangerUser from './pages/Admin/MangerUser';
import CreateTasks from './pages/Admin/CreateTasks';
import UserDashboard from './pages/Users/UserDashboard';
import MyTasks from './pages/Users/MyTasks';
import ViewTasksDetaila from './pages/Users/ViewTasksDetaila';
import PrivetRoutes from './routes/PrivetRoutes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* Admin Routes */}
        <Route element={<PrivetRoutes allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/tasks" element={<ManagerTasks />} />
          <Route path="/admin/users" element={<MangerUser />} />
          <Route path="/admin/create-tasks" element={<CreateTasks />} />
        </Route>
        {/* User Routes */}
        <Route element={<PrivetRoutes allowedRoles={['user']} />}>
          <Route path="/users" element={<UserDashboard />} />
          <Route path="/users/tasks" element={<MyTasks />} />
          <Route path="/users/tasks-details/:id" element={<ViewTasksDetaila />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
