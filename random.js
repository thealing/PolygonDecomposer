function randomBetween(l, h) {
  return l + Math.random() * (h - l);
}

function randomIntBetween(l, h) {
  return l + Math.floor(Math.random() * (h - l + 1));
}

function randomShuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomIntBetween(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
