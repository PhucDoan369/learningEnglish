(function () {
  'use strict';

  // State quản lý giọng đọc TTS
  let currentUtterance = null;

  /**
   * 1. Phát âm từ vựng bằng Web Speech API
   * @param {string} text - Từ vựng tiếng Anh cần phát âm
   */
  function speakWord(text) {
    if (!('speechSynthesis' in window)) return;

    // Hủy các lượt đọc trước đó nếu chưa hoàn thành
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Tốc độ đọc vừa phải

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  /**
   * 2. Mở Modal tìm kiếm hình ảnh minh họa trên Google Images
   * @param {string} word - Từ vựng cần tìm ảnh
   */
  function openImageSearchModal(word) {
    const modal = document.getElementById('image-modal');
    const modalTitle = document.getElementById('image-modal-title');
    const modalIframe = document.getElementById('image-modal-iframe');

    if (!modal || !modalIframe) return;

    if (modalTitle) {
      modalTitle.textContent = `Hình ảnh minh họa: "${word}"`;
    }

    // Embed tìm kiếm hình ảnh từ Google Images
    const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(word)}`;
    modalIframe.src = searchUrl;

    // Hiển thị modal
    modal.style.display = 'block';
    modal.classList.add('show');
  }

  /**
   * 3. Đóng Modal hình ảnh
   */
  function closeImageSearchModal() {
    const modal = document.getElementById('image-modal');
    const modalIframe = document.getElementById('image-modal-iframe');

    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
    }
    if (modalIframe) {
      modalIframe.src = 'about:blank'; // Xóa URL để tiết kiệm bộ nhớ
    }
  }

  /**
   * 4. Lật thẻ Vocabulary Flashcard
   * @param {HTMLElement} cardElement - Element của thẻ flashcard
   */
  function toggleCardFlip(cardElement) {
    if (!cardElement) return;
    cardElement.classList.toggle('flipped');
  }

  /**
   * 5. Khởi tạo Event Listeners cho Ứng dụng
   */
  function initEventListeners() {
    // Sự kiện Click vào các nút phát âm (.btn-audio hoặc [data-action="speak"])
    document.addEventListener('click', function (event) {
      const target = event.target;

      // Nút phát âm
      const speakBtn = target.closest('.btn-audio, [data-action="speak"]');
      if (speakBtn) {
        event.stopPropagation();
        const word = speakBtn.getAttribute('data-word') || speakBtn.innerText;
        if (word) speakWord(word);
        return;
      }

      // Nút mở modal hình ảnh
      const imageBtn = target.closest('.btn-image, [data-action="image"]');
      if (imageBtn) {
        event.stopPropagation();
        const word = imageBtn.getAttribute('data-word');
        if (word) openImageSearchModal(word);
        return;
      }

      // Nút đóng modal
      if (target.closest('.modal-close, #image-modal-close')) {
        closeImageSearchModal();
        return;
      }

      // Event lật thẻ khi click vào Flashcard
      const card = target.closest('.flashcard, .vocabulary-card');
      if (card && !target.closest('button, a')) {
        toggleCardFlip(card);
      }
    });

    // Bắt sự kiện bàn phím (Phím tắt)
    document.addEventListener('keydown', function (event) {
      // Phím ESC để đóng Modal
      if (event.key === 'Escape' || event.keyCode === 27) {
        closeImageSearchModal();
      }

      // Phím Space (Dấu cách) để lật thẻ đang chọn
      if (event.code === 'Space' && event.target === document.body) {
        event.preventDefault();
        const activeCard = document.querySelector('.flashcard.active, .vocabulary-card.active');
        if (activeCard) {
          toggleCardFlip(activeCard);
        }
      }
    });
  }

  // Khởi chạy khi DOM đã sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventListeners);
  } else {
    initEventListeners();
  }
})();