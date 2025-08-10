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



    // 遍歷所有部分 (單字和空格)
    parts.forEach(part => {
      // 如果這部分不是空格且不為空，就視為一個單字
      if (part.trim() !== '') {
        const wordSpan = document.createElement('span');
        wordSpan.textContent = part;
        outputContainer.appendChild(wordSpan);

        // 建立 tippy 實例並設定內容
        const instance = tippy(wordSpan, {
          content: `這是 '${part}' 的 popup`,
        });
        // 將建立好的實例加到陣列中
        tippyInstances.push(instance);
      } else {
        // 如果是空格或換行，直接當作文字節點添加
        // CSS 中的 white-space: pre-wrap; 會處理它們的顯示
        outputContainer.appendChild(document.createTextNode(part));
      }
    });

    // 如果有任何 tippy 實例被建立
    if (tippyInstances.length > 0) {
      // 使用 tippy.createSingleton() 來管理所有實例
      singletonInstance = tippy.createSingleton(tippyInstances, {
        // 你可以在這裡設定所有 popup 的共同行為
        placement: 'top',
        animation: 'scale',
        // 讓 popup 之間的切換更流暢
        moveTransition: 'transform 0.2s ease-out',
      });
    }
  });
});



