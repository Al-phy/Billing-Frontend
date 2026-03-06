import React from 'react';
import { format } from 'date-fns';
import { Phone, MapPin, Globe } from 'lucide-react';
import logo from '../assets/logo.png';

const PrescriptionPrint = React.forwardRef(({ data, settings }, ref) => {
    if (!data) return null;

    // Helper to format text with newlines
    const formatText = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, i) => (
            <p key={i} className="mb-1 leading-relaxed">{line}</p>
        ));
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
                                {settings?.clinicName || "ZEF VEDA"}
                            </h1>
                            <div className="space-y-0.5 text-slate-500 font-bold text-[10px] tracking-wide">
                                <div className="flex items-center gap-1.5"><MapPin size={10} className="text-emerald-700" /> {settings?.address}</div>
                                <div className="flex items-center gap-1.5">
                                    <Phone size={10} className="text-emerald-700" /> {settings?.phone}
                                    <span className="mx-1.5 text-slate-300">|</span>
                                    <Globe size={10} className="text-emerald-700" /> www.zefveda.com
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="bg-emerald-900 text-white px-4 py-1.5 rounded-bl-2xl shadow-md mb-2">
                            <h2 className="text-base font-bold tracking-[0.2em] uppercase m-0 leading-none">PRESCRIPTION</h2>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0">{format(new Date(), 'dd MMM yyyy')}</p>
                    </div>
                </div>

                {/* --- DETAILS GRID --- */}
                <div className="relative z-10 grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-8 bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex flex-col justify-center">
                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-700 mb-2 opacity-60">Patient Details</h4>
                        <p className="text-xl font-black text-emerald-950 m-0 leading-none uppercase">{data.patientName}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold text-slate-500">
                            {data.patientMobile && (
                                <span className="flex items-center gap-1"><Phone size={10} className="text-amber-500" /> {data.patientMobile}</span>
                            )}
                            {data.age && <span>Age: {data.age}</span>}
                            {data.gender && <span>Gender: {data.gender}</span>}
                        </div>
                    </div>

                    <div className="col-span-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                        <p className="text-[9px] font-black uppercase text-emerald-700/60 mb-1 leading-none tracking-widest">Doctor</p>
                        <p className="text-sm font-black text-emerald-900 uppercase m-0 mb-1.5">{data.doctorName || "Dr. Sahil Noufal"}</p>
                    </div>
                </div>

                {/* --- DIAGNOSIS & PRESCRIPTION --- */}
                <div className="relative z-10 flex-grow flex flex-col gap-6">

                    {/* Diagnosis */}
                    {data.diagnosis && (
                        <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/30">
                            <h3 className="text-xs font-black text-emerald-900 uppercase tracking-[0.1em] mb-2 border-b border-slate-200 pb-1">Provisional Diagnosis</h3>
                            <div className="text-sm text-slate-700 font-medium">
                                {formatText(data.diagnosis)}
                            </div>
                        </div>
                    )}

                    {/* Rx Symbol */}
                    <div className="relative">
                        <span className="text-4xl font-serif font-bold text-emerald-900/20 absolute -top-6 -left-2 italic">Rx</span>
                        <div className="border border-slate-100 rounded-xl p-6 bg-white min-h-[400px]">
                            <h3 className="text-xs font-black text-emerald-900 uppercase tracking-[0.1em] mb-4 border-b border-emerald-100 pb-2">Medicines & Advice</h3>
                            <div className="text-sm text-slate-800 leading-7 font-medium whitespace-pre-wrap">
                                {data.prescription || "No medicines prescribed."}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FOOTER COMPACT --- */}
                <div className="relative z-10 mt-auto pt-3 border-t-2 border-slate-100 flex justify-between items-end pb-3">
                    <div className="text-center">
                        <div className="w-36 h-[0.5px] bg-slate-300 mb-1.5 mx-auto"></div>
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Doctor Signature</p>
                    </div>
                    <div className="text-right">
                        <div className="w-56 border-b border-emerald-950 pb-0.5 mb-1 relative">
                            <p className="text-xs font-black text-emerald-900 uppercase tracking-[0.1em] italic leading-none m-0">{settings?.clinicName || "ZEF VEDA"}</p>
                        </div>
                        <p className="text-[8px] font-black text-emerald-900 uppercase tracking-[0.2em] opacity-40">Ayurveda Clinic</p>
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

export default PrescriptionPrint;
