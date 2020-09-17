const easeInOutCubic = (completion) => {
  let doubled = completion * 2;
  const progress = doubled < 1 ? 0.5 * doubled ** 3 : 0.5 * ((doubled -= 2) * doubled ** 2 + 2);

  return progress;
};

const animateOverTime = (dur, cb, fin) => {
  let timeStart;

  // create closure
  function animateOverTimeClosure(time) {
    if (!timeStart) timeStart = time;
    const timeElapsed = time - timeStart;
    const completion = Math.min(timeElapsed / dur, 1);

    cb(completion);

    if (timeElapsed < dur) {
      requestAnimationFrame(animateOverTimeClosure);
    } else if (typeof fin === 'function') fin();
  }

  return animateOverTimeClosure;
};

const fadeOut = (
  el,
  duration = 250,
  callback = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
) => {
  const element = el;

  if (element.style.display !== 'none') {
    // create closure
    const fadeOutClosure = (completion) => {
      element.style.opacity = (1 - completion).toString();

      if (completion === 1) {
        element.style.display = 'none';
      }
    };

    const ani = animateOverTime(duration, fadeOutClosure, callback);
    requestAnimationFrame(ani);
  }
};

const fadeIn = (
  el,
  duration = 250,
  display = 'block',
  callback = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
) => {
  const element = el;

  if (element.style.display !== display) {
    element.style.display = display;

    // create closure
    const fadeInClosure = (completion) => {
      element.style.opacity = completion.toString();
    };

    const ani = animateOverTime(duration, fadeInClosure, callback);
    requestAnimationFrame(ani);
  }
};

const collapse = (
  el,
  duration = 250,
  height,
  callback = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
) => {
  const element = el;
  const elHeight = height || element.getBoundingClientRect().height;

  if (elHeight !== 0) {
    const collapseClosure = (completion) => {
      const value = elHeight * easeInOutCubic(completion);
      element.style.height = `${(elHeight - value).toString()}px`;
    };

    const ani = animateOverTime(duration, collapseClosure, callback);
    requestAnimationFrame(ani);
  }
};

const expand = (
  el,
  height,
  duration = 250,
  callback = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
) => {
  const element = el;
  const elHeight = element.getBoundingClientRect().height;

  if (elHeight < height) {
    const expandClosure = (completion) => {
      const value = height * easeInOutCubic(completion);
      element.style.height = `${value.toString()}px`;
    };

    const ani = animateOverTime(duration, expandClosure, callback);
    requestAnimationFrame(ani);
  }
};

const show = (
  el,
  display = 'block',
  callback = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
) => {
  // eslint-disable-next-line no-param-reassign
  el.style.display = display;

  if (typeof callback === 'function') callback();
};

const hide = (
  el,
  callback = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
) => {
  // eslint-disable-next-line no-param-reassign
  el.style.display = 'none';

  if (typeof callback === 'function') callback();
};

export { fadeIn, fadeOut, show, hide, collapse, expand };
