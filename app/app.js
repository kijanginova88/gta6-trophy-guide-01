// Leonida Legends: GTA VI trophy guide + tracker.
// Static and offline: the trophy list is data/trophies.json, progress lives in
// localStorage, and nothing is fetched from the network at runtime.
const KEY = 'gta6-trophy-checklist-v1';
const SPOILER_KEY = 'gta6-trophy-spoilers-v1';
const params = new URLSearchParams(location.search);

const listEl = document.getElementById('list');
const progressEl = document.getElementById('progress');
const fillEl = document.getElementById('progress-fill');
const statsEl = document.getElementById('grade-stats');
const countEl = document.getElementById('count');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const kindEl = document.getElementById('kind');
const hideEarnedEl = document.getElementById('hide-earned');
const missableOnlyEl = document.getElementById('missable-only');
const spoilersEl = document.getElementById('spoilers');

let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const sourceByName = new Map((doc.sources ?? []).map((s) => [s.name, s.url]));

// Deep-linkable filters: ?grade=silver, ?kind=story, ?spoilers=off, ?q=stunt
if (params.get('grade')) gradeEl.value = params.get('grade');
if (params.get('q')) searchEl.value = params.get('q');
const spoilerDefault = params.get('spoilers') === 'off'
  ? false
  : (localStorage.getItem(SPOILER_KEY) ?? 'on') === 'on';
spoilersEl.checked = spoilerDefault;

const kinds = [...new Set(trophies.map((t) => t.kind))].sort();
for (const k of kinds) {
  const opt = document.createElement('option');
  opt.value = k;
  opt.textContent = `${k[0].toUpperCase()}${k.slice(1)} (${trophies.filter((t) => t.kind === k).length})`;
  kindEl.append(opt);
}
if (params.get('kind')) kindEl.value = params.get('kind');

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function gradeLabel(t) {
  return t.grade === 'platinum' ? 'Platinum' : t.grade[0].toUpperCase() + t.grade.slice(1);
}

function render() {
  const q = searchEl.value.trim().toLowerCase();
  const grade = gradeEl.value;
  const kind = kindEl.value;
  const hideSpoilers = spoilersEl.checked;

  const shown = trophies.filter((t) => {
    if (grade !== 'all' && t.grade !== grade) return false;
    if (kind !== 'all' && t.kind !== kind) return false;
    if (hideEarnedEl.checked && earned.has(t.id)) return false;
    if (missableOnlyEl.checked && !t.missable) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.guide.toLowerCase().includes(q))) return false;
    return true;
  });

  listEl.replaceChildren();
  for (const t of shown) {
    const isEarned = earned.has(t.id);
    const concealed = t.hidden && hideSpoilers && !isEarned;
    const card = document.createElement('article');
    card.className = `card${isEarned ? ' earned' : ''}`;

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = isEarned;
    box.setAttribute('aria-label', `Mark ${concealed ? 'hidden trophy' : t.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id);
      else earned.delete(t.id);
      save();
      render();
    });
    card.append(box);

    const body = document.createElement('div');
    const head = document.createElement('div');
    head.className = 'trophy-head';
    const name = document.createElement('h3');
    name.className = 'trophy-name';
    name.textContent = concealed ? `Hidden trophy #${t.id}` : t.name;
    head.append(name);
    const badge = document.createElement('span');
    badge.className = `badge ${t.grade}`;
    badge.textContent = gradeLabel(t);
    head.append(badge);
    const gs = document.createElement('span');
    gs.className = 'tag';
    gs.textContent = `${t.gamerscore}G`;
    head.append(gs);
    const kindTag = document.createElement('span');
    kindTag.className = 'tag';
    kindTag.textContent = t.kind;
    head.append(kindTag);
    if (t.hidden) {
      const hiddenTag = document.createElement('span');
      hiddenTag.className = 'tag hidden-tag';
      hiddenTag.textContent = 'Hidden on PSN';
      head.append(hiddenTag);
    }
    if (t.missable) {
      const miss = document.createElement('span');
      miss.className = 'tag missable';
      miss.textContent = 'Possibly missable';
      head.append(miss);
    }
    body.append(head);

    if (concealed) {
      const note = document.createElement('p');
      note.className = 'spoiler-note';
      note.textContent = 'This trophy is hidden on PSN until you earn it. Turn off “Hide story spoilers” above to reveal its name and guide, or tick it once you have earned it.';
      body.append(note);
    } else {
      const desc = document.createElement('p');
      desc.className = 'trophy-desc';
      desc.textContent = `“${t.description}”`;
      body.append(desc);
      const guide = document.createElement('p');
      guide.className = 'trophy-guide';
      guide.textContent = t.guide;
      body.append(guide);
      const src = document.createElement('p');
      src.className = 'trophy-sources';
      src.textContent = 'Sources: ';
      t.sources.forEach((s, i) => {
        if (i > 0) src.append(document.createTextNode(' · '));
        const a = document.createElement('a');
        a.href = sourceByName.get(s) ?? '#';
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = s;
        src.append(a);
      });
      body.append(src);
    }
    card.append(body);
    listEl.append(card);
  }
  if (!shown.length) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'No trophies match these filters.';
    listEl.append(empty);
  }

  const pct = Math.round((earned.size / trophies.length) * 100);
  progressEl.textContent = `${earned.size} of ${trophies.length} earned · ${pct}% to the platinum`;
  fillEl.style.width = `${pct}%`;
  const byGrade = {};
  for (const t of trophies) byGrade[t.grade] = (byGrade[t.grade] ?? 0) + 1;
  const earnedByGrade = {};
  for (const t of trophies) if (earned.has(t.id)) earnedByGrade[t.grade] = (earnedByGrade[t.grade] ?? 0) + 1;
  statsEl.replaceChildren();
  for (const g of ['platinum', 'gold', 'silver', 'bronze']) {
    const s = document.createElement('span');
    s.textContent = `${gradeLabel({ grade: g })} ${earnedByGrade[g] ?? 0}/${byGrade[g] ?? 0}`;
    statsEl.append(s);
  }
  const hiddenEarned = trophies.filter((t) => t.hidden && earned.has(t.id)).length;
  const hs = document.createElement('span');
  hs.textContent = `Hidden revealed ${hiddenEarned}/28`;
  statsEl.append(hs);

  countEl.textContent = `Showing ${shown.length} of ${trophies.length} trophies${earned.size ? ` · ${earned.size} earned` : ''}.`;
  localStorage.setItem(SPOILER_KEY, spoilersEl.checked ? 'on' : 'off');
}

document.getElementById('export').addEventListener('click', () => {
  const payload = { game: doc.game, exported_at: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    const valid = new Set(trophies.map((t) => t.id));
    earned = new Set(ids.filter((id) => valid.has(id)));
    save();
    render();
  } catch {
    alert('That file is not a valid trophy-progress export.');
  }
  e.target.value = '';
});
document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Clear all earned trophies?')) {
    earned = new Set();
    save();
    render();
  }
});
for (const el of [searchEl, gradeEl, kindEl, hideEarnedEl, missableOnlyEl, spoilersEl]) {
  el.addEventListener(el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input', render);
}

const sourceList = document.getElementById('source-list');
for (const s of doc.sources ?? []) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = s.url;
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = s.name;
  li.append(a);
  sourceList.append(li);
}

render();
