'use strict';
/* ===========================================================
   გეოდაფა — script.js
   თანამშრომლობითი გეომეტრიის დაფა. სინქრონიზაცია ხდება პირდაპირ
   ბრაუზერებს შორის (WebRTC/PeerJS) — უსერვერო არქიტექტურა.
   =========================================================== */

/* ---------- მუდმივები ---------- */
const GRID_SIZE = 40;
const NAME_COLORS = ['#E3AE3F', '#E88C6E', '#6FA8C9', '#A08FC9', '#6FBFA0', '#D97DA6'];
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CURSOR_THROTTLE_MS = 45;
const PREVIEW_THROTTLE_MS = 50;
const SAVE_DEBOUNCE_MS = 800;
const IMAGE_MAX_DIM = 1000;
const IMAGE_PLACED_DIM = 320;
const ACCENT_COLOR = '#E3AE3F';

const TOOLS = {
  select:   { kind: 'select' },
  pen:      { kind: 'drag' },
  eraser:   { kind: 'erase' },
  line:     { kind: 'drag' },
  rect:     { kind: 'drag' },
  circle:   { kind: 'drag' },
  triangle: { kind: 'multiclick', maxPoints: 3 },
  polygon:  { kind: 'multiclick', maxPoints: Infinity },
  angle:    { kind: 'multiclick', maxPoints: 3 },
  point:    { kind: 'click' },
  text:     { kind: 'click' },
};

/* ---------- DOM / გლობალები ---------- */
let canvas, ctx, boardWrap;
const els = {};

const state = {
  tool: 'pen',
  color: '#2B2B2B',
  strokeWidth: 3,
  showGrid: true,
  snapToGrid: false,
  showMeasurements: true,
  objects: new Map(),
  selectedId: null,
  pointCounter: 0,
  dpr: window.devicePixelRatio || 1,
  cssWidth: 0,
  cssHeight: 0,
};

const net = {
  peer: null,
  myId: null,
  roomId: null,
  isHost: false,
  connections: new Map(),
  users: new Map(),
  myName: '',
  myColor: '',
  receivedFirstWelcome: false,
};

const draft = {
  active: false,
  mode: null,
  tool: null,
  startPoint: null,
  currentObject: null,
  polygonPoints: null,
  multiclickTool: null,
  mousePoint: null,
  dragOrigin: null,
  objOriginFull: null,
};

const hist = { undo: [], redo: [] };
const remoteCursors = new Map();
const remoteLivePreviews = new Map();
const imageCache = new Map();

/* ---------- დამხმარეები ---------- */
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function genPeerId() { return 'gb-' + Math.random().toString(36).slice(2, 9); }
function letterLabel(i) { const l = LETTERS[i % 26]; const s = Math.floor(i / 26); return s === 0 ? l : l + s; }
function dist(a, b) { return Math.hypot(b.x - a.x, b.y - a.y); }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function normalizeVec(v) { const l = Math.hypot(v.x, v.y) || 1; return { x: v.x / l, y: v.y / l }; }
function formatUnits(px) { const u = px / GRID_SIZE; return Math.abs(u - Math.round(u)) < 0.05 ? String(Math.round(u)) : u.toFixed(1); }
function snapPoint(p) { return { x: Math.round(p.x / GRID_SIZE) * GRID_SIZE, y: Math.round(p.y / GRID_SIZE) * GRID_SIZE }; }
function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

function throttle(fn, wait) {
  let last = 0, timer = null, pendingArgs = null;
  return function (...args) {
    const now = Date.now();
    const remain = wait - (now - last);
    if (remain <= 0) { last = now; fn(...args); }
    else { pendingArgs = args; if (!timer) timer = setTimeout(() => { last = Date.now(); timer = null; fn(...pendingArgs); }, remain); }
  };
}
function debounce(fn, wait) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); }; }

function angleBetweenDeg(v1, v2) {
  const l1 = Math.hypot(v1.x, v1.y), l2 = Math.hypot(v2.x, v2.y);
  if (l1 < 1e-6 || l2 < 1e-6) return 0;
  let cos = (v1.x * v2.x + v1.y * v2.y) / (l1 * l2);
  cos = clamp(cos, -1, 1);
  return Math.acos(cos) * 180 / Math.PI;
}
function bisectorDir(v1, v2) {
  const n1 = normalizeVec(v1), n2 = normalizeVec(v2);
  const bx = n1.x + n2.x, by = n1.y + n2.y;
  const len = Math.hypot(bx, by);
  if (len < 1e-6) return normalizeVec({ x: -v1.y, y: v1.x });
  return { x: bx / len, y: by / len };
}

/* ---------- Canvas ინიციალიზაცია ---------- */
function initCanvas() { resizeCanvas(); }
function resizeCanvas() {
  const rect = boardWrap.getBoundingClientRect();
  state.cssWidth = rect.width;
  state.cssHeight = rect.height;
  state.dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(state.cssWidth * state.dpr);
  canvas.height = Math.round(state.cssHeight * state.dpr);
  canvas.style.width = state.cssWidth + 'px';
  canvas.style.height = state.cssHeight + 'px';
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
}
function getPoint(e) {
  const rect = canvas.getBoundingClientRect();
  const t = e.touches && e.touches[0];
  const clientX = t ? t.clientX : e.clientX;
  const clientY = t ? t.clientY : e.clientY;
  let p = { x: clientX - rect.left, y: clientY - rect.top };
  if (state.snapToGrid) p = snapPoint(p);
  return p;
}

/* ---------- რენდერი ---------- */
function render() {
  ctx.clearRect(0, 0, state.cssWidth, state.cssHeight);
  ctx.fillStyle = '#FCFCF9';
  ctx.fillRect(0, 0, state.cssWidth, state.cssHeight);
  if (state.showGrid) drawGrid();
  for (const obj of state.objects.values()) drawObject(obj);
  drawRemoteLivePreviews();
  if (draft.active && draft.currentObject) drawObject(draft.currentObject);
  if (draft.polygonPoints && draft.polygonPoints.length) drawMulticlickDraft();
  if (state.selectedId) { const o = state.objects.get(state.selectedId); if (o) drawSelectionOutline(o); }
  drawRemoteCursors();
}

