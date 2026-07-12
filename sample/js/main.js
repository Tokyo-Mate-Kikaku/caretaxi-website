/* サンプル介護タクシー — main.js */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- 横スクロールテーブルのスクロールヒント（scroll-hint 読込ページのみ） ---- */
  if (typeof ScrollHint !== 'undefined' && document.querySelector('.js-scrollable')) {
    new ScrollHint('.js-scrollable', {
      suggestiveShadow: true,
      i18n: { scrollable: 'スクロールできます' }
    });
  }

  /* ---- ハンバーガーメニュー ---- */
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const navBackdrop = document.querySelector('.nav-backdrop');
  let lockedScrollY = 0;

  function setMenuOpen(isOpen) {
    mobileNav.classList.toggle('open', isOpen);
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    if (navBackdrop) navBackdrop.classList.toggle('open', isOpen);

    if (isOpen) {
      lockedScrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${lockedScrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      window.scrollTo({ top: lockedScrollY, left: 0, behavior: 'instant' });
    }
  }

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      setMenuOpen(!mobileNav.classList.contains('open'));
    });
  }
  if (navBackdrop) {
    navBackdrop.addEventListener('click', function () {
      setMenuOpen(false);
    });
  }

  /* ---- 現在ページのナビをactive ---- */
  const currentPath = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a, .mobile-nav a').forEach(function (a) {
    const href = a.getAttribute('href').split('/').pop() || 'index.html';
    if (href === currentPath) a.classList.add('active');
  });

  /* ---- FAQアコーディオン ---- */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // 他を閉じる（任意：全部開ける場合はこのブロックを削除）
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        if (o !== item) {
          o.classList.remove('open');
          o.querySelector('.faq-answer').classList.remove('open');
        }
      });

      item.classList.toggle('open', !isOpen);
      answer.classList.toggle('open', !isOpen);
    });
  });

  /* ---- スムーススクロール（ページ内リンク） ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // ヘッダー高さ
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---- GA4 イベント計測 ---- */
  function track(eventName, params) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
  }

  // 電話番号クリック
  document.querySelectorAll('a[href^="tel:"]').forEach(function (el) {
    el.addEventListener('click', function () {
      track('phone_click', {
        event_category: 'contact',
        event_label: el.href.replace('tel:', '')
      });
    });
  });

  // LINEリンククリック
  document.querySelectorAll('a[href*="line.me"], a[href*="lin.ee"]').forEach(function (el) {
    el.addEventListener('click', function () {
      track('line_click', { event_category: 'contact' });
    });
  });

});
