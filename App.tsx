import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useApp } from './store';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Documents } from './pages/Documents';
import { Team } from './pages/Team';
import { Info } from './pages/Info';
import { BlockGeneric } from './pages/BlockGeneric';
import { BlockExecution } from './pages/BlockExecution';
import { BlockTechnology } from './pages/BlockTechnology';
import { BlockProfile } from './pages/BlockProfile';
import { BlockIdentity } from './pages/BlockIdentity';
import { BlockMarket } from './pages/BlockMarket';
import { ToastContainer } from './components/Toast';

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

const App = () => {
  const { user, onboardingComplete } = useApp();

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
        
        <Route path="/onboarding" element={
          user && !onboardingComplete ? <Onboarding /> : <Navigate to="/" replace />
        } />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            {!onboardingComplete && user?.role === 'OWNER' ? <Navigate to="/onboarding" replace /> : <Dashboard />}
          </ProtectedRoute>
        } />

        <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
        <Route path="/info" element={<ProtectedRoute><Info /></ProtectedRoute>} />

        <Route path="/blocks/:id" element={
          <ProtectedRoute>
            <BlockRenderer />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

// Wrapper to decide which component to render based on ID
const BlockRenderer = () => {
  const { id } = useParams<{id: string}>();
  
  if (id === '1') {
    return <BlockProfile />;
  }

  if (id === '2') {
    return <BlockIdentity />;
  }

  if (id === '3') {
    return <BlockMarket />;
  }

  if (id === '4') {
    return <BlockTechnology />;
  }

  if (id === '5') {
    return <BlockExecution />;
  }
  
  return <BlockGeneric />;
};

export default App;