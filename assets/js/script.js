//Tenho q importar dessa forma, pq são duas classes
import { Slide, SlideNav } from './slide.js';

const slide = new SlideNav('.slide-wrapper', '.slide', 2);
slide.init();
slide.addArrow('.prev', '.next');
slide.addControl('.custom_control');



