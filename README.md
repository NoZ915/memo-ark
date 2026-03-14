<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Memo Arc

## 中文介紹

Memo Arc 是一個以**教育部高中英文單字範圍**為基礎打造的單字記憶 app。  
這個專案的核心特色不只是 app 本身，而是整個製作流程大量結合了 AI 工具完成。

我先使用 **Google Colab + Gemini**，針對高中英文單字資料進行補全，補上：

- 中文意思
- 英文定義
- 同義詞

這段資料處理流程大約跑了 **11 小時**。  
完成資料整理後，再透過 **GPT 產生 prompt**，交給 **Google AI Studio** 生成 app，整體過程幾乎不需要手寫太多程式碼。

### 專案流程

1. 以教育部高中英文單字範圍作為基礎資料
2. 使用 **Colab + Gemini** 補上中文、定義、同義詞
3. 資料補全流程約執行 **11 小時**
4. 使用 **GPT 生成 prompt**
5. 將 prompt 提供給 **Google AI Studio** 產生 app

### 專案特色

- 以高中英文常用單字範圍為基礎
- 補齊中文解釋、英文定義與同義詞，方便記憶與理解
- 結合 Colab、Gemini、GPT、Google AI Studio 的 AI 協作流程
- 從資料整理到 app 生成，幾乎都由 AI 協助完成

### 使用技術

- Google Colab
- Gemini
- GPT
- Google AI Studio
- Node.js

---

## English

Memo Arc is a vocabulary memorization app built on the **Taiwan Ministry of Education high school English vocabulary scope**.  
What makes this project special is not only the app itself, but also the AI-assisted workflow behind it.

I first used **Google Colab + Gemini** to enrich the vocabulary dataset by adding:

- Chinese meanings
- English definitions
- Synonyms

This data-enrichment process took about **11 hours** to complete.  
After that, I used **GPT-generated prompts** and fed them into **Google AI Studio** to generate the app, with very little hand-written code required.

### Workflow

1. Start with the Ministry of Education high school English vocabulary scope
2. Use **Colab + Gemini** to enrich the dataset with Chinese meanings, definitions, and synonyms
3. Run the enrichment pipeline for about **11 hours**
4. Use **GPT** to generate prompts
5. Feed those prompts into **Google AI Studio** to build the app

### Features

- Based on a high school English vocabulary scope
- Enriched with Chinese meanings, English definitions, and synonyms
- Built through an AI-assisted workflow using Colab, Gemini, GPT, and Google AI Studio
- Minimal hand-written code from data processing to app generation

### Tech Stack

- Google Colab
- Gemini
- GPT
- Google AI Studio
- Node.js

---

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1VYSv7HtpTYqyxRmCERAfu-VJkyi0RekP

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:  
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:  
   `npm run dev`
