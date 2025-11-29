import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const energyDataSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    country: { type: Type.STRING, description: "Name of the country" },
    totalGenerationTWh: { type: Type.NUMBER, description: "Total annual electricity generation in Terawatt-hours (TWh)" },
    co2EmissionsMt: { type: Type.NUMBER, description: "Annual CO2 emissions from energy in Million Tonnes (Mt)" },
    energyMix: {
      type: Type.OBJECT,
      properties: {
        fossilPercentage: { type: Type.NUMBER, description: "Percentage of generation from fossil fuels (0-100)" },
        renewablePercentage: { type: Type.NUMBER, description: "Percentage of generation from renewables (0-100)" },
        nuclearPercentage: { type: Type.NUMBER, description: "Percentage of generation from nuclear (0-100)" },
        details: { type: Type.STRING, description: "Short summary of main sources, e.g., 'Natural Gas dominance, growing Solar'" },
        topSources: {
          type: Type.ARRAY,
          description: "List of top 3 electricity generation sources with their percentage share.",
          items: {
            type: Type.OBJECT,
            properties: {
              source: { type: Type.STRING, description: "Name of the source (e.g. Natural Gas, Solar, Oil)" },
              percentage: { type: Type.NUMBER, description: "Percentage share (0-100)" }
            },
            required: ["source", "percentage"]
          }
        }
      },
      required: ["fossilPercentage", "renewablePercentage", "nuclearPercentage", "details", "topSources"]
    },
    analysis: { type: Type.STRING, description: "A brief specific insight about this country's clean energy transition status." }
  },
  required: ["country", "totalGenerationTWh", "co2EmissionsMt", "energyMix", "analysis"]
};

const analysisResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overview: { type: Type.STRING, description: "A high-level paragraph comparing Egypt's situation to its neighbors generally." },
    data: {
      type: Type.ARRAY,
      items: energyDataSchema
    },
    generatedAt: { type: Type.STRING, description: "The approximate year/period this data represents." }
  },
  required: ["overview", "data", "generatedAt"]
};

export const fetchEnergyAnalysis = async (): Promise<AnalysisResult> => {
  try {
    const prompt = `
      Perform a comparative analysis of clean energy adoption and CO2 emissions for the following countries:
      Egypt, Saudi Arabia, Turkey, Israel, and United Arab Emirates (UAE).
      
      Focus on:
      1. Total Electricity Generation (TWh).
      2. CO2 Emissions (Million Tonnes).
      3. Energy Mix percentages (Fossil vs Renewable vs Nuclear).
      4. Detailed breakdown of top 3 generation sources (e.g. Gas, Wind, Solar) and their % share.
      
      Provide the most recent reliable annual data available to you (likely 2023 or 2024).
      Ensure the numbers are realistic estimates based on public energy reports (like Ember, BP Statistical Review, IEA).
      
      The output must be JSON matching the schema provided.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisResponseSchema,
        systemInstruction: "You are an expert energy analyst specializing in the MENA (Middle East and North Africa) region. Be precise with data."
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No data received from Gemini.");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};