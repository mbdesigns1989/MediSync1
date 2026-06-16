"use client"

import { useState, useSyncExternalStore } from "react"
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { moveAppointment, fetchAppointments } from "@/app/appointments/actions"
import { useToast } from "@/hooks/use-toast"
import {
  APPOINTMENT_STATUSES,
  type Appointment,
  type AppointmentStatus,
} from "@/types/appointment"
import { BoardColumn } from "./board-column"
import { AppointmentCard } from "./appointment-card"

interface AppointmentBoardProps {
  initialAppointments: Appointment[]
}

const APPOINTMENTS_KEY = ["appointments"] as const

export function AppointmentBoard({ initialAppointments }: AppointmentBoardProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [activeId, setActiveId] = useState<string | null>(null)

  // React Query owns the board's data. Seeded from the server-rendered list so
  // there's no fetch on first paint; refetched on settle to reconcile with the DB.
  const { data: appointments = [] } = useQuery({
    queryKey: APPOINTMENTS_KEY,
    queryFn: fetchAppointments,
    initialData: initialAppointments,
  })

  // The move mutation: optimistic cache update in onMutate, rollback in onError,
  // reconcile in onSettled. This is what React Query buys over plain local state —
  // a shared cache with automatic rollback.
  const moveMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      moveAppointment(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: APPOINTMENTS_KEY })
      const previous =
        queryClient.getQueryData<Appointment[]>(APPOINTMENTS_KEY)
      queryClient.setQueryData<Appointment[]>(APPOINTMENTS_KEY, (old) =>
        (old ?? []).map((a) => (a.id === id ? { ...a, status } : a))
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(APPOINTMENTS_KEY, context.previous)
      }
      toast.error("Failed to move appointment")
    },
    onSuccess: (result, _vars, context) => {
      // The server action returns { success } rather than throwing — treat a
      // failed result as an error path (rollback + toast).
      if (!result.success) {
        if (context?.previous) {
          queryClient.setQueryData(APPOINTMENTS_KEY, context.previous)
        }
        toast.error(result.message || "Failed to move appointment")
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY })
    },
  })

  // dnd-kit generates incrementing aria-describedby ids that differ between the
  // server and client render, causing a hydration mismatch. The board is fully
  // interactive (no SEO value), so render a static skeleton on the server and
  // the real dnd board on the client. useSyncExternalStore returns false during
  // SSR/hydration and true on the client — the canonical "is mounted" hook.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const sensors = useSensors(
    // 6px activation distance so clicks aren't swallowed by drag start.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  )

  const activeAppointment = appointments.find((a) => a.id === activeId) ?? null

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const appointmentId = String(active.id)
    const moved = appointments.find((a) => a.id === appointmentId)
    if (!moved) return

    // `over` is either a column (droppable) or another card; resolve the column.
    const overId = String(over.id)
    const targetStatus = (
      APPOINTMENT_STATUSES.includes(overId as AppointmentStatus)
        ? overId
        : appointments.find((a) => a.id === overId)?.status
    ) as AppointmentStatus | undefined

    if (!targetStatus || targetStatus === moved.status) return

    // React Query handles the optimistic update + rollback (see moveMutation).
    moveMutation.mutate({ id: appointmentId, status: targetStatus })
  }

  // Server + pre-hydration render: a static, non-draggable skeleton of the same
  // columns (no dnd-kit hooks → no SSR id mismatch). Same layout, so no flash.
  if (!mounted) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {APPOINTMENT_STATUSES.map((status) => {
          const items = appointments.filter((a) => a.status === status)
          return (
            <div
              key={status}
              className="flex flex-col rounded-lg border border-slate-200 bg-slate-50/60 p-3"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold text-slate-700">{status}</h2>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                  {items.length}
                </span>
              </div>
              <div className="flex min-h-24 flex-col gap-2">
                {items.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-md border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <p className="truncate text-sm font-medium text-slate-900">
                      {a.patientName}
                    </p>
                    <p className="truncate text-xs text-slate-500">{a.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <DndContext
      id="appointment-board"
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {APPOINTMENT_STATUSES.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            appointments={appointments.filter((a) => a.status === status)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeAppointment ? (
          <AppointmentCard appointment={activeAppointment} overlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
