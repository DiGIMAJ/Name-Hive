
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Shield } from 'lucide-react';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';

// Form schema
const formSchema = z.object({
  username: z.string().min(1, {
    message: 'Username is required.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

const AdminSignIn = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Hard-coded admin credentials check
      if (values.username !== 'admin@namehive.fun' || values.password !== 'Admin123!2') {
        throw new Error('Invalid administrator credentials');
      }
      
      const adminEmail = 'admin@namehive.fun';
        
        const { error } = await signIn(adminEmail, values.password);
        
        if (error) {
          // Special case for admin login - if normal login fails, create or update the admin user
          await handleAdminAccountCreation(adminEmail, values.password);
          
          // Try signing in again after ensuring the account exists
          const retrySignIn = await signIn(adminEmail, values.password);
          if (retrySignIn.error) {
            throw retrySignIn.error;
          }
        }
        
        // Check if the user has admin privileges
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', (await supabase.auth.getUser()).data.user?.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching admin profile:', profileError);
        }
        
        // Set admin flag in profile if it's not already set
        if (!data?.is_admin) {
          const userId = (await supabase.auth.getUser()).data.user?.id;
          if (userId) {
            await supabase
              .from('profiles')
              .update({ is_admin: true })
              .eq('id', userId);
          }
        }
        
        toast({
          title: 'Welcome, Administrator',
          description: 'You have successfully signed in to the admin dashboard.',
        });
        
        navigate('/admin');
      } else {
        throw new Error('Invalid administrator credentials');
      }
    } catch (error: any) {
      console.error('Admin sign in error:', error);
      
      toast({
        title: 'Authentication failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to ensure admin account exists
  const handleAdminAccountCreation = async (email: string, password: string) => {
    try {
      // Check if user exists - we need to use auth service to check this
      // Since admin.listUsers is not available in the client, we'll use a simpler approach
      try {
        // Try to sign in with the admin credentials
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        // If there's no error, the user exists
        if (!signInError) {
          return;
        }
        // If the error is not about invalid credentials, the user might not exist
      } catch (error) {
        console.error('Error checking user existence:', error);
      }
      
      // Create new admin user if we couldn't sign in
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            is_admin: true
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      // Note: We can't use admin.updateUserById as it's not available in the client
      // Email confirmation will need to be handled by the backend or manually in Supabase dashboard
      console.log('Admin account created successfully:', signUpData);
    } catch (error) {
      console.error('Error creating admin account:', error);
      throw new Error('Failed to create administrator account');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden p-8">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Administrator Access</h1>
            <p className="text-gray-600 mt-2">Enter your credentials to access the admin dashboard</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Administrator Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter admin username" {...field} className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Access Admin Dashboard'
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              This area is restricted to authorized administrators only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
