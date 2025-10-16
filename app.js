const storageKey = 'cmc-icon-manager';

const seedIcons = [
  {
    id: 'ai-spark',
    name: 'AI Spark',
    category: 'AI',
    style: 'Linear',
    tags: ['ai', 'automation', 'spark'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3"/><path d="M12 18v3"/><path d="M5.636 5.636l2.121 2.121"/><path d="M16.243 16.243l2.121 2.121"/><path d="M3 12h3"/><path d="M18 12h3"/><path d="M5.636 18.364l2.121-2.121"/><path d="M16.243 7.757l2.121-2.121"/><circle cx="12" cy="12" r="4"/></svg>`,
    updatedAt: Date.now() - 86400000
  },
  {
    id: 'business-chart',
    name: 'Business Chart',
    category: 'Business',
    style: 'Outline',
    tags: ['analytics', 'dashboard'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v18"/><path d="M5 19h14"/><rect x="8" y="11" width="2.5" height="5" rx="0.5"/><rect x="12" y="7" width="2.5" height="9" rx="0.5"/><rect x="16" y="9" width="2.5" height="7" rx="0.5"/></svg>`,
    updatedAt: Date.now() - 43200000
  },
  {
    id: 'arrow-loop',
    name: 'Arrow Loop',
    category: 'Arrow',
    style: 'Linear',
    tags: ['navigation', 'refresh'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 7.5h9v-3"/><path d="M16.5 4.5c1.933 1.474 3.5 4.106 3.5 6.5a7.5 7.5 0 0 1-13.818 3"/><path d="m6 7.5 3 3"/></svg>`,
    updatedAt: Date.now() - 3600000
  },
  {
    id: 'shield-guard',
    name: 'Shield Guard',
    category: 'Security',
    style: 'Bold',
    tags: ['security', 'shield', 'safe'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v5c0 5.25 3.114 10.02 7 10.5 3.886-.48 7-5.25 7-10.5V6l-7-3Z"/><path d="M9 12.5 11 14l4-4"/></svg>`,
    updatedAt: Date.now() - 5400000
  },
  {
    id: 'chat-bubble',
    name: 'Chat Bubble',
    category: 'Communication',
    style: 'Linear',
    tags: ['chat', 'message', 'support'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5c0-1.105.895-2 2-2h12c1.105 0 2 .895 2 2v7c0 1.105-.895 2-2 2H9l-4.5 4v-4H6c-1.105 0-2-.895-2-2v-7Z"/><path d="M8 8.5h8"/><path d="M8 11.5h5"/></svg>`,
    updatedAt: Date.now() - 280000
  },
  {
    id: 'cloud-upload',
    name: 'Cloud Upload',
    category: 'Cloud',
    style: 'Twotone',
    tags: ['cloud', 'upload', 'storage'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 19h9a4.5 4.5 0 0 0 0-9 5 5 0 0 0-9.8-.9A3.5 3.5 0 0 0 7.5 19Z" opacity="0.4"/><path d="M12 15.5V9.5"/><path d="m9.5 12 2.5-2.5L14.5 12"/></svg>`,
    updatedAt: Date.now() - 120000
  }
];

const deepClone = (value) =>
  typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));

const defaultState = {
  icons: seedIcons,
  tags: Array.from(new Set(seedIcons.flatMap((icon) => icon.tags))).sort(),
  categories: Array.from(new Set(seedIcons.map((icon) => icon.category))).sort(),
  presets: [
    { id: 'preset-default', name: 'Default 24px', size: 24, stroke: 1.5, color: '#2f6fed', corner: 0 },
    { id: 'preset-bold', name: 'Bold 32px', size: 32, stroke: 2, color: '#1d4ed8', corner: 0 }
  ],
  packs: [],
  roles: [
    {
      id: 'role-admin',
      name: 'Admin',
      permissions: { upload: true, edit: true, export: true }
    },
    {
      id: 'role-designer',
      name: 'Designer',
      permissions: { upload: true, edit: true, export: false }
    },
    {
      id: 'role-dev',
      name: 'Dev',
      permissions: { upload: false, edit: false, export: true }
    }
  ],
  projects: [
    {
      id: 'project-app',
      name: 'CMC App Suite',
      brand: 'Consumer',
      iconIds: ['chat-bubble', 'cloud-upload']
    },
    {
      id: 'project-portal',
      name: 'CMC Admin Portal',
      brand: 'Enterprise',
      iconIds: ['business-chart', 'shield-guard']
    }
  ]
};

const filters = {
  search: '',
  style: 'all',
  category: 'all',
  tag: 'all'
};

const previewState = {
  size: 128,
  stroke: 1,
  color: '#2f6fed'
};

let state = loadState();
let selectedIconId = state.icons[0]?.id ?? null;
const selectedIcons = new Set();

// DOM references
const iconGrid = document.getElementById('icon-grid');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search');
const styleFilter = document.getElementById('style-filter');
const categoryFilter = document.getElementById('category-filter');
const tagFilter = document.getElementById('tag-filter');
const iconCount = document.getElementById('icon-count');
const categoryCount = document.getElementById('category-count');
const styleCount = document.getElementById('style-count');
const tagList = document.getElementById('tag-list');
const categoryList = document.getElementById('category-list');
const dropzone = document.getElementById('dropzone');
const uploadInput = document.getElementById('upload-input');
const previewContainer = document.getElementById('preview');
const iconMeta = document.getElementById('icon-meta');
const similarIconsContainer = document.getElementById('similar-icons');
const sizeControl = document.getElementById('size-control');
const sizeOutput = document.getElementById('size-output');
const strokeControl = document.getElementById('stroke-control');
const colorControl = document.getElementById('color-control');
const copySvgBtn = document.getElementById('copy-svg');
const exportPngBtn = document.getElementById('export-png');
const savePresetBtn = document.getElementById('save-preset');
const presetList = document.getElementById('preset-list');
const selectAllCheckbox = document.getElementById('select-all');
const downloadSelectedBtn = document.getElementById('download-selected');
const createPackBtn = document.getElementById('create-pack');
const resetDemoBtn = document.getElementById('reset-demo');
const packModal = document.getElementById('pack-modal');
const closePackBtn = document.getElementById('close-pack');
const packForm = document.getElementById('pack-form');
const roleList = document.getElementById('role-list');
const projectList = document.getElementById('project-list');
const addProjectBtn = document.getElementById('add-project');
const lintStrokeCheckbox = document.getElementById('lint-stroke');
const lintViewboxCheckbox = document.getElementById('lint-viewbox');
const lintFillCheckbox = document.getElementById('lint-fill');
const tagPanelBtn = document.querySelector('[data-action="add-tag"]');
const categoryPanelBtn = document.querySelector('[data-action="add-category"]');
const exportCanvas = document.getElementById('export-canvas');

init();

function init() {
  hydrateFilters();
  bindEvents();
  renderAll();
}

function loadState() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return deepClone(defaultState);
    const parsed = JSON.parse(raw);
    const merged = {
      ...deepClone(defaultState),
      ...parsed,
      icons: parsed.icons?.length ? parsed.icons : deepClone(defaultState.icons)
    };
    return merged;
  } catch (error) {
    console.warn('Failed to load state from storage, using defaults.', error);
    return deepClone(defaultState);
  }
}

function persistState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function hydrateFilters() {
  const styles = ['all', 'Outline', 'Bold', 'Linear', 'Twotone', 'Bulk', 'Broken', 'Custom'];
  renderSelectOptions(styleFilter, styles, 'Style (tất cả)');
  renderSelectOptions(categoryFilter, ['all', ...new Set(state.categories)], 'Category (tất cả)');
  renderSelectOptions(tagFilter, ['all', ...new Set(state.tags)], 'Tag (tất cả)');
}

function renderSelectOptions(select, options, placeholder) {
  select.innerHTML = '';
  options.forEach((option) => {
    const opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option === 'all' ? placeholder : option;
    select.appendChild(opt);
  });
}

function bindEvents() {
  searchInput.addEventListener('input', (event) => {
    filters.search = event.target.value.toLowerCase();
    renderIconGrid();
  });

  styleFilter.addEventListener('change', (event) => {
    filters.style = event.target.value;
    renderIconGrid();
  });

  categoryFilter.addEventListener('change', (event) => {
    filters.category = event.target.value;
    renderIconGrid();
  });

  tagFilter.addEventListener('change', (event) => {
    filters.tag = event.target.value;
    renderIconGrid();
  });

  dropzone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropzone.classList.add('dragging');
  });

  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragging'));
  dropzone.addEventListener('drop', handleFileDrop);
  uploadInput.addEventListener('change', handleFileSelect);

  sizeControl.addEventListener('input', (event) => {
    previewState.size = Number(event.target.value);
    sizeOutput.textContent = `${previewState.size}px`;
    renderPreview();
  });

  strokeControl.addEventListener('change', (event) => {
    previewState.stroke = Number(event.target.value);
    renderPreview();
  });

  colorControl.addEventListener('input', (event) => {
    previewState.color = event.target.value;
    renderPreview();
  });

  copySvgBtn.addEventListener('click', copySvgToClipboard);
  exportPngBtn.addEventListener('click', exportSvgToPng);
  savePresetBtn.addEventListener('click', handleSavePreset);

  presetList.addEventListener('click', (event) => {
    const item = event.target.closest('li[data-preset]');
    if (!item) return;
    const preset = state.presets.find((p) => p.id === item.dataset.preset);
    if (!preset) return;
    previewState.size = preset.size;
    previewState.stroke = preset.stroke;
    previewState.color = preset.color;
    sizeControl.value = preset.size;
    sizeOutput.textContent = `${preset.size}px`;
    strokeControl.value = String(preset.stroke);
    colorControl.value = preset.color;
    renderPreview();
  });

  selectAllCheckbox.addEventListener('change', (event) => {
    if (event.target.checked) {
      currentIcons().forEach((icon) => selectedIcons.add(icon.id));
    } else {
      selectedIcons.clear();
    }
    renderIconGrid();
  });

  downloadSelectedBtn.addEventListener('click', downloadSelectedIcons);
  createPackBtn.addEventListener('click', () => togglePackModal(true));
  closePackBtn.addEventListener('click', () => togglePackModal(false));
  packModal.addEventListener('click', (event) => {
    if (event.target === packModal) togglePackModal(false);
  });

  packForm.addEventListener('submit', handleCreatePack);

  tagPanelBtn.addEventListener('click', () => addTaxonomyItem('tag'));
  categoryPanelBtn.addEventListener('click', () => addTaxonomyItem('category'));

  tagList.addEventListener('click', (event) => {
    if (!event.target.matches('button.remove')) return;
    const value = event.target.closest('li').dataset.value;
    state.tags = state.tags.filter((tag) => tag !== value);
    persistState();
    hydrateFilters();
    updateTaxonomies();
    renderIconGrid();
  });

  categoryList.addEventListener('click', (event) => {
    if (!event.target.matches('button.remove')) return;
    const value = event.target.closest('li').dataset.value;
    state.categories = state.categories.filter((category) => category !== value);
    persistState();
    hydrateFilters();
    updateTaxonomies();
    renderIconGrid();
  });

  roleList.addEventListener('change', (event) => {
    const checkbox = event.target;
    if (!checkbox.matches('input[data-permission]')) return;
    const roleId = checkbox.closest('li').dataset.role;
    const permission = checkbox.dataset.permission;
    const role = state.roles.find((r) => r.id === roleId);
    if (!role) return;
    role.permissions[permission] = checkbox.checked;
    persistState();
  });

  addProjectBtn.addEventListener('click', () => {
    const name = prompt('Tên dự án/brand mới:');
    if (!name) return;
    const project = {
      id: `project-${crypto.randomUUID()}`,
      name,
      brand: 'Chưa phân loại',
      iconIds: []
    };
    state.projects.push(project);
    persistState();
    renderProjects();
  });

  resetDemoBtn.addEventListener('click', () => {
    const confirmed = confirm('Khôi phục dữ liệu demo ban đầu?');
    if (!confirmed) return;
    localStorage.removeItem(storageKey);
    state = deepClone(defaultState);
    selectedIcons.clear();
    selectedIconId = state.icons[0]?.id ?? null;
    previewState.size = 128;
    previewState.stroke = 1;
    previewState.color = '#2f6fed';
    hydrateFilters();
    renderAll();
  });
}

