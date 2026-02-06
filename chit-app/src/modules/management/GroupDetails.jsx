import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Shield, Phone, Mail } from 'lucide-react';
import { useChits } from '../../hooks/useChits';

export const GroupDetails = () => {
    const { id } = useParams();
    const { getGroup, addMember } = useChits();
    const group = getGroup(id);
    const [showAddMember, setShowAddMember] = useState(false);

    if (!group) return <div className="glass-panel">Group not found</div>;

    const members = group.membersList || [];

    return (
        <div>
            <Link to="/chits" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                <ArrowLeft size={16} /> Back to Groups
            </Link>

            <div className="glass-panel" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{group.name}</h1>
                        <p className="text-muted">ID: #{group.id} • Started: {group.startDate}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-success)' }}>₹{group.value.toLocaleString()}</div>
                        <div className="text-muted">Monthly Value</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Members ({members.length}/{group.members})</h2>
                <button className="btn-primary" onClick={() => setShowAddMember(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <UserPlus size={18} />
                    <span>Add Member</span>
                </button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {members.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                        No members added yet. Add members to start the chit.
                    </div>
                ) : (
                    members.map((member, idx) => (
                        <div key={idx} className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white'
                                }}>
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600' }}>{member.name}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Joined: {new Date().toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '2rem', color: 'var(--color-text-muted)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> {member.phone}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> {member.email}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showAddMember && (
                <AddMemberModal onClose={() => setShowAddMember(false)} onSave={(m) => addMember(id, m)} />
            )}
        </div>
    );
};

const AddMemberModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', aadhar: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100
        }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Register Member</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input required className="glass-input" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <input required className="glass-input" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    <input type="email" className="glass-input" placeholder="Email Address" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    <input className="glass-input" placeholder="Aadhar / ID Number" value={formData.aadhar} onChange={e => setFormData({ ...formData, aadhar: e.target.value })} />

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid var(--color-text-muted)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-main)' }}>Cancel</button>
                        <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add Member</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
