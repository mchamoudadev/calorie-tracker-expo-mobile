import { useQuery } from '@tanstack/react-query';
import { reportAPI } from '../services/api';

// Hook to get daily report
export const useDailyReport = (date: string) => {
  return useQuery({
    queryKey: ['dailyReport', date],
    queryFn: () => reportAPI.getDailyReport(date),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Hook to get weekly report
export const useWeeklyReport = () => {
  return useQuery({
    queryKey: ['weeklyReport'],
    queryFn: () => reportAPI.getWeeklyReport(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get monthly report
export const useMonthlyReport = (year: number, month: number) => {
  return useQuery({
    queryKey: ['monthlyReport', year, month],
    queryFn: () => reportAPI.getMonthlyReport(year, month),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

