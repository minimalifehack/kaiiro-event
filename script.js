// 同一ページ内リンクのスムーススクロール
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// モバイル用ハンバーガーメニューの開閉
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (navToggle && mobileNav) {
  const closeMenu = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'メニューを開く');
    mobileNav.classList.remove('is-open');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  });

  // メニュー内のリンクをタップしたら閉じる
  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  // 画面幅が広がってPC表示に戻ったら開閉状態をリセット
  window.matchMedia('(min-width: 761px)').addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
}

// 出店者一覧の横スクロールとスライダーを同期
document.querySelectorAll('.vendor-category').forEach((category) => {
  const scrollArea = category.querySelector('.vendor-scroll');
  const slider = category.querySelector('.vendor-slider');
  if (!scrollArea || !slider) return;

  const getMaxScroll = () => scrollArea.scrollWidth - scrollArea.clientWidth;

  const syncSlider = () => {
    const maxScroll = getMaxScroll();
    slider.disabled = maxScroll <= 0;
    slider.value = maxScroll > 0 ? String((scrollArea.scrollLeft / maxScroll) * 100) : '0';
  };

  slider.addEventListener('input', () => {
    const maxScroll = getMaxScroll();
    scrollArea.scrollLeft = maxScroll * (Number(slider.value) / 100);
  });

  scrollArea.addEventListener('scroll', syncSlider, { passive: true });
  window.addEventListener('resize', syncSlider);
  requestAnimationFrame(syncSlider);
});

// スクロールに合わせて、紙片がふわっと浮かび上がる演出
const revealTargets = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window && revealTargets.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // 同じセクション内の要素を少しずつ時間差で出現させる
          entry.target.style.transitionDelay = `${(index % 4) * 90}ms`;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
  );

  revealTargets.forEach((el) => observer.observe(el));
} else {
  // 対応していない環境ではそのまま表示
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}
