const pageButtons = Array.from(document.querySelectorAll('[data-target]'));
const pages = Array.from(document.querySelectorAll('.page'));
const profileForm = document.getElementById('profileForm');
const profileNameInput = document.getElementById('profileNameInput');
const profileAgeInput = document.getElementById('profileAgeInput');
const profileHeightInput = document.getElementById('profileHeightInput');
const profileWeightInput = document.getElementById('profileWeightInput');
const profileWaistInput = document.getElementById('profileWaistInput');
const profileNameEl = document.getElementById('profileName');
const profileDetailsEl = document.getElementById('profileDetails');
const profileAvatarEl = document.getElementById('profileAvatar');
const latestPhysicalSummary = document.getElementById('latestPhysicalSummary');
const latestCombatSummary = document.getElementById('latestCombatSummary');
const physicalForm = document.getElementById('physicalForm');
const combatForm = document.getElementById('combatForm');
const physicalHistory = document.getElementById('physicalHistory');
const combatHistory = document.getElementById('combatHistory');
const physicalHistoryRefresh = document.getElementById('physicalHistoryRefresh');
const combatHistoryRefresh = document.getElementById('combatHistoryRefresh');
const weakExercisesEl = document.getElementById('weakExercises');
const trainingNotes = document.getElementById('trainingNotes');
const trainingEquipment = document.getElementById('trainingEquipment');
const trainingFrequency = document.getElementById('trainingFrequency');
const generateTrainingPlanBtn = document.getElementById('generateTrainingPlan');
const trainingPlanOutput = document.getElementById('trainingPlanOutput');
const mealForm = document.getElementById('mealForm');
const mealGoal = document.getElementById('mealGoal');
const activityLevel = document.getElementById('activityLevel');
const dietRestrictions = document.getElementById('dietRestrictions');
const excludeFoods = document.getElementById('excludeFoods');
const mealPlanOutput = document.getElementById('mealPlanOutput');
const documentForm = document.getElementById('documentForm');
const docNameInput = document.getElementById('docNameInput');
const docFileInput = document.getElementById('docFileInput');
const documentList = document.getElementById('documentList');
const healthForm = document.getElementById('healthForm');
const waterInput = document.getElementById('waterInput');
const sleepInput = document.getElementById('sleepInput');
const healthChart = document.getElementById('healthChart');

const run3Chart = document.getElementById('run3Chart');
const plankChart = document.getElementById('plankChart');
const pullupChart = document.getElementById('pullupChart');
const mufChart = document.getElementById('mufChart');
const run880Chart = document.getElementById('run880Chart');
const ammoChart = document.getElementById('ammoChart');

const PROFILE_KEY = 'mfhub-profile';
const PHYSICAL_RECORDS_KEY = 'mfhub-physical-records';
const COMBAT_RECORDS_KEY = 'mfhub-combat-records';
const DOCUMENTS_KEY = 'mfhub-documents';
const HEALTH_RECORDS_KEY = 'mfhub-health-records';

function showPage(pageId) {
  pages.forEach(page => page.classList.toggle('active', page.id === pageId));
  pageButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.target === pageId));
  if (pageId === 'dashboard') {
    renderDashboardSummary();
  }
  if (pageId === 'physical-test') {
    renderPhysicalHistory();
  }
  if (pageId === 'combat-test') {
    renderCombatHistory();
  }
  if (pageId === 'performance-graphs') {
    renderGraphs();
  }
  if (pageId === 'training-ai') {
    renderWeaknesses();
  }
  if (pageId === 'documents') {
    renderDocumentList();
  }
  if (pageId === 'health-tracker') {
    renderHealthChart();
  }
}

pageButtons.forEach(button => {
  button.addEventListener('click', () => showPage(button.dataset.target));
});

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}

