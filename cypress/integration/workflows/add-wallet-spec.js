import App from '../../../src/svelte/App.svelte'
import mount from 'cypress-svelte-unit-test'
import { writable } from 'svelte/store';

const loaded = writable(true);

const testingWallet = {
    existing: {    
        vk: 'c9958e6bffb9df572023cad43560420af1963210ff7eb934759348f36f1a4ef9',
        sk: '3c7311cea2ddf688541f4f477d66b391dded30d67f5358287e47e29cca0f69e7'},
    watching:{
        vk: '166406ec060e43e90bb64b3fbfa1155daff49e2f678db97e642af4158e8d36df'
    }

}

describe('Test all Add Wallet options', () => {
    before(function (){
        cy.viewport(1920, 1080)
        mount(App, {props: {loaded}})
        
        cy.get('#create-wallet').focus().should('exist').click();

        cy.get('.firstrun-create-pwd').should('exist')
        cy.get('input#pwd1').focus().invoke('attr', 'value', 'Testing0!0101')
        cy.get('input#pwd2').focus().invoke('attr', 'value', 'Testing0!0101')
        cy.get('[type="submit"]').focus().click()
    
        cy.get('.firstrun-tos').should('exist')
        cy.get('#i-understand').focus().click()

        cy.wait(5500)
        cy.get('.coinsmain').should('exist')
    })

    it('Can add new Lamden Coin to wallet', function () {
        //---------------------------------
        cy.log('Renders Coinsmain and Add Wallets button exists')
        cy.get('#add-btn').should('exist')
        cy.wait(500) 

        //---------------------------------
        cy.log('Clicking Add Wallet button Renders CoinAddDetails Modal')
        cy.get('#add-btn').focus().click()
        cy.get('.coin-add-details').should('exist')
        cy.wait(500) 

        //---------------------------------
        cy.log('Can successfully create a new Wallet')
        cy.get('#create-new-btn').focus().click()
        cy.get('#nickname').focus().invoke('attr', 'value', 'Testing CREATE NEW')
        cy.get('[type="submit"]').focus().click()
        cy.wait(500) 

        //
        cy.log('Shows Successful Message Box')
        cy.get('.message-box').should('exist')
        cy.get('#message-text').should('exist').then(($text) => {
            expect($text[0].textContent).to.include("Added")
        })
        cy.get('#success').should('exist')
        cy.log('Message Box buttons render')
        cy.get('#home-btn').should('exist')
        cy.get('#another-btn').should('exist').focus().click()
        cy.wait(500)

        //---------------------------------
        cy.log('Can successfully create a Wallet using and Existing key')
        cy.get('#add-existing-btn').focus().click()
        cy.get('#private-key').focus().invoke('attr', 'value', testingWallet.existing.sk)
        cy.get('#nickname').focus().invoke('attr', 'value', 'Testing ADD EXISTING')
        cy.get('[type="submit"]').focus().click()
        cy.wait(500)
        
        //
        cy.log('Shows Successful Message Box')
        cy.get('.message-box').should('exist')
        cy.get('#message-text').should('exist').then(($text) => {
            expect($text[0].textContent).to.include("Added")
        })
        cy.get('#success').should('exist')
        cy.log('Message Box buttons render')
        cy.get('#home-btn').should('exist')
        cy.get('#another-btn').should('exist').focus().click()
        cy.wait(500)

        //---------------------------------
        cy.log('Can successfully create a Wallet using jsut Public Key')
        cy.get('#track-address-btn').focus().click()
        cy.get('#public-key').focus().invoke('attr', 'value', testingWallet.watching.vk)
        cy.get('#nickname').focus().invoke('attr', 'value', 'Testing ADD WATCHING')
        cy.get('[type="submit"]').focus().click()
        cy.wait(500)
        
        //
        cy.log('Shows Successful Message Box')
        cy.get('.message-box').should('exist')
        cy.get('#message-text').should('exist').then(($text) => {
            expect($text[0].textContent).to.include("Added")
        })
        cy.get('#success').should('exist')
        cy.log('Message Box buttons render')
        cy.get('#home-btn').should('exist')
        cy.get('#another-btn').should('exist').focus().click()
        cy.wait(500)

        //---------------------------------
        cy.log('Shows warning when key already exists')
        cy.get('#add-existing-btn').focus().click()
        cy.get('#private-key').focus().invoke('attr', 'value', testingWallet.existing.sk)
        cy.get('#nickname').focus().invoke('attr', 'value', 'Testing ADD EXISTING')
        cy.get('[type="submit"]').focus().click()
        cy.wait(500)
        
        //
        cy.log('Shows Warning Message Box')
        cy.get('.message-box').should('exist')
        cy.get('#message-text').should('exist').then(($text) => {
            expect($text[0].textContent).to.eq("Coin already exists in wallet")
        })
        cy.get('#warning').should('exist')
        cy.log('Message Box buttons render')
        cy.get('#home-btn').should('exist')
        cy.get('#another-btn').should('exist').focus().click()
        cy.wait(500)

        //---------------------------------
        cy.log('New Keys are displayed in Coinsmain')
        cy.get('#modal-cancel-btn').focus().click()
        cy.get('.coinsmain').should('exist')
        cy.get('#coin-nickname-1').should('exist').then(($div) => {
            expect($div[0].textContent).to.eq("Testing CREATE NEW")
        })
        cy.get('#coin-nickname-2').should('exist').then(($div) => {
            expect($div[0].textContent).to.eq("Testing ADD EXISTING")
        })
        cy.get('#coin-nickname-3').should('exist').then(($div) => {
            expect($div[0].textContent).to.eq("Testing ADD WATCHING")
        })
        cy.wait(500)
    })
})