import type { Server as HTTPServer } from 'http';
export declare class WebSocketService {
    private io;
    private static instance;
    private constructor();
    static getInstance(): WebSocketService;
    initialize(server: HTTPServer, jwtSecret: string): void;
    emitEvent(event: string, data: any): void;
}
export declare const webSocketService: WebSocketService;
//# sourceMappingURL=WebSocketService.d.ts.map