function drawGrid() {
  ctx.save();
  ctx.strokeStyle = 'rgba(30,54,47,0.09)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= state.cssWidth; x += GRID_SIZE) { ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, state.cssHeight); ctx.stroke(); }
  for (let y = 0; y <= state.cssHeight; y += GRID_SIZE) { ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(state.cssWidth, y + 0.5); ctx.stroke(); }
  ctx.restore();
}

function drawLabel(text, x, y, color, fontSize = 13) {
  ctx.font = fontSize + 'px Inter, system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(252,252,249,0.92)';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function drawObject(obj) {
  ctx.save();
  switch (obj.type) {
    case 'path': drawPathObj(obj); break;
    case 'line': drawLineObj(obj); break;
    case 'rect': drawRectObj(obj); break;
    case 'circle': drawCircleObj(obj); break;
    case 'triangle': case 'polygon': drawPolyObj(obj); break;
    case 'angle': drawAngleObj(obj); break;
    case 'point': drawPointObj(obj); break;
    case 'text': drawTextObj(obj); break;
    case 'image': drawImageObj(obj); break;
  }
  ctx.restore();
}

function drawPathObj(o) {
  const pts = o.points;
  if (!pts || !pts.length) return;
  ctx.strokeStyle = o.color; ctx.lineWidth = o.strokeWidth; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (pts.length === 1) {
    ctx.beginPath(); ctx.arc(pts[0].x, pts[0].y, Math.max(o.strokeWidth / 2, 1.5), 0, Math.PI * 2);
    ctx.fillStyle = o.color; ctx.fill(); return;
  }
  ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.stroke();
}

function drawLineObj(o) {
  ctx.strokeStyle = o.color; ctx.lineWidth = o.strokeWidth; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(o.x1, o.y1); ctx.lineTo(o.x2, o.y2); ctx.stroke();
  if (state.showMeasurements) {
    const mx = (o.x1 + o.x2) / 2, my = (o.y1 + o.y2) / 2;
    const dx = o.x2 - o.x1, dy = o.y2 - o.y1, len = Math.hypot(dx, dy);
    if (len > 1) { const nx = -dy / len, ny = dx / len; drawLabel(formatUnits(len), mx + nx * 14, my + ny * 14, o.color); }
  }
}

function drawRectObj(o) {
  ctx.strokeStyle = o.color; ctx.lineWidth = o.strokeWidth;
  ctx.strokeRect(o.x, o.y, o.w, o.h);
  if (state.showMeasurements && (o.w > 4 || o.h > 4)) {
    drawLabel(formatUnits(o.w), o.x + o.w / 2, o.y - 11, o.color);
    drawLabel(formatUnits(o.h), o.x - 16, o.y + o.h / 2, o.color);
  }
}

function drawCircleObj(o) {
  ctx.strokeStyle = o.color; ctx.lineWidth = o.strokeWidth;
  ctx.beginPath(); ctx.arc(o.cx, o.cy, Math.max(o.r, 0.01), 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(o.cx, o.cy, 1.5, 0, Math.PI * 2); ctx.fillStyle = o.color; ctx.fill();
  if (state.showMeasurements && o.r > 2) drawLabel('r=' + formatUnits(o.r), o.cx + o.r * 0.4 + 10, o.cy - o.r * 0.4 - 6, o.color);
}

function drawAngleArc(vertex, v1, v2, radius, color) {
  const a1 = Math.atan2(v1.y, v1.x), a2 = Math.atan2(v2.y, v2.x);
  let diff = a2 - a1;
  while (diff <= -Math.PI) diff += Math.PI * 2;
  while (diff > Math.PI) diff -= Math.PI * 2;
  ctx.save(); ctx.strokeStyle = color; ctx.globalAlpha = 0.55; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.arc(vertex.x, vertex.y, radius, a1, a1 + diff, diff < 0); ctx.stroke();
  ctx.restore();
}

function drawPolyObj(o) {
  const pts = o.points;
  if (!pts || pts.length < 2) return;
  ctx.strokeStyle = o.color; ctx.lineWidth = o.strokeWidth;
  ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath(); ctx.stroke();
  if (state.showMeasurements && pts.length >= 3) drawPolyMeasurements(o, pts);
}

function drawPolyMeasurements(o, pts) {
  const n = pts.length;
  let angleSum = 0;
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n], cur = pts[i], next = pts[(i + 1) % n];
    const v1 = { x: prev.x - cur.x, y: prev.y - cur.y };
    const v2 = { x: next.x - cur.x, y: next.y - cur.y };
    const ang = angleBetweenDeg(v1, v2);
    angleSum += ang;
    const bis = bisectorDir(v1, v2);
    drawLabel(ang.toFixed(1) + '°', cur.x + bis.x * 26, cur.y + bis.y * 26, o.color);
    drawAngleArc(cur, v1, v2, 16, o.color);
    const dx = next.x - cur.x, dy = next.y - cur.y, len = Math.hypot(dx, dy);
    if (len > 1) { const nx = -dy / len, ny = dx / len; const mx = (cur.x + next.x) / 2, my = (cur.y + next.y) / 2; drawLabel(formatUnits(len), mx + nx * 14, my + ny * 14, o.color); }
  }
  if (n === 3) {
    const cx = (pts[0].x + pts[1].x + pts[2].x) / 3, cy = (pts[0].y + pts[1].y + pts[2].y) / 3;
    drawLabel('∠ჯამი ' + angleSum.toFixed(1) + '°', cx, cy, '#6b7a74', 11);
  }
}

function drawAngleObj(o) {
  ctx.strokeStyle = o.color; ctx.lineWidth = o.strokeWidth; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(o.p1.x, o.p1.y); ctx.lineTo(o.vertex.x, o.vertex.y); ctx.lineTo(o.p2.x, o.p2.y); ctx.stroke();
  const v1 = { x: o.p1.x - o.vertex.x, y: o.p1.y - o.vertex.y };
  const v2 = { x: o.p2.x - o.vertex.x, y: o.p2.y - o.vertex.y };
  const ang = angleBetweenDeg(v1, v2);
  drawAngleArc(o.vertex, v1, v2, 22, o.color);
  const bis = bisectorDir(v1, v2);
  drawLabel(ang.toFixed(1) + '°', o.vertex.x + bis.x * 38, o.vertex.y + bis.y * 38, o.color, 14);
}

