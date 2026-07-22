import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { appRoutes } from './routes'
import { AppProviders } from './providers'
import { AppLayout } from '../components/layout/AppLayout'
import { HomePage } from '../pages/HomePage'
import { ActivityDetailsPage } from '../pages/ActivityDetailsPage'
import { CreateActivityPage } from '../pages/CreateActivityPage'
import { SubmissionResultPage } from '../pages/SubmissionResultPage'
import { ProfilePage } from '../pages/ProfilePage'
import { MobileFeedPage } from '../pages/MobileFeedPage'
import { NotFoundPage } from '../pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: appRoutes.home,
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: appRoutes.activityDetails, element: <ActivityDetailsPage /> },
      { path: appRoutes.createActivity, element: <CreateActivityPage /> },
      { path: appRoutes.submissionResult, element: <SubmissionResultPage /> },
      { path: appRoutes.profile, element: <ProfilePage /> },
      { path: appRoutes.mobileFeed, element: <MobileFeedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export function AppRouter() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}

