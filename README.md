# Anima
Lightweight animation class for **simple animations**.

Anima - is a simple Class in order to create basic **animations**.
Code in a **pure Vanilla JS**.

The original purpose of **Anima** was to create smooth scroll in a easy way but basically you can use it for animate whatever you want.

Drop it on your project and you are ready to go or fork it, and improve it for your purpose ;) 

## Usage

Import Anima on your page. Use the **min file**.
```html
<script src="Anima-min.js"></script>
<script src="main.js"></script>
```

In your main js file you can use Anima like so :
```javascript
const anima = new Anima({ element: document.querySelector('.element-to-animate') });
// It's not necessary to specify the element parameter if you're animating the scroll. just do :
// const anima = new Anima();
anima.animate({ 'marginTop', { fromValue: 0, toValue: 500, duration: 400, delay: 400, timingCurve: Anima.timingCurves.easeInOutCubic } });
```
Animate all the css styles properties which are not functions like transforms.
Actually only the the rotate and scale functions are supported. Other will come in the futur.


You can call the animation callback when the animation is finished.
```javascript
anima.animate({ 'marginTop', { fromValue: 0, toValue: 1000, duration: 400, timingCurve: Anima.timingCurves.easeInOutCubic }, () => {
  // Animation is finished.
} });

```

### Timing curves functions
The timing curves functions are store in the Anima static get function.
You can call one of theses with Anima.timingCurves
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
