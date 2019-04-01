/**
 * Anima 1.0
 * Lightweight animation class for simple animations.
 *
 * Copyright 2019 - Léo Goémaere
 *
 * MIT License
 *
 */

class Anima {
    constructor({ element } = {}) {
        this.element = element;
        this.animationProgress = 0;
        this.currentAnimationRange = 0,
        this.isAnimationRunning = false;
    }
    animate(property, { fromValue, toValue, duration, delay = 0, timingCurve }, callback = null) {
        if (this.isAnimationRunning) { return; }
        let startTime = null;
        const frame = (timestamp) => {
            this.isAnimationRunning = true;
            let progress;
            if (startTime === null) startTime = timestamp;
            progress = timestamp - startTime;
            this.currentAnimationRange = this._getAnimationRange(progress, duration);
            this.animationProgress = this._getAnimProgress({
                timingCurve: timingCurve,
                animationRange: this.currentAnimationRange,
                animDistance: this._getAnimDistance(fromValue, toValue),
                currentToValue: this._getCurrentToValue(fromValue, toValue)
            });
            
            if (toValue < fromValue) {
                this.animationProgress -= fromValue;
                this.animationProgress = Math.abs(this.animationProgress - this._getCurrentToValue(fromValue, toValue));
            }

            this._animateProperty({ delay: delay, property: property, animationPosition: this.animationProgress, element: this.element });

            const shouldRequestAnimationFrame = this.currentAnimationRange >= 0 && this.currentAnimationRange <= 1;
            if (shouldRequestAnimationFrame) {
                requestAnimationFrame(frame);
            } 
            else {
                this.isAnimationRunning = false;
                // When the anim is finished we set animationProgress with the 'toValue' position.
                this.animationProgress = toValue;
                this.currentAnimationRange = 1;
                this._animateProperty({ property: property, animationPosition: this.animationProgress, element: this.element });
                startTime = null;
                if (callback === null) { return; }
                callback();
                this._resetAnimationDatas();
            }
        }
        window.setTimeout(() => {
            requestAnimationFrame(frame);
        }, delay)
    }
    // Helpers
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
    _isPropertyExceptionExist(property) {
        return Anima.propertyExceptions.indexOf(property) !== -1; 
    }
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