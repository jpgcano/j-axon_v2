import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
export class WebSocketService {
    io = null;
    static instance;
    constructor() { }
    static getInstance() {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }
    initialize(server, jwtSecret) {
        this.io = new SocketIOServer(server, {
            cors: {
                origin: '*', // Adjust for production
                methods: ['GET', 'POST']
            }
        });
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }
            try {
                const decoded = jwt.verify(token, jwtSecret);
                socket.user = decoded;
                next();
            }
            catch (err) {
                next(new Error('Authentication error'));
            }
        });
        this.io.on('connection', (socket) => {
            console.log(`[WebSocket] Client connected: ${socket.id}`);
            socket.on('disconnect', () => {
                console.log(`[WebSocket] Client disconnected: ${socket.id}`);
            });
        });
    }
    emitEvent(event, data) {
        if (this.io) {
            this.io.emit(event, data);
        }
        else {
            console.warn('[WebSocket] Cannot emit event, server not initialized.');
        }
    }
}
export const webSocketService = WebSocketService.getInstance();
//# sourceMappingURL=WebSocketService.js.map