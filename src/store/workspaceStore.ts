import { create } from "zustand"

type WorkspaceState = {
  activeWorkspaceId: string | null
  setActiveWorkspace: (id: string) => void
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeWorkspaceId: null,
  setActiveWorkspace: (id) =>
    set(() => ({
      activeWorkspaceId: id,
    })),
}))