function drawPointObj(o) {
  ctx.beginPath(); ctx.arc(o.x, o.y, 4, 0, Math.PI * 2); ctx.fillStyle = o.color; ctx.fill();
  ctx.lineWidth = 1.5; ctx.strokeStyle = '#FCFCF9'; ctx.stroke();
  drawLabel(o.label, o.x + 10, o.y - 10, o.color, 14);
}

function drawTextObj(o) { drawLabel(o.text, o.x, o.y, o.color, o.fontSize || 16); }

function getCachedImage(src) {
  let img = imageCache.get(src);
  if (!img) { img = new Image(); img.onload = () => render(); img.src = src; imageCache.set(src, img); }
  return img;
}
function drawImageObj(o) {
  const img = getCachedImage(o.src);
  if (img.complete && img.naturalWidth) ctx.drawImage(img, o.x, o.y, o.w, o.h);
  else { ctx.save(); ctx.strokeStyle = '#cbd5c8'; ctx.strokeRect(o.x, o.y, o.w, o.h); ctx.restore(); }
}

function drawSelectionOutline(obj) {
  const b = boundingBoxOf(obj);
  ctx.save(); ctx.strokeStyle = ACCENT_COLOR; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
  ctx.strokeRect(b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);
  ctx.restore();
}

function drawRemoteCursors() {
  const now = Date.now();
  for (const c of remoteCursors.values()) {
    if (now - c.t > 6000) continue;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(c.x, c.y); ctx.lineTo(c.x + 12, c.y + 4); ctx.lineTo(c.x + 5, c.y + 6); ctx.lineTo(c.x + 4, c.y + 13); ctx.closePath();
    ctx.fillStyle = c.color; ctx.fill(); ctx.strokeStyle = '#FCFCF9'; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();
    drawLabel(c.name, c.x + 24, c.y + 6, c.color, 11);
  }
}

function drawRemoteLivePreviews() {
  for (const obj of remoteLivePreviews.values()) {
    if (!obj) continue;
    ctx.save(); ctx.globalAlpha = 0.7; drawObject(obj); ctx.restore();
  }
}

function drawMulticlickDraft() {
  const pts = draft.polygonPoints;
  if (!pts || !pts.length) return;
  ctx.save();
  ctx.strokeStyle = state.color; ctx.lineWidth = state.strokeWidth;
  if (draft.multiclickTool === 'angle') {
    const vertex = pts[0];
    if (pts.length >= 2) { ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(vertex.x, vertex.y); ctx.lineTo(pts[1].x, pts[1].y); ctx.stroke(); }
    if (draft.mousePoint) { ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(vertex.x, vertex.y); ctx.lineTo(draft.mousePoint.x, draft.mousePoint.y); ctx.stroke(); }
  } else {
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
    if (draft.mousePoint) { ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(pts[pts.length - 1].x, pts[pts.length - 1].y); ctx.lineTo(draft.mousePoint.x, draft.mousePoint.y); ctx.stroke(); }
  }
  ctx.setLineDash([]); ctx.fillStyle = state.color;
  for (const p of pts) { ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}

/* ---------- Bounding box / hit-test ---------- */
function pad(minX, minY, maxX, maxY, p) { return { minX: minX - p, minY: minY - p, maxX: maxX + p, maxY: maxY + p }; }
function boundingBoxOf(obj) {
  switch (obj.type) {
    case 'path': { const xs = obj.points.map(p => p.x), ys = obj.points.map(p => p.y); return pad(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), (obj.strokeWidth || 3) / 2 + 5); }
    case 'line': return pad(Math.min(obj.x1, obj.x2), Math.min(obj.y1, obj.y2), Math.max(obj.x1, obj.x2), Math.max(obj.y1, obj.y2), (obj.strokeWidth || 3) / 2 + 6);
    case 'rect': return pad(obj.x, obj.y, obj.x + obj.w, obj.y + obj.h, 6);
    case 'circle': return pad(obj.cx - obj.r, obj.cy - obj.r, obj.cx + obj.r, obj.cy + obj.r, 6);
    case 'triangle': case 'polygon': { const xs = obj.points.map(p => p.x), ys = obj.points.map(p => p.y); return pad(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), 6); }
    case 'angle': { const xs = [obj.vertex.x, obj.p1.x, obj.p2.x], ys = [obj.vertex.y, obj.p1.y, obj.p2.y]; return pad(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), 8); }
    case 'point': return pad(obj.x, obj.y, obj.x, obj.y, 12);
    case 'text': { let w = 60; try { ctx.font = (obj.fontSize || 16) + 'px Inter, sans-serif'; w = ctx.measureText(obj.text).width; } catch (e) {} const h = (obj.fontSize || 16) / 2; return pad(obj.x - w / 2, obj.y - h, obj.x + w / 2, obj.y + h, 4); }
    case 'image': return pad(obj.x, obj.y, obj.x + obj.w, obj.y + obj.h, 2);
    default: return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }
}
function pointInBox(p, box) { return p.x >= box.minX && p.x <= box.maxX && p.y >= box.minY && p.y <= box.maxY; }
function hitTest(p) {
  const arr = [...state.objects.values()];
  for (let i = arr.length - 1; i >= 0; i--) if (pointInBox(p, boundingBoxOf(arr[i]))) return arr[i].id;
  return null;
}

/* ---------- CRUD + სინქრონიზაცია ---------- */
function addObject(obj, opts = {}) {
  state.objects.set(obj.id, obj);
  if (opts.broadcast) broadcast({ type: 'add-object', object: obj });
  debouncedSave(); render();
}
function deleteObject(id, opts = {}) {
  if (!state.objects.has(id)) return;
  state.objects.delete(id);
  if (state.selectedId === id) state.selectedId = null;
  if (opts.broadcast) broadcast({ type: 'delete-object', id });
  debouncedSave(); render();
}
function clearBoardObjects(opts = {}) {
  state.objects.clear(); state.selectedId = null;
  if (opts.broadcast) broadcast({ type: 'clear-board' });
  debouncedSave(); render();
}

