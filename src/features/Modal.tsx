import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import type { ModalProps } from './Types';
import { DUMMY_RESPONSE } from '~constants/constants';

import InsertIcon from '~icons/InsertIcon';
import RegenerateIcon from '~icons/RegenerateIcon';
import GenerateIcon from '~icons/GenerateIcon';

import 'styles/AIChatReply.css';
import { focusOnInputElement } from '~utils';

const Modal: React.FC<ModalProps> = ({ isModalOpen, onClose, currentChatContainer }) => {
    const [promptMessage, setPromptMessage] = useState("");
    const [messagesList, setMessagesList] = useState([]);
    const [isRespondeGenerated, setResponseGenerated] = useState(false);
    const defaultMessage = {type: "response", value: DUMMY_RESPONSE};

    useEffect(() => {
        //focus on modal input field when modal is opened
        const modalInputField = document.querySelector(".prompt-input") as HTMLInputElement;
        if(modalInputField){
            focusOnInputElement(modalInputField, false);
        }
    },[]);

    useEffect(() => {
        //Adding event listener to close modal on outside click
        const handleOutsideClick = (event: React.MouseEvent<HTMLElement>) => {
            const modalBox = document.querySelector('.modal-panel') as HTMLElement;
            if (isModalOpen && !(modalBox.contains(event.target as Node))) {
                onClose();
                removeIcon();//remove icon if chat message container is not focused
            }
        };
        document.addEventListener('mousedown', handleOutsideClick as () => void);
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick as () => void);
        };
    }, [isModalOpen]);

    const removeIcon = () => {
        if(currentChatContainer && document.activeElement !== currentChatContainer) {
            let icon = currentChatContainer.querySelector("#plasmo-chat-icon") as HTMLElement;
            icon.remove();
            icon = null;
        }
    };

    const onPromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPromptMessage(e.target.value);
    };

    const onGenerate = () => {
        //on click of generate button,pushing both prompt and dummy response messages to messagesList state
        if(promptMessage){
            const message = {type: 'prompt', value: promptMessage};
            const messagesArray = [...messagesList, message, defaultMessage];
            setMessagesList(messagesArray);
            setPromptMessage("");
            setResponseGenerated(true);
        }
    };  

    const handleInsert = () => {
        const inputElement = currentChatContainer.getElementsByTagName('p')[0] as HTMLInputElement;
        const lastIndex = messagesList.length - 1;
        if(lastIndex && messagesList[lastIndex].type === "response" && inputElement) {
            inputElement.innerHTML = messagesList[lastIndex].value;
            const placeHolderElement = currentChatContainer.nextElementSibling;
            placeHolderElement.classList.remove('msg-form__placeholder'); // on response insert, removing placeholder text
            focusOnInputElement(inputElement, true);//after inserting the response, add focus on chat message
        }
        onClose();
    }

    const modalFooter = () => {
        return (
            <div className="buttons-wrapper">
                {!isRespondeGenerated ? (
                    <button
                        type="button"
                        className="generate-button"
                        onClick={onGenerate}
                    >
                        <GenerateIcon /><span>Generate</span>
                    </button> ) : (
                    <div className='regenerate-buttons-wrapper'>
                        <button
                            className="insert-button"
                            onClick={handleInsert}
                            data-autofocus
                            style={{ border: "1px solid #666D80"}}
                        >
                            <InsertIcon /><span>Insert</span>
                        </button>
                        <button
                            className="regenerate-button"
                            type="button"
                            data-autofocus
                        >
                            <RegenerateIcon/><span>Regenerate</span>
                        </button>
                    </div>)
                }
            </div>
        );
    };

    const renderModalBody = () => (
        <div className="modal-body">
            <div className='messages-wrapper'>
                {messagesList?.map((message, index) => {
                    return (
                        <div className={ message.type === "prompt" ? 'promt-message-wrapper' : 'response-message-wrapper'}>
                            <div
                                className={ message.type === "prompt" ? "prompt-message " : 'response-message'}
                                style={{ fontFamily: "'Inter', sans-serif" }} //as linkedin global css is overriding
                                key={index}>{message.value}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div>
                <input
                    type="text"
                    className="prompt-input"
                    placeholder='Your prompt'
                    onChange={onPromptChange}
                    value={promptMessage}
                />
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        <div className="modal">
            <div className="modal-backdrop" aria-hidden="true" onClick={onClose}></div>
            <div className="modal-container">
                <div className="modal-panel">
                    {renderModalBody()}
                    {modalFooter()}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;