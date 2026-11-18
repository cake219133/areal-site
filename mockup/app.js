/* Мокап-экран: автопоиск квада, перспектива, чёлка и точная подгонка */
"use strict";

const $ = (id) => document.getElementById(id);

const state = {
  mockup: null,
  screen: null,
  quad: null, // [tl, tr, br, bl] in mockup pixel space
  dragging: null,
  clickCorners: null,
  bezelColor: [0, 0, 0],
  holeMode: false, // transparent PNG: screenshot goes behind the mockup
  lastFocus: "mockup",
  raf: 0,
  lastDraw: 0,
};

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t) { return a + (t - a) * 0 + (b - a) * t; }

function setStatus(text, kind) {
  const el = $("status");
  el.textContent = text;
  el.className = "status" + (kind ? " " + kind : "");
}

function fmtPct(v, digits = 1) {
  const n = Number(v);
  return (Number.isInteger(n) || digits === 0 ? n.toFixed(0) : n.toFixed(digits)) + "%";
}

/* ---------- linear algebra / homography ---------- */

function solveH(src, dst) {
  // src, dst: 4 points {x,y}. Maps src -> dst.
  const A = [];
  const b = [];
  for (let i = 0; i < 4; i++) {
    const x = src[i].x, y = src[i].y;
    const u = dst[i].x, v = dst[i].y;
    A.push([x, y, 1, 0, 0, 0, -x * u, -y * u]);
    b.push(u);
    A.push([0, 0, 0, x, y, 1, -x * v, -y * v]);
    b.push(v);
  }
  const h = solve8(A, b);
  if (!h) return null;
  return [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1];
}

function solve8(A, b) {
  // Gaussian elimination with partial pivoting, 8x8
  const n = 8;
  const M = A.map((row, i) => row.concat([b[i]]));
  for (let col = 0; col < n; col++) {
    let piv = col;
    let best = Math.abs(M[col][col]);
    for (let r = col + 1; r < n; r++) {
      const v = Math.abs(M[r][col]);
      if (v > best) { best = v; piv = r; }
    }
    if (best < 1e-12) return null;
    if (piv !== col) { const t = M[col]; M[col] = M[piv]; M[piv] = t; }
    const div = M[col][col];
    for (let c = col; c <= n; c++) M[col][c] /= div;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col];
      if (f === 0) continue;
      for (let c = col; c <= n; c++) M[r][c] -= f * M[col][c];
    }
  }
  return M.map((row) => row[n]);
}

function applyH(H, x, y) {
  const w = H[6] * x + H[7] * y + H[8];
  if (Math.abs(w) < 1e-12) return { x: 0, y: 0, w };
  return { x: (H[0] * x + H[1] * y + H[2]) / w, y: (H[3] * x + H[4] * y + H[5]) / w, w };
}

function invertH(H) {
  const m = H;
  const a = m[0], b = m[1], c = m[2], d = m[3], e = m[4], f = m[5], g = m[6], h = m[7], i = m[8];
  const A = e * i - f * h;
  const B = f * g - d * i;
  const C = d * h - e * g;
  const D = c * h - b * i;
  const E = a * i - c * g;
  const F = b * g - a * h;
  const G = b * f - c * e;
  const Hh = c * d - a * f;
  const I = a * e - b * d;
  const det = a * A + b * B + c * C;
  if (Math.abs(det) < 1e-14) return null;
  const inv = 1 / det;
  return [A * inv, D * inv, G * inv, B * inv, E * inv, Hh * inv, C * inv, F * inv, I * inv];
}

function orderQuad(pts) {
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  const sorted = pts.slice().sort((a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx));
  // start from top-left: among the two with smallest y+x, take the left-er after rotation order
  let k = 0;
  let best = Infinity;
  for (let i = 0; i < 4; i++) {
    const score = sorted[i].x + sorted[i].y;
    if (score < best) { best = score; k = i; }
  }
  const q = [0, 1, 2, 3].map((i) => sorted[(k + i) % 4]);
  // ensure winding is tl,tr,br,bl (clockwise or ccw going right from tl)
  const v1x = q[1].x - q[0].x, v1y = q[1].y - q[0].y;
  const v3x = q[3].x - q[0].x, v3y = q[3].y - q[0].y;
  // q[1] should be to the right of q[0] more than q[3] if it's tr
  // If the second point is lower-left-ish, rotate
  if (q[1].x + q[1].y > q[3].x + q[3].y && q[1].x < q[3].x) {
    // maybe already ok
  }
  // Cross of tl->tr and tl->bl should be consistent. If q[1] is actually bl, swap.
  const mid01y = (q[0].y + q[1].y) / 2;
  const mid03y = (q[0].y + q[3].y) / 2;
  if (q[1].y > q[3].y && q[1].x < q[0].x + (q[3].x - q[0].x) * 0.3) {
    // q[1] looks like bl; we had CCW starting tl: tl, bl, br, tr → we want clockwise tl,tr,br,bl
    return [q[0], q[3], q[2], q[1]];
  }
  // If going tl,tr,br,bl then q[1] is above q[2] typically and to the right
  if (mid01y > mid03y) return [q[0], q[3], q[2], q[1]];
  return q;
}

/* ---------- geometry: hull, RDP, contours ---------- */

function convexHull(points) {
  const pts = points.slice().sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);
  if (pts.length <= 2) return pts;
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

function rdp(points, eps) {
  if (points.length < 3) return points.slice();
  const closed = points[0].x === points[points.length - 1].x && points[0].y === points[points.length - 1].y;
  const pts = closed ? points.slice(0, -1) : points.slice();
  const sq = eps * eps;
  function d2(a, b, p) {
    const vx = b.x - a.x, vy = b.y - a.y;
    const len = vx * vx + vy * vy;
    let t = len ? ((p.x - a.x) * vx + (p.y - a.y) * vy) / len : 0;
    t = clamp(t, 0, 1);
    const x = a.x + t * vx, y = a.y + t * vy;
    const dx = p.x - x, dy = p.y - y;
    return dx * dx + dy * dy;
  }
  function rec(arr) {
    if (arr.length <= 2) return arr;
    const a = arr[0], b = arr[arr.length - 1];
    let idx = -1, best = 0;
    for (let i = 1; i < arr.length - 1; i++) {
      const d = d2(a, b, arr[i]);
      if (d > best) { best = d; idx = i; }
    }
    if (best > sq) {
      const left = rec(arr.slice(0, idx + 1));
      const right = rec(arr.slice(idx));
      return left.slice(0, -1).concat(right);
    }
    return [a, b];
  }
  let out = rec(pts.concat([pts[0]]));
  if (out.length > 1 && out[0].x === out[out.length - 1].x && out[0].y === out[out.length - 1].y) out = out.slice(0, -1);
  return out;
}

function quadArea(q) {
  let a = 0;
  for (let i = 0; i < 4; i++) {
    const p = q[i], n = q[(i + 1) % 4];
    a += p.x * n.y - n.x * p.y;
  }
  return Math.abs(a) / 2;
}

function fourFromHull(hull) {
  if (hull.length < 4) return null;
  const sum = (p) => p.x + p.y, diff = (p) => p.x - p.y;
  const tl = hull.reduce((a, p) => sum(p) < sum(a) ? p : a);
  const br = hull.reduce((a, p) => sum(p) > sum(a) ? p : a);
  const tr = hull.reduce((a, p) => diff(p) > diff(a) ? p : a);
  const bl = hull.reduce((a, p) => diff(p) < diff(a) ? p : a);
  const unique = [tl, tr, br, bl].filter((p, i, arr) => arr.findIndex((q) => q.x === p.x && q.y === p.y) === i);
  if (unique.length === 4) return orderQuad(unique);
  // fallback: pick 4 hull vertices maximizing area (evenly-ish)
  if (hull.length >= 4) {
    let winner = null, area = 0;
    const n = hull.length;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        for (let k = j + 1; k < n; k++) {
          for (let l = k + 1; l < n; l++) {
            const q = orderQuad([hull[i], hull[j], hull[k], hull[l]]);
            const ar = quadArea(q);
            if (ar > area) { area = ar; winner = q; }
          }
        }
      }
      if (n > 24 && i === 0) break; // too many, use step
    }
    if (n > 24) {
      const step = Math.max(1, Math.floor(n / 16));
      for (let i = 0; i < n; i += step)
        for (let j = i + step; j < n; j += step)
          for (let k = j + step; k < n; k += step)
            for (let l = k + step; l < n; l += step) {
              const q = orderQuad([hull[i], hull[j], hull[k], hull[l]]);
              const ar = quadArea(q);
              if (ar > area) { area = ar; winner = q; }
            }
    }
    return winner;
  }
  return null;
}

