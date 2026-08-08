const memories = [
  {
    year: '2019',
    title: 'The first day we met',
    location: 'A small café, full of nervous smiles',
    blurb: 'The beginning of a story neither of us could have predicted.',
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=900&q=80'
  },
  {
    year: '2020',
    title: 'Our first trip together',
    location: 'By the coast at golden hour',
    blurb: 'A weekend that felt like the start of a thousand little adventures.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80'
  },
  {
    year: '2022',
    title: 'A favorite summer',
    location: 'Late nights, warm air, and endless laughter',
    blurb: 'Some seasons become the ones you carry with you forever.',
    image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=900&q=80'
  },
  {
    year: '2024',
    title: 'A new chapter',
    location: 'The place where love felt most like home',
    blurb: 'Every chapter is a reminder that love is built in the everyday.',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=80'
  }
];

const timeline = document.getElementById('timeline');
const galleryGrid = document.getElementById('galleryGrid');
const memoryCount = document.getElementById('memoryCount');
const revealElements = document.querySelectorAll('.reveal');
const modal = document.getElementById('photoModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalLocation = document.getElementById('modalLocation');
const closeModal = document.getElementById('closeModal');
const prevPhoto = document.getElementById('prevPhoto');
const nextPhoto = document.getElementById('nextPhoto');
const typedStory = document.getElementById('typedStory');
let currentPhotoIndex = 0;

if (memoryCount) {
  memoryCount.textContent = `${memories.length}+ memories and counting`;
}

if (timeline) {
  timeline.innerHTML = memories
    .map(
      (memory, index) => `
        <article class="timeline-card">
          <div class="timeline-marker">${index + 1}</div>
          <div class="timeline-copy">
            <p class="timeline-year">${memory.year}</p>
            <h3>${memory.title}</h3>
            <p>${memory.location}</p>
            <p>${memory.blurb}</p>
          </div>
        </article>
      `
    )
    .join('');
}

if (galleryGrid) {
  galleryGrid.innerHTML = memories
    .map(
      (memory, index) => `
        <article class="gallery-card" tabindex="0" role="button" data-index="${index}">
          <img src="${memory.image}" alt="${memory.title}" loading="lazy" />
          <div class="gallery-card-content">
            <h3>${memory.title}</h3>
            <p>${memory.location}</p>
          </div>
        </article>
      `
    )
    .join('');

  galleryGrid.querySelectorAll('.gallery-card').forEach((card) => {
    card.addEventListener('click', () => openPhotoModal(Number(card.dataset.index)));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openPhotoModal(Number(card.dataset.index));
      }
    });
  });
}

if (typeof IntersectionObserver !== 'undefined') {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

function openPhotoModal(index) {
  currentPhotoIndex = index;
  updateModalContent();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePhotoModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function updateModalContent() {
  const memory = memories[currentPhotoIndex];
  if (!memory) return;
  modalImage.src = memory.image;
  modalImage.alt = memory.title;
  modalTitle.textContent = memory.title;
  modalLocation.textContent = memory.location;
}

function showNextPhoto() {
  currentPhotoIndex = (currentPhotoIndex + 1) % memories.length;
  updateModalContent();
}

function showPrevPhoto() {
  currentPhotoIndex = (currentPhotoIndex - 1 + memories.length) % memories.length;
  updateModalContent();
}

if (closeModal) {
  closeModal.addEventListener('click', closePhotoModal);
}

if (prevPhoto) {
  prevPhoto.addEventListener('click', showPrevPhoto);
}

if (nextPhoto) {
  nextPhoto.addEventListener('click', showNextPhoto);
}

if (modal) {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closePhotoModal();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (modal.classList.contains('open')) {
    if (event.key === 'Escape') {
      closePhotoModal();
    }
    if (event.key === 'ArrowRight') {
      showNextPhoto();
    }
    if (event.key === 'ArrowLeft') {
      showPrevPhoto();
    }
  }
});

if (typedStory) {
  const storyText = 'We started with a simple hello, and somehow that became the beginning of something beautiful. Every laugh, every quiet moment, and every little adventure has brought us closer. This is our story, still unfolding, and I hope it always feels like home.';
  let index = 0;

  const typeStory = () => {
    typedStory.textContent = storyText.slice(0, index);
    index += 1;

    if (index <= storyText.length) {
      window.setTimeout(typeStory, 28);
    }
  };

  window.setTimeout(typeStory, 400);
}
