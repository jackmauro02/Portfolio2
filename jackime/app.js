(() => {
  'use strict';

  const elements = {
    grid: document.getElementById('grid'),
    empty: document.getElementById('empty'),
    query: document.getElementById('q'),
    sortBy: document.getElementById('sortBy'),
    sortDir: document.getElementById('sortDir'),
    statusFilter: document.getElementById('statusFilter'),
    genreFilter: document.getElementById('genreFilter'),
    picker: document.getElementById('csvPicker'),
    loaderPanel: document.getElementById('loaderPanel'),
    loadStatus: document.getElementById('loadStatus'),
    loadMessage: document.getElementById('loadMessage'),
    totalCount: document.getElementById('totalCount'),
    visibleCount: document.getElementById('visibleCount'),
    watchedCount: document.getElementById('watchedCount'),
    detail: document.getElementById('detail')
  };

  const PLACEHOLDER_IMAGE =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
        <rect width="600" height="800" fill="#111116"/>
        <circle cx="300" cy="340" r="112" fill="#202028"/>
        <path d="M300 205l35 72 80 12-58 56 14 79-71-37-71 37 14-79-58-56 80-12z" fill="#ff3333"/>
        <text x="300" y="520" fill="#9c9cab" font-family="Arial,sans-serif" font-size="34" text-anchor="middle">Jackime</text>
      </svg>
    `);

  let rows = [];
  let sortAscending = true;

  const HEADER_ALIASES = {
    inputName: [
      'name',
      'search name',
      'input name'
    ],

    title: [
      'title',
      'display title',
      'english title'
    ],

    episodes: [
      'total episodes',
      'episodes',
      'tot episodes',
      'episode count'
    ],

    apiRating: [
      'rating (0-10)',
      'rating',
      'api rating',
      'average score'
    ],

    genres: [
      'genres',
      'genre'
    ],

    tags: [
      'tags',
      'tag'
    ],

    status: [
      'status',
      'release status'
    ],

    source: [
      'source',
      'original source'
    ],

    startDate: [
      'start date',
      'started',
      'release date'
    ],

    endDate: [
      'end date',
      'ended',
      'finish date'
    ],

    duration: [
      'duration (mins)',
      'duration',
      'runtime',
      'episode duration'
    ],

    studio: [
      'studio',
      'studios'
    ],

    popularity: [
      'popularity',
      'popular'
    ],

    description: [
      'description',
      'synopsis',
      'overview'
    ],

    image: [
      'imageurl',
      'image url',
      'image',
      'cover image',
      'poster'
    ],

    link: [
      'link',
      'siteurl',
      'site url',
      'url'
    ],

    note: [
      'note',
      'notes',
      'jack’s views',
      "jack's views",
      'jacks views',
      'my notes'
    ],

    myRating: [
      'my rating',
      'myrating',
      'personal rating',
      'my score'
    ],

    finished: [
      'finished?',
      'finished',
      'watched',
      'progress'
    ]
  };

  function normaliseHeader(value) {
    return String(value ?? '')
      .normalize('NFKD')
      .toLowerCase()
      .replace(/[’']/g, '')
      .replace(/[^a-z0-9]+/g, '');
  }

  function buildHeaderMap(headers) {
    const normalisedHeaders = headers.map(normaliseHeader);
    const map = {};

    Object.entries(HEADER_ALIASES).forEach(([key, aliases]) => {
      map[key] = aliases
        .map(normaliseHeader)
        .map(alias => normalisedHeaders.indexOf(alias))
        .find(index => index >= 0);

      if (map[key] === undefined) {
        map[key] = -1;
      }
    });

    return map;
  }

  function readCell(sourceRow, map, key) {
    const index = map[key];

    if (index < 0) {
      return '';
    }

    return String(sourceRow[index] ?? '').trim();
  }

  function parseNumber(value) {
    const cleaned = String(value ?? '')
      .replace(/,/g, '')
      .trim();

    if (!cleaned) {
      return null;
    }

    const number = Number(cleaned);

    return Number.isFinite(number)
      ? number
      : null;
  }

  function splitList(value) {
    return String(value ?? '')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }

  function cleanInputName(value) {
    return String(value ?? '')
      .replace(/\s*\[(?:anilist|tmdb):\d+\]\s*$/i, '')
      .trim();
  }

  function normaliseRow(sourceRow, map, sourceIndex) {
    const inputName = readCell(sourceRow, map, 'inputName');
    const title = readCell(sourceRow, map, 'title');

    const displayName =
      title ||
      cleanInputName(inputName);

    return {
      id: sourceIndex,

      inputName,
      title,
      displayName,

      episodes: parseNumber(
        readCell(sourceRow, map, 'episodes')
      ),

      apiRating: parseNumber(
        readCell(sourceRow, map, 'apiRating')
      ),

      genres: splitList(
        readCell(sourceRow, map, 'genres')
      ),

      tags: splitList(
        readCell(sourceRow, map, 'tags')
      ),

      status: readCell(
        sourceRow,
        map,
        'status'
      ),

      source: readCell(
        sourceRow,
        map,
        'source'
      ),

      startDate: readCell(
        sourceRow,
        map,
        'startDate'
      ),

      endDate: readCell(
        sourceRow,
        map,
        'endDate'
      ),

      duration: parseNumber(
        readCell(sourceRow, map, 'duration')
      ),

      studio: readCell(
        sourceRow,
        map,
        'studio'
      ),

      popularity: parseNumber(
        readCell(sourceRow, map, 'popularity')
      ),

      description: readCell(
        sourceRow,
        map,
        'description'
      ),

      image: readCell(
        sourceRow,
        map,
        'image'
      ),

      link: readCell(
        sourceRow,
        map,
        'link'
      ),

      note: readCell(
        sourceRow,
        map,
        'note'
      ),

      myRating: readCell(
        sourceRow,
        map,
        'myRating'
      ),

      finished: readCell(
        sourceRow,
        map,
        'finished'
      )
    };
  }

  function parseCsvText(text, fileLabel = 'anime.csv') {
    if (typeof Papa === 'undefined') {
      showLoadError(
        'Papa Parse failed to load.',
        'Check your internet connection because the parser is loaded from a CDN.'
      );

      return;
    }

    const result = Papa.parse(text, {
      skipEmptyLines: 'greedy'
    });

    if (result.errors?.length) {
      console.warn(
        'CSV parser warnings:',
        result.errors
      );
    }

    if (!result.data?.length) {
      showLoadError(
        'The CSV is empty.',
        'Add at least a Name or Title column.'
      );

      return;
    }

    const headers = result.data[0].map(value =>
      String(value ?? '').trim()
    );

    const map = buildHeaderMap(headers);

    if (map.inputName < 0 && map.title < 0) {
      showLoadError(
        'No Name or Title header was found.',
        `Headers found: ${headers.filter(Boolean).join(', ')}`
      );

      return;
    }

    rows = result.data
      .slice(1)
      .map((sourceRow, index) =>
        normaliseRow(
          sourceRow,
          map,
          index + 2
        )
      )
      .filter(row => row.displayName);

    updateFilterOptions();
    updateSummary();
    render();

    elements.loaderPanel.classList.remove('error');
    elements.loaderPanel.classList.add('success');

    elements.loadStatus.textContent =
      `Loaded ${rows.length} anime`;

    elements.loadMessage.textContent =
      `${fileLabel} loaded successfully. Blank fields are allowed while you test.`;
  }

  function showLoadError(title, message) {
    elements.loaderPanel.classList.remove('success');
    elements.loaderPanel.classList.add('error');

    elements.loadStatus.textContent = title;
    elements.loadMessage.textContent = message;
  }

  function updateFilterOptions() {
    const statuses = [
      ...new Set(
        rows
          .map(row => row.status)
          .filter(Boolean)
      )
    ].sort((a, b) =>
      a.localeCompare(b)
    );

    const genres = [
      ...new Set(
        rows.flatMap(row => row.genres)
      )
    ].sort((a, b) =>
      a.localeCompare(b)
    );

    replaceOptions(
      elements.statusFilter,
      'All statuses',
      statuses
    );

    replaceOptions(
      elements.genreFilter,
      'All genres',
      genres
    );
  }

  function replaceOptions(
    select,
    firstLabel,
    values
  ) {
    const previousValue = select.value;

    select.replaceChildren();

    const firstOption =
      document.createElement('option');

    firstOption.value = '';
    firstOption.textContent = firstLabel;

    select.append(firstOption);

    values.forEach(value => {
      const option =
        document.createElement('option');

      option.value = value;
      option.textContent = value;

      select.append(option);
    });

    if (values.includes(previousValue)) {
      select.value = previousValue;
    }
  }

  function isWatched(value) {
    return /^(yes|watched|complete|completed|finished)$/i.test(
      String(value ?? '').trim()
    );
  }

  function updateSummary(visibleRows = rows) {
    elements.totalCount.textContent =
      rows.length.toLocaleString();

    elements.visibleCount.textContent =
      visibleRows.length.toLocaleString();

    elements.watchedCount.textContent =
      rows
        .filter(row =>
          isWatched(row.finished)
        )
        .length
        .toLocaleString();
  }

  function getFilteredRows() {
    const term =
      elements.query.value
        .toLowerCase()
        .trim();

    const selectedStatus =
      elements.statusFilter.value;

    const selectedGenre =
      elements.genreFilter.value;

    return rows.filter(row => {
      const searchableText = [
        row.inputName,
        row.title,
        row.displayName,
        row.description,
        row.genres.join(' '),
        row.tags.join(' '),
        row.studio,
        row.source,
        row.note
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !term ||
        searchableText.includes(term);

      const matchesStatus =
        !selectedStatus ||
        row.status === selectedStatus;

      const matchesGenre =
        !selectedGenre ||
        row.genres.includes(selectedGenre);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesGenre
      );
    });
  }

  function getSortValue(row, key) {
    switch (key) {
      case 'name':
        return row.displayName.toLowerCase();

      case 'episodes':
        return row.episodes ?? -Infinity;

      case 'apiRating':
        return row.apiRating ?? -Infinity;

      case 'myRating': {
        const rating =
          parseNumber(row.myRating);

        return rating ?? -Infinity;
      }

      case 'popularity':
        return row.popularity ?? -Infinity;

      case 'startDate':
        return row.startDate || '';

      default:
        return row.displayName.toLowerCase();
    }
  }

  function sortRows(sourceRows) {
    const key = elements.sortBy.value;

    return [...sourceRows].sort(
      (left, right) => {
        const a = getSortValue(left, key);
        const b = getSortValue(right, key);

        if (
          typeof a === 'string' ||
          typeof b === 'string'
        ) {
          const result =
            String(a).localeCompare(
              String(b),
              undefined,
              {
                numeric: true,
                sensitivity: 'base'
              }
            );

          return sortAscending
            ? result
            : -result;
        }

        if (a === b) {
          return 0;
        }

        return sortAscending
          ? (a < b ? -1 : 1)
          : (a > b ? -1 : 1);
      }
    );
  }

  function setSortDirectionLabel() {
    const alphabetical =
      elements.sortBy.value === 'name';

    elements.sortDir.textContent =
      alphabetical
        ? (
          sortAscending
            ? 'A → Z'
            : 'Z → A'
        )
        : (
          sortAscending
            ? 'Low → High'
            : 'High → Low'
        );

    elements.sortDir.setAttribute(
      'aria-pressed',
      String(!sortAscending)
    );
  }

  function render() {
    const filteredRows =
      getFilteredRows();

    const sortedRows =
      sortRows(filteredRows);

    elements.grid.replaceChildren();

    elements.empty.style.display =
      sortedRows.length
        ? 'none'
        : 'block';

    const fragment =
      document.createDocumentFragment();

    sortedRows.forEach(row => {
      fragment.append(
        createCard(row)
      );
    });

    elements.grid.append(fragment);

    updateSummary(sortedRows);
  }

  function createCard(row) {
    const card =
      document.createElement('article');

    card.className = 'card';
    card.tabIndex = 0;

    card.setAttribute(
      'role',
      'button'
    );

    card.setAttribute(
      'aria-label',
      `Open details for ${row.displayName}`
    );

    const thumb =
      document.createElement('div');

    thumb.className = 'thumb';

    const image =
      document.createElement('img');

    applyImage(
      image,
      row.image,
      `${row.displayName} cover`
    );

    thumb.append(image);

    const episodePill =
      document.createElement('span');

    episodePill.className = 'pill';

    episodePill.textContent =
      row.episodes !== null
        ? `${row.episodes} eps`
        : 'Episodes TBA';

    thumb.append(episodePill);

    const statusText =
      row.finished ||
      row.status;

    if (statusText) {
      const statusPill =
        document.createElement('span');

      statusPill.className =
        'pill right';

      statusPill.textContent =
        isWatched(row.finished)
          ? 'Watched'
          : statusText;

      thumb.append(statusPill);
    }

    const content =
      document.createElement('div');

    content.className =
      'card-content';

    const title =
      document.createElement('h2');

    title.className =
      'card-title';

    title.textContent =
      row.displayName;

    content.append(title);

    const cleanedInput =
      cleanInputName(row.inputName);

    if (
      cleanedInput &&
      cleanedInput.toLowerCase() !==
        row.displayName.toLowerCase()
    ) {
      const subtitle =
        document.createElement('div');

      subtitle.className =
        'card-subtitle';

      subtitle.textContent =
        cleanedInput;

      content.append(subtitle);
    }

    const meta =
      document.createElement('div');

    meta.className =
      'card-meta';

    meta.append(
      makeMeta(
        'API',
        formatRating(row.apiRating)
      ),

      makeMeta(
        'Mine',
        row.myRating || '—'
      )
    );

    content.append(meta);

    if (row.genres.length) {
      const genres =
        document.createElement('div');

      genres.className =
        'genre-list';

      row.genres
        .slice(0, 3)
        .forEach(genre => {
          const badge =
            document.createElement('span');

          badge.className =
            'genre-badge';

          badge.textContent =
            genre;

          genres.append(badge);
        });

      content.append(genres);
    }

    const description =
      document.createElement('div');

    description.className =
      'card-description';

    description.textContent =
      row.description ||
      'No description has been added yet.';

    content.append(description);

    const actions =
      document.createElement('div');

    actions.className =
      'card-actions';

    if (row.link) {
      const sourceLink =
        document.createElement('a');

      sourceLink.className =
        'source-link';

      sourceLink.href =
        row.link;

      sourceLink.target =
        '_blank';

      sourceLink.rel =
        'noopener noreferrer';

      sourceLink.textContent =
        sourceNameFromLink(row.link);

      sourceLink.addEventListener(
        'click',
        event => {
          event.stopPropagation();
        }
      );

      actions.append(sourceLink);
    } else {
      const noLink =
        document.createElement('span');

      noLink.className =
        'source-link';

      noLink.textContent =
        'No source link';

      actions.append(noLink);
    }

    const personalRating =
      document.createElement('span');

    personalRating.className =
      'personal-rating';

    personalRating.textContent =
      row.myRating
        ? `${row.myRating}/10`
        : 'Not rated';

    actions.append(personalRating);

    content.append(actions);

    card.append(
      thumb,
      content
    );

    card.addEventListener(
      'click',
      () => openDetail(row)
    );

    card.addEventListener(
      'keydown',
      event => {
        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault();
          openDetail(row);
        }
      }
    );

    return card;
  }

  function makeMeta(label, value) {
    const span =
      document.createElement('span');

    const strong =
      document.createElement('strong');

    strong.textContent =
      `${label}: `;

    span.append(
      strong,
      document.createTextNode(value)
    );

    return span;
  }

  function formatRating(value) {
    return value === null
      ? '—'
      : `${value}/10`;
  }

  function formatNumber(value) {
    return value === null
      ? '—'
      : value.toLocaleString();
  }

  function formatDates(
    startDate,
    endDate
  ) {
    if (!startDate && !endDate) {
      return '—';
    }

    if (startDate && endDate) {
      return `${startDate} → ${endDate}`;
    }

    if (startDate) {
      return `${startDate} → ongoing/TBA`;
    }

    return `Ended ${endDate}`;
  }

  function sourceNameFromLink(link) {
    try {
      const host =
        new URL(link)
          .hostname
          .toLowerCase();

      if (host.includes('anilist.co')) {
        return 'AniList ↗';
      }

      if (host.includes('myanimelist.net')) {
        return 'MAL ↗';
      }

      if (host.includes('themoviedb.org')) {
        return 'TMDB ↗';
      }

      if (host.includes('netflix.com')) {
        return 'Netflix ↗';
      }

      return 'Source ↗';
    } catch {
      return 'Source ↗';
    }
  }

  function applyImage(
    image,
    source,
    alt
  ) {
    image.alt = alt;
    image.loading = 'lazy';

    image.src =
      source ||
      PLACEHOLDER_IMAGE;

    if (!source) {
      image.classList.add(
        'is-fallback'
      );
    }

    image.addEventListener(
      'error',
      () => {
        image.src =
          PLACEHOLDER_IMAGE;

        image.classList.add(
          'is-fallback'
        );
      },
      {
        once: true
      }
    );
  }

  function openDetail(row) {
    document.getElementById(
      'dtitle'
    ).textContent =
      row.displayName;

    const originalName =
      cleanInputName(row.inputName);

    const originalLabel =
      originalName &&
      originalName.toLowerCase() !==
        row.displayName.toLowerCase()
        ? `Roster name: ${originalName}`
        : '';

    document.getElementById(
      'doriginal'
    ).textContent =
      originalLabel;

    const detailImage =
      document.getElementById('dimg');

    detailImage.classList.remove(
      'is-fallback'
    );

    applyImage(
      detailImage,
      row.image,
      `${row.displayName} cover`
    );

    document.getElementById(
      'deps'
    ).textContent =
      `Episodes: ${row.episodes ?? '—'}`;

    document.getElementById(
      'dscore'
    ).textContent =
      `API rating: ${row.apiRating ?? '—'}`;

    document.getElementById(
      'dmyscore'
    ).textContent =
      `My rating: ${row.myRating || '—'}`;

    document.getElementById(
      'dstatus'
    ).textContent =
      `Status: ${row.status || '—'}`;

    const finishedChip =
      document.getElementById(
        'dfinished'
      );

    if (row.finished) {
      finishedChip.hidden = false;

      finishedChip.textContent =
        isWatched(row.finished)
          ? 'Watched: yes'
          : `Progress: ${row.finished}`;
    } else {
      finishedChip.hidden = true;
      finishedChip.textContent = '';
    }

    document.getElementById(
      'ddesc'
    ).textContent =
      row.description ||
      'No description has been added yet.';

    document.getElementById(
      'dgenres'
    ).textContent =
      row.genres.join(', ') ||
      '—';

    document.getElementById(
      'dtags'
    ).textContent =
      row.tags.join(', ') ||
      '—';

    document.getElementById(
      'dsource'
    ).textContent =
      row.source ||
      '—';

    document.getElementById(
      'ddates'
    ).textContent =
      formatDates(
        row.startDate,
        row.endDate
      );

    document.getElementById(
      'dduration'
    ).textContent =
      row.duration !== null
        ? `${row.duration} minutes`
        : '—';

    document.getElementById(
      'dstudio'
    ).textContent =
      row.studio ||
      '—';

    document.getElementById(
      'dpopularity'
    ).textContent =
      formatNumber(
        row.popularity
      );

    document.getElementById(
      'dnotes'
    ).textContent =
      row.note ||
      '—';

    const detailLink =
      document.getElementById(
        'dlink'
      );

    if (row.link) {
      detailLink.hidden = false;
      detailLink.href = row.link;

      detailLink.textContent =
        `Open ${sourceNameFromLink(row.link)}`;
    } else {
      detailLink.hidden = true;
      detailLink.removeAttribute(
        'href'
      );
    }

    elements.detail.showModal();
  }

  async function loadNavbar() {
    const placeholder =
      document.getElementById(
        'nav-placeholder'
      );

    const candidates = [
      'navbar.html',
      './navbar.html',
      'Anime/navbar.html',
      '../navbar.html',
      '../../navbar.html'
    ];

    for (const path of candidates) {
      try {
        const response =
          await fetch(
            path,
            {
              cache: 'no-store'
            }
          );

        if (!response.ok) {
          continue;
        }

        placeholder.innerHTML =
          await response.text();

        const prefix =
          path.replace(
            /navbar\.html$/i,
            ''
          );

        placeholder
          .querySelectorAll('[src]')
          .forEach(element => {
            const source =
              element.getAttribute(
                'src'
              ) || '';

            const absolute =
              /^(data:|https?:|\/)/i.test(
                source
              );

            if (!absolute) {
              element.setAttribute(
                'src',
                prefix +
                source.replace(
                  /^\.\/+/,
                  ''
                )
              );
            }
          });

        const toggle =
          placeholder.querySelector(
            '.nav-toggle'
          );

        const menu =
          placeholder.querySelector(
            '#mainmenu'
          );

        toggle?.addEventListener(
          'click',
          () => {
            const expanded =
              toggle.getAttribute(
                'aria-expanded'
              ) === 'true';

            toggle.setAttribute(
              'aria-expanded',
              String(!expanded)
            );

            menu?.classList.toggle(
              'open'
            );
          }
        );

        const currentPage =
          window.location.pathname
            .split('/')
            .pop()
            ?.toLowerCase() || '';

        placeholder
          .querySelectorAll('.menu a')
          .forEach(anchor => {
            const target =
              anchor
                .getAttribute('href')
                ?.split('/')
                .pop()
                ?.toLowerCase() || '';

            if (
              target &&
              target === currentPage
            ) {
              anchor.classList.add(
                'active'
              );

              anchor.setAttribute(
                'aria-current',
                'page'
              );
            }
          });

        return;
      } catch (error) {
        console.debug(
          `Navbar attempt failed: ${path}`,
          error
        );
      }
    }

    console.warn(
      'navbar.html was not found in the expected locations.'
    );
  }

  async function autoLoadCsv() {
    try {
      const response =
        await fetch(
          'anime.csv',
          {
            cache: 'no-store'
          }
        );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const text =
        await response.text();

      parseCsvText(
        text,
        'anime.csv'
      );
    } catch (error) {
      showLoadError(
        'anime.csv could not be auto-loaded.',
        'Use Live Server/Netlify, or press “Choose CSV manually” when testing from your computer.'
      );

      console.info(
        'Automatic CSV load failed:',
        error
      );
    }
  }

  function handleFilterChange() {
    render();
  }

  elements.query.addEventListener(
    'input',
    handleFilterChange
  );

  elements.statusFilter.addEventListener(
    'change',
    handleFilterChange
  );

  elements.genreFilter.addEventListener(
    'change',
    handleFilterChange
  );

  elements.sortBy.addEventListener(
    'change',
    () => {
      setSortDirectionLabel();
      render();
    }
  );

  elements.sortDir.addEventListener(
    'click',
    () => {
      sortAscending =
        !sortAscending;

      setSortDirectionLabel();
      render();
    }
  );

  elements.picker.addEventListener(
    'change',
    async event => {
      const [file] =
        event.target.files || [];

      if (!file) {
        return;
      }

      try {
        parseCsvText(
          await file.text(),
          file.name
        );
      } catch (error) {
        showLoadError(
          'The selected CSV could not be read.',
          error instanceof Error
            ? error.message
            : String(error)
        );
      }
    }
  );

  document
    .getElementById('closeDetail')
    .addEventListener(
      'click',
      () => {
        elements.detail.close();
      }
    );

  elements.detail.addEventListener(
    'click',
    event => {
      const rect =
        elements.detail
          .getBoundingClientRect();

      const clickedBackdrop =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;

      if (clickedBackdrop) {
        elements.detail.close();
      }
    }
  );

  document.getElementById(
    'year'
  ).textContent =
    new Date().getFullYear();

  setSortDirectionLabel();
  loadNavbar();
  autoLoadCsv();
})();