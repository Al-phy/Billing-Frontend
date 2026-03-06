import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import InvoiceForm from './components/billing/InvoiceForm';
import InvoiceHistory from './components/billing/InvoiceHistory';
import ServiceMaster from './components/ServiceMaster';
import Reports from './components/Reports';
import DoctorsManager from './components/DoctorsManager';
import Settings from './components/Settings';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ConsultationForm from './components/ConsultationForm';
import PrescriptionModule from './components/PrescriptionModule';
import MedicalCertificate from './components/MedicalCertificate';
import PrescriptionTemplate from './components/PrescriptionTemplate';
import { BillingProvider, useBilling } from './context/BillingContext';

const DashboardLayout = ({ children }) => (
  <div className="dashboard-layout">
    <Sidebar />
    <main className="main-content">
      {children}
    </main>
  </div>
);

function App() {
  const { token, login, loading } = useBilling();

  if (!token) {
    return (
      <Login onLogin={login} />
    );
  }

  return (
    <>
      {loading && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(253, 251, 247, 0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          color: 'var(--primary-dark)'
        }}>
          <div className="animate-spin" style={{
            width: '40px',
            height: '40px',
            border: '4px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            marginBottom: '1rem'
          }}></div>
          <p style={{ fontWeight: '600', letterSpacing: '0.05em' }}>INITIALIZING SYSTEM...</p>
        </div>
      )}
      <Router>
        <Routes>
          <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/new-bill" element={<DashboardLayout><InvoiceForm /></DashboardLayout>} />
          <Route path="/history" element={<DashboardLayout><InvoiceHistory /></DashboardLayout>} />
          <Route path="/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />
          <Route path="/master" element={<DashboardLayout><ServiceMaster /></DashboardLayout>} />
          <Route path="/doctors" element={<DashboardLayout><DoctorsManager /></DashboardLayout>} />
          <Route path="/consultation" element={<DashboardLayout><ConsultationForm /></DashboardLayout>} />
          <Route path="/prescription" element={<DashboardLayout><PrescriptionModule /></DashboardLayout>} />
          <Route path="/medical-certificate" element={<DashboardLayout><MedicalCertificate /></DashboardLayout>} />
          <Route path="/prescription-template" element={<DashboardLayout><PrescriptionTemplate /></DashboardLayout>} />
          <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
