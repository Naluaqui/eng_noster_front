import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthenticatedLayout } from '@/layouts/authenticated/AuthenticatedLayout';
import { DecisionManagementPage } from '@/pages/app/decision-management/DecisionManagementPage';
import { InsightsPage } from '@/pages/app/insights/InsightsPage';
import { MeetingsPage } from '@/pages/app/meetings/MeetingsPage';
import { LandingPage } from '@/pages/landing/LandingPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AuthenticatedLayout />}>
          <Route index element={<Navigate to="reunioes" replace />} />
          <Route path="reunioes" element={<MeetingsPage />} />
          <Route path="decisoes" element={<DecisionManagementPage />} />
          <Route path="insights" element={<InsightsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
