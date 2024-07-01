import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"
import ReactDOM from "react-dom"
import ChatIcon from "~features/ChatIcon"


export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {

  const appendIcon = (textBox: HTMLElement) => {
    
    if (textBox) {
      // Create the ChatIcon container
      textBox.style.position = "relative";
      let iconContainer = textBox.querySelector("#plasmo-chat-icon") as HTMLElement;
      if (!iconContainer) {
        const chatIconContainer = document.createElement("div");
        chatIconContainer.id = "plasmo-chat-icon";

        textBox.appendChild(chatIconContainer);

        // Render ChatIcon component in chatIconContainer Element
        if (chatIconContainer) {
          ReactDOM.render(<ChatIcon />, chatIconContainer);
        }
      }
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    //on blur and when modal is not opened, remove the icon from message container 
    const chatInput = event.target;
    const isModalOpen = !!document.querySelector('.popup-open');
    if (!isModalOpen) {
      let icon = chatInput.querySelector("#plasmo-chat-icon") as HTMLElement;
      if(icon) {
        icon.remove();
        icon = null;
      }
    }
  }

  const handleFocus = (event: React.FocusEvent<HTMLElement>) => {
    console.log("on handle focus", event);
    //on focus of linked in chat message container, append the icon
    const chatInput = event.target as HTMLElement;
    appendIcon(chatInput);
  }


  useEffect(() => {
    //Setting mutation observer to watch changes on dom for opening chat input
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element
            const chatInput = element.querySelector(".msg-form__contenteditable") as HTMLElement;//get the element of linkedin chat message container
            //if chat input is found, add focus and blur event listeners
            if (chatInput) {
              chatInput.addEventListener("focus", handleFocus as () => void);
              chatInput.addEventListener("blur", handleBlur as () => void);
              //To handle display of icon when new chat is opened
              if (chatInput === document.activeElement) {
                handleFocus({ target: chatInput } as React.FocusEvent<HTMLElement>);
              }
            }
          }
        })
      })
    })
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
    return () => {
      observer.disconnect()
    }
  }, []);


  return null;
}

export default PlasmoOverlay