/*
 * sweetPop.js
 * Handles showing and animating the sweet pop images.
 */

const SWEET_POP_IMAGES = [
  "images/sweet-min.png",
  "images/delicious-min.png"
];

let sweetPopTimeout = null;

function showSweetPop(x = null, y = null) {
  // Remove if already present
  let pop = document.getElementById("sweet-pop");
  if (pop) pop.remove();

  const img = document.createElement("img");
  img.id = "sweet-pop";
  img.src = SWEET_POP_IMAGES[Math.floor(Math.random() * SWEET_POP_IMAGES.length)];
  img.style.position = "absolute";
  if (x !== null && y !== null) {
    img.style.left = x + "px";
    img.style.top = y + "px";
  } else {
    img.style.left = "50%";
    img.style.top = "30%";
  }
  img.style.transform = "translate(-50%, -50%) scale(0.5)";
  img.style.transition = "transform 0.25s cubic-bezier(.68,-0.55,.27,1.55), opacity 0.25s";
  img.style.opacity = "0";
  img.style.zIndex = 1000;
  // Add here:
  if (window.IS_MOBILE_LANDSCAPE) {
    img.onload = () => {
      const aspect = img.naturalWidth / img.naturalHeight;
      img.style.width = 0.8 * window.innerHeight * aspect + "px";
      img.style.height = 0.8 * window.innerHeight + "px";
    };
  } else {
    img.style.width = "120px";
    img.style.height = "auto";
  }
  document.body.appendChild(img);

  // Animate pop in
  setTimeout(() => {
    img.style.transform = "translate(-50%, -50%) scale(1.2)";
    img.style.opacity = "1";
  }, 10);

  // Animate pop out after 700ms
  clearTimeout(sweetPopTimeout);
  sweetPopTimeout = setTimeout(() => {
    img.style.transform = "translate(-50%, -50%) scale(0.5)";
    img.style.opacity = "0";
    setTimeout(() => img.remove(), 250);
  }, 700);
}

export { showSweetPop };