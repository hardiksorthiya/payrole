import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../css/ClientForm.css";
import "../css/Dashboard.css";

function ClientForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarWidth, setSidebarWidth] = useState(0);

  const [formData, setFormData] = useState({
    type: "",
    name: "",
    company: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
  });

  const [errors, setErrors] = useState({});
  const [clientTypes, setClientTypes] = useState([]);

  // Load client types from localStorage
  useEffect(() => {
    const loadClientTypes = () => {
      const stored = localStorage.getItem("clientTypes");
      if (stored) {
        setClientTypes(JSON.parse(stored));
      } else {
        // Default client types if not found
        const defaultTypes = [
          { id: 1, name: "Individual", description: "Individual client" },
          { id: 2, name: "Business", description: "Business client" },
        ];
        setClientTypes(defaultTypes);
      }
    };

    loadClientTypes();
    window.addEventListener("clientTypesUpdated", loadClientTypes);
    return () => window.removeEventListener("clientTypesUpdated", loadClientTypes);
  }, []);

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

  // Load client data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const clients = JSON.parse(localStorage.getItem("clients") || "[]");
      const client = clients.find((c) => c.id === parseInt(id));
      if (client) {
        // Handle migration from old address format to new format
        let addressLine1 = "";
        let addressLine2 = "";
        let city = "";
        let state = "";
        let country = "";

        if (client.address && typeof client.address === "string") {
          // Old format: single address string
          addressLine1 = client.address;
        } else {
          // New format: separate fields
          addressLine1 = client.addressLine1 || "";
          addressLine2 = client.addressLine2 || "";
          city = client.city || "";
          state = client.state || "";
          country = client.country || "";
        }

        setFormData({
          type: client.type || "",
          name: client.name || "",
          company: client.company || "",
          email: client.email || "",
          phone: client.phone || "",
          addressLine1: addressLine1,
          addressLine2: addressLine2,
          city: city,
          state: state,
          country: country,
        });
      }
    }
  }, [id, isEditMode]);

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

    if (!formData.type) {
      newErrors.type = "Client type is required";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const clients = JSON.parse(localStorage.getItem("clients") || "[]");

      if (isEditMode) {
        // Update existing client
        const updatedClients = clients.map((client) =>
          client.id === parseInt(id)
            ? {
                ...client,
                ...formData,
              }
            : client
        );
        localStorage.setItem("clients", JSON.stringify(updatedClients));
      } else {
        // Create new client
        const newClient = {
          id: clients.length > 0 ? Math.max(...clients.map((c) => c.id)) + 1 : 1,
          ...formData,
        };
        localStorage.setItem("clients", JSON.stringify([...clients, newClient]));
      }

      // Dispatch custom event to refresh clients list
      window.dispatchEvent(new Event("clientsUpdated"));
      
      // Navigate back to clients list
      navigate("/clients");
    }
  };

  const handleCancel = () => {
    navigate("/clients");
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
                <div className="sorath-client-form-page">
                  <Row className="mb-4">
                    <Col>
                      <h1 className="sorath-page-title">
                        {isEditMode ? "Edit Client" : "Create New Client"}
                      </h1>
                      <p className="sorath-page-subtitle">
                        {isEditMode
                          ? "Update client information"
                          : "Add a new client to your system"}
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} lg={8} xl={6}>
                      <div className="sorath-client-form-card">
                        <Form onSubmit={handleSubmit}>
                          <Form.Group className="mb-3" controlId="clientType">
                            <Form.Label className="sorath-form-label">
                              Client Type <span className="sorath-required">*</span>
                            </Form.Label>
                            <Form.Select
                              name="type"
                              value={formData.type}
                              onChange={handleInputChange}
                              className={`sorath-form-control ${
                                errors.type ? "is-invalid" : ""
                              }`}
                              required
                            >
                              <option value="">Select Client Type</option>
                              {clientTypes.map((clientType) => (
                                <option key={clientType.id} value={clientType.name}>
                                  {clientType.name}
                                </option>
                              ))}
                            </Form.Select>
                            {errors.type && (
                              <div className="sorath-invalid-feedback">
                                {errors.type}
                              </div>
                            )}
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="clientName">
                            <Form.Label className="sorath-form-label">
                              Name <span className="sorath-required">*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Enter client name"
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

                          <Form.Group className="mb-3" controlId="clientCompany">
                            <Form.Label className="sorath-form-label">
                              Company
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              placeholder="Enter company name"
                              className="sorath-form-control"
                            />
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="clientEmail">
                            <Form.Label className="sorath-form-label">
                              Email <span className="sorath-required">*</span>
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Enter email address"
                              className={`sorath-form-control ${
                                errors.email ? "is-invalid" : ""
                              }`}
                              required
                            />
                            {errors.email && (
                              <div className="sorath-invalid-feedback">
                                {errors.email}
                              </div>
                            )}
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="clientPhone">
                            <Form.Label className="sorath-form-label">
                              Phone Number <span className="sorath-required">*</span>
                            </Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="Enter phone number"
                              className={`sorath-form-control ${
                                errors.phone ? "is-invalid" : ""
                              }`}
                              required
                            />
                            {errors.phone && (
                              <div className="sorath-invalid-feedback">
                                {errors.phone}
                              </div>
                            )}
                          </Form.Group>

                          <Row>
                            <Col xs={12}>
                              <h5 className="sorath-form-section-title mb-3">Address Information</h5>
                            </Col>
                          </Row>

                          <Form.Group className="mb-3" controlId="clientAddressLine1">
                            <Form.Label className="sorath-form-label">
                              Address Line 1
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="addressLine1"
                              value={formData.addressLine1}
                              onChange={handleInputChange}
                              placeholder="Enter street address"
                              className="sorath-form-control"
                            />
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="clientAddressLine2">
                            <Form.Label className="sorath-form-label">
                              Address Line 2
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="addressLine2"
                              value={formData.addressLine2}
                              onChange={handleInputChange}
                              placeholder="Enter apartment, suite, etc. (optional)"
                              className="sorath-form-control"
                            />
                          </Form.Group>

                          <Row>
                            <Col xs={12} md={6}>
                              <Form.Group className="mb-3" controlId="clientCity">
                                <Form.Label className="sorath-form-label">
                                  City
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleInputChange}
                                  placeholder="Enter city"
                                  className="sorath-form-control"
                                />
                              </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                              <Form.Group className="mb-3" controlId="clientState">
                                <Form.Label className="sorath-form-label">
                                  State
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="state"
                                  value={formData.state}
                                  onChange={handleInputChange}
                                  placeholder="Enter state"
                                  className="sorath-form-control"
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          <Form.Group className="mb-4" controlId="clientCountry">
                            <Form.Label className="sorath-form-label">
                              Country
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              placeholder="Enter country"
                              className="sorath-form-control"
                            />
                          </Form.Group>

                          <div className="sorath-form-actions">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={handleCancel}
                              className="sorath-btn-secondary"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="sorath-btn-primary"
                            >
                              {isEditMode ? "Update Client" : "Create Client"}
                            </Button>
                          </div>
                        </Form>
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

export default ClientForm;

