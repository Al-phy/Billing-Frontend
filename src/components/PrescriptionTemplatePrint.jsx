import React from 'react';
import logo from '../assets/logo.png';

const PrescriptionTemplatePrint = React.forwardRef(({ data, settings }, ref) => {
    return (
        <div
            ref={ref}
            className="bg-white p-[12mm] text-slate-900 w-[210mm] h-[285mm] font-['Inter'] relative leading-tight print:m-0 print:shadow-none shadow-2xl flex flex-col border-[1px] border-slate-100 overflow-hidden"
            style={{
                pageBreakInside: 'avoid',
                WebkitPrintColorAdjust: 'exact',
                boxSizing: 'border-box'
            }}
        >
            {/* Header Section */}
            <div className="flex justify-between items-start mb-4 pt-2">
                {/* Left Side: Doctors */}
                <div className="w-1/3 text-left">
                    <div className="flex flex-col gap-0.5">
                        <p className="font-black text-slate-800 text-[11px] leading-tight m-0">Dr Sahil K Noufel</p>
                        <p className="font-bold text-slate-500 text-[9px] m-0">Reg No: 14450</p>
                        <div className="h-2"></div>
                        <p className="font-black text-slate-800 text-[11px] leading-tight m-0">Dr Abinakshon S.S</p>
                        <p className="font-bold text-slate-500 text-[9px] m-0">Reg No: 24890</p>
                    </div>
                </div>

                {/* Center: Logo */}
                <div className="w-1/3 flex flex-col items-center justify-center -mt-6">
                    <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
                    <h1 className="text-xl font-black text-emerald-900 tracking-tighter uppercase mt-1">
                        {settings?.clinicName || "ZEF VEDA"}
                    </h1>
                </div>

                {/* Right Side: Address */}
                <div className="w-1/3 text-right">
                    <div className="flex flex-col gap-0.5 mt-2">
                        <p className="font-bold text-slate-500 text-[9px] leading-relaxed m-0">
                            Panjil Rd, Near PMC Hospital, Enadimangalam, Kerala 691521
                        </p>
                        <p className="font-bold text-slate-500 text-[9px] m-0">
                            Ph: 7035673014, 7356196262
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full h-0.5 bg-emerald-900/10 mb-8"></div>

            {/* Patient Info Fields */}
            <div className="grid grid-cols-12 gap-x-16 gap-y-6 mb-12">
                <div className="col-span-8 flex items-end">
                    <span className="font-bold text-sm text-slate-800 whitespace-nowrap mr-2">Name:</span>
                    <span className="flex-grow border-b border-slate-300 border-dotted pb-0.5 text-sm font-bold text-slate-900">
                        {data.patientName}
                    </span>
                </div>
                <div className="col-span-4 flex items-end">
                    <span className="font-bold text-sm text-slate-800 whitespace-nowrap mr-2">Date:</span>
                    <span className="flex-grow border-b border-slate-300 border-dotted pb-0.5 text-sm font-bold text-slate-900">
                        {data.date}
                    </span>
                </div>

                <div className="col-span-6 flex items-end">
                    <span className="font-bold text-sm text-slate-800 whitespace-nowrap mr-2">Age:</span>
                    <span className="flex-grow border-b border-slate-300 border-dotted pb-0.5 text-sm font-bold text-slate-900">
                        {data.age}
                    </span>
                </div>
                <div className="col-span-6 flex items-end">
                    <span className="font-bold text-sm text-slate-800 whitespace-nowrap mr-2">Sex:</span>
                    <span className="flex-grow border-b border-slate-300 border-dotted pb-0.5 text-sm font-bold text-slate-900">
                        {data.sex}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col mt-4">
                <div className="h-full flex flex-col">
                    {data.description && (
                        <div className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap ml-0">
                            {data.description}
                        </div>
                    )}
                    {/* The space for manual writing will now naturally expand to fill available page space */}
                    <div className="flex-1 mt-4 border-t border-emerald-900/5 border-dashed"></div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto border-t border-slate-200 pt-4 flex justify-between items-end pb-4">
                <div className="text-slate-400 text-[8px] font-bold uppercase tracking-[0.2em]">
                    Wishing you wellness • Zefveda Ayurveda Clinic
                </div>
                <div className="w-48 border-b border-slate-300 text-center pb-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Seal & Signature</p>
                </div>
            </div>
        </div>
    );
});

export default PrescriptionTemplatePrint;
