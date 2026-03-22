import { useState, useRef } from 'react';
import type { BlogFormData } from '../types';

const initialFormState: BlogFormData = {
  title: '',
  excerpt: '',
  content: '',
  image: null,
  contentImages: [],
};

export const useBlogForm = () => {
  const [formData, setFormData] = useState<BlogFormData>(initialFormState);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const updateField = (field: keyof BlogFormData, value: string | File | null | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const addContentImage = (file: File) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const textBefore = formData.content.substring(0, cursorPosition);
    const textAfter = formData.content.substring(textarea.selectionEnd);
    const imageMarkdown = `\n![${file.name}](uploading...)\n`;

    const newContent = textBefore + imageMarkdown + textAfter;
    const newCursorPosition = cursorPosition + imageMarkdown.length;

    setFormData(prev => ({
      ...prev,
      contentImages: [...prev.contentImages, file],
      content: newContent,
    }));

    // Restore cursor position after React updates the textarea
    setTimeout(() => {
      textarea.selectionStart = newCursorPosition;
      textarea.selectionEnd = newCursorPosition;
      textarea.focus();
    }, 0);
  };

  const updateContentImageUrl = (placeholder: string, url: string) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.replace(`(${placeholder})`, `(${url})`)
    }));
  };

  return {
    formData,
    updateField,
    resetForm,
    addContentImage,
    updateContentImageUrl,
    textareaRef,
  };
};