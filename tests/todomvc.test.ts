import { render, screen, fireEvent } from '@testing-library/svelte'
import { describe, it, expect, beforeEach } from 'vitest'
import { flushSync } from 'svelte'
import TodoMVC from '../src/TodoMVC.svelte'

describe('TodoMVC (Svelte 5)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders input and no list initially', () => {
    render(TodoMVC)
    const input = screen.getByPlaceholderText('What needs to be done?')
    expect(input).toBeInTheDocument()
    expect(screen.queryByRole('list')).toBeNull()
  })

  it('adds a todo on Enter', async () => {
    render(TodoMVC)
    const input = screen.getByPlaceholderText('What needs to be done?') as HTMLInputElement
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.queryByRole('listitem')).toBeNull()

    input.value = 'Buy milk'
    await fireEvent.input(input)
    await fireEvent.keyDown(input, { key: 'Enter' })
    flushSync()

    expect(screen.getByText('Buy milk')).toBeInTheDocument()
  })

  it('toggles completion status', async () => {
    const { container } = render(TodoMVC)
    const input = screen.getByPlaceholderText('What needs to be done?') as HTMLInputElement
    input.value = 'Task'
    await fireEvent.input(input)
    await fireEvent.keyDown(input, { key: 'Enter' })

    const checkbox = container.querySelector('.todo-list li input.toggle') as HTMLInputElement
    expect(checkbox.checked).toBe(false)
    await fireEvent.click(checkbox)
    flushSync()
    expect(checkbox.checked).toBe(true)
  })

  it('filters by active and completed via hash', async () => {
    const { container } = render(TodoMVC)
    const input = screen.getByPlaceholderText('What needs to be done?') as HTMLInputElement
    input.value = 'Task A'
    await fireEvent.input(input)
    await fireEvent.keyDown(input, { key: 'Enter' })
    input.value = 'Task B'
    await fireEvent.input(input)
    await fireEvent.keyDown(input, { key: 'Enter' })

    // mark first item as completed
    const firstItemToggle = container.querySelector('.todo-list li input.toggle') as HTMLInputElement
    await fireEvent.click(firstItemToggle)
    flushSync()

    // filter active via link
    await fireEvent.click(screen.getByText('Active'))
    flushSync()
    expect(screen.queryByText('Task A')).toBeNull()
    expect(screen.getByText('Task B')).toBeInTheDocument()

    // filter completed via link
    await fireEvent.click(screen.getByText('Completed'))
    flushSync()
    expect(screen.getByText('Task A')).toBeInTheDocument()
    expect(screen.queryByText('Task B')).toBeNull()
  })

  it('clears completed', async () => {
    render(TodoMVC)
    const input = screen.getByPlaceholderText('What needs to be done?') as HTMLInputElement
    input.value = 'Done task'
    await fireEvent.input(input)
    await fireEvent.keyDown(input, { key: 'Enter' })
    const toggle = screen.getByRole('checkbox', { name: '' })
    await fireEvent.click(toggle)

    const clear = screen.getByRole('button', { name: 'Clear completed' })
    await fireEvent.click(clear)
    expect(screen.queryByText('Done task')).toBeNull()
  })

  it('edits a todo on double-click and blur', async () => {
    render(TodoMVC)
    const input = screen.getByPlaceholderText('What needs to be done?') as HTMLInputElement
    input.value = 'Old title'
    await fireEvent.input(input)
    await fireEvent.keyDown(input, { key: 'Enter' })

    const label = screen.getByText('Old title')
    await fireEvent.dblClick(label)
    const edit = screen.getByDisplayValue('Old title') as HTMLInputElement
    edit.value = 'New title'
    await fireEvent.input(edit)
    await fireEvent.blur(edit)
    expect(screen.getByText('New title')).toBeInTheDocument()
  })
})
