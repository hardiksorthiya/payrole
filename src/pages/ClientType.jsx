import { useState, useEffect } from "react";
import { Button, Table, Form, Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../css/ClientType.css";
import "../css/Dashboard.css";

function ClientType() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [clientTypes, setClientTypes] = useState([]);
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

  // Load client types from localStorage
  useEffect(() => {
    const loadClientTypes = () => {
      const stored = localStorage.getItem("clientTypes");
      if (stored) {
        setClientTypes(JSON.parse(stored));
      } else {
        // Initialize with default client types
        const defaultTypes = [
          { id: 1, name: "Individual", description: "Individual client" },
          { id: 2, name: "Business", description: "Business client" },
        ];
        localStorage.setItem("clientTypes", JSON.stringify(defaultTypes));
        setClientTypes(defaultTypes);
      }
    };

    loadClientTypes();
    window.addEventListener("clientTypesUpdated", loadClientTypes);
    return () => window.removeEventListener("clientTypesUpdated", loadClientTypes);
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
      newErrors.name = "Client type name is required";
    } else {
      // Check for duplicate name (excluding current editing item)
      const exists = clientTypes.some(
        (type) =>
          type.name.toLowerCase() === formData.name.toLowerCase().trim() &&
          type.id !== editingId
      );
      if (exists) {
        newErrors.name = "Client type name already exists";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (editingId) {
        // Update existing client type
        const updated = clientTypes.map((type) =>
          type.id === editingId
            ? { ...type, name: formData.name.trim(), description: formData.description.trim() }
            : type
        );
        setClientTypes(updated);
        localStorage.setItem("clientTypes", JSON.stringify(updated));
      } else {
        // Create new client type
        const newId =
          clientTypes.length > 0
            ? Math.max(...clientTypes.map((t) => t.id)) + 1
            : 1;
        const newType = {
          id: newId,
          name: formData.name.trim(),
          description: formData.description.trim(),
        };
        const updated = [...clientTypes, newType];
        setClientTypes(updated);
        localStorage.setItem("clientTypes", JSON.stringify(updated));
      }

      // Reset form
      setFormData({ name: "", description: "" });
      setErrors({});
      setEditingId(null);
      window.dispatchEvent(new Event("clientTypesUpdated"));
    }
  };

  const handleEdit = (type) => {
    setFormData({
      name: type.name,
      description: type.description || "",
    });
    setEditingId(type.id);
    setErrors({});
    // Scroll to form
    document
      .querySelector(".sorath-client-type-form-card")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this client type? This action cannot be undone."
      )
    ) {
      const updated = clientTypes.filter((type) => type.id !== id);
      setClientTypes(updated);
      localStorage.setItem("clientTypes", JSON.stringify(updated));
      window.dispatchEvent(new Event("clientTypesUpdated"));

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
                <div className="sorath-client-type-page">
                  <Row className="mb-4">
                    <Col>
                      <h1 className="sorath-page-title">Client Types</h1>
                      <p className="sorath-page-subtitle">
                        Manage client types for your system
                      </p>
                    </Col>
                  </Row>

                  {/* Form Section */}
                  <Row className="mb-4">
                    <Col xs={12} lg={6}>
                      <div className="sorath-client-type-form-card">
                        <h3 className="sorath-form-card-title">
                          {editingId ? "Edit Client Type" : "Add New Client Type"}
                        </h3>
                        <Form onSubmit={handleSubmit}>
                          <Form.Group className="mb-3" controlId="clientTypeName">
                            <Form.Label className="sorath-form-label">
                              Client Type Name{" "}
                              <span className="sorath-required">*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Enter client type name"
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

                          <Form.Group className="mb-3" controlId="clientTypeDescription">
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
                              {editingId ? "Update" : "Add Client Type"}
                            </Button>
                          </div>
                        </Form>
                      </div>
                    </Col>

                    {/* List Section */}
                    <Col xs={12} lg={6}>
                      <div className="sorath-client-type-list-card">
                        <h3 className="sorath-form-card-title">Client Types List</h3>
                        {clientTypes.length === 0 ? (
                          <div className="sorath-empty-state">
                            <div className="sorath-empty-content">
                              <i className="bi bi-tags"></i>
                              <p>No client types found. Add your first client type.</p>
                            </div>
                          </div>
                        ) : (
                          <Table className="sorath-client-type-table" responsive>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {clientTypes.map((type) => (
                                <tr key={type.id}>
                                  <td>
                                    <strong>{type.name}</strong>
                                  </td>
                                  <td>{type.description || "-"}</td>
                                  <td>
                                    <div className="sorath-action-buttons">
                                      <button
                                        className="sorath-action-btn"
                                        title="Edit"
                                        onClick={() => handleEdit(type)}
                                      >
                                        <i className="bi bi-pencil"></i>
                                      </button>
                                      <button
                                        className="sorath-action-btn sorath-action-btn-danger"
                                        title="Delete"
                                        onClick={() => handleDelete(type.id)}
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

export default ClientType;