function applyRemoteMessage(peerId, msg) {
  switch (msg.type) {
    case 'hello': {
      const isNew = !net.users.has(peerId);
      net.users.set(peerId, { name: msg.name, color: msg.color });
      updateUsersUI();
      if (isNew) showToast(msg.name + ' შემოუერთდა', 'info');
      break;
    }
    case 'welcome': {
      if (!net.receivedFirstWelcome) {
        net.receivedFirstWelcome = true;
        state.objects = new Map((msg.state || []).map(o => [o.id, o]));
        render();
      }
      for (const [pid, u] of Object.entries(msg.users || {})) if (pid !== net.myId) net.users.set(pid, u);
      updateUsersUI();
      for (const pid of (msg.peers || [])) if (pid !== net.myId && !net.connections.has(pid)) connectToPeer(pid);
      break;
    }
    case 'add-object': state.objects.set(msg.object.id, msg.object); debouncedSave(); render(); break;
    case 'update-object': { const o = state.objects.get(msg.id); if (o) { Object.assign(o, msg.changes); debouncedSave(); render(); } break; }
    case 'delete-object': state.objects.delete(msg.id); if (state.selectedId === msg.id) state.selectedId = null; debouncedSave(); render(); break;
    case 'clear-board': state.objects.clear(); state.selectedId = null; debouncedSave(); render(); break;
    case 'restore-all': for (const o of msg.objects) state.objects.set(o.id, o); debouncedSave(); render(); break;
    case 'live-preview': if (msg.object) remoteLivePreviews.set(peerId, msg.object); else remoteLivePreviews.delete(peerId); render(); break;
    case 'cursor': { const u = net.users.get(peerId) || {}; remoteCursors.set(peerId, { x: msg.x, y: msg.y, name: u.name || 'სტუმარი', color: u.color || '#94a3b8', t: Date.now() }); render(); break; }
  }
}

/* ---------- ისტორია ---------- */
function undo() {
  const a = hist.undo.pop();
  if (!a) return;
  hist.redo.push(a);
  if (a.type === 'add') deleteObject(a.obj.id, { broadcast: true });
  else if (a.type === 'delete') addObject(a.obj, { broadcast: true });
  else if (a.type === 'update') { const o = state.objects.get(a.id); if (o) { Object.assign(o, a.before); broadcast({ type: 'update-object', id: a.id, changes: a.before }); debouncedSave(); render(); } }
  else if (a.type === 'clear') { for (const o of a.objects) state.objects.set(o.id, o); broadcast({ type: 'restore-all', objects: a.objects }); debouncedSave(); render(); }
}
function redo() {
  const a = hist.redo.pop();
  if (!a) return;
  hist.undo.push(a);
  if (a.type === 'add') addObject(a.obj, { broadcast: true });
  else if (a.type === 'delete') deleteObject(a.obj.id, { broadcast: true });
  else if (a.type === 'update') { const o = state.objects.get(a.id); if (o) { Object.assign(o, a.after); broadcast({ type: 'update-object', id: a.id, changes: a.after }); debouncedSave(); render(); } }
  else if (a.type === 'clear') clearBoardObjects({ broadcast: true });
}

/* ---------- Pointer / კლავიატურა ---------- */
function onPointerDown(e) {
  if (e.button !== undefined && e.button !== 0) return;
  const p = getPoint(e);
  draft.mousePoint = p;
  const def = TOOLS[state.tool];
  if (def.kind === 'drag') startDragTool(state.tool, p);
  else if (def.kind === 'erase') { draft.active = true; draft.mode = 'erase'; eraseAt(p); }
  else if (def.kind === 'select') startSelectInteraction(p);
  else if (def.kind === 'click') handleClickTool(state.tool, p);
  else if (def.kind === 'multiclick') handleMultiClickTool(state.tool, p);
  render();
}
function onPointerMove(e) {
  const p = getPoint(e);
  const overBoard = p.x >= 0 && p.y >= 0 && p.x <= state.cssWidth && p.y <= state.cssHeight;
  if (overBoard || draft.active) { draft.mousePoint = p; if (overBoard) sendCursorThrottled(p); }
  if (draft.active) {
    if (draft.mode === 'drag-tool') updateDragTool(p, e.shiftKey);
    else if (draft.mode === 'select-move') updateSelectDrag(p);
    else if (draft.mode === 'erase') eraseAt(p);
    render();
  } else if (draft.polygonPoints && overBoard) render();
}
function onPointerUp() {
  if (!draft.active) return;
  if (draft.mode === 'drag-tool') commitDragTool();
  else if (draft.mode === 'select-move') endSelectDrag();
  draft.active = false; draft.mode = null;
}
function onDblClick(e) {
  if (draft.polygonPoints && draft.multiclickTool === 'polygon') { finalizeMultiClick(); return; }
  if (state.tool !== 'select') return;
  const p = getPoint(e);
  const id = hitTest(p);
  if (!id) return;
  const obj = state.objects.get(id);
  if (obj.type === 'point') {
    openInlineEditor({ x: obj.x + 10, y: obj.y - 10 }, obj.label, (val) => {
      const nl = (val || '').trim().slice(0, 6);
      if (nl && nl !== obj.label) {
        hist.undo.push({ type: 'update', id: obj.id, before: { label: obj.label }, after: { label: nl } }); hist.redo = [];
        obj.label = nl; broadcast({ type: 'update-object', id: obj.id, changes: { label: nl } }); debouncedSave(); render();
      }
    });
  } else if (obj.type === 'text') {
    openInlineEditor({ x: obj.x, y: obj.y }, obj.text, (val) => {
      const nt = (val || '').trim();
      if (nt && nt !== obj.text) {
        hist.undo.push({ type: 'update', id: obj.id, before: { text: obj.text }, after: { text: nt } }); hist.redo = [];
        obj.text = nt; broadcast({ type: 'update-object', id: obj.id, changes: { text: nt } }); debouncedSave(); render();
      } else if (!nt) {
        hist.undo.push({ type: 'delete', obj: deepClone(obj) }); hist.redo = [];
        deleteObject(obj.id, { broadcast: true });
      }
    });
  }
}
function onKeyDown(e) {
  if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  if (e.key === 'Escape') { if (draft.polygonPoints) cancelMultiClick(); if (state.selectedId) { state.selectedId = null; render(); } }
  else if (e.key === 'Enter') { if (draft.polygonPoints && draft.multiclickTool === 'polygon' && draft.polygonPoints.length >= 3) finalizeMultiClick(); }
  else if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedId) {
    e.preventDefault();
    const obj = state.objects.get(state.selectedId);
    if (obj) { hist.undo.push({ type: 'delete', obj: deepClone(obj) }); hist.redo = []; deleteObject(obj.id, { broadcast: true }); }
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
  else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
}

