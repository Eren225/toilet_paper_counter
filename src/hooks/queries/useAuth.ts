import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../../services/authService';

export const useAuthUser = () => {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const session = await AuthService.getSession();
      if (!session?.user?.id) return null;
      return AuthService.getUserProfile(session.user.id);
    },
  });
};

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: () => AuthService.getAllProfiles(),
  });
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: Record<string, string>) => AuthService.signIn(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => AuthService.signOut(),
    onSuccess: () => {
      queryClient.setQueryData(['authUser'], null);
      queryClient.clear(); // Clear all other cache on logout
    },
  });
};
