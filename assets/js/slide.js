export default class Slide {
    constructor(slideWrapper, slide) {
        this.wrapper = document.querySelector(slideWrapper);
        this.slide = document.querySelector(slide);
        this.dist = { finalPosition: 0, startX: 0, moviment: 0, movePosition: 0 }
    }

    moveSlide(distX) {
        this.dist.movePosition = distX;
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
    }

    updatePosition(clientacoExi) {
        this.dist.moviment = (this.dist.startX - clientacoExi) * 1.3;// *1.3 é Opcional
        return this.dist.finalPosition - this.dist.moviment;
    }

    onStart(event) {
        let moveType;
        if (event.type === 'touchstart') {
            this.dist.startX = event.changedTouches[0].clientX;
            moveType = 'touchmove';
        } else {
            //caso contrário |=> event.type === 'mousedown'
            event.preventDefault();
            this.dist.startX = event.clientX;
            moveType = 'mousemove';
        }
        this.wrapper.addEventListener(moveType, this.onmove);
    }

    onmove(event) {
        const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX
        const finalPosition = this.updatePosition(pointerPosition);
        this.moveSlide(finalPosition);
    }

    onEnd(event) {
        const typeMove = (event.type === 'touchend') ? 'touchmove' : 'mousemove';

        this.wrapper.removeEventListener(typeMove, this.onmove);
        this.dist.finalPosition = this.dist.movePosition;
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
        //--------
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('touchend', this.onEnd);
    }

    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onmove = this.onmove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
        return this;
    }
}


/*
    No onStart() tem o e.preventDefault();
    pois por padrão tem como eu meio q arrastar
    a img no ar, e isso pode bugar meu slide,
    caso queira ver, comente essa linha.
*/