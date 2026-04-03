export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

class AuditService {
  private getLogs(category: string = 'parent'): AuditLog[] {
    try {
      const key = `${category}_audit_logs`;
      const logs = localStorage.getItem(key);
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  public log(action: string, details: string, category: string = 'parent') {
    const logs = this.getLogs(category);
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      details
    };
    
    logs.unshift(newLog); // Add to beginning
    localStorage.setItem(`${category}_audit_logs`, JSON.stringify(logs));
    
    // Transparent logging for verification
    console.log(`[Audit Log - ${category}] ${action} - ${details}`);
  }

  public getAllLogs(category: string = 'parent'): AuditLog[] {
    return this.getLogs(category);
  }
}

export const auditService = new AuditService();

// Expose globally for debugging purposes
if (typeof window !== 'undefined') {
  (window as any).showAuditLogs = (category: string = 'parent') => {
    console.table(auditService.getAllLogs(category).map(l => ({
      Date: new Date(l.timestamp).toLocaleString('ar-SA'),
      Action: l.action,
      Details: l.details
    })));
  };
}
