import * as ApiService from './ApiService';
import { User } from './Types';

export const getProfile = () => ApiService.get('/app/user');

export const updateInfo = (user: { lastname: string, firstname: string, birthday: Date }) => {
  return ApiService.put('/app/user', { user });
}

export const updateAccount = (user: { username?: string, email?: string, password: string, new_password?: string }) => {
  return ApiService.put('/app/user/change_login_info', { user });
}

export const updateAvatar = async (avatar: File) => {
  const formData = new FormData();
  formData.append('avatar', avatar);

  return ApiService.put('/app/user/upload_avatar', formData, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  });
}

export const getAllAsync = (params: {page?: number, per_page?: number, sort_by?:string, query?: string}) => {
  return ApiService.get('/admin/users', {params});
}

export const createAsync = (user: User, auth_password: string) => ApiService.post(`/admin/users`, {user: {...user, auth_password}});

export const updateAsync = (user: User, auth_password: string) => ApiService.put(`/admin/users/${encodeURIComponent(user.email)}`, {user: {...user, auth_password}});
