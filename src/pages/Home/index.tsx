import { createContext, useEffect, useState } from 'react'
import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { differenceInSeconds } from 'date-fns'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { NewCycleForm } from './components/NewCycleForm'
import { CountDown } from './components/CountDown'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O clico deve ser no mínimo de 5 minutos')
    .max(60, 'O ciclo deve ser no máximo de 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CycleContextData {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
}

export const CyclesContext = createContext({} as CycleContextData)

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const task = watch('task')
  const isSubmitDisabled = !task

  function handleCreateNewCycle(data: NewCycleFormData) {
    const cycleId = String(new Date().getTime())

    const newCycle: Cycle = {
      id: cycleId,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((oldState) => [...oldState, newCycle])
    setActiveCycleId(cycleId)
    setAmountSecondsPassed(0)
    reset()
  }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            interruptedDate: new Date(),
          }
        } else {
          return cycle
        }
      }),
    )

    setActiveCycleId(null)
  }

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            finishedDate: new Date(),
          }
        } else {
          return cycle
        }
      }),
    )
  }

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CyclesContext.Provider
          value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished }}
        >
          <NewCycleForm />
          <CountDown />
        </CyclesContext.Provider>
        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
