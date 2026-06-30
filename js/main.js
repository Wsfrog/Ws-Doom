let posts = {};

async function loadPosts() {
  try {
    const res = await fetch('data/posts.json');
    posts = await res.json();
  } catch (err) {
    console.error('Erro ao carregar posts.json:', err);
  }
}

const SPOTIFY_EMBED_URL = 'https://open.spotify.com/embed/artist/17Vw9uuOYB7XYjPt0LNFN0?utm_source=generator&theme=0';

function openSpotify() {
  const iframe = document.getElementById('spotify-iframe');
  if (!iframe.getAttribute('src')) iframe.src = SPOTIFY_EMBED_URL;

  document.getElementById('spotify-modal').classList.add('open');
  document.getElementById('spotify-modal').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeSpotify() {
  document.getElementById('spotify-modal').classList.remove('open');
  document.getElementById('spotify-modal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function closeOnOverlaySpotify(e) {
  if (e.target === document.getElementById('spotify-modal')) closeSpotify();
}

function openModal(id) {
  const post = posts[id];
  if (!post) return;

  document.getElementById('modal-eyebrow').textContent = post.eyebrow;
  document.getElementById('modal-title').textContent = post.title;

  const meta = document.getElementById('modal-meta');
  meta.innerHTML = `
    <span class="modal-date">${post.date}</span>
    <span class="modal-author">· ${post.author}</span>
    ${post.tags.map(t => `<span class="modal-tag">${t}</span>`).join('')}
  `;

  // ATENÇÃO (segurança): post.note e post.body são renderizados via innerHTML.
  // data/posts.json é um arquivo estático controlado por mim (sem input externo/usuário).
  // Se este conteúdo passar a vir de um CMS, formulário ou qualquer fonte não confiável,
  // é obrigatório sanitizar (ex: DOMPurify) antes de injetar, ou trocar para textContent.
  document.getElementById('modal-body').innerHTML = `
    <div class="modal-note">${post.note}</div>
    ${post.body}
  `;

  document.getElementById('modal-original-link').href = `#${id}`;

  document.getElementById('modal').classList.add('open');
  document.getElementById('modal').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.getElementById('modal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function closeOnOverlay(e) {
  if (e.target === document.getElementById('modal')) closeModal();
}

function copyLinkToClipboard(e) {
  e.preventDefault();
  const url = window.location.href.split('#')[0] + '#' + document.getElementById('modal-title').textContent.toLowerCase().replace(/\s+/g, '-');

  navigator.clipboard.writeText(url).catch(err => {
    console.error('Não foi possível copiar o link:', err);
  });

  const linkElement = e.target;
  const originalText = linkElement.textContent;
  linkElement.textContent = 'copied!';
  linkElement.style.color = 'var(--accent)';
  setTimeout(() => {
    linkElement.textContent = originalText;
    linkElement.style.color = '';
  }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
  loadPosts();

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      closeSpotify();
    }
  });

  document.querySelectorAll('.post-item[role="button"]').forEach(item => {
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  document.querySelector('.modal-close[role="button"]').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      closeModal();
    }
  });
});