/* ---- ხაზვის ხელსაწყოები (drag) ---- */
function startDragTool(tool, p) {
  draft.active = true; draft.mode = 'drag-tool'; draft.tool = tool; draft.startPoint = p;
  const base = { id: 'draft-' + (net.myId || 'local'), color: state.color, strokeWidth: state.strokeWidth };
  if (tool === 'pen') draft.currentObject = { ...base, type: 'path', points: [p] };
  else if (tool === 'line') draft.currentObject = { ...base, type: 'line', x1: p.x, y1: p.y, x2: p.x, y2: p.y };
  else if (tool === 'rect') draft.currentObject = { ...base, type: 'rect', x: p.x, y: p.y, w: 0, h: 0 };
  else if (tool === 'circle') draft.currentObject = { ...base, type: 'circle', cx: p.x, cy: p.y, r: 0 };
}
function updateDragTool(p, shiftKey) {
  const tool = draft.tool, start = draft.startPoint, o = draft.currentObject;
  if (tool === 'pen') o.points.push(p);
  else if (tool === 'line') {
    let end = p;
    if (shiftKey) { const d = dist(start, p); const a = Math.round(Math.atan2(p.y - start.y, p.x - start.x) / (Math.PI / 4)) * (Math.PI / 4); end = { x: start.x + d * Math.cos(a), y: start.y + d * Math.sin(a) }; }
    o.x2 = end.x; o.y2 = end.y;
  } else if (tool === 'rect') {
    let dx = p.x - start.x, dy = p.y - start.y;
    if (shiftKey) { const s = Math.max(Math.abs(dx), Math.abs(dy)); dx = s * Math.sign(dx || 1); dy = s * Math.sign(dy || 1); }
    o.x = Math.min(start.x, start.x + dx); o.y = Math.min(start.y, start.y + dy); o.w = Math.abs(dx); o.h = Math.abs(dy);
  } else if (tool === 'circle') o.r = dist(start, p);
  sendLivePreviewThrottled();
}
function commitDragTool() {
  const tool = draft.tool; let obj = draft.currentObject;
  broadcast({ type: 'live-preview', object: null });
  let valid = true;
  if (tool === 'line' && dist({ x: obj.x1, y: obj.y1 }, { x: obj.x2, y: obj.y2 }) < 3) valid = false;
  if (tool === 'rect' && obj.w < 3 && obj.h < 3) valid = false;
  if (tool === 'circle' && obj.r < 3) valid = false;
  if (tool === 'pen' && obj.points.length === 0) valid = false;
  if (valid) {
    obj = { ...obj, id: uid() };
    hist.undo.push({ type: 'add', obj }); hist.redo = [];
    addObject(obj, { broadcast: true });
  }
  draft.currentObject = null; draft.tool = null; render();
}

/* ---- მრავალწკაპიანი ხელსაწყოები ---- */
function handleMultiClickTool(tool, p) {
  if (!draft.polygonPoints) { draft.polygonPoints = [p]; draft.multiclickTool = tool; return; }
  if (tool === 'polygon' && draft.polygonPoints.length >= 3 && dist(p, draft.polygonPoints[0]) < 10) { finalizeMultiClick(); return; }
  draft.polygonPoints.push(p);
  if (draft.polygonPoints.length >= TOOLS[tool].maxPoints) finalizeMultiClick();
}
function finalizeMultiClick() {
  const pts = draft.polygonPoints, tool = draft.multiclickTool;
  draft.polygonPoints = null; draft.multiclickTool = null;
  if (!pts || pts.length < 3) { render(); return; }
  let obj = null;
  if (tool === 'angle') obj = { id: uid(), type: 'angle', vertex: pts[0], p1: pts[1], p2: pts[2], color: state.color, strokeWidth: state.strokeWidth };
  else obj = { id: uid(), type: tool === 'triangle' ? 'triangle' : 'polygon', points: pts, color: state.color, strokeWidth: state.strokeWidth };
  hist.undo.push({ type: 'add', obj }); hist.redo = [];
  addObject(obj, { broadcast: true });
}
function cancelMultiClick() { draft.polygonPoints = null; draft.multiclickTool = null; render(); }

/* ---- მონიშვნა / გადაადგილება ---- */
function snapshotPositionalFields(o) {
  switch (o.type) {
    case 'path': return { points: o.points.map(p => ({ ...p })) };
    case 'line': return { x1: o.x1, y1: o.y1, x2: o.x2, y2: o.y2 };
    case 'rect': return { x: o.x, y: o.y };
    case 'circle': return { cx: o.cx, cy: o.cy };
    case 'triangle': case 'polygon': return { points: o.points.map(p => ({ ...p })) };
    case 'angle': return { vertex: { ...o.vertex }, p1: { ...o.p1 }, p2: { ...o.p2 } };
    case 'point': case 'text': case 'image': return { x: o.x, y: o.y };
  }
}
function translateObjBy(o, base, dx, dy) {
  switch (o.type) {
    case 'path': o.points = base.points.map(p => ({ x: p.x + dx, y: p.y + dy })); break;
    case 'line': o.x1 = base.x1 + dx; o.y1 = base.y1 + dy; o.x2 = base.x2 + dx; o.y2 = base.y2 + dy; break;
    case 'rect': o.x = base.x + dx; o.y = base.y + dy; break;
    case 'circle': o.cx = base.cx + dx; o.cy = base.cy + dy; break;
    case 'triangle': case 'polygon': o.points = base.points.map(p => ({ x: p.x + dx, y: p.y + dy })); break;
    case 'angle': o.vertex = { x: base.vertex.x + dx, y: base.vertex.y + dy }; o.p1 = { x: base.p1.x + dx, y: base.p1.y + dy }; o.p2 = { x: base.p2.x + dx, y: base.p2.y + dy }; break;
    case 'point': case 'text': case 'image': o.x = base.x + dx; o.y = base.y + dy; break;
  }
}
function startSelectInteraction(p) {
  const id = hitTest(p);
  state.selectedId = id;
  if (id) { draft.active = true; draft.mode = 'select-move'; draft.dragOrigin = p; draft.objOriginFull = snapshotPositionalFields(state.objects.get(id)); }
}
function updateSelectDrag(p) {
  const o = state.objects.get(state.selectedId);
  if (!o || !draft.objOriginFull) return;
  translateObjBy(o, draft.objOriginFull, p.x - draft.dragOrigin.x, p.y - draft.dragOrigin.y);
}
function endSelectDrag() {
  const o = state.objects.get(state.selectedId);
  if (o && draft.objOriginFull) {
    const after = snapshotPositionalFields(o);
    if (JSON.stringify(after) !== JSON.stringify(draft.objOriginFull)) {
      hist.undo.push({ type: 'update', id: o.id, before: draft.objOriginFull, after }); hist.redo = [];
      broadcast({ type: 'update-object', id: o.id, changes: after });
      debouncedSave();
    }
  }
  draft.objOriginFull = null;
}

