import debounced from './debounce.js';

export class Slide {
    constructor(slideWrapper, slide, firstIndex) {

        this.indexInit = firstIndex || 0;
        this.wrapper = document.querySelector(slideWrapper);
        this.slide = document.querySelector(slide);
        this.dist = { finalPosition: 0, startX: 0, moviment: 0, movePosition: 0 };
        this.slideArray;
        this.changeEvent = new Event('changeEvent');
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
        //Eu q fiz, evita ficar mudando ao click após iniciar o evento
        this.dist.moviment = 0;
    }

    changeSlideOnEnd() {
        if (this.dist.moviment > 120 && this.index.next !== undefined) {
            this.activeNextSlide();
        } else if (this.dist.moviment < -120 && this.index.prev !== undefined) {
            this.activePrevSlide();
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
        this.changeActiveClass();

        //this.wrapper.dispatchEvent(this.changeEvent);

        if (this.nextElement && this.prevElement) {
            this.removBlockedButton();
            if (this.index.next == undefined || this.index.prev == undefined) {
                this.addBlockedButtonEnd();
            }
        }

        if (this.arrayControl) {
            this.activeControlItem(index);
        }
    }

    changeActiveClass() {
        this.slideArray.forEach((el) => { el.elemento.classList.remove('ativo'); });
        const elementoAtivo = this.slideArray[this.index.active].elemento;
        elementoAtivo.classList.add('ativo');
    }

    activePrevSlide() {
        if (this.index.prev !== undefined) {
            this.changeSlide(this.index.prev);
        }
    }

    activeNextSlide() {
        if (this.index.next !== undefined) {
            this.changeSlide(this.index.next);
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
        this.changeSlide(this.indexInit);
        this.changeActiveClass();
        this.addResizeEvent();
        this.transitionAtivo(true);
        this.addControl();
        return this;
    }
}


export class SlideNav extends Slide {

    constructor(slideWrapper, slide, firstIndex) {
        super(slideWrapper, slide, firstIndex); //usar super, pois essa class é extendid
        this.bindEventosExtendidos();
    }

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
        if (this.index.next == undefined) {
            this.nextElement.classList.add('blocked');
        }
        if (this.index.prev == undefined) {
            this.prevElement.classList.add('blocked');
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
        });
        this.nextElement.addEventListener('click', () => {
            this.activeNextSlide();
        });
    }

    //Paginação
    createControl() {
        const containerControl = document.createElement('section');
        containerControl.dataset.control = "slide_btns";

        this.slideArray.forEach((item, index) => {
            containerControl.innerHTML += `
                <a href='#slide${index + 1}'>${index + 1}</a>
            `;
        });

        const dadWrapper = this.wrapper.parentElement;
        const elementNextWrapper = this.wrapper.nextElementSibling;

        if (elementNextWrapper) {
            dadWrapper.insertBefore(containerControl, elementNextWrapper);
        } else {
            dadWrapper.appendChild(containerControl);
        }
        return containerControl;
    }

    eventControl(item, index) {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            this.changeSlide(index);
        });
        /*
        this.wrapper.addEventListener('changeEvent', () => {
            console.log('aa')
            this.activeControlItem();
        });
        */
    }

    activeControlItem(index) {
        this.arrayControl.forEach(item => item.classList.remove('ativo'));
        this.arrayControl[index].classList.add('ativo');
    }

    addControl(customControl) {
        if (this.control == undefined) {
            this.control = document.querySelector(customControl) || this.createControl();
            this.arrayControl = [...this.control.children];
            this.arrayControl.forEach(this.eventControl);
            this.activeControlItem(this.indexInit);
        } else {
            this.control.remove();
            this.control = document.querySelector(customControl) || this.createControl();
            this.arrayControl = [...this.control.children];
            this.arrayControl.forEach(this.eventControl);
            this.activeControlItem(this.indexInit);
        }
    }


    bindEventosExtendidos() {
        this.eventControl = this.eventControl.bind(this);
        this.activeControlItem = this.activeControlItem.bind(this);
    };

}


/*
    No onStart() tem o e.preventDefault();
    pois por padrão tem como eu meio q arrastar
    a img no ar, e isso pode bugar meu slide,
    caso queira ver, comente essa linha.
*/