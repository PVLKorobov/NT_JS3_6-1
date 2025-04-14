import { CardController } from "./card-controller";

const cardFactory = new CardController();

if (localStorage.cardsData) {
  cardFactory.loadCardsData();
}