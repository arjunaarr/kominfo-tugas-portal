
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';

const bidangOptions = [
  'Teknologi Informasi',
  'Komunikasi Publik',
  'Statistik',
  'Aplikasi Informatika',
  'Informasi dan Komunikasi Publik',
  'Pengelolaan Informasi dan Komunikasi Publik'
];

const universitasOptions = [
  'Universitas Indonesia',
  'Institut Teknologi Bandung',
  'Universitas Gadjah Mada',
  'Institut Teknologi Sepuluh Nopember',
  'Universitas Padjadjaran',
  'Universitas Diponegoro',
  'Universitas Brawijaya',
  'Universitas Airlangga',
  'Telkom University',
  'Universitas Bina Nusantara'
];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    universitas: '',
    bidang: '',
    photo: null as File | null
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, photo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!formData.name || !formData.email || !formData.password || 
        !formData.universitas || !formData.bidang) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to register the user
      // For this demo, we'll simulate registration
      
      // Check if email already exists
      const usersStr = localStorage.getItem('users') || '[]';
      const users = JSON.parse(usersStr);
      
      const emailExists = users.some((user: any) => user.email === formData.email);
      if (emailExists) {
        toast.error('Email already registered');
        setIsLoading(false);
        return;
      }
      
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password, // In a real app, this would be hashed
        role: 'user',
        photo: photoPreview || undefined,
        universitas: formData.universitas,
        bidang: formData.bidang,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      toast.success('Registration successful! You can now login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
            <p className="text-gray-600 mt-2">Join the Kominfo Intern Portal</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  University
                </label>
                <Select 
                  value={formData.universitas} 
                  onValueChange={(value) => handleSelectChange('universitas', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    {universitasOptions.map((univ) => (
                      <SelectItem key={univ} value={univ}>{univ}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <Select 
                  value={formData.bidang} 
                  onValueChange={(value) => handleSelectChange('bidang', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {bidangOptions.map((bidang) => (
                      <SelectItem key={bidang} value={bidang}>{bidang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Profile Photo (Optional)
              </label>
              <div className="flex items-center space-x-4">
                {photoPreview && (
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img 
                      src={photoPreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary-600 hover:bg-primary-700" 
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-primary-600 hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
