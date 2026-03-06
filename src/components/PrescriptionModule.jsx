import React, { useState, useRef } from 'react';
import { useBilling } from '../context/BillingContext';
import { ClipboardList, Printer, Save, CheckCircle, User, FileText } from 'lucide-react';
import PrescriptionPrint from './PrescriptionPrint';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { useLocation, useNavigate } from 'react-router-dom';

const PrescriptionModule = () => {
    const { settings, doctors, addPrescription } = useBilling();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);
    const printRef = useRef(null);

    const [formData, setFormData] = useState({
        patientName: '',
        patientMobile: '',
        age: '',
        gender: '',
        doctorName: '',
        diagnosis: '',
        prescription: ''
    });

    React.useEffect(() => {
        if (location.state) {
            setFormData(prev => ({
                ...prev,
                ...location.state
            }));
        }
    }, [location.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePrint = () => {
        if (!formData.patientName) {
            alert("Please enter patient name before printing.");
            return;
        }

        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        iframe.style.zIndex = '-1';
        document.body.appendChild(iframe);

        const content = printRef.current;
        const doc = iframe.contentWindow.document;

        doc.open();
        doc.write(`
            <html>
                <head>
                    <title>Prescription - ${formData.patientName}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
                    <style>
                        @page { size: A4; margin: 0; }
                        body { margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    </style>
                </head>
                <body>
                    ${content.innerHTML}
                </body>
            </html>
        `);
        doc.close();

        iframe.onload = function () {
            // Small delay to ensure Tailwind parses and styles are applied
            setTimeout(() => {
                try {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                } catch (e) {
                    console.error("Print failed", e);
                } finally {
                    // Clean up the iframe after a delay to ensure print dialog is done
                    // Note: In Chrome, print() blocks, so this runs after. In others, it might not.
                    // Extending timeout to be safe.
                    setTimeout(() => {
                        if (document.body.contains(iframe)) {
                            document.body.removeChild(iframe);
                        }
                    }, 2000);
                }
            }, 500);
        };
    };

    const handleDownload = async () => {
        if (!formData.patientName) {
            alert("Please enter patient name before downloading.");
            return;
        }

        const element = printRef.current;
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false
        });
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Prescription_${formData.patientName.replace(/\s+/g, '_')}.pdf`);
    };

    const handleSave = () => {
        // Here you would typically save to the backend.
        // For now, we'll just simulate a save.
        console.log("Saving prescription:", formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Hidden Print Component */}
            <PrescriptionPrint ref={printRef} data={formData} settings={settings} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <ClipboardList size={32} color="var(--primary)" /> New Prescription
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Generate and print patient prescriptions</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary" onClick={handlePrint}>
                        <Printer size={18} /> Print
                    </button>
                    <button className="btn btn-secondary" onClick={handleDownload}>
                        <FileText size={18} /> Download PDF
                    </button>

                    <button
                        className="btn btn-primary"
                        style={{ background: 'var(--secondary)', borderColor: 'var(--secondary)' }}
                        onClick={() => {
                            // Perform save logic
                            console.log("Saving prescription:", formData);

                            // Save to context/storage
                            if (addPrescription) {
                                addPrescription(formData);
                            }

                            setIsSaved(true);

                            // Navigate immediately. No need to wait for the 3s timeout of the toast.
                            // However, we'll give React a split second to render the "Saved" state if desired, 
                            // but for a smooth transition, immediate navigation is usually better.
                            // If it's getting "stuck", it might be an error in the payload or something else.
                            // Let's ensure the payload is clean.

                            setTimeout(() => {
                                navigate('/new-bill', {
                                    state: {
                                        patient: { name: formData.patientName, mobile: formData.patientMobile },
                                        doctorName: formData.doctorName,
                                        consultationTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
                                    }
                                });
                            }, 100);
                        }}
                    >
                        <FileText size={18} /> Save & Bill
                    </button>
                </div>
            </div>

            <div className="premium-card">
                <div style={{
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '0.6rem 1.2rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '1.5rem',
                    fontWeight: '600'
                }}>
                    <User size={18} /> Patient Details
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="form-group">
                        <label className="form-label">Patient Name*</label>
                        <input name="patientName" className="form-input" value={formData.patientName} onChange={handleChange} placeholder="e.g. John Doe" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Patient Mobile</label>
                        <input name="patientMobile" className="form-input" value={formData.patientMobile} onChange={handleChange} placeholder="e.g. 9876543210" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Age</label>
                        <input name="age" className="form-input" value={formData.age} onChange={handleChange} placeholder="Years" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Gender</label>
                        <select name="gender" className="form-input" value={formData.gender} onChange={handleChange}>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Consulting Doctor</label>
                        <select
                            name="doctorName"
                            className="form-input"
                            value={formData.doctorName}
                            onChange={handleChange}
                        >
                            <option value="">Select Doctor</option>
                            {doctors && doctors.map(doc => (
                                <option key={doc.id} value={doc.name}>
                                    {doc.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', margin: '1.5rem 0' }}></div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                    <div className="form-group">
                        <label className="form-label" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Provisional Diagnosis</label>
                        <textarea
                            name="diagnosis"
                            className="form-input"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            placeholder="Enter diagnosis details..."
                            style={{ minHeight: '300px' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Rx (Medicines & Advice)</label>
                        <textarea
                            name="prescription"
                            className="form-input"
                            value={formData.prescription}
                            onChange={handleChange}
                            placeholder="1. Medicine Name - Dosage - Instructions&#10;2. ..."
                            style={{ minHeight: '300px', fontFamily: 'monospace', fontSize: '1rem' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionModule;
