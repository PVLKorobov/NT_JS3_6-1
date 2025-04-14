class Card {
    constructor(startSaveTimeoutHook, titleText='') {
        this.cardWrapper = this.makeWrapper();
        this.cardTitle = this.makeTitle(titleText, startSaveTimeoutHook);
        this.deleteButton = this.makeDeleteButton(startSaveTimeoutHook);

        this.cardWrapper.appendChild(this.cardTitle);
        this.cardWrapper.appendChild(this.deleteButton);
    }
    
    
    addTo (cardGroup) {
        const cardList = cardGroup.querySelector(".group__card-list");
        const newListItem = document.createElement("li");
        cardList.appendChild(newListItem);
        newListItem.appendChild(this.cardWrapper);
        this.updateTitleSize();
        this.cardTitle.focus();
    }

    
    updateTitleSize () {
        this.cardTitle.style.height = this.cardTitle.scrollHeight + 'px';
    }

    showDeleteButton () {
        this.deleteButton.style.display = "block";
    }
    hideDeleteButton () {
        this.deleteButton.style.removeProperty('display');
    }
    
    
    makeWrapper () {
        const cardWrapper = document.createElement("div");
        cardWrapper.setAttribute("class", "card__wrapper");
        cardWrapper.addEventListener('mouseenter', () => {
            this.showDeleteButton();
        });
        cardWrapper.addEventListener('mouseleave', () => {
            this.hideDeleteButton();
        });

        return cardWrapper;
    }
    
    makeTitle (titleText, startSaveTimeoutHook) {
        const cardTitle = document.createElement("textarea");
        cardTitle.setAttribute("class", "card__title");
        cardTitle.value = titleText;
        cardTitle.addEventListener('input', () => {
            cardTitle.style.height = 'auto';
            cardTitle.style.height = cardTitle.scrollHeight + 'px';
            startSaveTimeoutHook();
        });
        
        return cardTitle;
    }
    
    makeDeleteButton (startSaveTimeoutHook) {
        const deleteButton = document.createElement("img");
        deleteButton.setAttribute("src", require("../img/delete.svg"));
        deleteButton.setAttribute("title", "Delete card");
        deleteButton.setAttribute("class", "card__delete-button");
        deleteButton.addEventListener("click", () => {
            this.cardWrapper.remove();
            startSaveTimeoutHook();
        });

        return deleteButton;
    }
}


export { Card };