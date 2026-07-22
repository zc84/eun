import type { PropsWithChildren } from 'react'
import { AppStoreProvider } from '../store/appStore'

export function AppProviders({ children }: PropsWithChildren) {
  return <AppStoreProvider>{children}</AppStoreProvider>
}

