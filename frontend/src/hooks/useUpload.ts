import { useMutation } from '@tanstack/react-query';
import { uploadApi } from '../services/api/upload.api';

export function useUploadFile() {
  return useMutation({ mutationFn: uploadApi.file });
}
export function useUploadJson() {
  return useMutation({ mutationFn: uploadApi.json });
}
