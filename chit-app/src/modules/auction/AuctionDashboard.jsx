import React, { useState, useEffect } from 'react';
import { Gavel, Clock, TrendingDown, User, CheckCircle } from 'lucide-react';
import { useChits } from '../../hooks/useChits';

export const AuctionDashboard = () => {
    const { groups } = useChits();
    // Filter groups that are ACTIVE (eligible for auction)
    const activeGroups = groups.filter(g => g.status === 'ACTIVE');
    const [selectedGroupId, setSelectedGroupId] = useState(activeGroups[0]?.id || '');
    const [currentBid, setCurrentBid] = useState(0);
    const [bidHistory, setBidHistory] = useState([]);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [auctionActive, setAuctionActive] = useState(false);
    const [winner, setWinner] = useState(null);

    const selectedGroup = groups.find(g => g.id === selectedGroupId);

    useEffect(() => {
        let timer;
        if (auctionActive && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            endAuction();
        }
        return () => clearInterval(timer);
    }, [auctionActive, timeLeft]);

    const startAuction = () => {
        setAuctionActive(true);
        setWinner(null);
        setBidHistory([]);
        setCurrentBid(0);
        setTimeLeft(300);
    };

    const placeBid = (amount) => {
        // Validation: Bid must be higher than current bid (since it's "foregone amount", usually we maximize discount? 
        // OR is it "lowest bidder wins the chit amount"? 
        // Requirement: "Members quote the amount they are willing to forgo. The lowest bidder wins the chit amount."
        // Meaning: If Chit is 100k. 
        // Bidder A says: I'll forgo 5k (I take 95k).
        // Bidder B says: I'll forgo 10k (I take 90k).
        // Bidder B is "lowest bidder" in terms of "taking amount", but "highest bidder" in terms of "discount".
        // Usually Auction in chits: You bid the DISCOUNT. Highest discount wins.
        // Let's assume standard Chit Fund Auction: Bid = Discount Amount.
        // Highest Discount Wins.

        if (amount <= currentBid) {
            alert("Bid must be higher than current highest bid (discount).");
            return;
        }
        if (!selectedGroup) return;
        if (amount > selectedGroup.value * 0.4) {
            alert("Maximum bid limit reached (40%)");
            return;
        }

        const newBid = {
            id: Date.now(),
            amount: amount,
            bidder: `Member ${Math.floor(Math.random() * selectedGroup.members) + 1}`, // Mock bidder
            time: new Date().toLocaleTimeString()
        };

        setCurrentBid(amount);
        setBidHistory([newBid, ...bidHistory]);
    };

    const endAuction = () => {
        setAuctionActive(false);
        // Winner is the person with highest bid (highest discount)
        if (bidHistory.length > 0) {
            setWinner(bidHistory[0]);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!selectedGroup) {
        return <div className="glass-panel">No active chit groups available for auction.</div>;
    }

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Auction Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
                {/* Left Panel: Selection & Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Select Group</label>
                        <select
                            className="glass-input"
                            disabled={auctionActive}
                            value={selectedGroupId}
                            onChange={(e) => setSelectedGroupId(e.target.value)}
                        >
                            {activeGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>

                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-muted">Chit Value</span>
                                <span style={{ fontWeight: 600 }}>₹{selectedGroup.value.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-muted">Total Members</span>
                                <span>{selectedGroup.members}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-muted">Min Bid</span>
                                <span>₹{(selectedGroup.value * 0.05).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
                        {!auctionActive && !winner ? (
                            <button className="btn-primary" style={{ width: '100%' }} onClick={startAuction}>
                                Start Auction
                            </button>
                        ) : auctionActive ? (
                            <div>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--color-warning)' }}>
                                    {formatTime(timeLeft)}
                                </div>
                                <div className="text-muted">Time Remaining</div>
                                <button className="glass-input" style={{ marginTop: '1rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={endAuction}>
                                    Force Stop
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div style={{ color: 'var(--color-success)', marginBottom: '1rem' }}><CheckCircle size={48} /></div>
                                <h3>Auction Ended</h3>
                                <div style={{ marginTop: '0.5rem' }}>Winner: {winner?.bidder}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{winner?.amount.toLocaleString()}</div>
                                <button className="btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={startAuction}>
                                    New Round
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Live Bidding */}
                <div>
                    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--color-primary)' }}>
                                    <Gavel size={24} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.25rem' }}>Live Bidding</h2>
                                    <p className="text-muted">Current Month Round</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Highest Bid (Discount)</div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>₹{currentBid.toLocaleString()}</div>
                            </div>
                        </div>

                        {/* Bid History */}
                        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {bidHistory.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                    Waiting for bids...
                                </div>
                            ) : (
                                bidHistory.map(bid => (
                                    <div key={bid.id} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '0.75rem 1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: 'var(--radius-md)',
                                        borderLeft: bid.amount === currentBid ? '4px solid var(--color-primary)' : '4px solid transparent'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <User size={16} className="text-muted" />
                                            <span>{bid.bidder}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                            <span className="text-muted" style={{ fontSize: '0.875rem' }}>{bid.time}</span>
                                            <span style={{ fontWeight: 'bold' }}>₹{bid.amount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Bidding Controls */}
                        {auctionActive && (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {[500, 1000, 2000, 5000].map(step => (
                                    <button
                                        key={step}
                                        className="glass-input"
                                        style={{ flex: 1, textAlign: 'center', cursor: 'pointer', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                                        onClick={() => placeBid(currentBid + step)}
                                    >
                                        + ₹{step}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
