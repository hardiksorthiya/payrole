import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../css/Employees.css";
import "../css/Dashboard.css";

function Employees() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      calculateSidebarWidth();
    };

    const calculateSidebarWidth = () => {
      if (isMobile) {
        setSidebarWidth(0);
      } else {
        const sidebarEl = document.querySelector(".sorath-sidebar");
        if (sidebarEl) {
          setSidebarWidth(sidebarEl.offsetWidth);
        } else {
          const width = sidebarOpen
            ? window.innerWidth * 0.12
            : window.innerWidth * 0.05;
          setSidebarWidth(
            Math.min(
              Math.max(width, sidebarOpen ? 200 : 70),
              sidebarOpen ? 280 : 80
            )
          );
        }
      }
    };

    calculateSidebarWidth();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen, isMobile]);

  useEffect(() => {
    if (isMobile) {
      setSidebarWidth(0);
    } else {
      const width = sidebarOpen
        ? Math.min(Math.max(window.innerWidth * 0.12, 200), 280)
        : Math.min(Math.max(window.innerWidth * 0.05, 70), 80);
      setSidebarWidth(width);
    }
  }, [sidebarOpen, isMobile]);

  // Initialize localStorage with dummy data if empty
  useEffect(() => {
    const storedEmployees = localStorage.getItem("employees");
    if (!storedEmployees) {
      const initialEmployees = [
        {
          id: 1,
          employeeId: "EMP001",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@company.com",
          phone: "+1 234-567-8900",
          department: "Engineering",
          position: "Software Engineer",
          joinDate: "2023-01-15",
          status: "Active",
          payrollType: "monthly",
          payrollAmount: "7500",
        },
        {
          id: 2,
          employeeId: "EMP002",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@company.com",
          phone: "+1 234-567-8901",
          department: "HR",
          position: "HR Manager",
          joinDate: "2022-06-20",
          status: "Active",
          payrollType: "monthly",
          payrollAmount: "8500",
        },
        {
          id: 3,
          employeeId: "EMP003",
          firstName: "Mike",
          lastName: "Johnson",
          email: "mike.johnson@company.com",
          phone: "+1 234-567-8902",
          department: "Sales",
          position: "Sales Executive",
          joinDate: "2023-03-10",
          status: "Active",
          payrollType: "hourly",
          payrollAmount: "35",
        },
      ];
      localStorage.setItem("employees", JSON.stringify(initialEmployees));
      setEmployees(initialEmployees);
    } else {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, []);

  // Load employees from localStorage on mount and when it changes
  useEffect(() => {
    const loadEmployees = () => {
      const storedEmployees = localStorage.getItem("employees");
      if (storedEmployees) {
        setEmployees(JSON.parse(storedEmployees));
      }
    };

    loadEmployees();
    
    // Listen for custom event when employees are updated
    const handleEmployeesUpdated = () => {
      loadEmployees();
    };
    
    // Listen for storage changes (when form page updates employees in different tab)
    window.addEventListener("storage", loadEmployees);
    // Listen for custom event (when form page updates employees in same window)
    window.addEventListener("employeesUpdated", handleEmployeesUpdated);
    // Reload when page becomes visible (user navigates back)
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        loadEmployees();
      }
    });
    
    return () => {
      window.removeEventListener("storage", loadEmployees);
      window.removeEventListener("employeesUpdated", handleEmployeesUpdated);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCreateClick = () => {
    navigate("/employees/create");
  };

  const handleEditClick = (employeeId) => {
    navigate(`/employees/edit/${employeeId}`);
  };

  const handleDeleteClick = (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      const updatedEmployees = employees.filter((employee) => employee.id !== employeeId);
      setEmployees(updatedEmployees);
      localStorage.setItem("employees", JSON.stringify(updatedEmployees));
      // Dispatch event to notify other components
      window.dispatchEvent(new Event("employeesUpdated"));
    }
  };

  return (
    <div className="sorath-dashboard">
      <div className="sorath-dashboard-content">
        <Sidebar isOpen={sidebarOpen} />
        <main
          className="sorath-main-content"
          style={{
            marginLeft: isMobile ? "0" : `${sidebarWidth}px`,
            width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
          }}
        >
          <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          <Container fluid className="sorath-main-inner">
            <Row>
              <Col>
                <div className="sorath-employees-page">
                  <Row className="sorath-page-header mb-4">
                    <Col xs={12} md={6}>
                      <h1 className="sorath-page-title">Employees</h1>
                      <p className="sorath-page-subtitle">Manage your employees</p>
                    </Col>
                    <Col xs={12} md={6} className="d-flex justify-content-md-end align-items-start">
                      <Button
                        className="sorath-btn-primary"
                        onClick={handleCreateClick}
                      >
                        <i className="bi bi-plus-circle"></i> Create Employee
                      </Button>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <div className="sorath-employees-table-container">
                        <Table className="sorath-employees-table" responsive>
                          <thead>
                            <tr>
                              <th>Employee ID</th>
                              <th>First Name</th>
                              <th>Last Name</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Department</th>
                              <th>Position</th>
                              <th>Join Date</th>
                              <th>Payroll</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {employees.length === 0 ? (
                              <tr>
                                <td colSpan="11" className="sorath-empty-state">
                                  <div className="sorath-empty-content">
                                    <i className="bi bi-person-badge"></i>
                                    <p>No employees found. Create your first employee to get started.</p>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              employees.map((employee) => (
                                <tr key={employee.id}>
                                  <td>{employee.employeeId}</td>
                                  <td>{employee.firstName}</td>
                                  <td>{employee.lastName}</td>
                                  <td>{employee.email}</td>
                                  <td>{employee.phone}</td>
                                  <td>{employee.department || "-"}</td>
                                  <td>{employee.position || "-"}</td>
                                  <td>{employee.joinDate || "-"}</td>
                                  <td>
                                    {employee.payrollAmount ? (
                                      <div>
                                        <div className="sorath-payroll-amount">
                                          {typeof employee.payrollAmount === 'number' 
                                            ? employee.payrollAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
                                            : parseFloat(employee.payrollAmount).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                                        </div>
                                        <div className="sorath-payroll-type">
                                          <span className="sorath-payroll-type-badge">
                                            {employee.payrollType === "monthly" ? "Monthly" : employee.payrollType === "hourly" ? "Hourly" : "Fixed"}
                                          </span>
                                        </div>
                                      </div>
                                    ) : (
                                      "-"
                                    )}
                                  </td>
                                  <td>
                                    <span className={`sorath-status-badge ${employee.status === "Active" ? "sorath-status-active" : "sorath-status-inactive"}`}>
                                      {employee.status || "Active"}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="sorath-action-buttons">
                                      {employee.resumeFileName && (
                                        <a
                                          href={employee.resume}
                                          download={employee.resumeFileName}
                                          className="sorath-action-btn"
                                          title="Download Resume"
                                        >
                                          <i className="bi bi-download"></i>
                                        </a>
                                      )}
                                      <button
                                        className="sorath-action-btn"
                                        title="Edit"
                                        onClick={() => handleEditClick(employee.id)}
                                      >
                                        <i className="bi bi-pencil"></i>
                                      </button>
                                      <button
                                        className="sorath-action-btn sorath-action-btn-danger"
                                        title="Delete"
                                        onClick={() => handleDeleteClick(employee.id)}
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
    </div>
  );
}

export default Employees;

