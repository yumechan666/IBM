/**
 * Mochi Lagoon — script.js
 * Episode data, card rendering, and all interaction logic.
 */

'use strict';

/* ============================================================
   EPISODE DATA
   ============================================================ */
const episodes = [
  {
    id: 1,
    epLabel: 'Episode 1',
    title: 'Makan Malam yang Kabur',
    synopsis: 'Pelet makan malam Mochi kabur duluan sebelum sempat dimakan.',
    illoVariant: 'illo-pellet',
    opening:
      'Mochi menatap pelet makan malamnya. Baru mau mendekat, pelet itu sudah hanyut ke balik tanaman.',
    choices: [
      {
        id: 'a',
        label: '🌿 Kejar pelet',
        ending:
          'Mochi mendorong daun dengan hidungnya, lalu menemukan dua pelet di baliknya. ' +
          'Ia mulai curiga bahwa tanaman itu punya layanan pesan antar.',
      },
      {
        id: 'b',
        label: '🧘 Tunggu di tempat',
        ending:
          'Pelet terbawa arus kembali ke depan Mochi. ' +
          'Ia memutuskan bahwa makan malamnya tadi cuma jalan-jalan sebentar.',
      },
    ],
  },
  {
    id: 2,
    epLabel: 'Episode 2',
    title: 'Batu yang Katanya Bisa Ngomong',
    synopsis: 'Setiap lewat batu gelembung, Mochi mendengar bunyi "blup" — dan hari ini ia ingin memastikan.',
    illoVariant: 'illo-rock',
    opening:
      'Setiap lewat batu gelembung, Mochi mendengar bunyi "blup". ' +
      'Hari ini, ia penasaran apakah batu itu sedang menyapanya.',
    choices: [
      {
        id: 'a',
        label: '👋 Sapa batunya',
        ending:
          'Mochi bilang halo. Batu menjawab "blup" lagi. ' +
          'Mochi senang punya tetangga yang jawabannya mudah ditebak.',
      },
      {
        id: 'b',
        label: '🌱 Intip dari balik daun',
        ending:
          'Dari balik daun, Mochi melihat gelembung keluar dari batu. ' +
          'Ia pulang dengan kesimpulan: batunya lagi cegukan.',
      },
    ],
  },
  {
    id: 3,
    epLabel: 'Episode 3',
    title: 'Si Kembar di Kaca',
    synopsis: 'Ada axolotl lain di kaca yang setiap gerak selalu ikut-ikutan.',
    illoVariant: 'illo-mirror',
    opening:
      'Mochi melihat axolotl lain di kaca. ' +
      'Yang bikin curiga, si pendatang ikut bergerak setiap kali Mochi bergerak.',
    choices: [
      {
        id: 'a',
        label: '👋 Dadah duluan',
        ending:
          'Si kembar ikut dadah. Mochi dadah tiga kali lagi untuk memastikan pendatang itu memang sopan.',
      },
      {
        id: 'b',
        label: '🫣 Sembunyi, lalu intip',
        ending:
          'Si kembar ikut hilang. Saat Mochi mengintip, si kembar muncul lagi. ' +
          'Mochi menganggapnya jago main petak umpet.',
      },
    ],
  },
];

/* ============================================================
   DOM REFERENCES
   ============================================================ */
const homeView       = document.getElementById('home-view');
const episodeView    = document.getElementById('episode-view');
const episodeGrid    = document.getElementById('episode-grid');
const episodeTitle   = document.getElementById('episode-title');
const episodeIllo    = document.getElementById('episode-illustration');
const episodeOpening = document.getElementById('episode-opening');
const btnChoiceA     = document.getElementById('btn-choice-a');
const btnChoiceB     = document.getElementById('btn-choice-b');
const endingArea     = document.getElementById('ending-area');
const endingText     = document.getElementById('ending-text');
const btnReset       = document.getElementById('btn-reset');
const btnBack        = document.getElementById('btn-back');

/* ============================================================
   CSS ILLUSTRATION HELPERS
   Build the inner HTML for a Mochi figure (card-sized or episode-sized)
   ============================================================ */
function mochiHTML() {
  return `
    <span class="m-body"></span>
    <span class="m-eye-l"></span>
    <span class="m-eye-r"></span>
    <span class="m-gill-l"></span>
    <span class="m-gill-r"></span>
    <span class="m-tail"></span>
  `;
}

function episodeMochiHTML() {
  return `
    <span class="m-body"></span>
    <span class="m-eye-l"></span>
    <span class="m-eye-r"></span>
    <span class="m-gill-l"></span>
    <span class="m-gill-r"></span>
    <span class="m-tail"></span>
    <span class="m-smile"></span>
  `;
}

