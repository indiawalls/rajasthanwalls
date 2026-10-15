// used for client component
'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

export default function AnimatedCounter({ value, duration = 2, suffix = "" }) {
    const ref = useRef(null)
    // checks if the span is visible inside the user's window
    // once -> true ensures it only animates on the first render of the page
    const isInView = useInView(ref, { once: true, margin: '-50px' })
    const [displayValue, setDisplayValue] = useState(0)

    const motionValue = useMotionValue(0)
    // duration -> animates for specific duration
    // bounce -> 0 deaccelerates smoothly at the end
    const springValue = useSpring(motionValue, {
        duration: duration * 1000,
        bounce: 0
    })

    useEffect(() => {
        if (isInView) {
            // changes target from zero to target value
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        // spring value calculates display number
        const unsubscribe = springValue.on('change', (latest) => {
            setDisplayValue(Math.floor(latest));
        });
        return () => unsubscribe();
    }, [springValue]);

    return (
        <span ref={ref}>
            {displayValue.toLocaleString()}
            {suffix}
        </span>
    );
}