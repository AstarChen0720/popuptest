(function(window) {
  'use strict';

  // 這個陣列將用來存放從 script.js 傳來的所有 tippy 實例
  let allTippyInstances = [];
  // 用來儲存每個 popup 內容的物件
  const popupData = {};
  // 新增一個變數用來存放當前的 EasyMDE 實例(他會自動創建一個實例套用到當前的textarea讓他有markdown的一堆方便功能)
  let activeEditor = null;

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

        // 如果這個 popup 沒有資料就套用預設 HTML 內容版型
        if (!popupData[wordId]) {
          popupData[wordId] = {
            simple: `這裡是「${wordSpan.textContent}」的簡易說明。`,
            detailed: `這裡是詳細說明，之後可以放 **Markdown** 內容。`
          };
        }


        // 使用儲存的資料來建立 popup 內容
        const data = popupData[wordId];
        const popupContent = `
          <div class="popup-container" data-word-id="${wordId}">
            <div class="popup-simple-view popup-section" data-section="simple">
              ${marked.parse(data.simple)}
            </div>
            <hr>
            <div class="popup-detailed-view popup-section" data-section="detailed">
              ${marked.parse(data.detailed)}
            </div>
          </div>
        `;

        // 使用 setContent 更新 popup 的內容
        instance.setContent(popupContent);
      });
    },
    /**
     * 新增：處理 popup 掛載事件的函式
     * @param {Object} instance - tippy 實例
     */
    handleMount: function(instance) {
      //取得 popup 的容器元素
      const popupEl = instance.popper.querySelector('.popup-container');
      if (popupEl) {
        // 加上點擊監聽
        popupEl.addEventListener('click', handlePopupClick);
      }
    },
    /**
     * 新增：處理 popup 隱藏事件的函式
     * @param {Object} instance - tippy 實例
     */
    handleHide: function(instance) {
      // 如果當前有正在運作的編輯器，就儲存並關閉它
      if (activeEditor) {
        // 從編輯器所在的 DOM 元素中找出 wordId 和 section
        const editorEl = activeEditor.element.closest('.popup-section');
        if (editorEl) {
          const wordId = editorEl.closest('.popup-container').dataset.wordId;
          const section = editorEl.dataset.section;
          //呼叫 saveAndCloseEditor 函式並傳入必要參數
          saveAndCloseEditor(wordId, section);
        }
      }
    }
  };

  //建立一個處理 popup 點擊事件的函式(handlePopupClick)
  /**
   * 處理 popup 內部點擊事件的函式
   * @param {Event} e - 監聽的元素的"點擊事件物件"(監聽到的包含實際被點擊的元素、典籍的事件類型、當下的滑鼠座標.....)，裡面e.target代表"真正被點擊的元素"
   */
  function handlePopupClick(e) {
    // 如果已經有編輯器在運作，就直接返回，避免重複開啟
    if (activeEditor) {
      return;
    }

    // e.target 是使用者實際點擊的元素 (可能是 <p>, <strong> 等)
    // .closest方法('.popup-section') 會從該元素往上找，直到找到 class 為 'popup-section' 的祖先元素
    const sectionEl = e.target.closest('.popup-section');

    // 如果點擊的地方不在 .popup-section 裡面 (例如點擊了分隔線)，就什麼都不做
    if (!sectionEl) {
      return;
    }

    // 從 sectionEl 再往上找到 '.popup-container'，並讀取它的 data-word-id 屬性
    const wordId = sectionEl.closest('.popup-container').dataset.wordId;
    // 從 sectionEl 讀取它的 data-section 屬性 ('simple' 或 'detailed')
    const section = sectionEl.dataset.section;

    
    
    // 呼叫 createEditor 函式，並把需要的資訊傳給它
    createEditor(sectionEl, wordId, section);
    
    // 為了確認我們有抓到正確的資訊，先把它們印出來看看
    console.log(`準備編輯 Word ID: ${wordId}, Section: ${section}`);
    }
    // 下一步，我們會在這裡呼叫 createEditor() 來建立編輯器

    /**
     * 建立 EasyMDE 編輯器並替換掉原本的內容
     * @param {HTMLElement} element - 要被替換的元素 (e.g., .popup-simple-view)
     * @param {string} wordId - 當前單字的 ID
     * @param {string} section - 'simple' 或 'detailed'
     */
    function createEditor(element, wordId, section) {
    // 從 popupData 讀取這個區塊原本的 Markdown 內容
    const originalContent = popupData[wordId][section];

    // 清空原本顯示的 HTML 內容
    element.innerHTML = '';

    // 建立一個 textarea 元素，EasyMDE 需要它才會有作用
    const textarea = document.createElement('textarea');
    element.appendChild(textarea);

    // 建立 EasyMDE 實例，並將它存到 activeEditor 變數中
    activeEditor = new EasyMDE({
      element: textarea,
      initialValue: originalContent,
      autofocus: true,
      toolbar: ["bold", "italic", "strikethrough", "|", "unordered-list", "ordered-list", "|", "link", "table"],
      minHeight: '100px',
      spellChecker: false, // 關閉拼字檢查
      status: false, // 隱藏底部的狀態列
      autosave: {
        enabled: true,
        delay: 1000
      }
    });

  }


  /**
   * 儲存內容並關閉編輯器
   * @param {string} wordId 
   * @param {string} section 
   */
  function saveAndCloseEditor(wordId, section) {
    // 如果沒有正在運作的編輯器，就什麼都不做
    if (!activeEditor) return;

    // 1. 從編輯器取得新內容
    const newContent = activeEditor.value();

    // 2. 將新內容存回 popupData
    popupData[wordId][section] = newContent;

    // 3. 找到編輯器所在的父容器元素 (也就是 .popup-section)
    const editorContainer = activeEditor.element.closest('.popup-section');

    // 4. 銷毀 EasyMDE 編輯器實例並釋放資源
    activeEditor.toTextArea();
    activeEditor = null;

    // 5. 如果找到了容器，就將新內容解析為 HTML 並更新回去，這樣在關閉前的innerHTML一定就有最新的html
    if (editorContainer) {
      editorContainer.innerHTML = marked.parse(newContent);
    }
  }

  // 將 PopupEditor 物件掛載到 window 上，讓其他 script可以存取
  window.PopupEditor = PopupEditor;

})(window);