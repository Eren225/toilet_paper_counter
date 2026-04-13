import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PackService } from '../../services/packService';
import { UsageService } from '../../services/usageService';

export const useCurrentPack = () => {
  return useQuery({
    queryKey: ['currentPack'],
    queryFn: () => PackService.getCurrentPack(),
  });
};

export const useAllPacks = () => {
  return useQuery({
    queryKey: ['allPacks'],
    queryFn: () => PackService.getAllPacks(),
  });
};

export const useAllUsages = () => {
  return useQuery({
    queryKey: ['allUsages'],
    queryFn: () => UsageService.getAllUsages(),
  });
};

export const useUsagesForPack = (packId?: string) => {
  return useQuery({
    queryKey: ['usages', packId],
    queryFn: () => packId ? UsageService.getUsagesForPack(packId) : [],
    enabled: !!packId, // Only fetch if packId exists
  });
};

export const useCreatePack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ buyerId, totalRolls }: { buyerId: string; totalRolls: number }) => 
      PackService.createNewPack(buyerId, totalRolls),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentPack'] });
      queryClient.invalidateQueries({ queryKey: ['usages'] });
    },
  });
};

export const useIncrementRoll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, packId }: { userId: string; packId: string }) => 
      UsageService.incrementRoll(userId, packId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usages', variables.packId] });
      queryClient.invalidateQueries({ queryKey: ['allUsages'] });
    },
  });
};

export const useDeleteUsage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ usageId }: { usageId: string }) => 
      UsageService.deleteUsage(usageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usages'] });
      queryClient.invalidateQueries({ queryKey: ['allUsages'] });
    },
  });
};
