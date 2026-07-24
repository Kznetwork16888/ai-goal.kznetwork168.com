import { animate as anime } from 'animejs';
import confetti from 'canvas-confetti';

export class SoccerScene {
    constructor() {
        this.scene = document.getElementById('soccer-scene');
        this.ball = document.querySelector('.scene-ball');
        this.goalkeeper = document.querySelector('.scene-goalkeeper');
        this.gkLeftArm = document.querySelector('.gk-arm-l');
        this.gkRightArm = document.querySelector('.gk-arm-r');
        this.net = document.querySelector('.scene-net');
        this.field = document.querySelector('.field') || document.body; // Fallback if no .field
    }

    reset() {
        // Reset positions and transformations
        anime.set(this.ball, { translateX: '-50%', translateY: 0, translateZ: 0, scale: 1 });
        anime.set(this.goalkeeper, { translateX: '-50%', rotate: 0 });
        anime.set(this.gkLeftArm, { rotate: 0 });
        anime.set(this.gkRightArm, { rotate: 0 });
        anime.set(this.net, { scaleY: 1, skewX: 0 });
        this.scene.classList.remove('shake');
    }

    playShootoutAnimation(isCorrect) {
        return new Promise((resolve) => {
            this.reset();
            
            const duration = 1200;

            if (isCorrect) {
                // Ball flies to top corner
                anime({
                    targets: this.ball,
                    translateX: ['-50%', '30px'], // Top rightish
                    translateY: [0, '-60px'],
                    scale: [1, 0.4], // Perspective depth
                    easing: 'easeOutCubic',
                    duration: duration * 0.4
                });

                // Goalkeeper dives to the wrong side
                anime({
                    targets: this.goalkeeper,
                    translateX: ['-50%', '-90%'],
                    rotate: -45,
                    easing: 'easeOutQuad',
                    duration: duration * 0.4
                });

                // GK arms
                anime({
                    targets: [this.gkLeftArm, this.gkRightArm],
                    rotate: -120,
                    easing: 'easeOutQuad',
                    duration: duration * 0.3
                });

                // Net ripples
                anime({
                    targets: this.net,
                    scaleY: [1, 1.1, 1],
                    skewX: [0, -5, 5, 0],
                    easing: 'easeInOutQuad',
                    duration: duration * 0.5,
                    delay: duration * 0.35
                });

                // Trigger confetti slightly after goal
                setTimeout(() => {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#5DCAA5', '#f0b429', '#ffffff']
                    });
                }, duration * 0.3);

                setTimeout(resolve, duration);

            } else {
                // Ball flies to center, goalkeeper blocks it
                anime({
                    targets: this.ball,
                    translateX: '-50%',
                    translateY: [0, '-40px'],
                    scale: [1, 0.5],
                    easing: 'easeOutQuad',
                    duration: duration * 0.4
                });

                // Goalkeeper slides/blocks
                anime({
                    targets: this.goalkeeper,
                    translateX: '-50%',
                    translateY: [0, '10px'], // slightly forwards
                    easing: 'easeOutQuad',
                    duration: duration * 0.2,
                    delay: duration * 0.2
                });
                
                // GK arms up
                anime({
                    targets: [this.gkLeftArm, this.gkRightArm],
                    rotate: [0, -180],
                    easing: 'easeOutQuad',
                    duration: duration * 0.3
                });

                // Screen shake on block
                setTimeout(() => {
                    this.scene.classList.add('shake');
                    // bounce ball back slightly
                    anime({
                        targets: this.ball,
                        translateY: '-20px',
                        scale: 0.6,
                        easing: 'easeOutQuad',
                        duration: duration * 0.3
                    });
                }, duration * 0.35);

                setTimeout(() => {
                    this.scene.classList.remove('shake');
                    resolve();
                }, duration);
            }
        });
    }
}
