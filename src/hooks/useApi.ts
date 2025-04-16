import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import axiosInstance from '@/api/axios';
import { ApiResponse } from '@/types/api';

export function useApiQuery<T>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<ApiResponse<T>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ApiResponse<T>, Error>({
    queryKey: key,
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<T>>(url);
      return response.data;
    },
    ...options,
  });
}

export function useApiMutation<T, V>(
  url: string,
  options?: Omit<UseMutationOptions<ApiResponse<T>, Error, V>, 'mutationFn'>
) {
  return useMutation<ApiResponse<T>, Error, V>({
    mutationFn: async (data) => {
      const response = await axiosInstance.post<ApiResponse<T>>(url, data);
      return response.data;
    },
    ...options,
  });
}

export function useApiPutMutation<T, V>(
  url: string,
  options?: Omit<UseMutationOptions<ApiResponse<T>, Error, V>, 'mutationFn'>
) {
  return useMutation<ApiResponse<T>, Error, V>({
    mutationFn: async (data) => {
      const response = await axiosInstance.put<ApiResponse<T>>(url, data);
      return response.data;
    },
    ...options,
  });
}

export function useApiDeleteMutation<T>(
  url: string,
  options?: Omit<UseMutationOptions<ApiResponse<T>, Error, void>, 'mutationFn'>
) {
  return useMutation<ApiResponse<T>, Error, void>({
    mutationFn: async () => {
      const response = await axiosInstance.delete<ApiResponse<T>>(url);
      return response.data;
    },
    ...options,
  });
} 