import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const AuthButton: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      if (!session) {
        navigate('/signin');
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
      navigate('/signin');
    }
  };

  if (session) {
    return (
      <button
        onClick={handleSignOut}
        className="font-heading text-sm font-semibold text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      onClick={() => navigate('/signin')}
      className="font-heading text-sm font-semibold text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
    >
      Sign in
    </button>
  );
};

export default AuthButton;