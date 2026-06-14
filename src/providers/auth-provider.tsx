"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  loginService,
  logoutService,
  meService,
  registerService,
} from "@/features/auth/services/auth.service";
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/types/auth.types";
import { ApiError } from "@/types/api";

const AUTH_QUERY_KEY = ["auth", "me"] as const;

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isError: boolean;
  statusQuery: UseQueryResult<AuthUser, ApiError>;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const statusQuery = useQuery<AuthUser, ApiError>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: meService,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: loginService,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerService,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutService,
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });

  const login = useCallback(
    async (payload: LoginPayload) => loginMutation.mutateAsync(payload),
    [loginMutation],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => registerMutation.mutateAsync(payload),
    [registerMutation],
  );

  const logout = useCallback(
    async () => logoutMutation.mutateAsync(),
    [logoutMutation],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: statusQuery.data ?? null,
      isLoading: statusQuery.isLoading,
      isAuthenticated: Boolean(statusQuery.data),
      isError: statusQuery.isError,
      statusQuery,
      login,
      register,
      logout,
    }),
    [statusQuery, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}