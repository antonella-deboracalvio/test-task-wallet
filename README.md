# Task Manager – G-NOUS - Prova Tecnica

Applicazione web sviluppata in React + TypeScript che permette di gestire task con un sistema di crediti (Wallet) e tracciamento eventi (Audit Log).

Il progetto è stato strutturato con un’architettura modulare tramite custom hooks e componenti per separare la logica dall’interfaccia e migliorare la manutenibilità del codice.


### Descrizione Progetto ###

L’applicazione consente di:

- Creare, modificare ed eliminare task
- Gestire un saldo crediti (Wallet)
- Tracciare tutte le azioni rilevanti tramite Audit Log con Reset Audit: elimina completamente lo storico eventi senza alterare task o wallet.
- Filtrare task per stato, priorità e ricerca testuale
- Supportare tema Dark / Light con toggle con persistenza preferenza utente
- Importare ed esportare dati in formato JSON
  
    ##Import / Export
- Versioning del payload (version: 1)
- Validazione runtime tramite type guards (isExportPayloadV1)
- Gestione errori JSON non valido
- Ripristino stato completo (tasks, wallet, audit)


        ## Funzionalità Principali

- Creazione task (costo: -1 credito)
- Modifica task
- Cambio stato (DONE → +2 crediti)
- Eliminazione task (rimborso +1 credito se non DONE)
- Validazione titolo obbligatorio

        ## Funzionalità Wallet
- Saldo iniziale configurabile (default: 100 crediti)
- Nessun saldo negativo consentito
- Storico movimenti tramite Audit

        ## Funzionalità Audit Log
- Tracciamento eventi:
  - TASK_CREATED
  - TASK_UPDATED
  - TASK_STATUS_CHANGED
  - TASK_DELETED
  - WALLET_DEBIT
  - WALLET_CREDIT
- Filtro per tipo evento
- Ricerca testuale


             UI & UX
- Tema Dark/Light con Tailwind (`darkMode: "class"`)
- Componenti riutilizzabili con `@layer`
- Hover coerenti in entrambi i temi
- Layout responsive

        UX migliorata

- Implementato un popup di benvenuto con dettaglio delle regole di reward e costi
- Error handling UI
- Blocco status senza titolo
- Reset draft corretti

        Architettura Migliorata

E' stata organizzata seguendo una separazione tra:

- Container logic (App.tsx)
- Custom Hooks (logic)
- Componenti (UI)

        Sistema Filtri Avanzato

Filtro combinato per:
- Stato
- Priorità
- Ricerca full-text su titolo e descrizione
- Reset filtri
Logica isolata in useTaskFilters per maggiore modularità



         ## Persistenza Dati

I dati vengono salvati in localStorage:

- tasks
- credits
- auditEvents
- welcomeSeen

## Non è richiesto backend.


          ## TEMA
Il dark mode è configurato tramite Tailwind:
- Dark/Light toggle
- darkMode: "class" 
- persistenza in localStorage



   ## TECNOLOGIE UTILIZZATE

- **React 18**
- **TypeScript**
- **Vite**
- **TailwindCSS**
- CSS Layers

- Custom Hooks:
- useAudit → gestione eventi e storico
- useTaskFilters → filtri e ricerca
- useTheme → gestione dark/light mode
- useWallet → gestione saldo e regole crediti


 ## --- Requisiti di Sistema --- ##

- Node.js ≥ 18.x
- npm ≥ 9.x (o yarn/pnpm)
- Browser(Chrome, Edge, Firefox)

# Variabili d’Ambiente
 Nessuna variabile d’ambiente richiesta.



### -- Setup del Progetto -- ###


--  Clonare il repository

```bash
git clone < https://github.com/antonella-deboracalvio/test-task-wallet.git >
cd test-task-wallet
npm install/ yarn install
npm run dev
http://localhost:5173 -> progetto

```

## -- Testing - Vitest + UI ##
Con in parte logica wallet isolata in funzioni pure per facilitarne il testing

Test coperti:

- Validazione payload import/export (validators.test.ts)

- Regole Wallet (reward DONE, refund delete, ecc.) (walletRules.test.ts)

# Installazione Vitest
```bash
npm install -D vitest @vitest/ui
npm run test 

## con Interfaccia Grafica ##
npm run test:ui

```

