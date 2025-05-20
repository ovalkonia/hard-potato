let dotAnimation = null;

export function startDotAnimation() {
  const dots = document.querySelectorAll('.dot');

  dotAnimation = anime({
    targets: dots,
    translateY: [
      { value: -10, duration: 300 },
      { value: 0, duration: 300 }
    ],
    delay: anime.stagger(150, { start: 0 }),
    easing: 'easeInOutSine',
    loop: true,
    direction: 'alternate'
  });
}

export function stopDotAnimation() {
  if (dotAnimation) {
    dotAnimation.pause();
    dotAnimation = null;
  }
}