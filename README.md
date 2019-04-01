# Anima
Lightweight animation class for **simple animations**.

Anima - is a simple Class in order to create basic **animations**.
Written in a **pure Vanilla JS** with the **ES2015** syntax.

The original purpose of **Anima** was to create smooth scroll in a easy way but basically you can use it for animate whatever you want.

Drop it on your project and you are ready to go or fork it, and improve it for your purpose ;) 

## Getting started

Import Anima on your page. Use the **min file**.
```html
<script src="Anima-min.js"></script>
<script src="main.js"></script>
```

### Constructor
```javascript
new Anima({ element });
```

### Methods
**Anima.animate**
```javascript
Anima.animate(property, { fromValue, toValue, duration, delay, timingCurve }, callback);
```

## Usage

In your main js file you can use Anima like so :
```javascript
const anima = new Anima({ element: document.querySelector('.element-to-animate') });
// It's not necessary to specify the element parameter if you're animating the scroll. just do :
// const anima = new Anima();
anima.animate('marginTop', { fromValue: 0, toValue: 500, duration: 400, delay: 400, timingCurve: Anima.timingCurves.easeInOutCubic });
```

### Callback
You can call the animation callback when the animation is finished.
```javascript
anima.animate('marginTop', { fromValue: 0, toValue: 500, duration: 1000, delay: 400, timingCurve: Anima.timingCurves.easeInOutCubic }, () => {
  // Animation is finished.
});
```

### Properties
You can animate all the css styles properties which are not functions like transforms
You also can animate the scroll.
Below, a list of properties that you can animate without taking in account the normal styles properties (like: margin, width etc.)
* 'scrollY': Animate the vertical scroll.
* 'scrollX': Animate the horizontal scroll.
* 'scroll': Animate the vertical & horizontal scroll.
* 'rotate': Animate the rotate transform function.
* 'scale': Animate the scale transform function.

Other will come in the futur.

### Timing curves functions
The timing curves functions are store in the Anima static get function.
You can call one of theses with **Anima.timingCurves**

**Exemple**
```javascript
Anima.timingCurves.linear
```

* linear - no easing, no acceleration
* easeInQuad - accelerating from zero velocity
* easeOutQuad - decelerating to zero velocity
* easeInOutQuad - acceleration until halfway, then deceleration
* easeInCubic - accelerating from zero velocity 
* easeOutCubic - decelerating to zero velocity 
* easeInOutCubic - acceleration until halfway, then deceleration 
* easeInQuart - accelerating from zero velocity 
* easeOutQuart - decelerating to zero velocity 
* easeInOutQuart - acceleration until halfway, then deceleration
* easeInQuint - accelerating from zero velocity
* easeOutQuint - decelerating to zero velocity 
* easeInOutQuint - acceleration until halfway, then deceleration 

Thanks to [Gre](https://gist.github.com/gre) for the easings equations.
