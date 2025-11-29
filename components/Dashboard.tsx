import React, { useEffect, useState } from 'react';
import { fetchEnergyAnalysis } from '../services/gemini';
import { AnalysisResult, LoadingState } from '../types';
import { GenerationChart, EmissionsChart, MixComparisonChart } from './EnergyCharts';
import { Loader2, RefreshCw, Zap, Wind, AlertCircle, Info, ExternalLink } from 'lucide-react';

const getSourceColor = (source: string) => {
  const s = source.toLowerCase();
  if (s.includes('solar') || s.includes('wind') || s.includes('hydro') || s.includes('renewable') || s.includes('geothermal')) {
    return '#22c55e'; // green-500
  }
  if (s.includes('nuclear')) {
    return '#eab308'; // yellow-500
  }
  if (s.includes('gas')) {
    return '#f97316'; // orange-500
  }
  if (s.includes('oil') || s.includes('coal') || s.includes('fossil')) {
    return '#ef4444'; // red-500
  }
  return '#3b82f6'; // blue-500 default
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoadingState(LoadingState.LOADING);
    setError(null);
    try {
      const result = await fetchEnergyAnalysis();
      setData(result);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      setError("Failed to fetch analysis data. Please check your API key and try again.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingState === LoadingState.LOADING || loadingState === LoadingState.IDLE) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Consulting Gemini knowledge base...</p>
      </div>
    );
  }

  if (loadingState === LoadingState.ERROR) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Analysis Failed</h3>
        <p className="text-slate-500 mb-6 max-w-md">{error}</p>
        <button 
          onClick={loadData}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Analysis
        </button>
      </div>
    );
  }

  if (!data) return null;

  const egyptData = data.data.find(d => d.country.toLowerCase().includes('egypt'));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-300" />
            Regional Analysis Overview
          </h2>
          <p className="text-blue-100 leading-relaxed text-lg">
            {data.overview}
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-blue-200 bg-white/10 w-fit px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Data Reference: ~{data.generatedAt}
          </div>
        </div>

        {/* Egypt Highlight Card */}
        {egyptData && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            <h3 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2 relative z-10">
              <span className="text-2xl">🇪🇬</span> Egypt Focus
            </h3>
            <div className="mt-4 space-y-4 relative z-10">
              <div>
                <p className="text-sm text-slate-500">Renewable Share</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-green-600">{egyptData.energyMix.renewablePercentage}%</span>
                  <span className="text-sm text-slate-400 mb-1">of total</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="bg-green-500 h-full rounded-full" 
                    style={{ width: `${egyptData.energyMix.renewablePercentage}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500">CO2 Intensity</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-slate-700">{egyptData.co2EmissionsMt}</span>
                  <span className="text-sm text-slate-400 mb-1">Mt CO2</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Data Source Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-slate-600 w-full">
          <p className="font-semibold text-slate-900 mb-1">Data Source Verification</p>
          <p className="leading-relaxed">
            This analysis was generated by Gemini AI based on data estimates for <strong>{data.generatedAt}</strong>. 
            While useful for comparative insights, please verify specific figures with official reports from authoritative sources like the
            <a 
              href="https://www.iea.org/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-0.5 font-bold text-blue-700 hover:text-blue-900 mx-1.5 underline decoration-blue-300 hover:decoration-blue-700 decoration-2 underline-offset-2 transition-all"
            >
              IEA <ExternalLink className="w-3 h-3" />
            </a> 
            or 
            <a 
              href="https://ember-climate.org/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-0.5 font-bold text-blue-700 hover:text-blue-900 mx-1.5 underline decoration-blue-300 hover:decoration-blue-700 decoration-2 underline-offset-2 transition-all"
            >
              Ember <ExternalLink className="w-3 h-3" />
            </a>.
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenerationChart data={data.data} />
        <EmissionsChart data={data.data} />
      </div>

      {/* Full Width Mix Chart */}
      <div className="w-full">
        <MixComparisonChart data={data.data} />
      </div>

      {/* Detailed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.data.map((country, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-800">{country.country}</h3>
              {country.energyMix.renewablePercentage > 20 ? (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                  <Wind className="w-3 h-3" /> Leading
                </span>
              ) : (
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                  Transitioning
                </span>
              )}
            </div>
            
            <p className="text-slate-600 text-sm mb-4 leading-relaxed h-16 line-clamp-3">
              {country.analysis}
            </p>

            {/* Top Sources Breakdown */}
            <div className="mb-4 pt-4 border-t border-slate-50">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Top Sources</p>
              <div className="space-y-3">
                {country.energyMix.topSources?.map((source, i) => (
                  <div key={i}>
                     <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium text-slate-700 truncate pr-2" title={source.source}>
                          {source.source}
                        </span>
                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">
                          {source.percentage}%
                        </span>
                     </div>
                     <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                       <div 
                         className="h-full rounded-full transition-all duration-1000 ease-out" 
                         style={{ 
                           width: `${source.percentage}%`,
                           backgroundColor: getSourceColor(source.source)
                         }}
                       ></div>
                     </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-50">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Total Output</span>
                 <span className="font-medium text-slate-700">{country.totalGenerationTWh} TWh</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">CO₂ / Renewable</span>
                 <div className="flex items-center">
                    <span className="font-medium text-slate-700">{country.co2EmissionsMt} Mt</span>
                    <span className="text-slate-300 mx-2">/</span>
                    <span className="font-medium text-green-600">{country.energyMix.renewablePercentage}%</span>
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end pb-8">
        <button 
          onClick={loadData} 
          className="text-slate-500 hover:text-blue-600 text-sm flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh Analysis
        </button>
      </div>

    </div>
  );
};

export default Dashboard;