import { runWithRequestContext, setRequestIpOrigin } from '../../infrastructure/context/RequestContext.js';
export function requestContextMiddleware(req, _res, next) {
    const ipOrigin = req.ip || req.socket.remoteAddress || '0.0.0.0';
    runWithRequestContext({ ipOrigin }, () => {
        // Ensure ip is present even if something else sets context later
        setRequestIpOrigin(ipOrigin);
        next();
    });
}
//# sourceMappingURL=requestContext.js.map