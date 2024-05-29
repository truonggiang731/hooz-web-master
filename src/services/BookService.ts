import * as ApiService from './ApiService';
import {Chapter, Book} from './Types';

export const getAllAsync = (params: {page?: number, per_page?: number, sort_by?:string, query?: string}) => {
  return ApiService.get('/admin/books', {params: {...params, sort_by: 'created_at-desc'}});
}

export const getDetailAsync = (id: number) => ApiService.get(`/admin/books/${id}`);

export const createAsync = (book: Book) => ApiService.post(`/admin/books`, {book});

export const updateAsync = (book: Book) => ApiService.put(`/admin/books/${book.id}`, {book});

export const deleteAsync = (id: number) => ApiService.delete(`/admin/books/${id}`);

export const activeAsync = (id: number, active: boolean, notify?: boolean) => ApiService.put(`/admin/books/${id}/active`, {active, notify});

export const freeAsync = (id: number, free: boolean) => ApiService.put(`/admin/books/${id}`, {free});

export const updateImageAsync = async (id: number, image: File) => {
  const formData = new FormData();
  formData.append('image', image);

  return ApiService.put(`/admin/books/${id}/upload_image`, formData, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  });
}

export const getAllChaptersAsync = (book_id: number, params: {page?: number, per_page?: number, query?: string}) => {
  return ApiService.get(`/admin/books/${book_id}/chapters`, {params});
}

export const createChapterAsync = (book_id: number, chapter: Chapter) => ApiService.post(`/admin/books/${book_id}/chapters`, {chapter});

export const updateChapterAsync = (book_id: number, chapter: Chapter) => ApiService.put(`/admin/books/${book_id}/chapters/${chapter.id}`, {chapter});

export const deleteChapterAsync = (book_id: number, id: number) => ApiService.delete(`/admin/books/${book_id}/chapters/${id}`);

export const updateChapterImagesAsync = async (book_id: number, id: number, images: Array<File>) => {
  const formData = new FormData();
  for (let image of images) {
    formData.append('images[]', image);
  }

  return ApiService.put(`/admin/books/${book_id}/chapters/${id}/upload_images`, formData, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  });
}
