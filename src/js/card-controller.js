import { Card } from "./card";

class CardController {
  constructor() {
    this.hookFunctionsToAddButtons();

    this.heldCard = null;
    this.deltaX;
    this.deltaY;
    this.underCard = null;
    this.lastValidPosStatus;

    this.saveTimeout = null;

    document.addEventListener("mousedown", (event) => {
      if (event.target.className == "card__wrapper") {
        this.pickUpCardAtCursor(event.clientX, event.clientY);
      }
    });
    document.addEventListener("mousemove", (event) => {
      this.moveHeldCardTo(event.clientX, event.clientY);
    });
    document.addEventListener("mouseup", (event) => {
      this.dropHeldCard(event.clientX, event.clientY);
    });
  }

  loadCardsData() {
    const data = JSON.parse(localStorage.cardsData);
    for (const [groupName, cardTitles] of Object.entries(data)) {
      const cardGroup = document.querySelector(
        `.group__wrapper[data-groupname="${groupName}"]`,
      );
      for (const cardTitle of cardTitles) {
        const card = new Card(this.startSaveTimeout.bind(this), cardTitle);
        card.addTo(cardGroup);
      }
    }
  }
  saveCardsData() {
    let data = {};
    const cardGroups = document.querySelectorAll(".group__wrapper");
    for (const cardGroup of cardGroups) {
      const groupName = cardGroup.dataset.groupname;
      const cards = cardGroup.querySelectorAll(
        ".group__card-list .card__wrapper",
      );

      data[groupName] = [];
      for (const card of cards) {
        const cardTitle = card.querySelector(".card__title").value;
        data[groupName].push(cardTitle);
      }
    }

    localStorage.cardsData = JSON.stringify(data);
  }

  startSaveTimeout() {
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.saveCardsData();
    }, 1000);
  }

  hookFunctionsToAddButtons() {
    const addCardButtons = document.querySelectorAll(".group__add-card-button");
    for (let addCardButton of addCardButtons) {
      addCardButton.addEventListener("click", () => {
        const cardGroup = addCardButton.parentElement;
        this.createNewCardAt(cardGroup);
      });
    }
  }

  getCardAtPos(x, y) {
    const elements = document.elementsFromPoint(x, y);
    for (const element of elements) {
      if (element != this.heldCard && element.className == "card__wrapper") {
        return element;
      }
    }

    return null;
  }
  getGroupAtPos(x, y) {
    const elements = document.elementsFromPoint(x, y);
    for (const element of elements) {
      if (element.className == "group__wrapper") {
        return element;
      }
    }

    return null;
  }

  setHeldCardStyles() {
    this.heldCard.style.cursor = "grabbing";
    this.heldCard.style.position = "absolute";
    this.heldCard.style.zIndex = "999";
  }
  removeHeldCardStyles() {
    this.heldCard.style.removeProperty("cursor");
    this.heldCard.style.removeProperty("position");
    this.heldCard.style.removeProperty("z-index");
    this.heldCard.style.removeProperty("top");
    this.heldCard.style.removeProperty("left");
  }

  diactivateHeldCardTitle() {
    const heldCardTitle = this.heldCard.querySelector(".card__title");
    heldCardTitle.setAttribute("disabled", "true");
  }
  activateHeldCardTitle() {
    const heldCardTitle = this.heldCard.querySelector(".card__title");
    heldCardTitle.removeAttribute("disabled");
  }

  getHeldCardOffset(clientX, clientY) {
    const heldCardRect = this.heldCard.getBoundingClientRect();
    this.deltaX = clientX - heldCardRect.left;
    this.deltaY = clientY - heldCardRect.top;
  }

  getRelativePosStatus(y, height, top, bottom) {
    if (y <= top + 0.4 * height && y > top) {
      return 1;
    } else if (y >= bottom - 0.4 * height && y < bottom) {
      return -1;
    }

    return null;
  }

  createNewCardAt(cardGroup) {
    const card = new Card(this.startSaveTimeout.bind(this));
    card.addTo(cardGroup);
  }

  makeSpaceAroundUnderCard(spaceSize, clientY) {
    const underCardHeight = this.underCard.offsetHeight;
    const underCardRect = this.underCard.getBoundingClientRect();
    const relativePosStatus = this.getRelativePosStatus(
      clientY,
      underCardHeight,
      underCardRect.top,
      underCardRect.bottom,
    );

    this.lastValidPosStatus = relativePosStatus;

    if (relativePosStatus == 1) {
      this.underCard.style.marginTop = spaceSize + "px";
    } else if (relativePosStatus == -1) {
      this.underCard.style.marginBottom = spaceSize + "px";
    }
  }
  collapseSpaceAroundUnderCard() {
    this.underCard.style.removeProperty("margin-top");
    this.underCard.style.removeProperty("margin-bottom");
  }

  insertHeldCardAt(targetCard) {
    const heldCardLI = this.heldCard.parentElement;
    const targetCardLI = targetCard.parentElement;
    if (this.lastValidPosStatus == 1) {
      targetCardLI.before(heldCardLI);
    } else if (this.lastValidPosStatus == -1) {
      targetCardLI.after(heldCardLI);
    }
  }

  pickUpCardAtCursor(clientX, clientY) {
    if (!this.heldCard) {
      this.heldCard = this.getCardAtPos(clientX, clientY);
      if (this.heldCard) {
        this.getHeldCardOffset(clientX, clientY);
        this.setHeldCardStyles();
        this.diactivateHeldCardTitle();
        document.body.style.cursor = "grabbing";
      }
    }
  }

  moveHeldCardTo(clientX, clientY) {
    if (this.heldCard) {
      this.heldCard.style.left = clientX - this.deltaX + "px";
      this.heldCard.style.top = clientY - this.deltaY + "px";

      const underCard = this.getCardAtPos(clientX, clientY);
      const underGroup = this.getGroupAtPos(clientX, clientY);
      if (underCard) {
        if (this.underCard) {
          this.collapseSpaceAroundUnderCard();
        }
        this.underCard = underCard;
        this.makeSpaceAroundUnderCard(this.heldCard.offsetHeight + 6, clientY);
      } else {
        if (this.underCard && !underGroup) {
          this.collapseSpaceAroundUnderCard();
          this.underCard = null;
        }
      }
    }
  }

  dropHeldCard(clientY) {
    if (this.heldCard) {
      if (this.underCard) {
        this.insertHeldCardAt(this.underCard, clientY);
        this.collapseSpaceAroundUnderCard();
        this.underCard = null;
      }
      this.removeHeldCardStyles();
      this.activateHeldCardTitle();
      document.body.style.removeProperty("cursor");
      this.heldCard = null;

      this.startSaveTimeout();
    }
  }
}

export { CardController };
