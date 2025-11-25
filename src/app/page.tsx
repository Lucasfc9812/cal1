"use client";

import { useApp } from "../context/AppContext";
import ProfileSelector from "../components/ProfileSelector";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const { currentProfile, isLoading } = useApp();

  if (isLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--primary)'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <main>
      {!currentProfile ? <ProfileSelector /> : <Dashboard />}
    </main>
  );
}
