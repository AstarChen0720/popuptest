## 更新紀錄
- 2025-08-11：首次撰寫

## 概念（Overview）
- 把使用者輸入的文字依空白切成片段，為每個非空白片段建立一個帶 tooltip 的 span，並用 tippy 的 singleton 統一管理所有 tooltip。

## 簡易流程（主要功能組成）
1. 監聽整個檔案，如果有dom元素才執行後面的所有東西
2. 如果輸入框有新的input
   1. 清空output框內容並銷毀裡面的Singleton
   2. 用以空白為條件分開輸入框每個詞
   3. 為每個分開的詞都建立一個tippy實例
   4. 把所有tippy裝成一個陣列(因為singleton只吃tippy陣列)，並且順便為每一個非空白詞設定一個span，然後全部輸出到output-content
   5. 把tippy陣列用來建立Singleton並設定樣式
   6. 把tippy陣列傳到popupEditor增刪樣式、交互邏輯
   7. (tippy會自動為span內的東西掛上popup，又有群組了所有的popup讓每次只會顯示一個)

## 輸入 / 輸出
- **輸入**：test word
- **輸出**：他就會在網頁的output-content的地方將分別為test和word各建立一個popup，且一次只會顯示一個，指到一個另一個就會消失

## 核心功能實現的方式
- 
## 錯誤
- 
## 詳細流程（逐行解釋）
1. 用document.addEventListener('DOMContentLoaded', () => {....
  監聽document就等於監聽整個html，第一個參數'DOMContentLoaded'代表如果dom元素已經loaded時就去執行包在他裡面的函數，
  而他在裡面的元素就是我們要做的事

   1. 用const OOO = document.getElementById('OOO')先取得html的元素這樣才可以在js裡面控制，用const做成常數才好呼叫 
   2. 為textInput這個textarea加上一個監聽，參數事'input'代表如果有輸入任何東西就會執行他後面的函數
      1. 先清空上次的singleton跟內容
      2. 將輸入的內容作成常數這樣才好用
      const text = textInput.value
      3. text.split(/(\s+)/)，.split()是一個用在文字上面的方法，代表用括號內的條件來切割文字，而括號內的/(\s+)/是"正則表達式"(一種表達條件的方法)，前後的/是正則表達式的開始和結束，而\s代表全部的空白字元(space、tab、\n、...)，"+"代表一個或多個，而外面的括號是告訴split要保留這些拿來當作辨識條件的東西(預設是會捨棄)。
      4. const tippyInstances = [];
      建立一個空白陣列來放等等的一堆tippy
      5. if 這個切下來的部分(part)不為空
         1. 放進span，再塞入output-container

         2. 建立一個tippy並為他設定預設樣式
         3. 把這個tippy(part)加到陣列中
      6. 否則就直接加到output-container
      7. if 有任何的tippy實例被建立
         1. 把由tippy組合而成的陣列設定成singleton，這樣就不會在同一時間顯示多個popup，且可以統一設定樣式方便管理
      8. if 有任何實例被建立，就會把由tippy組成的陣列當做popupEditor裡面得attachAll的參數傳到popupEditor

### 所以現在html裡面的東西
- 有一個id 是 input的textarea
- 和一個id 是output-container的div
  - 而這個output-content裡面會有一堆被span包起來的詞和沒有被span包起來的空白詞

## 隨便寫東西
25/8/11
  這個真的我不知道要怎寫，只寫出做了什麼好像會有點太簡單， 而這次前面試用融合程式碼的方法，但是又不知道如何可以寫出程式碼又方便解釋的方法(不是偽程式碼，這個可讀性太差)，所以就非常亂。
  我認為應該分成4層
  1. 概念:簡單介紹功能
  2. 簡易流程:簡單列出是怎麼實現功能
  3. 詳細流程(不帶程式碼):就是詳細解釋每一步在做什麼但是不帶入真的程式碼
  4. 詳細流程(有程式碼):詳細解釋，加上真的程式碼(要想要怎麼做)