function renderAll() {
  updateStats();
  renderIconGrid();
  renderTaxonomies();
  renderPreview();
  renderPresets();
  renderRoles();
  renderProjects();
}

function currentIcons() {
  return state.icons.filter((icon) => {
    const matchesStyle = filters.style === 'all' || icon.style === filters.style;
    const matchesCategory = filters.category === 'all' || icon.category === filters.category;
    const matchesTag =
      filters.tag === 'all' || icon.tags.some((tag) => tag.toLowerCase() === filters.tag.toLowerCase());
    const query = filters.search.trim();
    const matchesSearch =
      !query ||
      icon.name.toLowerCase().includes(query) ||
      icon.tags.some((tag) => tag.toLowerCase().includes(query));
    return matchesStyle && matchesCategory && matchesTag && matchesSearch;
  });
}

function renderIconGrid() {
  const icons = currentIcons();
  iconGrid.innerHTML = '';
  emptyState.hidden = icons.length > 0;

  if (icons.length === 0) {
    selectAllCheckbox.checked = false;
    return;
  }

  icons.forEach((icon) => {
    const card = document.createElement('article');
    card.className = `icon-card${icon.id === selectedIconId ? ' active' : ''}`;
    card.dataset.icon = icon.id;
    card.innerHTML = `
      <input type="checkbox" ${selectedIcons.has(icon.id) ? 'checked' : ''} aria-label="Chọn icon" />
      <div class="icon-preview">${icon.svg}</div>
      <footer>
        <span class="name">${icon.name}</span>
        <div class="meta">
          <span>${icon.category}</span>
          <span>${icon.style}</span>
        </div>
      </footer>
    `;

    card.addEventListener('click', (event) => {
      if (event.target.matches('input[type="checkbox"]')) {
        event.stopPropagation();
        toggleSelected(icon.id, event.target.checked);
      } else {
        setSelectedIcon(icon.id);
      }
    });

    iconGrid.appendChild(card);
  });

  const allVisibleSelected = icons.every((icon) => selectedIcons.has(icon.id));
  selectAllCheckbox.checked = allVisibleSelected && icons.length > 0;
}

