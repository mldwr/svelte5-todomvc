import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';

const isVitest = !!process.env.VITEST;

export default defineConfig({
	plugins: [svelte(), isVitest && svelteTesting()].filter(Boolean),
	resolve: isVitest
		? {
			conditions: ['browser']
		  }
		: undefined,
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.js']
	}
});
