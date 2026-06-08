// ============================================================
// Центральный модуль данных — используется catalog, objects, object страницами
// ============================================================
const SHEET_ID = '2PACX-1vSaEI2_ksNU-MuzD84WEk8AVBRDbueDy2FNPuDQZ0bAmCl-s4mRGiCSKLwjh1bOVF1NrElWnFwCFbNa';

const DEMO_OBJECTS = [
  {
    id: '1', type: 'land',
    name: 'Участок под инвестиции, 15 га',
    highway: 'Ленинградское',
    cadastral: '50:10:0020304:77',
    address: 'МО, Солнечногорский р-н, д. Берёзово',
    lat: 56.18, lng: 36.98,
    area_ha: 15, building_area: '', price: 45000000,
    land_category: 'Земли сельскохозяйственного назначения',
    vri: 'Для ведения крестьянского (фермерского) хозяйства',
    utilities: 'Электричество 300м, газ 1.2км',
    status: 'available',
    photos: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900,https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900,https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900',
    description: 'Крупный инвестиционный массив на Ленинградском направлении. Ровный рельеф, пахотные угодья. Перспективный район с активной застройкой — в 3 км строится новый жилой квартал. Возможна разбивка на участки под ЛПХ.\n\nЗемля прошла полную проверку: обременений нет, границы уточнены, документы в порядке. Продавец готов к переговорам.',
    floors: '', ceiling_height: '', loading_docks: '', power_kw: '', year_built: '',
    extra_info: 'Возможен раздел на части от 3 га'
  },
  {
    id: '2', type: 'land',
    name: 'Участок ЛПХ, 2.5 га',
    highway: 'Дмитровское',
    cadastral: '50:09:0060301:119',
    address: 'МО, Дмитровский р-н, д. Петрово',
    lat: 56.35, lng: 37.54,
    area_ha: 2.5, building_area: '', price: 3500000,
    land_category: 'Земли сельскохозяйственного назначения',
    vri: 'Для ведения личного подсобного хозяйства',
    utilities: 'Электричество 200м, газ 500м',
    status: 'available',
    photos: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=900,https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900',
    description: 'Ровный участок с удобным въездом с грунтовой дороги. Рядом — небольшая речка. Газ и электричество в шаговой доступности.\n\nОтличный вариант для строительства загородного дома или фермерского хозяйства. Тихое место, соседей нет.',
    floors: '', ceiling_height: '', loading_docks: '', power_kw: '', year_built: '',
    extra_info: ''
  },
  {
    id: '3', type: 'land',
    name: 'Участок под ИЖС, 12 соток',
    highway: 'Новорижское',
    cadastral: '50:20:0010502:34',
    address: 'МО, Истринский р-н, п. Заречье',
    lat: 55.91, lng: 36.88,
    area_ha: 0.12, building_area: '', price: 5200000,
    land_category: 'Земли населённых пунктов',
    vri: 'Индивидуальное жилищное строительство (ИЖС)',
    utilities: 'Электричество, вода, газ — по границе участка',
    status: 'available',
    photos: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900',
    description: 'Участок в развитом посёлке на Новорижском направлении. Все коммуникации подведены по границе — можно сразу начинать строительство. Асфальтированный въезд, охраняемый посёлок.',
    floors: '', ceiling_height: '', loading_docks: '', power_kw: '', year_built: '',
    extra_info: 'Рядом детский сад, магазины'
  },
  {
    id: '4', type: 'land',
    name: 'Поле под разбивку, 8 га',
    highway: 'Ярославское',
    cadastral: '50:13:0040120:55',
    address: 'МО, Пушкинский р-н, д. Новосёлово',
    lat: 56.12, lng: 38.05,
    area_ha: 8, building_area: '', price: 18000000,
    land_category: 'Земли сельскохозяйственного назначения',
    vri: 'Для ведения личного подсобного хозяйства',
    utilities: 'Электричество 400м',
    status: 'reserved',
    photos: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900,https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900',
    description: 'Массив под разбивку на участки по 10–15 соток. Рядом проходит газопровод — возможность подключения. Хороший инвестиционный потенциал в популярном Ярославском направлении.',
    floors: '', ceiling_height: '', loading_docks: '', power_kw: '', year_built: '',
    extra_info: 'Под разбивку: ~50 участков по 10-15 соток'
  },
  {
    id: '5', type: 'warehouse',
    name: 'Складской комплекс, 2 000 кв.м',
    highway: 'Ярославское',
    cadastral: '50:13:0080210:102',
    address: 'МО, Мытищинский р-н, Промзона Пироговская',
    lat: 55.97, lng: 37.72,
    area_ha: 0.8, building_area: 2000, price: 85000000,
    land_category: 'Земли населённых пунктов',
    vri: 'Для размещения производственных и административных зданий',
    utilities: 'Электричество 350 кВт, вода, канализация, газ',
    status: 'available',
    photos: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=900,https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900,https://images.unsplash.com/photo-1565891741441-64926e441838?w=900',
    description: 'Отапливаемый складской комплекс класса B+ с удобным расположением на Ярославском шоссе. Два въезда с асфальтом, большая парковка для фур.\n\nПомещение в хорошем состоянии, системы пожаротушения и видеонаблюдения. Подходит для e-commerce, оптовой торговли, производства.',
    floors: '1', ceiling_height: '10', loading_docks: '4 ворот (докового типа)', power_kw: '350', year_built: '2012',
    extra_info: 'Охрана 24/7, система пожаротушения'
  },
  {
    id: '6', type: 'production',
    name: 'Производственная база, 4 500 кв.м',
    highway: 'Симферопольское',
    cadastral: '50:27:0060108:88',
    address: 'МО, Подольский р-н, г. Климовск',
    lat: 55.37, lng: 37.53,
    area_ha: 1.5, building_area: 4500, price: 220000000,
    land_category: 'Земли населённых пунктов',
    vri: 'Производственная деятельность',
    utilities: 'Электричество 1 МВт, газ, вода, канализация, ж/д ветка',
    status: 'available',
    photos: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900,https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900',
    description: 'Производственно-складской комплекс с отдельным административным корпусом. Собственная железнодорожная ветка — уникальное преимущество для крупных грузопотоков.\n\nПлощадки для отстоя техники, трансформаторная подстанция 1 МВт собственная. Подходит для машиностроения, металлообработки, пищевого производства.',
    floors: '2', ceiling_height: '12', loading_docks: '8 ворот + ж/д ветка', power_kw: '1000', year_built: '1989',
    extra_info: 'Административный корпус 600 кв.м, ж/д ветка, трансформатор 1МВт'
  },
  {
    id: '7', type: 'building',
    name: 'Торгово-офисное здание, 900 кв.м',
    highway: 'Калужское',
    cadastral: '50:21:0130405:200',
    address: 'МО, Троицк, ул. Промышленная, 14',
    lat: 55.48, lng: 37.29,
    area_ha: 0.25, building_area: 900, price: 72000000,
    land_category: 'Земли населённых пунктов',
    vri: 'Для размещения объектов торговли и обслуживания',
    utilities: 'Электричество 150 кВт, вода, канализация, газ, интернет',
    status: 'available',
    photos: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900,https://images.unsplash.com/photo-1497366216548-37526070297c?w=900',
    description: 'Отдельно стоящее здание на первой линии с парковкой на 20 машин. Сейчас сдаётся в аренду — стабильный арендный поток. Возможна продажа с арендаторами как готовый бизнес.\n\nПервый этаж — торговые помещения, второй — офисы. Отдельные входы, современные коммуникации.',
    floors: '2', ceiling_height: '4.2', loading_docks: '1 грузовой', power_kw: '150', year_built: '2008',
    extra_info: 'Сдаётся в аренду, стабильный арендный доход'
  },
  {
    id: '8', type: 'land',
    name: 'Участок КФХ, 45 га',
    highway: 'Волоколамское',
    cadastral: '50:06:0010302:41',
    address: 'МО, Волоколамский р-н, д. Суворово',
    lat: 56.02, lng: 35.95,
    area_ha: 45, building_area: '', price: 90000000,
    land_category: 'Земли сельскохозяйственного назначения',
    vri: 'Для ведения крестьянского (фермерского) хозяйства',
    utilities: 'Электричество 800м',
    status: 'available',
    photos: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900,https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900',
    description: 'Большой сельскохозяйственный массив на Волоколамском направлении. Плодородные земли, частично обработаны. Рядом река, удобный подъезд с трассы.\n\nПодходит для фермерства, агробизнеса, или как инвестиция с последующей разбивкой.',
    floors: '', ceiling_height: '', loading_docks: '', power_kw: '', year_built: '',
    extra_info: 'Частично обработано, есть старые постройки'
  },
];

