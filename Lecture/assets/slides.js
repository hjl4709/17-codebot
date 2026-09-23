(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
    if (!slides.length) return;

    var idx = 0;
    var total = slides.length;

    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    var counter = document.getElementById('slideCounter');
    var progressBar = document.getElementById('progressBar');

    // 새로고침해도 마지막 위치 기억 (같은 챕터 내에서만)
    var storageKey = 'dl6-slide-' + (document.body.getAttribute('data-deck') || 'default');

    function clamp(n) { return Math.max(0, Math.min(total - 1, n)); }

    function render() {
      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      if (counter) counter.textContent = (idx + 1) + ' / ' + total;
      if (progressBar) progressBar.style.width = ((idx + 1) / total * 100) + '%';
      if (prevBtn) prevBtn.disabled = idx === 0;
      if (nextBtn) nextBtn.disabled = idx === total - 1;
      try { sessionStorage.setItem(storageKey, String(idx)); } catch (e) {}
      history.replaceState(null, '', '#s' + (idx + 1));
    }

    function goTo(n) { idx = clamp(n); render(); }
    function next() { goTo(idx + 1); }
    function prev() { goTo(idx - 1); }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
      else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
      else if (e.key === 'End') { e.preventDefault(); goTo(total - 1); }
    });

    // 클릭 영역: 슬라이드 좌/우 30% 클릭으로도 이동 (버튼/링크/퀴즈 클릭은 제외)
    document.querySelector('.deck').addEventListener('click', function (e) {
      if (e.target.closest('a, button, .quiz-opt, .no-nav')) return;
      var w = window.innerWidth;
      if (e.clientX < w * 0.18) prev();
      else if (e.clientX > w * 0.82) next();
    });

    // 초기 위치: URL 해시 우선, 없으면 세션 저장값
    var initial = 0;
    var hash = location.hash.match(/^#s(\d+)$/);
    if (hash) {
      initial = clamp(parseInt(hash[1], 10) - 1);
    } else {
      try {
        var saved = sessionStorage.getItem(storageKey);
        if (saved !== null) initial = clamp(parseInt(saved, 10));
      } catch (e) {}
    }
    idx = initial;
    render();
  });

  // 퀴즈 인터랙션: data-correct="true/false" 옵션 버튼
  window.answerQuiz = function (btn, isCorrect) {
    var group = btn.closest('.quiz-options');
    Array.prototype.forEach.call(group.querySelectorAll('.quiz-opt'), function (b) {
      b.disabled = true;
    });
    btn.classList.add(isCorrect === true || isCorrect === 'true' ? 'correct' : 'wrong');
    var explain = group.parentElement.querySelector('.quiz-explain');
    if (explain) explain.classList.add('show');
  };
})();
