import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { EnergyData } from '../types';

interface ChartsProps {
  data: EnergyData[];
}

const COLORS_MIX = {
  Fossil: '#ef4444', // red-500
  Renewable: '#22c55e', // green-500
  Nuclear: '#eab308' // yellow-500
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    // Check if we are hovering on a chart that uses the raw EnergyData object (Gen & Emissions charts)
    // Raw EnergyData has an 'energyMix' property.
    const isRawData = data.energyMix !== undefined;

    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 border border-slate-200 shadow-xl rounded-xl outline-none min-w-[200px] z-50 text-slate-800">
        <p className="font-bold text-slate-900 mb-2 pb-2 border-b border-slate-100 text-sm">
          {label}
        </p>
        
        {/* Main Hovered Metrics */}
        <div className="space-y-1.5 mb-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between text-sm gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full shadow-sm" 
                  style={{ backgroundColor: entry.color }} 
                />
                <span className="font-medium text-slate-600">{entry.name}:</span>
              </div>
              <span className="font-bold text-slate-800">
                {Number(entry.value).toLocaleString()}
                <span className="ml-1 text-slate-500 font-normal text-xs">{entry.unit}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Energy Mix Breakdown Footer (For Generation & Emissions Charts) */}
        {isRawData && (
          <div className="mt-3 pt-2 border-t border-slate-100 bg-slate-50 -mx-3 -mb-3 p-3 rounded-b-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Energy Mix</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-green-600">{data.energyMix.renewablePercentage}%</span>
                <span className="text-[9px] text-slate-500 font-medium">Renewable</span>
              </div>
              <div className="flex flex-col items-center border-l border-slate-200">
                <span className="text-xs font-bold text-red-500">{data.energyMix.fossilPercentage}%</span>
                <span className="text-[9px] text-slate-500 font-medium">Fossil</span>
              </div>
              <div className="flex flex-col items-center border-l border-slate-200">
                <span className="text-xs font-bold text-yellow-600">{data.energyMix.nuclearPercentage}%</span>
                <span className="text-[9px] text-slate-500 font-medium">Nuclear</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const GenerationChart: React.FC<ChartsProps> = ({ data }) => {
  return (
    <div className="h-80 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Total Generation (TWh)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="country" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Bar 
            dataKey="totalGenerationTWh" 
            name="Generation" 
            unit="TWh"
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const EmissionsChart: React.FC<ChartsProps> = ({ data }) => {
  return (
    <div className="h-80 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">CO2 Emissions (Mt)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="country" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Bar 
            dataKey="co2EmissionsMt" 
            name="CO2 Emissions" 
            unit="Mt"
            fill="#64748b" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const MixComparisonChart: React.FC<ChartsProps> = ({ data }) => {
  // Transform data for stacked bar
  const chartData = data.map(d => ({
    country: d.country,
    Fossil: d.energyMix.fossilPercentage,
    Renewable: d.energyMix.renewablePercentage,
    Nuclear: d.energyMix.nuclearPercentage,
  }));

  return (
    <div className="h-96 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Energy Mix (%)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis dataKey="country" type="category" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} width={80} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <Legend />
          <Bar dataKey="Renewable" stackId="a" unit="%" fill={COLORS_MIX.Renewable} radius={[0, 4, 4, 0]} />
          <Bar dataKey="Nuclear" stackId="a" unit="%" fill={COLORS_MIX.Nuclear} />
          <Bar dataKey="Fossil" stackId="a" unit="%" fill={COLORS_MIX.Fossil} radius={[4, 0, 0, 4]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};