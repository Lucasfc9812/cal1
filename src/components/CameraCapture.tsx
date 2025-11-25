"use client";

import React, { useState, useRef } from 'react';
import styles from './CameraCapture.module.css';
import { X, Check, Upload, Camera as CameraIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CameraCaptureProps {
    onClose: () => void;
}

const MOCK_RESULTS = [
    { name: 'Cheeseburger', calories: 550, protein: 30, carbs: 45, fat: 25 },
    { name: 'Caesar Salad', calories: 320, protein: 15, carbs: 12, fat: 22 },
    { name: 'Pepperoni Pizza', calories: 280, protein: 12, carbs: 35, fat: 10 },
    { name: 'Grilled Chicken & Rice', calories: 450, protein: 45, carbs: 50, fat: 8 },
    { name: 'Avocado Toast', calories: 380, protein: 10, carbs: 40, fat: 18 },
];

export default function CameraCapture({ onClose }: CameraCaptureProps) {
    const { addEntry } = useApp();
    const [image, setImage] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<typeof MOCK_RESULTS[0] | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                startScan();
            };
            reader.readAsDataURL(file);
        }
    };

    const startScan = () => {
        setIsScanning(true);
        // Simulate AI processing
        setTimeout(() => {
            const randomResult = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
            setResult(randomResult);
            setIsScanning(false);
        }, 2500);
    };

    const handleSave = () => {
        if (result && image) {
            addEntry({
                name: result.name,
                calories: result.calories,
                protein: result.protein,
                carbs: result.carbs,
                fat: result.fat,
                imageUrl: image
            });
            onClose();
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.header}>
                <button onClick={onClose} className={styles.closeBtn}>
                    <X size={24} />
                </button>
            </div>

            <div className={styles.cameraView}>
                {image ? (
                    <>
                        <img src={image} alt="Preview" className={styles.previewImage} />
                        {isScanning && (
                            <div className={styles.scanningOverlay}>
                                <div className={styles.scanLine} />
                                <h3 style={{ marginTop: '20px', color: 'var(--primary)' }}>Analyzing Food...</h3>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ textAlign: 'center', color: '#666' }}>
                        <CameraIcon size={64} style={{ marginBottom: '20px', opacity: 0.5 }} />
                        <p>Tap capture to take a photo</p>
                    </div>
                )}
            </div>

            {!result && !isScanning && (
                <div className={styles.controls}>
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <button
                        className={styles.captureBtn}
                        onClick={() => fileInputRef.current?.click()}
                    />
                </div>
            )}

            {result && !isScanning && (
                <div className={styles.resultCard}>
                    <h2 className={styles.resultTitle}>{result.name}</h2>

                    <div className={styles.nutritionGrid}>
                        <div className={styles.nutritionItem}>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>Calories</div>
                            <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{result.calories}</div>
                        </div>
                        <div className={styles.nutritionItem}>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>Protein</div>
                            <div style={{ fontWeight: 'bold' }}>{result.protein}g</div>
                        </div>
                        <div className={styles.nutritionItem}>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>Carbs</div>
                            <div style={{ fontWeight: 'bold' }}>{result.carbs}g</div>
                        </div>
                        <div className={styles.nutritionItem}>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>Fat</div>
                            <div style={{ fontWeight: 'bold' }}>{result.fat}g</div>
                        </div>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSave}>
                        <Check size={20} />
                        Add to Log
                    </button>
                </div>
            )}
        </div>
    );
}
