
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
