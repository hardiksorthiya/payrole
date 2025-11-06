import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../css/Clients.css";
import "../css/Dashboard.css";

function Clients() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [clients, setClients] = useState([]);

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
    const storedClients = localStorage.getItem("clients");
    if (!storedClients) {
      const initialClients = [
        {
          id: 1,
          type: "Individual",
          name: "John Smith",
          company: "ABC Corp",
          email: "john@abc.com",
          phone: "+1 234-567-8900",
          addressLine1: "123 Main St",
          addressLine2: "Suite 100",
          city: "New York",
          state: "NY",
          country: "USA",
        },
        {
          id: 2,
          type: "Business",
          name: "Jane Doe",
          company: "XYZ Ltd",
          email: "jane@xyz.com",
          phone: "+1 234-567-8901",
          addressLine1: "456 Oak Ave",
          addressLine2: "",
          city: "Los Angeles",
          state: "CA",
          country: "USA",
        },
      ];
      localStorage.setItem("clients", JSON.stringify(initialClients));
      setClients(initialClients);
    } else {
      setClients(JSON.parse(storedClients));
    }
  }, []);

  // Load clients from localStorage on mount and when it changes
  useEffect(() => {
    const loadClients = () => {
      const storedClients = localStorage.getItem("clients");
      if (storedClients) {
        setClients(JSON.parse(storedClients));
      }
    };

    loadClients();
    
    // Listen for custom event when clients are updated
    const handleClientsUpdated = () => {
      loadClients();
    };
    
    // Listen for storage changes (when form page updates clients in different tab)
    window.addEventListener("storage", loadClients);
    // Listen for custom event (when form page updates clients in same window)
    window.addEventListener("clientsUpdated", handleClientsUpdated);
    // Reload when page becomes visible (user navigates back)
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        loadClients();
      }
    });
    
    return () => {
      window.removeEventListener("storage", loadClients);
      window.removeEventListener("clientsUpdated", handleClientsUpdated);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCreateClick = () => {
    navigate("/clients/create");
  };

  const handleEditClick = (clientId) => {
    navigate(`/clients/edit/${clientId}`);
  };

  const handleDeleteClick = (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      const updatedClients = clients.filter((client) => client.id !== clientId);
      setClients(updatedClients);
      localStorage.setItem("clients", JSON.stringify(updatedClients));
      // Dispatch event to notify other components
      window.dispatchEvent(new Event("clientsUpdated"));
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
                <div className="sorath-clients-page">
                  <Row className="sorath-page-header mb-4">
                    <Col xs={12} md={6}>
                      <h1 className="sorath-page-title">Clients</h1>
                      <p className="sorath-page-subtitle">Manage your clients</p>
                    </Col>
                    <Col xs={12} md={6} className="d-flex justify-content-md-end align-items-start">
                      <Button
                        className="sorath-btn-primary"
                        onClick={handleCreateClick}
                      >
                        <i className="bi bi-plus-circle"></i> Create Client
                      </Button>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <div className="sorath-clients-table-container">
                        <Table className="sorath-clients-table" responsive>
                          <thead>
                            <tr>
                              <th>Client Type</th>
                              <th>Name</th>
                              <th>Company</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Address</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {clients.length === 0 ? (
                              <tr>
                                <td colSpan="7" className="sorath-empty-state">
                                  <div className="sorath-empty-content">
                                    <i className="bi bi-people"></i>
                                    <p>No clients found. Create your first client to get started.</p>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              clients.map((client) => (
                                <tr key={client.id}>
                                  <td>
                                    <span className="sorath-client-type-badge">
                                      {client.type}
                                    </span>
                                  </td>
                                  <td>{client.name}</td>
                                  <td>{client.company || "-"}</td>
                                  <td>{client.email}</td>
                                  <td>{client.phone}</td>
                                  <td>
                                    {(() => {
                                      // Handle both old and new address formats
                                      if (client.address) {
                                        // Old format: single address string
                                        return client.address;
                                      } else {
                                        // New format: separate fields
                                        const addressParts = [];
                                        if (client.addressLine1) addressParts.push(client.addressLine1);
                                        if (client.addressLine2) addressParts.push(client.addressLine2);
                                        if (client.city) addressParts.push(client.city);
                                        if (client.state) addressParts.push(client.state);
                                        if (client.country) addressParts.push(client.country);
                                        return addressParts.length > 0 
                                          ? addressParts.join(", ") 
                                          : "-";
                                      }
                                    })()}
                                  </td>
                                  <td>
                                    <div className="sorath-action-buttons">
                                      <button
                                        className="sorath-action-btn"
                                        title="Edit"
                                        onClick={() => handleEditClick(client.id)}
                                      >
                                        <i className="bi bi-pencil"></i>
                                      </button>
                                      <button
                                        className="sorath-action-btn sorath-action-btn-danger"
                                        title="Delete"
                                        onClick={() => handleDeleteClick(client.id)}
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

export default Clients;

