
import React, { useState, useCallback, useEffect } from 'react';
import Management from './components/management/Management';
import DailyAssessment from './components/daily-assessment/DailyAssessment';
import Dashboard from './components/dashboard/Dashboard';
import JustificationManagement from './components/justification/JustificationManagement';
import ParticipantReport from './components/reports/ParticipantReport';
import { LeaderboardEntry } from './types';
import { supabase } from './services/supabase';
import AppHeader from './components/AppHeader';

export type ViewName = 'dashboard' | 'assessment' | 'management' | 'justification' | 'report';

export interface ViewState {
  name: ViewName;
  context?: {
    participantId?: string;
    trainingId?: string;
    leaderboardEntry?: LeaderboardEntry;
  };
}

function App() {
  const [view, setView] = useState<ViewState>({ name: 'dashboard' });

  useEffect(() => {
    // Safely handle redirect if report view is missing context
    if (view.name === 'report' && (!view.context?.participantId || !view.context?.trainingId || !view.context?.leaderboardEntry)) {
      console.warn("Report view context is missing, redirecting to dashboard.");
      setView({ name: 'dashboard' });
    }
  }, [view]);

  const handleSelectParticipant = useCallback((trainingId: string, entry: LeaderboardEntry) => {
    setView({
      name: 'report',
      context: {
        trainingId: trainingId,
        participantId: entry.participantId,
        leaderboardEntry: entry
      }
    });
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setView({ name: 'dashboard' });
  }, []);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const renderActiveView = () => {
    switch (view.name) {
      case 'dashboard':
        return <Dashboard onSelectParticipant={handleSelectParticipant} />;
      case 'assessment':
        return <DailyAssessment />;
      case 'management':
        return <Management />;
      case 'justification':
        return <JustificationManagement />;
      case 'report':
        // The useEffect will handle the redirect, but we can still check here to prevent
        // rendering the component with incomplete props for a single frame.
        if (view.context?.participantId && view.context?.trainingId && view.context?.leaderboardEntry) {
          return (
            <ParticipantReport
              participantId={view.context.participantId}
              trainingId={view.context.trainingId}
              leaderboardEntry={view.context.leaderboardEntry}
              onBack={handleBackToDashboard}
            />
          );
        }
        // Render null while the useEffect redirects.
        return null;
      default:
        return <Dashboard onSelectParticipant={handleSelectParticipant} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {view.name !== 'report' && (
         <AppHeader 
            currentView={view.name}
            onNavigate={(viewName) => setView({ name: viewName })}
            onLogout={handleLogout}
         />
      )}
     
      <div className={view.name !== 'report' ? 'max-w-screen-xl mx-auto' : ''}>
        {renderActiveView()}
      </div>
    </div>
  );
}

export default App;