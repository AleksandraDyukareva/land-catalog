// ====================================================
// НАСТРОЙКА: Published key из ссылки вида
// https://docs.google.com/spreadsheets/d/e/KEY/pubhtml
// ====================================================
const SHEET_ID = '2PACX-1vSaEI2_ksNU-MuzD84WEk8AVBRDbueDy2FNPuDQZ0bAmCl-s4mRGiCSKLwjh1bOVF1NrElWnFwCFbNa';
const SHEET_NAME = 'Объекты';

// Fallback — тестовые данные, пока не подключена таблица
const DEMO_DATA = [
  {
    id: '1',
    name: 'Участок у д. Петрово',
    cadastral: '50:09:0060301:119',
    address: 'МО, Раменский район, д. Петрово',
    lat: 55.6012,
    lng: 38.2145,
    area_ha: 2.5,
    price: 3500000,
    land_category: 'Земли сельскохозяйственного назначения',
    vri: 'Для ведения личного подсобного хозяйства',
    utilities: 'Электричество 200м, газ 500м',
    status: 'available',
    photos: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    description: 'Ровный участок с хорошим подъездом. Рядом река. Коммуникации в шаговой доступности.',
  },
  {
    id: '2',
    name: 'Участок в с. Новое',
    cadastral: '50:23:0040205:88',
    address: 'МО, Раменский район, с. Новое',
    lat: 55.5720,
    lng: 38.1900,
    area_ha: 10.0,
    price: 12000000,
    land_category: 'Земли сельскохозяйственного назначения',
    vri: 'Для ведения крестьянского (фермерского) хозяйства',
    utilities: 'Отсутствуют',
    status: 'available',
    photos: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    description: 'Большой массив, ровный рельеф, хороший выход к дороге.',
  },
  {
    id: '3',
    name: 'Участок у п. Заозёрный',
    cadastral: '50:09:0012003:45',
    address: 'МО, Раменский район, п. Заозёрный',
    lat: 55.6300,
    lng: 38.3200,
    area_ha: 0.8,
    price: 1800000,
    land_category: 'Земли населённых пунктов',
    vri: 'Индивидуальное жилищное строительство (ИЖС)',
    utilities: 'Электричество, вода — по границе участка',
    status: 'reserved',
    photos: '',
    description: 'Участок под строительство дома. Все коммуникации по границе.',
  },
  {
    id: '4',
    name: 'Участок у д. Михалёво',
    cadastral: '50:09:0030101:200',
    address: 'МО, Раменский район, д. Михалёво',
    lat: 55.5500,
    lng: 38.2800,
    area_ha: 5.2,
    price: 6500000,
    land_category: 'Земли сельскохозяйственного назначения',
    vri: 'Сельскохозяйственное использование',
    utilities: 'Электричество 1км',
    status: 'sold',
    photos: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
    description: 'Продан. Участок с хорошим рельефом у леса.',
  },
];

// ====================================================
// State
// ====================================================
let allObjects = [];
let filteredObjects = [];
let markers = {};
let map;
let activeCardId = null;

// ====================================================
// Init
// ====================================================
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  loadData();
  bindFilters();
});

function initMap() {
  map = L.map('map', { zoomControl: true }).setView([55.58, 38.2], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19,
  }).addTo(map);
}

