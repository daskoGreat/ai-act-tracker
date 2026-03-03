export type RiskLevel =
    | "Oacceptabel risk"
    | "Hög risk"
    | "Begränsad risk"
    | "Låg / minimal risk";

export type MaturityLevel =
    | "Grundläggande"
    | "Utvecklad"
    | "Mogen"
    | "Avancerad";

export type QuestionType = "risk" | "maturity";

export interface Answer {
    id: string;
    type: QuestionType;
    answer: string;
}

export interface RiskRequest {
    answers: Answer[];
}

export interface RiskResponse {
    riskLevel: RiskLevel;
    error?: string;
}

export interface MaturityResponse {
    maturityLevel: MaturityLevel;
    error?: string;
}

export interface AnalysisResult {
    riskLevel: string;
    maturityLevel: string;
    explanation: string;
}

export interface CombinedResponse {
    riskLevel: RiskLevel | string;
    maturityLevel: MaturityLevel | string;
    analysis?: AnalysisResult;
    error?: string;
}
