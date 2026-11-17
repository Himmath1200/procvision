import { calculateMetrics } from './calculations.js';

/**
 * Preemptive Shortest Remaining Time First (SRTF) Scheduling Algorithm
 * 
 * @param {Array<{id: string, arrivalTime: number, burstTime: number}>} rawProcesses
 * @returns {Object} Simulation result with timeline, preemption logs, processes with metrics, and summary stats
 */
export function runSRTF(rawProcesses) {
  if (!rawProcesses || rawProcesses.length === 0) {
    return {
      processes: [],
      timeline: [],
      executionSequence: [],
      preemptions: [],
      metrics: calculateMetrics([], []),
    };
  }

  // Clone processes and initialize state
  const processes = rawProcesses.map((p, index) => ({
    id: p.id ? String(p.id).trim() : `P${index + 1}`,
    arrivalTime: Math.max(0, Number(p.arrivalTime) || 0),
    burstTime: Math.max(1, Number(p.burstTime) || 1),
    remainingTime: Math.max(1, Number(p.burstTime) || 1),
    firstResponseTime: -1,
    completionTime: 0,
    originalOrder: index,
  }));

  const n = processes.length;
  let completedCount = 0;
  let currentTime = 0;
  let runningProcess = null;

  const rawTimeline = [];
  const preemptions = [];
  const executionSequence = [];

  // Determine maximum time limit to guard against infinite loops
  const totalBurst = processes.reduce((acc, p) => acc + p.burstTime, 0);
  const maxArrival = Math.max(...processes.map((p) => p.arrivalTime));
  const safetyLimit = totalBurst + maxArrival + 1000;

  // We can simulate step-by-event or step-by-unit.
  // Step-by-event: Next event is either a future arrival time OR current running process completion.
  while (completedCount < n && currentTime < safetyLimit) {
    // 1. Check all arrived processes with remaining time > 0
    const readyProcesses = processes.filter(
      (p) => p.arrivalTime <= currentTime && p.remainingTime > 0
    );

    if (readyProcesses.length === 0) {
      // CPU Idle: Jump to next future arrival
      const unarrived = processes
        .filter((p) => p.remainingTime > 0 && p.arrivalTime > currentTime)
        .sort((a, b) => a.arrivalTime - b.arrivalTime);

      if (unarrived.length === 0) break;

      const nextArrival = unarrived[0].arrivalTime;
      rawTimeline.push({
        processId: 'IDLE',
        label: 'Idle',
        startTime: currentTime,
        endTime: nextArrival,
        duration: nextArrival - currentTime,
        isIdle: true,
      });

      currentTime = nextArrival;
      runningProcess = null;
      continue;
    }

    // 2. Select process with shortest remaining time
    // Tie-breaker: earlier arrival time, then original order
    readyProcesses.sort((a, b) => {
      if (a.remainingTime !== b.remainingTime) {
        return a.remainingTime - b.remainingTime;
      }
      if (a.arrivalTime !== b.arrivalTime) {
        return a.arrivalTime - b.arrivalTime;
      }
      return a.originalOrder - b.originalOrder;
    });

    const chosen = readyProcesses[0];

    // Check if preemption occurred
    if (runningProcess && runningProcess.id !== chosen.id && runningProcess.remainingTime > 0) {
      preemptions.push({
        time: currentTime,
        preemptedId: runningProcess.id,
        preemptedRemaining: runningProcess.remainingTime,
        preemptorId: chosen.id,
        preemptorRemaining: chosen.remainingTime,
        reason: `Process ${chosen.id} (remaining: ${chosen.remainingTime}) arrived with shorter remaining time than ${runningProcess.id} (remaining: ${runningProcess.remainingTime})`,
      });
    }

    runningProcess = chosen;

    // Record first response time
    if (chosen.firstResponseTime === -1) {
      chosen.firstResponseTime = currentTime;
    }

    // 3. Find the next critical event:
    // Either chosen process finishes OR a new process arrives that could preempt it
    const futureArrivals = processes
      .filter((p) => p.remainingTime > 0 && p.arrivalTime > currentTime)
      .map((p) => p.arrivalTime);

    const nextArrival = futureArrivals.length > 0 ? Math.min(...futureArrivals) : Infinity;
    const timeToFinish = chosen.remainingTime;
    const timeToNextArrival = nextArrival - currentTime;

    // Run duration is minimum of time to finish or time until next arrival
    const runDuration = Math.min(timeToFinish, timeToNextArrival);
    const nextTime = currentTime + runDuration;

    rawTimeline.push({
      processId: chosen.id,
      label: chosen.id,
      startTime: currentTime,
      endTime: nextTime,
      duration: runDuration,
      isIdle: false,
    });

    chosen.remainingTime -= runDuration;
    currentTime = nextTime;

    if (chosen.remainingTime === 0) {
      chosen.completionTime = currentTime;
      completedCount++;
      runningProcess = null;
    }
  }

  // Merge consecutive timeline segments of the same process/idle
  const mergedTimeline = [];
  for (const seg of rawTimeline) {
    if (seg.duration <= 0) continue;

    const last = mergedTimeline[mergedTimeline.length - 1];
    if (last && last.processId === seg.processId && last.endTime === seg.startTime) {
      last.endTime = seg.endTime;
      last.duration += seg.duration;
    } else {
      mergedTimeline.push({ ...seg });
    }
  }

  // Create clean execution sequence list
  mergedTimeline.forEach((seg) => {
    if (!seg.isIdle) {
      executionSequence.push({
        processId: seg.processId,
        startTime: seg.startTime,
        endTime: seg.endTime,
        duration: seg.duration,
      });
    }
  });

  // Sort completed processes by original order
  const completedProcesses = processes.map((p) => ({
    id: p.id,
    arrivalTime: p.arrivalTime,
    burstTime: p.burstTime,
    completionTime: p.completionTime,
    firstResponseTime: p.firstResponseTime === -1 ? p.arrivalTime : p.firstResponseTime,
    originalOrder: p.originalOrder,
  }));
  completedProcesses.sort((a, b) => a.originalOrder - b.originalOrder);

  const metrics = calculateMetrics(completedProcesses, mergedTimeline);

  return {
    processes: metrics.processes,
    timeline: mergedTimeline,
    executionSequence,
    preemptions,
    metrics,
  };
}