/* ---------- screen detection ---------- */

function imageToGray(img, maxSide) {
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const w = Math.max(2, Math.round(img.width * scale));
  const h = Math.max(2, Math.round(img.height * scale));
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h);
  const g = new Float32Array(w * h);
  const a = data.data;
  const alpha = new Uint8Array(w * h);
  for (let i = 0, p = 0; i < a.length; i += 4, p++) {
    alpha[p] = a[i + 3];
    // Transparent pixels shouldn't look like a black screen in luma stats
    if (a[i + 3] < 16) g[p] = -1;
    else g[p] = 0.299 * a[i] + 0.587 * a[i + 1] + 0.114 * a[i + 2];
  }
  return { g, w, h, scale, rgba: a, alpha };
}

function blurGray(src, w, h) {
  const tmp = new Float32Array(w * h);
  const out = new Float32Array(w * h);
  const k = [1, 2, 1];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let s = 0, wt = 0;
      for (let i = -1; i <= 1; i++) {
        const xx = clamp(x + i, 0, w - 1);
        s += src[y * w + xx] * k[i + 1];
        wt += k[i + 1];
      }
      tmp[y * w + x] = s / wt;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let s = 0, wt = 0;
      for (let i = -1; i <= 1; i++) {
        const yy = clamp(y + i, 0, h - 1);
        s += tmp[yy * w + x] * k[i + 1];
        wt += k[i + 1];
      }
      out[y * w + x] = s / wt;
    }
  }
  return out;
}

function edgeMag(g, w, h) {
  const mag = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const gx = -g[i - w - 1] - 2 * g[i - 1] - g[i + w - 1] + g[i - w + 1] + 2 * g[i + 1] + g[i + w + 1];
      const gy = -g[i - w - 1] - 2 * g[i - w] - g[i - w + 1] + g[i + w - 1] + 2 * g[i + w] + g[i + w + 1];
      mag[i] = Math.hypot(gx, gy);
    }
  }
  return mag;
}

function thresholdMask(arr, t) {
  const m = new Uint8Array(arr.length);
  for (let i = 0; i < arr.length; i++) m[i] = arr[i] >= t ? 1 : 0;
  return m;
}

function dilate(mask, w, h, r) {
  const out = new Uint8Array(mask.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let on = 0;
      for (let dy = -r; dy <= r && !on; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= h) continue;
        for (let dx = -r; dx <= r; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= w) continue;
          if (mask[yy * w + xx]) { on = 1; break; }
        }
      }
      out[y * w + x] = on;
    }
  }
  return out;
}

function closeHoles(mask, w, h) {
  // fill interior zeros not reachable from border
  const seen = new Uint8Array(w * h);
  const q = [];
  const push = (x, y) => {
    const i = y * w + x;
    if (seen[i] || mask[i]) return;
    seen[i] = 1;
    q.push(i);
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  for (let n = 0; n < q.length; n++) {
    const i = q[n], x = i % w, y = (i / w) | 0;
    if (x > 0) push(x - 1, y);
    if (x + 1 < w) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y + 1 < h) push(x, y + 1);
  }
  const out = new Uint8Array(mask.length);
  for (let i = 0; i < mask.length; i++) out[i] = mask[i] || (seen[i] ? 0 : 1);
  return out;
}

function components(mask, w, h) {
  const lab = new Int32Array(w * h);
  lab.fill(-1);
  const comps = [];
  let id = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!mask[i] || lab[i] >= 0) continue;
      const q = [i];
      lab[i] = id;
      const pts = [];
      let minX = x, maxX = x, minY = y, maxY = y, area = 0;
      for (let n = 0; n < q.length; n++) {
        const j = q[n], xx = j % w, yy = (j / w) | 0;
        area++;
        pts.push({ x: xx, y: yy });
        if (xx < minX) minX = xx; if (xx > maxX) maxX = xx;
        if (yy < minY) minY = yy; if (yy > maxY) maxY = yy;
        const tryAdd = (nx, ny) => {
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) return;
          const k = ny * w + nx;
          if (mask[k] && lab[k] < 0) { lab[k] = id; q.push(k); }
        };
        tryAdd(xx - 1, yy); tryAdd(xx + 1, yy); tryAdd(xx, yy - 1); tryAdd(xx, yy + 1);
      }
      comps.push({ id, pts, area, minX, maxX, minY, maxY });
      id++;
    }
  }
  return comps;
}

function sampleAlong(q, blur, w, h, outward, dist) {
  const cx = (q[0].x + q[1].x + q[2].x + q[3].x) / 4;
  const cy = (q[0].y + q[1].y + q[2].y + q[3].y) / 4;
  const vals = [];
  for (let e = 0; e < 4; e++) {
    const a = q[e], b = q[(e + 1) % 4];
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    let nx = mx - cx, ny = my - cy;
    const len = Math.hypot(nx, ny) || 1;
    nx /= len; ny /= len;
    const sign = outward ? 1 : -1;
    for (let s = 1; s < 16; s++) {
      const t = s / 16;
      const x = Math.round(a.x + (b.x - a.x) * t + sign * nx * dist);
      const y = Math.round(a.y + (b.y - a.y) * t + sign * ny * dist);
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      vals.push(blur[y * w + x]);
    }
  }
  if (!vals.length) return { mean: 0, std: 0, n: 0 };
  const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
  const std = Math.sqrt(vals.reduce((s, v) => s + (v - mean) * (v - mean), 0) / vals.length);
  return { mean, std, n: vals.length };
}

function scoreQuad(q, w, h, blur) {
  const area = quadArea(q);
  const imgA = w * h;
  if (area < imgA * 0.04 || area > imgA * 0.92) return 0;
  const margin = 4;
  for (const p of q) {
    if (p.x <= margin || p.y <= margin || p.x >= w - 1 - margin || p.y >= h - 1 - margin) return 0;
  }
  const sides = [];
  for (let i = 0; i < 4; i++) {
    const a = q[i], b = q[(i + 1) % 4];
    sides.push(Math.hypot(a.x - b.x, a.y - b.y));
  }
  const r1 = Math.min(sides[0], sides[2]) / Math.max(sides[0], sides[2]);
  const r2 = Math.min(sides[1], sides[3]) / Math.max(sides[1], sides[3]);
  if (r1 < 0.25 || r2 < 0.25) return 0;
  const cx = (q[0].x + q[1].x + q[2].x + q[3].x) / 4;
  const cy = (q[0].y + q[1].y + q[2].y + q[3].y) / 4;
  const cent = 1 - Math.hypot((cx / w) - 0.5, (cy / h) - 0.5);
  const aspect = Math.min(sides[0] + sides[2], sides[1] + sides[3]) / Math.max(sides[0] + sides[2], sides[1] + sides[3]);
  let bezel = 1;
  if (blur) {
    const out = sampleAlong(q, blur, w, h, true, 5);
    const inn = sampleAlong(q, blur, w, h, false, 8);
    // A real screen usually has a darker, flatter bezel just outside
    if (out.n && inn.n) {
      // Reward a contrast ring (darker OR lighter bezel). A black screen has a
      // slightly lighter bezel; a transparent hole may be mid-grey after fill.
      const contrast = Math.abs(out.mean - inn.mean);
      const contrastBoost = contrast > 12 ? 1.35 : contrast > 6 ? 1.15 : contrast > 2 ? 1.0 : 0.8;
      const flat = out.std < inn.std + 4 ? 1.15 : 0.9;
      bezel = contrastBoost * flat;
    }
  }
  return (area / imgA) * (0.4 + 0.6 * r1 * r2) * (0.5 + 0.5 * cent) * (0.5 + 0.5 * aspect) * bezel;
}

