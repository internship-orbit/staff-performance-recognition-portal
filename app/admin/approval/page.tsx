"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, TimerReset, Users } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import {
  EmptyState,
  LoadingState,
  PageHeader,
  SectionCard,
  StatCard,
  StatusBadge,
} from "../components/ui"