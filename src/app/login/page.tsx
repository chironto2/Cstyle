'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Container from '@/components/shared/Container';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }), // Min 1 for presence, backend handles length
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const demoUsers = [
    {
      name: 'Demo Customer 1',
      email: 'customer1@demo.com',
      password: 'Demo@123',
      role: 'USER',
    },
    {
      name: 'Demo Customer 2',
      email: 'customer2@demo.com',
      password: 'Demo@123',
      role: 'USER',
    },
    {
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'Admin@123',
      role: 'ADMIN',
    },
  ];

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const fillLoginForm = (email: string, password: string) => {
    form.setValue('email', email);
    form.setValue('password', password);
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.token && result.user) {
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${result.user.name || 'User'}!`,
          variant: 'default',
        });

        localStorage.setItem('authToken', result.token);
        localStorage.setItem('userRole', result.user.role);
        localStorage.setItem('userId', result.user.id);

        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'authToken',
            newValue: result.token,
            storageArea: localStorage,
          })
        );

        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (result.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard/profile');
        }
      } else {
        toast({
          title: 'Login Failed',
          description: result.message || 'Invalid email or password.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login submission error:', error);
      toast({
        title: 'Login Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Container className="w-full px-4 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-6 justify-center items-start lg:items-center max-w-6xl mx-auto">
        {/* Login Card */}
        <Card className="w-full lg:w-96 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-headline">
              Login
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              Access your Cstyle account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          className="text-sm md:text-base h-10 md:h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="text-sm md:text-base h-10 md:h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <div className="text-xs md:text-sm text-right">
                  <Link
                    href="/forgot-password"
                    className="text-primary hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full h-10 md:h-11 text-sm md:text-base font-medium"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    'Logging in...'
                  ) : (
                    <>
                      <LogIn size={18} className="mr-2" />
                      <span>Login</span>
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col items-center text-center space-y-3 border-t pt-4">
            <p className="text-xs md:text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                href="/register-user"
                className="text-blue-600 hover:text-blue-700 underline font-medium"
              >
                Register as customer
              </Link>
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              Admin?{' '}
              <Link
                href="/register"
                className="text-purple-600 hover:text-purple-700 underline font-medium"
              >
                Register as admin
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Demo Credentials Card */}
        <Card className="w-full lg:w-96 shadow-xl">
          <CardHeader className="text-center bg-blue-50">
            <CardTitle className="text-xl md:text-2xl font-headline flex items-center justify-center gap-2">
              <span className="text-2xl">👤</span>
              Demo Accounts
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Use these credentials to test the app
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {demoUsers.map((user, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Role: <span className="font-medium">{user.role}</span>
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {user.role === 'ADMIN' ? 'ADMIN' : 'USER'}
                    </span>
                  </div>

                  <div className="space-y-2 mt-3">
                    {/* Email */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-xs font-mono text-gray-900 break-all">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(user.email, `email-${index}`)
                        }
                        className="ml-2 p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="Copy email"
                      >
                        {copiedField === `email-${index}` ? (
                          <Check size={14} className="text-green-600" />
                        ) : (
                          <Copy size={14} className="text-gray-600" />
                        )}
                      </button>
                    </div>

                    {/* Password */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Password</p>
                        <p className="text-xs font-mono text-gray-900">
                          {user.password}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(user.password, `password-${index}`)
                        }
                        className="ml-2 p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="Copy password"
                      >
                        {copiedField === `password-${index}` ? (
                          <Check size={14} className="text-green-600" />
                        ) : (
                          <Copy size={14} className="text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => fillLoginForm(user.email, user.password)}
                    className="w-full mt-3 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    Use This Account
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
