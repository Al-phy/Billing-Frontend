import React, { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { useNavigate } from 'react-router-dom';
import { Leaf, User, Phone, Watch, ClipboardList, CheckCircle, Save, MapPin, Briefcase, Mail, Users, HeartPulse, Stethoscope, FileText } from 'lucide-react';
import { format } from 'date-fns';

const ConsultationForm = () => {
    const { addConsultation, doctors } = useBilling();
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);

    const [formData, setFormData] = useState({
        patientName: '',
        patientMobile: '',
        doctorName: '',
        occupation: '',
        address: '',
        gender: 'Male',
        email: '',
        consultationTime: format(new Date(), 'HH:mm'),
        nextOfKin: { name: '', relationship: '', contact: '' },
        familyHistory: { father: '', mother: '', others: '' },
        patientHistory: {
            height: '', weight: '', bp: '', build: '', foodHabit: '',
            addiction: '', menstrualHistory: '', bowel: '', sleep: '', appetite: '', urine: ''
        },
        ashtavidhaPariksha: {
            nadi: '', mutra: '', mala: '', jihwa: '', shabda: '', sparsha: '', drik: '', akruthi: ''
        },
        presentComplaints: '',
        historyOfPresentComplaints: '',
        pastHistory: { majorIllness: '', treatmentDone: '', outcome: '' },
        clinicalNotes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [p1, p2] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [p1]: { ...prev[p1], [p2]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            const result = await addConsultation(formData);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
            return result;
        } catch (error) {
            alert("Error saving consultation");
        }
    };

    const handleSaveAndBill = async () => {
        const savedData = await handleSubmit();
        if (savedData) {
            navigate('/new-bill', {
                state: {
                    patient: { name: formData.patientName, mobile: formData.patientMobile },
                    doctorName: formData.doctorName,
                    consultationTime: formData.consultationTime
                }
            });
        }
    };

    const SectionHeader = ({ title, icon: Icon, color = "var(--primary)" }) => (
        <div style={{
            background: color,
            color: 'white',
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px'
        }}>
            <Icon size={18} /> {title}
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Stethoscope size={32} color="var(--primary)" /> Consultation Form
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>ZEF VEDA Ayurveda Clinic & Pharmacy - Comprehensive Patient Case Sheet</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={handleSaveAndBill}
                        className="btn btn-secondary"
                        style={{ padding: '0.8rem 1.5rem', background: 'white', border: '1px solid var(--primary)', color: 'var(--primary)' }}
                    >
                        <FileText size={20} /> Save & Bill
                    </button>
                    <button
                        onClick={() => {
                            handleSubmit().then((res) => {
                                if (res) {
                                    navigate('/prescription', {
                                        state: {
                                            patientName: formData.patientName,
                                            patientMobile: formData.patientMobile,
                                            doctorName: formData.doctorName,
                                            gender: formData.gender,
                                            diagnosis: formData.clinicalNotes,
                                            consultationTime: formData.consultationTime
                                        }
                                    });
                                }
                            });
                        }}
                        className="btn btn-primary"
                        style={{ padding: '0.8rem 1.5rem' }}
                    >
                        <ClipboardList size={20} /> Save & Prescribe
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>
                {/* 1. Basic Information */}
                <div className="premium-card">
                    <SectionHeader title="Basic Information" icon={User} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Full Name*</label>
                            <input name="patientName" className="form-input" value={formData.patientName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Consulting Doctor*</label>
                            <select
                                name="doctorName"
                                className="form-input"
                                value={formData.doctorName}
                                onChange={handleChange}
                                required
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
                            <label className="form-label">Occupation</label>
                            <input name="occupation" className="form-input" value={formData.occupation} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Gender</label>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                {['Male', 'Female', 'Other'].map(g => (
                                    <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                        <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} /> {g}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Address</label>
                            <input name="address" className="form-input" value={formData.address} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Contact / Mobile</label>
                            <input name="patientMobile" className="form-input" value={formData.patientMobile} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email ID</label>
                            <input name="email" className="form-input" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Reference No.</label>
                            <input name="refNo" className="form-input" placeholder="Office Use" readOnly />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Consultation Time</label>
                            <input type="time" name="consultationTime" className="form-input" value={formData.consultationTime} onChange={handleChange} />
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>NEXT OF KIN</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                            <input name="nextOfKin.name" className="form-input" placeholder="Name" value={formData.nextOfKin.name} onChange={handleChange} />
                            <input name="nextOfKin.relationship" className="form-input" placeholder="Relationship" value={formData.nextOfKin.relationship} onChange={handleChange} />
                            <input name="nextOfKin.contact" className="form-input" placeholder="Contact Details" value={formData.nextOfKin.contact} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* 2. Medical History (Family & Patient) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <div className="premium-card">
                        <SectionHeader title="Family History" icon={Users} color="#1E3F1A" />
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Father</label>
                                <textarea name="familyHistory.father" className="form-input" style={{ minHeight: '60px' }} value={formData.familyHistory.father} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mother</label>
                                <textarea name="familyHistory.mother" className="form-input" style={{ minHeight: '60px' }} value={formData.familyHistory.mother} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Others</label>
                                <textarea name="familyHistory.others" className="form-input" style={{ minHeight: '60px' }} value={formData.familyHistory.others} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="premium-card">
                        <SectionHeader title="Patient History" icon={HeartPulse} color="#1E3F1A" />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                            <div className="form-group"><label className="form-label">Height</label><input name="patientHistory.height" className="form-input" value={formData.patientHistory.height} onChange={handleChange} /></div>
                            <div className="form-group"><label className="form-label">Weight</label><input name="patientHistory.weight" className="form-input" value={formData.patientHistory.weight} onChange={handleChange} /></div>
                            <div className="form-group"><label className="form-label">BP</label><input name="patientHistory.bp" className="form-input" value={formData.patientHistory.bp} onChange={handleChange} /></div>
                            <div className="form-group"><label className="form-label">Built</label><input name="patientHistory.build" className="form-input" value={formData.patientHistory.build} onChange={handleChange} /></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            <div className="form-group"><label className="form-label">Food Habit</label><input name="patientHistory.foodHabit" className="form-input" value={formData.patientHistory.foodHabit} onChange={handleChange} /></div>
                            <div className="form-group"><label className="form-label">Addiction</label><input name="patientHistory.addiction" className="form-input" value={formData.patientHistory.addiction} onChange={handleChange} /></div>
                        </div>
                        <div className="form-group"><label className="form-label">Menstrual History</label><input name="patientHistory.menstrualHistory" className="form-input" value={formData.patientHistory.menstrualHistory} onChange={handleChange} /></div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            <div className="form-group"><label className="form-label">Bowel</label><input name="patientHistory.bowel" className="form-input" value={formData.patientHistory.bowel} onChange={handleChange} /></div>
                            <div className="form-group"><label className="form-label">Sleep</label><input name="patientHistory.sleep" className="form-input" value={formData.patientHistory.sleep} onChange={handleChange} /></div>
                            <div className="form-group"><label className="form-label">Appetite</label><input name="patientHistory.appetite" className="form-input" value={formData.patientHistory.appetite} onChange={handleChange} /></div>
                            <div className="form-group"><label className="form-label">Urine</label><input name="patientHistory.urine" className="form-input" value={formData.patientHistory.urine} onChange={handleChange} /></div>
                        </div>
                    </div>
                </div>

                {/* 3. Ashtavidha Pariksha (Gold Standard) */}
                <div className="premium-card" style={{ borderColor: 'var(--secondary)', borderWidth: '2px' }}>
                    <SectionHeader title="Ashtavidha Pariksha (Ayurvedic Examination)" icon={Leaf} color="var(--secondary)" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        {['Nadi', 'Mutra', 'Mala', 'Jihwa', 'Shabda', 'Sparsha', 'Drik', 'Akruthi'].map(key => (
                            <div key={key} className="form-group">
                                <label className="form-label" style={{ color: 'var(--secondary)', fontWeight: '700' }}>{key}</label>
                                <textarea
                                    name={`ashtavidhaPariksha.${key.toLowerCase()}`}
                                    className="form-input"
                                    style={{ border: '1px solid #D4AF3744' }}
                                    value={formData.ashtavidhaPariksha[key.toLowerCase()]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Clinical Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <div className="premium-card">
                        <SectionHeader title="Complaints" icon={ClipboardList} />
                        <div className="form-group">
                            <label className="form-label">Present Complaints</label>
                            <textarea name="presentComplaints" className="form-input" style={{ minHeight: '150px' }} value={formData.presentComplaints} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">History of Present Complaints</label>
                            <textarea name="historyOfPresentComplaints" className="form-input" style={{ minHeight: '150px' }} value={formData.historyOfPresentComplaints} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="premium-card">
                        <SectionHeader title="Past History" icon={ClipboardList} />
                        <div className="form-group">
                            <label className="form-label">Major Illness if any</label>
                            <textarea name="pastHistory.majorIllness" className="form-input" style={{ minHeight: '80px' }} value={formData.pastHistory.majorIllness} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Treatment Done</label>
                            <textarea name="pastHistory.treatmentDone" className="form-input" style={{ minHeight: '80px' }} value={formData.pastHistory.treatmentDone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Outcome of Treatment</label>
                            <textarea name="pastHistory.outcome" className="form-input" style={{ minHeight: '80px' }} value={formData.pastHistory.outcome} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* 5. Final Notes */}
                <div className="premium-card" style={{ background: '#f8faf8', borderStyle: 'dashed', borderWidth: '2px' }}>
                    <SectionHeader title="Final Assessment" icon={ClipboardList} />
                    <div className="form-group">
                        <label className="form-label">Provisional Diagnosis / Assessment</label>
                        <input name="clinicalNotes" className="form-input" placeholder="Primary medical assessment" value={formData.clinicalNotes} onChange={handleChange} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultationForm;
