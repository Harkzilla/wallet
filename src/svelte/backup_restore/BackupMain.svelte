<script>
    import { setContext, getContext } from 'svelte';

	//Components
    import { Components, BackupPages }  from '../Router.svelte'
    const { Steps, Step } = Components;
    import NavLogo from '../nav/NavLogo.svelte';

    //Context
    const { switchPage } = getContext('app_functions');

    setContext('functions', {
        changeStep: (step) => {
            if (step === -1 && currentStep === 0) switchPage('Backup');
            else if (step === -1) currentStep = back;
            else currentStep = step;
        },
        setKeystorePW: (info) => ksPwdInfo = info,
        getKeystorePW: () => {return ksPwdInfo},
        setKeystoreFile: (file) => keystoreFile = file
	});

    let currentStep = 0;
    let ksPwdInfo;
    let keystoreFile;

    let RestoreSteps = [
        {page: 'BackupIntro', hideSteps: true, back: 0},
        {page: 'BackupEnterPassword', hideSteps: false, back: 0},
        {page: 'BackupViewKeys', hideSteps: false, back: 0},
        {page: 'BackupKeystorePassword', hideSteps: false, back: 0},
        {page: 'BackupKeystoreCreate', hideSteps: false, back: 3},
        {page: 'BackupKeystoreComplete', hideSteps: false, back: 0},
    ]

    $: currentPage = RestoreSteps[currentStep].page;
    $: hideSteps = RestoreSteps[currentStep].hideSteps;
    $: back = RestoreSteps[currentStep].back;
    
</script>

<style>
.layout{
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.content{
    flex-grow: 1;
    display: flex;
}

.header{
    display: flex;
    flex-direction: row;
    position: absolute;
    left: 0%;
    right: 0%;
    top: 0%;
    bottom: 0%;
    right: 0;
    height: 97px;
    border-bottom: 1px solid #3D3D3D;
}

.steps{
    display: flex;
    justify-content: center;
    height: 180px;
}

.hide-steps{
    display: none;
}
</style>

<div class="layout">
    <div class="header">
        <NavLogo />
    </div>
    <div class="content">
        <svelte:component this={BackupPages[currentPage]} {keystoreFile} {ksPwdInfo} />
    </div>
    <div class="steps" class:hide-steps={hideSteps}>
        <Steps {back}/>
    </div>
</div>

