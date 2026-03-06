import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Printer, Save, Check, Download } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useBilling } from '../../context/BillingContext';
import { format } from 'date-fns';
import InvoicePrint from './InvoicePrint';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const InvoiceForm = () => {
    const { items: masterItems, addBill, settings, doctors } = useBilling();
    const location = useLocation();
    const [patient, setPatient] = useState({ name: '', mobile: '' });
    const [billItems, setBillItems] = useState([]);
    const [payment, setPayment] = useState({ mode: 'Cash', reference: '' });
    const [doctorName, setDoctorName] = useState('');
    const [consultationTime, setConsultationTime] = useState(format(new Date(), 'HH:mm'));
    const [discount, setDiscount] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const stateApplied = useRef(false);
    const printRef = useRef(null);

    useEffect(() => {
        if (location.state && masterItems.length > 0 && !stateApplied.current) {
            const { patient: p, doctorName: d, consultationTime: t } = location.state;
            if (p) setPatient(p);
            if (d) setDoctorName(d);
            if (t) setConsultationTime(t);

            // Auto-add "Consultation Fee" if it exists in master
            const consultItem = masterItems.find(i => i.name.toLowerCase().includes('consultation'));
            if (consultItem && billItems.length === 0) {
                setBillItems([{ ...consultItem, qty: 1, tempId: Date.now() }]);
            }
            stateApplied.current = true;
        }
    }, [location.state, masterItems, billItems.length]);

    const subtotal = billItems.reduce((acc, item) => acc + (item.rate * item.qty), 0);
    const taxAmount = 0; // GST avoided as per request
    const grandTotal = subtotal + taxAmount - discount;

    const currentBillData = {
        id: 'NEW',
        date: new Date().toISOString(),
        patient,
        items: billItems,
        subtotal,
        taxAmount,
        discount,
        grandTotal,
        payment,
        doctorName,
        consultationTime,
        status: 'Paid'
    };

    const handlePrint = () => {
        if (!patient.name || billItems.length === 0) {
            alert("Please add patient name and items before printing.");
            return;
        }

        const content = printRef.current;
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert("Pop-up blocked! Please allow pop-ups for this site to print.");
            return;
        }
        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice - ${patient.name}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
                    <style>
                        @page { size: A4; margin: 0; }
                        body { margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                        @media print {
                            body { width: 210mm; height: 297mm; }
                        }
                    </style>
                </head>
                <body>
                    ${content.innerHTML}
                    <script>
                        window.onload = function() {
                            window.print();
                            // window.close();  // Optional: auto-close
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleDownload = async () => {
        if (!patient.name || billItems.length === 0) {
            alert("Please add patient name and items before downloading.");
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
        pdf.save(`Zefveda_Bill_${patient.name.replace(/\s+/g, '_')}.pdf`);
    };

    const addItemToBill = (itemId) => {
        const item = masterItems.find(i => i.id === parseInt(itemId));
        if (item) {
            setBillItems([...billItems, { ...item, qty: 1, tempId: Date.now() }]);
        }
    };

    const updateItemQty = (tempId, qty) => {
        setBillItems(billItems.map(item => item.tempId === tempId ? { ...item, qty: Math.max(1, parseInt(qty) || 1) } : item));
    };

    const removeItem = (tempId) => {
        setBillItems(billItems.filter(item => item.tempId !== tempId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!patient.name || billItems.length === 0) {
            alert("Please fill in patient name and add at least one item.");
            return;
        }

        const newBill = {
            patient,
            items: billItems,
            subtotal,
            taxAmount,
            discount,
            grandTotal,
            payment,
            doctorName,
            consultationTime
        };

        try {
            await addBill(newBill);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);

            // Clear form after save? Optional, but usually good.
            // setPatient({ name: '', mobile: '' });
            // setBillItems([]);
        } catch (error) {
            alert("Failed to save bill. Check server connection.");
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Hidden Print component for preview and capture */}
            <InvoicePrint ref={printRef} bill={currentBillData} settings={settings} doctors={doctors} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>New Billing</h1>
                    <p style={{ color: 'var(--text-muted)' }}>{format(new Date(), 'eeee, dd MMMM yyyy')}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary" onClick={handlePrint}>
                        <Printer size={18} /> Print Invoice
                    </button>
                    <button className="btn btn-secondary" onClick={handleDownload}>
                        <Download size={18} /> Download PDF
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        {isSaved ? <><Check size={18} /> Saved Successfully</> : <><Save size={18} /> Final Save</>}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                {/* Left Side: Patient & Items */}
                <div className="premium-card">
                    <section style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Patient Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label">Patient Name*</label>
                                <input
                                    className="form-input"
                                    value={patient.name}
                                    onChange={e => setPatient({ ...patient, name: e.target.value })}
                                    placeholder="Enter patient name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mobile Number</label>
                                <input
                                    className="form-input"
                                    value={patient.mobile}
                                    onChange={e => setPatient({ ...patient, mobile: e.target.value })}
                                    placeholder="e.g. 98765 00000"
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Consulted Doctor</label>
                                    <select
                                        className="form-input"
                                        value={doctorName}
                                        onChange={e => setDoctorName(e.target.value)}
                                    >
                                        <option value="">Select Doctor</option>
                                        {doctors && doctors.map(doc => (
                                            <option key={doc.id} value={doc.name}>
                                                {doc.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Consultation Time</label>
                                    <input
                                        type="time"
                                        className="form-input"
                                        value={consultationTime}
                                        onChange={e => setConsultationTime(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>Bill Items</h3>
                            <select
                                className="form-input"
                                style={{ width: '250px' }}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        addItemToBill(e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                            >
                                <option value="">+ Add item from master</option>
                                {masterItems.map(item => (
                                    <option key={item.id} value={item.id}>{item.name} (₹{item.rate})</option>
                                ))}
                            </select>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-main)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>ITEM NAME</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'center', width: '100px' }}>QTY</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', width: '120px' }}>RATE</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', width: '120px' }}>TOTAL</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'center', width: '50px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {billItems.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                            No items added yet. Choose from the dropdown above.
                                        </td>
                                    </tr>
                                )}
                                {billItems.map(item => (
                                    <tr key={item.tempId} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }}>{item.name}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <input
                                                type="number"
                                                className="form-input"
                                                style={{ textAlign: 'center', padding: '0.4rem', width: '70px' }}
                                                value={item.qty}
                                                onChange={(e) => updateItemQty(item.tempId, e.target.value)}
                                                min="1"
                                            />
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>₹{parseFloat(item.rate).toFixed(2)}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>₹{(item.rate * item.qty).toFixed(2)}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button
                                                onClick={() => removeItem(item.tempId)}
                                                style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </div>

                {/* Right Side: Totals & Payment */}
                <div>
                    <div className="premium-card" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Payment Summary</h3>
                        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff4d4d', alignItems: 'center' }}>
                                <span>Discount</span>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span>₹</span>
                                    <input
                                        type="number"
                                        value={discount}
                                        onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                                        style={{ width: '80px', textAlign: 'right', border: 'none', borderBottom: '1px solid #ff4d4d', background: 'transparent', outline: 'none' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)', marginTop: '0.5rem' }}>
                                <span>Total Amount</span>
                                <span>₹{grandTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Payment Mode</label>
                            <select
                                className="form-input"
                                value={payment.mode}
                                onChange={e => setPayment({ ...payment, mode: e.target.value })}
                            >
                                <option value="Cash">Cash</option>
                                <option value="UPI">UPI / GPay / PhonePe</option>
                                <option value="Card">Credit/Debit Card</option>
                                <option value="Online">Online Transfer</option>
                            </select>
                        </div>

                        {(payment.mode !== 'Cash') && (
                            <div className="form-group">
                                <label className="form-label">Reference / UTR No.</label>
                                <input
                                    className="form-input"
                                    placeholder="Enter Transaction ID"
                                    value={payment.reference}
                                    onChange={e => setPayment({ ...payment, reference: e.target.value })}
                                />
                            </div>
                        )}

                        <div style={{ background: '#f0f4ef', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                            <strong>Note:</strong> Verify the payment at the counter before confirming.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceForm;
