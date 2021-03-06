<script>
    import { onMount, afterUpdate, getContext, setContext} from 'svelte';

    //Stores
    import { SettingsStore, currentNetwork, themeStyle, CoinStore, balanceTotal } from '../../js/stores/stores.js';

    //Components
    import CryptoLogos from '../components/CryptoLogos.svelte';

    //Utils
    import { getTauBalance  } from '../../js/lamden/masternode-api.js';

    // Props
    export let coin;
    export let id;

    //Context
    const { switchPage } = getContext('app_functions');
    
    $: watching = coin.sk === 'watchOnly';
    $: symbol = coin.symbol;
    $: balance = coin.balance ? coin.balance : 0;
    $: percent = $balanceTotal === undefined ? "" : toPercentString();

    onMount(() => {
        getBalance();
    })

    async function getBalance(){
        let balanceRes = await getTauBalance($currentNetwork, coin.vk)
        CoinStore.updateBalance(coin, balanceRes)
    }

    function toPercentString(){
        if (isNaN((coin.balance / $balanceTotal))) return '0 %'
        return ((coin.balance / $balanceTotal)* 100).toFixed(1).toString() + ' %'
    }
</script>

<style>
.coin-box{
    display: flex;
    flex-direction: row;
    height: 63px;
    padding: 12px 0;
    cursor: pointer;
}

.coin-box:hover{
    background-color: var(--bg-color-grey)
}

.text{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.name{
	width: 234px;
}

.amount{
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.percent{
    justify-content: flex-end;
    margin-right: 28px;  
	width: 203px;
}

</style>

<div id={`coin-row-${id}`} class="coin-box" on:click={ () => switchPage('CoinDetails', coin)}>
    <div class="name text text-body1">
        <CryptoLogos {coin} black={true} styles={`width: 32px; margin: 0 36px 0 16px;`}/>
        <div class="name-box">
            <div class="text-body1">
                {`${coin.name}`} 
            </div>
            <div id={`coin-nickname-${id}`} class="text-body2 text-primary-dark">
                {`${coin.nickname}`} 
            </div>
        </div>
    </div>

    <div class="amount  flex-column">
        <div class="text-body1">{`${ balance.toLocaleString('en') } ${ symbol }`}</div>
        {#if watching}
            <div class="text-body2 text-primary-dark">{"Watching Wallet"}</div>
        {/if}
    </div>

    <div class="percent text text-body1"> {`${percent}`}</div>
</div>
