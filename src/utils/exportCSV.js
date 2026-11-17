/**
 * Exports simulation results to CSV file and triggers browser download
 * 
 * @param {string} algorithmName Name of the algorithm (e.g. "SJF", "SRTF", "Comparison")
 * @param {Array} processes Process list with calculated times
 * @param {Object} metrics Overall summary metrics
 */
export function exportToCSV(algorithmName, processes, metrics) {
  if (!processes || processes.length === 0) return;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `ProcVision_${algorithmName}_${timestamp}.csv`;

  let csvContent = `ProcVision CPU Scheduling Simulation Report\n`;
  csvContent += `Algorithm,${algorithmName}\n`;
  csvContent += `Generated At,${new Date().toLocaleString()}\n`;
  csvContent += `Total Processes,${processes.length}\n\n`;

  // Process details table
  csvContent += `Process ID,Arrival Time (AT),Burst Time (BT),Completion Time (CT),Turnaround Time (TAT),Waiting Time (WT),Response Time (RT)\n`;

  processes.forEach((p) => {
    csvContent += `"${p.id}",${p.arrivalTime},${p.burstTime},${p.completionTime},${p.turnaroundTime},${p.waitingTime},${p.responseTime}\n`;
  });

  csvContent += `\nSummary Performance Metrics\n`;
  csvContent += `Metric,Value\n`;
  csvContent += `Average Turnaround Time (TAT),${metrics.avgTurnaroundTime}\n`;
  csvContent += `Average Waiting Time (WT),${metrics.avgWaitingTime}\n`;
  csvContent += `Average Response Time (RT),${metrics.avgResponseTime}\n`;
  csvContent += `CPU Utilization (%),${metrics.cpuUtilization}%\n`;
  csvContent += `Throughput (processes/time unit),${metrics.throughput}\n`;
  csvContent += `Total Simulation Time,${metrics.totalSimulationTime}\n`;
  csvContent += `Total CPU Busy Time,${metrics.totalBusyTime}\n`;
  csvContent += `Total CPU Idle Time,${metrics.totalIdleTime}\n`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
