import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { DemoProvider } from './context/DemoProvider'
import { PublicLayout } from './components/layout/PublicLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { HomePage } from './pages/HomePage'
import { TournamentPage } from './pages/TournamentPage'
import { ApplyPage, RefereeApplyPage, TeamApplyPage } from './pages/ApplyPage'
import { TeamsPage } from './pages/TeamsPage'
import { TeamDetailPage } from './pages/TeamDetailPage'
import {
  BracketPage,
  PoolsStandingsPage,
  ResultsPage,
  SchedulePage,
  TodayPage,
} from './pages/SchedulePages'
import {
  ContactPage,
  FaqPage,
  PrivacyPage,
  SponsorsPage,
  TermsPage,
  TicketsPage,
  UpdatesPage,
  VisitPage,
} from './pages/InfoPages'
import { LoginPage, OnboardingPage } from './pages/LoginPage'
import { TeamPortalPage } from './pages/team/TeamPortalPage'
import { RequireAuth } from './components/auth/RequireAuth'
import {
  AdminAnnouncementsPage,
  AdminApplicationsPage,
  AdminContentPage,
  AdminDashboard,
  AdminFanMvpPage,
  AdminOperationsPage,
  AdminResultsPage,
  AdminSchedulePage,
  AdminSettingsPage,
  AdminSponsorsPage,
  AdminTeamsPage,
  AdminUsersPage,
} from './pages/admin/AdminPages'

export default function App() {
  return (
    <DemoProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<TournamentPage />} />
              <Route path="tournament" element={<TournamentPage />} />
              <Route path="history" element={<TournamentPage />} />
              <Route path="apply" element={<ApplyPage />} />
              <Route
                path="apply/team"
                element={
                  <RequireAuth>
                    <TeamApplyPage />
                  </RequireAuth>
                }
              />
              <Route
                path="apply/referee"
                element={
                  <RequireAuth>
                    <RefereeApplyPage />
                  </RequireAuth>
                }
              />
              <Route path="teams" element={<TeamsPage />} />
              <Route path="teams/:teamSlug" element={<TeamDetailPage />} />
              <Route path="pools" element={<PoolsStandingsPage />} />
              <Route path="standings" element={<PoolsStandingsPage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="today" element={<TodayPage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="brackets" element={<BracketPage />} />
              <Route path="fan-mvp" element={<Navigate to="/" replace />} />
              <Route path="visit" element={<VisitPage />} />
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="sponsors" element={<SponsorsPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="updates" element={<UpdatesPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="onboarding" element={<OnboardingPage />} />
              <Route
                path="team-portal"
                element={
                  <RequireAuth>
                    <TeamPortalPage />
                  </RequireAuth>
                }
              />
            </Route>

            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="applications" element={<AdminApplicationsPage />} />
              <Route path="teams" element={<AdminTeamsPage />} />
              <Route path="divisions" element={<Navigate to="/admin/teams" />} />
              <Route path="pools" element={<Navigate to="/pools" />} />
              <Route path="schedule" element={<AdminSchedulePage />} />
              <Route path="results" element={<AdminResultsPage />} />
              <Route path="fan-mvp" element={<AdminFanMvpPage />} />
              <Route
                path="announcements"
                element={<AdminAnnouncementsPage />}
              />
              <Route path="content" element={<AdminContentPage />} />
              <Route path="sponsors" element={<AdminSponsorsPage />} />
              <Route path="operations" element={<AdminOperationsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </DemoProvider>
  )
}
