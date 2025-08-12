//加上監聽器，監聽文字輸入區的變化
document.addEventListener('DOMContentLoaded', () => {
  //一有變化就執行下面的東西
  const textInput = document.getElementById('text-input');
  const outputContainer = document.getElementById('output-container');
  let singletonInstance = null; // 用來存放 singleton 實例


  textInput.addEventListener('input', () => {
    // 清空舊的內容
    
    // 如果已有 singleton 實例，先將其銷毀，避免舊的實例殘留
    if (singletonInstance) {
      singletonInstance.destroy();
    }
    
    //將outputContainer的內容清空
    outputContainer.innerHTML = '';

    const text = textInput.value;

    // 使用正則表達式分割字串，(\s+) 會保留空格和換行符
    
    const parts = text.split(/(\s+)/);

    const tippyInstances = []; // 建立一個空陣列來存放所有 tippy 實例
    
    // 新增一個變數：用來放唯一 id
    let wordCounter = 0; 


    // 遍歷所有部分 (單字和空格)
    parts.forEach(part => {
      // 如果這部分不是空格且不為空，就視為一個單字
      if (part.trim() !== '') {
        const wordSpan = document.createElement('span');
        wordSpan.textContent = part;

        // 新增：為每個詞設定唯一 id
        wordCounter += 1;
        //把id新增到wordSpan中
        wordSpan.dataset.wordId = `w-${wordCounter}`;
        
        outputContainer.appendChild(wordSpan);

        // 建立 tippy 實例並設定內容
        const instance = tippy(wordSpan, {
          content: `這是 ${part}的 popup`,
          allowHTML: true,
        });
        // 將建立好的實例加到陣列中
        tippyInstances.push(instance);
      } else {
        // 如果是空格或換行，直接當作文字節點添加
        // CSS 中的 white-space: pre-wrap; 會處理它們的顯示
        outputContainer.appendChild(document.createTextNode(part));
      }
    });

    // 新增：將所有 tippy 實例交給 PopupEditor 交互編輯邏輯
    if (tippyInstances.length > 0 && window.PopupEditor) {
      window.PopupEditor.attachAll(tippyInstances);
    }
    
    // 如果有任何 tippy 實例被建立
    if (tippyInstances.length > 0) {
      // 使用 tippy.createSingleton() 來管理所有實例
      // !注意，他會覆蓋掉你單獨為每個 tippy 實例設定的樣式
      singletonInstance = tippy.createSingleton(tippyInstances, {
        // 你可以在這裡設定所有 popup 的共同行為
        allowHTML: true,
        placement: 'top',
        animation: 'scale',
        // 讓 popup 之間的切換更流暢
        moveTransition: 'transform 0.2s ease-out',
        interactive: true, // 允許選擇文字
        // 新增：將 onMount 設定移到這裡
        onMount(instance) {
          // 呼叫 PopupEditor 裡的方法來處理掛載事件
          if (window.PopupEditor && window.PopupEditor.handleMount) {
            window.PopupEditor.handleMount(instance);
          }
        },
        // 新增：當 popup 即將隱藏時，呼叫 handleHide
        onHide(instance) {
          if (window.PopupEditor && window.PopupEditor.handleHide) {
            window.PopupEditor.handleHide(instance);
          }
          // 返回 true 以允許 popup 正常隱藏
          return true;
        },
      });
    }
  });
});



