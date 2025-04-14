class CardFactory {
  constructor() {
    this.saveDataTimeout = null;
  }

  addTo(cardGroupWrapper, _cardTitle = "") {
    const cardWrapper = document.createElement("div");
    cardWrapper.setAttribute("class", "card__wrapper");

    const deleteButton = document.createElement("img");
    deleteButton.setAttribute("src", require("../img/delete.svg"));
    deleteButton.setAttribute("title", "Delete card");
    deleteButton.setAttribute("class", "card__delete-button");
    deleteButton.addEventListener("click", () => {
      this.delete(cardWrapper);
    });
    cardWrapper.appendChild(deleteButton);

    const cardTitle = document.createElement("textarea");
    cardTitle.setAttribute("class", "card__title");
    cardTitle.value = _cardTitle;
    cardTitle.addEventListener("change", () => {
      this.startSaveTimeout();
    });
    cardWrapper.appendChild(cardTitle);

    cardWrapper.addEventListener("mouseenter", () => {
      deleteButton.style.display = "block";
    });
    cardWrapper.addEventListener("mouseleave", () => {
      deleteButton.style.display = "none";
    });

    const cardList = cardGroupWrapper.querySelector(".group__card-list");
    const newListItem = document.createElement("li");

    cardList.appendChild(newListItem);
    newListItem.appendChild(cardWrapper);

    cardTitle.focus();
  }

  delete(cardWrapper) {
    cardWrapper.remove();
    this.startSaveTimeout();
  }

  startSaveTimeout() {
    clearTimeout(this.saveDataTimeout);
    this.saveDataTimeout = setTimeout(() => {
      this.saveCardsData();
    }, 2000);
  }

  saveCardsData() {
    let data = {};
    const cardGroups = document.querySelectorAll(".group__wrapper");
    for (const cardGroupWrapper of cardGroups) {
      const groupName = cardGroupWrapper.dataset.groupname;
      const cardsInList = cardGroupWrapper.querySelectorAll(
        ".group__card-list .card__wrapper",
      );

      data[groupName] = [];
      for (const card of cardsInList) {
        const cardTitle = card.querySelector(".card__title").value;
        data[groupName].push(cardTitle);
      }
    }
    localStorage.cardsData = JSON.stringify(data);
  }

  loadCardsData() {
    const data = JSON.parse(localStorage.cardsData);
    console.log(Object.entries(data));
    for (const [groupName, cardTitles] of Object.entries(data)) {
      const cardGroupWrapper = document.querySelector(
        `.group__wrapper[data-groupname="${groupName}"]`,
      );
      for (const cardTitle of cardTitles) {
        this.addTo(cardGroupWrapper, cardTitle);
      }
    }
  }
}

export { CardFactory };