// ====================================================
// Data loading
// ====================================================
async function loadData() {
  if (SHEET_ID === 'YOUR_SHEET_ID') {
    allObjects = DEMO_DATA;
    onDataLoaded();
    return;
  }

  try {
    // Google Sheets published as CSV (published key from /d/e/KEY/pubhtml)
    const url = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?output=csv`;
    const resp = await fetch(url);
    const csv = await resp.text();
    allObjects = parseCSV(csv);
    onDataLoaded();
  } catch (e) {
    console.error('Ошибка загрузки таблицы:', e);
    allObjects = DEMO_DATA;
    onDataLoaded();
  }
}

function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = parseCSVRow(lines[0]);
  return lines.slice(1).map((line, i) => {
    const vals = parseCSVRow(line);
    const obj = { id: String(i + 1) };
    headers.forEach((h, idx) => { obj[h.trim().toLowerCase().replace(/\s+/g, '_')] = (vals[idx] || '').trim(); });
    obj.lat = parseFloat(obj.lat) || 0;
    obj.lng = parseFloat(obj.lng) || 0;
    obj.area_ha = parseFloat(obj.area_ha) || 0;
    obj.price = parseInt((obj.price || '').replace(/\D/g, '')) || 0;
    return obj;
  }).filter(o => o.lat && o.lng);
}

function parseCSVRow(row) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (inQuotes && row[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

function onDataLoaded() {
  populateCategoryFilter();
  applyFilters();
  updateStats();
}

// ====================================================
// Filters
// ====================================================
function bindFilters() {
  document.querySelectorAll('#filter-status input').forEach(cb => cb.addEventListener('change', applyFilters));
  document.getElementById('filter-category').addEventListener('change', applyFilters);
  document.getElementById('filter-area-min').addEventListener('input', applyFilters);
  document.getElementById('filter-area-max').addEventListener('input', applyFilters);
  document.getElementById('filter-price-min').addEventListener('input', applyFilters);
  document.getElementById('filter-price-max').addEventListener('input', applyFilters);
  document.getElementById('list-sort').addEventListener('change', applyFilters);
  document.getElementById('btn-reset').addEventListener('click', resetFilters);
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
}

function populateCategoryFilter() {
  const cats = [...new Set(allObjects.map(o => o.land_category).filter(Boolean))];
  const sel = document.getElementById('filter-category');
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  });
}

function applyFilters() {
  const statuses = [...document.querySelectorAll('#filter-status input:checked')].map(cb => cb.value);
  const category = document.getElementById('filter-category').value;
  const areaMin = parseFloat(document.getElementById('filter-area-min').value) || 0;
  const areaMax = parseFloat(document.getElementById('filter-area-max').value) || Infinity;
  const priceMin = parseInt(document.getElementById('filter-price-min').value) || 0;
  const priceMax = parseInt(document.getElementById('filter-price-max').value) || Infinity;
  const sort = document.getElementById('list-sort').value;

  filteredObjects = allObjects.filter(o =>
    statuses.includes(o.status) &&
    (!category || o.land_category === category) &&
    o.area_ha >= areaMin && o.area_ha <= areaMax &&
    (o.price === 0 || (o.price >= priceMin && o.price <= priceMax))
  );

  filteredObjects.sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'area-asc') return a.area_ha - b.area_ha;
    if (sort === 'area-desc') return b.area_ha - a.area_ha;
    return 0;
  });

  renderList();
  renderMarkers();
  updateStats();
}

function resetFilters() {
  document.querySelectorAll('#filter-status input').forEach(cb => cb.checked = true);
  document.getElementById('filter-category').value = '';
  document.getElementById('filter-area-min').value = '';
  document.getElementById('filter-area-max').value = '';
  document.getElementById('filter-price-min').value = '';
  document.getElementById('filter-price-max').value = '';
  applyFilters();
}

// ====================================================
// Render list
// ====================================================
function renderList() {
  const list = document.getElementById('object-list');
  document.getElementById('list-count').textContent = `${filteredObjects.length} объект${plural(filteredObjects.length)}`;
  list.innerHTML = '';
  if (!filteredObjects.length) {
    list.innerHTML = '<div class="loading">Нет объектов</div>';
    return;
  }
  filteredObjects.forEach(obj => {
    const card = document.createElement('div');
    card.className = 'obj-card' + (obj.id === activeCardId ? ' active' : '');
    card.dataset.id = obj.id;
    const firstPhoto = (obj.photos || '').split(',')[0].trim();
    card.innerHTML = `
      <div class="obj-card__top">
        <div class="obj-card__name">${obj.name}</div>
        ${firstPhoto
          ? `<img class="obj-card__photo" src="${firstPhoto}" alt="" onerror="this.style.display='none'">`
          : `<div class="obj-card__photo-placeholder"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg></div>`
        }
      </div>
      <div class="obj-card__meta">
        <span>${obj.area_ha} га</span>
        <span class="sep">·</span>
        <span>${obj.address || ''}</span>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px;">
        <div class="obj-card__price">${formatPrice(obj.price)}</div>
        <div class="obj-card__status status-${obj.status}">${statusLabel(obj.status)}</div>
      </div>
    `;
    card.addEventListener('click', () => selectObject(obj));
    list.appendChild(card);
  });
}

// ====================================================
// Render markers
// ====================================================
function renderMarkers() {
  Object.values(markers).forEach(m => map.removeLayer(m));
  markers = {};

  filteredObjects.forEach(obj => {
    if (!obj.lat || !obj.lng) return;
    const color = { available: '#2d7a3a', reserved: '#e67e22', sold: '#9ca3af' }[obj.status] || '#2d7a3a';
    const icon = L.divIcon({
      className: '',
      html: `<div style="width:28px;height:28px;background:${color};border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -30],
    });

    const firstPhoto = (obj.photos || '').split(',')[0].trim();
    const marker = L.marker([obj.lat, obj.lng], { icon }).addTo(map);
    marker.bindPopup(buildPopup(obj, firstPhoto), { maxWidth: 300 });
    marker.on('click', () => {
      setActiveCard(obj.id);
      scrollToCard(obj.id);
    });
    markers[obj.id] = marker;
  });
}