function setSelectedIcon(iconId) {
  selectedIconId = iconId;
  renderIconGrid();
  renderPreview();
}

function toggleSelected(iconId, checked) {
  if (checked) {
    selectedIcons.add(iconId);
  } else {
    selectedIcons.delete(iconId);
  }
  renderIconGrid();
}

function updateStats() {
  iconCount.textContent = state.icons.length;
  categoryCount.textContent = new Set(state.icons.map((icon) => icon.category)).size;
  styleCount.textContent = new Set(state.icons.map((icon) => icon.style)).size;
}

function renderPreview() {
  const icon = state.icons.find((item) => item.id === selectedIconId);
  previewContainer.innerHTML = '';
  iconMeta.innerHTML = '';
  similarIconsContainer.innerHTML = '';

  if (!icon) {
    previewContainer.innerHTML = '<p class="empty-list">Chọn icon để xem chi tiết.</p>';
    iconMeta.innerHTML = '<p class="empty-list">Không có icon nào được chọn.</p>';
    return;
  }

  const svgElement = createCustomizedSvg(icon);
  previewContainer.appendChild(svgElement);
  renderIconMeta(icon);
  renderSimilarIcons(icon);
}

function renderIconMeta(icon) {
  const tagValue = icon.tags.join(', ');
  const categories = Array.from(new Set([...state.categories, icon.category]));
  iconMeta.innerHTML = `
    <div class="field">
      <label>Tên</label>
      <input type="text" value="${icon.name}" data-meta="name" />
    </div>
    <div class="field">
      <label>Category</label>
      <select data-meta="category">
        ${categories
          .map((category) => `<option value="${category}" ${category === icon.category ? 'selected' : ''}>${category}</option>`)
          .join('')}
      </select>
    </div>
    <div class="field">
      <label>Style</label>
      <select data-meta="style">
        ${['Outline', 'Bold', 'Linear', 'Twotone', 'Bulk', 'Broken', 'Custom']
          .map((style) => `<option value="${style}" ${style === icon.style ? 'selected' : ''}>${style}</option>`)
          .join('')}
      </select>
    </div>
    <div class="field">
      <label>Tags</label>
      <input type="text" value="${tagValue}" placeholder="tag1, tag2" data-meta="tags" />
    </div>
    <div class="field">
      <label>Cập nhật</label>
      <span>${new Date(icon.updatedAt).toLocaleString('vi-VN')}</span>
    </div>
  `;

  iconMeta.querySelectorAll('[data-meta]').forEach((element) => {
    element.addEventListener('change', (event) => {
      updateIconMeta(icon.id, event.target.dataset.meta, event.target.value);
    });
    element.addEventListener('blur', (event) => {
      updateIconMeta(icon.id, event.target.dataset.meta, event.target.value);
    });
    if (element.tagName === 'INPUT') {
      element.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
          updateIconMeta(icon.id, event.target.dataset.meta, event.target.value);
          event.target.blur();
        }
      });
    }
  });
}