function detectScreen(img) {
  const { g, w, h, scale, rgba, alpha } = imageToGray(img, 480);
  // Fill transparent luma so blur/edges don't treat holes as black screens
  let opaqueSum = 0, opaqueN = 0;
  for (let i = 0; i < g.length; i++) if (g[i] >= 0) { opaqueSum += g[i]; opaqueN++; }
  const opaqueMean = opaqueN ? opaqueSum / opaqueN : 128;
  for (let i = 0; i < g.length; i++) if (g[i] < 0) g[i] = opaqueMean;
  const blur = blurGray(g, w, h);
  const mag = edgeMag(blur, w, h);
  let sum = 0, count = 0, max = 0;
  for (let i = 0; i < mag.length; i++) { if (mag[i] > 0) { sum += mag[i]; count++; if (mag[i] > max) max = mag[i]; } }
  const mean = count ? sum / count : 0;
  const edgeT = Math.max(25, mean * 1.6);
  let edges = thresholdMask(mag, edgeT);
  edges = dilate(edges, w, h, 1);
  const filled = closeHoles(edges, w, h);
  // invert filled? closeHoles on edges fills interiors of closed edge loops → screen-like blobs
  const candidates = [];

  function considerMask(mask, tag) {
    const comps = components(mask, w, h);
    comps.sort((a, b) => b.area - a.area);
    for (const c of comps.slice(0, 8)) {
      if (c.area < w * h * 0.04) continue;
      if (c.minX <= 1 && c.minY <= 1 && c.maxX >= w - 2 && c.maxY >= h - 2 && c.area > w * h * 0.85) continue;
      const hull = convexHull(c.pts);
      if (hull.length < 4) continue;
      const q = fourFromHull(hull);
      if (!q) continue;
      const s = scoreQuad(q, w, h, blur);
      if (s > 0) candidates.push({ q, s, tag });
    }
  }

  // Screen = hole enclosed by a dark bezel ring. A notch belongs to the ring,
  // so the convex hull of the hole restores the full screen quad.
  {
    let ls = 0;
    for (let i = 0; i < blur.length; i++) ls += blur[i];
    const lm = ls / blur.length;
    const darkT = Math.min(70, lm - 25);
    const darkMask = new Uint8Array(w * h);
    for (let i = 0; i < blur.length; i++) darkMask[i] = blur[i] < darkT ? 1 : 0;
    const dcs = components(darkMask, w, h).sort((a, b) => b.area - a.area).slice(0, 4);
    for (const dc of dcs) {
      if (dc.area < w * h * 0.01) continue;
      const ring = new Uint8Array(w * h);
      for (const p of dc.pts) ring[p.y * w + p.x] = 1;
      const closed = closeHoles(ring, w, h);
      const holes = new Uint8Array(w * h);
      for (let i = 0; i < holes.length; i++) holes[i] = closed[i] && !ring[i] ? 1 : 0;
      const hcs = components(holes, w, h).sort((a, b) => b.area - a.area).slice(0, 1);
      for (const hc of hcs) {
        if (hc.area < w * h * 0.04) continue;
        const hull = convexHull(hc.pts);
        const q = fourFromHull(hull);
        if (!q) continue;
        const s = scoreQuad(q, w, h, blur);
        if (s > 0) candidates.push({ q, s: s * 1.6, tag: "bezel" });
      }
    }
  }
  considerMask(filled, "edges");

  // Also: brighter/active screen region vs dark bezel
  let lumaSum = 0;
  for (let i = 0; i < blur.length; i++) lumaSum += blur[i];
  const lumaMean = lumaSum / blur.length;
  const bright = new Uint8Array(w * h);
  const dark = new Uint8Array(w * h);
  for (let i = 0; i < blur.length; i++) {
    bright[i] = blur[i] > lumaMean + 12 ? 1 : 0;
    dark[i] = blur[i] < lumaMean - 15 ? 1 : 0;
  }
  considerMask(dilate(bright, w, h, 1), "bright");
  // Dark bezel ring: take dark components that look like a frame, use inner hole
  // More useful: variance / "not background" — pixels different from border color
  const borderSamples = [];
  for (let x = 0; x < w; x += 4) { borderSamples.push(blur[x], blur[(h - 1) * w + x]); }
  for (let y = 0; y < h; y += 4) { borderSamples.push(blur[y * w], blur[y * w + w - 1]); }
  borderSamples.sort((a, b) => a - b);
  const border = borderSamples[borderSamples.length >> 1];
  const fg = new Uint8Array(w * h);
  for (let i = 0; i < blur.length; i++) fg[i] = Math.abs(blur[i] - border) > 22 ? 1 : 0;
  considerMask(fg, "fg");

  // Green / chroma-key screen
  if (rgba) {
    const green = new Uint8Array(w * h);
    for (let i = 0, p = 0; i < rgba.length; i += 4, p++) {
      const r = rgba[i], gv = rgba[i + 1], b = rgba[i + 2], a = rgba[i + 3];
      green[p] = a > 16 && gv > 90 && gv > r + 40 && gv > b + 40 ? 1 : 0;
    }
    considerMask(dilate(green, w, h, 1), "chroma");
  }

  // White / near-white screen (in case the bezel ring is weak)
  {
    const white = new Uint8Array(w * h);
    for (let i = 0; i < blur.length; i++) white[i] = blur[i] > 200 ? 1 : 0;
    considerMask(dilate(white, w, h, 1), "white");
  }

  // Black screen inside a slightly lighter bezel: split a dark blob into ring + darker core
  {
    const darkT = Math.min(85, lumaMean - 18);
    const darkMask = new Uint8Array(w * h);
    for (let i = 0; i < blur.length; i++) darkMask[i] = blur[i] < darkT ? 1 : 0;
    const dcs = components(darkMask, w, h).sort((a, b) => b.area - a.area).slice(0, 4);
    for (const dc of dcs) {
      if (dc.area < w * h * 0.05) continue;
      if (dc.minX <= 1 && dc.minY <= 1 && dc.maxX >= w - 2 && dc.maxY >= h - 2 && dc.area > w * h * 0.85) continue;
      let minL = 255, maxL = 0;
      for (const pt of dc.pts) {
        const v = blur[pt.y * w + pt.x];
        if (v < minL) minL = v;
        if (v > maxL) maxL = v;
      }
      if (maxL - minL < 10) {
        // Uniform dark: still try the hull of the whole blob (bezel+screen). Weak candidate.
        const hull = convexHull(dc.pts);
        const q = fourFromHull(hull);
        if (q) {
          const s = scoreQuad(q, w, h, blur);
          if (s > 0) candidates.push({ q, s: s * 0.7, tag: "darkbody" });
        }
        continue;
      }
      // Otsu-ish split: darker pixels are the screen, lighter are the bezel
      const hist = new Float64Array(256);
      for (const pt of dc.pts) hist[Math.max(0, Math.min(255, Math.round(blur[pt.y * w + pt.x])))]++;
      let total = dc.pts.length, sum = 0;
      for (let i = 0; i < 256; i++) sum += i * hist[i];
      let wB = 0, sumB = 0, bestT = Math.round((minL + maxL) / 2), bestVar = -1;
      for (let t = 0; t < 256; t++) {
        wB += hist[t];
        if (!wB) continue;
        const wF = total - wB;
        if (!wF) break;
        sumB += t * hist[t];
        const mB = sumB / wB, mF = (sum - sumB) / wF;
        const v = wB * wF * (mB - mF) * (mB - mF);
        if (v > bestVar) { bestVar = v; bestT = t; }
      }
      const inner = new Uint8Array(w * h);
      let nInner = 0;
      for (const pt of dc.pts) {
        if (blur[pt.y * w + pt.x] <= bestT) { inner[pt.y * w + pt.x] = 1; nInner++; }
      }
      if (nInner > dc.area * 0.3 && nInner < dc.area * 0.97) {
        const before = candidates.length;
        considerMask(inner, "blackscreen");
        for (let i = before; i < candidates.length; i++) {
          if (candidates[i].tag === "blackscreen") candidates[i].s *= 2.0;
        }
      }
    }
  }

  // Transparent PNG: enclosed alpha hole (not the cutout around the device)
  let holeMode = false;
  if (alpha) {
    let trans = 0;
    for (let i = 0; i < alpha.length; i++) if (alpha[i] < 16) trans++;
    if (trans > w * h * 0.01) {
      const opaque = new Uint8Array(w * h);
      for (let i = 0; i < alpha.length; i++) opaque[i] = alpha[i] >= 16 ? 1 : 0;
      const closed = closeHoles(opaque, w, h);
      const holes = new Uint8Array(w * h);
      for (let i = 0; i < holes.length; i++) holes[i] = closed[i] && !opaque[i] ? 1 : 0;
      const hcs = components(holes, w, h).sort((a, b) => b.area - a.area);
      for (const hc of hcs.slice(0, 3)) {
        if (hc.area < w * h * 0.03) continue;
        const hull = convexHull(hc.pts);
        const q = fourFromHull(hull);
        if (!q) continue;
        const s = scoreQuad(q, w, h, blur);
        if (s > 0) {
          candidates.push({ q, s: s * 3.0, tag: "alpha" });
          holeMode = true;
        }
      }
    }
  }

  candidates.sort((a, b) => b.s - a.s);
  if (!candidates.length) return null;
  const containsQuad = (outer, inner) => {
    if (quadArea(inner) >= quadArea(outer) * 0.95) return false;
    return inner.every((p) => pointInQuad(p, outer));
  };
  for (let i = 0; i < Math.min(6, candidates.length); i++) {
    const outer = candidates[i];
    for (let j = 0; j < Math.min(10, candidates.length); j++) {
      if (i === j) continue;
      const inner = candidates[j];
      if (inner.s < outer.s * 0.4) continue;
      if (containsQuad(outer.q, inner.q)) inner.s = Math.max(inner.s, outer.s * 1.08);
    }
  }
  candidates.sort((a, b) => b.s - a.s);
  if (candidates[0].tag !== "alpha") holeMode = false;
  const amt = 3; // detection-space px, along outward edge normals toward the bezel
  const raw = candidates[0].q;
  const cx = (raw[0].x + raw[1].x + raw[2].x + raw[3].x) / 4;
  const cy = (raw[0].y + raw[1].y + raw[2].y + raw[3].y) / 4;
  const outward = (a, b) => {
    const dx = b.x - a.x, dy = b.y - a.y;
    let nx = dy, ny = -dx;
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    if (nx * (mx - cx) + ny * (my - cy) < 0) { nx = -nx; ny = -ny; }
    const len = Math.hypot(nx, ny) || 1;
    return { x: nx / len, y: ny / len };
  };
  const q = raw.map((p, i) => {
    const prev = raw[(i + 3) % 4], nxt = raw[(i + 1) % 4];
    const n1 = outward(prev, p), n2 = outward(p, nxt);
    let nx = n1.x + n2.x, ny = n1.y + n2.y;
    const len = Math.hypot(nx, ny) || 1;
    nx /= len; ny /= len;
    return { x: (p.x + nx * amt) / scale, y: (p.y + ny * amt) / scale };
  });
  return { quad: orderQuad(q), method: candidates[0].tag, score: candidates[0].s, holeMode };
}

