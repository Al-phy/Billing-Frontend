import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    FileText,
    PlusCircle,
    History,
    BarChart3,
    Settings,
    LogOut,
    Leaf,
    LayoutDashboard,
    Stethoscope,
    Users
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

import logo from '../assets/logo.png';

const Sidebar = () => {
    const { settings, logout } = useBilling();
    const location = useLocation();

    const menuItems = [
        { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/consultation', icon: <Stethoscope size={20} />, label: 'Consultation' },
        { path: '/prescription', icon: <FileText size={20} />, label: 'Prescription' },
        { path: '/medical-certificate', icon: <FileText size={20} />, label: 'Medical Certificate' },
        { path: '/prescription-template', icon: <PlusCircle size={20} />, label: 'Prescription Template' },
        { path: '/new-bill', icon: <PlusCircle size={20} />, label: 'New Billing' },
        { path: '/history', icon: <History size={20} />, label: 'Invoices' },
        { path: '/reports', icon: <BarChart3 size={20} />, label: 'Reports' },
        { path: '/master', icon: <FileText size={20} />, label: 'Service Master' },
        { path: '/doctors', icon: <Users size={20} />, label: 'Doctors' },
        { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        <aside className="sidebar">
            <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'white', padding: '0.25rem', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                    <h2 style={{ color: 'white', fontSize: '1.25rem', lineHeight: '1.2' }}>{settings.clinicName}</h2>
                    <span style={{ fontSize: '0.75rem', opacity: '0.6', color: 'var(--secondary)' }}>ADMIN DASHBOARD</span>
                </div>
            </div>

            <nav style={{ flex: 1 }}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                <button
                    onClick={() => {
                        if (window.confirm('Are you sure you want to sign out?')) {
                            logout();
                        }
                    }}
                    className="nav-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
