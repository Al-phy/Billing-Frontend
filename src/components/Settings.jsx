import React, { useState } from 'react';
import { Save, Hospital, MapPin, Phone, Hash, Percent } from 'lucide-react';
import { useBilling } from '../context/BillingContext';

const Settings = () => {
    const { settings, updateSettings } = useBilling();
    const [formData, setFormData] = useState(settings);
    const [isSaved, setIsSaved] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSettings(formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1>Master Settings</h1>
                <p style={{ color: 'var(--text-muted)' }}>Configure your hospital details and invoice preferences</p>
            </div>

            <div className="premium-card" style={{ maxWidth: '800px' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Hospital size={16} /> Hospital / Clinic Name
                            </label>
                            <input
                                className="form-input"
                                value={formData.clinicName}
                                onChange={e => setFormData({ ...formData, clinicName: e.target.value })}
                            />
                        </div>

                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPin size={16} /> Full Address
                        </label>
                        <textarea
                            className="form-input"
                            rows="3"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Phone size={16} /> Phone Number
                            </label>
                            <input
                                className="form-input"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', textAlign: 'right' }}>
                        <button type="submit" className="btn btn-primary" style={{ minWidth: '150px' }}>
                            {isSaved ? 'Settings Saved!' : <><Save size={18} /> Update Settings</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