/* ---- საშლელი ---- */
function eraseAt(p) {
  const id = hitTest(p);
  if (id) {
    const obj = state.objects.get(id);
    hist.undo.push({ type: 'delete', obj: deepClone(obj) }); hist.redo = [];
    deleteObject(id, { broadcast: true });
  }
}

/* ---- წერტილი / ტექსტი ---- */
function handleClickTool(tool, p) {
  if (tool === 'point') {
    const label = letterLabel(state.pointCounter++);
    const obj = { id: uid(), type: 'point', x: p.x, y: p.y, label, color: state.color };
    hist.undo.push({ type: 'add', obj }); hist.redo = [];
    addObject(obj, { broadcast: true });
  } else if (tool === 'text') {
    openInlineEditor(p, '', (text) => {
      if (text && text.trim()) {
        const obj = { id: uid(), type: 'text', x: p.x, y: p.y, text: text.trim(), fontSize: 16, color: state.color };
        hist.undo.push({ type: 'add', obj }); hist.redo = [];
        addObject(obj, { broadcast: true });
      }
    });
  }
}
function openInlineEditor(p, initialText, onCommit) {
  const rect = canvas.getBoundingClientRect();
  const input = document.createElement('input');
  input.type = 'text'; input.className = 'inline-editor'; input.value = initialText;
  input.style.left = (rect.left + p.x) + 'px'; input.style.top = (rect.top + p.y - 12) + 'px';
  document.body.appendChild(input); input.focus(); input.select();
  let done = false;
  function commit() { if (done) return; done = true; onCommit(input.value); input.remove(); render(); }
  input.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); commit(); } else if (e.key === 'Escape') { done = true; input.remove(); } });
  input.addEventListener('blur', commit);
}

/* ---------- სურათები ---------- */
function resizeImageFile(file, maxDim, quality, cb) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) { const s = Math.min(maxDim / width, maxDim / height); width = Math.round(width * s); height = Math.round(height * s); }
      const off = document.createElement('canvas'); off.width = width; off.height = height;
      const octx = off.getContext('2d'); octx.drawImage(img, 0, 0, width, height);
      const type = (file.type === 'image/png' || file.type === 'image/gif') ? 'image/png' : 'image/jpeg';
      cb(off.toDataURL(type, quality));
    };
    img.onerror = () => showToast('სურათის ჩატვირთვა ვერ მოხერხდა', 'error');
    img.src = e.target.result;
  };
  reader.onerror = () => showToast('ფაილის წაკითხვა ვერ მოხერხდა', 'error');
  reader.readAsDataURL(file);
}
function onImageFilesChosen(fileList) {
  for (const file of fileList) {
    if (!file.type.startsWith('image/')) continue;
    if (file.size > 20 * 1024 * 1024) { showToast('სურათი ძალიან დიდია (მაქს. 20MB)', 'error'); continue; }
    resizeImageFile(file, IMAGE_MAX_DIM, 0.85, (dataURL) => addTrayThumb(dataURL));
  }
}
function addTrayThumb(dataURL) {
  const div = document.createElement('div');
  div.className = 'tray-thumb'; div.draggable = true;
  const img = document.createElement('img'); img.src = dataURL; div.appendChild(img);
  div.addEventListener('dragstart', (e) => { e.dataTransfer.setData('application/x-geoboard-image', dataURL); e.dataTransfer.effectAllowed = 'copy'; });
  div.addEventListener('click', () => placeImage(dataURL, state.cssWidth / 2, state.cssHeight / 2));
  const rm = document.createElement('button');
  rm.className = 'tray-thumb-remove'; rm.type = 'button'; rm.innerHTML = '&times;'; rm.title = 'წაშლა თარგიდან';
  rm.addEventListener('click', (e) => { e.stopPropagation(); div.remove(); });
  div.appendChild(rm);
  els.imageTray.appendChild(div);
}
function placeImage(dataURL, cx, cy) {
  const img = new Image();
  img.onload = () => {
    let w = img.width, h = img.height;
    if (w > IMAGE_PLACED_DIM || h > IMAGE_PLACED_DIM) { const s = Math.min(IMAGE_PLACED_DIM / w, IMAGE_PLACED_DIM / h); w = Math.round(w * s); h = Math.round(h * s); }
    const obj = { id: uid(), type: 'image', x: cx - w / 2, y: cy - h / 2, w, h, src: dataURL };
    hist.undo.push({ type: 'add', obj }); hist.redo = [];
    addObject(obj, { broadcast: true });
  };
  img.src = dataURL;
}
function wireImageDnD() {
  els.uploadBtn.addEventListener('click', () => els.imageFileInput.click());
  els.imageFileInput.addEventListener('change', (e) => { onImageFilesChosen(e.target.files); e.target.value = ''; });
  boardWrap.addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
  boardWrap.addEventListener('drop', (e) => {
    e.preventDefault();
    const p = getPoint(e);
    const internal = e.dataTransfer.getData('application/x-geoboard-image');
    if (internal) { placeImage(internal, p.x, p.y); return; }
    const files = e.dataTransfer.files;
    if (files && files.length) for (const file of files) { if (!file.type.startsWith('image/')) continue; resizeImageFile(file, IMAGE_MAX_DIM, 0.85, (dataURL) => { addTrayThumb(dataURL); placeImage(dataURL, p.x, p.y); }); }
  });
}

