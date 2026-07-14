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
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
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
// FORM SUBMIT (frontend only — no backend wired up yet)
// ========================================
waitlistFormEl.addEventListener('submit', (e) => {
  e.preventDefault();
  formError.style.display = 'none';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  const data = {
    name: document.getElementById('waitlistName').value,
    email: document.getElementById('waitlistEmail').value,
    phone: `${countryCode.textContent} ${document.getElementById('waitlistPhone').value}`,
    occupation: document.getElementById('waitlistOccupation').value,
  };

  // TODO: connect this payload to the real CRM/backend once it's defined.
  console.log('Waitlist signup (not yet sent anywhere):', data);

  waitlistForm.style.display = 'none';
  waitlistSuccess.style.display = 'block';
  submitBtn.disabled = false;
  submitBtn.textContent = 'Reservar mi lugar';
});
