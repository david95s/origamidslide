//Tenho q importar dessa forma, pq são duas classes
import { Slide, SlideNav } from './slide.js';

const slide = new SlideNav('.slide-wrapper', '.slide');
slide.init();
slide.addArrow('.prev', '.next');



