import { FormContainer, TaskInput, MinutesAmountInput } from './styles'

export function NewCycleForm() {
  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        id="task"
        list="task-sugestions"
        {...register('task')}
        disabled={!!activeCycle}
      />

      <datalist id="task-sugestions">
        <option value="Estudar Node" />
        <option value="Estudar React" />
        <option value="Estudar Discover" />
        <option value="Troca de linkes no linkedin" />
      </datalist>

      <label htmlFor="minutesAmount">durante</label>
      <MinutesAmountInput
        type="number"
        id="minutesAmount"
        step={5}
        min={1}
        max={60}
        disabled={!!activeCycle}
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
