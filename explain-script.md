## 更新紀錄
- 2025-08-11：首次撰寫

## 概念（Overview）
- 把使用者輸入的文字依空白切成片段，為每個非空白片段建立一個帶 tooltip 的 span，並用 tippy 的 singleton 統一管理所有 tooltip。

## 簡易流程（主要功能組成）
1. 監聽整個檔案，如果有dom元素才執行後面的所有東西
2. 如果輸入框有新的input
   1. 清空output框內容並銷毀裡面的singlaton
   2. 用以空白為條件分開輸入框每個詞
   3. 為每個分開的詞都建立一個tippy實例
   4. 把所有tippy裝成一個陣列(因為singleton只吃tippy陣列)，並且順便為每一個非空白詞設定一個span，然後全部輸出到output-content
   5. 把tippy陣列用來建立Singletion並設定樣式
   6. (tippy會自動為span內的東西掛上popup)

## 輸入 / 輸出
- **輸入**：字串，長度 1~50
- **輸出**：JSON 物件，包含結果與錯誤碼

## 核心功能實現的方式
- 使用 fetch 呼叫 REST API
- 利用正則表達式檢查輸入格式

## 錯誤
- API timeout 時重試 3 次
- 輸入為空字串時直接回傳錯誤 
## 詳細流程（逐行解釋）
1. `const input = getUserInput();` → 從表單取得輸入
2. `if (!validate(input)) throw Error('格式錯誤');` → 驗證格式
3. `const result = await callAPI(input);` → 呼叫 API 並等待結果
4. `render(result);` → 顯示結果在畫面上
