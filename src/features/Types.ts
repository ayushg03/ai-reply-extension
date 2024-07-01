export interface ModalProps {
    onClose: () => void;
    isModalOpen: boolean;
    currentChatContainer: HTMLElement | null;
  }