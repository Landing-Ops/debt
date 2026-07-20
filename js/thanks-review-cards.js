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
      photos: ['./img/th_test2.png', './img/th_test1.png','./img/th_test1.png'],
      stars: 5,
      goodLabel: '채무 조정 결과',
      good: [
        '총 채무액: 198,400,709원',
        '탕감액: 190,792,253원',
        '월 변제금: 211,346원',
        '변제기간: 36개월'
      ],
      reviewLabel: '채무 발생 경위와 극복과정',
      review:
        '냉동식품 공장에서 배송 일터를 오가며 일하고 있습니다. 묵묵히 몸 쓰며 성실하게만 살면 어떻게든 되는 줄 알았어요. 그런데 재작년 겨울, 무거운 자재를 옮기다 무릎 연골이 파열되고 허리디스크까지 터져 수술대에 오르게 됐습니다. 수술하고 몇 달을 꼼짝없이 누워 있는 사이, 현장 일은 못 나가고 월급이 딱 끊기더라고요. 당장 병원비랑 고정 생활비는 그대로니 급한 대로 카드론이랑 신용대출을 당겨 썼습니다. 복귀해서 갚으면 되겠지 했는데, 회복이 늦어지면서 돌려막기가 반복됐고 정신을 차려보니 빚이 어느새 4천 3백만 원 가까이 불어나 있었습니다. 겨우 몸을 추스르고 재취업했는데도, 월급 받자마자 대출 이자로 다 빠져나가 원금은 단 1원도 못 줄이는 상황이었어요. 독촉 문자라도 오는 날엔 일하다가도 손이 덜덜 떨리더군요. 어느 날 저녁 식탁에서 중학생 딸아이가 "아빠, 요즘 왜 자꾸 한숨 쉬어?" 하고 묻는데, 그 말에 너무 미안하고 부끄러워서 화장실로 들어가 한동안 나오질 못했습니다. 속으로 참 많이 울었어요.\n\n'+
        '그러다 같이 일하던 아는 지인 형님이 자기도 옛날에 힘들었다며 OOOO를 권하더라고요. 처음에는 무서워서 며칠을 망설였습니다. 개인회생을 신청하면 당장 내 월급통장부터 압류돼서 막히는 건 아닌지, 무엇보다 회사에 이 사실이 알려져서 어렵게 다시 구한 직장에서 잘리는 건 아닌지가 제일 걱정됐거든요. 나이 먹고 여기서 잘리면 끝이라는 생각에 밤에 잠도 안 왔습니다.\n\n'+
        '그래도 딸아이 얼굴 보고 살아야지 싶어 떨리는 마음으로 OOOO에 연락을 했습니다. 상담받아보니 제가 쓸데없는 걱정을 했더라고요. 변호사님께서 월급통장도 압류 없이 원래 쓰던 대로 문제없이 계속 쓸 수 있고, 법적으로도 회사에 절대 알려지지 않게 조용하고 안전하게 처리된다고 확실하게 설명해주셨어요. 그제야 턱 끝까지 막혀있던 숨이 푹 쉬어지더군요. 한 자 한 자 적다 보니 그때 생각이 나서 지금도 마음이 뭉클하네요.\n\n' +
        '결과적으로 지금은 원금의 90% 이상을 탕감받았습니다. 4천만 원이 넘던 빚 중에 거의 3천 9백만 원을 덜어낸 거예요. 요즘은 공장 나가서 원래 하던 일 계속하면서, 매달 딱 11만 원 정도만 갚고 있습니다. 이렇게 3년만 변제하면 남은 빚도 0원이 되고 완전히 끝난다고 생각하니, 매달 월급날마다 허탈했던 마음도 사라지고 생활비 관리도 차근차근 되더라고요. 예전에는 이자 메우느라 딸아이 용돈 한 번 편하게 못 줬는데, 이제는 집에 가서 딸아이 얼굴을 웃으면서 편하게 봅니다. 일할 맛도 다시 나고요.\n\n' +
        '제 인생의 가장 어두운 순간에 따뜻하게 손 내밀어 주신 OOOO 변호사님과 식구분들께 진심으로 고개 숙여 감사드립니다. 그리고 혹시 지금 사무실 대기실에서, 혹은 상담을 앞두고 떨리는 마음으로 제 글을 읽고 계실 분이 있다면 절대 포기하지 마세요. 내 탓이라며 혼자 자책해 봐야 답이 안 나오더라고요. 저도 했으니 여러분도 분명 다시 일어설 수 있습니다. 다들 힘내세요.'
    },
    'review-2': {
      avatar: './img/avatar002.png',
      name: '정OO',
      meta: '20대 / 여성 / 직장인',
      tags: ['깔끔한 일처리', '친절한 안내', '법무사의 꼼꼼함'],
      photos: ['./img/th_test2.png', './img/th_test1.png'],
      stars: 5,
      goodLabel: '채무 조정 결과',
      good: [
        '비대면으로 시간에 구애받지 않고 접수 가능한 점',
        '서류 준비 과정을 꼼꼼히 짚어주신 점',
        '연락드릴 때마다 친절하게 안내해 주신 점'
      ],
      reviewLabel: '채무 발생 경위와 극복과정',
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
      goodLabel: '채무 조정 결과',
      good: [
        '질문할 때마다 빠른 피드백을 주신 점',
        '필요한 자료를 이해하기 쉽게 안내해 주신 점',
        '제 상황에 맞춰 1:1로 진행해 주신 점'
      ],
      reviewLabel: '채무 발생 경위와 극복과정',
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

  var scrollY = 0;

  openLightbox = function (src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lightbox.hidden = false;

    scrollY = window.scrollY;
    document.body.style.top = '-' + scrollY + 'px';
    document.body.classList.add('rv-lightbox-locked');
  };

  function closeLightbox() {
    lightbox.hidden = true;
    lbImg.src = '';

    document.body.classList.remove('rv-lightbox-locked');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
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
    var elPhotosWrap = modal.querySelector('.rv-modal__photosWrap');
    var elPhotoDots  = modal.querySelector('[data-modal-photo-dots]');
    var btnPhotoPrev = modal.querySelector('[data-photo-prev]');
    var btnPhotoNext = modal.querySelector('[data-photo-next]');
    var photoIndex = 0;

    // 1) 함수 시작 전에 변수 하나 추가
    var modalScrollY = 0;

    // ★ 추가
    function goToPhoto(i, total) {
      photoIndex = Math.min(Math.max(i, 0), total - 1);
      var slot = elPhotos.children[photoIndex];
      if (slot) slot.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      updatePhotoDots();
    }

    function updatePhotoDots() {
      var dots = elPhotoDots.querySelectorAll('[role="tab"]');
      dots.forEach(function (d, di) {
        d.setAttribute('aria-selected', di === photoIndex ? 'true' : 'false');
      });
    }

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

      /* 카드와 동일한 사진, 클릭 시 라이트박스 확대 */
      elPhotos.innerHTML = '';
      elPhotoDots.innerHTML = '';
      photoIndex = 0;
      elPhotos.scrollLeft = 0;   // ★ 추가 — 스크롤 위치를 항상 맨 처음으로 리셋

      d.photos.forEach(function (src, i) {
        var slot = document.createElement('div');
        slot.className = 'rv-modal__photoSlot';

        var img = document.createElement('img');
        img.className = 'rv-modal__photo';
        img.src = src;
        img.alt = d.name;
        img.addEventListener('click', function () {
          openLightbox(src, d.name);
        });

        slot.appendChild(img);
        elPhotos.appendChild(slot);

        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'rv-modal__photoDot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.addEventListener('click', function () { goToPhoto(i, d.photos.length); });
        elPhotoDots.appendChild(dot);
      });

      var multi = d.photos.length > 1;
      btnPhotoPrev.hidden = !multi;
      btnPhotoNext.hidden = !multi;
      elPhotoDots.style.display = multi ? 'flex' : 'none';

      btnPhotoPrev.onclick = function () { goToPhoto(photoIndex - 1, d.photos.length); };
      btnPhotoNext.onclick = function () { goToPhoto(photoIndex + 1, d.photos.length); };

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
      modalScrollY = window.scrollY;
      document.body.style.top = '-' + modalScrollY + 'px';
      document.body.classList.add('rv-locked');
    };
    // open modal 맨 끝

    function closeModal() {
      modal.hidden = true;
      document.body.classList.remove('rv-locked');
      document.body.style.top = '';
      window.scrollTo(0, modalScrollY);
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