import { calculateMetrics } from './calculations.js';

/**
 * Non-Preemptive Shortest Job First (SJF) Scheduling Algorithm
 * 
 * @param {Array<{id: string, arrivalTime: number, burstTime: number}>} rawProcesses
 * @returns {Object} Simulation result with timeline, processes with metrics, and summary stats
 */
export function runSJF(rawProcesses) {
  if (!rawProcesses || rawProcesses.length === 0) {
    return {
      processes: [],
      timeline: [],
      executionSequence: [],
      metrics: calculateMetrics([], []),
    };
  }

  // Clone and sanitize
  const processes = rawProcesses.map((p, index) => ({
    id: p.id ? String(p.id).trim() : `P${index + 1}`,
    arrivalTime: Math.max(0, Number(p.arrivalTime) || 0),
    burstTime: Math.max(1, Number(p.burstTime) || 1),
    originalOrder: index,
  }));

  const n = processes.length;
  const completedProcesses = [];
  const timeline = [];
  const executionSequence = [];

  let currentTime = 0;
  const completedSet = new Set();

  while (completedSet.size < n) {
    // Arrived candidates not yet completed
    const available = processes.filter(
      (p) => p.arrivalTime <= currentTime && !completedSet.has(p.id)
    );

    if (available.length === 0) {
      // CPU Idle: advance time to next arrival
      const unarrived = processes
        .filter((p) => !completedSet.has(p.id))
        .sort((a, b) => a.arrivalTime - b.arrivalTime);

      const nextArrival = unarrived[0].arrivalTime;
      
      timeline.push({
        processId: 'IDLE',
        label: 'Idle',
        startTime: currentTime,
        endTime: nextArrival,
        duration: nextArrival - currentTime,
        isIdle: true,
      });

      currentTime = nextArrival;
      continue;
    }

    // Select candidate with shortest burst time.
    // Tie-breaker: earlier arrival time, then original order
    available.sort((a, b) => {
      if (a.burstTime !== b.burstTime) {
        return a.burstTime - b.burstTime;
      }
      if (a.arrivalTime !== b.arrivalTime) {
        return a.arrivalTime - b.arrivalTime;
      }
      return a.originalOrder - b.originalOrder;
    });

    const chosen = available[0];
    const startTime = currentTime;
    const endTime = currentTime + chosen.burstTime;

    timeline.push({
      processId: chosen.id,
      label: chosen.id,
      startTime,
      endTime,
      duration: chosen.burstTime,
      isIdle: false,
    });

    executionSequence.push({
      processId: chosen.id,
      startTime,
      endTime,
      burstTime: chosen.burstTime,
    });

    completedProcesses.push({
      ...chosen,
      completionTime: endTime,
      firstResponseTime: startTime,
    });

    completedSet.add(chosen.id);
    currentTime = endTime;
  }

  // Sort completed processes by original order or ID for display consistency
  completedProcesses.sort((a, b) => a.originalOrder - b.originalOrder);

  const metrics = calculateMetrics(completedProcesses, timeline);

  return {
    processes: metrics.processes,
    timeline,
    executionSequence,
    metrics,
  };
}
