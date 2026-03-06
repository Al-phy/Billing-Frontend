import React from 'react';
import { format } from 'date-fns';
import { Leaf, Phone, MapPin, Globe } from 'lucide-react';

import logo from '../../assets/logo.png';

const InvoicePrint = React.forwardRef(({ bill, settings, doctors }, ref) => {
    if (!bill) return null;

    // Helper to find doctor designation
    const getDoctorDesignation = (name) => {
        if (!doctors || !name) return null;
        const doctor = doctors.find(d => d.name === name);
        return doctor ? doctor.designation : null;
    };

    return (
        /* The container is absolutely positioned far off-screen so it doesn't affect the UI */
        <div className="absolute top-0 -left-[300mm] w-[210mm] h-auto -z-50 print:static print:visible print:w-full print:h-full print:z-auto">
            <div ref={ref} className="bg-white p-[10mm] text-slate-800 w-[210mm] h-[297mm] font-['Inter'] relative leading-tight overflow-hidden print:m-0 print:shadow-none shadow-2xl flex flex-col border-[1px] border-slate-100"
                style={{
                    pageBreakInside: 'avoid',
                    pageBreakAfter: 'always',
                    WebkitPrintColorAdjust: 'exact',
                    boxSizing: 'border-box'
                }}>

                {/* --- ARTISTIC WATERMARK --- */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
                    <img src={logo} alt="Watermark" className="w-[450px] opacity-20 grayscale" />
                </div>

                {/* --- COMPACT PREMIUM HEADER --- */}
                <div className="relative z-10 flex justify-between items-start mb-4 border-b-2 border-emerald-900 pb-3">
                    <div className="flex gap-4 items-center">
                        <div className="bg-white p-1 rounded-2xl shadow-lg ring-1 ring-slate-100 w-24 h-24 flex items-center justify-center overflow-hidden">
                            <img src={logo} alt="Zefveda Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-emerald-900 tracking-tighter uppercase leading-none mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {settings.clinicName || "ZEF VEDA"}
                            </h1>
                            <div className="space-y-0.5 text-slate-500 font-bold text-[10px] tracking-wide">
                                <div className="flex items-center gap-1.5"><MapPin size={10} className="text-emerald-700" /> {settings.address}</div>
                                <div className="flex items-center gap-1.5">
                                    <Phone size={10} className="text-emerald-700" /> {settings.phone}
                                    <span className="mx-1.5 text-slate-300">|</span>
                                    <Globe size={10} className="text-emerald-700" /> www.zefveda.com
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="bg-emerald-900 text-white px-4 py-1.5 rounded-bl-2xl shadow-md mb-2">
                            <h2 className="text-base font-bold tracking-[0.2em] uppercase m-0 leading-none">INVOICE</h2>
                        </div>
                        <p className="text-base font-black text-emerald-800 tracking-widest font-mono m-0">#{bill.id || bill.invoiceId}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0">{format(new Date(bill.date || bill.billDate), 'dd MMM yyyy')}</p>
                    </div>
                </div>

                {/* --- DETAILS GRID --- */}
                <div className="relative z-10 grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-8 bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex flex-col justify-center">
                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-700 mb-2 opacity-60">Patient Details</h4>
                        <p className="text-xl font-black text-emerald-950 m-0 leading-none uppercase">{bill.patient.name}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold text-slate-500">
                            <Phone size={10} className="text-amber-500" /> {bill.patient.mobile || "N/A"}
                        </div>
                    </div>

                    <div className="col-span-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                        <p className="text-[9px] font-black uppercase text-emerald-700/60 mb-1 leading-none tracking-widest">Payment Mode</p>
                        <p className="text-xs font-black text-emerald-900 uppercase m-0 mb-1.5">{bill.payment.mode}</p>
                        <div className="bg-emerald-800 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                            {bill.status}
                        </div>
                    </div>
                </div>

                {/* --- COMPACT DOCTOR BANNER --- */}
                {(bill.doctorName || bill.consultationTime) && (
                    <div className="relative z-10 flex items-center gap-8 bg-amber-50/40 border-l-4 border-amber-400 p-2.5 rounded-r-xl mb-4 shadow-sm">
                        {bill.doctorName && (
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-black text-amber-700/60 uppercase tracking-widest">Doctor:</span>
                                <div>
                                    <p className="text-sm font-black text-slate-800 m-0 italic">{bill.doctorName}</p>
                                    {getDoctorDesignation(bill.doctorName) && (
                                        <p className="text-[9px] font-semibold text-slate-500 m-0 uppercase tracking-wider">{getDoctorDesignation(bill.doctorName)}</p>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="w-[1px] h-3 bg-amber-200"></div>
                        {bill.consultationTime && (
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-black text-amber-700/60 uppercase tracking-widest">Time:</span>
                                <p className="text-sm font-black text-slate-800 m-0 font-mono">{bill.consultationTime}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* --- TREATMENT TABLE --- */}
                <div className="relative z-10 mb-4 flex-grow overflow-hidden border border-slate-100 rounded-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-emerald-900">
                                <th className="px-6 py-2.5 text-white font-black text-[9px] uppercase tracking-[0.2em]">Treatment Description</th>
                                <th className="px-4 py-2.5 text-white font-black text-[9px] uppercase tracking-[0.2em] text-center w-20">Qty</th>
                                <th className="px-6 py-2.5 text-white font-black text-[9px] uppercase tracking-[0.2em] text-right w-28">Rate</th>
                                <th className="px-6 py-2.5 text-white font-black text-[9px] uppercase tracking-[0.2em] text-right w-36 bg-emerald-950">Line Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {(bill.items || []).map((item, idx) => (
                                <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                                    <td className="px-6 py-2.5">
                                        <p className="font-bold text-emerald-900 text-sm leading-tight">{item.name}</p>
                                        <p className="text-[8px] text-slate-400 font-semibold uppercase tracking-widest">Ayurvedic Therapy</p>
                                    </td>
                                    <td className="px-4 py-2.5 text-center font-mono font-bold text-slate-500 text-xs">{item.qty}</td>
                                    <td className="px-6 py-2.5 text-right font-medium text-slate-600 text-xs">₹{parseFloat(item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-2.5 text-right font-black text-emerald-900 bg-emerald-50/20 text-sm tracking-tight">₹{parseFloat(item.total || (item.rate * item.qty)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- SUMMARY SECTION --- */}
                <div className="relative z-10 flex justify-end items-end mb-4 gap-6">
                    <div className="flex-grow max-w-[50%]">
                        <p className="text-[8px] font-bold text-slate-400 uppercase leading-relaxed italic m-0">
                            Note: All treatments are based on Ayurvedic principles. Final amount is inclusive of all taxes.
                        </p>
                    </div>

                    <div className="w-[280px] bg-white rounded-2xl p-4 shadow-xl relative overflow-hidden">
                        <div className="space-y-1.5 mb-3 relative z-10 border-b border-emerald-800/50 pb-2">
                            <div className="flex justify-between text-emerald-300 font-bold text-[9px] tracking-wide opacity-70 uppercase">
                                <span>Gross Total</span>
                                <span>₹{parseFloat(bill.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            {parseFloat(bill.discount) > 0 && (
                                <div className="flex justify-between text-rose-300 font-black text-[9px] tracking-wide bg-rose-950/50 px-2 py-0.5 rounded border border-rose-900 uppercase">
                                    <span>Discount</span>
                                    <span>-₹{parseFloat(bill.discount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                            )}
                        </div>
                        <div className="relative z-10 flex justify-between items-center">
                            <span className="text-[8px] font-black text-amber-400 uppercase tracking-[0.2em] leading-none">Net Payable</span>
                            <div className="text-2xl font-black text-white tracking-tighter leading-none italic">
                                ₹{parseFloat(bill.grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FOOTER COMPACT --- */}
                <div className="relative z-10 mt-auto pt-3 border-t-2 border-slate-100 flex justify-between items-end pb-3">
                    <div className="text-center">
                        <div className="w-36 h-[0.5px] bg-slate-300 mb-1.5 mx-auto"></div>
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Patient Signature</p>
                    </div>
                    <div className="text-right">
                        <div className="w-56 border-b border-emerald-950 pb-0.5 mb-1 relative">
                            <p className="text-xs font-black text-emerald-900 uppercase tracking-[0.1em] italic leading-none m-0">{settings.clinicName || "ZEF VEDA"}</p>
                        </div>
                        <p className="text-[8px] font-black text-emerald-900 uppercase tracking-[0.2em] opacity-40">Authorized Signatory</p>
                    </div>
                </div>

                <div className="relative z-10 text-center bg-emerald-50/50 py-1.5 rounded-full border border-emerald-100/50">
                    <p className="text-[7px] text-emerald-900/40 font-black tracking-[0.3em] uppercase leading-none m-0">
                        Ayurveda • Mind Body and Spirit • Wishing you Wellness
                    </p>
                </div>
            </div>
        </div>
    );
});

export default InvoicePrint;