// ============================================================
// Загрузка данных из Google Sheets
// ============================================================
async function loadObjects() {
  if (SHEET_ID === 'YOUR_SHEET_ID') return DEMO_OBJECTS;
  try {
    const url = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?output=csv`;
    const resp = await fetch(url);
    const csv = await resp.text();
    const parsed = parseCSV(csv);
    return parsed.length > 0 ? parsed : DEMO_OBJECTS;
  } catch (e) {
    console.error('Ошибка загрузки:', e);
    return DEMO_OBJECTS;
  }
}

function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = parseCSVRow(lines[0]);
  return lines.slice(1).map((line, i) => {
    const vals = parseCSVRow(line);
    const obj = { id: String(i + 1) };
    headers.forEach((h, idx) => {
      obj[h.trim().toLowerCase().replace(/\s+/g, '_')] = (vals[idx] || '').trim();
    });
    obj.lat = parseFloat(obj.lat) || 0;
    obj.lng = parseFloat(obj.lng) || 0;
    obj.area_ha = parseFloat(obj.area_ha) || 0;
    obj.building_area = parseFloat(obj.building_area) || 0;
    obj.price = parseInt((obj.price || '').replace(/\D/g, '')) || 0;
    if (!obj.id) obj.id = String(i + 1);
    return obj;
  }).filter(o => o.name);
}

function parseCSVRow(row) {
  const result = []; let cur = ''; let inQ = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') { if (inQ && row[i+1] === '"') { cur += '"'; i++; } else inQ = !inQ; }
    else if (ch === ',' && !inQ) { result.push(cur); cur = ''; }
    else cur += ch;
  }
  result.push(cur);
  return result;
}

// ============================================================
// Хелперы
// ============================================================
function formatPrice(price) {
  if (!price) return 'Цена по запросу';
  if (price >= 1000000) return `${(price/1000000).toFixed(1).replace(/\.0$/,'')} млн ₽`;
  if (price >= 1000) return `${Math.round(price/1000)} тыс ₽`;
  return `${price} ₽`;
}

function statusLabel(s) {
  return { available: 'Продаётся', reserved: 'Зарезервирован', sold: 'Продан' }[s] || s;
}

function typeLabel(t) {
  return { land: 'Участок', warehouse: 'Склад', production: 'Производство', building: 'Здание' }[t] || t;
}

function typeIcon(t) {
  const icons = {
    land: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 6l9-4 9 4v12l-9 4-9-4V6z"/></svg>',
    warehouse: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 7l8-4 8 4v10H2V7z"/><path d="M8 17v-5h4v5"/></svg>',
    production: '<svg viewBox="0 0 20 20" fill="currentColor"><rect x="2" y="8" width="16" height="9" rx="1"/><path d="M6 8V5h8v3"/><circle cx="10" cy="4" r="1"/></svg>',
    building: '<svg viewBox="0 0 20 20" fill="currentColor"><rect x="3" y="2" width="14" height="16" rx="1"/><rect x="7" y="6" width="2" height="2"/><rect x="11" y="6" width="2" height="2"/><rect x="7" y="10" width="2" height="2"/><rect x="11" y="10" width="2" height="2"/><rect x="8" y="14" width="4" height="4"/></svg>'
  };
  return icons[t] || icons.land;
}

const ALL_HIGHWAYS = [
  'Ленинградское', 'Дмитровское', 'Ярославское', 'Щёлковское',
  'Горьковское', 'Рязанское', 'Симферопольское', 'Калужское',
  'Киевское', 'Минское', 'Новорижское', 'Волоколамское'
];
