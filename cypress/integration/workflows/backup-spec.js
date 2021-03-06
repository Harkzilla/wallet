import App from '../../../src/svelte/App.svelte'
import mount from 'cypress-svelte-unit-test'
import 'cypress-file-upload';
import { writable } from 'svelte/store';
import "cypress-localstorage-commands";

const loaded = writable(true);

describe('Backup Wallet Process', () => {
    before(function (){
        cy.viewport(1920, 1080)
        mount(App, {props: {loaded}})
                
        cy.get('.firstrun-intro').should('exist')
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
    
    it('Backup Menu button will Render Backup.svelte', () => {
        cy.get('#backup').should('exist').click()
        cy.get('.backup').should('exist')

    })

    it('Will Load into Backup Flow and Render BackupIntro.svelte with buttons', () => {
        cy.get('#backup-btn').should('exist').click()
        cy.get('.backup-intro').should('exist')
        cy.get('#view-keys-btn').should('exist').should('exist')
        cy.get('#back-btn').should('exist').should('exist')
        cy.get('#create-btn').should('exist').should('exist')
    })

    it('Will Render BackupKeystorePassword.svelte When Create Backup File button clicked and all content', () => {
        cy.get('#create-btn').should('exist').click()
        cy.get('.backup-createpw').should('exist')
        cy.get('#pwd1-input').should('exist')
        cy.get('#pwd2-input').should('exist')
        cy.get('#hint-input').should('exist')
        cy.get('#create-pw-btn').should('exist')
    })

    it('First Password Input Throws validations error when empty', () => {
        cy.get('[type="submit"]').focus().click()
        cy.get('#pwd1-input').then(($input) => {
            expect($input[0].validationMessage).to.eq("Please fill in this field.")
        })
    })

    it('Second Password Input Throws validations error when empty', () => {
        cy.get('#pwd1-input').focus().invoke('attr', 'value', 'Testing0!234567')
        cy.get('[type="submit"]').focus().click()
        cy.get('#pwd2-input').then(($input) => {
            expect($input[0].validationMessage).to.eq("Please fill in this field.")
        })
    })

    it('First Password Input Throws pattern validations', () => {
        cy.get('#pwd1-input').focus().invoke('attr', 'value', 'nomatch')
        cy.get('[type="submit"]').focus().click()
        cy.get('#pwd2-input').then(($input) => {
            expect($input[0].validationMessage).to.eq("Please fill in this field.")
        })
    })

    it('Second Password Input Throws validations when passwords do not match', () => {
        cy.get('#pwd1-input').focus().invoke('attr', 'value', 'Testing0!234567')
        cy.get('#pwd2-input').focus().invoke('attr', 'value', 'testing0!234567')
        cy.get('[type="submit"]').focus().click()
        cy.get('#pwd2-input').then(($input) => {
            expect($input[0].validationMessage).to.eq("Passwords do not match")
        })
    })

    it('Accpets Matching Strong passwords', () => {
        cy.get('#pwd1-input').focus().invoke('attr', 'value', 'Testing0!234567')
        cy.get('#pwd2-input').focus().invoke('attr', 'value', 'Testing0!234567')
        cy.get('[type="submit"]').focus().click()
    })

    it('Will Render BackupKeystoreCreate.svelte while keystore is being created', () => {
        cy.get('.backup-create').should('exist')
    })

    it('Will Render BackupKeystoreComplete.svelte with I understand button initially is disabled', () => {
        cy.get('.backup-complete').should('exist')
        cy.get('#download-btn').should('exist').should('be.disabled')
    })

    it('I understand button is no disabled when checkbox is checked', () => {
        cy.get('#consent-chk').should('exist').check()
        cy.get('#download-btn').should('exist').should('not.be.disabled')
    })

})