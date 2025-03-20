
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';

const AccessDenied = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="size-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You don't have permission to access the admin dashboard.
        </AlertDescription>
      </Alert>
      <Button onClick={() => navigate('/dashboard')}>
        Return to Dashboard
      </Button>
    </div>
  );
};

export default AccessDenied;
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const AccessDenied = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <AlertTriangle className="size-12 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-4">You don't have permission to access this page</p>
      <Button asChild>
        <Link to="/">Return Home</Link>
      </Button>
    </div>
  );
};

export default AccessDenied;
