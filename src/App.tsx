import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { DemoProvider } from './context/DemoProvider'
import { ScrollToTop } from './components/ScrollToTop'
import { PublicLayout } from './components/layout/PublicLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { HomePage } from './pages/HomePage'
import { TournamentPage } from './pages/TournamentPage'
import { ApplyPage, RefereeApplyPage, TeamApplyPage, TeamApplySubmittedPage, RefereeApplySubmittedPage } from './pages/ApplyPage'
import { TeamDetailPage } from './pages/TeamDetailPage'
import { TournamentRulesPage } from './pages/TournamentRulesPage'
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
  AdminApplicationsPage,
  AdminDashboard,
  AdminEventDayPage,
  AdminSettingsHubPage,
  AdminSitePage,
  AdminTeamsPage,
} from './pages/admin/AdminPages'

export default function App() {
  return (
    <DemoProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
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
                path="apply/team/submitted"
                element={<TeamApplySubmittedPage />}
              />
              <Route
                path="apply/referee"
                element={
                  <RequireAuth>
                    <RefereeApplyPage />
                  </RequireAuth>
                }
              />
              <Route
                path="apply/referee/submitted"
                element={<RefereeApplySubmittedPage />}
              />
              <Route
                path="teams"
                element={<Navigate to="/brackets" replace />}
              />
              <Route path="teams/rules" element={<TournamentRulesPage />} />
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
              <Route path="event" element={<AdminEventDayPage />} />
              <Route path="site" element={<AdminSitePage />} />
              <Route path="settings" element={<AdminSettingsHubPage />} />
              <Route
                path="schedule"
                element={<Navigate to="/admin/event?tab=schedule" replace />}
              />
              <Route
                path="results"
                element={<Navigate to="/admin/event?tab=results" replace />}
              />
              <Route
                path="fan-mvp"
                element={<Navigate to="/admin/event?tab=fan-mvp" replace />}
              />
              <Route
                path="announcements"
                element={
                  <Navigate to="/admin/site?tab=announcements" replace />
                }
              />
              <Route
                path="content"
                element={<Navigate to="/admin/site?tab=content" replace />}
              />
              <Route
                path="sponsors"
                element={<Navigate to="/admin/site?tab=sponsors" replace />}
              />
              <Route
                path="operations"
                element={
                  <Navigate to="/admin/settings?tab=operations" replace />
                }
              />
              <Route
                path="users"
                element={<Navigate to="/admin/settings?tab=users" replace />}
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </DemoProvider>
  )
}
