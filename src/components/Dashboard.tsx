"use client";

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import styles from './Dashboard.module.css';
import { Camera, Plus, ChevronRight, LogOut } from 'lucide-react';
import CameraCapture from './CameraCapture';

export default function Dashboard() {
    const { userData, switchProfile } = useApp();
    const [showCamera, setShowCamera] = useState(false);

    if (!userData) return null;

    const totalCalories = userData.entries.reduce((acc, curr) => acc + curr.calories, 0);
    const totalProtein = userData.entries.reduce((acc, curr) => acc + curr.protein, 0);
    const totalCarbs = userData.entries.reduce((acc, curr) => acc + curr.carbs, 0);
    const totalFat = userData.entries.reduce((acc, curr) => acc + curr.fat, 0);

    const calPercentage = Math.min((totalCalories / userData.goals.calories) * 100, 100);

    // SVG Ring calculation
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (calPercentage / 100) * circumference;

    return (
        <div className="container animate-fade-in">
            <header className={styles.header}>
                <div>
                    <div className={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
                    <h1 className={styles.greeting}>Hello, {userData.name}</h1>
                </div>
                <button
                    onClick={() => switchProfile(null as any)}
                    className="btn-secondary"
                    style={{ padding: '8px', borderRadius: '50%' }}
                >
                    <LogOut size={20} />
                </button>
            </header>

            <div className={styles.summaryCard}>
                <div className={styles.ringContainer}>
                    <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                        <circle
                            cx="100"
                            cy="100"
                            r={radius}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="12"
                            fill="transparent"
                        />
                        <circle
                            cx="100"
                            cy="100"
                            r={radius}
                            stroke="var(--primary)"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 1s ease' }}
                        />
                    </svg>
                    <div className={styles.ringLabel}>
                        <div className={styles.caloriesValue}>{userData.goals.calories - totalCalories}</div>
                        <div className={styles.caloriesLabel}>Kcal Left</div>
                    </div>
                </div>

                <div className={styles.macrosGrid}>
                    <div className={styles.macroItem}>
                        <span className={styles.macroLabel}>Protein</span>
                        <span className={styles.macroValue}>{totalProtein}g</span>
                        <div className={styles.macroBar}>
                            <div
                                className={styles.macroFill}
                                style={{ width: `${Math.min((totalProtein / userData.goals.protein) * 100, 100)}%`, background: '#60A5FA' }}
                            />
                        </div>
                    </div>
                    <div className={styles.macroItem}>
                        <span className={styles.macroLabel}>Carbs</span>
                        <span className={styles.macroValue}>{totalCarbs}g</span>
                        <div className={styles.macroBar}>
                            <div
                                className={styles.macroFill}
                                style={{ width: `${Math.min((totalCarbs / userData.goals.carbs) * 100, 100)}%`, background: '#F472B6' }}
                            />
                        </div>
                    </div>
                    <div className={styles.macroItem}>
                        <span className={styles.macroLabel}>Fat</span>
                        <span className={styles.macroValue}>{totalFat}g</span>
                        <div className={styles.macroBar}>
                            <div
                                className={styles.macroFill}
                                style={{ width: `${Math.min((totalFat / userData.goals.fat) * 100, 100)}%`, background: '#FCD34D' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.sectionTitle}>
                <h3>Today's Meals</h3>
                <span style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>View All</span>
            </div>

            <div className={styles.mealList}>
                {userData.entries.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                        No meals yet. Tap + to scan food.
                    </div>
                ) : (
                    userData.entries.map((entry) => (
                        <div key={entry.id} className={styles.mealItem}>
                            {entry.imageUrl ? (
                                <img src={entry.imageUrl} alt={entry.name} className={styles.mealImage} />
                            ) : (
                                <div className={styles.mealImage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    🍔
                                </div>
                            )}
                            <div className={styles.mealInfo}>
                                <span className={styles.mealName}>{entry.name}</span>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>
                                    {entry.protein}g P • {entry.carbs}g C • {entry.fat}g F
                                </span>
                            </div>
                            <span className={styles.mealCals}>{entry.calories} kcal</span>
                        </div>
                    ))
                )}
            </div>

            <button className={styles.fab} onClick={() => setShowCamera(true)}>
                <Camera size={28} />
            </button>

            {showCamera && <CameraCapture onClose={() => setShowCamera(false)} />}
        </div>
    );
}
