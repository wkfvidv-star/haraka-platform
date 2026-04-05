type Callback = (data?: any) => void;

class EventBus {
  private events: { [key: string]: Callback[] } = {};

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key?.startsWith('haraka_event_')) {
          const eventName = event.key.replace('haraka_event_', '');
          try {
            const data = event.newValue ? JSON.parse(event.newValue) : null;
            this.emitLocal(eventName, data);
          } catch (e) {
            console.error('EventBus: Failed to parse cross-tab event', e);
          }
        }
      });
    }
  }

  public subscribe(event: string, callback: Callback): () => void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  }

  public emit(event: string, data?: any) {
    // 1. Emit locally for immediate UI update
    this.emitLocal(event, data);

    // 2. Emit via localStorage for cross-tab synchronization
    if (typeof window !== 'undefined') {
      const key = `haraka_event_${event}`;
      localStorage.setItem(key, JSON.stringify({ data, _ts: Date.now() }));
      // We don't need to keep it in localStorage, just trigger the 'storage' event
      // Some browsers don't trigger storage event on the same tab, which is fine as we emitLocal
    }
  }

  private emitLocal(event: string, data?: any) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
    // Also dispatch as custom window event for legacy components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(`haraka:${event}`, { detail: data }));
    }
  }
}

export const eventBus = new EventBus();

// Common Event Names
export const EVENTS = {
  EVALUATION_CREATED: 'EVALUATION_CREATED',
  SESSION_BOOKED: 'SESSION_BOOKED',
  TASK_COMPLETED: 'TASK_COMPLETED',
  MESSAGE_SENT: 'MESSAGE_SENT',
  KPI_UPDATED: 'KPI_UPDATED',
  SIMULATION_STEP: 'SIMULATION_STEP',
  AUDIT_LOGGED: 'AUDIT_LOGGED'
};
