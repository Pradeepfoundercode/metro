import { useQuery } from '@tanstack/react-query'

import { useAuth } from './useAuth'
import { getUserProfile } from '../services/auth.service'

export const useUserProfile = () => {
  const { userId } = useAuth()

  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => getUserProfile(userId),
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  })
}