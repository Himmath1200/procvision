/**
 * Standard preset sample datasets for CPU scheduling simulation
 */

export const SAMPLE_DATASETS = {
  classic: {
    name: 'Textbook Classic',
    description: 'Standard 4-process example demonstrating clear preemption differences.',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 8 },
      { id: 'P2', arrivalTime: 1, burstTime: 4 },
      { id: 'P3', arrivalTime: 2, burstTime: 9 },
      { id: 'P4', arrivalTime: 3, burstTime: 5 },
    ],
  },
  heavyPreemption: {
    name: 'High Preemption Cascade',
    description: 'Sequentially arriving shorter processes causing multiple context switches in SRTF.',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 10 },
      { id: 'P2', arrivalTime: 2, burstTime: 4 },
      { id: 'P3', arrivalTime: 4, burstTime: 2 },
      { id: 'P4', arrivalTime: 6, burstTime: 1 },
      { id: 'P5', arrivalTime: 8, burstTime: 3 },
    ],
  },
  idlePeriods: {
    name: 'Intermittent CPU Idle Gaps',
    description: 'Processes arriving with gaps demonstrating CPU idle interval handling.',
    processes: [
      { id: 'P1', arrivalTime: 2, burstTime: 3 },
      { id: 'P2', arrivalTime: 8, burstTime: 4 },
      { id: 'P3', arrivalTime: 15, burstTime: 5 },
      { id: 'P4', arrivalTime: 16, burstTime: 2 },
    ],
  },
  equalBurst: {
    name: 'Simultaneous Arrivals & Ties',
    description: 'Processes arriving at the same time with identical and different bursts.',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 5 },
      { id: 'P2', arrivalTime: 0, burstTime: 3 },
      { id: 'P3', arrivalTime: 2, burstTime: 3 },
      { id: 'P4', arrivalTime: 2, burstTime: 6 },
    ],
  },
  academicComparison: {
    name: 'Comprehensive 5-Job Benchmark',
    description: 'Varied burst and arrival distributions for thorough comparative analysis.',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 7 },
      { id: 'P2', arrivalTime: 2, burstTime: 4 },
      { id: 'P3', arrivalTime: 4, burstTime: 1 },
      { id: 'P4', arrivalTime: 5, burstTime: 4 },
      { id: 'P5', arrivalTime: 8, burstTime: 2 },
    ],
  },
};
