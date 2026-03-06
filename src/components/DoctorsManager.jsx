import React, { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { UserPlus, Trash2, Stethoscope, User } from 'lucide-react';

const DoctorsManager = () => {
    const { doctors, addDoctor, deleteDoctor } = useBilling();
    const [newDoc, setNewDoc] = useState({ name: '', designation: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newDoc.name) {
            addDoctor(newDoc);
            setNewDoc({ name: '', designation: '' });
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'var(--primary)', padding: '0.8rem', borderRadius: '12px', color: 'white' }}>
                    <Stethoscope size={24} />
                </div>
                <div>
                    <h1>Doctors Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Add or remove doctors from the system</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Add New Doctor Form */}
                <div className="premium-card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <UserPlus size={20} color="var(--primary)" /> Add New Doctor
                    </h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Doctor Name*</label>
                            <input
                                className="form-input"
                                value={newDoc.name}
                                onChange={e => setNewDoc({ ...newDoc, name: e.target.value })}
                                placeholder="e.g. Dr. New Name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Designation / Specialization</label>
                            <input
                                className="form-input"
                                value={newDoc.designation}
                                onChange={e => setNewDoc({ ...newDoc, designation: e.target.value })}
                                placeholder="e.g. BAMS, MD (Ayurveda)"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                            Add Doctor
                        </button>
                    </form>
                </div>

                {/* Doctors List */}
                <div className="premium-card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <User size={20} color="var(--primary)" /> Registered Doctors
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {doctors.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No doctors added yet.</p>}

                        {doctors.map(doc => (
                            <div key={doc.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                background: '#f8faf8',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border)'
                            }}>
                                <div>
                                    <h4 style={{ margin: 0, color: 'var(--primary-dark)' }}>{doc.name}</h4>
                                    {doc.designation && <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{doc.designation}</p>}
                                </div>
                                <button
                                    onClick={() => deleteDoctor(doc.id)}
                                    style={{
                                        background: '#fee2e2',
                                        color: '#ef4444',
                                        border: 'none',
                                        padding: '0.6rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    title="Remove Doctor"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorsManager;
