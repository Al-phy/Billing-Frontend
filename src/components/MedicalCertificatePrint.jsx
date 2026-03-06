import React from 'react';
import { format } from 'date-fns';
import { Phone, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';

const MedicalCertificatePrint = React.forwardRef(({ data, settings }, ref) => {
    if (!data) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return '....................';
        return format(new Date(dateStr), 'dd MMM yyyy');
    };

    return (
        <div className="absolute top-0 -left-[300mm] w-[210mm] h-auto -z-50 print:static print:visible print:w-full print:h-full print:z-auto">
            <div ref={ref} className="bg-white p-[15mm] text-slate-800 w-[210mm] h-[297mm] font-['Inter'] relative leading-relaxed overflow-hidden print:m-0 print:shadow-none shadow-2xl flex flex-col border-[1px] border-slate-100"
                style={{
                    pageBreakInside: 'avoid',
                    pageBreakAfter: 'always',
                    WebkitPrintColorAdjust: 'exact',
                    boxSizing: 'border-box'
                }}>

                {/* --- ARTISTIC WATERMARK --- */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                    <img src={logo} alt="Watermark" className="w-[600px] opacity-20 grayscale" />
                </div>

                {/* --- LETTERHEAD TOP SECTION --- */}
                <div className="relative z-10 flex justify-between items-start mb-8">
                    {/* Brand & Doctors on Left */}
                    <div className="w-1/2">
                        <div className="flex items-center gap-4 mb-4">
                            <img src={logo} alt="Zefveda Logo" className="w-20 h-20 object-contain" />
                            <div>
                                <h1 className="text-3xl font-black text-emerald-950 tracking-tighter uppercase leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {settings?.clinicName || "ZEF VEDA"}
                                </h1>
                                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em] mt-1">Ayurveda Clinic & Pharmacy</p>
                            </div>
                        </div>

                        <div className="space-y-0.5 mt-6 border-l-4 border-emerald-900/10 pl-4">
                            <div className="text-emerald-950 font-black text-base">Dr Sahil K Noufal</div>
                            <div className="text-slate-500 font-bold text-[10px] uppercase tracking-widest leading-none">Reg No : 14450</div>
                            <div className="pt-2 text-emerald-950 font-black text-base">Dr Abinakhan S.S</div>
                            <div className="text-slate-500 font-bold text-[10px] uppercase tracking-widest leading-none">Reg No : 24890</div>
                        </div>
                    </div>

                    {/* Contact & Date on Right */}
                    <div className="w-1/2 text-right">
                        <div className="space-y-1 text-slate-600 font-bold text-[10px] tracking-wide mb-8">
                            <div className="flex items-center gap-2 justify-end">
                                <span>{settings?.address || "Poonjar Rd, Near PMC Hospitel, Erattupetta, Kerala 686121"}</span>
                                <MapPin size={10} className="text-emerald-700" />
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                                <span>{settings?.phone || "7025623014, 7306294282"}</span>
                                <Phone size={10} className="text-emerald-700" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 justify-end mt-12 bg-slate-50 py-2 px-4 rounded-xl border border-slate-100 inline-flex">
                            <span className="text-emerald-900 font-black text-[10px] uppercase tracking-[0.2em]">Date:</span>
                            <span className="min-w-[120px] text-center font-black text-sm">{formatDate(data.date)}</span>
                        </div>
                    </div>
                </div>

                <div className="w-full h-0.5 bg-emerald-900/10 mb-10"></div>

                {/* --- CERTIFICATE TITLE --- */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-emerald-900 uppercase tracking-[0.3em] inline-block border-b-4 border-emerald-900/10 pb-2">
                        {data.certificateType || "TEMPLATE"}
                    </h2>
                </div>

                {/* --- MAIN CONTENT --- */}
                <div className="relative z-10 flex-grow px-4">
                    <div className="space-y-10 text-lg text-slate-800 leading-[2.5]">
                        <p>
                            This is to certify that <span className="font-black text-emerald-950 uppercase border-b-2 border-slate-200 px-4 inline-block min-w-[300px] text-center">{data.patientName || "......................................................."}</span>,
                            Aged <span className="font-black text-emerald-950 px-2 inline-block min-w-[80px] text-center border-b-2 border-slate-200">{data.age || "........"}</span> Years,
                            Sex <span className="font-black text-emerald-950 px-2 inline-block min-w-[100px] text-center border-b-2 border-slate-200">{data.sex || "........"}</span>,
                            was under my treatment for <span className="font-black text-emerald-950 border-b-2 border-slate-200 px-4 inline-block min-w-[350px] text-center">{data.diagnosis || "......................................................."}</span>.
                        </p>

                        <p>
                            I advised him/her <span className="font-black text-emerald-950 px-4">medical leave / rest</span> for a period of
                            <span className="font-black text-emerald-950 border-b-2 border-slate-200 px-4 mx-2">
                                {data.periodFrom && data.periodTo ? `${Math.ceil((new Date(data.periodTo) - new Date(data.periodFrom)) / (1000 * 60 * 60 * 24)) + 1} days` : ".............."}
                            </span>
                            from <span className="font-black text-emerald-950 border-b-2 border-slate-200 px-4 inline-block min-w-[140px] text-center mx-1">{formatDate(data.periodFrom)}</span>
                            to <span className="font-black text-emerald-950 border-b-2 border-slate-200 px-4 inline-block min-w-[140px] text-center mx-1">{formatDate(data.periodTo)}</span>.
                        </p>

                        <p>
                            He / She is fit to resume his / her duties / studies from
                            <span className="font-black text-emerald-950 border-b-2 border-slate-200 px-6 inline-block min-w-[180px] text-center mx-2">{formatDate(data.fitnessDate)}</span>.
                        </p>

                        {data.remarks && (
                            <div className="mt-12 p-6 bg-slate-50 rounded-2xl border-2 border-slate-100 italic">
                                <h4 className="text-xs font-black text-emerald-900 uppercase tracking-widest mb-3 not-italic opacity-60">Remarks / Advice:</h4>
                                <div className="font-medium text-slate-700">{data.remarks}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- FOOTER --- */}
                <div className="relative z-10 pt-10 border-t-2 border-slate-100 mt-20">
                    <div className="flex justify-between items-end pb-8">
                        <div className="text-center">
                            <div className="w-48 h-[1px] bg-slate-300 mb-2 mx-auto"></div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Medical Officer / Doctor</p>
                            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-1">Signature & Seal</p>
                        </div>
                        <div className="text-right">
                            <div className="w-72 border-b-2 border-emerald-950 pb-1 mb-2 relative">
                                <p className="text-lg font-black text-emerald-900 uppercase tracking-[0.1em] italic leading-none m-0">for {settings?.clinicName || "ZEF VEDA"}</p>
                            </div>
                            <p className="text-[10px] font-black text-emerald-900/60 uppercase tracking-[0.3em]">Ayurveda Clinic & Pharmacy</p>
                        </div>
                    </div>

                    <div className="text-center bg-emerald-50/50 py-3 rounded-full border border-emerald-100/50">
                        <p className="text-[9px] text-emerald-900/40 font-black tracking-[0.4em] uppercase leading-none m-0">
                            Ayurveda • Mind Body and Spirit • Wishing you Wellness
                        </p>
                    </div>
                </div>

                {/* --- ARTISTIC WATERMARK --- */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                    <img src={logo} alt="Watermark" className="w-[600px] opacity-20 grayscale" />
                </div>
            </div>
        </div>
    );
});

export default MedicalCertificatePrint;
