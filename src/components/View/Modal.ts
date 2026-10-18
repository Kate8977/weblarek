import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IModal } from "../../types";
export class Modal extends Component<IModal> {
  protected modalContent: HTMLElement; //public for tests need to CHANGE to protected
  protected closeButton: HTMLButtonElement; //public for tests need to CHANGE to protected

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.modalContent = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );

    this.closeButton.addEventListener("click", () => {
      this.events.emit("modal:close");
    });

    this.container.addEventListener("click", (event: MouseEvent) => {
      if (event.target === this.container) {
        this.events.emit("modal:close");
      }
    });
  }

  set content(elements: HTMLElement[]) {
    this.modalContent.innerHTML = "";

    elements.forEach((element) => {
      this.modalContent.append(element);
    });
  }

  open() {
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
  }
}
