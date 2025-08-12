(function(window) {
  'use strict';

  // 這個陣列將用來存放從 script.js 傳來的所有 tippy 實例
  let allTippyInstances = [];

  // 主要的 PopupEditor 物件
  const PopupEditor = {
    /**
     * 接收並儲存從 script.js 傳來的所有 tippy 實例
     * @param {Array} tippyInstances - tippy 實例的陣列
     */
    attachAll: function(tippyInstances) {
      allTippyInstances = tippyInstances;
      console.log('PopupEditor 已成功接收 tippy 實例:', allTippyInstances);

      //遍歷所又的 tippy 實例並設定內容
      allTippyInstances.forEach(instance => {
        const wordSpan = instance.reference;
        const wordId = wordSpan.dataset.wordId;

        // 建立 popup 的預設 HTML 內容版型
        const popupContent = `
          <div class="popup-container" data-word-id="${wordId}">
            <div class="popup-simple-view">
              <p>這裡是「${wordSpan.textContent}」的簡易說明。</p>
            </div>
            <hr>
            <div class="popup-detailed-view">
              <p>這裡是詳細說明，之後可以放 Markdown 內容。</p>
            </div>
          </div>
        `;

        // 使用 setContent 更新 popup 的內容
        instance.setContent(popupContent);
      });
    }
  };

  // 將 PopupEditor 物件掛載到 window 上，讓其他 script可以存取
  window.PopupEditor = PopupEditor;

})(window);