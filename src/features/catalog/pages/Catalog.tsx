import { useState } from 'react';
import { CatalogProvider } from '../context/CatalogContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import CourseGrid from '../components/CourseGrid';

export function Catalog() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <CatalogProvider>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* <Header onMenuClick={toggleSidebar} /> */}
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          
          <main className="flex-1 overflow-auto">
            <CourseGrid />
          </main>
        </div>
      </div>
    </CatalogProvider>
  );
}

