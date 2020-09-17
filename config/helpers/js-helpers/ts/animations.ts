const easeInOutCubic: (completion: number) => number = (completion: number) => {
  let doubled: number = completion * 2;
  const progress: number = doubled < 1 ? 0.5 * doubled ** 3 : 0.5 * ((doubled -= 2) * doubled ** 2 + 2);

  return progress;
};

const animateOverTime: (dur: number, cb: (completion: number) => void, fin: () => void) => FrameRequestCallback = (
  dur: number,
  cb: (completion: number) => void,
  fin: () => void
): FrameRequestCallback => {
  let timeStart: number;

  // create closure
  function animateOverTimeClosure(time: number): void {
    if (!timeStart) timeStart = time;
    const timeElapsed: number = time - timeStart;
    const completion: number = Math.min(timeElapsed / dur, 1);

    cb(completion);

    if (timeElapsed < dur) {
      requestAnimationFrame(animateOverTimeClosure);
    } else if (typeof fin === 'function') fin();
  }

  return animateOverTimeClosure;
};

const fadeOut: (el: HTMLElement, duration?: number, callback?: () => void) => void = (
  el: HTMLElement,
  duration: number = 250,
  callback: () => void = (): void => {} // eslint-disable-line @typescript-eslint/no-empty-function
) => {
  const element: HTMLElement = el;

  if (element.style.display !== 'none') {
    // create closure
    const fadeOutClosure: (completion: number) => void = (completion: number) => {
      element.style.opacity = (1 - completion).toString();

      if (completion === 1) {
        element.style.display = 'none';
      }
    };

    const ani: FrameRequestCallback = animateOverTime(duration, fadeOutClosure, callback);
    requestAnimationFrame(ani);
  }
};

const fadeIn: (el: HTMLElement, duration?: number, display?: string, callback?: () => void) => void = (
  el: HTMLElement,
  duration: number = 250,
  display: string = 'block',
  callback: () => void = (): void => {} // eslint-disable-line @typescript-eslint/no-empty-function
) => {
  const element: HTMLElement = el;

  if (element.style.display !== display) {
    element.style.display = display;

    // create closure
    const fadeInClosure: (completion: number) => void = (completion: number) => {
      element.style.opacity = completion.toString();
    };

    const ani: FrameRequestCallback = animateOverTime(duration, fadeInClosure, callback);
    requestAnimationFrame(ani);
  }
};

const collapse: (el: HTMLElement, duration?: number, height?: number, callback?: () => void) => void = (
  el: HTMLElement,
  duration: number = 250,
  height?: number,
  callback: () => void = (): void => {} // eslint-disable-line @typescript-eslint/no-empty-function
) => {
  const element: HTMLElement = el;
  const elHeight: number = height || element.getBoundingClientRect().height;

  if (elHeight !== 0) {
    const collapseClosure: (completion: number) => void = (completion: number) => {
      const value: number = elHeight * easeInOutCubic(completion);
      element.style.height = `${(elHeight - value).toString()}px`;
    };

    const ani: FrameRequestCallback = animateOverTime(duration, collapseClosure, callback);
    requestAnimationFrame(ani);
  }
};

const expand: (el: HTMLElement, height: number, duration?: number, callback?: () => void) => void = (
  el: HTMLElement,
  height: number,
  duration: number = 250,
  callback: () => void = (): void => {} // eslint-disable-line @typescript-eslint/no-empty-function
) => {
  const element: HTMLElement = el;
  const elHeight: number = element.getBoundingClientRect().height;

  if (elHeight < height) {
    const expandClosure: (completion: number) => void = (completion: number) => {
      const value: number = height * easeInOutCubic(completion);
      element.style.height = `${value.toString()}px`;
    };

    const ani: FrameRequestCallback = animateOverTime(duration, expandClosure, callback);
    requestAnimationFrame(ani);
  }
};

const show: (el: HTMLElement, display?: string, callback?: () => void) => void = (
  el: HTMLElement,
  display: string = 'block',
  callback: () => void = (): void => {} // eslint-disable-line @typescript-eslint/no-empty-function
) => {
  // eslint-disable-next-line no-param-reassign
  el.style.display = display;

  if (typeof callback === 'function') callback();
};

const hide: (el: HTMLElement, callback?: () => void) => void = (
  el: HTMLElement,
  callback: () => void = (): void => {} // eslint-disable-line @typescript-eslint/no-empty-function
) => {
  // eslint-disable-next-line no-param-reassign
  el.style.display = 'none';

  if (typeof callback === 'function') callback();
};

export { fadeIn, fadeOut, show, hide, collapse, expand };
