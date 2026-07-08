"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

interface UserContextValue {
  user: SessionUser | null;
  loaded: boolean;
  /** Re-synchronise l'état après login/logout côté client. */
  refresh: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = (await res.json()) as { user: SessionUser | null };
      setUser(data.user);
    } catch {
      setUser(null);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <UserContext.Provider value={{ user, loaded, refresh }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser doit être utilisé dans un <UserProvider>.");
  return ctx;
}
