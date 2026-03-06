import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Search, Printer, Download, XCircle } from 'lucide-react';
import { useBilling } from '../../context/BillingContext';
import InvoicePrint from './InvoicePrint';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const InvoiceHistory = () => {
    const { bills, cancelBill, settings } = useBilling();
    const [searchTerm, setSearchTerm] = useState('');
    const printRef = useRef(null);
    const [activeBill, setActiveBill] = useState(null);

    const [isProcessing, setIsProcessing] = useState(false);

    const [itemsLimit, setItemsLimit] = useState(20);

    const filteredBills = React.useMemo(() => {
        return bills.filter(bill =>
            bill.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bill.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [bills, searchTerm]);

    const displayedBills = filteredBills.slice(0, itemsLimit);

    // Infinite scroll or 'Load More' handler could be added, but for now a simple 'Load More' button at bottom is safer.
    const handleLoadMore = () => {
        setItemsLimit(prev => prev + 20);
    };

    const handlePrint = (bill) => {
        if (isProcessing) return;
        setIsProcessing(true);
        setActiveBill(bill);

        // Wait for state update and render
        setTimeout(() => {
            const content = printRef.current;
            if (!content) {
                alert("Error preparing invoice. Please try again.");
                setIsProcessing(false);
                return;
            }

            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert("Pop-up blocked! Please allow pop-ups for this site to print.");
                setIsProcessing(false);
                return;
            }

            printWindow.document.write(`
                <html>
                    <head>
                        <title>Bill - ${bill.id}</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
                        <style>
                            @page { size: A4; margin: 0; }
                            body { margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                        </style>
                    </head>
                    <body>
                        ${content.innerHTML}
                        <script>
                            window.onload = function() {
                                window.print();
                                // window.close(); // Optional: auto-close
                            };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
            setIsProcessing(false);
        }, 500); // Slightly increased delay to ensure render
    };

    const handleDownload = (bill) => {
        if (isProcessing) return;
        setIsProcessing(true);
        setActiveBill(bill);

        setTimeout(async () => {
            try {
                const element = printRef.current;
                if (!element) throw new Error("Print element not found");

                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    windowWidth: 210 * 3.7795275591, // A4 width in px (approx)
                    windowHeight: 297 * 3.7795275591
                });
                const data = canvas.toDataURL('image/png');

                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProperties = pdf.getImageProperties(data);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

                pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${bill.id || 'Zefveda_Bill'}.pdf`);
            } catch (error) {
                console.error("Download failed:", error);
                alert("Failed to download invoice.");
            } finally {
                setIsProcessing(false);
            }
        }, 500); // Slightly increased delay
    };

    return (
        <div className="animate-fade-in">
            {/* Hidden Print Component */}
            <InvoicePrint ref={printRef} bill={activeBill} settings={settings} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Invoices</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage and track all generated bills</p>
                </div>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        className="form-input"
                        style={{ paddingLeft: '2.5rem', width: '300px' }}
                        placeholder="Search by Patient or Bill ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="premium-card" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ padding: '1.25rem', textAlign: 'left' }}>DATE</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left' }}>INVOICE ID</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left' }}>PATIENT</th>
                            <th style={{ padding: '1.25rem', textAlign: 'center' }}>PAYMENT</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right' }}>TOTAL</th>
                            <th style={{ padding: '1.25rem', textAlign: 'center' }}>STATUS</th>
                            <th style={{ padding: '1.25rem', textAlign: 'center' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedBills.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    {searchTerm ? "No invoices found matching your search." : "No invoices found."}
                                </td>
                            </tr>
                        ) : (
                            displayedBills.map((bill) => (
                                <tr key={bill.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row-hover">
                                    <td style={{ padding: '1.25rem' }}>{format(new Date(bill.date), 'dd MMM yyyy')}</td>
                                    <td style={{ padding: '1.25rem', fontFamily: 'monospace', fontWeight: '600' }}>{bill.id}</td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ fontWeight: '500' }}>{bill.patient.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{bill.patient.mobile || 'No Mobile'}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', background: '#E5E1DA', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                            {bill.payment.mode}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'right', fontWeight: '700', color: 'var(--primary)' }}>
                                        ₹{parseFloat(bill.grandTotal).toFixed(2)}
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            background: bill.status === 'Paid' ? '#D4EDDA' : '#F8D7DA',
                                            color: bill.status === 'Paid' ? '#155724' : '#721C24'
                                        }}>
                                            {bill.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            <button className="action-btn" title="View/Print" onClick={() => handlePrint(bill)}><Printer size={16} /></button>
                                            <button className="action-btn" title="Download PDF" onClick={() => handleDownload(bill)}><Download size={16} /></button>
                                            {bill.status === 'Paid' && (
                                                <button
                                                    className="action-btn cancel"
                                                    title="Cancel Bill"
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to cancel this bill?')) {
                                                            cancelBill(bill.id);
                                                        }
                                                    }}
                                                ><XCircle size={16} /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {filteredBills.length > displayedBills.length && (
                    <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                        <button
                            onClick={handleLoadMore}
                            className="btn btn-secondary"
                            style={{ fontSize: '0.9rem' }}
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>

            <style>{`
        .table-row-hover:hover {
          background-color: #f9f9f9;
        }
        .action-btn {
          background: #f0f0f0;
          border: none;
          padding: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          color: var(--text-main);
          transition: all 0.2s;
        }
        .action-btn:hover {
          background: var(--primary);
          color: white;
        }
        .action-btn.cancel:hover {
          background: #ff4d4d;
        }
      `}</style>
        </div >
    );
};

export default InvoiceHistory;
