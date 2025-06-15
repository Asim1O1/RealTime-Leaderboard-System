import { useState } from "react";
import { getDefaultText } from "../utils/typingContent";

export const useTextFetcher = () => {
  const [loadingText, setLoadingText] = useState(false);
  const [textMetadata, setTextMetadata] = useState({
    author: "",
    category: "",
  });

  const fetchNewText = async (category: string) => {
    setLoadingText(true);
    try {
      let minLength = 50;
      let maxLength = 100;

      const apiUrl = `http://api.quotable.io/quotes/random?minLength=${minLength}&maxLength=${maxLength}&tags=${category}&limit=1`;
      const response = await fetch(apiUrl);

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      if (data && data.length > 0) {
        const quote = data[0];
        setTextMetadata({
          author: quote.author,
          category: quote.tags?.join(", ") || category,
        });
        return quote.content;
      }
      throw new Error("No quotes received");
    } catch (error) {
      console.error("Failed to fetch new text:", error);
      // Return default text if API fails
      const defaultText = getDefaultText();
      setTextMetadata({
        author: defaultText.author,
        category: defaultText.category,
      });
      return defaultText.content;
    } finally {
      setLoadingText(false);
    }
  };

  return {
    loadingText,
    textMetadata,
    fetchNewText,
  };
};
