/* =====================================================================
   review-cards.js  —  섹션2 후기 카드 슬라이드 + 상세 팝업 + 이미지 라이트박스
   - 좌우 버튼 없음. 터치 스와이프 / 마우스 드래그로 넘김
   - 카드 또는 "이어서 읽기" 클릭 시 팝업에 상세 데이터 채워서 노출
   - 팝업 상단(tags 아래)에 카드와 동일한 사진 2장을 나란히 노출, 클릭 시 라이트박스 확대
   - 본문(review)은 카드처럼 텍스트 하나로 쭉 이어짐
   - 팝업 데이터는 이 파일 상단 REVIEW_DATA에서 관리 (HTML 수정 없이 내용 교체 가능)
===================================================================== */
(function () {
  'use strict';

  var root = document.querySelector('.section.rv');
  if (!root) return;

  /* ---------- 후기 상세 데이터 (id는 HTML의 li#review-N과 매칭) ---------- */
  var REVIEW_DATA = {
    'review-1': {
      avatar: './img/avatar001.png',
      name: '오OO',
      meta: '30대 / 여성 / 프리랜서',
      tags: ['법무사의 유연한 대응', '빠른 고객대응', '높은 탕감률'],
      photos: ['./img/th_test2.png', './img/th_test1.png'],
      stars: 5,
      goodLabel: 'ABC사무소의 만족스러웠던 점은 무엇인가요?',
      good: [
        '시간은 걸렸으나 약속하신 월 변제금으로 인가를 받아내셨습니다',
        '비대면으로 모든 게 진행 가능한 점',
        '홈페이지에서 진행 상황과 제출 서류 리스트 등 확인이 가능한 점',
        '분납이 타사보다 길게 가능한 점'
      ],
      reviewLabel: 'ABC사무소를 이용하신 소감을 들려 주세요',
      review:
        '실제 신청 전에 예상 월 변제금 조회가 가능하고 분납 회차도 길어서 부담이 적습니다.\n\n' +
        '그리고 월 변제금도 6만 원대로 예상하고 진행해 주셨는데 실제로 6만 원으로 인가받았고 높은 탕감률로 진행되었습니다.\n\n' +
        '중간에 보정서 제출이 몇 번 있었고 3개월 이상의 시간이 걸려서 이게 제대로 진행되는 게 맞나 걱정했습니다만, 확실히 법무사님들이 대응을 잘해주셔서 제출 서류들을 준비하는 귀찮음은 있지만 개시 결과를 받은 지금은 만족합니다.\n\n' +
        '고객센터 대응도 빠르고 법무사님들이 직접 대답해 주셔서 소통이 빠른 점도 좋습니다.\n\n' +
        '제 경우는 월 수입이 적은 상태여서 다른 사무실에서는 인가가 불가능하다고 분석한 경우가 많거나 월 변제금을 10만 원대로 분석했는데 ABC사무소에서는 약속하신 6만 원대로 받아내셨고 AI 분석으로도 인가가 어려울 수 있으나 실제 상담받아보라고 나왔는데 빠르게 직접 상담해 주셨고 이렇게 성공해서 좋습니다.'
    },
    'review-2': {
      avatar: './img/avatar002.png',
      name: '정OO',
      meta: '20대 / 여성 / 직장인',
      tags: ['깔끔한 일처리', '친절한 안내', '법무사의 꼼꼼함'],
      photos: ['./img/th_test2.png', './img/th_test1.png'],
      stars: 5,
      goodLabel: 'ABC사무소의 만족스러웠던 점은 무엇인가요?',
      good: [
        '비대면으로 시간에 구애받지 않고 접수 가능한 점',
        '서류 준비 과정을 꼼꼼히 짚어주신 점',
        '연락드릴 때마다 친절하게 안내해 주신 점'
      ],
      reviewLabel: 'ABC사무소를 이용하신 소감을 들려 주세요',
      review:
        '어린 나이에 판단력이 흐려져 순간의 잘못된 선택을 이겨내지 못하고 계속해서 갚고 막으려 해봤지만, 결국 큰 빚을 지게 되었는데,\n\n' +
        '가족들에게도 도움을 청하거나 말을 하지 못하고 끙끙대고 있던 찰나, 회생과 파산이라는 제도를 알게 되고 전문 법무사 사무실에 찾아가는 것이 너무나 부담스러웠는데(근무시간과 맞지 않는 이유도 있음), 비대면으로 꼼꼼히 회생 진행을 도와주시는 ABC사무소 법무사님들을 알게 되고 진행하게 되었습니다.'
    },
    'review-3': {
      avatar: './img/avatar003.png',
      name: '문OO',
      meta: '30대 / 남성 / 직장인',
      tags: ['빠른 피드백', '책임감 있는 법무사', '1:1 맞춤 진행'],
      photos: ['./img/th_test2.png', './img/th_test1.png'],
      stars: 5,
      goodLabel: 'ABC사무소의 만족스러웠던 점은 무엇인가요?',
      good: [
        '질문할 때마다 빠른 피드백을 주신 점',
        '필요한 자료를 이해하기 쉽게 안내해 주신 점',
        '제 상황에 맞춰 1:1로 진행해 주신 점'
      ],
      reviewLabel: 'ABC사무소를 이용하신 소감을 들려 주세요',
      review:
        '2월 말에 수임신청 드려서 드디어 4개월 만에 개시결정까지 나왔습니다.\n\n' +
        '처음에 뭘 어떻게 해야 할지 몰라 당황했을 때 간편하게 자료 확보하는 법부터 다르다는 생각이 들었어요.\n\n' +
        '그리고 모르는 부분에 대해 물어볼 때마다 빠르게 답변 주셔서, 수임료 이상의 값어치를 하는 사무소라고 느꼈습니다.'
    }
  };

  var track  = root.querySelector('.rv__track');
  var slides = Array.prototype.slice.call(root.querySelectorAll('.rv__slide'));
  var dots   = Array.prototype.slice.call(root.querySelectorAll('.rv__dot'));
  if (!track || !slides.length) return;

  /* ---------- 화면 크기별 한 번에 보이는 카드 수 ---------- */
  function visibleCount() {
    var w = window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 720)  return 2;
    return 1;
  }

  var index = 0;

  function maxIndex() {
    return Math.max(0, slides.length - visibleCount());
  }

  function applyTransform(extraPx) {
    var pct = (100 / visibleCount()) * index;
    var px = extraPx || 0;
    track.style.transform = 'translateX(calc(-' + pct + '% + ' + px + 'px))';
  }

  function goTo(i) {
    index = Math.min(Math.max(i, 0), maxIndex());
    applyTransform();
    dots.forEach(function (d, di) {
      d.setAttribute('aria-selected', di === index ? 'true' : 'false');
    });
  }

  dots.forEach(function (d, di) { d.addEventListener('click', function () { goTo(di); }); });
  window.addEventListener('resize', function () { goTo(index); });

  /* ---------- 터치 / 마우스 드래그 스와이프 ---------- */
  var isDragging = false;
  var dragMoved  = false;
  var startX = 0;
  var deltaX = 0;
  var trackWidth = 0;

  function dragStart(clientX) {
    isDragging = true;
    dragMoved  = false;
    startX = clientX;
    deltaX = 0;
    trackWidth = track.getBoundingClientRect().width;
    track.style.transition = 'none';
  }

  function dragMove(clientX) {
    if (!isDragging) return;
    deltaX = clientX - startX;
    if (Math.abs(deltaX) > 4) dragMoved = true;
    applyTransform(deltaX);
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = '';

    var threshold = trackWidth * 0.12; // 카드 폭의 12% 이상 밀면 다음/이전으로
    if (deltaX <= -threshold)      goTo(index + 1);
    else if (deltaX >= threshold)  goTo(index - 1);
    else                            goTo(index); // 원위치
    deltaX = 0;
  }

  /* 터치 */
  track.addEventListener('touchstart', function (e) {
    dragStart(e.touches[0].clientX);
  }, { passive: true });
  track.addEventListener('touchmove', function (e) {
    dragMove(e.touches[0].clientX);
  }, { passive: true });
  track.addEventListener('touchend', dragEnd);

  /* 마우스 드래그 (PC) */
  track.addEventListener('mousedown', function (e) {
    dragStart(e.clientX);
    e.preventDefault();
  });
  window.addEventListener('mousemove', function (e) {
    if (isDragging) dragMove(e.clientX);
  });
  window.addEventListener('mouseup', function () {
    if (isDragging) dragEnd();
  });

  /* ---------- 이미지 라이트박스 (팝업보다 위 레이어, 전역 1개) ---------- */
  var lightbox = document.querySelector('[data-lightbox]');
  var openLightbox = function () {};

  if (lightbox) {
    var lbImg = lightbox.querySelector('[data-lightbox-img]');

    openLightbox = function (src, alt) {
      lbImg.src = src;
      lbImg.alt = alt || '';
      lightbox.hidden = false;
    };
    function closeLightbox() {
      lightbox.hidden = true;
      lbImg.src = '';
    }
    lightbox.querySelectorAll('[data-lightbox-close]').forEach(function (el) {
      el.addEventListener('click', closeLightbox);
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }

  /* ---------- 상세 팝업 ---------- */
  var modal = document.querySelector('[data-review-modal]');
  var openModal = function () {};

  if (modal) {
    var elAvatar      = modal.querySelector('[data-modal-avatar]');
    var elName        = modal.querySelector('[data-modal-name]');
    var elMeta        = modal.querySelector('[data-modal-meta]');
    var elTags        = modal.querySelector('[data-modal-tags]');
    var elPhotos      = modal.querySelector('[data-modal-photos]'); // 카드와 동일한 사진 2장 영역
    var elGoodLabel   = modal.querySelector('[data-modal-good-label]');
    var elGood        = modal.querySelector('[data-modal-good]');
    var elReviewLabel = modal.querySelector('[data-modal-review-label]');
    var elReview      = modal.querySelector('[data-modal-review]');

    openModal = function (id) {
      var d = REVIEW_DATA[id];
      if (!d) return;

      elAvatar.src = d.avatar;
      elAvatar.alt = d.name;
      elName.textContent = d.name;
      elMeta.textContent = d.meta;

      elTags.innerHTML = '';
      d.tags.forEach(function (t) {
        var span = document.createElement('span');
        span.className = 'rv__tag';
        span.textContent = t;
        elTags.appendChild(span);
      });

      /* 카드와 동일한 사진 2장, 클릭 시 라이트박스 확대 */
      elPhotos.innerHTML = '';
      d.photos.forEach(function (src) {
        var img = document.createElement('img');
        img.className = 'rv-modal__photo';
        img.src = src;
        img.alt = d.name;
        img.addEventListener('click', function () {
          openLightbox(src, d.name);
        });
        elPhotos.appendChild(img);
      });

      elGoodLabel.textContent = d.goodLabel;
      elGood.innerHTML = '';
      d.good.forEach(function (g) {
        var li = document.createElement('li');
        li.textContent = g;
        elGood.appendChild(li);
      });

      elReviewLabel.textContent = d.reviewLabel;
      elReview.textContent = d.review;

      modal.hidden = false;
      document.body.classList.add('rv-locked');
    };

    function closeModal() {
      modal.hidden = true;
      document.body.classList.remove('rv-locked');
    }

    modal.querySelectorAll('[data-review-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden && lightbox && lightbox.hidden) closeModal();
    });
  }

  /* 카드 전체 클릭 + "자세히 읽기" 버튼 클릭 모두 팝업 오픈*/
  slides.forEach(function (slide) {
    slide.addEventListener('click', function (e) {
      if (dragMoved) { e.preventDefault(); return; }
      openModal(slide.id);
    });
  });

  /* 카드 요약문을 REVIEW_DATA에서 자동 생성 */
  slides.forEach(function (slide) {
    var d = REVIEW_DATA[slide.id];
    if (!d) return;
    var excerptEl = slide.querySelector('[data-excerpt]');
    if (!excerptEl) return;
    excerptEl.textContent = d.review;   // review 원문 통째로 넣고, CSS의 max-height+mask로 잘려 보이게
  });

  /* 카드 안 태그를 REVIEW_DATA에서 자동으로 채움 */
  slides.forEach(function (slide) {
    var d = REVIEW_DATA[slide.id];
    if (!d) return;
    var tagsEl = slide.querySelector('[data-card-tags]');
    if (!tagsEl) return;
    tagsEl.innerHTML = '';
    d.tags.forEach(function (t) {
      var span = document.createElement('span');
      span.className = 'rv__tag';
      span.textContent = t;
      tagsEl.appendChild(span);
    });
  });

  goTo(0);
})();