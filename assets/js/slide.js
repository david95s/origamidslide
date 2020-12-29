import debounced from './debounce.js';

export class Slide {
    constructor(slideWrapper, slide) {
        this.wrapper = document.querySelector(slideWrapper);
        this.slide = document.querySelector(slide);
        this.dist = { finalPosition: 0, startX: 0, moviment: 0, movePosition: 0 };
        this.slideArray;
    }

    transitionAtivo(active) {
        this.slide.style.transition = active ? 'transform .3s' : ''
    }

    moveSlide(distX) {
        this.dist.movePosition = distX;
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
    }

    updatePosition(clientacoExi) {
        this.dist.moviment = (this.dist.startX - clientacoExi);// *1.3 é Opcional
        return this.dist.finalPosition - this.dist.moviment;
    }

    onStart(event) {
        let moveType;
        if (event.type === 'touchstart') {
            this.dist.startX = event.changedTouches[0].clientX;
            moveType = 'touchmove';
        } else {//caso contrário |=> event.type === 'mousedown'
            event.preventDefault();
            this.dist.startX = event.clientX;
            moveType = 'mousemove';
        }
        this.wrapper.addEventListener(moveType, this.onmove);
        this.transitionAtivo(false);
    }

    onmove(event) {
        const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX
        const finalPositionConst = this.updatePosition(pointerPosition);
        this.moveSlide(finalPositionConst);
    }

    onEnd(event) {
        const typeMove = (event.type === 'touchend') ? 'touchmove' : 'mousemove';

        this.wrapper.removeEventListener(typeMove, this.onmove);
        this.dist.finalPosition = this.dist.movePosition;
        this.changeSlideOnEnd();
        this.transitionAtivo(true);

        this.addBlockedButtonEnd();

        //Eu add essa linha abaixo, caso queria possa remover,
        //Porem, q toda ver depois q eu iniciar o slide, 
        this.dist.moviment = 0;
        //Se eu ficar dando click, ele vai disparar, 
    }

    changeSlideOnEnd() {
        if (this.dist.moviment > 120 && this.index.next !== undefined) {
            this.activeNextSlide();
            this.removBlockedButton();
        } else if (this.dist.moviment < -120 && this.index.prev !== undefined) {
            this.activePrevSlide();
            this.removBlockedButton();
        } else {
            this.changeSlide(this.index.active);
        }
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
        //--------
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('touchend', this.onEnd);
    }


    //Slides Config
    positionSlide(slide) {
        const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
        return -(slide.offsetLeft - margin);
    }

    indexNavSlide(index) {
        const last = (this.slideArray.length) - 1;
        const prev = index - 1;
        const next = index + 1;
        this.index = {
            prev: (prev < 0) ? undefined : prev,
            active: index,
            next: (next > last) ? undefined : next,
        }
    }

    slideConfig() {
        const elementosArray = [...this.slide.children];
        this.slideArray = elementosArray.map((elemento) => {
            const position = this.positionSlide(elemento);
            return {
                elemento,
                position
            };
        });
    }

    changeSlide(index) {
        const activSlide = this.slideArray[index];
        this.moveSlide(activSlide.position);
        this.indexNavSlide(index);
        this.dist.finalPosition = activSlide.position;
    }

    changeActiveClass() {
        this.slideArray.forEach((el) => { el.elemento.classList.remove('ativo'); });

        const elementoAtivo = this.slideArray[this.index.active].elemento;
        elementoAtivo.classList.add('ativo');
    }

    activePrevSlide() {
        if (this.index.prev !== undefined) {
            this.changeSlide(this.index.prev);
            this.changeActiveClass();
        }
    }

    activeNextSlide() {
        if (this.index.next !== undefined) {
            this.changeSlide(this.index.next);
            this.changeActiveClass();
        }
    }
    //Acima Slides Config


    //Ao Redimencior
    onResize() {
        this.slideConfig();
        this.changeSlide(this.index.active);
    }

    addResizeEvent() {
        const theDeboucend = debounced(this.onResize, 500);
        window.addEventListener('resize', theDeboucend);
    }
    //Acima Ao Redimencior


    //Config 
    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onmove = this.onmove.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.onResize = this.onResize.bind(this);
        this.activePrevSlide = this.activePrevSlide.bind(this);
        this.activeNextSlide = this.activeNextSlide.bind(this);
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
        this.slideConfig();
        this.changeSlide(0);
        this.changeActiveClass();
        this.addResizeEvent();
        return this;
    }
}


export class SlideNav extends Slide {
    addArrow(prev, next) {
        if (prev && next) {
            this.prevElement = document.querySelector(prev);
            this.nextElement = document.querySelector(next);
            this.addArrowEvent();
            if (this.index.prev == undefined) {
                this.prevElement.classList.add('blocked');
            }
        }
    }

    addBlockedButtonEnd() {
        if (this.nextElement && this.prevElement) {
            if (this.index.next == undefined) {
                this.nextElement.classList.add('blocked');
            }
            if (this.index.prev == undefined) {
                this.prevElement.classList.add('blocked');
            }
        }
    }

    checkNext() {
        if (this.index.prev == undefined) {
            this.prevElement.classList.add('blocked');
        }
        if (this.nextElement.classList.contains('blocked')) {
            this.nextElement.classList.remove('blocked');
        }
    }

    checkPrev() {
        if (this.index.next == ((this.slideArray.length) - 1)) {
            this.nextElement.classList.add('blocked');
        }
        if (this.prevElement.classList.contains('blocked')) {
            this.prevElement.classList.remove('blocked');
        }
    }

    removBlockedButton() {
        if (this.nextElement && this.prevElement) {
            this.prevElement.classList.remove('blocked');
            this.nextElement.classList.remove('blocked');
        }

    }

    addArrowEvent() {
        this.prevElement.addEventListener('click', () => {
            this.activePrevSlide();
            this.checkNext();
        });
        this.nextElement.addEventListener('click', () => {
            this.checkPrev();
            this.activeNextSlide();
        });
    }
}


/*
    No onStart() tem o e.preventDefault();
    pois por padrão tem como eu meio q arrastar
    a img no ar, e isso pode bugar meu slide,
    caso queira ver, comente essa linha.
*/