function updateIconMeta(iconId, field, value) {
  const icon = state.icons.find((item) => item.id === iconId);
  if (!icon) return;
  if (field === 'tags') {
    const tags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    icon.tags = tags;
    state.tags = Array.from(new Set([...state.tags, ...tags])).sort();
    hydrateFilters();
    renderTaxonomies();
  } else {
    icon[field] = value;
    if (field === 'category' && !state.categories.includes(value)) {
      state.categories.push(value);
      state.categories.sort();
      hydrateFilters();
      renderTaxonomies();
    }
  }
  icon.updatedAt = Date.now();
  persistState();
  renderIconGrid();
  renderSimilarIcons(icon);
}

function renderSimilarIcons(icon) {
  const similar = state.icons
    .filter((candidate) => {
      if (candidate.id === icon.id) return false;
      const sameCategory = candidate.category === icon.category;
      const sameStyle = candidate.style === icon.style;
      const sharedTags = candidate.tags.some((tag) => icon.tags.includes(tag));
      return sameCategory || sameStyle || sharedTags;
    })
    .slice(0, 4);

  if (similar.length === 0) {
    similarIconsContainer.innerHTML = '<p class="empty-list">Chưa có gợi ý tương tự.</p>';
    return;
  }

  similar.forEach((item) => {
    const chip = document.createElement('button');
    chip.className = 'similar-chip';
    chip.type = 'button';
    chip.innerHTML = `${item.name}`;
    chip.addEventListener('click', () => setSelectedIcon(item.id));
    similarIconsContainer.appendChild(chip);
  });
}

