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
        this.isAnimationRunning = false;
        this.isFinished = (value) => value; 
    }
    animate(property, { fromValue, toValue, duration, delay = 0, timingCurve }, callback = null) {
        if (this.isAnimationRunning) { return; }
        let startTime = null;
        const frame = (timestamp) => {
            this.isAnimationRunning = true;
            let progress;
            if (startTime === null) startTime = timestamp;
            progress = timestamp - startTime;
            const relativeProgress = progress/duration; 
            const currentToValue = toValue > fromValue ? fromValue : toValue;
            const animDistance = fromValue < toValue ? toValue - fromValue : fromValue - toValue;
            let animationProgress = (timingCurve(relativeProgress) * animDistance) + currentToValue;
            if (toValue < fromValue) {
                animationProgress -= fromValue;
                animationProgress = Math.abs(animationProgress - currentToValue);
            }

            this.animateProperty({ delay: delay, property: property, animationPosition: animationProgress, element: this.element });

            const shouldRequestAnimationFrame = relativeProgress >= 0 && relativeProgress <= 1;
            if (shouldRequestAnimationFrame) {
                requestAnimationFrame(frame);
            } 
            else {
                this.isAnimationRunning = false;
                // When the anim is finished we just put the element in the 'toValue' position.
                this.animateProperty({ property: property, animationPosition: this.isFinished(toValue), element: this.element });
                startTime = null;
                if (callback === null) { return; }
                return callback();
            }
        }
        requestAnimationFrame(frame);
    }
    animateProperty({ delay, property, animationPosition, element }) {
        window.setTimeout(() => {
            if (this.isPropertyExceptionExist(property)) {
                this.setPropertyException(element, property, animationPosition)
            } else {
                this.element.style[property] = `${animationPosition}px`;
            }
        }, delay)
    }
    setPropertyException(element, property, animProgress) {
        const properties = {
            scrollY: () => { window.scrollTo(0,animProgress); },
            scrollX: () => { window.scrollTo(animProgress, 0) },
            scroll: () => { window.scrollTo(animProgress, animProgress) },
            rotate: () => { element.style.transform = `rotate(${animProgress}deg)` },
            scale: () => { element.style.transform = `scale(${animProgress})` }
        };
        return properties[property]();
    }
    isPropertyExceptionExist(property) {
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