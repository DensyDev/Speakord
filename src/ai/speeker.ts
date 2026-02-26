export type Gender = 'male' | 'female' | 'neutral' | 'unknown'
export type Age = 'child' | 'youth' | 'adult' | 'senior';

export interface PitchPoint {
  pos: number;
  change: string; // example: "+5st", "-10Hz", "low"
}

export interface Voice {
    name: string;
    locale: string;
    gender: Gender;
}

export interface Temperament {
  pitchBias: number;
  rateBias: number;
  energyBias: number;
  age?: Age;
  traits?: string[];
}

export interface Emotion {
  valence: number;
  arousal: number;
  volume: number;
  contour?: PitchPoint[];
  mood?: string;
  prompt?: string
}

export interface Speeker {
    temperament: Temperament;
    emotion: Emotion;
    voice: Voice;
}