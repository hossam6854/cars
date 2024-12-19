import axios from "axios";

const apiKey = "YOUR_GOOGLE_TRANSLATE_API_KEY"; // ضع مفتاح API هنا

export const translateText = async (text, targetLanguage) => {
  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2`,
      {
        q: text,
        target: targetLanguage,
        key: apiKey,
      }
    );
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // إذا فشلت الترجمة، ارجع إلى النص الأصلي
  }
};
