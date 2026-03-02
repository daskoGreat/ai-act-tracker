# Azure Hosting & Azure OpenAI Setup

Detta projekt är konfigurerat för att kunna köras på Azure Static Web Apps (ASWA) och använda Azure OpenAI för LLM-svar.

## Steg 1: Skapa Azure Static Web App

1. Gå till [Azure Portal](https://portal.azure.com).
2. Sök efter "Static Web Apps" och klicka på **Create**.
3. Välj din prenumeration och resursgrupp.
4. Namnge appen (t.ex. `ai-act-tracker`).
5. Under **Deployment details**, välj **GitHub**.
6. Logga in på GitHub och välj ditt repo samt branchen `feature/azure-hosting-aoai`.
7. Under **Build Details**, välj **Next.js** som preset.
8. Klicka på **Review + Create** och sedan **Create**.

## Steg 2: Konfigurera Environment Variables i Azure

När din Static Web App är skapad:

1. Gå till din resurs i Azure Portal.
2. Välj **Configuration** under "Settings" i vänstermenyn.
3. Lägg till följande variabler under **Application settings**:
   - `LLM_PROVIDER`: `azure`
   - `AZURE_OPENAI_ENDPOINT`: Din Azure OpenAI endpoint (t.ex. `https://xxx.openai.azure.com/`)
   - `AZURE_OPENAI_API_KEY`: Din API-nyckel
   - `AZURE_OPENAI_DEPLOYMENT`: Namnet på din deployment (t.ex. `gpt-4`)
4. Klicka på **Save**.

## Steg 3: Azure OpenAI Setup

1. Gå till [Azure AI Foundry](https://ai.azure.com) eller Azure OpenAI resursen i portalen.
2. Skapa en ny deployment av en modell (t.ex. `gpt-4` eller `gpt-4o`).
3. Kopiera **Deployment Name**, **Endpoint** och **Key 1** till variablerna i Steg 2.

## Steg 4: Verifiera Deploy

Din app deployas automatiskt via GitHub Actions vid push till branchen. Du kan följa progress under fliken **Actions** i ditt GitHub-repo.

---

### Lokal testning med Azure
För att testa lokalt med Azure OpenAI, uppdatera din `.env.local` med:
```env
LLM_PROVIDER=azure
AZURE_OPENAI_ENDPOINT=...
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_DEPLOYMENT=...
```
Kör sedan `npm run dev`.
