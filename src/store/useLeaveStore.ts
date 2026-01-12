// store/useLeaveStore.ts
import { create } from "zustand";

interface LeaveState {
  leaves: any[];
  setLeaves: (leaves: any[]) => void;
}

export const useLeaveStore = create<LeaveState>((set) => ({
  leaves: [],
  setLeaves: (leaves) => set({ leaves }),
}));
