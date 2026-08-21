import React from "react"
import { Routes, Route } from "react-router-dom"
import { MainLayout } from "@/layouts/MainLayout"
import { HomePage } from "@/pages/HomePage"
import { ResultsPage } from "@/pages/ResultsPage"
import { HistoryPage } from "@/pages/HistoryPage"
import { LoginPage } from "@/pages/LoginPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { RequireAuth } from "@/components/RequireAuth"

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <MainLayout>
              <HomePage />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/results"
        element={
          <RequireAuth>
            <MainLayout>
              <ResultsPage />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/history"
        element={
          <RequireAuth>
            <MainLayout>
              <HistoryPage />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
