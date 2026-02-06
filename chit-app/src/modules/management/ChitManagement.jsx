import React, { useState } from 'react';
import { Plus, Users, Calendar, DollarSign } from 'lucide-react';
import { useChits } from '../../hooks/useChits';

import { Link } from 'react-router-dom';

export const ChitManagement = () => {
    const { groups, addGroup } = useChits();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Chit Groups</h1>
                    <p className="text-muted">Manage your active and pending chit funds.</p>
                </div>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} />
                    <span>Create New Group</span>
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {groups.map(group => (
                    <Link key={group.id} to={`/group/${group.id}`} className="glass-panel" style={{ transition: 'transform 0.2s', cursor: 'pointer', display: 'block', textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{
                                background: group.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                color: group.status === 'ACTIVE' ? 'var(--color-success)' : 'var(--color-warning)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '99px',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                            }}>{group.status}</span>
                            <span className="text-muted" style={{ fontSize: '0.875rem' }}>ID: #{group.id}</span>
                        </div>

                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{group.name}</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                                <DollarSign size={16} />
                                <span>Value: <strong style={{ color: 'var(--color-text-main)' }}>₹{group.value.toLocaleString()}</strong></span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                                <Users size={16} />
                                <span>Members: <strong style={{ color: 'var(--color-text-main)' }}>{group.members}</strong> (20 Months)</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                                <Calendar size={16} />
                                <span>Start: {group.startDate}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {isModalOpen && (
                <CreateGroupModal onClose={() => setIsModalOpen(false)} onSave={addGroup} />
            )}
        </div>
    );
};

const CreateGroupModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        value: '',
        members: 20,
        duration: 20,
        startDate: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            value: Number(formData.value),
            members: Number(formData.members),
            duration: Number(formData.duration)
        });
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100
        }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', animation: 'slideIn 0.3s ease-out' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Create New Chit Group</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Group Name</label>
                        <input
                            required
                            className="glass-input"
                            placeholder="e.g. Platinum Saver 2024"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Chit Value (₹)</label>
                            <input
                                required
                                type="number"
                                className="glass-input"
                                placeholder="100000"
                                value={formData.value}
                                onChange={e => setFormData({ ...formData, value: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Start Date</label>
                            <input
                                required
                                type="date"
                                className="glass-input"
                                value={formData.startDate}
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Members</label>
                            <input
                                type="number"
                                className="glass-input"
                                value={formData.members}
                                onChange={e => setFormData({ ...formData, members: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Duration (Months)</label>
                            <input
                                type="number"
                                className="glass-input"
                                value={formData.duration}
                                readOnly
                                style={{ opacity: 0.7 }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid var(--color-text-muted)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-main)' }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                            Create Group
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
