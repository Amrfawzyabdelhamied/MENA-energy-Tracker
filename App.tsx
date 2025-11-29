import React from 'react';
import Dashboard from './components/Dashboard';
import { Activity } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-none">MENA Energy Tracker</h1>
                <p className="text-xs text-slate-500 font-medium">Egypt & Neighbors Comparative Analysis</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-full text-slate-600">
                Powered by Gemini 2.5 Flash
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            AI-generated analysis. Data should be verified against official sources like IEA or Ember.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;