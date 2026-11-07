// Interior corridor backdrop for the WEmart page, ported as-is from the design's
// buildInterior() (design_handoff_wemart_site/reference/WEmart v5.dc.html).
// A one-point-perspective convenience-store aisle: wood ceiling, tiled floor, freezer
// wall (left), shelf wall (right), back counter. A seeded PRNG keeps the products
// deterministic, so server and client render identical markup.

/** @returns {string} SVG markup (built only from constants, no user input) */
export function buildInteriorSvg() {
  const W = 1600, bx0 = 650, bx1 = 950, by0 = 420, by1 = 625, ink = '#5a4636';
  let sd = 11; const rnd = () => ((sd = (sd * 9301 + 49297) % 233280) / 233280);
  const lerp = (a, b, t) => a + (b - a) * t;
  const yT = (x) => -20 + x * (by0 + 20) / bx0, yB = (x) => 1010 - x * (1010 - by1) / bx0;
  const pts = (a) => a.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const poly = (a, fill, ex) => `<polygon points="${pts(a)}" fill="${fill}" ${ex || ''}/>`;
  const pt = (side, xa, xb, u, v) => { const x = lerp(xa, xb, u); return [side === 'L' ? x : W - x, lerp(yT(x), yB(x), v)]; };
  const quad = (s, xa, xb, u0, u1, v0, v1) => [pt(s, xa, xb, u0, v0), pt(s, xa, xb, u1, v0), pt(s, xa, xb, u1, v1), pt(s, xa, xb, u0, v1)];
  const line = 'stroke="' + ink + '" stroke-width="1.3" stroke-opacity=".55" stroke-linejoin="round"';
  const row = (s, xa, xb, v0, v1, n, cols) => {
  let o = '';
  for (let i = 0; i < n; i++) {
  const u0 = i / n + 0.012, u1 = (i + 1) / n - 0.012, hh = 0.55 + rnd() * 0.42, c = cols[Math.floor(rnd() * cols.length)];
  const vt = v1 - (v1 - v0) * hh, w = u1 - u0;
  o += poly(quad(s, xa, xb, u0, u1, vt, v1), c, line);
  o += poly(quad(s, xa, xb, u0 + w * 0.15, u1 - w * 0.15, vt + (v1 - vt) * 0.35, vt + (v1 - vt) * 0.72), 'rgba(255,250,235,.72)');
  if (rnd() < 0.35) o += poly(quad(s, xa, xb, u0 + w * 0.3, u1 - w * 0.3, vt - (v1 - v0) * 0.06, vt), '#f4ecd6', line);
  }
  return o;
  };
  const colL = ['#86c5b6', '#e8c85a', '#8eb3e3', '#f2e3b8', '#a2c2de', '#c9a0c0', '#b4d49a'];
  const colR = ['#7fa9df', '#e8a23c', '#f0c94a', '#87a9d6', '#e7869b', '#8fb7a0', '#79a1d5', '#f2e3b8', '#e9d6a6'];
  let o = '';
  o += poly([[0, -20], [1600, -20], [bx1, by0], [bx0, by0]], 'url(#wood)');
  for (let i = 0; i <= 10; i++) o += `<line x1="${bx0 + 300 * i / 10}" y1="${by0}" x2="${1600 * i / 10}" y2="-20" stroke="#6b4426" stroke-width="2" stroke-opacity=".4"/>`;
  for (let i = 0; i < 7; i++) { const x = 100 + rnd() * 1400; o += poly([[x, -20], [x + 60 + rnd() * 80, -20], [lerp(x, 800, .6) + 40, 380], [lerp(x, 800, .6), 380]], 'rgba(120,70,30,.16)', 'filter="url(#soft)"'); }
  o += poly([[0, 1010], [1600, 1010], [bx1, by1], [bx0, by1]], 'url(#floor)');
  for (let i = 1; i < 8; i++) o += `<line x1="${bx0 + 300 * i / 8}" y1="${by1}" x2="${1600 * i / 8}" y2="1010" stroke="${ink}" stroke-width="1.6" stroke-opacity=".4"/>`;
  for (let k = 1; k < 10; k++) { const y = by1 + 385 * k * k / 81, t = (y - by1) / 385, x0 = lerp(bx0, 0, t), x1 = lerp(bx1, 1600, t); o += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${ink}" stroke-width="1.6" stroke-opacity=".4"/>`; }
  o += poly([[250, 1010], [430, 1010], [745, by1], [722, by1]], 'rgba(232,170,110,.32)', 'filter="url(#soft)"');
  o += poly([[900, 1010], [1100, 1010], [880, by1], [858, by1]], 'rgba(150,190,220,.3)', 'filter="url(#soft)"');
  o += poly([[1250, 1010], [1500, 1010], [940, by1], [915, by1]], 'rgba(240,150,120,.25)', 'filter="url(#soft)"');
  o += `<rect x="${bx0}" y="${by0}" width="300" height="${by1 - by0}" fill="#efe6cc" ${line}/>`;
  const tc = ['#3f9a7a', '#f0c94a', '#7fa9df', '#94bddb', '#f4ecd6', '#7fa9df', '#3f9a7a'];
  for (let i = 0; i < 7; i++) o += `<rect x="${bx0 + i * 300 / 7}" y="${by0}" width="${300 / 7}" height="44" fill="${tc[i]}" ${line}/><rect x="${bx0 + i * 300 / 7 + 6}" y="${by0 + 10}" width="${300 / 7 - 12}" height="16" fill="rgba(255,250,235,.8)"/>`;
  o += `<rect x="${bx0 + 14}" y="${by0 + 52}" width="272" height="${by1 - by0 - 52}" fill="#f7efd8" ${line}/>`;
  for (let r = 0; r < 3; r++) { o += `<rect x="${bx0 + 90}" y="${by0 + 62 + r * 24}" width="190" height="6" fill="#c9a679" opacity=".7"/>`; for (let i = 0; i < 16; i++) o += `<rect x="${bx0 + 92 + i * 11.5}" y="${by0 + 62 + r * 24 - 12}" width="9" height="12" fill="${colR[(i + r * 3) % colR.length]}" opacity=".85"/>`; }
  o += `<rect x="${bx0 + 22}" y="${by0 + 62}" width="52" height="90" fill="#e9dcb6" ${line}/><rect x="${bx0 + 30}" y="${by0 + 70}" width="36" height="22" fill="#e8c85a"/>`;
  o += poly([[bx0, by1], [bx1, by1], [bx1 + 6, by1 + 14], [bx0 - 6, by1 + 14]], '#c9a679', line);
  o += poly([[bx0 - 6, by1 + 14], [bx1 + 6, by1 + 14], [bx1 + 4, by1 + 4], [bx0 - 4, by1 + 4]], 'rgba(255,255,255,.35)');
  // left freezers
  const xs = [0, 150, 300, 430, 530, 600, 650];
  o += poly([[0, -20], [bx0, by0], [bx0, by1], [0, 1010]], '#b88a5c');
  for (let i = 0; i < 6; i++) {
  const xa = xs[i], xb = xs[i + 1], s = 'L', n = Math.max(3, Math.round((xb - xa) / 21));
  o += poly(quad(s, xa, xb, .06, .94, .02, .16), '#cfe4ee', 'stroke="#8b5e3c" stroke-width="3"');
  o += poly(quad(s, xa, xb, .06, .5, .02, .16), 'rgba(255,255,255,.45)');
  o += poly(quad(s, xa, xb, 0, 1, .16, .2), '#a8774a', line);
  o += poly(quad(s, xa, xb, 0, 1, .2, .9), '#dcebe9', 'stroke="#7d8e94" stroke-width="3.5"');
  for (let r = 0; r < 4; r++) { const va = .235 + r * .16; o += row(s, xa, xb, va, va + .14, n, colL); o += poly(quad(s, xa, xb, .03, .97, va + .14, va + .158), '#b9cbcc', line); }
  o += poly(quad(s, xa, xb, .1, .55, .22, .5), 'rgba(255,255,255,.28)');
  o += poly(quad(s, xa, xb, .88, .92, .45, .66), '#7a8a90');
  o += poly(quad(s, xa, xb, 0, 1, .9, 1), '#9fb4c0', line);
  }
  // right shelves
  const xr = [0, 200, 360, 480, 560, 615, 650];
  o += poly([[1600, -20], [bx1, by0], [bx1, by1], [1600, 1010]], '#c9b79a');
  for (let i = 0; i < 6; i++) {
  const xa = xr[i], xb = xr[i + 1], s = 'R', n = Math.max(3, Math.round((xb - xa) / 17));
  o += poly(quad(s, xa, xb, 0, 1, 0, .2), i % 2 ? '#d7ead0' : '#c79b6a', 'stroke="#8b5e3c" stroke-width="3"');
  if (i % 2 === 0) o += poly(quad(s, xa, xb, .12, .88, .03, .17), '#d4e3c2', line);
  o += poly(quad(s, xa, xb, 0, 1, .2, .225), '#ecdcae', line);
  o += poly(quad(s, xa, xb, 0, 1, .225, .87), '#e4eef0', 'stroke="#8a9aa0" stroke-width="3"');
  for (let r = 0; r < 5; r++) { const va = .24 + r * .125; o += row(s, xa, xb, va, va + .108, n, colR); o += poly(quad(s, xa, xb, 0, 1, va + .108, va + .125), '#c3d6de', line); o += poly(quad(s, xa, xb, 0, 1, va + .118, va + .125), '#8fa5b0'); }
  o += poly(quad(s, xa, xb, 0, 1, .87, .93), '#9cb4d3', line);
  o += poly(quad(s, xa, xb, 0, 1, .93, 1), '#a9a49e', line);
  }
  // back stand + tubes + junction lines
  o += `<rect x="${bx0 + 52}" y="${by1 - 70}" width="46" height="70" fill="#f4ecd6" ${line}/><rect x="${bx0 + 56}" y="${by1 - 52}" width="38" height="30" fill="#e8c85a" ${line}/>`;
  o += `<ellipse cx="800" cy="70" rx="90" ry="150" fill="rgba(235,248,255,.5)" filter="url(#soft)"/><rect x="781" y="-10" width="38" height="140" rx="16" fill="#eef8fc" stroke="#5b7e91" stroke-width="2.5"/><line x1="800" y1="130" x2="800" y2="180" stroke="${ink}" stroke-width="2"/><rect x="790" y="180" width="20" height="70" rx="9" fill="#eef8fc" stroke="#5b7e91" stroke-width="2"/>`;
  o += `<ellipse cx="800" cy="570" rx="260" ry="190" fill="url(#glow)"/>`;
  [[0, -20, bx0, by0], [1600, -20, bx1, by0], [0, 1010, bx0, by1], [1600, 1010, bx1, by1]].forEach(([a, b, c, d]) => { o += `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${ink}" stroke-width="3" stroke-opacity=".7"/>`; });
  // foreground blue crate
  o += poly([[0, 880], [150, 850], [170, 1010], [0, 1010]], '#89a5ca', 'stroke="#2f4f7a" stroke-width="2.5"');
  o += poly([[0, 880], [150, 850], [150, 870], [0, 900]], '#9cb6da');
  const defs = `<defs><filter id="wcw" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="3" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7"/></filter><filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter><filter id="blot" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".005 .009" numOctaves="4" seed="9"/><feColorMatrix values="0 0 0 0 .38 0 0 0 0 .27 0 0 0 0 .16 1.7 0 0 0 -.62"/></filter><linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a35"/><stop offset="1" stop-color="#d9ab70"/></linearGradient><linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7f1de"/><stop offset=".5" stop-color="#efe6cb"/><stop offset="1" stop-color="#e3d6b6"/></linearGradient><radialGradient id="glow"><stop offset="0" stop-color="rgba(255,248,225,.6)"/><stop offset="1" stop-color="rgba(255,248,225,0)"/></radialGradient></defs>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block">${defs}<g filter="url(#wcw)">${o}</g><rect width="1600" height="1000" filter="url(#blot)" opacity=".4"/></svg>`;
}
