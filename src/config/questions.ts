export interface Option {
    value: string;
    label: string;
}

export interface Question {
    id: string;
    title: string;
    subtitle?: string;
    options: Option[];
}

export interface Section {
    id: string;
    title: string;
    questions: Question[];
}

export const survey: Section[] = [
    {
        id: "section_1",
        title: "DEL 1: Indikation på AI Act-risknivå (Vad används AI till?)",
        questions: [
            {
                id: "ai_decision_access",
                title: "Påverkar AI vilka personer som får ett beslut, erbjudande eller tillgång?",
                subtitle: "(t.ex. CV-sortering, kandidaturval, kundgodkännande, kreditbedömning, prioriterad kö, flaggning av ärenden)",
                options: [
                    { value: "yes_decision", label: "Ja – AI används i sådana beslut" },
                    { value: "partly_recommend", label: "Delvis – AI rekommenderar men människa granskar" },
                    { value: "no_support", label: "Nej – endast internt stöd (t.ex. text, analys, sammanfattningar)" },
                    { value: "dont_know", label: "Vet inte" }
                ]
            },
            {
                id: "ai_error_consequence",
                title: "Om AI:n gör fel – kan det få tydliga konsekvenser?",
                subtitle: "(t.ex. någon nekas jobb/tjänst, fel kund stoppas/släpps igenom, regelbrott, klagomål eller förtroendeskada)",
                options: [
                    { value: "yes_clear", label: "Ja – tydliga konsekvenser" },
                    { value: "limited", label: "Begränsade konsekvenser – upptäcks oftast i efterhand" },
                    { value: "internal_only", label: "Endast intern påverkan – mest ineffektivitet" },
                    { value: "dont_know", label: "Vet inte" }
                ]
            },
            {
                id: "ai_dependency",
                title: "Är verksamheten beroende av att AI fungerar korrekt i vardagen?",
                subtitle: "(stannar flöden, stoppas leverans, påverkas kundhantering eller beslut om AI tas bort?) (t.ex. urvalssystem, riskmotor, prioriteringslista, driftövervakning)",
                options: [
                    { value: "yes_direct", label: "Ja – verksamheten påverkas direkt" },
                    { value: "partly_manual", label: "Delvis – går att arbeta manuellt tillfälligt" },
                    { value: "no_support", label: "Nej – endast stödverktyg" },
                    { value: "dont_know", label: "Vet inte" }
                ]
            },
            {
                id: "ai_share_of_decision",
                title: "Hur stor del av beslutet tas i praktiken av AI:n?",
                options: [
                    { value: "human_decides", label: "Människan avgör själv (AI ger förslag eller analyser som kan ignoreras)" },
                    { value: "ai_recommend_followed", label: "AI rekommenderar – människan brukar följa (t.ex. rankinglista, matchning, prioritering, riskpoäng)" },
                    { value: "ai_automatic", label: "AI avgör automatiskt (t.ex. auto-avslag/godkännande, spärrar, ärenden granskas inte manuellt)" },
                    { value: "dont_know", label: "Vet inte" }
                ]
            }
        ]
    },
    {
        id: "section_2",
        title: "DEL 2: Organisatorisk beredskap",
        questions: [
            {
                id: "org_ai_owner",
                title: "Är det tydligt vem som äger AI-frågan hos er?",
                subtitle: "(vem bestämmer vad som är okej att använda och inte?)",
                options: [
                    { value: "yes_owner", label: "Ja – utsedd ansvarig med mandat" },
                    { value: "partly_owner", label: "Delvis – flera delar eller informellt" },
                    { value: "no_owner", label: "Nej – inget tydligt ägarskap" },
                    { value: "dont_know", label: "Vet inte" }
                ]
            },
            {
                id: "org_ai_inventory",
                title: "Vet du var AI faktiskt används i organisationen idag?",
                subtitle: "(t.ex. ChatGPT, Copilot, rekryteringsverktyg, kundsystem, analyser, automatiseringar)",
                options: [
                    { value: "yes_overview", label: "Ja – vi har en samlad bild" },
                    { value: "partly_overview", label: "Delvis – ungefärlig bild" },
                    { value: "no_overview", label: "Nej – används utan överblick" },
                    { value: "dont_know", label: "Vet inte" }
                ]
            },
            {
                id: "org_ai_rules",
                title: "Finns tydliga spelregler för AI-användning i vardagen?",
                subtitle: "(t.ex. vad man får dela i AI-tjänster, vilka verktyg som är godkända, när man behöver stämma av innan AI används i beslut om kunder eller personal)",
                options: [
                    { value: "yes_rules", label: "Ja – tydliga och kommunicerade" },
                    { value: "partly_rules", label: "Delvis – oskrivna eller lokala regler" },
                    { value: "no_rules", label: "Nej – upp till var och en" },
                    { value: "dont_know", label: "Vet inte" }
                ]
            },
            {
                id: "org_risk_check",
                title: "Tittar ni på risk innan ni börjar använda nya AI-funktioner?",
                subtitle: "(t.ex. inför nytt verktyg, ny funktion eller leverantör)",
                options: [
                    { value: "yes_structured", label: "Ja – görs strukturerat" },
                    { value: "sometimes", label: "Ibland – beroende på situation" },
                    { value: "no_risk_check", label: "Nej – börjar använda direkt" },
                    { value: "dont_know", label: "Vet inte" }
                ]
            },
            {
                id: "org_board_ready",
                title: "Skulle du kunna förklara ert AI-arbete i ett lednings- eller styrelsemöte idag?",
                subtitle: "(hur ni använder AI och hur ni tänkt kring risk och ansvar)",
                options: [
                    { value: "yes_shared", label: "Ja – gemensam bild" },
                    { value: "partly_diff", label: "Delvis – olika uppfattningar" },
                    { value: "no_unclear", label: "Nej – svårt att beskriva" },
                    { value: "dont_know", label: "Vet inte" }
                ]
            }
        ]
    }
];
