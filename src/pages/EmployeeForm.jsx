import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../css/EmployeeForm.css";
import "../css/Dashboard.css";

function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarWidth, setSidebarWidth] = useState(0);

  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    joinDate: "",
    status: "Active",
    resume: "",
    resumeFileName: "",
    payrollType: "",
    payrollAmount: "",
  });

  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [payrollTypes, setPayrollTypes] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);

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
        const depts = JSON.parse(stored);
        setDepartments(depts.map((d) => d.name));
      } else {
        // Initialize with default departments if not exists
        const defaultDepartments = [
          "Engineering",
          "HR",
          "Sales",
          "Marketing",
          "Finance",
          "Operations",
          "IT",
          "Customer Service",
        ];
        setDepartments(defaultDepartments);
      }
    };

    loadDepartments();
    window.addEventListener("departmentsUpdated", loadDepartments);
    return () => window.removeEventListener("departmentsUpdated", loadDepartments);
  }, []);

  // Load positions from localStorage
  useEffect(() => {
    const loadPositions = () => {
      const stored = localStorage.getItem("positions");
      if (stored) {
        const pos = JSON.parse(stored);
        setPositions(pos.map((p) => p.name));
      } else {
        // Initialize with default positions if not exists
        const defaultPositions = [
          "Software Engineer",
          "Senior Software Engineer",
          "HR Manager",
          "HR Executive",
          "Sales Executive",
          "Sales Manager",
          "Marketing Manager",
          "Marketing Executive",
          "Finance Manager",
          "Accountant",
          "Operations Manager",
          "IT Manager",
          "IT Support",
          "Customer Service Representative",
        ];
        setPositions(defaultPositions);
      }
    };

    loadPositions();
    window.addEventListener("positionsUpdated", loadPositions);
    return () => window.removeEventListener("positionsUpdated", loadPositions);
  }, []);

  // Load payroll types from localStorage
  useEffect(() => {
    const loadPayrollTypes = () => {
      const stored = localStorage.getItem("payrollTypes");
      if (stored) {
        const types = JSON.parse(stored);
        setPayrollTypes(types.map((t) => t.name));
      } else {
        // Initialize with default payroll types if not exists
        const defaultPayrollTypes = ["Monthly", "Fixed", "Hourly"];
        setPayrollTypes(defaultPayrollTypes);
      }
    };

    loadPayrollTypes();
    window.addEventListener("payrollTypesUpdated", loadPayrollTypes);
    return () => window.removeEventListener("payrollTypesUpdated", loadPayrollTypes);
  }, []);

  // Generate employee ID if creating new employee
  useEffect(() => {
    if (!isEditMode) {
      const employees = JSON.parse(localStorage.getItem("employees") || "[]");
      const nextId = employees.length > 0 ? Math.max(...employees.map((e) => e.id)) + 1 : 1;
      const employeeId = `EMP${String(nextId).padStart(3, "0")}`;
      setFormData((prev) => ({
        ...prev,
        employeeId: employeeId,
      }));
    }
  }, [isEditMode]);

  // Load employee data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const employees = JSON.parse(localStorage.getItem("employees") || "[]");
      const employee = employees.find((e) => e.id === parseInt(id));
      if (employee) {
        setFormData({
          employeeId: employee.employeeId || "",
          firstName: employee.firstName || "",
          lastName: employee.lastName || "",
          email: employee.email || "",
          phone: employee.phone || "",
          department: employee.department || "",
          position: employee.position || "",
          joinDate: employee.joinDate || "",
          status: employee.status || "Active",
          resume: employee.resume || "",
          resumeFileName: employee.resumeFileName || "",
          payrollType: employee.payrollType || "",
          payrollAmount: employee.payrollAmount || "",
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type (only PDF, DOC, DOCX)
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          resume: "Please upload a PDF, DOC, or DOCX file",
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          resume: "File size must be less than 5MB",
        }));
        return;
      }

      setResumeFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          resume: reader.result,
          resumeFileName: file.name,
        }));
      };
      reader.readAsDataURL(file);
      // Clear error
      if (errors.resume) {
        setErrors((prev) => ({
          ...prev,
          resume: "",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = "Employee ID is required";
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }
    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    }
    if (!formData.joinDate.trim()) {
      newErrors.joinDate = "Join date is required";
    }
    if (formData.payrollAmount && isNaN(parseFloat(formData.payrollAmount))) {
      newErrors.payrollAmount = "Please enter a valid amount";
    }
    if (formData.payrollAmount && parseFloat(formData.payrollAmount) < 0) {
      newErrors.payrollAmount = "Amount must be positive";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const employees = JSON.parse(localStorage.getItem("employees") || "[]");

      if (isEditMode) {
        // Update existing employee
        const updatedEmployees = employees.map((employee) =>
          employee.id === parseInt(id)
            ? {
                ...employee,
                ...formData,
              }
            : employee
        );
        localStorage.setItem("employees", JSON.stringify(updatedEmployees));
      } else {
        // Create new employee
        const newEmployee = {
          id: employees.length > 0 ? Math.max(...employees.map((e) => e.id)) + 1 : 1,
          ...formData,
        };
        localStorage.setItem("employees", JSON.stringify([...employees, newEmployee]));
      }

      // Dispatch custom event to refresh employees list
      window.dispatchEvent(new Event("employeesUpdated"));
      
      // Navigate back to employees list
      navigate("/employees");
    }
  };

  const handleCancel = () => {
    navigate("/employees");
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
                <div className="sorath-employee-form-page">
                  <Row className="mb-4">
                    <Col>
                      <h1 className="sorath-page-title">
                        {isEditMode ? "Edit Employee" : "Create New Employee"}
                      </h1>
                      <p className="sorath-page-subtitle">
                        {isEditMode
                          ? "Update employee information"
                          : "Add a new employee to your system"}
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} lg={8} xl={6}>
                      <div className="sorath-employee-form-card">
                        <Form onSubmit={handleSubmit}>
                          <Form.Group className="mb-3" controlId="employeeId">
                            <Form.Label className="sorath-form-label">
                              Employee ID <span className="sorath-required">*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="employeeId"
                              value={formData.employeeId}
                              onChange={handleInputChange}
                              placeholder="Enter employee ID (e.g., EMP001)"
                              className={`sorath-form-control ${
                                errors.employeeId ? "is-invalid" : ""
                              }`}
                              required
                              disabled={isEditMode}
                            />
                            {errors.employeeId && (
                              <div className="sorath-invalid-feedback">
                                {errors.employeeId}
                              </div>
                            )}
                          </Form.Group>

                          <Row>
                            <Col xs={12} md={6}>
                              <Form.Group className="mb-3" controlId="firstName">
                                <Form.Label className="sorath-form-label">
                                  First Name <span className="sorath-required">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="firstName"
                                  value={formData.firstName}
                                  onChange={handleInputChange}
                                  placeholder="Enter first name"
                                  className={`sorath-form-control ${
                                    errors.firstName ? "is-invalid" : ""
                                  }`}
                                  required
                                />
                                {errors.firstName && (
                                  <div className="sorath-invalid-feedback">
                                    {errors.firstName}
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                              <Form.Group className="mb-3" controlId="lastName">
                                <Form.Label className="sorath-form-label">
                                  Last Name <span className="sorath-required">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="lastName"
                                  value={formData.lastName}
                                  onChange={handleInputChange}
                                  placeholder="Enter last name"
                                  className={`sorath-form-control ${
                                    errors.lastName ? "is-invalid" : ""
                                  }`}
                                  required
                                />
                                {errors.lastName && (
                                  <div className="sorath-invalid-feedback">
                                    {errors.lastName}
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                          </Row>

                          <Form.Group className="mb-3" controlId="employeeEmail">
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

                          <Form.Group className="mb-3" controlId="employeePhone">
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
                            <Col xs={12} md={6}>
                              <Form.Group className="mb-3" controlId="employeeDepartment">
                                <Form.Label className="sorath-form-label">
                                  Department <span className="sorath-required">*</span>
                                </Form.Label>
                                <Form.Select
                                  name="department"
                                  value={formData.department}
                                  onChange={handleInputChange}
                                  className={`sorath-form-control ${
                                    errors.department ? "is-invalid" : ""
                                  }`}
                                  required
                                >
                                  <option value="">Select Department</option>
                                  {departments.map((dept) => (
                                    <option key={dept} value={dept}>
                                      {dept}
                                    </option>
                                  ))}
                                </Form.Select>
                                {errors.department && (
                                  <div className="sorath-invalid-feedback">
                                    {errors.department}
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                              <Form.Group className="mb-3" controlId="employeePosition">
                                <Form.Label className="sorath-form-label">
                                  Position <span className="sorath-required">*</span>
                                </Form.Label>
                                <Form.Select
                                  name="position"
                                  value={formData.position}
                                  onChange={handleInputChange}
                                  className={`sorath-form-control ${
                                    errors.position ? "is-invalid" : ""
                                  }`}
                                  required
                                >
                                  <option value="">Select Position</option>
                                  {positions.map((pos) => (
                                    <option key={pos} value={pos}>
                                      {pos}
                                    </option>
                                  ))}
                                </Form.Select>
                                {errors.position && (
                                  <div className="sorath-invalid-feedback">
                                    {errors.position}
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Col xs={12} md={6}>
                              <Form.Group className="mb-3" controlId="employeeJoinDate">
                                <Form.Label className="sorath-form-label">
                                  Join Date <span className="sorath-required">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="date"
                                  name="joinDate"
                                  value={formData.joinDate}
                                  onChange={handleInputChange}
                                  className={`sorath-form-control ${
                                    errors.joinDate ? "is-invalid" : ""
                                  }`}
                                  required
                                />
                                {errors.joinDate && (
                                  <div className="sorath-invalid-feedback">
                                    {errors.joinDate}
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                              <Form.Group className="mb-3" controlId="employeeStatus">
                                <Form.Label className="sorath-form-label">
                                  Status <span className="sorath-required">*</span>
                                </Form.Label>
                                <Form.Select
                                  name="status"
                                  value={formData.status}
                                  onChange={handleInputChange}
                                  className="sorath-form-control"
                                  required
                                >
                                  <option value="Active">Active</option>
                                  <option value="Inactive">Inactive</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Col xs={12}>
                              <h5 className="sorath-form-section-title mb-3">Resume</h5>
                            </Col>
                          </Row>

                          <Form.Group className="mb-3" controlId="employeeResume">
                            <Form.Label className="sorath-form-label">
                              Upload Resume
                            </Form.Label>
                            <Form.Control
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              className={`sorath-form-control sorath-file-input ${
                                errors.resume ? "is-invalid" : ""
                              }`}
                            />
                            {formData.resumeFileName && (
                              <div className="sorath-file-info mt-2">
                                <i className="bi bi-file-earmark-pdf"></i>
                                <span className="ms-2">{formData.resumeFileName}</span>
                              </div>
                            )}
                            {errors.resume && (
                              <div className="sorath-invalid-feedback">
                                {errors.resume}
                              </div>
                            )}
                            <Form.Text className="text-muted">
                              Accepted formats: PDF, DOC, DOCX (Max 5MB)
                            </Form.Text>
                          </Form.Group>

                          <Row>
                            <Col xs={12}>
                              <h5 className="sorath-form-section-title mb-3">Payroll Information</h5>
                            </Col>
                          </Row>

                          <Row>
                            <Col xs={12} md={6}>
                              <Form.Group className="mb-3" controlId="employeePayrollType">
                                <Form.Label className="sorath-form-label">
                                  Payroll Type
                                </Form.Label>
                                <Form.Select
                                  name="payrollType"
                                  value={formData.payrollType}
                                  onChange={handleInputChange}
                                  className="sorath-form-control"
                                >
                                  <option value="">Select Payroll Type</option>
                                  {payrollTypes.map((type) => (
                                    <option key={type.toLowerCase()} value={type.toLowerCase()}>
                                      {type}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                              <Form.Group className="mb-3" controlId="employeePayrollAmount">
                                <Form.Label className="sorath-form-label">
                                  Payroll Amount
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  name="payrollAmount"
                                  value={formData.payrollAmount}
                                  onChange={handleInputChange}
                                  placeholder="Enter amount"
                                  min="0"
                                  step="0.01"
                                  className={`sorath-form-control ${
                                    errors.payrollAmount ? "is-invalid" : ""
                                  }`}
                                />
                                {errors.payrollAmount && (
                                  <div className="sorath-invalid-feedback">
                                    {errors.payrollAmount}
                                  </div>
                                )}
                                <Form.Text className="text-muted">
                                  {formData.payrollType === "hourly" 
                                    ? "Amount per hour" 
                                    : formData.payrollType === "monthly"
                                    ? "Monthly salary"
                                    : "Fixed amount"}
                                </Form.Text>
                              </Form.Group>
                            </Col>
                          </Row>

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
                              {isEditMode ? "Update Employee" : "Create Employee"}
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

export default EmployeeForm;

