"use client"

import { useEffect } from "react"
import { migrateLocalStorageToSupabase } from "@/lib/data-service"

export default function MigrationHandler() {
  useEffect(() => {
    migrateLocalStorageToSupabase()
  }, [])

  return null
}
