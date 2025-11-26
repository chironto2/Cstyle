'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z
  .object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    phone: z.string().optional(),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Please confirm your password.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof formSchema>;

export default function RegisterUserPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          role: 'USER',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Registration Successful',
          description: 'Welcome! You can now explore our store.',
          variant: 'default',
        });
        router.push('/login');
      } else {
        toast({
          title: 'Registration Failed',
          description:
            result.message || 'An error occurred during registration.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Registration submission error:', error);
      toast({
        title: 'Registration Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Container className="w-full px-4 py-8 md:py-12">
      <div className="flex justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <User size={32} className="text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              Join Cstyle and start shopping today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 md:space-y-5"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          className="text-sm md:text-base h-10 md:h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          className="text-sm md:text-base h-10 md:h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base">
                        Phone Number (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className="text-sm md:text-base h-10 md:h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
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
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="text-sm md:text-base h-10 md:h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-10 md:h-12 text-sm md:text-base font-semibold bg-blue-600 hover:bg-blue-700 transition-colors"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-2">⏳</span>
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <User size={18} className="mr-2" />
                      Create Account
                    </span>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 space-y-3">
              <p className="text-center text-xs md:text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 underline font-semibold transition-colors"
                >
                  Login here
                </Link>
              </p>
              <p className="text-center text-xs md:text-sm text-muted-foreground border-t pt-3">
                Are you an admin?{' '}
                <Link
                  href="/register"
                  className="text-purple-600 hover:text-purple-700 underline font-semibold transition-colors"
                >
                  Register as admin
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