function renderTaxonomies() {
  updateTaxonomies();
}

function updateTaxonomies() {
  tagList.innerHTML = '';
  categoryList.innerHTML = '';

  if (state.tags.length === 0) {
    tagList.innerHTML = '<li class="empty-list">Chưa có tag.</li>';
  } else {
    state.tags.forEach((tag) => {
      const item = document.createElement('li');
      item.dataset.value = tag;
      item.innerHTML = `${tag} <button class="remove" aria-label="Xóa tag">×</button>`;
      tagList.appendChild(item);
    });
  }

  if (state.categories.length === 0) {
    categoryList.innerHTML = '<li class="empty-list">Chưa có category.</li>';
  } else {
    state.categories.forEach((category) => {
      const item = document.createElement('li');
      item.dataset.value = category;
      item.innerHTML = `${category} <button class="remove" aria-label="Xóa category">×</button>`;
      categoryList.appendChild(item);
    });
  }
}

function addTaxonomyItem(type) {
  const label = type === 'tag' ? 'tag' : 'category';
  const value = prompt(`Nhập ${label} mới:`);
  if (!value) return;
  if (type === 'tag') {
    if (!state.tags.includes(value)) {
      state.tags.push(value);
      state.tags.sort();
    }
  } else {
    if (!state.categories.includes(value)) {
      state.categories.push(value);
      state.categories.sort();
    }
  }
  persistState();
  hydrateFilters();
  updateTaxonomies();
}

function renderPresets() {
  presetList.innerHTML = '';
  if (state.presets.length === 0) {
    presetList.innerHTML = '<li class="empty-list">Chưa có preset.</li>';
    return;
  }
  state.presets.forEach((preset) => {
    const item = document.createElement('li');
    item.dataset.preset = preset.id;
    item.textContent = `${preset.name} · ${preset.size}px / ${preset.stroke}`;
    presetList.appendChild(item);
  });
}

function handleSavePreset() {
  if (!selectedIconId) return;
  const name = prompt('Tên preset mới:');
  if (!name) return;
  const preset = {
    id: `preset-${crypto.randomUUID()}`,
    name,
    size: previewState.size,
    stroke: previewState.stroke,
    color: previewState.color,
    corner: 0
  };
  state.presets.push(preset);
  persistState();
  renderPresets();
}

