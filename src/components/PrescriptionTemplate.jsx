import React, { useState, useRef } from 'react';
import { useBilling } from '../context/BillingContext';
import { FileText, Printer, User, Calendar, Info } from 'lucide-react';
import PrescriptionTemplatePrint from './PrescriptionTemplatePrint';

const PrescriptionTemplate = () => {
    const { settings } = useBilling();
    const printRef = useRef(null);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        patientName: '',
        age: '',
        sex: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePrint = () => {
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
                    <title>Prescription Template</title>
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
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <FileText size={24} className="text-amber-400" />
                    <div>
                        <h2 className="text-xl font-bold m-0 tracking-tight">Prescription Template</h2>
                        <p className="text-slate-400 text-xs m-0 font-medium tracking-widest uppercase mt-1">Generic pad template for manual writing</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                    >
                        <Printer size={18} /> Print Template
                    </button>
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-50/50">
                {/* Form Section */}
                <div className="space-y-6">
                    <div className="premium-card p-6 bg-white border-slate-200/60 shadow-sm rounded-xl">
                        <h3 className="text-slate-900 flex items-center gap-2 mb-6 font-black uppercase tracking-wider text-sm border-b border-slate-100 pb-3">
                            <User size={18} className="text-amber-600" /> Customize Template
                        </h3>
                        <div className="space-y-5">
                            <div className="form-group">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Patient Name Field</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="patientName"
                                        value={formData.patientName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-500 transition-colors font-bold text-slate-700"
                                        placeholder="Leave dots for manual entry"
                                    />
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Age Field</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-500 transition-colors font-bold text-slate-700"
                                        />
                                        <Info className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Sex Field</label>
                                    <input
                                        type="text"
                                        name="sex"
                                        value={formData.sex}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-500 transition-colors font-bold text-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Date Field</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-500 transition-colors font-bold text-slate-700"
                                    />
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description / Notes</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-500 transition-colors font-bold text-slate-700 min-h-[120px]"
                                    placeholder="Enter case summary, initial advice, or leave blank"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <p className="text-amber-800 text-sm font-medium leading-relaxed">
                            <strong>Tip:</strong> This template prints a blank prescription pad with clinic letterhead.
                            You can pre-fill the date or leave it as dots for manual entry.
                        </p>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="hidden lg:block">
                    <div className="sticky top-8">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Letterhead Preview</h3>
                            <span className="bg-slate-100 text-slate-600 text-[9px] px-2 py-1 rounded font-black uppercase tracking-widest">Standard Sheet (A4)</span>
                        </div>
                        <div className="bg-slate-200 p-8 rounded-2xl shadow-inner overflow-auto max-h-[800px] flex justify-center border-4 border-white">
                            <div className="shadow-2xl scale-[0.6] origin-top bg-white">
                                <PrescriptionTemplatePrint ref={printRef} data={formData} settings={settings} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden component only for actual printing */}
            <div style={{ display: 'none' }}>
                <PrescriptionTemplatePrint ref={printRef} data={formData} settings={settings} />
            </div>
        </div>
    );
};

export default PrescriptionTemplate;
