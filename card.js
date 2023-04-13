class Card {
  constructor({
    card
  }) {
    this.card = card;
    this.#init();
  }
  
  // private properties
  #startPoint;
  #offsetX;
  #offsetY;

  #isTouchDevice = () => {
    return (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0));
  }

  onLike = () => {
    like.style.animationPlayState = 'running';
    like.classList.toggle('trigger');
    console.log('like');

    switch(this.element.getElementsByTagName('img')[0].classList[0]){
      case 'chameleon':
        chameleon++;
        break;
      case 'historian':
        historian++;
        break;
      case 'sensitive':
        sensitive++;
        break;
      case 'thrillSeeker':
        thrillSeeker++;
        break;
      case 'traditionalist':
        traditionalist++;
        break;
      default:
        console.log('error: no type');
    }

    if(document.querySelectorAll("div.card:not(.dismissing)").length == 0) result();
  }

  onDislike = () => {
    dislike.style.animationPlayState = 'running';
    dislike.classList.toggle('trigger');
    console.log('dislike');

    if(document.querySelectorAll("div.card:not(.dismissing)").length == 0) result();
  }
  
  #init = () => {
    const card = this.card;
    this.element = card;
    if (this.#isTouchDevice()) {
      this.#listenToTouchEvents();
    } else {
      this.#listenToMouseEvents();
    }
  }

  #listenToTouchEvents = () => {
    this.element.addEventListener('touchstart', (e) => {
      const touch = e.changedTouches[0];
      if (!touch) return;
      const { clientX, clientY } = touch;
      this.#startPoint = { x: clientX, y: clientY }
      document.addEventListener('touchmove', this.#handleTouchMove, {passive:false});
      this.element.style.transition = 'transform 0s';
    });
  
    document.addEventListener('touchend', this.#handleTouchEnd);
    document.addEventListener('cancel', this.#handleTouchEnd);
  }
  
  #listenToMouseEvents = () => {
    this.element.addEventListener('mousedown', (e) => {
      const { clientX, clientY } = e;
      this.#startPoint = { x: clientX, y: clientY }
      document.addEventListener('mousemove', this.#handleMouseMove);
      this.element.style.transition = 'transform 0s';
    });
  
    document.addEventListener('mouseup', this.#handleMoveUp);
  
    // prevent card from being dragged
    // this.element.addEventListener('dragstart', (e) => {
    //   e.preventDefault();
    // });
  }
  
  #handleMove = (x, y) => {
    this.#offsetX = x - this.#startPoint.x;
    this.#offsetY = y - this.#startPoint.y;
    const rotate = this.#offsetX * 0.1;
    this.element.style.transform = `translate(${this.#offsetX}px, ${this.#offsetY}px) rotate(${rotate}deg)`;
    // dismiss card
    if (Math.abs(this.#offsetX) > this.element.clientWidth * 0.7) {
      this.#dismiss(this.#offsetX > 0 ? 1 : -1);
    }
  }
  
  // mouse event handlers
  #handleMouseMove = (e) => {
    e.preventDefault();
    if (!this.#startPoint) return;
    const { clientX, clientY } = e;
    this.#handleMove(clientX, clientY);
  }
  
  #handleMoveUp = () => {
    this.#startPoint = null;
    document.removeEventListener('mousemove', this.#handleMouseMove);
    this.element.style.transition = 'transform 1s';
    this.element.style.transform = '';
  }

  // touch event handlers
  #handleTouchMove = (e) => {
    e.preventDefault();
    if (!this.#startPoint) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const { clientX, clientY } = touch;
    this.#handleMove(clientX, clientY);
  }

  #handleTouchEnd = () => {
    this.#startPoint = null;
    document.removeEventListener('touchmove', this.#handleTouchMove);
    this.element.style.transition = 'transform 1s';
    this.element.style.transform = '';
  }
  
  #dismiss = (direction) => {
    this.#startPoint = null;
    document.removeEventListener('mouseup', this.#handleMoveUp);
    document.removeEventListener('mousemove', this.#handleMouseMove);
    document.removeEventListener('touchend', this.#handleTouchEnd);
    document.removeEventListener('touchmove', this.#handleTouchMove);
    this.element.style.transition = 'transform 1s';
    this.element.style.transform = `translate(${direction * window.innerWidth}px, ${this.#offsetY}px) rotate(${90 * direction}deg)`;
    this.element.classList.add('dismissing');
    setTimeout(() => {
      this.element.remove();
    }, 1000);
    if (typeof this.onLike === 'function' && direction === 1) {
      this.onLike();
    }
    if (typeof this.onDislike === 'function' && direction === -1) {
      this.onDislike();
    }
  }

}