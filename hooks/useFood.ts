// analyze food hook

import { foodAPI } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


// Hook to get food entries
export const useFoodEntries = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['foodEntries', startDate, endDate],
    queryFn: () => foodAPI.getEntries(startDate, endDate),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};


export const useAnalyzeFood = () => {
  return useMutation({
    mutationFn: foodAPI.analyzeFood,
  });
};

// save food hook

export const useSaveFood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: foodAPI.saveFood,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["food"] });
      queryClient.invalidateQueries({ queryKey: ["dailyReport"] });
      queryClient.invalidateQueries({ queryKey: ["weeklyReport"] });
    },
  });
};

// discard food hook
export const useDiscardFood = () => {
  return useMutation({
    mutationFn: foodAPI.discardFood,
  });
};