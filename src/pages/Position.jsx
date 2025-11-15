import { useState, useEffect } from "react";
import { Button, Table, Form, Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../css/Position.css";
import "../css/Dashboard.css";

function Position() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [positions, setPositions] = useState([]);
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

  // Load positions from localStorage
  useEffect(() => {
    const loadPositions = () => {
      const stored = localStorage.getItem("positions");
      if (stored) {
        setPositions(JSON.parse(stored));
      } else {
        // Initialize with default positions
        const defaultPositions = [
          { id: 1, name: "Software Engineer", description: "Software development role" },
          { id: 2, name: "Senior Software Engineer", description: "Senior software development role" },
          { id: 3, name: "HR Manager", description: "Human resources management" },
          { id: 4, name: "HR Executive", description: "Human resources executive" },
          { id: 5, name: "Sales Executive", description: "Sales and business development" },
          { id: 6, name: "Sales Manager", description: "Sales team management" },
          { id: 7, name: "Marketing Manager", description: "Marketing team management" },
          { id: 8, name: "Marketing Executive", description: "Marketing execution" },
          { id: 9, name: "Finance Manager", description: "Finance team management" },
          { id: 10, name: "Accountant", description: "Accounting and bookkeeping" },
          { id: 11, name: "Operations Manager", description: "Operations management" },
          { id: 12, name: "IT Manager", description: "IT team management" },
          { id: 13, name: "IT Support", description: "IT support and maintenance" },
          { id: 14, name: "Customer Service Representative", description: "Customer support role" },
        ];
        localStorage.setItem("positions", JSON.stringify(defaultPositions));
        setPositions(defaultPositions);
      }
    };

    loadPositions();
    window.addEventListener("positionsUpdated", loadPositions);
    return () => window.removeEventListener("positionsUpdated", loadPositions);
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
      newErrors.name = "Position name is required";
    } else {
      // Check for duplicate name (excluding current editing item)
      const exists = positions.some(
        (pos) =>
          pos.name.toLowerCase() === formData.name.toLowerCase().trim() &&
          pos.id !== editingId
      );
      if (exists) {
        newErrors.name = "Position name already exists";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (editingId) {
        // Update existing position
        const updated = positions.map((pos) =>
          pos.id === editingId
            ? { ...pos, name: formData.name.trim(), description: formData.description.trim() }
            : pos
        );
        setPositions(updated);
        localStorage.setItem("positions", JSON.stringify(updated));
      } else {
        // Create new position
        const newId =
          positions.length > 0
            ? Math.max(...positions.map((p) => p.id)) + 1
            : 1;
        const newPos = {
          id: newId,
          name: formData.name.trim(),
          description: formData.description.trim(),
        };
        const updated = [...positions, newPos];
        setPositions(updated);
        localStorage.setItem("positions", JSON.stringify(updated));
      }

      // Reset form
      setFormData({ name: "", description: "" });
      setErrors({});
      setEditingId(null);
      window.dispatchEvent(new Event("positionsUpdated"));
    }
  };

  const handleEdit = (pos) => {
    setFormData({
      name: pos.name,
      description: pos.description || "",
    });
    setEditingId(pos.id);
    setErrors({});
    // Scroll to form
    document
      .querySelector(".sorath-position-form-card")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this position? This action cannot be undone."
      )
    ) {
      const updated = positions.filter((pos) => pos.id !== id);
      setPositions(updated);
      localStorage.setItem("positions", JSON.stringify(updated));
      window.dispatchEvent(new Event("positionsUpdated"));

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
                <div className="sorath-position-page">
                  <Row className="mb-4">
                    <Col>
                      <h1 className="sorath-page-title">Positions</h1>
                      <p className="sorath-page-subtitle">
                        Manage positions for your system
                      </p>
                    </Col>
                  </Row>

                  {/* Form Section */}
                  <Row className="mb-4">
                    <Col xs={12} lg={6}>
                      <div className="sorath-position-form-card">
                        <h3 className="sorath-form-card-title">
                          {editingId ? "Edit Position" : "Add New Position"}
                        </h3>
                        <Form onSubmit={handleSubmit}>
                          <Form.Group className="mb-3" controlId="positionName">
                            <Form.Label className="sorath-form-label">
                              Position Name{" "}
                              <span className="sorath-required">*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Enter position name"
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

                          <Form.Group className="mb-3" controlId="positionDescription">
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
                              {editingId ? "Update" : "Add Position"}
                            </Button>
                          </div>
                        </Form>
                      </div>
                    </Col>

                    {/* List Section */}
                    <Col xs={12} lg={6}>
                      <div className="sorath-position-list-card">
                        <h3 className="sorath-form-card-title">Positions List</h3>
                        {positions.length === 0 ? (
                          <div className="sorath-empty-state">
                            <div className="sorath-empty-content">
                              <i className="bi bi-briefcase"></i>
                              <p>No positions found. Add your first position.</p>
                            </div>
                          </div>
                        ) : (
                          <Table className="sorath-position-table" responsive>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {positions.map((pos) => (
                                <tr key={pos.id}>
                                  <td>
                                    <strong>{pos.name}</strong>
                                  </td>
                                  <td>{pos.description || "-"}</td>
                                  <td>
                                    <div className="sorath-action-buttons">
                                      <button
                                        className="sorath-action-btn"
                                        title="Edit"
                                        onClick={() => handleEdit(pos)}
                                      >
                                        <i className="bi bi-pencil"></i>
                                      </button>
                                      <button
                                        className="sorath-action-btn sorath-action-btn-danger"
                                        title="Delete"
                                        onClick={() => handleDelete(pos.id)}
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

export default Position;

