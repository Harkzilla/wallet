<script>
	import { onMount, getContext, setContext } from 'svelte'
	
    //Stores
    import { breadcrumbs, currentNetwork, activeTab, FilesStore } from '../../js/stores/stores.js';

	//Components
	import { IdeErrorsBox, IdeMethods, IdeTabs, Components }  from '../Router.svelte';
	const { Button, Loading } = Components;
	import { Monaco } from '../components/Monaco.svelte'
	import MonacoWindow from './IdeMonacoEditor.svelte';

    //Utils
    import { getContractInfo, getContractMethods, lintCode  } from '../../js/lamden/masternode-api.js';

    //Context
	const { openModal } = getContext('app_functions');
	setContext('editor_functions', {
		checkContractExists: async (contractName, options) => await getContract(contractName, options),
		addContractTab: async (contractName, contractCode) => await addFileToStore(contractName, contractCode)
    });

	let lintErrors = {violations: null};
	let editorIsLoaded = false;  
	let monaco;
	let monacoComponent;

	onMount(() =>{
		breadcrumbs.set([{name: 'Smart Contracts', page: {name: ''}}]);
		Monaco.then(mod => {
			if (mod){
				monaco = mod;
				editorIsLoaded = true;
			}
		})
		return () => {
			editorIsLoaded = false;
		}
	})

	function editorLoaded(){
		editorIsLoaded = true;
		if ($activeTab.type === 'local') lint();
	}

	async function lint(callback){
		lintErrors = await lintCode($currentNetwork, $activeTab.name, $activeTab.code)
		try {
			callback(lintErrors);
		} catch (e){}
	}

	function submit(res){
		if (res.violations === null){
			openModal('IdeModelSubmit', {
				'contractName': 'submission', 
				'methodName': 'submit_contract', 
				args: {
					name: {
						type: 'text',
						value: $activeTab.name
					},
					code:{
						type: 'text',
						value: $activeTab.code
					}
				}
			})
		}
	}

	function reformatMethodObject(methods){
        methods.map(method => {
            if (!method.args) method.args = {};
            method.arguments.map((arg, index) => {
               if (!method.args[arg]) method.args[arg] = {type: "text", value: 'testing'}
            })
        })
        return [...methods]
	}

	function handleMethodClick(e){
		openModal('IdeModelMethodTx', e.detail)
	}

	async function getContract(contractName, options){
		let contractInfo = await getContractInfo($currentNetwork, contractName)
		if (contractInfo) options.callback(contractInfo, !options.data ? undefined : options.data);
	}
	
    async function addFileToStore(contractName, contractCode){
		let methods =  await getContractMethods($currentNetwork, contractName)
		FilesStore.addFile(contractName, contractCode, methods, $currentNetwork);
	}
</script>

<style>
.buttons{
    background: var(--bg-color-grey);
    padding: 10px 17px;
}

</style>

{#if editorIsLoaded}
	<div id="monaco_window" class="flex-column">
		
			<IdeTabs />

		<div class="editor-row">

			<MonacoWindow 
				bind:this={monacoComponent}
				{monaco}
				on:loaded={editorLoaded}
				on:clickMethod={handleMethodClick}
				{lintErrors}
			/>

			{#if editorIsLoaded && $activeTab.type === 'local'}
				<div class="buttons flex-row">
					{#if $activeTab.type === 'local'}
						<Button 
							id={'contractTab-btn'} 
							classes={'button__transparent'}
							name="Check Contract"
							margin={'0 10px 3px 0'}
							height={'42px'}
							click={lint}
						/>
						<Button 
							id={'contractTab-btn'} 
							classes={'button__transparent button__blue'}
							name="Submit to Network"
							height={'42px'}
							click={() => lint(submit)}
						/>
					{/if}
				</div>
			{/if}
		</div>
		{#if editorIsLoaded && $activeTab.type === 'local'}
			<IdeErrorsBox {lintErrors} />
		{/if}
		{#if editorIsLoaded && $activeTab.methods}
			<IdeMethods methods={reformatMethodObject($activeTab.methods)} />
		{/if}
	</div>
{:else}
	<div class="loading" style={`width: 100%; height: 500px;`}>
		<Loading  message={'Loading Editor'}/>
	</div>
{/if}