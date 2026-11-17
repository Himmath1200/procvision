/**
 * Calculation helper functions for CPU Scheduling metrics
 */

export function calculateMetrics(completedProcesses, timeline) {
  if (!completedProcesses || completedProcesses.length === 0) {
    return {
      avgWaitingTime: 0,
      avgTurnaroundTime: 0,
      avgResponseTime: 0,
      cpuUtilization: 0,
      throughput: 0,
      totalSimulationTime: 0,
      totalBusyTime: 0,
      totalIdleTime: 0,
    };
  }

  const n = completedProcesses.length;

  // Process-level calculations
  const processes = completedProcesses.map((p) => {
    const turnaroundTime = p.completionTime - p.arrivalTime;
    const waitingTime = turnaroundTime - p.burstTime;
    const responseTime = p.firstResponseTime - p.arrivalTime;

    return {
      ...p,
      turnaroundTime: Number(turnaroundTime.toFixed(2)),
      waitingTime: Number(waitingTime.toFixed(2)),
      responseTime: Number(responseTime.toFixed(2)),
    };
  });

  const totalWT = processes.reduce((acc, p) => acc + p.waitingTime, 0);
  const totalTAT = processes.reduce((acc, p) => acc + p.turnaroundTime, 0);
  const totalRT = processes.reduce((acc, p) => acc + p.responseTime, 0);

  const totalSimulationTime = timeline.length > 0 ? timeline[timeline.length - 1].endTime : 0;
  
  const totalBusyTime = timeline
    .filter((seg) => !seg.isIdle)
    .reduce((acc, seg) => acc + (seg.endTime - seg.startTime), 0);

  const totalIdleTime = totalSimulationTime - totalBusyTime;

  const cpuUtilization = totalSimulationTime > 0
    ? Number(((totalBusyTime / totalSimulationTime) * 100).toFixed(2))
    : 0;

  const throughput = totalSimulationTime > 0
    ? Number((n / totalSimulationTime).toFixed(4))
    : 0;

  return {
    processes,
    avgWaitingTime: Number((totalWT / n).toFixed(2)),
    avgTurnaroundTime: Number((totalTAT / n).toFixed(2)),
    avgResponseTime: Number((totalRT / n).toFixed(2)),
    cpuUtilization,
    throughput,
    totalSimulationTime,
    totalBusyTime,
    totalIdleTime,
  };
}
