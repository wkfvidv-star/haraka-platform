export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

class AuditService {
  private getLogs(): AuditLog[] {
    try {
      const logs = localStorage.getItem('parent_audit_logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  public log(action: string, details: string) {
    const logs = this.getLogs();
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      details
    };
    
    logs.unshift(newLog); // Add to beginning
    localStorage.setItem('parent_audit_logs', JSON.stringify(logs));
    
    // Transparent logging for verification
    console.log(`[Audit Log] ${action} - ${details}`);
  }

  public getAllLogs(): AuditLog[] {
    return this.getLogs();
  }
}

export const auditService = new AuditService();

// Expose globally for debugging purposes as requested logically
if (typeof window !== 'undefined') {
  (window as any).showAuditLogs = () => {
    console.table(auditService.getAllLogs().map(l => ({
      Date: new Date(l.timestamp).toLocaleString('ar-SA'),
      Action: l.action,
      Details: l.details
    })));
  };
}
