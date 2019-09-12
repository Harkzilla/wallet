<script>
	import { onMount, setContext } from 'svelte';
	import { themes } from '../js/themes.js'
	
	//Stores
	import { CoinStore, SettingsStore, Hash, currentPage, themeStyle, loggedIn, firstRun} from '../js/stores.js';

	//Components
	import { Pages, FirstRun }  from '../js/router.js'	

	onMount(() => {
		CoinStore.useLocalStorage();
		CoinStore.updateBalances($CoinStore);
		SettingsStore.useLocalStorage();
		Hash.useLocalStorage();
		document.querySelector("html").style = themes[$themeStyle];
		$firstRun ? $SettingsStore.currentPage = { name: 'FirstRunIntro', data: {} } : null;
	});

	setContext('switchPage', {
		switchPage: (name, data) => switchPage(name, data),
	});

	function switchPage(name, data) {
		data = data || {};
		$SettingsStore.currentPage = {name, data};
	}

	function toggleTheme() {
		$SettingsStore.themeStyle = $SettingsStore.themeStyle === 'dark' ? 'light' : 'dark';
		document.querySelector("html").style = themes[$themeStyle];
	}

	function logout() {
        loggedIn.set(false);
	}
</script>

<div class="container">
	{#if $firstRun}
		<svelte:component this={ FirstRun[$currentPage.name] } />
	{:else}
		{#if !$loggedIn}
			<section class="invisible-scrollbar lockscreen">
				<svelte:component this={Pages['LockScreen']}/>
			</section>	
		{/if}

		{#if $loggedIn}
			<nav>
				<div class="soflexy">
					<button on:click={ () => switchPage('CoinsMain') }> CoinsMain </button>
					<button on:click={ () => switchPage('SwapsMain') }> SwapsMain </button>
					<button on:click={ () => switchPage('BackupMain') }> Backup </button>
					<button on:click={ () => switchPage('RestoreMain') }> Restore </button>
					<button on:click={ () => logout() }> Log Out </button>
				</div>
				<div class='controls soflexy'>
					<button on:click={ () => toggleTheme() }> Toggle Theme </button>
					<button on:click={() =>  CoinStore.reset() }> Reset Coins </button>
				</div>
			</nav>

			<section class="invisible-scrollbar content">
				<svelte:component this={Pages[$currentPage.name]} {switchPage}}/>
			</section>
		{/if}
	{/if}
</div>

<style>
	:global(h1){
		color: var(--primary-color);
	}

	:global(h2){
		color: var(--secondary-color);
	}

	:global(body){
		color: var(--font-color);
		background-color: var(--bg-color);
	}

	nav{
		background-color: var(--heading-color);
    	padding: 10px;
	}

	.controls{
		padding: 0 20px 0 20px;
	}

	.soflexy{
		display: grid;
    	grid-auto-flow: column;
	}

	.container {    
		display: flex;
  		flex: 1 1 auto;
  		flex-direction: column;
	}

	section {
    	display: flex;
    	flex: 1 1 auto;
	}

	section.lockscreen{
		justify-content: center;
		align-items: center;
	}

	section.content {
		justify-content: start;
		flex-direction: column;
	}
</style>