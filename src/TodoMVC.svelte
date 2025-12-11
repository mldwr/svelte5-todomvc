<script>
	import 'todomvc-app-css/index.css';

	const active = (item) => !item.completed;
	const completed = (item) => item.completed;

	let currentFilter = $state('all');
	let items = $state((() => {
		try {
			return JSON.parse(localStorage.getItem('todos-svelte')) || [];
		} catch {
			return [];
		}
	})());
	let editing = $state(null);

	const filtered = $derived(
		currentFilter === 'all'
			? items
			: items.filter(currentFilter === 'completed' ? completed : active)
	);

	const numActive = $derived(items.filter(active).length);

	const numCompleted = $derived(items.filter(completed).length);

	$effect(() => {
		try {
			localStorage.setItem('todos-svelte', JSON.stringify(items));
		} catch {}
	});

	const updateView = () => {
		currentFilter = 'all';
		if (location.hash === '#/active') {
			currentFilter = 'active';
		} else if (location.hash === '#/completed') {
			currentFilter = 'completed';
		}
	};

	// Initialize filter based on current hash
	updateView();

	function clearCompleted() {
		items = items.filter(active);
	}

	function remove(id) {
		items = items.filter((item) => item.id !== id);
	}

	function toggleAll(event) {
		items = items.map((item) => ({ ...item, completed: event.target.checked }));
	}

	function createNew(event) {
		if (event.key === 'Enter') {
			const value = event.target.value.trim();
			if (!value) return;
			items = [...items, {
				id: crypto.randomUUID(),
				description: value,
				completed: false
			}];
			event.target.value = '';
		}
	}

	function handleEdit(event) {
		if (event.key === 'Enter') event.target.blur();
		else if (event.key === 'Escape') editing = null;
	}

	function submit(event) {
		const value = event.target.value.trim();
		if (!value) {
			editing = null;
			return;
		}
		items = items.map((item) =>
			item.id === editing ? { ...item, description: value } : item
		);
		editing = null;
	}
</script>

<svelte:window onhashchange={updateView} />

<header class="header">
	<h1>todos</h1>
	<!-- svelte-ignore a11y_autofocus -->
	<input class="new-todo" onkeydown={createNew} placeholder="What needs to be done?" autofocus />
</header>

{#if items.length > 0}
	<section class="main">
		<input
			id="toggle-all"
			class="toggle-all"
			type="checkbox"
			onchange={toggleAll}
			checked={numCompleted === items.length}
		/>
		<label for="toggle-all">Mark all as complete</label>

		<ul class="todo-list">
			{#each filtered as item (item.id)}
				<li class:completed={item.completed} class:editing={editing === item.id}>
					<div class="view">
						<input class="toggle" type="checkbox" bind:checked={item.completed} />
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label ondblclick={() => (editing = item.id)}>{item.description}</label>
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button onclick={() => remove(item.id)} class="destroy"></button>
					</div>

					{#if editing === item.id}
					<!-- svelte-ignore a11y_autofocus -->
					<input
						value={item.description}
						id="edit-{item.id}"
						class="edit"
						onkeydown={handleEdit}
						onblur={submit}
						autofocus
					/>
					{/if}
				</li>
			{/each}
		</ul>

		<footer class="footer">
			<span class="todo-count">
				<strong>{numActive}</strong>
				{numActive === 1 ? 'item' : 'items'} left
			</span>

			<ul class="filters">
				<li>
					<a class:selected={currentFilter === 'all'} href="#/" onclick={() => (currentFilter = 'all')}>All</a>
				</li>
				<li>
					<a class:selected={currentFilter === 'active'} href="#/active" onclick={() => (currentFilter = 'active')}>Active</a>
				</li>
				<li>
					<a class:selected={currentFilter === 'completed'} href="#/completed" onclick={() => (currentFilter = 'completed')}>Completed</a>
				</li>
			</ul>

			{#if numCompleted}
				<button class="clear-completed" onclick={clearCompleted}>Clear completed</button>
			{/if}
		</footer>
	</section>
{/if}
