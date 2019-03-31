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
anima.animate({ 'marginTop', { fromValue: 0, toValue: 500, duration: 400, delay: 400, timingCurve: Anima.timingCurves.easeInOutCubic } });
```
