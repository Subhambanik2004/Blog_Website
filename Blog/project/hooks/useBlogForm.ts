import { useState, useRef, useEffect } from 'react';
import type { BlogFormData } from '@/types/blog-form';

const empty: BlogFormData = {
  title: '',
  excerpt: '',
  content: '',
  image: null,
  contentImages: [],
};

export function useBlogForm(initial?: Partial<Pick<BlogFormData, 'title' | 'excerpt' | 'content'>>) {
  const [formData, setFormData] = useState<BlogFormData>(() => ({
    ...empty,
    title: initial?.title ?? '',
    excerpt: initial?.excerpt ?? '',
    content: initial?.content ?? '',
  }));
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!initial) return;
    setFormData((prev) => ({
      ...prev,
      title: initial.title ?? prev.title,
      excerpt: initial.excerpt ?? prev.excerpt,
      content: initial.content ?? prev.content,
    }));
  }, [initial?.title, initial?.excerpt, initial?.content]);

  const updateField = (field: keyof BlogFormData, value: string | File | null | File[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(empty);
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

    setFormData((prev) => ({
      ...prev,
      contentImages: [...prev.contentImages, file],
      content: newContent,
    }));

    setTimeout(() => {
      textarea.selectionStart = newCursorPosition;
      textarea.selectionEnd = newCursorPosition;
      textarea.focus();
    }, 0);
  };

  return {
    formData,
    setFormData,
    updateField,
    resetForm,
    addContentImage,
    textareaRef,
  };
}
