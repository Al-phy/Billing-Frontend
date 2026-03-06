import React, { useState, useRef } from 'react';
import { useBilling } from '../context/BillingContext';
import { FileText, Printer, Save, User, Calendar, Info, Clock, MapPin, Phone } from 'lucide-react';
import MedicalCertificatePrint from './MedicalCertificatePrint';

const MedicalCertificate = () => {
    const { settings } = useBilling();
    const printRef = useRef(null);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        patientName: '',
        age: '',
        sex: '',
        diagnosis: '',
        periodFrom: '',
        periodTo: '',
        fitnessDate: '',
        remarks: '',
        certificateType: 'Template'
    });

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
                    <title>Template - ${formData.patientName}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
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
            setTimeout(() => {
                try {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                } catch (e) {
                    console.error("Print failed", e);
                } finally {
                    setTimeout(() => {
                        if (document.body.contains(iframe)) {
                            document.body.removeChild(iframe);
                        }
                    }, 2000);
                }
            }, 500);
        };
    };

    return (
        <div className="animate-fade-in shadow-xl rounded-2xl overflow-hidden bg-white border border-slate-100">
            <div className="bg-emerald-900 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <FileText size={24} className="text-emerald-400" />
                    <div>
                        <h2 className="text-xl font-bold m-0 tracking-tight">Template Generator</h2>
                        <p className="text-emerald-200/60 text-xs m-0 font-medium tracking-widest uppercase mt-1">Fill details to generate template</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                    >
                        <Printer size={18} /> Print Template
                    </button>
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-50/50">
                {/* Form Section */}
                <div className="space-y-6">
                    <div className="premium-card p-6 bg-white border-slate-200/60">
                        <h3 className="text-emerald-900 flex items-center gap-2 mb-6 font-black uppercase tracking-wider text-sm border-b border-slate-100 pb-3">
                            <User size={18} className="text-emerald-600" /> Patient Basic Info
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="form-group">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Patient Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="patientName"
                                        value={formData.patientName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 transition-colors font-bold text-slate-700"
                                        placeholder="Enter patient name"
                                    />
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 transition-colors font-bold text-slate-700"
                                    />
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Age</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 transition-colors font-bold text-slate-700"
                                        placeholder="Age"
                                    />
                                    <Info className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Sex</label>
                                <select
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 transition-colors font-bold text-slate-700"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card p-6 bg-white border-slate-200/60">
                        <h3 className="text-emerald-900 flex items-center gap-2 mb-6 font-black uppercase tracking-wider text-sm border-b border-slate-100 pb-3">
                            <Clock size={18} className="text-emerald-600" /> Certificate Details
                        </h3>
                        <div className="space-y-5">
                            <div className="form-group">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Certificate Title</label>
                                <input
                                    type="text"
                                    name="certificateType"
                                    value={formData.certificateType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 transition-colors font-bold text-slate-700"
                                    placeholder="e.g. Medical Fitness Certificate"
                                />
                            </div>

                            <div className="form-group">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Illness / Diagnosis</label>
                                <textarea
                                    name="diagnosis"
                                    value={formData.diagnosis}
                                    onChange={handleChange}
                                    rows="2"
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 transition-colors font-bold text-slate-700"
                                    placeholder="Enter diagnosis or reason for leave"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Leave From</label>
                                    <input
                                        type="date"
                                        name="periodFrom"
                                        value={formData.periodFrom}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 transition-colors font-bold text-slate-700"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Leave To</label>
                                    <input
                                        type="date"
                                        name="periodTo"
                                        value={formData.periodTo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 transition-colors font-bold text-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Fit to resume from</label>
                                <input
                                    type="date"
                                    name="fitnessDate"
                                    value={formData.fitnessDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 transition-colors font-bold text-slate-700"
                                />
                            </div>

                            <div className="form-group">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Additional Remarks / Advice</label>
                                <textarea
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 transition-colors font-bold text-slate-700"
                                    placeholder="Enter any additional advice or remarks"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="hidden lg:block">
                    <div className="sticky top-8">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Print Preview</h3>
                            <span className="bg-amber-100 text-amber-700 text-[9px] px-2 py-1 rounded font-black uppercase tracking-widest">A4 Scale</span>
                        </div>
                        <div className="bg-slate-200 p-8 rounded-2xl shadow-inner overflow-auto max-h-[800px] flex justify-center border-4 border-white">
                            <div className="shadow-2xl scale-[0.6] origin-top bg-white">
                                <MedicalCertificatePrint ref={printRef} data={formData} settings={settings} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden component only for actual printing */}
            <div style={{ display: 'none' }}>
                <MedicalCertificatePrint ref={printRef} data={formData} settings={settings} />
            </div>
        </div>
    );
};

export default MedicalCertificate;
