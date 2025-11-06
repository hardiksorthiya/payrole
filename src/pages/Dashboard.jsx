import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../css/Dashboard.css";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarWidth, setSidebarWidth] = useState(0);

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
          // Fallback: calculate based on percentage
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
    // Instant calculation based on sidebar state
    if (isMobile) {
      setSidebarWidth(0);
    } else {
      // Calculate width immediately based on state
      const width = sidebarOpen
        ? Math.min(Math.max(window.innerWidth * 0.12, 200), 280)
        : Math.min(Math.max(window.innerWidth * 0.05, 70), 80);
      setSidebarWidth(width);
    }
  }, [sidebarOpen, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
                <h1 className="sorath-page-title">Dashboard</h1>
                <p className="sorath-page-subtitle">
                  Welcome to Payroll System Dashboard
                </p>
              </Col>
            </Row>
            
            {/* Dummy content for now */}
            <Row className="sorath-content-section">
              <Col xs={12} md={6} lg={4} className="mb-3">
                <div className="sorath-card">
                  <h3>Employee Management</h3>
                  <p>Manage your employees and their information</p>
                </div>
              </Col>
              <Col xs={12} md={6} lg={4} className="mb-3">
                <div className="sorath-card">
                  <h3>Payroll Processing</h3>
                  <p>Process and manage payroll for your employees</p>
                </div>
              </Col>
              <Col xs={12} md={6} lg={4} className="mb-3">
                <div className="sorath-card">
                  <h3>Reports & Analytics</h3>
                  <p>View reports and analytics for your payroll data</p>
                </div>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