function sampleBezelColor(img, quad) {
  const c = document.createElement("canvas");
  c.width = img.width; c.height = img.height;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, img.width, img.height).data;
  const acc = [0, 0, 0];
  let n = 0;
  const w = img.width, h = img.height;
  function inwardNormal(a, b) {
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    // rotate outward first, we'll sample both small offsets
    return { x: dy / len, y: -dx / len };
  }
  // Need outward from screen. Compute centroid
  const cx = (quad[0].x + quad[1].x + quad[2].x + quad[3].x) / 4;
  const cy = (quad[0].y + quad[1].y + quad[2].y + quad[3].y) / 4;
  for (let e = 0; e < 4; e++) {
    const a = quad[e], b = quad[(e + 1) % 4];
    let nx = 0, ny = 0;
    const midx = (a.x + b.x) / 2, midy = (a.y + b.y) / 2;
    const vx = midx - cx, vy = midy - cy;
    const len = Math.hypot(vx, vy) || 1;
    nx = vx / len; ny = vy / len;
    const steps = 24;
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const px = a.x + (b.x - a.x) * t + nx * 6;
      const py = a.y + (b.y - a.y) * t + ny * 6;
      const x = Math.round(px), y = Math.round(py);
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const i = (y * w + x) * 4;
      acc[0] += data[i]; acc[1] += data[i + 1]; acc[2] += data[i + 2];
      n++;
    }
  }
  if (!n) return [0, 0, 0];
  return [Math.round(acc[0] / n), Math.round(acc[1] / n), Math.round(acc[2] / n)];
}

/* ---------- UV mask: rounded rect + notch ---------- */

function sdRoundedBox(px, py, w, h, r) {
  const rx = clamp(r, 0, Math.min(w, h) / 2);
  const qx = Math.abs(px - w / 2) - (w / 2 - rx);
  const qy = Math.abs(py - h / 2) - (h / 2 - rx);
  const ax = Math.max(qx, 0), ay = Math.max(qy, 0);
  return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - rx;
}

function insideNotch(u, v, opts) {
  // u,v in 0..1 of full screen. Notch flush with top, centered.
  if (!opts.notchOn) return false;
  const nw = opts.notchW, nh = opts.notchH, nr = opts.notchR;
  const left = 0.5 - nw / 2;
  const right = 0.5 + nw / 2;
  if (u < left || u > right || v < 0 || v > nh) return false;
  // rounded bottom corners (and slightly the sides). Top is flush (v=0).
  const r = Math.min(nr, nw / 2, nh);
  const x = (u - left);
  const y = v;
  // box [0,nw] x [0,nh] with only bottom-left and bottom-right rounded
  if (y + r < nh) return true;
  if (x >= r && x <= nw - r) return true;
  if (x < r) {
    const dx = x - r, dy = y - (nh - r);
    return dx * dx + dy * dy <= r * r;
  }
  const dx = x - (nw - r), dy = y - (nh - r);
  return dx * dx + dy * dy <= r * r;
}

function screenCoverage(u, v, opts) {
  // returns: 0 outside rounded screen, 1 inside content, 2 notch
  const r = opts.cornerR; // in UV min-side units already converted? we'll pass as fraction of min side
  const sdf = sdRoundedBox(u, v, 1, 1, r);
  if (sdf > 0) return 0;
  if (insideNotch(u, v, opts)) return 2;
  return 1;
}

function currentOpts() {
  const padAll = Number($("padAll").value) / 100;
  const sides = $("padSidesOn").checked;
  return {
    notchOn: $("notchOn").checked,
    notchW: Number($("notchW").value) / 100,
    notchH: Number($("notchH").value) / 100,
    notchR: (Number($("notchR").value) / 100) * (Number($("notchW").value) / 100),
    notchColor: hexToRgb($("notchColor").value),
    notchColorAuto: $("notchColorAuto").checked,
    cornerR: Number($("cornerR").value) / 100,
    padL: padAll + (sides ? Number($("padL").value) / 100 : 0),
    padR: padAll + (sides ? Number($("padR").value) / 100 : 0),
    padT: padAll + (sides ? Number($("padT").value) / 100 : 0),
    padB: padAll + (sides ? Number($("padB").value) / 100 : 0),
    opacity: Number($("opacity").value) / 100,
    brightness: Number($("brightness").value) / 100,
    glareOn: $("glareOn").checked,
    showQuad: $("showQuad").checked,
    fitMode: ($("fitCover") && $("fitCover").checked) ? "cover" : "contain",
  };
}

