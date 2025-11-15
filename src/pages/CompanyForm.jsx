import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Row, Col, Card, Form } from "react-bootstrap";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../css/Companies.css";
import "../css/Dashboard.css";

const initialFormState = {
  name: "",
  industry: "",
  website: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
};

function CompanyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

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
          const width = sidebarOpen ? window.innerWidth * 0.12 : window.innerWidth * 0.05;
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

  useEffect(() => {
    if (!isEditMode || !id) return;

    const storedCompanies = JSON.parse(localStorage.getItem("companies") || "[]");
    const company = storedCompanies.find((c) => c.id === parseInt(id, 10));

    if (company) {
      setFormData({
        name: company.name || "",
        industry: company.industry || "",
        website: company.website || "",
        email: company.email || "",
        phone: company.phone || "",
        addressLine1: company.addressLine1 || "",
        addressLine2: company.addressLine2 || "",
        city: company.city || "",
        state: company.state || "",
        country: company.country || "",
      });
    } else {
      navigate("/companies");
    }
  }, [id, isEditMode, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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
      newErrors.name = "Company name is required";
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const storedCompanies = JSON.parse(localStorage.getItem("companies") || "[]");

    if (isEditMode) {
      const updatedCompanies = storedCompanies.map((company) =>
        company.id === parseInt(id, 10)
          ? { ...company, ...formData }
          : company
      );
      localStorage.setItem("companies", JSON.stringify(updatedCompanies));
    } else {
      const newCompany = {
        id: storedCompanies.length > 0 ? Math.max(...storedCompanies.map((c) => c.id)) + 1 : 1,
        ...formData,
      };
      const updated = [...storedCompanies, newCompany].sort((a, b) => a.name.localeCompare(b.name));
      localStorage.setItem("companies", JSON.stringify(updated));
    }

    window.dispatchEvent(new Event("companiesUpdated"));
    navigate("/companies");
  };

  const handleCancel = () => {
    navigate("/companies");
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
                <div className="sorath-companies-page">
                  <Row className="mb-4">
                    <Col>
                      <h1 className="sorath-page-title">
                        {isEditMode ? "Edit Company" : "Create Company"}
                      </h1>
                      <p className="sorath-page-subtitle">
                        {isEditMode ? "Update company information" : "Add a new company to your system"}
                      </p>
                    </Col>
                  </Row>

                  <Row className="justify-content-center">
                    <Col xs={12} lg={7} xl={6}>
                      <Card className="sorath-company-form-card">
                        <Card.Header>
                          <h5 className="mb-0">{isEditMode ? "Company Details" : "New Company Details"}</h5>
                        </Card.Header>
                        <Card.Body>
                          <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="companyName">
                              <Form.Label>
                                Company Name <span className="sorath-required">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter company name"
                                className={errors.name ? "is-invalid" : ""}
                              />
                              {errors.name && <div className="sorath-invalid-feedback">{errors.name}</div>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="companyIndustry">
                              <Form.Label>Industry</Form.Label>
                              <Form.Control
                                type="text"
                                name="industry"
                                value={formData.industry}
                                onChange={handleInputChange}
                                placeholder="e.g., Technology"
                              />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="companyWebsite">
                              <Form.Label>Website</Form.Label>
                              <Form.Control
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                placeholder="https://example.com"
                              />
                            </Form.Group>

                            <Row className="mb-3">
                              <Col md={6}>
                                <Form.Group controlId="companyEmail">
                                  <Form.Label>
                                    Email <span className="sorath-required">*</span>
                                  </Form.Label>
                                  <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="contact@example.com"
                                    className={errors.email ? "is-invalid" : ""}
                                  />
                                  {errors.email && (
                                    <div className="sorath-invalid-feedback">{errors.email}</div>
                                  )}
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group controlId="companyPhone">
                                  <Form.Label>
                                    Phone <span className="sorath-required">*</span>
                                  </Form.Label>
                                  <Form.Control
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+1 000-000-0000"
                                    className={errors.phone ? "is-invalid" : ""}
                                  />
                                  {errors.phone && (
                                    <div className="sorath-invalid-feedback">{errors.phone}</div>
                                  )}
                                </Form.Group>
                              </Col>
                            </Row>

                            <Form.Group className="mb-3" controlId="companyAddressLine1">
                              <Form.Label>Address Line 1</Form.Label>
                              <Form.Control
                                type="text"
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleInputChange}
                                placeholder="Street address"
                              />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="companyAddressLine2">
                              <Form.Label>Address Line 2</Form.Label>
                              <Form.Control
                                type="text"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleInputChange}
                                placeholder="Suite, floor, etc."
                              />
                            </Form.Group>

                            <Row className="mb-3">
                              <Col md={6}>
                                <Form.Group controlId="companyCity">
                                  <Form.Label>City</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group controlId="companyState">
                                  <Form.Label>State / Province</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>

                            <Form.Group className="mb-4" controlId="companyCountry">
                              <Form.Label>Country</Form.Label>
                              <Form.Control
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                              />
                            </Form.Group>

                            <div className="d-flex gap-3">
                              <Button type="submit" className="sorath-btn-primary flex-grow-1">
                                <i className="bi bi-save"></i> {isEditMode ? "Update Company" : "Save Company"}
                              </Button>
                              <Button variant="outline-secondary" onClick={handleCancel}>
                                Cancel
                              </Button>
                            </div>
                          </Form>
                        </Card.Body>
                      </Card>
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

export default CompanyForm;


