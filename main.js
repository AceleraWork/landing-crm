// ========================================
// CONFIG
// ========================================
const SHEETDB_ENDPOINT = 'https://sheetdb.io/api/v1/5z8k65dozoj3x';
const WHATSAPP_LINK = 'https://chat.whatsapp.com/FJwqTceWj4gBKpYKBAWEWW';

// ========================================
// NAVBAR SCROLL STATE
// ========================================
const navbar = document.getElementById('navbar');
function updateNavbarScroll() {
  if (window.scrollY > 24) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateNavbarScroll, { passive: true });
updateNavbarScroll();

// ========================================
// MOBILE NAV TOGGLE
// ========================================
const navToggle = document.getElementById('navToggle');
const navCta = document.querySelector('.navbar__cta');

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.classList.toggle('active');
  navCta.style.display = isOpen ? 'inline-flex' : 'none';
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

// ========================================
// VIDEO PLACEHOLDERS -> YOUTUBE EMBED
// ========================================
document.querySelectorAll('.video-placeholder').forEach((placeholder) => {
  const playBtn = placeholder.querySelector('.play-btn');
  const videoId = placeholder.getAttribute('data-video-id');
  if (!playBtn || !videoId) return;

  playBtn.addEventListener('click', () => {
    const inner = placeholder.querySelector('.video-inner');
    inner.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" title="${placeholder.getAttribute('data-label') || 'Video'}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  });
});

// ========================================
// WAITLIST MODAL
// ========================================
const modal = document.getElementById('waitlistModal');
const modalClose = document.getElementById('modalClose');
const waitlistForm = document.getElementById('waitlistForm');
const waitlistFormEl = document.getElementById('waitlistFormEl');
const waitlistSuccess = document.getElementById('waitlistSuccess');
const formError = document.getElementById('formError');
const submitBtn = document.getElementById('submitBtn');

function openModal() {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  waitlistForm.style.display = 'block';
  waitlistSuccess.style.display = 'none';
  formError.style.display = 'none';
  waitlistFormEl.reset();
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-open-waitlist]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
});

// ========================================
// PHONE COUNTRY DROPDOWN
// ========================================
const countries = [
  { name: 'Colombia', flag: '🇨🇴', dial: '+57' },
  { name: 'Estados Unidos', flag: '🇺🇸', dial: '+1' },
  { name: 'México', flag: '🇲🇽', dial: '+52' },
  { name: 'Argentina', flag: '🇦🇷', dial: '+54' },
  { name: 'Chile', flag: '🇨🇱', dial: '+56' },
  { name: 'Perú', flag: '🇵🇪', dial: '+51' },
  { name: 'Ecuador', flag: '🇪🇨', dial: '+593' },
  { name: 'España', flag: '🇪🇸', dial: '+34' },
  { name: 'Venezuela', flag: '🇻🇪', dial: '+58' },
  { name: 'Panamá', flag: '🇵🇦', dial: '+507' },
  { name: 'Costa Rica', flag: '🇨🇷', dial: '+506' },
  { name: 'Uruguay', flag: '🇺🇾', dial: '+598' },
  { name: 'Bolivia', flag: '🇧🇴', dial: '+591' },
  { name: 'Paraguay', flag: '🇵🇾', dial: '+595' },
  { name: 'República Dominicana', flag: '🇩🇴', dial: '+1' },
  { name: 'Guatemala', flag: '🇬🇹', dial: '+502' },
  { name: 'Brasil', flag: '🇧🇷', dial: '+55' },
  { name: 'Canadá', flag: '🇨🇦', dial: '+1' },
];

const countryBtn = document.getElementById('countryBtn');
const countryDropdown = document.getElementById('countryDropdown');
const countrySearch = document.getElementById('countrySearch');
const countryList = document.getElementById('countryList');
const countryFlag = document.getElementById('countryFlag');
const countryCode = document.getElementById('countryCode');

function renderCountryList(filter = '') {
  const term = filter.trim().toLowerCase();
  const filtered = countries.filter((c) => c.name.toLowerCase().includes(term));
  countryList.innerHTML = filtered
    .map((c) => `<li data-flag="${c.flag}" data-dial="${c.dial}"><span>${c.flag}</span><span>${c.name}</span><span class="country-dial">${c.dial}</span></li>`)
    .join('');
}
renderCountryList();

countryBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  countryDropdown.classList.toggle('open');
  if (countryDropdown.classList.contains('open')) {
    countrySearch.value = '';
    renderCountryList();
    countrySearch.focus();
  }
});

countrySearch.addEventListener('input', () => renderCountryList(countrySearch.value));

countryList.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  countryFlag.textContent = li.getAttribute('data-flag');
  countryCode.textContent = li.getAttribute('data-dial');
  countryDropdown.classList.remove('open');
});

document.addEventListener('click', (e) => {
  if (!countryDropdown.contains(e.target) && e.target !== countryBtn) {
    countryDropdown.classList.remove('open');
  }
});

// ========================================
// FORM SUBMIT -> SheetDB
// ========================================
waitlistFormEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.style.display = 'none';

  const nombre = document.getElementById('waitlistName').value.trim();
  const email = document.getElementById('waitlistEmail').value.trim();
  const phoneRaw = document.getElementById('waitlistPhone').value.trim();
  const telefono = `${countryCode.textContent} ${phoneRaw}`;

  if (!nombre || !email || !phoneRaw) {
    formError.textContent = 'Por favor completa todos los campos.';
    formError.style.display = 'block';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  const now = new Date();
  const fechaHora = now.toISOString().replace('T', ' ').slice(0, 19);

  try {
    const payload = {
      'Fecha y hora': fechaHora,
      'Nombre': nombre,
      'Email': email,
      'Teléfono': telefono,
      'Fuente': 'Página web',
    };

    console.log('SheetDB payload:', JSON.stringify(payload, null, 2));

    const res = await fetch(SHEETDB_ENDPOINT + '?sheet=LeadsAds&mode=RAW', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Error al registrar. Inténtalo de nuevo.');

    waitlistForm.style.display = 'none';
    waitlistSuccess.style.display = 'block';

    setTimeout(() => {
      window.open(WHATSAPP_LINK, '_blank');
    }, 1500);
  } catch (err) {
    formError.textContent = err.message || 'Hubo un error. Inténtalo de nuevo.';
    formError.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Unirme ahora';
  }
});
