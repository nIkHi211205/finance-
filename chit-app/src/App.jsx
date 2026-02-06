import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Gavel, Wallet, Activity } from 'lucide-react';

// Modules
import { ChitManagement } from './modules/management/ChitManagement';
import { GroupDetails } from './modules/management/GroupDetails';
import { AuctionDashboard } from './modules/auction/AuctionDashboard';
import { PaymentTracker } from './modules/payments/PaymentTracker';

const Dashboard = () => <div className="glass-panel"><h1>Welcome to ChitFund Pro</h1><p className="text-muted" style={{ marginTop: '1rem' }}>Manage your finances with elegance.</p></div>;

const NavItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`nav-item ${isActive ? 'active' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
        background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
        marginBottom: '0.5rem',
        fontWeight: isActive ? 600 : 400
      }}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

// Layout Wrapper
const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        padding: '2rem',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(15, 23, 42, 0.3)',
        backdropFilter: 'blur(10px)',
        position: 'fixed',
        height: '100vh',
        zIndex: 10
      }}>
        <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity className="text-gradient" size={28} />
          <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>ChitFund</span>
        </div>

        <nav>
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/chits" icon={Users} label="My Chits" />
          <NavItem to="/auction" icon={Gavel} label="Auction" />
          <NavItem to="/payments" icon={Wallet} label="Payments" />
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: '260px',
        padding: '2rem 4rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chits" element={<ChitManagement />} />
          <Route path="/group/:id" element={<GroupDetails />} />
          <Route path="/auction" element={<AuctionDashboard />} />
          <Route path="/payments" element={<PaymentTracker />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
