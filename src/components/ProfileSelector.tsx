"use client";

import React from 'react';
import { useApp, ProfileName } from '../context/AppContext';
import styles from './ProfileSelector.module.css';
import { User, Sparkles } from 'lucide-react';

export default function ProfileSelector() {
    const { switchProfile } = useApp();

    const handleSelect = (name: ProfileName) => {
        switchProfile(name);
    };

    return (
        <div className={styles.container}>
            <div className="animate-fade-in">
                <h1 className={styles.title}>Who is eating?</h1>

                <div className={styles.grid}>
                    <div className={styles.card} onClick={() => handleSelect('Felipe')}>
                        <div className={styles.avatar}>
                            <User size={32} />
                        </div>
                        <span className={styles.name}>Felipe</span>
                        <span className={styles.role}>Muscle Gain</span>
                    </div>

                    <div className={styles.card} onClick={() => handleSelect('Evelyn')}>
                        <div className={styles.avatar}>
                            <Sparkles size={32} />
                        </div>
                        <span className={styles.name}>Evelyn</span>
                        <span className={styles.role}>Healthy Life</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