function buildPopup(obj, photo) {
  return `<div class="popup-inner">
    ${photo ? `<img src="${photo}" alt="" style="width:100%;height:130px;object-fit:cover;border-radius:8px;margin-bottom:10px;" onerror="this.style.display='none'">` : ''}
    <h3>${obj.name}</h3>
    <div class="popup-meta">${obj.area_ha} га · ${obj.land_category || ''}</div>
    <div class="popup-meta">${obj.address || ''}</div>
    <div class="popup-price">${formatPrice(obj.price)}</div>
    <div class="obj-card__status status-${obj.status}" style="margin-bottom:8px;">${statusLabel(obj.status)}</div>
    <button class="popup-btn" onclick="openModal('${obj.id}')">Подробнее</button>
  </div>`;
}

// ====================================================
// Object selection
// ====================================================
function selectObject(obj) {
  setActiveCard(obj.id);
  if (markers[obj.id]) {
    map.flyTo([obj.lat, obj.lng], 14, { animate: true, duration: 0.8 });
    markers[obj.id].openPopup();
  }
}

function setActiveCard(id) {
  activeCardId = id;
  document.querySelectorAll('.obj-card').forEach(el => {
    el.classList.toggle('active', el.dataset.id === id);
  });
}

function scrollToCard(id) {
  const el = document.querySelector(`.obj-card[data-id="${id}"]`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ====================================================
// Modal (task 4)
// ====================================================
window.openModal = function(id) {
  const obj = allObjects.find(o => o.id === id);
  if (!obj) return;
  const photos = (obj.photos || '').split(',').map(p => p.trim()).filter(Boolean);
  const pricePerHa = obj.price && obj.area_ha ? Math.round(obj.price / obj.area_ha) : null;

  const cadastralLink = obj.cadastral
    ? `https://rosreestr.gov.ru/wps/portal/p/cc_present/ir_egrn#!query=${encodeURIComponent(obj.cadastral)}`
    : null;
  const nspdLink = obj.cadastral
    ? `https://nspd.gov.ru/?cadastralNumber=${encodeURIComponent(obj.cadastral)}`
    : null;

  document.getElementById('modal-body').innerHTML = `
    ${photos.length ? `<div class="modal-gallery">${photos.map(p => `<img src="${p}" alt="" onerror="this.style.display='none'">`).join('')}</div>` : ''}
    <div class="modal-title">${obj.name}</div>
    <div class="modal-status-row">
      <div class="obj-card__status status-${obj.status}">${statusLabel(obj.status)}</div>
      <div class="modal-price">${formatPrice(obj.price)}</div>
      ${pricePerHa ? `<div class="modal-price-per-ha">${formatPrice(pricePerHa)} / га</div>` : ''}
    </div>
    <div class="modal-grid">
      ${field('Площадь', obj.area_ha ? `${obj.area_ha} га` : '—')}
      ${field('Кадастровый номер', obj.cadastral || '—')}
      ${field('Категория земель', obj.land_category || '—')}
      ${field('ВРИ', obj.vri || '—')}
      ${field('Коммуникации', obj.utilities || '—')}
      ${field('Адрес', obj.address || '—')}
      ${obj.extra_field_1 ? field('Рельеф', obj.extra_field_1) : ''}
      ${obj.extra_field_2 ? field('Доп. информация', obj.extra_field_2) : ''}
    </div>
    ${obj.description ? `
      <div class="modal-section-title">Описание</div>
      <div class="modal-description">${obj.description}</div>
    ` : ''}
    <div class="modal-links">
      ${cadastralLink ? `<a class="modal-link modal-link-rosreestr" href="${cadastralLink}" target="_blank">Росреестр</a>` : ''}
      ${nspdLink ? `<a class="modal-link modal-link-nspd" href="${nspdLink}" target="_blank">НСПД</a>` : ''}
    </div>
  `;

  document.getElementById('modal-overlay').classList.add('open');
};

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function field(label, value) {
  return `<div class="modal-field">
    <div class="modal-field__label">${label}</div>
    <div class="modal-field__value">${value}</div>
  </div>`;
}

// ====================================================
// Stats header
// ====================================================
function updateStats() {
  const available = allObjects.filter(o => o.status === 'available').length;
  const total = allObjects.length;
  document.getElementById('stats').textContent = `${total} объект${plural(total)} · ${available} в продаже`;
}

// ====================================================
// Helpers
// ====================================================
function formatPrice(price) {
  if (!price) return 'Цена по запросу';
  if (price >= 1000000) return `${(price / 1000000).toFixed(1).replace('.0', '')} млн ₽`;
  if (price >= 1000) return `${Math.round(price / 1000)} тыс ₽`;
  return `${price} ₽`;
}

function statusLabel(status) {
  return { available: 'Продаётся', reserved: 'Зарезервирован', sold: 'Продан' }[status] || status;
}

function plural(n) {
  if (n % 10 === 1 && n % 100 !== 11) return '';
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'а';
  return 'ов';
}
