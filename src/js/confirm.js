import ConfirmMain from '../svelte/confirm/ConfirmMain.svelte';

import '../css/global.css'

const app = new ConfirmMain({
	target: document.body,
});

window.app = app;

export default app;