import { CardFactory } from "./card";

const cardFactory = new CardFactory();

if (localStorage.cardsData) {
  cardFactory.loadCardsData();
}

let addCardButtons = document.querySelectorAll(".group__add-card-button");
for (let addCardButton of addCardButtons) {
  addCardButton.addEventListener("click", () => {
    cardFactory.addTo(addCardButton.parentElement);
  });
}
