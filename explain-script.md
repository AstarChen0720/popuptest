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
   6. (tippy會自動為span內的東西掛上popup，又有群組了所有的popup讓每次只會顯示一個)

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
      3. text.split(/(\s+)/)，.split()是一個用在文字上面的方法，代表用括號內的條件來切割文字，而括號內的/(\s+)/是"正則表達式"(=一種表達條件的方法)，前後的/是正則表達式的開始和結束，而\s代表全部的空白字元(space、tab、\n、...)，"+"代表一個或多個，而外面的括號是告訴split要保留這些拿來當作辨識條件的東西(預設是會捨棄)。
      4. const tippyInstances = [];
      建立一個空白陣列來放等等的一堆tippy
      5. if 這個切下來的部分(part)不為空
         1. 放進span，再塞入output-container

         2. 建立一個tippy並為他設定預設樣式
         3. 把這個tippy(part)加到陣列中
      6. 否則就直接加到output-container
      7. if 有任何的tippy實例被建立
         1. 把由tippy組合而成的陣列設定成singleton，這樣就不會在同一時間顯示多個popup，且可以統一設定樣式方便管理