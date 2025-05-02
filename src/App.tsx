import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ThreeColumnLayout from './components/layout/ThreeColumnLayout';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Calendar from './components/calendar/Calendar';
import Sidebar from './components/layout/Sidebar';
import Directory from './components/directory/Directory';
import DirectoryPage from './pages/DirectoryPage';
import AddListingPage from './pages/AddListingPage';
import ListingPage from './pages/ListingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import NotFoundPage from './pages/NotFoundPage';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route
            path="/*"
            element={
              <div className="font-body text-textPrimary min-h-screen bg-primary-50 dark:bg-gray-900 dark:text-primary-100 transition-colors duration-200">
                <Header />
                <main className="container mx-auto px-4 pb-8 pt-20">
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <ThreeColumnLayout
                          leftSidebar={<Sidebar selectedDate={selectedDate} />}
                          mainContent={<Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
                          rightSidebar={<Directory />}
                        />
                      } 
                    />
                    <Route path="/directory" element={<DirectoryPage />} />
                    <Route path="/directory/add" element={<AddListingPage />} />
                    <Route path="/directory/edit/:id" element={<AddListingPage />} />
                    <Route path="/directory/listing/:id" element={<ListingPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;