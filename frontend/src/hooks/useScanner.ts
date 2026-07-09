import { useState, useCallback, useRef, useEffect } from 'react';

export interface ScannerConfig {
  isActive: boolean;
  cameraId?: string;
  resolution: { width: number; height: number };
}

export interface ScanEvent {
  barcode: string;
  timestamp: string;
  confidence: number;
}

export function useScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<ScanEvent | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanEvent[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScanner = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsScanning(true);
    } catch (err) {
      console.error('Failed to start scanner:', err);
      setIsScanning(false);
    }
  }, []);

  const stopScanner = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const simulateScan = useCallback((barcode: string) => {
    const event: ScanEvent = {
      barcode,
      timestamp: new Date().toISOString(),
      confidence: Math.floor(Math.random() * 15) + 85,
    };
    setLastScan(event);
    setScanHistory(prev => [event, ...prev]);
    return event;
  }, []);

  const clearHistory = useCallback(() => {
    setScanHistory([]);
    setLastScan(null);
  }, []);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  return {
    isScanning,
    lastScan,
    scanHistory,
    videoRef,
    startScanner,
    stopScanner,
    simulateScan,
    clearHistory,
  };
}
