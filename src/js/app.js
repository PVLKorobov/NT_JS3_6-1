import { CardController } from "./card-controller";

const registeredCardController = new CardController();

if (localStorage.cardsData) {
  registeredCardController.loadCardsData();
}
