'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { useQueryClient } from '@tanstack/react-query';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, isAuthenticated } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isAuthenticated && token) {
      const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
        auth: {
          token,
        },
      });

      socketInstance.on('connect', () => {
        setConnected(true);
        console.log('[WebSocket] Connected to server');
      });

      socketInstance.on('disconnect', () => {
        setConnected(false);
        console.log('[WebSocket] Disconnected from server');
      });

      // Real-time Listeners
      socketInstance.on('ticket:created', (data) => {
        console.log('[WebSocket] Ticket Created:', data);
        queryClient.invalidateQueries({ queryKey: ['tickets'] });
      });

      socketInstance.on('ticket:updated', (data) => {
        console.log('[WebSocket] Ticket Updated:', data);
        queryClient.invalidateQueries({ queryKey: ['tickets'] });
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    } else {
      setSocket(null);
      setConnected(false);
    }
  }, [isAuthenticated, token, queryClient]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
