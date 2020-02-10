<script>
    import { onMount} from 'svelte';

	onMount(() => {
		chrome.runtime.sendMessage({type:'expand'}, () => {
			if(chrome.runtime.lastError){
				console.log(chrome.runtime.lastError)
			}
        })
	});
</script>