function renderRoles() {
  roleList.innerHTML = '';
  state.roles.forEach((role) => {
    const item = document.createElement('li');
    item.className = 'role-item';
    item.dataset.role = role.id;
    item.innerHTML = `
      <span>${role.name}</span>
      <div class="toggle">
        <label><input type="checkbox" data-permission="upload" ${role.permissions.upload ? 'checked' : ''}/> Upload</label>
        <label><input type="checkbox" data-permission="edit" ${role.permissions.edit ? 'checked' : ''}/> Edit</label>
        <label><input type="checkbox" data-permission="export" ${role.permissions.export ? 'checked' : ''}/> Export</label>
      </div>
    `;
    roleList.appendChild(item);
  });
}

function renderProjects() {
  projectList.innerHTML = '';
  if (state.projects.length === 0) {
    projectList.innerHTML = '<li class="empty-list">Chưa có dự án.</li>';
    return;
  }

  state.projects.forEach((project) => {
    const count = project.iconIds?.length ?? 0;
    const item = document.createElement('li');
    item.className = 'project-item';
    item.innerHTML = `
      <div>
        <span>${project.name}</span>
        <small>${project.brand}</small>
      </div>
      <span>${count} icon</span>
    `;
    projectList.appendChild(item);
  });
}

async function downloadSelectedIcons() {
  if (selectedIcons.size === 0) {
    alert('Hãy chọn ít nhất một icon.');
    return;
  }
  const zip = new JSZip();
  selectedIcons.forEach((iconId) => {
    const icon = state.icons.find((item) => item.id === iconId);
    if (!icon) return;
    const svgString = new XMLSerializer().serializeToString(createCustomizedSvg(icon, false));
    zip.file(`${slugify(icon.name)}.svg`, svgString);
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(blob, 'icons-selected.zip');
}

function togglePackModal(open) {
  if (selectedIcons.size === 0 && open) {
    alert('Chọn icon trước khi tạo pack.');
    return;
  }
  packModal.setAttribute('aria-hidden', open ? 'false' : 'true');
  if (!open) {
    packForm.reset();
    packForm.querySelector('#pack-version').value = '1.0.0';
  }
}

async function handleCreatePack(event) {
  event.preventDefault();
  if (selectedIcons.size === 0) {
    alert('Không có icon nào được chọn.');
    return;
  }
  const formData = new FormData(packForm);
  const pack = {
    id: `pack-${crypto.randomUUID()}`,
    name: formData.get('pack-name')?.toString() ?? 'Pack mới',
    version: formData.get('pack-version')?.toString() ?? '1.0.0',
    project: formData.get('pack-project')?.toString() ?? '',
    iconIds: Array.from(selectedIcons),
    createdAt: Date.now()
  };
  state.packs.push(pack);
  persistState();

  const zip = new JSZip();
  const manifest = {
    name: pack.name,
    version: pack.version,
    project: pack.project,
    generatedAt: new Date(pack.createdAt).toISOString(),
    icons: pack.iconIds
  };
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));
  pack.iconIds.forEach((iconId) => {
    const icon = state.icons.find((item) => item.id === iconId);
    if (!icon) return;
    const svgString = new XMLSerializer().serializeToString(createCustomizedSvg(icon, false));
    zip.file(`icons/${slugify(icon.name)}.svg`, svgString);
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(blob, `${slugify(pack.name)}-${pack.version}.zip`);
  togglePackModal(false);
}

function copySvgToClipboard() {
  if (!selectedIconId) return;
  const icon = state.icons.find((item) => item.id === selectedIconId);
  if (!icon) return;
  const svgString = new XMLSerializer().serializeToString(createCustomizedSvg(icon));
  navigator.clipboard
    .writeText(svgString)
    .then(() => {
      copySvgBtn.textContent = 'Đã copy!';
      setTimeout(() => (copySvgBtn.textContent = 'Copy SVG'), 1500);
    })
    .catch(() => alert('Không thể copy SVG.'));
}

function exportSvgToPng() {
  if (!selectedIconId) return;
  const icon = state.icons.find((item) => item.id === selectedIconId);
  if (!icon) return;
  const svgString = new XMLSerializer().serializeToString(createCustomizedSvg(icon));
  const size = previewState.size;
  const canvas = exportCanvas;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.height = size;

  const img = new Image();
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  img.onload = () => {
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);
    URL.revokeObjectURL(url);
    canvas.toBlob((pngBlob) => {
      if (!pngBlob) {
        alert('Không thể export PNG.');
        return;
      }
      triggerDownload(pngBlob, `${slugify(icon.name)}-${size}px.png`);
    });
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    alert('Không thể đọc SVG để export.');
  };
  img.src = url;
}

function triggerDownload(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.remove();
  }, 0);
}

