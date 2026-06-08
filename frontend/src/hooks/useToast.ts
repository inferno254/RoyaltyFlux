export function useToast() {
  return {
    success: (msg: string) => import('react-hot-toast').then((m) => m.default.success(msg)),
    error: (msg: string) => import('react-hot-toast').then((m) => m.default.error(msg)),
    loading: (msg: string) => import('react-hot-toast').then((m) => m.default.loading(msg))),
  };
}
