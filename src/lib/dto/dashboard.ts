export interface AdminDashboardStats {
  users: { students: number; teachers: number; admins: number };
  contests: { total: number; ongoing: number };
  tasks: number;
  submissions: {
    total: number;
    last24h: number;
    /** 24 consecutive hours ending with the current one, oldest first. */
    hourly: { hour: string; count: number }[];
    outcomes: { passed: number; failed: number; compilationError: number; pending: number };
  };
}

export interface ContestActivity {
  contestId: number;
  newSubmissions: number;
  lastSubmittedAt: string | null;
}
