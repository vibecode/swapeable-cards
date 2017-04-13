'use strict';

class Cards {
  constructor() {
    this.cards = document.querySelectorAll('.card');
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.update = this.update.bind(this);
    this.targetBCR = null;
    this.target = null;
    this.startX = 0;
    this.currentX = 0;
    this.screenX = 0;
    this.targetX = 0;
    this.isDraggingCard = false;

    this.addEventListeners();

    requestAnimationFrame(this.update);
  }

  addEventListeners() {
    document.addEventListener('touchstart', this.onStart);
    document.addEventListener('touchmove', this.onMove);
    document.addEventListener('touchend', this.onEnd);

    document.addEventListener('mousedown', this.onStart);
    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('mouseup', this.onEnd);
  }

  onStart(ev) {
    if (this.target) {
      return;
    }

    if (!ev.target.classList.contains('card')) {
      return;
    }

    this.target = ev.target;
    //???
    this.targetBCR = this.target.getBoundingClientRect();
    this.startX = ev.pageX || ev.touches[0].pageX;
    this.currentX = this.startX;

    this.isDraggingCard = true;
    //????
    this.target.style.willChange = 'transform';
  }

  onMove(ev) {
    if (!this.target) {
      return;
    }

    this.currentX = ev.pageX || ev.touches[0].pageX;
  }

  onEnd(ev) {
    if (!this.target) {
      return;
    }

    this.targetX = 0;
    let screenX = this.currentX - this.startX;
    if (Math.abs(screenX) > this.targetBCR.width * 0.35) {
      this.targetX = (screenX > 0)
          ? this.targetBCR.width
          : -this.targetBCR.width;
    }
    this.isDraggingCard = false;
  }

  update() {
    requestAnimationFrame(this.update);

    if (!this.target) {
      return;
    }
    if (this.isDraggingCard) {
      this.screenX = this.currentX - this.startX;
    } else {
      this.screenX += (this.targetX - this.screenX) / 4;
    }

    const normalizedDragDistance = (Math.abs(this.screenX) / this.targetBCR.width);
    const opacity = 1 - Math.pow(normalizedDragDistance, 3);

    this.target.style.transform = `translateX(${this.screenX}px)`;
    this.target.style.opacity = opacity;

    if (this.isDraggingCard) {
      return;
    }

    const isNearlyAtStart = (Math.abs(this.screenX) < 0.1);
    const isNearlyInvisible = (opacity < 0.01);

    if (isNearlyInvisible) {
      this.target.parentNode.removeChild(this.target);
      this.target = null;
    } else if (isNearlyAtStart) {
      this.target.style.willChange = 'initial';
      this.target = null;
    }
  }
}

window.addEventListener('load', () => new Cards());