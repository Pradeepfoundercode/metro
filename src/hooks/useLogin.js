import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { loginUser } from '../services/auth.service'
import { useAuth } from './useAuth'


export const useLogin = () => {
  const { login } = useAuth()

  return useMutation({
    mutationFn: loginUser,

    onSuccess: (response, variables) => {
      if (!response?.success) {
        toast.error(response?.message || 'Login failed')
        return
      }

      login({
        id: response.id,
        username: variables.username,
      })

      toast.success(response.message || 'Login successful')
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Login failed. Please try again.'

      toast.error(message)
    },
  })
}