function getStorage(key) {
  const raw = localStorage.getItem(key);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadProfile() {
  const profile = getStorage(PROFILE_KEY) || {};
  profileNameInput.value = profile.name || '';
  profileAgeInput.value = profile.age || '';
  profileHeightInput.value = profile.height || '';
  profileWeightInput.value = profile.weight || '';
  profileWaistInput.value = profile.waist || '';
  updateProfileSummary(profile);
}

function updateProfileSummary(profile) {
  const name = profile.name || '—';
  const age = profile.age || '—';
  const height = profile.height || '—';
  const weight = profile.weight || '—';
  const waist = profile.waist || '—';

  profileNameEl.textContent = `Name: ${name}`;
  profileDetailsEl.textContent = `Age: ${age} | Height: ${height} | Weight: ${weight} | Waist: ${waist}`;
  profileAvatarEl.textContent = name.trim() ? name.trim().split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase() : 'MF';
}

profileForm.addEventListener('submit', event => {
  event.preventDefault();
  const profile = {
    name: profileNameInput.value.trim(),
    age: profileAgeInput.value.trim(),
    height: profileHeightInput.value.trim(),
    weight: profileWeightInput.value.trim(),
    waist: profileWaistInput.value.trim(),
  };
  setStorage(PROFILE_KEY, profile);
  updateProfileSummary(profile);
  alert('Profile saved.');
});

function createEntry(summary, values) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: Date.now(),
    summary,
    values,
  };
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function renderHistory(records, container, metricFormatter) {
  container.innerHTML = '';
  if (!records.length) {
    container.innerHTML = '<p class="empty-state">No entries saved yet.</p>';
    return;
  }

  records.slice(0, 10).forEach(entry => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `<div><strong>${formatDate(entry.timestamp)}</strong><p>${entry.summary}</p></div><span>${metricFormatter(entry.values)}</span>`;
    container.appendChild(item);
  });
}

function renderPhysicalHistory() {
  const records = getStorage(PHYSICAL_RECORDS_KEY) || [];
  renderHistory(records, physicalHistory, values => `${formatTime(values.run3)} | ${formatTime(values.plank)} | ${values.pullups} pull-ups`);
}

function renderCombatHistory() {
  const records = getStorage(COMBAT_RECORDS_KEY) || [];
  renderHistory(records, combatHistory, values => `${formatTime(values.muf)} | ${formatTime(values.run880)} | ${values.ammoLifts} lifts`);
}

function renderDashboardSummary() {
  const physicalRecords = getStorage(PHYSICAL_RECORDS_KEY) || [];
  const combatRecords = getStorage(COMBAT_RECORDS_KEY) || [];

  if (physicalRecords.length) {
    const last = physicalRecords[0];
    latestPhysicalSummary.textContent = `${formatDate(last.timestamp)} — ${formatTime(last.values.run3)} run, ${formatTime(last.values.plank)} plank, ${last.values.pullups} pull-ups`;
  } else {
    latestPhysicalSummary.textContent = 'No physical fitness entries yet.';
  }

  if (combatRecords.length) {
    const last = combatRecords[0];
    latestCombatSummary.textContent = `${formatDate(last.timestamp)} — ${formatTime(last.values.muf)} MUF, ${formatTime(last.values.run880)} 880m, ${last.values.ammoLifts} lifts`;
  } else {
    latestCombatSummary.textContent = 'No combat fitness entries yet.';
  }
}

physicalForm.addEventListener('submit', event => {
  event.preventDefault();
  const run3 = safeNumber(document.getElementById('run3Minutes').value) * 60 + safeNumber(document.getElementById('run3Seconds').value);
  const plank = safeNumber(document.getElementById('plankMinutes').value) * 60 + safeNumber(document.getElementById('plankSeconds').value);
  const pullups = safeNumber(document.getElementById('pullupCount').value);

  const summary = `${formatTime(run3)} run / ${formatTime(plank)} plank / ${pullups} pull-ups`;
  const entry = createEntry(summary, { run3, plank, pullups });
  const records = [entry, ...(getStorage(PHYSICAL_RECORDS_KEY) || [])];
  setStorage(PHYSICAL_RECORDS_KEY, records);
  renderPhysicalHistory();
  renderDashboardSummary();
  alert('Physical fitness entry saved.');
  physicalForm.reset();
});

combatForm.addEventListener('submit', event => {
  event.preventDefault();
  const muf = safeNumber(document.getElementById('mufMinutes').value) * 60 + safeNumber(document.getElementById('mufSeconds').value);
  const run880 = safeNumber(document.getElementById('run880Minutes').value) * 60 + safeNumber(document.getElementById('run880Seconds').value);
  const ammoLifts = safeNumber(document.getElementById('ammoLiftCount').value);

  const summary = `${formatTime(muf)} MUF / ${formatTime(run880)} 880m / ${ammoLifts} lifts`;
  const entry = createEntry(summary, { muf, run880, ammoLifts });
  const records = [entry, ...(getStorage(COMBAT_RECORDS_KEY) || [])];
  setStorage(COMBAT_RECORDS_KEY, records);
  renderCombatHistory();
  renderDashboardSummary();
  alert('Combat fitness entry saved.');
  combatForm.reset();
});

