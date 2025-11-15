import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Table } from "react-bootstrap";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../css/Companies.css";
import "../css/Dashboard.css";

function Companies() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [companies, setCompanies] = useState([]);

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

  const loadCompanies = useCallback(() => {
    const storedCompanies = localStorage.getItem("companies");
    if (storedCompanies) {
      try {
        const parsed = JSON.parse(storedCompanies);
        setCompanies(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error("Failed to parse companies from storage", error);
        setCompanies([]);
      }
    } else {
      setCompanies([]);
    }
  }, []);

  // Load companies data
  useEffect(() => {
    loadCompanies();

    const handleStorage = (event) => {
      if (event.key === "companies") {
        loadCompanies();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadCompanies();
      }
    };

    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadCompanies]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCreateCompany = () => {
    navigate("/companies/create");
  };

  const handleEditCompany = (companyId) => {
    navigate(`/companies/edit/${companyId}`);
  };

  const handleDeleteCompany = (companyId) => {
    if (!window.confirm("Are you sure you want to remove this company?")) return;

    const updatedCompanies = companies.filter((company) => company.id !== companyId);
    setCompanies(updatedCompanies);
    localStorage.setItem("companies", JSON.stringify(updatedCompanies));
    window.dispatchEvent(new Event("companiesUpdated"));
  };

  const formatCompanyAddress = (company) => {
    const addressParts = [
      company.addressLine1,
      company.addressLine2,
      company.city,
      company.state,
      company.country,
    ].filter(Boolean);

    return addressParts.length > 0 ? addressParts.join(", ") : "-";
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
                  <Row className="sorath-page-header mb-4">
                    <Col xs={12} md={6}>
                      <h1 className="sorath-page-title">Companies</h1>
                      <p className="sorath-page-subtitle">View all companies in your system</p>
                    </Col>
                    <Col xs={12} md={6} className="d-flex justify-content-md-end align-items-start">
                      <Button
                        className="sorath-btn-primary"
                        onClick={handleCreateCompany}
                      >
                        <i className="bi bi-plus-circle"></i> Create Company
                      </Button>
                    </Col>
                  </Row>

                  {companies.length === 0 ? (
                    <div className="sorath-companies-empty-state">
                      <div className="sorath-empty-content">
                        <i className="bi bi-building"></i>
                        <p>No companies saved yet. Use the button above to add your first company.</p>
                        <Button className="sorath-btn-primary mt-3" onClick={handleCreateCompany}>
                          <i className="bi bi-plus-circle"></i> Create Company
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="sorath-companies-table-container">
                      <div className="sorath-table-header-meta">
                        <span className="text-muted small">{companies.length} total</span>
                      </div>
                      <Table className="sorath-companies-table" responsive>
                        <thead>
                          <tr>
                            <th>Company</th>
                            <th>Industry</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Website</th>
                            <th>Address</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {companies.map((company) => (
                            <tr key={company.id}>
                              <td>{company.name}</td>
                              <td>
                                {company.industry ? (
                                  <span className="sorath-company-industry-badge">{company.industry}</span>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>{company.email || "-"}</td>
                              <td>{company.phone || "-"}</td>
                              <td className="sorath-company-website">
                                {company.website ? (
                                  <a href={company.website} target="_blank" rel="noreferrer">
                                    {company.website}
                                  </a>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>{formatCompanyAddress(company)}</td>
                              <td>
                                <div className="sorath-action-buttons">
                                  <button
                                    className="sorath-action-btn"
                                    title="Edit"
                                    onClick={() => handleEditCompany(company.id)}
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button
                                    className="sorath-action-btn sorath-action-btn-danger"
                                    title="Delete"
                                    onClick={() => handleDeleteCompany(company.id)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
    </div>
  );
}

export default Companies;

