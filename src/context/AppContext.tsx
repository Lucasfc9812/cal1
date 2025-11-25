"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ProfileName = 'Felipe' | 'Evelyn';

export interface MacroNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodEntry extends MacroNutrients {
  id: string;
  name: string;
  imageUrl?: string;
  timestamp: number;
}

export interface UserData {
  name: ProfileName;
  entries: FoodEntry[];
  goals: MacroNutrients;
}

interface AppContextType {
  currentProfile: ProfileName | null;
  switchProfile: (profile: ProfileName) => void;
  userData: UserData | null;
  addEntry: (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => void;
  isLoading: boolean;
}

const defaultGoals: MacroNutrients = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentProfile, setCurrentProfile] = useState<ProfileName | null>(null);
  const [allData, setAllData] = useState<Record<ProfileName, UserData>>({
    Felipe: { name: 'Felipe', entries: [], goals: { ...defaultGoals, calories: 2500, protein: 180 } },
    Evelyn: { name: 'Evelyn', entries: [], goals: { ...defaultGoals, calories: 1800, protein: 120 } }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('calai_data');
    if (savedData) {
      try {
        setAllData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('calai_data', JSON.stringify(allData));
    }
  }, [allData, isLoading]);

  const switchProfile = (profile: ProfileName) => {
    setCurrentProfile(profile);
  };

  const addEntry = (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => {
    if (!currentProfile) return;

    const newEntry: FoodEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    setAllData(prev => ({
      ...prev,
      [currentProfile]: {
        ...prev[currentProfile],
        entries: [newEntry, ...prev[currentProfile].entries]
      }
    }));
  };

  const userData = currentProfile ? allData[currentProfile] : null;

  return (
    <AppContext.Provider value={{ currentProfile, switchProfile, userData, addEntry, isLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
