import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import ClientForm from './pages/ClientForm'
import ClientType from './pages/ClientType'
import Companies from './pages/Companies'
import CompanyForm from './pages/CompanyForm'
import Employees from './pages/Employees'
import EmployeeForm from './pages/EmployeeForm'
import Department from './pages/Department'
import Position from './pages/Position'
import PayrollType from './pages/PayrollType'
import './css/App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/create" element={<ClientForm />} />
        <Route path="/clients/edit/:id" element={<ClientForm />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/create" element={<CompanyForm />} />
        <Route path="/companies/edit/:id" element={<CompanyForm />} />
        <Route path="/master/client-type" element={<ClientType />} />
        <Route path="/master/department" element={<Department />} />
        <Route path="/master/position" element={<Position />} />
        <Route path="/master/payroll-type" element={<PayrollType />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/create" element={<EmployeeForm />} />
        <Route path="/employees/edit/:id" element={<EmployeeForm />} />
        <Route path="/payroll" element={<Dashboard />} />
        <Route path="/attendance" element={<Dashboard />} />
        <Route path="/reports" element={<Dashboard />} />
        <Route path="/settings" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App