physicalHistoryRefresh.addEventListener('click', renderPhysicalHistory);
combatHistoryRefresh.addEventListener('click', renderCombatHistory);

function chartPoints(records, key) {
  return records.map(entry => ({ x: new Date(entry.timestamp), y: entry.values[key] }));
}

function drawLineChart(canvas, points, color) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  if (!points.length) {
    ctx.fillStyle = '#7d83a5';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('No records yet', 20, height / 2);
    return;
  }

  const padding = 40;
  const xValues = points.map(point => point.x.getTime());
  const yValues = points.map(point => point.y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  ctx.strokeStyle = '#6473f0';
  ctx.fillStyle = '#aab3ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((point, index) => {
    const x = padding + ((point.x.getTime() - minX) / rangeX) * (width - padding * 2);
    const y = height - padding - ((point.y - minY) / rangeY) * (height - padding * 2);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    ctx.arc(x, y, 3, 0, Math.PI * 2);
  });
  ctx.stroke();

  ctx.fillStyle = color;
  points.forEach(point => {
    const x = padding + ((point.x.getTime() - minX) / rangeX) * (width - padding * 2);
    const y = height - padding - ((point.y - minY) / rangeY) * (height - padding * 2);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.strokeStyle = '#3c455f';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= 4; i += 1) {
    const y = padding + ((height - padding * 2) / 4) * i;
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
  }
  ctx.stroke();
}

function renderGraphs() {
  const physicalRecords = (getStorage(PHYSICAL_RECORDS_KEY) || []).slice().reverse();
  const combatRecords = (getStorage(COMBAT_RECORDS_KEY) || []).slice().reverse();

  drawLineChart(run3Chart, chartPoints(physicalRecords, 'run3'), '#81c784');
  drawLineChart(plankChart, chartPoints(physicalRecords, 'plank'), '#64b5f6');
  drawLineChart(pullupChart, chartPoints(physicalRecords, 'pullups'), '#ffb74d');
  drawLineChart(mufChart, chartPoints(combatRecords, 'muf'), '#e57373');
  drawLineChart(run880Chart, chartPoints(combatRecords, 'run880'), '#ba68c8');
  drawLineChart(ammoChart, chartPoints(combatRecords, 'ammoLifts'), '#4db6ac');
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((acc, next) => acc + next, 0) / values.length;
}

function getWeaknesses() {
  const physicalRecords = getStorage(PHYSICAL_RECORDS_KEY) || [];
  const combatRecords = getStorage(COMBAT_RECORDS_KEY) || [];
  const weaknesses = [];

  if (physicalRecords.length) {
    const data = physicalRecords[0].values;
    weaknesses.push({ label: '3-mile run', value: data.run3, direction: 'lower' });
    weaknesses.push({ label: 'Plank', value: data.plank, direction: 'higher' });
    weaknesses.push({ label: 'Pull-ups', value: data.pullups, direction: 'higher' });
  }

  if (combatRecords.length) {
    const data = combatRecords[0].values;
    weaknesses.push({ label: 'MUF', value: data.muf, direction: 'lower' });
    weaknesses.push({ label: '880m run', value: data.run880, direction: 'lower' });
    weaknesses.push({ label: 'Ammo can lifts', value: data.ammoLifts, direction: 'higher' });
  }

  if (!weaknesses.length) {
    return [{ label: 'No data available yet', note: 'Log entries to see weak exercise highlights.' }];
  }

  return weaknesses
    .sort((a, b) => {
      if (a.direction === 'higher' && b.direction === 'lower') return -1;
      if (a.direction === 'lower' && b.direction === 'higher') return 1;
      return a.direction === 'lower' ? b.value - a.value : a.value - b.value;
    })
    .slice(0, 3)
    .map(metric => {
      const note = metric.direction === 'higher'
        ? `Focus on building volume for ${metric.label}.`
        : `Focus on speed for ${metric.label}.`;
      return `${metric.label}: ${metric.direction === 'lower' ? formatTime(metric.value) : metric.value} — ${note}`;
    });
}

function renderWeaknesses() {
  const weaknesses = getWeaknesses();
  weakExercisesEl.innerHTML = weaknesses.map(item => `<div class="weak-item">${item}</div>`).join('');
}

