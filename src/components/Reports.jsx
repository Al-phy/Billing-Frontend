import React, { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { format, isSameMonth, isSameYear, startOfMonth, endOfMonth, eachMonthOfInterval, isSameDay } from 'date-fns';
import {
    BarChart3,
    Calendar,
    Download,
    Printer,
    TrendingUp,
    ChevronRight,
    FileText,
    ArrowLeft,
    Wallet,
    ShoppingBag,
    Users
} from 'lucide-react';

const Reports = () => {
    const { bills, items, consultations, prescriptions } = useBilling();
    const [view, setView] = useState('selector'); // 'selector' or 'detailed'
    const [activeReport, setActiveReport] = useState({ type: 'monthly', month: new Date().getMonth(), year: new Date().getFullYear(), phone: '' });

    const years = Array.from(new Set(bills.map(b => new Date(b.date).getFullYear()))).sort((a, b) => b - a);
    if (years.length === 0) years.push(new Date().getFullYear());

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const generateReport = (type, value) => {
        if (type === 'monthly') {
            setActiveReport({ type: 'monthly', month: value.month, year: value.year });
        } else if (type === 'yearly') {
            setActiveReport({ type: 'yearly', year: value.year });
        } else if (type === 'patient') {
            if (!value.phone) return alert("Please enter a phone number");
            setActiveReport({ type: 'patient', phone: value.phone });
        }
        setView('detailed');
    };

    // Data Filtering for the active report
    const filteredBills = bills.filter(b => {
        const d = new Date(b.date);
        if (b.status !== 'Paid') return false;

        if (activeReport.type === 'monthly') {
            return d.getMonth() === activeReport.month && d.getFullYear() === activeReport.year;
        } else if (activeReport.type === 'yearly') {
            return d.getFullYear() === activeReport.year;
        } else if (activeReport.type === 'patient') {
            return b.patient.mobile === activeReport.phone;
        }
        return false;
    });

    // Filter Consultations for Patient Report
    const filteredConsultations = activeReport.type === 'patient'
        ? consultations.filter(c => c.patientMobile === activeReport.phone || c.patientMobile === activeReport.phone) // Ensure robust match
        : [];

    // Filter Prescriptions for Patient Report
    const filteredPrescriptions = activeReport.type === 'patient' && prescriptions
        ? prescriptions.filter(p => p.patientMobile === activeReport.phone)
        : [];

    const summary = {
        total: filteredBills.reduce((acc, b) => acc + b.grandTotal, 0),
        tax: filteredBills.reduce((acc, b) => acc + b.taxAmount, 0),
        discount: filteredBills.reduce((acc, b) => acc + b.discount, 0),
        count: filteredBills.length
    };

    // Service-wise breakdown
    const serviceRevenue = filteredBills.reduce((acc, bill) => {
        (bill.items || []).forEach(item => {
            acc[item.name] = (acc[item.name] || 0) + (item.rate * item.qty);
        });
        return acc;
    }, {});

    const sortedServices = Object.entries(serviceRevenue)
        .sort(([, a], [, b]) => b - a);

    if (view === 'detailed') {
        let title = "";
        let subtitle = "";

        if (activeReport.type === 'monthly') {
            title = `${months[activeReport.month]} ${activeReport.year} Report`;
            subtitle = "Monthly financial breakdown";
        } else if (activeReport.type === 'yearly') {
            title = `${activeReport.year} Annual Report`;
            subtitle = "Yearly performance overview";
        } else {
            const pName = filteredBills[0]?.patient?.name || (filteredConsultations[0]?.patientName || (filteredPrescriptions && filteredPrescriptions[0]?.patientName) || "Patient");
            title = `Patient History: ${pName}`;
            subtitle = `Analysis for mobile number: ${activeReport.phone}`;
        }

        return (
            <div className="animate-fade-in">
                <button onClick={() => setView('selector')} className="btn btn-secondary" style={{ marginBottom: '1.5rem', gap: '8px' }}>
                    <ArrowLeft size={18} /> Back to Selection
                </button>

                <div className="premium-card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {subtitle}
                            </span>
                            <h1 style={{ marginTop: '0.5rem' }}>{title}</h1>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-secondary" onClick={() => window.print()}><Printer size={18} /> Print Report</button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                        <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{activeReport.type === 'patient' ? 'Total Visits' : 'Bill Count'}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{summary.count}</div>
                        </div>
                        <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{activeReport.type === 'patient' ? 'Gross Spend' : 'Gross Revenue'}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>₹{summary.total.toFixed(2)}</div>
                        </div>
                        <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Avg. Per Bill</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>₹{summary.count > 0 ? (summary.total / summary.count).toFixed(2) : "0.00"}</div>
                        </div>
                        <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Last Visit</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{filteredBills[0] ? format(new Date(filteredBills[0].date), 'dd MMM yyyy') : 'N/A'}</div>
                        </div>
                    </div>
                </div>

                {/* Consultation History Section (Only for Patient Reports) */}
                {activeReport.type === 'patient' && (
                    <div className="premium-card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                        <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Consultation & Diagnosis History</h3>

                        {filteredConsultations.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No consultation records found for this patient.</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', borderBottom: '2px solid var(--border)' }}>
                                        <th style={{ padding: '1rem 0' }}>DATE</th>
                                        <th style={{ padding: '1rem 0' }}>DOCTOR</th>
                                        <th style={{ padding: '1rem 0', width: '30%' }}>DIAGNOSIS (ROGA)</th>
                                        <th style={{ padding: '1rem 0', width: '40%' }}>PRESCRIPTION (CHIKITSA)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredConsultations.map(cons => {
                                        // Find matching prescription for this consultation (same day)
                                        const matchingPrescription = prescriptions.find(p =>
                                            p.patientMobile === cons.patientMobile &&
                                            isSameDay(new Date(p.createdAt), new Date(cons.createdAt))
                                        );

                                        const prescriptionText = matchingPrescription ? matchingPrescription.prescription : (cons.prescription || '-');

                                        return (
                                            <tr key={cons.id} style={{ borderBottom: '1px solid var(--border)', verticalAlign: 'top' }}>
                                                <td style={{ padding: '1rem 0', fontSize: '0.9rem', fontWeight: '600' }}>
                                                    {cons.createdAt ? format(new Date(cons.createdAt), 'dd MMM yyyy') : '-'}
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                                                        {cons.createdAt ? format(new Date(cons.createdAt), 'hh:mm a') : ''}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem 0', fontSize: '0.9rem' }}>{cons.doctorName || '-'}</td>
                                                <td style={{ padding: '1rem 0', fontWeight: '500', color: 'var(--primary)', paddingRight: '1rem' }}>
                                                    {cons.clinicalNotes || '-'}
                                                </td>
                                                <td style={{ padding: '1rem 0', fontFamily: 'monospace', fontSize: '0.85rem', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                                                    {prescriptionText}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                    <div className="premium-card">
                        <h3 style={{ marginBottom: '1.5rem' }}>Revenue by Service</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {sortedServices.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No sales data for this period.</p>}
                            {sortedServices.map(([name, revenue]) => (
                                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{name}</span>
                                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{revenue.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="premium-card">
                        <h3 style={{ marginBottom: '1.5rem' }}>Billing History</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    <th style={{ paddingBottom: '1rem' }}>ID</th>
                                    <th style={{ paddingBottom: '1rem' }}>PATIENT</th>
                                    <th style={{ paddingBottom: '1rem' }}>DATE</th>
                                    <th style={{ paddingBottom: '1rem', textAlign: 'right' }}>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBills.slice(0, 15).map(b => (
                                    <tr key={b.id} style={{ borderTop: '1px solid var(--border)' }}>
                                        <td style={{ padding: '0.75rem 0', fontSize: '0.85rem', fontFamily: 'monospace' }}>{b.id}</td>
                                        <td style={{ padding: '0.75rem 0', fontWeight: '600', fontSize: '0.9rem' }}>{b.patient.name}</td>
                                        <td style={{ padding: '0.75rem 0', fontSize: '0.85rem' }}>{format(new Date(b.date), 'dd MMM')}</td>
                                        <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: '700' }}>₹{b.grandTotal.toFixed(2)}</td>
                                    </tr>
                                ))}
                                {filteredBills.length > 15 && (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                            Showing first 15 records. Download full report for complete list.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1>Report Center</h1>
                <p style={{ color: 'var(--text-muted)' }}>Generate and analyze your hospital's performance records</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                {/* Patient History Report Card */}
                <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', border: '1px solid #D4AF37' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: '#D4AF37' }}>
                        <Users size={28} />
                        <h2 style={{ margin: 0 }}>Patient History</h2>
                    </div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                        Enter a patient's mobile number to see all their previous visits and treatments.
                    </p>

                    <div style={{ background: '#fdfbf7', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginTop: 'auto' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>PATIENT PHONE NUMBER</label>
                            <input
                                id="p-phone-input"
                                className="form-input"
                                placeholder="e.g. 98765 00000"
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center', background: '#D4AF37' }}
                            onClick={() => generateReport('patient', {
                                phone: document.getElementById('p-phone-input').value
                            })}
                        >
                            View Patient Report <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Monthly Basis Reports Card */}
                <div className="premium-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                        <Calendar size={28} />
                        <h2 style={{ margin: 0 }}>Monthly Reports</h2>
                    </div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                        View daily trends, service breakdowns, and payment mode summaries for a specific month.
                    </p>

                    <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginTop: 'auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', alignItems: 'end' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ fontSize: '0.75rem' }}>SELECT MONTH</label>
                                <select id="m-select" className="form-input" defaultValue={new Date().getMonth()}>
                                    {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ fontSize: '0.75rem' }}>YEAR</label>
                                <select id="m-year-select" className="form-input" defaultValue={new Date().getFullYear()}>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}
                            onClick={() => generateReport('monthly', {
                                month: parseInt(document.getElementById('m-select').value),
                                year: parseInt(document.getElementById('m-year-select').value)
                            })}
                        >
                            Generate Monthly Report <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Yearly Basis Reports Card */}
                <div className="premium-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--secondary)' }}>
                        <TrendingUp size={28} />
                        <h2 style={{ margin: 0 }}>Yearly Reports</h2>
                    </div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                        Analyze annual growth, top-performing services, and year-over-year revenue comparisons.
                    </p>

                    <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginTop: 'auto' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>SELECT YEAR</label>
                            <select id="y-select" className="form-input" defaultValue={new Date().getFullYear()}>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center', background: 'var(--secondary)' }}
                            onClick={() => generateReport('yearly', {
                                year: parseInt(document.getElementById('y-select').value)
                            })}
                        >
                            Generate Annual Report <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
