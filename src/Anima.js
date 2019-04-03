class Animation {
	constructor(element, { property, fromValue, toValue, duration, timingCurve }) {
        this.element = element;
        this.element = element;
		this.property = property;
		this.fromValue = fromValue;
		this.toValue = toValue;
		this.duration = duration;
        this.timingCurve = timingCurve;
        
		this.animationProgress = 0;
		this.currentAnimationRange = 0,
		this.isAnimationRunning = false;
		this.onProgress = null;
		this.onComplete = null;
	}
	animate() {
	    if (this.isAnimationRunning) { return; }
	    let startTime = null;
	    const frame = (timestamp) => {
		this.isAnimationRunning = true;
		if (startTime === null) startTime = timestamp;
		let progress = timestamp - startTime;
		
		// Store the current animation range.
		this.currentAnimationRange = this._getAnimationRange(progress, this.duration);

		// Check if the animation is between the range.
		const isInAnimationRange = this.currentAnimationRange >= 0 && this.currentAnimationRange <= 1;

		//  Process the animation progress.
        this._processingAnimationProgress();        
		
		// Animate the property.
		this._animateProperty({ delay: this.delay, property: this.property, animationPosition: this.animationProgress, element: this.element });

		if (isInAnimationRange) {
			requestAnimationFrame(frame);

			// Run the onProgress callback if needed. 
			this._runCallbackFunctions( this.onProgress, { parameters: [this.animationProgress, this.currentAnimationRange] });
		} else {
			this.isAnimationRunning = false;
			this.animationProgress = this.toValue;
			this.currentAnimationRange = 1;

			// Place the element on the final position.
			this._animateProperty({ property: this.property, animationPosition: this.animationProgress, element: this.element });

			// Run the onProgress & onComplete callbacks if needed. 
			this._runCallbackFunctions( this.onProgress, { parameters: [this.animationProgress, this.currentAnimationRange] });
			this._runCallbackFunctions( this.onComplete );

			// Reset animation datas.
			startTime = null;
			this._resetAnimationDatas();
		}
	    }
		requestAnimationFrame(frame);
	}
	_processingAnimationProgress() {
		this.animationProgress = this._getAnimProgress({
			timingCurve: this.timingCurve,
			animationRange: this.currentAnimationRange,
			animDistance: this._getAnimDistance(this.fromValue, this.toValue),
			currentToValue: this._getCurrentToValue(this.fromValue, this.toValue)
        });        

		if (this.toValue < this.fromValue) {
			this.animationProgress -= this.fromValue;
			this.animationProgress = Math.abs(this.animationProgress - this._getCurrentToValue(this.fromValue, this.toValue));
		}
	}
	_animateProperty({ delay, property, animationPosition, element }) {
		if (this._isPropertyExceptionExist(property)) {
			this._setPropertyException(element, property, animationPosition)
		} else {
		this.element.style[property] = `${animationPosition}px`;
	    }
	}
	_setPropertyException(element, property, animProgress) {
	    const properties = {
		scrollY: () => { window.scrollTo(0,animProgress); },
		scrollX: () => { window.scrollTo(animProgress, 0) },
		scroll: () => { window.scrollTo(animProgress, animProgress) },
		rotate: () => { element.style.transform = `rotate(${animProgress}deg)` },
		scale: () => { element.style.transform = `scale(${animProgress})` }
	    };
	    return properties[property]();
	}
	// Helpers methods
	_isPropertyExceptionExist(property) {
		return Animation.propertyExceptions.indexOf(property) !== -1; 
	}
	_getAnimDistance(from, to) {
		return from < to ? to - from : from - to; 
	}
	_getAnimProgress({ timingCurve, animationRange, animDistance, currentToValue} ) {
		return timingCurve(animationRange) * animDistance + currentToValue;
	}
	_getCurrentToValue(from, to) {
		return to > from ? from : to;
	}
	_getAnimationRange(progress, duration) {
		return progress/duration;
	}
	_resetAnimationDatas() {
		this.animationProgress = 0;
		this.currentAnimationRange = 0;
	}
	_runCallbackFunctions(functionName,  {parameters} = {}) {
		if (functionName !== null) {
			typeof parameters === 'undefined' ? functionName() : functionName(...parameters);
		}
	}
	// Static methods.
	static get propertyExceptions() {
	    return [
	    'scrollY',
	    'scrollX',
	    'scroll',
	    'rotate',
	    'scale'
	    ]
	}
	static get timingCurves()   {
	    return {
		linear: function (t) { return t },
		easeInQuad: function (t) { return t*t },
		easeOutQuad: function (t) { return t*(2-t) },
		easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
		easeInCubic: function (t) { return t*t*t },
		easeOutCubic: function (t) { return (--t)*t*t+1 },
		easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
		easeInQuart: function (t) { return t*t*t*t },
		easeOutQuart: function (t) { return 1-(--t)*t*t*t },
		easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
		easeInQuint: function (t) { return t*t*t*t*t },
		easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
		easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
	    }
	}
}


class AnimaConfig {
    static build({ property, fromValue, toValue, duration, timingCurve }) {
        return {property, fromValue, toValue, duration, timingCurve};
    }
}

class Anima {
	constructor({element}) {
		this.element = element;
		this.animations = [];
	}
	chain(...steps) {
        console.log(this.animations)
        this.animations.push(steps.map(step => new Animation(this.element, AnimaConfig.build(step))));
		const obj = {
			chain: (...steps) => {
				this.animations.push(steps.map(step => new Animation(this.element, AnimaConfig.build(step))));
				return this;
			}
		};
		return obj
	}
	run() {
        this._runAnimations(0);
    }
	_runAnimations(index) {
        this.animations[index].forEach(step => {
            step.animate();
            if (index + 1 < this.animations.length) {
                this.animations[index][this.animations[index].length - 1].onComplete = () => {
                    this._runAnimations(index + 1);
                }
            }
        })
	}
}