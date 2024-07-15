function distance(a, b) {
  return (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
}

function orient(a, b, c) {
  return (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
}

function isConvex(a, b, c) {
  return orient(a, b, c) >= 0;
}

function testPointTriangle(p, a, b, c) {
  return orient(a, b, p) >= 0 && orient(b, c, p) >= 0 && orient(c, a, p) >= 0;
}

function testSegments(a1, b1, a2, b2) {
  return orient(a1, b1, a2) * orient(a1, b1, b2) < 0 && orient(a2, b2, a1) * orient(a2, b2, b1) < 0;
}

function fixPolygon(polygon) {
  var area = 0;
  for (var i1 = polygon.length - 1, i2 = 0; i2 < polygon.length; i1 = i2, i2++) {
    area += polygon[i1].x * polygon[i2].y - polygon[i1].y * polygon[i2].x;
  }
  if (area < 0) {
    polygon.reverse();
  }
}

// O(n^4) but O(n^3) on average due to randomization
function generateRandomPolygon(n, x1, y1, x2, y2) {
  var points = [];
  for (var i = 0; i < n; i++) {
    points[i] = { x: randomBetween(x1, x2), y: randomBetween(y1, y2) };
  }
  points.sort((a, b) => a.x - b.x);
  var polygon = [];
  polygon.push(points[0]);
  polygon.push(points[1]);
  for (var i = 2; i < points.length; i++) {
    while (polygon.length >= 2 && !isConvex(polygon[polygon.length - 2], polygon[polygon.length - 1], points[i])) {
      polygon.pop();
    }
    polygon.push(points[i]);
  }
  randomShuffle(points);
  while (true) {
    var stop = true;
    for (var i1 = polygon.length - 1, i2 = 0; i2 < polygon.length; i1 = i2, i2++) {
      for (var j = 0; j < points.length; j++) {
        if (polygon.includes(points[j])) {
          continue;
        }
        var bad = false;
        for (var k1 = polygon.length - 1, k2 = 0; k2 < polygon.length; k1 = k2, k2++) {
          if (testSegments(polygon[i1], points[j], polygon[k1], polygon[k2]) || testSegments(polygon[i2], points[j], polygon[k1], polygon[k2])) {
            bad = true;
            break;
          }
        }
        if (bad) {
          continue;
        }
        stop = false;
        polygon.splice(i1 + 1, 0, points[j]);
        break;
      }
    }
    if (stop) {
      break;
    }
  }
  return polygon;
}

// O(n^2)
function triangulatePolygon(polygon) {
  var n = polygon.length;
  var v = new Array(n);
  var l = new Array(n);
  var r = new Array(n);
  var t = new Array();
  for (var i = 0; i < n; i++) {
    v[i] = { x: polygon[i].x, y: polygon[i].y };
    l[i] = i == 0 ? n - 1 : i - 1;
    r[i] = i == n - 1 ? 0 : i + 1;
  }
  function isEar(i) {
    var i1 = l[i];
    var i2 = i;
    var i3 = r[i];
    if (!isConvex(v[i1], v[i2], v[i3])) {
      return false;
    }
    for (var j = r[i3]; j != i1; j = r[j]) {
      if (testPointTriangle(v[j], v[i1], v[i2], v[i3])) {
        return false;
      }
    }
    return true;
  }
  var e = new Set();
  for (var i = 0; i < n; i++) {
    if (isEar(i)) {
      e.add(i);
    }
  }
  function remove(i) {
    l[r[i]] = l[i];
    r[l[i]] = r[i];
  }
  function update(i) {
    if (isEar(i)) {
      e.add(i);
    }
    else {
      e.delete(i);
    }
  }
  while (e.size > 0) {
    var [i] = e;
    e.delete(i);
    remove(i);
    update(l[i]);
    update(r[i]);
    t.push([l[i], i, r[i]]);
  }
  return t;
}
