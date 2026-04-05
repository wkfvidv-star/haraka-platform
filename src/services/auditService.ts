import { eventBus, EVENTS } from './eventBus';

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  actorId?: string;
  actorRole?: 'student' | 'youth' | 'parent' | 'teacher' | 'coach' | 'admin' | 'system';
  preState?: any;
  postState?: any;
  category: string;
}

class AuditService {
  private getUserId(): string {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr).id : 'anonymous';
    } catch {
      return 'anonymous';
    }
  }

  private getUserRole(): any {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr).role : 'system';
    } catch {
      return 'system';
    }
  }

  private getLogs(): AuditLog[] {
    try {
      const logs = localStorage.getItem('haraka_global_audit_logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  /**
   * Log an action with actor and state details
   */
  public log(
    action: string, 
    details: string, 
    category: string = 'general',
    options: { preState?: any, postState?: any, actorId?: string, actorRole?: AuditLog['actorRole'] } = {}
  ) {
    const logs = this.getLogs();
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      details,
      actorId: options.actorId || this.getUserId(),
      actorRole: options.actorRole || this.getUserRole(),
      preState: options.preState,
      postState: options.postState,
      category
    };
    
    logs.unshift(newLog);
    // Keep last 1000 logs for simulation/demo purposes
    const trimmedLogs = logs.slice(0, 1000);
    localStorage.setItem('haraka_global_audit_logs', JSON.stringify(trimmedLogs));
    
    // Emit for real-time monitoring instruments
    eventBus.emit(EVENTS.AUDIT_LOGGED, newLog);
    
    console.log(`[Audit Trail - ${newLog.actorRole}] <${action}>: ${details}`);
  }

  public getAllLogs(): AuditLog[] {
    return this.getLogs();
  }

  public getLogsByCategory(category: string): AuditLog[] {
    return this.getLogs().filter(l => l.category === category);
  }

  public clearLogs() {
    localStorage.removeItem('haraka_global_audit_logs');
  }
}

export const auditService = new AuditService();

// Expose globally for browser console audit
if (typeof window !== 'undefined') {
  (window as any).auditLedger = () => {
    console.table(auditService.getAllLogs().map(l => ({
      Time: new Date(l.timestamp).toLocaleTimeString(),
      Actor: `${l.actorRole} (${l.actorId})`,
      Action: l.action,
      Details: l.details,
      Category: l.category
    })));
  };
}
