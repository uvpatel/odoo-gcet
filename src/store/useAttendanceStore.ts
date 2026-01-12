// store/useAttendanceStore.ts
import { create } from "zustand";

interface AttendanceState {
  attendance: any[];
  setAttendance: (data: any[]) => void;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  attendance: [],
  setAttendance: (data) => set({ attendance: data }),
}));
