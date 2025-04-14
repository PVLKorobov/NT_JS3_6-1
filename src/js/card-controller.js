import { Card } from "./card";


class CardController {
    constructor() {
        this.hookFunctionsToAddButtons();

        this.heldCard = null;
        this.saveTimeout = null;
    }
    
    
    loadCardsData () {
        const data = JSON.parse(localStorage.cardsData);
        for (const [groupName, cardTitles] of Object.entries(data)) {
            const cardGroup = document.querySelector(`.group__wrapper[data-groupname="${groupName}"]`);
            for (const cardTitle of cardTitles) {
                const card = new Card(this.startSaveTimeout.bind(this), cardTitle);
                card.addTo(cardGroup);
            }
        }
    }
    saveCardsData () {
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
    
    startSaveTimeout () {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            this.saveCardsData();
        }, 1000)
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
    
    
    createNewCardAt (cardGroup) {
        const card = new Card(this.startSaveTimeout.bind(this));
        card.addTo(cardGroup);
    }
}


export { CardController };