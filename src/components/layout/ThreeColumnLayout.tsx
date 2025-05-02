import React from 'react';

interface ThreeColumnLayoutProps {
  leftSidebar: React.ReactNode;
  mainContent: React.ReactNode;
  rightSidebar: React.ReactNode;
}

const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  leftSidebar,
  mainContent,
  rightSidebar,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <aside className="lg:col-span-3 animate-fade-in">
        {leftSidebar}
      </aside>
      <main className="lg:col-span-6 animate-fade-in">
        {mainContent}
      </main>
      <aside className="lg:col-span-3 animate-fade-in">
        {rightSidebar}
      </aside>
    </div>
  );
};

export default ThreeColumnLayout;