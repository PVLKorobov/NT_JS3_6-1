class CardFactory {
  constructor() {
    this.isDraggingEl = false;
    this.draggableEl;
    this.draggableTitle;
    this.insertAtTargetEl;
    this.insertAtTargetList;
    this.insertAtTargetGroup;
    this.movingElDeltaX;
    this.movingElDeltaY;
    
    this.saveDataTimeout = null;
  }
  
  addTo(cardGroupWrapper, _cardTitle = "") {
    const cardWrapper = document.createElement("div");
    cardWrapper.setAttribute("class", "card__wrapper");


    cardGroupWrapper.addEventListener('mouseenter', () => {
      if (this.isDraggingEl) {
        this.insertAtTargetGroup = cardGroupWrapper;
      }
    });
    cardGroupWrapper.addEventListener('mouseleave', () => {
      this.insertAtTargetGroup = null;
    });
    
    
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
    cardTitle.style.height = cardTitle.scrollHeight + 'px';
    cardTitle.addEventListener("change", () => {
      this.startSaveTimeout();
    });
    cardTitle.addEventListener('input', () => {
      cardTitle.style.height = 'auto';
      cardTitle.style.height = cardTitle.scrollHeight + 'px';
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
    
    
    cardWrapper.addEventListener('mousedown', (event) => {
      if (event.target == cardWrapper) {
        this.isDraggingEl = true;
        this.draggableEl = cardWrapper;
        this.draggableTitle = cardTitle;
        this.addGrabbedStyle(cardWrapper);
        console.log(`grabbed ${cardTitle.value}`)
        
        this.disableTextarea(cardTitle);
        
        const wrapperRect = cardWrapper.getBoundingClientRect();
        this.movingElDeltaX = event.clientX - wrapperRect.left;
        this.movingElDeltaY = event.clientY - wrapperRect.top;
      }
    });
    document.addEventListener('mousemove', (event) => {
      if (this.isDraggingEl) {
        this.draggableEl.style.left = (event.clientX - this.movingElDeltaX) + 'px';
        this.draggableEl.style.top = (event.clientY - this.movingElDeltaY) + 'px';
      }
    });
    document.addEventListener('mouseup', () => {
      if (this.isDraggingEl) {
        console.log('mouseup');
        
        if (this.insertAtTargetEl) {
          console.log('target element present');
          this.collapseSpaceAbove(this.insertAtTargetEl);
        } else if (this.insertAtTargetGroup) {
          console.log('target group present')
        } else {
          console.log('no target, dropping card')
        }
        
        this.removeGrabbedStyle(this.draggableEl);
        this.enableTextarea(this.draggableTitle);
        
        this.isDraggingEl = false;
        this.draggableEl = null;
      }
    });

    
    cardWrapper.addEventListener('mouseover', () => {
      if (this.isDraggingEl && cardWrapper != this.draggableEl) {
        if (this.insertAtTargetEl) {
          this.collapseSpaceAbove(this.insertAtTargetEl); 
        }
        
        this.insertAtTargetEl = cardWrapper;
        this.insertAtTargetList = this.insertAtTargetEl.parentElement.parentElement;
        this.insertAtTargetList.addEventListener('mouseleave', () => {
          if (this.insertAtTargetEl) {
            this.collapseSpaceAbove(this.insertAtTargetEl);
            this.insertAtTargetEl = null;
            this.insertAtTargetList = null;
          }
        });
        this.makeSpaceAbove(this.insertAtTargetEl, this.draggableEl.offsetHeight);
      }
    });
  }
  
  
  addGrabbedStyle (cardWrapper) {
    document.body.style.cursor = 'grabbing';
    cardWrapper.style.cursor = 'grabbing'
    cardWrapper.style.position = 'absolute';
    cardWrapper.style.zIndex = '999';
  }
  removeGrabbedStyle (cardWrapper) {
    document.body.style.removeProperty('cursor');
    cardWrapper.style.removeProperty('cursor');
    cardWrapper.style.removeProperty('position');
    cardWrapper.style.removeProperty('z-index');
    cardWrapper.style.removeProperty('top');
    cardWrapper.style.removeProperty('left');
  }
  
  makeSpaceAbove (cardWrapper, spaceSize) {
    if (!cardWrapper.style.marginTop) {
      cardWrapper.style.marginTop = (spaceSize + 4) + 'px';
    }
  }
  collapseSpaceAbove (cardWrapper) {
    if (cardWrapper.style.marginTop) {
      cardWrapper.style.removeProperty('margin-top');
    }
  }
  
  disableTextarea (textarea) {
    textarea.setAttribute('disabled', 'true');
  }
  enableTextarea (textarea) {
    textarea.removeAttribute('disabled');
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
