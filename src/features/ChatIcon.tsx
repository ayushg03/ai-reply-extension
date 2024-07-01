import React, { useState } from 'react';
import Modal from "~features/Modal";

import MagicSparkesSVG from '~icons/MagicSparklesIcon';
import SparklesSVG from '~icons/SparklesIcon';

import 'styles/AIChatReply.css';

const ChatIcon = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [chatMessageContainer, setChatMessageContainer] = useState<HTMLElement | null>(null);

    const findParentElement = (element: HTMLElement, parentClass: string) => {
        //find parent element which matches the class
        let currentElement = element;
        while (currentElement !== null) {
          if (currentElement.classList.contains(parentClass)) {
            return currentElement;
          } 
          currentElement = currentElement.parentNode as HTMLElement;
        }
        return null;
      }

    const handleModalClose = () => {
        const chatInputContainer = document.querySelector(".popup-open");
        if (chatInputContainer) {
            chatInputContainer.classList.remove("popup-open");
        }
        setShowPopup(false);
    };

    const handleOpenModal = (event: React.MouseEvent<HTMLElement>) => {
        const targetElement = event.target as HTMLElement;
        const chatInputContainer = findParentElement(targetElement, 'msg-form__contenteditable');
        setChatMessageContainer(chatInputContainer);
        if (chatInputContainer) {
            chatInputContainer.classList.add("popup-open");
        }
        setShowPopup(true);
    }

    return (
        <>
            <div 
                className={!showPopup ? 'sparkles-icon' : 'stars-icon'}
                onClick={handleOpenModal}
                id='chatIcon'
            >
                {!showPopup ? <MagicSparkesSVG /> : <SparklesSVG />}
            </div>
            { showPopup && <Modal
                    isModalOpen={showPopup}
                    onClose={handleModalClose}
                    currentChatContainer={chatMessageContainer}
                /> 
            }
        </>
    );
};

export default ChatIcon;