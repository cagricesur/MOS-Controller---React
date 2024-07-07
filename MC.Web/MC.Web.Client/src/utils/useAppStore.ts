import { create } from "zustand";
import { User } from "../models";

export interface AppStore {
  isLoading: boolean;
  httpFailureMessage?: string;
  httpSuccessMessage?: string;
  profile?: {
    user?: User;
    token?: string;
    tokenExpiration?: Date;
  };
}

export const useAppStore = create<AppStore>(() => ({
  isLoading: false,
}));