/** Builds the prop decoration for each card illustration */
function cardPropHTML(epId) {
  if (epId === 1) {
    return '<span class="prop-pellet" aria-hidden="true"></span>';
  }
  if (epId === 2) {
    return '<span class="prop-rock" aria-hidden="true"></span>';
  }
  if (epId === 3) {
    return `
      <span class="prop-mirror-frame" aria-hidden="true">
        <span class="prop-mirror-mochi"></span>
      </span>
    `;
  }
  return '';
}

/* ============================================================
   RENDER HOME — episode cards
   ============================================================ */
function renderHome() {
  episodeGrid.innerHTML = '';

  episodes.forEach((ep) => {
    // Outer button — the whole card is the click target
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'episode-card-btn focus-ring';
    btn.setAttribute('aria-label', `Baca episode: ${ep.title}`);
    btn.dataset.epId = ep.id;

    btn.innerHTML = `
      <div class="card-illo card-illo-${ep.id}" aria-hidden="true">
        <div class="mochi-figure">${mochiHTML()}</div>
        ${cardPropHTML(ep.id)}
      </div>
      <div class="card-body">
        <p class="card-ep-num">${ep.epLabel}</p>
        <p class="card-title">${ep.title}</p>
        <p class="card-synopsis">${ep.synopsis}</p>
        <span class="card-cta" aria-hidden="true">Baca cerita →</span>
      </div>
    `;

    // Click / keyboard activation
    btn.addEventListener('click', () => openEpisode(ep.id));

    episodeGrid.appendChild(btn);
  });
}

/* ============================================================
   OPEN EPISODE
   ============================================================ */
function openEpisode(epId) {
  const ep = episodes.find((e) => e.id === epId);
  if (!ep) return;

  // Populate content
  episodeTitle.textContent   = ep.title;
  episodeOpening.textContent = ep.opening;

  // Illustration
  episodeIllo.className = 'episode-illo mx-auto mb-6';
  episodeIllo.innerHTML = episodeMochiHTML();

  // Choices
  btnChoiceA.textContent = ep.choices[0].label;
  btnChoiceB.textContent = ep.choices[1].label;
  btnChoiceA.dataset.choice = 'a';
  btnChoiceB.dataset.choice = 'b';

  // Reset choice state
  resetChoiceState();

  // Switch views
  homeView.classList.add('hidden');
  episodeView.classList.remove('hidden');

  // Focus episode title for screen readers and keyboard users
  episodeTitle.focus();
}

/* ============================================================
   SHOW ENDING
   ============================================================ */
function showEnding(choiceId) {
  // Determine which episode is currently shown by matching title
  const ep = episodes.find((e) => e.title === episodeTitle.textContent);
  if (!ep) return;

  const choice = ep.choices.find((c) => c.id === choiceId);
  if (!choice) return;

  // Mark active choice button
  btnChoiceA.setAttribute('aria-pressed', btnChoiceA.dataset.choice === choiceId ? 'true' : 'false');
  btnChoiceB.setAttribute('aria-pressed', btnChoiceB.dataset.choice === choiceId ? 'true' : 'false');

  // Show ending
  endingText.textContent = choice.ending;
  endingArea.classList.remove('hidden');

  // Scroll ending into view on mobile
  endingArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ============================================================
   RESET CHOICE STATE (Ulang cerita)
   ============================================================ */
function resetChoiceState() {
  btnChoiceA.setAttribute('aria-pressed', 'false');
  btnChoiceB.setAttribute('aria-pressed', 'false');
  endingArea.classList.add('hidden');
  endingText.textContent = '';
}

/* ============================================================
   GO HOME (Kembali ke episode)
   ============================================================ */
function goHome() {
  episodeView.classList.add('hidden');
  homeView.classList.remove('hidden');

  // Return focus to the card that was opened, if possible
  const activeEp = episodes.find((e) => e.title === episodeTitle.textContent);
  if (activeEp) {
    const cardBtn = episodeGrid.querySelector(`[data-ep-id="${activeEp.id}"]`);
    if (cardBtn) {
      cardBtn.focus();
      return;
    }
  }
  // Fallback: focus first card
  const firstCard = episodeGrid.querySelector('.episode-card-btn');
  if (firstCard) firstCard.focus();
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
btnChoiceA.addEventListener('click', () => showEnding('a'));
btnChoiceB.addEventListener('click', () => showEnding('b'));
btnReset.addEventListener('click',   resetChoiceState);
btnBack.addEventListener('click',    goHome);

/* ============================================================
   INIT
   ============================================================ */
renderHome();