function quadAspect(q) {
  const d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const w = (d(q[0], q[1]) + d(q[3], q[2])) / 2;
  const h = (d(q[0], q[3]) + d(q[1], q[2])) / 2;
  return w / Math.max(h, 1e-6);
}

/** Map content UV (0..1) to screenshot pixels. Cover crops from the TOP if the image is taller. */
function mapFit(cu, cv, Wi, Hi, screenAspect, mode) {
  const aImg = Wi / Math.max(Hi, 1e-6);
  const aScr = Math.max(screenAspect, 1e-6);
  if (mode === "contain") {
    let rw, rh, ox, oy;
    if (aImg > aScr) {
      rw = 1;
      rh = aScr / aImg;
      ox = 0;
      oy = (1 - rh) / 2;
    } else {
      rh = 1;
      rw = aImg / aScr;
      oy = 0;
      ox = (1 - rw) / 2;
    }
    if (cu < ox || cv < oy || cu > ox + rw || cv > oy + rh) return null;
    return { x: ((cu - ox) / rw) * (Wi - 1), y: ((cv - oy) / rh) * (Hi - 1) };
  }
  // cover, crop from top for tall images
  let visW, visH, srcX, srcY;
  if (aImg >= aScr) {
    visH = Hi;
    visW = visH * aScr;
    srcX = (Wi - visW) / 2;
    srcY = 0;
  } else {
    visW = Wi;
    visH = visW / aScr;
    srcX = 0;
    srcY = 0; // keep the top of a long landing page
  }
  return { x: srcX + cu * visW, y: srcY + cv * visH };
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex(rgb) {
  return "#" + rgb.map((v) => clamp(v, 0, 255).toString(16).padStart(2, "0")).join("");
}

/* ---------- compositing ---------- */

function getScreenSourceData(opts) {
  if (!state.screen) return null;
  const img = state.screen;
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  return { data: ctx.getImageData(0, 0, img.width, img.height).data, w: img.width, h: img.height };
}

function sampleBilinear(data, w, h, x, y) {
  if (x < 0 || y < 0 || x >= w - 1 || y >= h - 1) {
    const xi = clamp(Math.round(x), 0, w - 1);
    const yi = clamp(Math.round(y), 0, h - 1);
    const i = (yi * w + xi) * 4;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  }
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const fx = x - x0, fy = y - y0;
  const i00 = (y0 * w + x0) * 4;
  const i10 = i00 + 4;
  const i01 = i00 + w * 4;
  const i11 = i01 + 4;
  const out = [0, 0, 0, 0];
  const w00 = (1 - fx) * (1 - fy), w10 = fx * (1 - fy), w01 = (1 - fx) * fy, w11 = fx * fy;
  for (let c = 0; c < 4; c++) {
    out[c] = data[i00 + c] * w00 + data[i10 + c] * w10 + data[i01 + c] * w01 + data[i11 + c] * w11;
  }
  return out;
}

function pointInQuad(p, q) {
  // winding / barycentric via two triangles
  return tri(p, q[0], q[1], q[2]) || tri(p, q[0], q[2], q[3]);
}
function tri(p, a, b, c) {
  const s = (a.x - c.x) * (p.y - c.y) - (a.y - c.y) * (p.x - c.x);
  const t = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
  if ((s < 0) !== (t < 0) && s !== 0 && t !== 0) return false;
  const d = (c.x - b.x) * (p.y - b.y) - (c.y - b.y) * (p.x - b.x);
  return d === 0 || (d < 0) === (s + t <= 0);
}

function compositeToCanvas(targetCtx, destW, destH, view, highQuality) {
  const mock = state.mockup;
  if (!mock) return;
  targetCtx.clearRect(0, 0, destW, destH);
  // view: {scale, ox, oy} maps mockup pixels -> canvas
  const scale = view.scale, ox = view.ox, oy = view.oy;
  targetCtx.imageSmoothingEnabled = true;
  targetCtx.imageSmoothingQuality = "high";

  const q = state.quad;
  const holeMode = state.holeMode;
  if (!q || !state.screen) {
    targetCtx.drawImage(mock, ox, oy, mock.width * scale, mock.height * scale);
    if (q && currentOpts().showQuad) drawQuadOverlay(targetCtx, q, view);
    return;
  }

  const opts = currentOpts();
  const notchRgb = opts.notchColorAuto ? state.bezelColor : opts.notchColor;
  const src = getScreenSourceData(opts);
  const mockC = document.createElement("canvas");
  mockC.width = mock.width; mockC.height = mock.height;
  const mctx = mockC.getContext("2d", { willReadFrequently: true });
  mctx.drawImage(mock, 0, 0);
  const mockData = mctx.getImageData(0, 0, mock.width, mock.height).data;

  const srcPts = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
  const H = solveH(srcPts, q); // uv -> mockup px
  const Hi = invertH(H);
  if (!Hi) return;

  const minX = Math.max(0, Math.floor(Math.min(q[0].x, q[1].x, q[2].x, q[3].x) - 2));
  const maxX = Math.min(mock.width - 1, Math.ceil(Math.max(q[0].x, q[1].x, q[2].x, q[3].x) + 2));
  const minY = Math.max(0, Math.floor(Math.min(q[0].y, q[1].y, q[2].y, q[3].y) - 2));
  const maxY = Math.min(mock.height - 1, Math.ceil(Math.max(q[0].y, q[1].y, q[2].y, q[3].y) + 2));

  const step = highQuality ? 1 : Math.max(1, Math.round(1 / Math.min(scale, 1) / 1.2));
  const outC = document.createElement("canvas");
  outC.width = mock.width;
  outC.height = mock.height;
  const outCtx = outC.getContext("2d");
  const imgOut = outCtx.createImageData(mock.width, mock.height);
  const dst = imgOut.data;

  const brightAdd = opts.brightness * 255;
  const padL = opts.padL, padR = opts.padR, padT = opts.padT, padB = opts.padB;
  const contentW = Math.max(0.01, 1 - padL - padR);
  const contentH = Math.max(0.01, 1 - padT - padB);

  for (let y = minY; y <= maxY; y += step) {
    for (let x = minX; x <= maxX; x += step) {
      const uv = applyH(Hi, x + 0.5, y + 0.5);
      const u = uv.x, v = uv.y;
      if (u < 0 || v < 0 || u > 1 || v > 1) continue;
      const cov = screenCoverage(u, v, opts);
      let r, g, b, a = 255;
      if (cov === 0 || cov === 2) {
        // Notch, or the corner leftover of the old screenshot — fill with chёлка/рамка color
        r = notchRgb[0]; g = notchRgb[1]; b = notchRgb[2];
      } else {
        const cu = (u - padL) / contentW;
        const cv = (v - padT) / contentH;
        if (cu < 0 || cv < 0 || cu > 1 || cv > 1) {
          // inset margin — dark glass / bezel-adjacent
          r = 8; g = 8; b = 10;
        } else {
          const mapped = mapFit(cu, cv, src.w, src.h, quadAspect(q), opts.fitMode);
          if (!mapped) {
            r = 8; g = 8; b = 10;
          } else {
            const s = sampleBilinear(src.data, src.w, src.h, mapped.x, mapped.y);
            r = s[0] + brightAdd;
            g = s[1] + brightAdd;
            b = s[2] + brightAdd;
            a = s[3];
          }
        }
      }
      if (opts.glareOn) {
        const mi = (y * mock.width + x) * 4;
        const mr = mockData[mi], mg = mockData[mi + 1], mb = mockData[mi + 2], ma = mockData[mi + 3];
        const luma = 0.299 * mr + 0.587 * mg + 0.114 * mb;
        const hi = (holeMode || ma < 16) ? 0 : Math.max(0, (luma - 150) / 105);
        // generated sheen: diagonal soft light
        const sheen = Math.max(0, 1 - Math.hypot((u - 0.22) * 1.6, (v - 0.15) * 2.2)) * 0.16;
        const add = Math.min(1, hi * 0.85 + sheen);
        r = r + (255 - r) * add * 0.9;
        g = g + (255 - g) * add * 0.9;
        b = b + (255 - b) * add * 0.88;
      }
      r = clamp(r, 0, 255);
      g = clamp(g, 0, 255);
      b = clamp(b, 0, 255);
      const alpha = opts.opacity * (a / 255);
      const paint = (xx, yy) => {
        if (xx < 0 || yy < 0 || xx >= mock.width || yy >= mock.height) return;
        const o = (yy * mock.width + xx) * 4;
        dst[o] = r; dst[o + 1] = g; dst[o + 2] = b; dst[o + 3] = Math.round(alpha * 255);
        if (step > 1) {
          for (let dy = 0; dy < step; dy++) {
            for (let dx = 0; dx < step; dx++) {
              const px = xx + dx, py = yy + dy;
              if (px >= mock.width || py >= mock.height) continue;
              const p = (py * mock.width + px) * 4;
              dst[p] = r; dst[p + 1] = g; dst[p + 2] = b; dst[p + 3] = Math.round(alpha * 255);
            }
          }
        }
      };
      paint(x, y);
    }
  }
  outCtx.putImageData(imgOut, 0, 0);
  if (holeMode) {
    // Screenshot sits BEHIND a mockup whose screen is a transparent hole
    targetCtx.drawImage(outC, ox, oy, mock.width * scale, mock.height * scale);
    targetCtx.drawImage(mock, ox, oy, mock.width * scale, mock.height * scale);
  } else {
    targetCtx.drawImage(mock, ox, oy, mock.width * scale, mock.height * scale);
    targetCtx.drawImage(outC, ox, oy, mock.width * scale, mock.height * scale);
  }
  if (opts.showQuad) drawQuadOverlay(targetCtx, q, view);
}

function drawQuadOverlay(ctx, q, view) {
  const P = (p) => ({ x: p.x * view.scale + view.ox, y: p.y * view.scale + view.oy });
  const pts = q.map(P);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < 4; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  ctx.strokeStyle = "rgba(124,140,255,0.95)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  ctx.stroke();
  ctx.setLineDash([]);
  const labels = ["ЛВ", "ПВ", "ПН", "ЛН"];
  pts.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = i === state.dragging ? "#fff" : "#7c8cff";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0d0e12";
    ctx.stroke();
    ctx.fillStyle = "#c9ceff";
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText(labels[i], p.x + 10, p.y - 8);
  });
  ctx.restore();
}

