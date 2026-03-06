import React, { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { format, isSameDay, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { TrendingUp, Calendar, Wallet, XCircle, PlusCircle, Users, ArrowRight, FileText, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { bills, items } = useBilling();
    const navigate = useNavigate();

    const stats = React.useMemo(() => {
        const activeBills = bills.filter(b => b.status === 'Paid');
        const today = new Date();

        const dailyTotal = activeBills
            .filter(b => isSameDay(new Date(b.date), today))
            .reduce((acc, b) => acc + b.grandTotal, 0);

        const monthlyTotal = activeBills
            .filter(b => isWithinInterval(new Date(b.date), {
                start: startOfMonth(today),
                end: endOfMonth(today)
            }))
            .reduce((acc, b) => acc + b.grandTotal, 0);

        const totalRevenue = activeBills.reduce((acc, b) => acc + b.grandTotal, 0);
        const cancelledCount = bills.filter(b => b.status === 'Cancelled').length;
        const patientCount = new Set(bills.map(b => b.patient.mobile)).size;

        return { dailyTotal, monthlyTotal, totalRevenue, cancelledCount, patientCount };
    }, [bills]);

    const recentBills = React.useMemo(() => bills.slice(0, 5), [bills]);
    const todayLabel = format(new Date(), 'eeee, dd MMMM');

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Welcome to Zefveda Portal</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Daily operations overview for {todayLabel}</p>
                </div>
                <Link to="/new-bill" className="btn btn-primary">
                    <PlusCircle size={18} /> Generate New Bill
                </Link>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="premium-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>TODAY'S SALES</span>
                        <TrendingUp size={20} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem' }}>₹{stats.dailyTotal.toFixed(2)}</h2>
                </div>

                <div className="premium-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>CURRENT MONTH</span>
                        <Calendar size={20} color="var(--secondary)" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem' }}>₹{stats.monthlyTotal.toFixed(2)}</h2>
                </div>

                <div style={{ background: 'var(--primary-dark)', color: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <span style={{ opacity: '0.8', fontSize: '0.9rem', fontWeight: '600' }}>TOTAL REVENUE</span>
                        <h2 style={{ fontSize: '1.8rem', marginTop: '1rem', color: 'white' }}>₹{stats.totalRevenue.toFixed(2)}</h2>
                    </div>
                    <Wallet size={80} style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: '0.1' }} />
                </div>

                <div className="premium-card" style={{ borderLeft: '4px solid #ff4d4d' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>CANCELLED BILLS</span>
                        <XCircle size={20} color="#ff4d4d" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem' }}>{stats.cancelledCount}</h2>
                </div>
            </div>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Center Column: Recent Bills and Quick Reports */}
                <div style={{ display: 'grid', gap: '2rem' }}>
                    <div className="premium-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3>Latest Invoices</h3>
                            <Link to="/history" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                View Full History <ArrowRight size={14} />
                            </Link>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    <th style={{ padding: '0.75rem 0' }}>PATIENT</th>
                                    <th style={{ padding: '0.75rem 0' }}>DATE</th>
                                    <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBills.length === 0 && (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No bills generated yet.</td>
                                    </tr>
                                )}
                                {recentBills.map(bill => (
                                    <tr key={bill.id} style={{ borderTop: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem 0' }}>
                                            <div style={{ fontWeight: '600' }}>{bill.patient.name}</div>
                                            <div style={{ fontSize: '0.75rem', opacity: '0.7' }}>{bill.id}</div>
                                        </td>
                                        <td style={{ padding: '1rem 0', fontSize: '0.85rem' }}>{format(new Date(bill.date), 'dd MMM')}</td>
                                        <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: '700', color: bill.status === 'Cancelled' ? '#ff4d4d' : 'var(--primary)' }}>
                                            ₹{parseFloat(bill.grandTotal).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="premium-card" style={{ background: 'linear-gradient(to bottom right, #ffffff, #fdfbf7)', border: '1px solid var(--secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <FileText color="var(--secondary)" />
                            <h3>Quick Report Generator</h3>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            Jump directly to full analysis for current performance periods.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => navigate('/reports')} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                                Monthly Report
                            </button>
                            <button onClick={() => navigate('/reports')} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', background: 'var(--secondary)' }}>
                                Yearly Report
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Statistics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', alignContent: 'start' }}>
                    <div className="premium-card">
                        <h3>Hospital Overview</h3>
                        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1.25rem' }}>
                            <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: 'white', padding: '0.5rem', borderRadius: '50%' }}>
                                    <Users size={20} color="var(--primary)" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered Patients</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{stats.patientCount}</div>
                                </div>
                            </div>

                            <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: 'white', padding: '0.5rem', borderRadius: '50%' }}>
                                    <PlusCircle size={20} color="var(--secondary)" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Treatments</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{items.length}</div>
                                </div>
                            </div>

                            <div style={{
                                marginTop: '1rem',
                                padding: '1.5rem',
                                background: 'white',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px dashed var(--secondary)',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                    "Wellness is a connection of paths: mind, body, and spirit."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
