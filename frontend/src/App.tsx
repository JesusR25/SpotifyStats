import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { TopArtists } from './pages/TopArtists';
import { TopTracksPage } from './pages/TopTracks';
import { SavedAlbums } from './pages/SavedAlbums';
import { AlbumDetailPage } from './pages/AlbumDetail';
import { Success } from './pages/Success';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/top-artists"
        element={
          <ProtectedRoute>
            <TopArtists />
          </ProtectedRoute>
        }
      />
      <Route
        path="/top-tracks"
        element={
          <ProtectedRoute>
            <TopTracksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/albums"
        element={
          <ProtectedRoute>
            <SavedAlbums />
          </ProtectedRoute>
        }
      />
      <Route
        path="/album/:albumId"
        element={
          <ProtectedRoute>
            <AlbumDetailPage />
          </ProtectedRoute>
        }
      />
      <Route path="/success-vinculation" element={<Success />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-spotify-black">
          <Navbar />
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
