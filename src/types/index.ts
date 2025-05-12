
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  photo?: string;
  universitas: string;
  bidang: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  userId: string;
  user?: User;
  files: string[];
  uploadDate: string;
  status: 'submitted' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface Login {
  id: string;
  userId: string;
  loginTime: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface FileWithPreview {
  file: File;
  preview: string;
}
