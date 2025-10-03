import { create } from 'zustand';

interface PhotoUploadModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const usePhotoUploadModal = create<PhotoUploadModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
