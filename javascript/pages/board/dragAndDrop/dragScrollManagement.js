/**
 * @fileoverview Drag and Drop Scroll Management
 * Handles scroll prevention and auto-scrolling during drag operations
 * @author Join Project Team
 * @version 1.0.0
 */

let lastScrollTime = 0;

/**
 * Prevents touch scroll events during dragging
 * @function preventTouchScroll
 * @param {Event} event - Touch event
 * @returns {boolean}
 */
function preventTouchScroll(event) {
  if (isDragging) {
    if (event.cancelable) {
      event.preventDefault();
      event.stopPropagation();
    }
    return false;
  }
}

/**
 * Prevents wheel scroll events during dragging
 * @function preventWheelScroll
 * @param {Event} event - Wheel event
 * @returns {boolean}
 */
function preventWheelScroll(event) {
  if (isDragging) {
    event.preventDefault();
    return false;
  }
}

/**
 * Prevents window scroll events during dragging
 * @function preventWindowScroll
 * @param {Event} event - Scroll event
 * @returns {boolean}
 */
function preventWindowScroll(event) {
  if (isDragging) {
    event.preventDefault();
    return false;
  }
}

/**
 * Adds scroll prevention during drag operations
 * @function addScrollPrevention
 * @returns {void}
 */
function addScrollPrevention() {
  const scrollY = window.pageYOffset;
  const scrollX = window.pageXOffset;
  document.body.classList.add("dragScrollingPrevention");
  document.body.style.setProperty("--scroll-offset", `-${scrollY}px`);
  document.body.dataset.scrollY = scrollY;
  document.body.dataset.scrollX = scrollX;
  document.addEventListener("touchmove", preventTouchScroll, {
    passive: false,
    capture: true,
  });
  document.addEventListener("touchstart", preventTouchScroll, {
    passive: false,
    capture: true,
  });
  document.body.style.touchAction = "none";
  document.addEventListener("wheel", preventWheelScroll, {
    passive: false,
    capture: true,
  });
  window.addEventListener("scroll", preventWindowScroll, {
    passive: false,
    capture: true,
  });
}

/**
 * Removes scroll prevention and restores normal scrolling
 * @function removeScrollPrevention
 * @returns {void}
 */
function removeScrollPrevention() {
  const scrollY = parseInt(document.body.dataset.scrollY || "0");
  const scrollX = parseInt(document.body.dataset.scrollX || "0");
  document.removeEventListener("touchmove", preventTouchScroll, true);
  document.removeEventListener("touchstart", preventTouchScroll, true);
  document.removeEventListener("wheel", preventWheelScroll, true);
  window.removeEventListener("scroll", preventWindowScroll, true);
  document.body.style.touchAction = "";
  window.removeEventListener("scroll", preventWindowScroll, true);
  document.body.classList.remove(
    "dragScrollingPrevention",
    "dragTouchDisabled"
  );
  document.body.style.removeProperty("--scroll-offset");
  requestAnimationFrame(() => {
    window.scrollTo(scrollX, scrollY);
    delete document.body.dataset.scrollY;
    delete document.body.dataset.scrollX;
  });
}

/**
 * Handles automatic scrolling only at screen edges during pointer drag
 * Optimized for stable scrolling without disabling prevention
 * @function handleAutoScrollPointer
 * @param {PointerEvent} event - The pointer event
 * @returns {void}
 */
function handleAutoScrollPointer(event) {
  if (!isDragging) return;
  const now = Date.now();
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  const isNarrowDevice = windowWidth <= 430;
  const isMobile = windowWidth <= 768;
  let edgeThreshold, scrollSpeed, scrollInterval;
  if (isMobile) {
    edgeThreshold = 120;
    scrollSpeed = 10;
    scrollInterval = 8;
  } else {
    edgeThreshold = 50;
    scrollSpeed = 12;
    scrollInterval = 6;
  }
  const frameInterval = isNarrowDevice ? 10 : isMobile ? 8 : 6;
  if (now - lastScrollTime > frameInterval) {
    let shouldScroll = false;
    let scrollDirection = 0;
    if (event.clientY < edgeThreshold) {
      shouldScroll = true;
      scrollDirection = -scrollSpeed;
    } else if (event.clientY > windowHeight - edgeThreshold) {
      shouldScroll = true;
      scrollDirection = scrollSpeed;
    }
    if (shouldScroll) {
      lastScrollTime = now;
      const currentScrollY = Math.abs(
        parseInt(
          document.body.style
            .getPropertyValue("--scroll-offset")
            ?.replace("px", "") || "0"
        )
      );
      const newScrollY = Math.max(0, currentScrollY + scrollDirection);
      document.body.style.setProperty("--scroll-offset", `-${newScrollY}px`);
      document.body.dataset.scrollY = newScrollY;
    }
  }
}

/**
 * Restores normal scroll behavior after drag operation completion
 * Sets body scroll state to restore for returning to normal scrolling functionality
 * @function restoreScrolling
 * @returns {void}
 */
function restoreScrolling() {
  setBodyScrollState("restore");
}