function buildTrainingPlan(weaknesses, equipment, frequency) {
  if (!weaknesses.length || weaknesses[0].includes('No data')) {
    return 'Log physical and combat fitness entries first, then generate a training plan based on the latest weak events.';
  }

  const days = parseInt(frequency);
  const equipmentNote = equipment === 'bodyweight' ? 'Bodyweight only' : equipment === 'minimal' ? 'Dumbbells and kettlebells' : 'Full gym access';

  let plan = `AI-Generated ${days}-Day Military Training Plan\n`;
  plan += `Equipment Profile: ${equipmentNote}\n\n`;

  const workoutTemplates = {
    '3-mile run': [
      "Intervals: 4x800m at target pace with 2min rest.",
      "Tempo Run: 2 miles at 80% effort.",
      "Long Slow Distance: 4-5 miles for aerobic base."
    ],
    'Plank': [
      "Core Circuit: 3 rounds of 1min plank, 30s side planks, 20 leg raises.",
      "Weighted Planks: 3 sets of 45s with resistance.",
      "Hollow Body Holds: 4 sets of 40s."
    ],
    'Pull-ups': [
      "Volume Training: 5 sets to failure or pyramid 1-10-1.",
      "Weighted Pull-ups or Negatives: 4 sets of 5-8 reps.",
      "Scapular Pulls and Dead Hangs: 3 sets for grip strength."
    ],
    'MUF': [
      "Sprint Drills: 10x50m shuttle runs with 30s rest.",
      "Agility Ladder and Cone Drills: 20 mins high intensity.",
      "Burpee Sprints: 5 rounds of 10 burpees + 40m sprint."
    ],
    '880m run': [
      "Speed Endurance: 6x400m at 90% effort with 90s rest.",
      "Hill Sprints: 8x100m uphill sprints.",
      "Recovery Run: 20 mins light jog."
    ],
    'Ammo can lifts': [
      "High Volume Overhead Press: 4 sets of 15-20 reps.",
      "Clean and Press: 5 sets of 10 reps using available weight.",
      "Isometric Overhead Holds: 3 sets of 45s."
    ]
  };

  const schedule = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  let workoutIndex = 0;
  for (let i = 0; i < 7; i++) {
    if (i < days) {
      const weakness = weaknesses[workoutIndex % weaknesses.length].split(':')[0];
      const task = workoutTemplates[weakness] ? workoutTemplates[weakness][Math.floor(Math.random() * 3)] : "General Strength & Conditioning";
      plan += `- ${schedule[i]}: ${weakness} focus - ${task}\n`;
      workoutIndex++;
    } else {
      plan += `- ${schedule[i]}: Active Recovery (Mobility/Walking)\n`;
    }
  }

  return plan;
}

generateTrainingPlanBtn.addEventListener('click', async () => {
  generateTrainingPlanBtn.disabled = true;
  generateTrainingPlanBtn.textContent = 'Generating…';
  const weaknesses = getWeaknesses();
  const manualNotes = trainingNotes.value.trim();
  const equipment = trainingEquipment.value;
  const frequency = trainingFrequency.value;

  await new Promise(resolve => setTimeout(resolve, 800));

  const plan = buildTrainingPlan(weaknesses, equipment, frequency);
  trainingPlanOutput.textContent = `${plan}${manualNotes ? '\n\nAdditional Notes: ' + manualNotes : ''}`;

  generateTrainingPlanBtn.disabled = false;
  generateTrainingPlanBtn.textContent = 'Generate Plan';
});

mealForm.addEventListener('submit', async event => {
  event.preventDefault();
  mealForm.querySelector('button').disabled = true;
  mealForm.querySelector('button').textContent = 'Generating…';

  const goal = mealGoal.value;
  const activity = activityLevel.value;
  const restrictions = dietRestrictions.value.trim();
  const excludes = excludeFoods.value.trim();

  await new Promise(resolve => setTimeout(resolve, 800));

  let mealPlan = `AI-Optimized Nutrition Strategy\nGoal: ${goal.toUpperCase()} | Activity: ${activity.toUpperCase()}\n`;
  if (restrictions) mealPlan += `Restrictions: ${restrictions}\n`;
  if (excludes) mealPlan += `Excluding: ${excludes}\n`;

  const macroRatio = {
    'fat loss': 'P: 40%, C: 30%, F: 30%',
    'performance': 'P: 30%, C: 50%, F: 20%',
    'maintenance': 'P: 30%, C: 40%, F: 30%',
    'muscle gain': 'P: 35%, C: 45%, F: 20%'
  };

  mealPlan += `Recommended Macros: ${macroRatio[goal]}\n\n`;
  mealPlan += `- Breakfast: High-protein start with complex carbs (e.g., Egg white omelet with spinach and oats).\n`;
  mealPlan += `- Lunch: Lean protein (Chicken/Turkey/Tofu) with large volume of greens and moderate grains.\n`;
  mealPlan += `- Pre-Workout: Fast-digesting carbs (Fruit/Rice cake) for energy.\n`;
  mealPlan += `- Dinner: Sustained protein (Salmon/Lean Beef) with fibrous vegetables and healthy fats.\n`;
  mealPlan += `- Hydration: Aim for 3-4 liters daily, plus electrolytes during heavy training.`;

  mealPlanOutput.textContent = mealPlan;
  mealForm.querySelector('button').disabled = false;
  mealForm.querySelector('button').textContent = 'Generate Meal Plan';
});

