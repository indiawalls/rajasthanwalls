'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';

export default function AnimatedSection({ children, delay = 0, className = "" }) {
    return (
        <LazyMotion features={domAnimation}>
            <m.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                    duration: 0.50,
                    delay: delay,
                    ease: [0.16, 1, 0.3, 1], // Custom fast-out spring ease
                }}
                style={{ willChange: "transform, opacity" }}
                className={className}
            >
                {children}
            </m.div>
        </LazyMotion>
    );
}