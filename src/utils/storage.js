/**
 * LocalStorage management for ProcVision simulation history and statistics
 */

const STORAGE_KEYS = {
  RECENT_SIMULATIONS: 'procvision_recent_simulations',
  TOTAL_PROCESSES_COUNT: 'procvision_total_processes_count',
  TOTAL_SIMULATIONS_COUNT: 'procvision_total_simulations_count',
};

export function saveSimulationHistory({ algorithm, processes, metrics }) {
  try {
    const historyItem = {
      id: 'sim_' + Date.now(),
      algorithm, // 'SJF' | 'SRTF' | 'Comparison'
      processCount: processes.length,
      processes: processes.map((p) => ({
        id: p.id,
        arrivalTime: p.arrivalTime,
        burstTime: p.burstTime,
      })),
      metrics: {
        avgWaitingTime: metrics.avgWaitingTime,
        avgTurnaroundTime: metrics.avgTurnaroundTime,
        avgResponseTime: metrics.avgResponseTime,
        cpuUtilization: metrics.cpuUtilization,
        throughput: metrics.throughput,
      },
      timestamp: new Date().toISOString(),
    };

    // Update history list (keep latest 10)
    const existing = getSimulationHistory();
    const updated = [historyItem, ...existing].slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.RECENT_SIMULATIONS, JSON.stringify(updated));

    // Update cumulative counts
    const prevProcCount = getTotalProcessesSimulated();
    localStorage.setItem(STORAGE_KEYS.TOTAL_PROCESSES_COUNT, String(prevProcCount + processes.length));

    const prevSimCount = getTotalSimulationsCount();
    localStorage.setItem(STORAGE_KEYS.TOTAL_SIMULATIONS_COUNT, String(prevSimCount + 1));

    return historyItem;
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
    return null;
  }
}

export function getSimulationHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECENT_SIMULATIONS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('LocalStorage read failed:', e);
    return [];
  }
}

export function getTotalProcessesSimulated() {
  try {
    const count = localStorage.getItem(STORAGE_KEYS.TOTAL_PROCESSES_COUNT);
    return count ? parseInt(count, 10) : 0;
  } catch {
    return 0;
  }
}

export function getTotalSimulationsCount() {
  try {
    const count = localStorage.getItem(STORAGE_KEYS.TOTAL_SIMULATIONS_COUNT);
    return count ? parseInt(count, 10) : 0;
  } catch {
    return 0;
  }
}

export function clearSimulationHistory() {
  try {
    localStorage.removeItem(STORAGE_KEYS.RECENT_SIMULATIONS);
  } catch (e) {
    console.warn('LocalStorage clear failed:', e);
  }
}
