import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import News from "./pages/News";
import Article from "./pages/Article";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
import Forums from "./pages/Forums";
import RecentThreads from "./pages/RecentThreads";
import ForumThread from "./pages/ForumThread";
import CreateThread from "./pages/CreateThread";
import AdminPanel from "./pages/AdminPanel";
import ModeratorPanel from "./pages/ModeratorPanel";
import NotFound from "./pages/NotFound";
import UserPanel from "./pages/UserPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<Article />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/create-article" element={
              <ProtectedRoute>
                <CreateArticle />
              </ProtectedRoute>
            } />
            <Route path="/edit-article/:id" element={
              <ProtectedRoute>
                <EditArticle />
              </ProtectedRoute>
            } />
            <Route path="/forums" element={<Forums />} />
            <Route path="/forums/recent" element={<RecentThreads />} />
            <Route path="/forums/thread/:id" element={<ForumThread />} />
            <Route path="/forums/create-thread" element={
              <ProtectedRoute>
                <CreateThread />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/moderator" element={
              <ProtectedRoute requiredRole="moderator">
                <ModeratorPanel />
              </ProtectedRoute>
            } />
            <Route path="/user/panel" element={
              <ProtectedRoute>
                <UserPanel />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
