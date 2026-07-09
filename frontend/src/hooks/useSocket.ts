import { useState, useEffect, useCallback, useRef } from 'react';
import { WS_BASE_URL } from '../config/constants';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface SocketMessage<T = unknown> {
  event: string;
  data: T;
  timestamp: string;
}

export function useSocket(channel: string) {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<SocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setStatus('connecting');
    try {
      const ws = new WebSocket(`${WS_BASE_URL}/${channel}`);

      ws.onopen = () => setStatus('connected');
      ws.onclose = () => {
        setStatus('disconnected');
        // Auto-reconnect after 3s
        reconnectTimer.current = setTimeout(() => connect(), 3000);
      };
      ws.onerror = () => setStatus('error');
      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data) as SocketMessage;
          setLastMessage(parsed);
        } catch {
          console.warn('Failed to parse WebSocket message');
        }
      };

      wsRef.current = ws;
    } catch {
      setStatus('error');
    }
  }, [channel]);

  const disconnect = useCallback(() => {
    clearTimeout(reconnectTimer.current);
    wsRef.current?.close();
    wsRef.current = null;
    setStatus('disconnected');
  }, []);

  const send = useCallback((event: string, data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ event, data, timestamp: new Date().toISOString() }));
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { status, lastMessage, connect, disconnect, send };
}
