export default class Slide {
    constructor(slideWrapper, slide) {
        this.wrapper = document.querySelector(slideWrapper);
        this.slide = document.querySelector(slide);
    }

    onStart(event) {
        event.preventDefault();
        console.log('mousedown')
        this.wrapper.addEventListener('mousemove', this.onmove);
    }

    onEnd() {
        console.log('acabou');
        this.wrapper.removeEventListener('mousemove', this.onmove);
    }

    onmove(event) {
        console.log('moveu');
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
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