function createCustomizedSvg(icon, applyPreview = true) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(icon.svg, 'image/svg+xml');
  const svg = doc.documentElement.cloneNode(true);
  if (!svg) return document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  if (lintViewboxCheckbox.checked && !svg.getAttribute('viewBox')) {
    svg.setAttribute('viewBox', '0 0 24 24');
  }

  if (applyPreview) {
    svg.setAttribute('width', String(previewState.size));
    svg.setAttribute('height', String(previewState.size));
    const color = previewState.color;
    const strokeWidth = previewState.stroke;
    svg.querySelectorAll('*').forEach((node) => {
      if (node.hasAttribute('stroke')) {
        node.setAttribute('stroke', color);
      }
      if (!node.getAttribute('fill')) {
        node.setAttribute('fill', 'none');
      }
      if (lintFillCheckbox.checked && node.getAttribute('fill') === 'none') {
        node.setAttribute('fill', 'none');
      }
      if (lintStrokeCheckbox.checked && node.hasAttribute('stroke-width')) {
        node.setAttribute('stroke-width', String(strokeWidth));
      }
      if (!node.hasAttribute('stroke')) {
        node.setAttribute('stroke', color);
      }
    });
  } else {
    if (!svg.getAttribute('width')) {
      svg.setAttribute('width', '24');
    }
    if (!svg.getAttribute('height')) {
      svg.setAttribute('height', '24');
    }
  }

  return svg;
}

function slugify(value) {
  return value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function handleFileSelect(event) {
  const files = Array.from(event.target.files ?? []);
  if (files.length === 0) return;
  processFiles(files);
  uploadInput.value = '';
}

function handleFileDrop(event) {
  event.preventDefault();
  dropzone.classList.remove('dragging');
  const files = Array.from(event.dataTransfer?.files ?? []).filter((file) => file.type === 'image/svg+xml');
  if (files.length === 0) return;
  processFiles(files);
}

function processFiles(files) {
  const readers = files.map((file) => readSvgFile(file));
  Promise.all(readers)
    .then((icons) => {
      icons.forEach((icon) => {
        if (!icon) return;
        state.icons.push(icon);
        state.categories = Array.from(new Set([...state.categories, icon.category])).sort();
        state.tags = Array.from(new Set([...state.tags, ...icon.tags])).sort();
      });
      persistState();
      hydrateFilters();
      renderAll();
    })
    .catch((error) => console.error('Không thể đọc file SVG', error));
}

function readSvgFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const content = reader.result?.toString() ?? '';
        const sanitized = normalizeSvgMarkup(content);
        const name = file.name.replace(/\.svg$/i, '');
        resolve({
          id: `icon-${crypto.randomUUID()}`,
          name: humanize(name),
          category: guessCategory(name),
          style: 'Custom',
          tags: deriveTags(name),
          svg: sanitized,
          updatedAt: Date.now()
        });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function normalizeSvgMarkup(svgText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, 'image/svg+xml');
  const svg = doc.documentElement;
  if (!svg || svg.nodeName.toLowerCase() !== 'svg') {
    throw new Error('File không phải SVG hợp lệ');
  }
  if (lintViewboxCheckbox.checked && !svg.getAttribute('viewBox')) {
    svg.setAttribute('viewBox', '0 0 24 24');
  }
  if (lintStrokeCheckbox.checked) {
    svg.querySelectorAll('[stroke-width]').forEach((node) => node.setAttribute('stroke-width', '1.5'));
  }
  if (lintFillCheckbox.checked) {
    svg.querySelectorAll('[fill="none"]').forEach((node) => node.setAttribute('fill', 'none'));
  }
  svg.querySelectorAll('[stroke]').forEach((node) => node.setAttribute('stroke', 'currentColor'));
  const serialized = new XMLSerializer().serializeToString(svg);
  return serialized;
}

function humanize(value) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function guessCategory(name) {
  if (name.includes('cloud')) return 'Cloud';
  if (name.includes('arrow')) return 'Arrow';
  if (name.includes('chat') || name.includes('message')) return 'Communication';
  if (name.includes('shield') || name.includes('security')) return 'Security';
  return 'Uncategorized';
}

function deriveTags(name) {
  return Array.from(
    new Set(
      name
        .split(/[-_\s]+/)
        .map((word) => word.trim())
        .filter(Boolean)
    )
  );
}
