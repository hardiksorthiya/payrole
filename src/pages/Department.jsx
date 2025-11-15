import { useState, useEffect } from "react";
import { Button, Table, Form, Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../css/Department.css";
import "../css/Dashboard.css";

function Department() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

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

  // Load departments from localStorage
  useEffect(() => {
    const loadDepartments = () => {
      const stored = localStorage.getItem("departments");
      if (stored) {
        setDepartments(JSON.parse(stored));
      } else {
        // Initialize with default departments
        const defaultDepartments = [
          { id: 1, name: "Engineering", description: "Software development and engineering" },
          { id: 2, name: "HR", description: "Human resources management" },
          { id: 3, name: "Sales", description: "Sales and business development" },
          { id: 4, name: "Marketing", description: "Marketing and communications" },
          { id: 5, name: "Finance", description: "Finance and accounting" },
          { id: 6, name: "Operations", description: "Operations management" },
          { id: 7, name: "IT", description: "Information technology" },
          { id: 8, name: "Customer Service", description: "Customer support and service" },
        ];
        localStorage.setItem("departments", JSON.stringify(defaultDepartments));
        setDepartments(defaultDepartments);
      }
    };

    loadDepartments();
    window.addEventListener("departmentsUpdated", loadDepartments);
    return () => window.removeEventListener("departmentsUpdated", loadDepartments);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Department name is required";
    } else {
      // Check for duplicate name (excluding current editing item)
      const exists = departments.some(
        (dept) =>
          dept.name.toLowerCase() === formData.name.toLowerCase().trim() &&
          dept.id !== editingId
      );
      if (exists) {
        newErrors.name = "Department name already exists";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (editingId) {
        // Update existing department
        const updated = departments.map((dept) =>
          dept.id === editingId
            ? { ...dept, name: formData.name.trim(), description: formData.description.trim() }
            : dept
        );
        setDepartments(updated);
        localStorage.setItem("departments", JSON.stringify(updated));
      } else {
        // Create new department
        const newId =
          departments.length > 0
            ? Math.max(...departments.map((d) => d.id)) + 1
            : 1;
        const newDept = {
          id: newId,
          name: formData.name.trim(),
          description: formData.description.trim(),
        };
        const updated = [...departments, newDept];
        setDepartments(updated);
        localStorage.setItem("departments", JSON.stringify(updated));
      }

      // Reset form
      setFormData({ name: "", description: "" });
      setErrors({});
      setEditingId(null);
      window.dispatchEvent(new Event("departmentsUpdated"));
    }
  };

  const handleEdit = (dept) => {
    setFormData({
      name: dept.name,
      description: dept.description || "",
    });
    setEditingId(dept.id);
    setErrors({});
    // Scroll to form
    document
      .querySelector(".sorath-department-form-card")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this department? This action cannot be undone."
      )
    ) {
      const updated = departments.filter((dept) => dept.id !== id);
      setDepartments(updated);
      localStorage.setItem("departments", JSON.stringify(updated));
      window.dispatchEvent(new Event("departmentsUpdated"));

      // Reset form if editing deleted item
      if (editingId === id) {
        setFormData({ name: "", description: "" });
        setEditingId(null);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "" });
    setErrors({});
    setEditingId(null);
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
                <div className="sorath-department-page">
                  <Row className="mb-4">
                    <Col>
                      <h1 className="sorath-page-title">Departments</h1>
                      <p className="sorath-page-subtitle">
                        Manage departments for your system
                      </p>
                    </Col>
                  </Row>

                  {/* Form Section */}
                  <Row className="mb-4">
                    <Col xs={12} lg={6}>
                      <div className="sorath-department-form-card">
                        <h3 className="sorath-form-card-title">
                          {editingId ? "Edit Department" : "Add New Department"}
                        </h3>
                        <Form onSubmit={handleSubmit}>
                          <Form.Group className="mb-3" controlId="departmentName">
                            <Form.Label className="sorath-form-label">
                              Department Name{" "}
                              <span className="sorath-required">*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Enter department name"
                              className={`sorath-form-control ${
                                errors.name ? "is-invalid" : ""
                              }`}
                              required
                            />
                            {errors.name && (
                              <div className="sorath-invalid-feedback">
                                {errors.name}
                              </div>
                            )}
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="departmentDescription">
                            <Form.Label className="sorath-form-label">
                              Description
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              placeholder="Enter description (optional)"
                              className="sorath-form-control"
                            />
                          </Form.Group>

                          <div className="sorath-form-actions">
                            {editingId && (
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCancel}
                                className="sorath-btn-secondary"
                              >
                                Cancel
                              </Button>
                            )}
                            <Button type="submit" className="sorath-btn-primary">
                              {editingId ? "Update" : "Add Department"}
                            </Button>
                          </div>
                        </Form>
                      </div>
                    </Col>

                    {/* List Section */}
                    <Col xs={12} lg={6}>
                      <div className="sorath-department-list-card">
                        <h3 className="sorath-form-card-title">Departments List</h3>
                        {departments.length === 0 ? (
                          <div className="sorath-empty-state">
                            <div className="sorath-empty-content">
                              <i className="bi bi-building"></i>
                              <p>No departments found. Add your first department.</p>
                            </div>
                          </div>
                        ) : (
                          <Table className="sorath-department-table" responsive>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {departments.map((dept) => (
                                <tr key={dept.id}>
                                  <td>
                                    <strong>{dept.name}</strong>
                                  </td>
                                  <td>{dept.description || "-"}</td>
                                  <td>
                                    <div className="sorath-action-buttons">
                                      <button
                                        className="sorath-action-btn"
                                        title="Edit"
                                        onClick={() => handleEdit(dept)}
                                      >
                                        <i className="bi bi-pencil"></i>
                                      </button>
                                      <button
                                        className="sorath-action-btn sorath-action-btn-danger"
                                        title="Delete"
                                        onClick={() => handleDelete(dept.id)}
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        )}
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

export default Department;

