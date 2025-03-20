
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Key, CreditCard, DollarSign, Lock, FileText, RefreshCw, Users, BarChart } from 'lucide-react';
import ApiKeysSettings from '@/components/admin/ApiKeysSettings';
import PaymentGatewaySettings from '@/components/admin/PaymentGatewaySettings';
import PricingSettings from '@/components/admin/PricingSettings';
import PasswordSettings from '@/components/admin/PasswordSettings';
import BlogPostManager from '@/components/admin/BlogPostManager';
import AccessDenied from '@/components/admin/AccessDenied';
import AdminLoading from '@/components/admin/AdminLoading';
import LogoutButton from '@/components/common/LogoutButton';

interface AdminSettings {
  groqApiKey: string;
  twoCheckoutSellerId: string;
  twoCheckoutSecretKey: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isAdmin: boolean;
}

interface SiteStats {
  totalUsers: number;
  totalGenerations: number;
  activeSubscriptions: number;
  blogPosts: number;
}

const AdminDashboard = () => {
  const { user, isLoading } = useRequireAuth('/admin-login');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<AdminSettings>({
    groqApiKey: '',
    twoCheckoutSellerId: '',
    twoCheckoutSecretKey: '',
    monthlyPrice: 5,
    yearlyPrice: 50,
    isAdmin: false
  });
  
  const [siteStats, setSiteStats] = useState<SiteStats>({
    totalUsers: 0,
    totalGenerations: 0,
    activeSubscriptions: 0,
    blogPosts: 0
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (!data?.is_admin) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page",
            variant: "destructive"
          });
          navigate('/admin-login');
        } else {
          setSettings(prev => ({ ...prev, isAdmin: true }));
          loadSettings();
          fetchSiteStats();
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/admin-login');
      } finally {
        setIsLoadingSettings(false);
      }
    };
    
    if (user) {
      checkAdminStatus();
    }
  }, [user, navigate, toast]);
  
  const loadSettings = async () => {
    try {
      setIsLoadingSettings(true);
      
      const { data: configData, error: configError } = await supabase
        .from('config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (configError && configError.code !== 'PGRST116') {
        throw configError;
      }
      
      if (configData) {
        setSettings(prev => ({
          ...prev,
          groqApiKey: configData.groq_api_key || '',
          twoCheckoutSellerId: configData.twocheckout_seller_id || '',
          twoCheckoutSecretKey: configData.twocheckout_secret_key || '',
          monthlyPrice: configData.monthly_price ? parseFloat(String(configData.monthly_price)) : 5,
          yearlyPrice: configData.yearly_price ? parseFloat(String(configData.yearly_price)) : 50
        }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingSettings(false);
    }
  };
  
  const fetchSiteStats = async () => {
    try {
      setIsLoadingStats(true);
      
      // Get total users count
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      // Get total generations count
      const { count: generationsCount, error: generationsError } = await supabase
        .from('generator_usage')
        .select('*', { count: 'exact', head: true });
        
      // Get active subscriptions count
      const { count: subscriptionsCount, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      // Get blog posts count
      const { count: blogPostsCount, error: blogPostsError } = await (supabase
        .from('blog_posts') as any)
        .select('*', { count: 'exact', head: true });
      
      if (usersError || generationsError || subscriptionsError || blogPostsError) {
        throw new Error('Error fetching site statistics');
      }
      
      setSiteStats({
        totalUsers: usersCount || 0,
        totalGenerations: generationsCount || 0,
        activeSubscriptions: subscriptionsCount || 0,
        blogPosts: blogPostsCount || 0
      });
      
    } catch (error) {
      console.error('Error fetching site statistics:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };
  
  const handleSaveSettings = async () => {
    if (!settings.isAdmin) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('config')
        .insert({
          groq_api_key: settings.groqApiKey,
          twocheckout_seller_id: settings.twoCheckoutSellerId,
          twocheckout_secret_key: settings.twoCheckoutSecretKey,
          monthly_price: settings.monthlyPrice,
          yearly_price: settings.yearlyPrice,
          updated_by: user?.id
        });
      
      if (error) throw error;
      
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully."
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Helper functions to update individual settings
  const updateSetting = (key: keyof AdminSettings) => (value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const generateSitemap = async () => {
    try {
      const { error } = await supabase.functions.invoke('generate-sitemap');
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Sitemap has been generated successfully."
      });
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast({
        title: "Error",
        description: "Failed to generate sitemap.",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading || isLoadingSettings) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-32 pb-16">
          <div className="page-container max-w-6xl">
            <AdminLoading />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!settings.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-32 pb-16">
          <div className="page-container max-w-6xl">
            <AccessDenied />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-32 pb-16">
        <div className="page-container max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your application settings and content</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={generateSitemap} 
                className="flex items-center gap-2"
              >
                <RefreshCw className="size-4" />
                Generate Sitemap
              </Button>
              
              <LogoutButton />
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <div className="text-2xl font-bold">{siteStats.totalUsers}</div>
                )}
                <p className="text-xs text-gray-500 mt-1">Registered accounts</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  <BarChart className="h-4 w-4 mr-2 text-purple-500" />
                  Name Generations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <div className="text-2xl font-bold">{siteStats.totalGenerations}</div>
                )}
                <p className="text-xs text-gray-500 mt-1">Total generations</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-green-500" />
                  Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <div className="text-2xl font-bold">{siteStats.activeSubscriptions}</div>
                )}
                <p className="text-xs text-gray-500 mt-1">Active subscribers</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-orange-500" />
                  Blog Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <div className="text-2xl font-bold">{siteStats.blogPosts}</div>
                )}
                <p className="text-xs text-gray-500 mt-1">Published content</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="blog" className="space-y-6">
            <TabsList className="grid grid-cols-5 max-w-4xl">
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <FileText className="size-4" />
                <span>Blog</span>
              </TabsTrigger>
              <TabsTrigger value="api-keys" className="flex items-center gap-2">
                <Key className="size-4" />
                <span>API Keys</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard className="size-4" />
                <span>Payment</span>
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-2">
                <DollarSign className="size-4" />
                <span>Pricing</span>
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Lock className="size-4" />
                <span>Password</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="blog">
              <BlogPostManager />
            </TabsContent>
            
            <TabsContent value="api-keys">
              <ApiKeysSettings
                apiKey={settings.groqApiKey}
                onApiKeyChange={updateSetting('groqApiKey')}
                onSaveSettings={handleSaveSettings}
                isSaving={isSaving}
              />
            </TabsContent>
            
            <TabsContent value="payment">
              <PaymentGatewaySettings
                sellerId={settings.twoCheckoutSellerId}
                secretKey={settings.twoCheckoutSecretKey}
                onSellerIdChange={updateSetting('twoCheckoutSellerId')}
                onSecretKeyChange={updateSetting('twoCheckoutSecretKey')}
                onSaveSettings={handleSaveSettings}
                isSaving={isSaving}
              />
            </TabsContent>
            
            <TabsContent value="pricing">
              <PricingSettings
                monthlyPrice={settings.monthlyPrice}
                yearlyPrice={settings.yearlyPrice}
                onMonthlyPriceChange={updateSetting('monthlyPrice')}
                onYearlyPriceChange={updateSetting('yearlyPrice')}
                onSaveSettings={handleSaveSettings}
                isSaving={isSaving}
              />
            </TabsContent>
            
            <TabsContent value="password">
              <PasswordSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
