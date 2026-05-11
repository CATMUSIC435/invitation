import { create } from 'zustand';

export type InvitationFormData = {
  name: string;
  title: string;
};

export const defaultFormData: InvitationFormData = {
  name: '',
  title: '',
};

interface InvitationState {
  dataForm: InvitationFormData;
  avatarUrl: string | null;
  isPending: boolean;
  isAllow: boolean;
  setDataForm: (data: InvitationFormData) => void;
  setAvatarUrl: (url: string | null) => void;
  setIsPending: (isPending: boolean) => void;
  setIsAllow: (isAllow: boolean) => void;
}

export const useInvitationStore = create<InvitationState>((set) => ({
  dataForm: defaultFormData,
  avatarUrl: null,
  isPending: false,
  isAllow: false,
  setDataForm: (dataForm) => set({ dataForm }),
  setAvatarUrl: (avatarUrl) => set({ avatarUrl }),
  setIsPending: (isPending) => set({ isPending }),
  setIsAllow: (isAllow) => set({ isAllow }),
}));
