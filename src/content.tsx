import cssText from "data-text:~style.css";
import type { PlasmoCSConfig } from "plasmo";
import { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { CountButton } from "~features/CountButton";

const OBSERVER_CONFIG = {
  childList: true,
  attributes: true,
  subtree: true,
  attributeFilter: ["data-artdeco-is-focused"]
};

export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"]
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

const PlasmoOverlay = () => {
  const [mutationObserver, setMutationObserver] = useState<MutationObserver | null>(null);

  const addButton = useCallback((parentNode: HTMLElement) => {
    if (!parentNode.querySelector("#count-btn")) {
      const btnContainer = document.createElement("div");
      btnContainer.id = "count-btn";
      btnContainer.style.cssText = `position:absolute; bottom:12%; right:12%; z-index:1000;`;
      parentNode.append(btnContainer);
      ReactDOM.render(<CountButton />, btnContainer);
    }
  }, []);

  const removeButton = useCallback((parentNode: HTMLElement) => {
    const btnContainer = parentNode.querySelector("#count-btn");
    if (btnContainer) {
      ReactDOM.unmountComponentAtNode(btnContainer);
      btnContainer.remove();
    }
  }, []);

  const handleMutations = useCallback(
    (mutations: MutationRecord[]) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-artdeco-is-focused"
        ) {
          const target = mutation.target as HTMLElement;
          const form = target.closest("form[id^='msg-form-ember']");
          if (form) {
            const contentEditableDiv = form.querySelector<HTMLElement>(
              "div.msg-form__msg-content-container"
            );
            if (contentEditableDiv) {
              if (target.getAttribute("data-artdeco-is-focused") === "true") {
                addButton(contentEditableDiv);
              } else {
                setTimeout(() => removeButton(contentEditableDiv), 500);
              }
            }
          }
        }
      });
    },
    [addButton, removeButton]
  );

  const setupObserver = useCallback(() => {
    const msgOverlay = document.getElementById("msg-overlay");
    if (msgOverlay) {
      const observer = new MutationObserver(handleMutations);
      observer.observe(msgOverlay, OBSERVER_CONFIG);
      setMutationObserver(observer);
    } else {
      console.error("msg-overlay not found, try reloading the page");
    }
  }, [handleMutations]);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(setupObserver, 2000);
    };

    if (document.readyState !== "complete") {
      window.addEventListener("load", handleLoad);
    } else {
      handleLoad();
    }

    return () => {
      window.removeEventListener("load", handleLoad);
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
    };
  }, [setupObserver, mutationObserver]);

  return null;
};

export default PlasmoOverlay;