/* ---------- ლოკალური შენახვა ---------- */
function saveLocalSnapshot() { try { localStorage.setItem('geoboard:' + net.roomId, JSON.stringify([...state.objects.values()])); } catch (e) {} }
function loadLocalSnapshot(roomId) { try { const raw = localStorage.getItem('geoboard:' + roomId); if (raw) state.objects = new Map(JSON.parse(raw).map(o => [o.id, o])); } catch (e) {} }
const debouncedSave = debounce(saveLocalSnapshot, SAVE_DEBOUNCE_MS);
function loadName() { try { let n = localStorage.getItem('geoboard:name'); if (!n) { n = 'მოსწავლე' + Math.floor(Math.random() * 90 + 10); localStorage.setItem('geoboard:name', n); } return n; } catch (e) { return 'სტუმარი'; } }
function pickRandomColor() { return NAME_COLORS[Math.floor(Math.random() * NAME_COLORS.length)]; }
function wasHostOf(roomId) { try { return localStorage.getItem('geoboard:hosted:' + roomId) === '1'; } catch (e) { return false; } }
function markAsHost(roomId) { try { localStorage.setItem('geoboard:hosted:' + roomId, '1'); } catch (e) {} }

/* ---------- P2P ქსელი (PeerJS) ---------- */
const sendCursorThrottled = throttle((p) => broadcast({ type: 'cursor', x: p.x, y: p.y }), CURSOR_THROTTLE_MS);
const sendLivePreviewThrottled = throttle(() => broadcast({ type: 'live-preview', object: draft.currentObject }), PREVIEW_THROTTLE_MS);

function broadcast(msg, excludeId = null) {
  for (const [pid, conn] of net.connections.entries()) {
    if (pid === excludeId) continue;
    if (conn.open) { try { conn.send(msg); } catch (e) { console.error(e); } }
  }
}
function connectToPeer(id) { if (net.connections.has(id) || id === net.myId) return; wireConnection(net.peer.connect(id, { reliable: true }), false); }

function wireConnection(conn, isIncoming) {
  const pid = conn.peer;
  net.connections.set(pid, conn);
  conn.on('open', () => {
    conn.send({ type: 'hello', name: net.myName, color: net.myColor });
    if (isIncoming) {
      const others = [...net.connections.keys()].filter(k => k !== pid);
      const usersObj = {}; for (const [k, v] of net.users.entries()) usersObj[k] = v;
      conn.send({ type: 'welcome', state: [...state.objects.values()], peers: others, users: usersObj });
    }
    updateConnectionStatusUI();
  });
  conn.on('data', (data) => applyRemoteMessage(pid, data));
  conn.on('close', () => { net.connections.delete(pid); net.users.delete(pid); remoteCursors.delete(pid); remoteLivePreviews.delete(pid); updateUsersUI(); updateConnectionStatusUI(); render(); });
  conn.on('error', () => { net.connections.delete(pid); updateConnectionStatusUI(); });
}

function createPeer(id, onOpen, attempt = 0) {
  let opened = false;
  const peer = new Peer(id, { debug: 0 });
  peer.on('open', () => { opened = true; onOpen(peer); });
  peer.on('error', (err) => {
    if (opened) { console.warn('Peer event after open:', err && err.type); return; }
    if (err && err.type === 'unavailable-id' && attempt < 4) { try { peer.destroy(); } catch (e) {} createPeer(genPeerId(), onOpen, attempt + 1); }
    else if (err && err.type === 'peer-unavailable') { setConnectionStatus('ოთახი ვერ მოიძებნა', 'error'); showToast('ეს ბმული აქტიური აღარ არის — სთხოვე შემქმნელს, ხელახლა გახსნას გვერდი', 'error'); }
    else { setConnectionStatus('კავშირის შეცდომა', 'error'); console.error('PeerJS error:', err); }
  });
  peer.on('disconnected', () => { if (!opened) return; setConnectionStatus('კავშირი გაწყდა — ვცდილობთ თავიდან დაკავშირებას', 'error'); try { peer.reconnect(); } catch (e) {} });
}

function setupRoom() {
  const params = new URLSearchParams(location.search);
  const roomParam = params.get('room');
  net.myName = loadName();
  net.myColor = pickRandomColor();
  const iAmHost = roomParam && wasHostOf(roomParam);

  if (roomParam && !iAmHost) {
    net.isHost = false; net.roomId = roomParam;
    loadLocalSnapshot(net.roomId);
    setConnectionStatus('დაკავშირება მიმდინარეობს...', 'connecting');
    createPeer(genPeerId(), (peer) => {
      net.peer = peer; net.myId = peer.id;
      wireConnection(peer.connect(net.roomId, { reliable: true }), false);
      peer.on('connection', c => wireConnection(c, true));
      setTimeout(() => { if (!net.connections.has(net.roomId)) { setConnectionStatus('ვერ მოხერხდა დაკავშირება', 'error'); showToast('ოთახის შემქმნელი შესაძლოა ონლაინ არ არის', 'error'); } }, 9000);
    });
  } else {
    net.isHost = true; net.roomId = roomParam || genPeerId();
    markAsHost(net.roomId);
    loadLocalSnapshot(net.roomId);
    if (!roomParam) history.replaceState(null, '', '?room=' + net.roomId);
    setConnectionStatus('ოთახი მზადაა — გაუზიარე ბმული', 'ready');
    createPeer(net.roomId, (peer) => {
      net.peer = peer; net.myId = peer.id;
      if (peer.id !== net.roomId) { net.roomId = peer.id; markAsHost(net.roomId); history.replaceState(null, '', '?room=' + net.roomId); updateShareUrlUI(); }
      peer.on('connection', c => wireConnection(c, true));
    });
  }
  updateShareUrlUI();
}

