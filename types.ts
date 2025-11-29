export interface EnergyData {
  country: string;
  totalGenerationTWh: number;
  co2EmissionsMt: number;
  energyMix: {
    fossilPercentage: number;
    renewablePercentage: number;
    nuclearPercentage: number;
    details: string; // Short string describing top sources e.g., "Mostly Gas"
    topSources: {
      source: string;
      percentage: number;
    }[];
  };
  analysis: string; // Specific analysis for this country
}

export interface AnalysisResult {
  overview: string;
  data: EnergyData[];
  generatedAt: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}