documentForm.addEventListener('submit', async event => {
  event.preventDefault();
  const file = docFileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const doc = {
      id: Date.now(),
      name: docNameInput.value.trim() || file.name,
      fileName: file.name,
      type: file.type,
      data: e.target.result,
      timestamp: Date.now()
    };

    const docs = [doc, ...(getStorage(DOCUMENTS_KEY) || [])];
    setStorage(DOCUMENTS_KEY, docs);
    renderDocumentList();
    documentForm.reset();
    alert('Document saved successfully.');
  };
  reader.readAsDataURL(file);
});

function renderDocumentList() {
  const docs = getStorage(DOCUMENTS_KEY) || [];
  documentList.innerHTML = '';

  if (!docs.length) {
    documentList.innerHTML = '<p class="empty-state">No documents uploaded yet.</p>';
    return;
  }

  docs.forEach(doc => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <div>
        <strong>${doc.name}</strong>
        <p style="font-size: 0.8rem; color: #7d83a5;">${doc.fileName} — ${formatDate(doc.timestamp)}</p>
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <button class="nav-button" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="viewDocument(${doc.id})">View</button>
        <button class="nav-button" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; background: #ff4f4f;" onclick="deleteDocument(${doc.id})">Delete</button>
      </div>
    `;
    documentList.appendChild(item);
  });
}

window.viewDocument = (id) => {
  const docs = getStorage(DOCUMENTS_KEY) || [];
  const doc = docs.find(d => d.id === id);
  if (doc) {
    const win = window.open();
    win.document.write(`<iframe src="${doc.data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
  }
};

window.deleteDocument = (id) => {
  if (confirm('Are you sure you want to delete this document?')) {
    let docs = getStorage(DOCUMENTS_KEY) || [];
    docs = docs.filter(d => d.id !== id);
    setStorage(DOCUMENTS_KEY, docs);
    renderDocumentList();
  }
};

healthForm.addEventListener('submit', event => {
  event.preventDefault();
  const water = parseFloat(waterInput.value);
  const sleep = parseFloat(sleepInput.value);

  const entry = {
    timestamp: Date.now(),
    water,
    sleep
  };

  const records = [entry, ...(getStorage(HEALTH_RECORDS_KEY) || [])];
  setStorage(HEALTH_RECORDS_KEY, records);
  renderHealthChart();
  healthForm.reset();
  alert('Health metrics logged.');
});

function renderHealthChart() {
  const records = (getStorage(HEALTH_RECORDS_KEY) || []).slice(0, 7).reverse();
  const ctx = healthChart.getContext('2d');
  const width = healthChart.width;
  const height = healthChart.height;
  ctx.clearRect(0, 0, width, height);

  if (!records.length) {
    ctx.fillStyle = '#7d83a5';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('Log health data to see trends', 20, height / 2);
    return;
  }

  const padding = 40;
  const maxWater = Math.max(...records.map(r => r.water), 4);
  const maxSleep = Math.max(...records.map(r => r.sleep), 10);

  // Draw Water (Blue Line)
  ctx.strokeStyle = '#64b5f6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  records.forEach((r, i) => {
    const x = padding + (i / (records.length - 1 || 1)) * (width - padding * 2);
    const y = height - padding - (r.water / maxWater) * (height - padding * 2);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw Sleep (Orange Line)
  ctx.strokeStyle = '#ffb74d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  records.forEach((r, i) => {
    const x = padding + (i / (records.length - 1 || 1)) * (width - padding * 2);
    const y = height - padding - (r.sleep / maxSleep) * (height - padding * 2);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = '#7d83a5';
  ctx.font = '12px Inter, sans-serif';
  ctx.fillText('Blue: Water (L) | Orange: Sleep (H)', padding, 20);
}

function initialize() {
  loadProfile();
  renderDashboardSummary();
  renderWeaknesses();
}

initialize();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('Service worker registered.'))
      .catch(error => console.error('Service worker registration failed:', error));
  });
}