function computeView(canvas, img) {
  const w = canvas.width, h = canvas.height;
  if (!img) return { scale: 1, ox: 0, oy: 0 };
  const pad = 36;
  const scale = Math.min((w - pad * 2) / img.width, (h - pad * 2) / img.height);
  const ox = (w - img.width * scale) / 2;
  const oy = (h - img.height * scale) / 2;
  return { scale, ox, oy };
}

function resizeCanvas() {
  const canvas = $("canvas");
  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
  requestDraw();
}

function requestDraw() {
  if (state.raf) cancelAnimationFrame(state.raf);
  state.raf = requestAnimationFrame(draw);
}

function draw() {
  state.raf = 0;
  const canvas = $("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!state.mockup) {
    ctx.fillStyle = "#8b91a5";
    ctx.font = "16px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Загрузите мокап или откройте «Пример с чёлкой»", canvas.width / 2, canvas.height / 2);
    return;
  }
  const view = computeView(canvas, state.mockup);
  compositeToCanvas(ctx, canvas.width, canvas.height, view, false);
  $("sizeHint").textContent = state.mockup.width + " × " + state.mockup.height;
}

/* ---------- demo fixture: MacBook-like photo with a notch already in the screen ---------- */

function makeDemoPair() {
  const W = 1400, H = 1000;
  const mock = document.createElement("canvas");
  mock.width = W; mock.height = H;
  const ctx = mock.getContext("2d");
  // desk
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#c9a07a");
  bg.addColorStop(1, "#8d6244");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 4000; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 2 + Math.random() * 4, 1);
  }

  // Perspective screen quad (ground truth) — slightly yawed laptop
  const quad = [
    { x: 280, y: 170 },
    { x: 1160, y: 150 },
    { x: 1185, y: 720 },
    { x: 250, y: 710 },
  ];
  // bezel (expand quad a bit along normals from centroid)
  const cx = (quad[0].x + quad[1].x + quad[2].x + quad[3].x) / 4;
  const cy = (quad[0].y + quad[1].y + quad[2].y + quad[3].y) / 4;
  function expand(q, amt) {
    return q.map((p) => {
      const vx = p.x - cx, vy = p.y - cy;
      const len = Math.hypot(vx, vy) || 1;
      return { x: p.x + (vx / len) * amt, y: p.y + (vy / len) * amt };
    });
  }
  const body = expand(quad, 70);
  const bezel = expand(quad, 28);

  function fillQuad(pts, color) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }
  // shadow
  ctx.save();
  ctx.transform(1, 0, 0.15, 0.55, 40, 420);
  fillQuad(body, "rgba(0,0,0,0.28)");
  ctx.restore();
  fillQuad(body, "#d9dce3");
  fillQuad(bezel, "#141414");

  // Existing wallpaper on the screen, WITH a notch already cut out (black)
  const srcPts = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
  const Hm = solveH(srcPts, quad);
  const Hi = invertH(Hm);
  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  const demoOpts = { notchOn: true, notchW: 0.18, notchH: 0.055, notchR: 0.07, cornerR: 0.035 };
  for (let y = 120; y < 760; y++) {
    for (let x = 220; x < 1240; x++) {
      const uv = applyH(Hi, x + 0.5, y + 0.5);
      if (uv.x < 0 || uv.y < 0 || uv.x > 1 || uv.y > 1) continue;
      const cov = screenCoverage(uv.x, uv.y, demoOpts);
      const i = (y * W + x) * 4;
      if (cov === 0) continue;
      if (cov === 2) {
        d[i] = 8; d[i + 1] = 8; d[i + 2] = 8; d[i + 3] = 255;
        continue;
      }
      // "old" wallpaper — teal/orange so it's obvious when replaced
      const u = uv.x, v = uv.y;
      d[i] = Math.round(40 + 180 * u);
      d[i + 1] = Math.round(90 + 80 * (1 - v));
      d[i + 2] = Math.round(160 + 50 * v);
      d[i + 3] = 255;
      // faint window highlight already on the glass
      const sheen = Math.max(0, 1 - Math.hypot((u - 0.25) * 1.8, (v - 0.18) * 2.4));
      const add = sheen * 70;
      d[i] = clamp(d[i] + add, 0, 255);
      d[i + 1] = clamp(d[i + 1] + add, 0, 255);
      d[i + 2] = clamp(d[i + 2] + add * 0.9, 0, 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  // camera dot in the existing notch
  const topMid = applyH(Hm, 0.5, 0.028);
  ctx.beginPath();
  ctx.arc(topMid.x, topMid.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#2a2a2a";
  ctx.fill();

  const mockImg = canvasToImage(mock);

  // Screen content to place: a fake UI
  const sc = document.createElement("canvas");
  sc.width = 1440; sc.height = 900;
  const s = sc.getContext("2d");
  s.fillStyle = "#0f1220";
  s.fillRect(0, 0, 1440, 900);
  s.fillStyle = "#1a1f35";
  s.fillRect(0, 0, 220, 900);
  s.fillStyle = "#7c8cff";
  s.fillRect(0, 0, 4, 900);
  s.fillStyle = "#f2f3f7";
  s.font = "600 36px system-ui, sans-serif";
  s.fillText("Ареал — кабинет", 260, 80);
  s.fillStyle = "#9aa0b2";
  s.font = "22px system-ui, sans-serif";
  s.fillText("Сегодня · курсы и практика", 260, 118);
  const cards = ["#7c8cff", "#5bd0a8", "#f5c26b", "#ff8fab"];
  cards.forEach((col, i) => {
    const x = 260 + (i % 2) * 540;
    const y = 180 + Math.floor(i / 2) * 300;
    s.fillStyle = "#1b1e2c";
    roundRect(s, x, y, 500, 260, 24);
    s.fill();
    s.fillStyle = col;
    roundRect(s, x, y, 8, 260, 0);
    s.fill();
    s.fillStyle = "#fff";
    s.font = "600 26px system-ui, sans-serif";
    s.fillText(["Прогресс", "Задания", "Расписание", "Сообщения"][i], x + 36, y + 60);
    s.fillStyle = "#9aa0b2";
    s.font = "18px system-ui, sans-serif";
    s.fillText("Карточка интерфейса для проверки посадки экрана", x + 36, y + 100);
  });
  const screenImg = canvasToImage(sc);
  return Promise.all([mockImg, screenImg]).then(([m, scr]) => ({ mockup: m, screen: scr, truth: quad }));
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function canvasToImage(c) {
  return new Promise((res) => {
    const im = new Image();
    im.onload = () => res(im);
    im.src = c.toDataURL("image/png");
  });
}

/* ---------- UI wiring ---------- */

function bindDrop(zone, input, onImg, which) {
  const open = () => input.click();
  const focusZone = () => {
    state.lastFocus = which;
    $("dropMockup").classList.toggle("active", which === "mockup");
    $("dropScreen").classList.toggle("active", which === "screen");
  };
  zone.addEventListener("click", () => { focusZone(); open(); });
  zone.addEventListener("focus", focusZone);
  zone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") open(); });
  zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("dragover"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("dragover");
    focusZone();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) loadFile(f, onImg);
  });
  input.addEventListener("change", () => {
    if (input.files && input.files[0]) loadFile(input.files[0], onImg);
    input.value = "";
  });
}

function loadFile(file, onImg) {
  const url = URL.createObjectURL(file);
  const im = new Image();
  im.onload = () => { URL.revokeObjectURL(url); onImg(im); };
  im.onerror = () => setStatus("Не удалось прочитать изображение.", "err");
  im.src = url;
}

function setThumb(el, img) {
  const c = document.createElement("canvas");
  c.width = 160; c.height = 88;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#1a1b21";
  ctx.fillRect(0, 0, c.width, c.height);
  for (let y = 0; y < c.height; y += 8)
    for (let x = 0; x < c.width; x += 8)
      if (((x + y) / 8) % 2 === 0) { ctx.fillStyle = "#24252d"; ctx.fillRect(x, y, 8, 8); }
  const s = Math.max(c.width / img.width, c.height / img.height);
  const w = img.width * s, h = img.height * s;
  ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
  el.style.backgroundImage = `url(${c.toDataURL("image/png")})`;
}

function onMockup(img) {
  state.mockup = img;
  setThumb($("thumbMockup"), img);
  autoDetect();
  updateExportHint();
  requestDraw();
}

function onScreen(img) {
  state.screen = img;
  setThumb($("thumbScreen"), img);
  requestDraw();
}

function autoDetect() {
  if (!state.mockup) return;
  const res = detectScreen(state.mockup);
  if (!res) {
    state.quad = defaultQuad(state.mockup);
    state.holeMode = false;
    setStatus("Экран не найден автоматически. Укажите 4 угла вручную.", "err");
  } else {
    state.quad = res.quad;
    state.holeMode = !!res.holeMode;
    state.bezelColor = sampleBezelColor(state.mockup, state.quad);
    if ($("notchColorAuto").checked) $("notchColor").value = rgbToHex(state.bezelColor);
    const methods = { bezel: "внутри рамки", edges: "по контуру", bright: "по яркой области", fg: "по контрасту с фоном", chroma: "по зелёному экрану", white: "по белому экрану", blackscreen: "по тёмному экрану", alpha: "по прозрачному отверстию", darkbody: "по тёмной области" };
    const holeNote = state.holeMode ? " Макет будет положен под мокап (экран — прозрачное отверстие)." : "";
    setStatus("Экран найден (" + (methods[res.method] || res.method) + "). Чёлка в фото, если есть, включена в полный четырёхугольник." + holeNote, "ok");
  }
  requestDraw();
}

function defaultQuad(img) {
  const m = 0.18;
  return [
    { x: img.width * m, y: img.height * m },
    { x: img.width * (1 - m), y: img.height * m },
    { x: img.width * (1 - m), y: img.height * (1 - m) },
    { x: img.width * m, y: img.height * (1 - m) },
  ];
}

function updateLabels() {
  $("notchWVal").textContent = fmtPct($("notchW").value);
  $("notchHVal").textContent = fmtPct($("notchH").value);
  $("notchRVal").textContent = fmtPct($("notchR").value, 0);
  $("cornerRVal").textContent = fmtPct($("cornerR").value);
  $("padAllVal").textContent = fmtPct($("padAll").value);
  $("padLVal").textContent = fmtPct($("padL").value);
  $("padRVal").textContent = fmtPct($("padR").value);
  $("padTVal").textContent = fmtPct($("padT").value);
  $("padBVal").textContent = fmtPct($("padB").value);
  $("opacityVal").textContent = fmtPct($("opacity").value, 0);
  const b = Number($("brightness").value);
  $("brightnessVal").textContent = (b > 0 ? "+" : "") + b;
  $("padSides").style.opacity = $("padSidesOn").checked ? "1" : "0.45";
}

function hookControls() {
  const ids = ["notchOn","notchW","notchH","notchR","notchColor","notchColorAuto","cornerR","padAll","padSidesOn","padL","padR","padT","padB","opacity","brightness","glareOn","showQuad","fitCover","fitContain","exportSize","fmtPng","fmtJpg"];
  ids.forEach((id) => {
    if (!$(id)) return;
    $(id).addEventListener("input", () => { updateLabels(); requestDraw(); });
    $(id).addEventListener("change", () => { updateLabels(); updateExportHint(); requestDraw(); });
  });
  $("notchColorAuto").addEventListener("change", () => {
    if ($("notchColorAuto").checked && state.quad && state.mockup) {
      state.bezelColor = sampleBezelColor(state.mockup, state.quad);
      $("notchColor").value = rgbToHex(state.bezelColor);
    }
    requestDraw();
  });
}

function canvasPointToMockup(ev) {
  const canvas = $("canvas");
  const rect = canvas.getBoundingClientRect();
  const dpr = canvas.width / rect.width;
  const x = (ev.clientX - rect.left) * dpr;
  const y = (ev.clientY - rect.top) * dpr;
  if (!state.mockup) return null;
  const view = computeView(canvas, state.mockup);
  return { x: (x - view.ox) / view.scale, y: (y - view.oy) / view.scale, view };
}

function nearestCorner(pt) {
  if (!state.quad) return null;
  let best = -1, dist = 28 / (computeView($("canvas"), state.mockup).scale);
  state.quad.forEach((p, i) => {
    const d = Math.hypot(p.x - pt.x, p.y - pt.y);
    if (d < dist) { dist = d; best = i; }
  });
  return best >= 0 ? best : null;
}

function bindCanvas() {
  const canvas = $("canvas");
  canvas.addEventListener("pointerdown", (e) => {
    if (!state.mockup) return;
    const pt = canvasPointToMockup(e);
    if (state.clickCorners) {
      state.clickCorners.push({ x: pt.x, y: pt.y });
      if (state.clickCorners.length === 4) {
        state.quad = orderQuad(state.clickCorners);
        state.bezelColor = sampleBezelColor(state.mockup, state.quad);
        if ($("notchColorAuto").checked) $("notchColor").value = rgbToHex(state.bezelColor);
        state.clickCorners = null;
        setStatus("Углы экрана заданы вручную.", "ok");
      } else {
        setStatus("Угол " + state.clickCorners.length + " из 4. Кликните следующий угол по часовой стрелке, начиная с левого верхнего.", "");
      }
      requestDraw();
      return;
    }
    const i = nearestCorner(pt);
    if (i == null) return;
    state.dragging = i;
    canvas.setPointerCapture(e.pointerId);
    requestDraw();
  });
  canvas.addEventListener("pointermove", (e) => {
    if (state.dragging == null || !state.quad) return;
    const pt = canvasPointToMockup(e);
    state.quad[state.dragging] = { x: pt.x, y: pt.y };
    requestDraw();
  });
  const end = (e) => {
    if (state.dragging != null && state.mockup && state.quad) {
      state.bezelColor = sampleBezelColor(state.mockup, state.quad);
      if ($("notchColorAuto").checked) $("notchColor").value = rgbToHex(state.bezelColor);
    }
    state.dragging = null;
    requestDraw();
  };
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);
}

function sourceLongSide() {
  if (!state.mockup) return 2048;
  return Math.max(state.mockup.width, state.mockup.height);
}

function exportLongSide() {
  const src = sourceLongSide();
  const sel = $("exportSize") ? $("exportSize").value : "auto";
  const n = sel === "auto" ? src : Number(sel);
  return Math.min(2048, Math.max(1, Math.round(n || src)));
}

function updateExportHint() {
  if (!$("exportHint") || !state.mockup) return;
  const auto = Math.min(2048, sourceLongSide());
  const opt = $("exportSize") && $("exportSize").querySelector('option[value="auto"]');
  if (opt) opt.textContent = "Авто (" + auto + " px, до 2K)";
  $("exportHint").textContent = "По умолчанию — " + auto + " px (минимум из длинной стороны исходника и 2048). Жёсткий максимум — 2048 px. Рендер идёт с исходного разрешения, не с превью.";
  if ($("btnDownload")) $("btnDownload").textContent = exportFormat() === "jpg" ? "Скачать JPG" : "Скачать PNG";
}

function renderExportCanvas(longSide, format) {
  if (!state.mockup) return null;
  const targetLong = Math.min(2048, Math.round(longSide || exportLongSide()));
  const fmt = format || exportFormat();
  const full = document.createElement("canvas");
  full.width = state.mockup.width;
  full.height = state.mockup.height;
  const ctx = full.getContext("2d");
  const prevShow = $("showQuad") ? $("showQuad").checked : false;
  if ($("showQuad")) $("showQuad").checked = false;
  // Off-screen render at the original mockup resolution, then scale to the export size
  compositeToCanvas(ctx, full.width, full.height, { scale: 1, ox: 0, oy: 0 }, true);
  if ($("showQuad")) $("showQuad").checked = prevShow;
  const srcLong = Math.max(full.width, full.height);
  const sizeOk = srcLong === targetLong;
  const out = sizeOk ? full : document.createElement("canvas");
  if (!sizeOk) {
    if (full.width >= full.height) {
      out.width = targetLong;
      out.height = Math.max(1, Math.round(full.height * targetLong / full.width));
    } else {
      out.height = targetLong;
      out.width = Math.max(1, Math.round(full.width * targetLong / full.height));
    }
  }
  if (!sizeOk || fmt === "jpg") {
    const dest = sizeOk ? document.createElement("canvas") : out;
    if (sizeOk) { dest.width = full.width; dest.height = full.height; }
    const octx = dest.getContext("2d");
    octx.imageSmoothingEnabled = true;
    octx.imageSmoothingQuality = "high";
    if (fmt === "jpg") {
      octx.fillStyle = "#1c1d22";
      octx.fillRect(0, 0, dest.width, dest.height);
    }
    octx.drawImage(sizeOk ? full : full, 0, 0, dest.width, dest.height);
    return dest;
  }
  return out;
}

function exportFormat() {
  return ($("fmtJpg") && $("fmtJpg").checked) ? "jpg" : "png";
}

async function downloadExport() {
  if (!state.mockup) return;
  const c = renderExportCanvas(exportLongSide());
  if (!c) return;
  requestDraw();
  const fmt = exportFormat();
  const a = document.createElement("a");
  a.download = "mockup-screen." + (fmt === "jpg" ? "jpg" : "png");
  a.href = fmt === "jpg" ? c.toDataURL("image/jpeg", 0.92) : c.toDataURL("image/png");
  a.click();
}

function bindPaste() {
  document.addEventListener("paste", (e) => {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    let file = null;
    for (const it of items) {
      if (it.type && it.type.startsWith("image/")) { file = it.getAsFile(); break; }
    }
    if (!file) return;
    e.preventDefault();
    const active = document.activeElement;
    let target = null;
    if (active === $("dropScreen") || state.lastFocus === "screen") target = onScreen;
    else if (active === $("dropMockup") || state.lastFocus === "mockup") target = onMockup;
    else target = state.mockup && !state.screen ? onScreen : onMockup;
    loadFile(file, target);
    setStatus("Изображение вставлено из буфера.", "ok");
  });
}

function init() {
  bindDrop($("dropMockup"), $("fileMockup"), onMockup, "mockup");
  bindDrop($("dropScreen"), $("fileScreen"), onScreen, "screen");
  hookControls();
  bindCanvas();
  bindPaste();
  updateLabels();
  updateExportHint();
  $("btnDetect").addEventListener("click", () => {
    if (!state.mockup) { setStatus("Сначала загрузите мокап.", "err"); return; }
    autoDetect();
  });
  $("btnManual").addEventListener("click", () => {
    if (!state.mockup) { setStatus("Сначала загрузите мокап.", "err"); return; }
    state.clickCorners = [];
    setStatus("Кликните 4 угла экрана: левый верхний, правый верхний, правый нижний, левый нижний.", "");
  });
  $("btnResetQuad").addEventListener("click", () => {
    if (!state.mockup) return;
    autoDetect();
  });
  $("btnDemo").addEventListener("click", async () => {
    setStatus("Собираю пример ноутбука с чёлкой…");
    const demo = await makeDemoPair();
    state.mockup = demo.mockup;
    state.screen = demo.screen;
    setThumb($("thumbMockup"), demo.mockup);
    setThumb($("thumbScreen"), demo.screen);
    $("notchOn").checked = true;
    $("cornerR").value = "3.5";
    $("padAll").value = "1.2";
    $("glareOn").checked = true;
    updateLabels();
    autoDetect();
    // Keep detected quad (should include notch). If detection is poor, fall back to truth.
    if (state.quad) {
      const iou = quadIoU(state.quad, demo.truth);
      if (iou < 0.85) {
        state.quad = demo.truth;
        state.bezelColor = sampleBezelColor(state.mockup, state.quad);
        setStatus("Пример загружен. Автопоиск был неточен, подставлен полный контур экрана (включая чёлку).", "");
      }
    }
    requestDraw();
  });
  $("btnDownload").addEventListener("click", downloadExport);
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
}

function quadIoU(a, b) {
  // coarse raster IoU
  const xs = [...a, ...b].map((p) => p.x);
  const ys = [...a, ...b].map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const w = Math.max(1, maxX - minX), h = Math.max(1, maxY - minY);
  let inter = 0, uni = 0;
  const N = 48;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const p = { x: minX + (i + 0.5) * w / N, y: minY + (j + 0.5) * h / N };
      const inA = pointInQuad(p, a), inB = pointInQuad(p, b);
      if (inA || inB) uni++;
      if (inA && inB) inter++;
    }
  }
  return uni ? inter / uni : 0;
}

window.addEventListener("DOMContentLoaded", init);

// Expose for verification scripts
window.MockupFitter = {
  state, detectScreen, sampleBezelColor, makeDemoPair, currentOpts,
  compositeToCanvas, solveH, invertH, applyH, screenCoverage, orderQuad, quadIoU, convexHull,
  renderExportCanvas, exportLongSide, exportFormat, mapFit, quadAspect, loadFile, onMockup, onScreen,
};
