import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { useChits } from '../../hooks/useChits';

export const PaymentTracker = () => {
    const { groups } = useChits();
    const activeGroups = groups.filter(g => g.status === 'ACTIVE');
    const [selectedGroupId, setSelectedGroupId] = useState(activeGroups[0]?.id || '');

    const selectedGroup = groups.find(g => g.id === selectedGroupId);

    // Mock payment data
    const generatePayments = (group) => {
        if (!group) return [];
        const members = group.membersList || [];
        // Even if no members, let's mock some rows to show UI
        const dummyMembers = members.length > 0 ? members : Array(5).fill(0).map((_, i) => ({ name: `Member ${i + 1}`, phone: 'N/A' }));

        const monthlyContribution = group.value / group.members;
        const lastDividend = 500; // Mock dividend from last auction
        const netPayable = monthlyContribution - lastDividend;

        return dummyMembers.map((m, idx) => ({
            id: idx,
            member: m.name,
            month: 'October 2024',
            contribution: monthlyContribution,
            dividend: lastDividend,
            net: netPayable,
            status: Math.random() > 0.3 ? 'PAID' : 'PENDING'
        }));
    };

    const payments = generatePayments(selectedGroup);

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Payment Tracker</h1>

            <div className="glass-panel" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Filter by Group</label>
                        <select
                            className="glass-input"
                            style={{ width: '300px' }}
                            value={selectedGroupId}
                            onChange={e => setSelectedGroupId(e.target.value)}
                        >
                            {activeGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                    </div>
                    {selectedGroup && (
                        <div style={{ display: 'flex', gap: '2rem', paddingLeft: '2rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                            <div>
                                <div className="text-muted" style={{ fontSize: '0.875rem' }}>Collection Month</div>
                                <div style={{ fontWeight: 'bold' }}>October 2024</div>
                            </div>
                            <div>
                                <div className="text-muted" style={{ fontSize: '0.875rem' }}>Due Amount</div>
                                <div style={{ fontWeight: 'bold', color: 'var(--color-warning)' }}>₹{(selectedGroup.value / selectedGroup.members - 500).toLocaleString()}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)' }}>Member</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)' }}>Gross Contribution</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)' }}>Dividend</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--color-text-muted)' }}>Net Payable</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-muted)' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--color-text-muted)' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length === 0 ? (
                            <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>No payments found</td></tr>
                        ) : payments.map((p, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 600 }}>{p.member}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>₹{p.contribution.toLocaleString()}</td>
                                <td style={{ padding: '1rem', color: 'var(--color-success)' }}>- ₹{p.dividend.toLocaleString()}</td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>₹{p.net.toLocaleString()}</td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    {p.status === 'PAID' ? (
                                        <span style={{
                                            background: 'rgba(16, 185, 129, 0.2)', color: 'var(--color-success)',
                                            padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600,
                                            display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
                                        }}>
                                            <CheckCircle size={12} /> Paid
                                        </span>
                                    ) : (
                                        <span style={{
                                            background: 'rgba(239, 68, 68, 0.2)', color: 'var(--color-danger)',
                                            padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600,
                                            display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
                                        }}>
                                            <AlertCircle size={12} /> Pending
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    {p.status === 'PENDING' && (
                                        <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                            Mark Paid
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