/* ---------- UI ---------- */
function cacheEls() {
  canvas = document.getElementById('board'); ctx = canvas.getContext('2d'); boardWrap = document.getElementById('board-wrap');
  els.toolButtons = [...document.querySelectorAll('.tool-btn[data-tool]')];
  els.colorInput = document.getElementById('colorInput');
  els.swatches = [...document.querySelectorAll('.swatch')];
  els.strokeRange = document.getElementById('strokeRange'); els.strokeLabel = document.getElementById('strokeLabel');
  els.gridToggle = document.getElementById('gridToggle'); els.snapToggle = document.getElementById('snapToggle'); els.measureToggle = document.getElementById('measureToggle');
  els.undoBtn = document.getElementById('undoBtn'); els.redoBtn = document.getElementById('redoBtn'); els.clearBtn = document.getElementById('clearBtn'); els.exportBtn = document.getElementById('exportBtn');
  els.uploadBtn = document.getElementById('uploadBtn'); els.imageFileInput = document.getElementById('imageFileInput'); els.imageTray = document.getElementById('imageTray');
  els.nameInput = document.getElementById('nameInput');
  els.shareUrlInput = document.getElementById('shareUrlInput'); els.copyLinkBtn = document.getElementById('copyLinkBtn');
  els.usersOnline = document.getElementById('usersOnline');
  els.statusDot = document.getElementById('statusDot'); els.statusText = document.getElementById('statusText');
  els.toastContainer = document.getElementById('toastContainer');
}
function setActiveTool(tool) {
  if (draft.polygonPoints) cancelMultiClick();
  state.tool = tool;
  if (tool !== 'select') state.selectedId = null;
  els.toolButtons.forEach(b => b.classList.toggle('active', b.dataset.tool === tool));
  canvas.style.cursor = tool === 'eraser' ? 'cell' : tool === 'select' ? 'default' : 'crosshair';
  render();
}
function wireToolbar() { els.toolButtons.forEach(btn => btn.addEventListener('click', () => setActiveTool(btn.dataset.tool))); }
function wireStyleControls() {
  els.colorInput.addEventListener('input', () => { state.color = els.colorInput.value; els.swatches.forEach(s => s.classList.remove('active')); });
  els.swatches.forEach(s => s.addEventListener('click', () => { state.color = s.dataset.color; els.colorInput.value = s.dataset.color; els.swatches.forEach(x => x.classList.toggle('active', x === s)); }));
  els.strokeRange.addEventListener('input', () => { state.strokeWidth = Number(els.strokeRange.value); els.strokeLabel.textContent = state.strokeWidth; });
}
function wireToggles() {
  els.gridToggle.addEventListener('change', () => { state.showGrid = els.gridToggle.checked; render(); });
  els.snapToggle.addEventListener('change', () => { state.snapToGrid = els.snapToggle.checked; });
  els.measureToggle.addEventListener('change', () => { state.showMeasurements = els.measureToggle.checked; render(); });
}
function onClearBtnClick() {
  if (state.objects.size === 0) return;
  if (!confirm('დარწმუნებული ხარ, რომ გინდა მთელი დაფის გასუფთავება ყველასთვის?')) return;
  const snapshot = deepClone([...state.objects.values()]);
  hist.undo.push({ type: 'clear', objects: snapshot }); hist.redo = [];
  clearBoardObjects({ broadcast: true });
}
function exportBoardPNG() {
  const tmp = document.createElement('canvas'); tmp.width = canvas.width; tmp.height = canvas.height;
  const tctx = tmp.getContext('2d'); tctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  tctx.fillStyle = '#FCFCF9'; tctx.fillRect(0, 0, state.cssWidth, state.cssHeight);
  const prevCtx = ctx; ctx = tctx;
  if (state.showGrid) drawGrid();
  for (const obj of state.objects.values()) drawObject(obj);
  ctx = prevCtx;
  const link = document.createElement('a'); link.download = 'geoboard-' + new Date().toISOString().slice(0, 10) + '.png'; link.href = tmp.toDataURL('image/png'); link.click();
}
function wireActions() { els.undoBtn.addEventListener('click', undo); els.redoBtn.addEventListener('click', redo); els.clearBtn.addEventListener('click', onClearBtnClick); els.exportBtn.addEventListener('click', exportBoardPNG); }
function updateShareUrlUI() { els.shareUrlInput.value = location.origin + location.pathname + '?room=' + net.roomId; }
function wireShareUI() {
  els.copyLinkBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(els.shareUrlInput.value); showToast('ბმული დაკოპირებულია', 'success'); }
    catch (e) { els.shareUrlInput.select(); try { document.execCommand('copy'); showToast('ბმული დაკოპირებულია', 'success'); } catch (e2) { showToast('მონიშნე ბმული ხელით კოპირებისთვის', 'error'); } }
  });
}
function wireNameInput() {
  els.nameInput.value = net.myName;
  els.nameInput.addEventListener('change', () => {
    const v = els.nameInput.value.trim().slice(0, 24) || 'სტუმარი';
    net.myName = v; els.nameInput.value = v;
    try { localStorage.setItem('geoboard:name', v); } catch (e) {}
    broadcast({ type: 'hello', name: net.myName, color: net.myColor });
    updateUsersUI();
  });
}
function updateUsersUI() {
  els.usersOnline.innerHTML = '';
  const me = document.createElement('span'); me.className = 'user-chip'; me.style.setProperty('--chip-color', net.myColor); me.textContent = net.myName + ' (შენ)';
  els.usersOnline.appendChild(me);
  for (const u of net.users.values()) { const chip = document.createElement('span'); chip.className = 'user-chip'; chip.style.setProperty('--chip-color', u.color || '#94a3b8'); chip.textContent = u.name || 'სტუმარი'; els.usersOnline.appendChild(chip); }
}
function setConnectionStatus(text, kind) { els.statusText.textContent = text; els.statusDot.className = 'status-dot status-' + kind; }
function updateConnectionStatusUI() {
  const n = net.connections.size;
  if (n === 0) setConnectionStatus(net.isHost ? 'ოთახი მზადაა — გაუზიარე ბმული' : 'დაკავშირება...', net.isHost ? 'ready' : 'connecting');
  else setConnectionStatus('დაკავშირებულია (' + (n + 1) + ' მომხმარებელი)', 'connected');
}
function showToast(msg, kind = 'info') {
  const t = document.createElement('div'); t.className = 'toast toast-' + kind; t.textContent = msg;
  els.toastContainer.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3400);
}

/* ---------- გაშვება ---------- */
function main() {
  cacheEls();
  initCanvas();
  setupRoom();
  wireToolbar();
  wireStyleControls();
  wireToggles();
  wireActions();
  wireShareUI();
  wireNameInput();
  wireImageDnD();
  updateUsersUI();
  setActiveTool('pen');

  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('dblclick', onDblClick);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', () => { resizeCanvas(); render(); });

  render();
}
document.addEventListener('DOMContentLoaded', main);
