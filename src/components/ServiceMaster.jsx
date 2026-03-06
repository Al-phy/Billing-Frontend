import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';
import { useBilling } from '../context/BillingContext';

const ServiceMaster = () => {
    const { items, addItem, updateItem, deleteItem } = useBilling();
    const [searchTerm, setSearchTerm] = useState('');
    const [newItem, setNewItem] = useState({ name: '', rate: '' });
    const [showAdd, setShowAdd] = useState(false);
    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null); // State for delete confirmation modal

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.rate) return;

        try {
            if (editId) {
                await updateItem(editId, { name: newItem.name, rate: parseFloat(newItem.rate) });
                setEditId(null);
            } else {
                await addItem({ name: newItem.name, rate: parseFloat(newItem.rate) });
            }
            setNewItem({ name: '', rate: '' });
            setShowAdd(false);
        } catch (error) {
            alert("Failed to save service");
        }
    };

    const handleEdit = (item) => {
        setNewItem({ name: item.name, rate: item.rate });
        setEditId(item.id);
        setShowAdd(true);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await deleteItem(deleteId);
            setDeleteId(null);
        }
    };

    const handleCancelEdit = () => {
        setNewItem({ name: '', rate: '' });
        setEditId(null);
        setShowAdd(false);
    };

    return (
        <div className="animate-fade-in" style={{ position: 'relative' }}>
            {/* Custom Confirmation Modal */}
            {deleteId && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(2px)'
                }}>
                    <div className="animate-scale-in" style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        maxWidth: '400px',
                        width: '90%',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: '#fee2e2',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem auto'
                        }}>
                            <Trash2 size={24} />
                        </div>
                        <h3 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>Delete Service?</h3>
                        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                            Are you sure you want to remove this service from the master list? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={() => setDeleteId(null)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    background: 'white',
                                    color: '#374151',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: '#ef4444',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Service & Item Master</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your treatments, medicines, and consultation fees</p>
                </div>
                <button className="btn btn-primary" onClick={() => {
                    handleCancelEdit();
                    setShowAdd(!showAdd);
                }}>
                    <Plus size={18} /> Add New Service
                </button>
            </div>

            {showAdd && (
                <div className="premium-card" style={{ marginBottom: '2rem', border: '2px solid var(--secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>{editId ? 'Edit Service / Item' : 'Add New Service / Item'}</h3>
                        <button onClick={handleCancelEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                    </div>
                    <form style={{ display: 'grid', gridTemplateColumns: '1fr 200px auto', gap: '1.5rem', marginTop: '1rem', alignItems: 'end' }} onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '0' }}>
                            <label className="form-label">Service Name</label>
                            <input
                                className="form-input"
                                placeholder="e.g. Abhyanga (Full Body)"
                                value={newItem.name}
                                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '0' }}>
                            <label className="form-label">Rate (₹)</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="0.00"
                                value={newItem.rate}
                                onChange={e => setNewItem({ ...newItem, rate: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            {editId ? 'Update Service' : 'Add Service'}
                        </button>
                    </form>
                </div>
            )}

            <div className="premium-card">
                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        className="form-input"
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', background: 'var(--bg-main)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            <th style={{ padding: '1rem' }}>SERVICE NAME</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>RATE</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem', fontWeight: '500' }}>{item.name}</td>
                                <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--primary)', fontWeight: '600' }}>₹{parseFloat(item.rate).toFixed(2)}</td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                        <button className="action-btn" onClick={() => handleEdit(item)}><Edit2 size={16} /></button>
                                        <button className="action-btn cancel" onClick={() => setDeleteId(item.id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
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
        </div>
    );
};

export default ServiceMaster;
