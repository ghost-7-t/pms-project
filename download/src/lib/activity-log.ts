// A simple activity logger for now.
// In a real application, this would connect to a logging service,
// a database (like Firestore), or a more robust logging framework.

type LogLevel = 'INFO' | 'WARN' | 'ERROR';

interface LogPayload {
    user?: string;
    role?: 'applicant' | 'admin';
    action: string;
    details?: object;
}

function log(level: LogLevel, payload: LogPayload) {    
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({
        timestamp,
        level,
        ...payload,
    }));
}

export const activityLog = {
    info: (payload: LogPayload) => log('INFO', payload),
    warn: (payload: LogPayload) => log('WARN', payload),
    error: (payload: LogPayload) => log('ERROR', payload),
};
