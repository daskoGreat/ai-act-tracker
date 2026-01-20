export type RiskLevel =
    | "Oacceptabel risk"
    | "Hög risk"
    | "Begränsad risk"
    | "Låg / minimal risk";

export interface RiskRequest {
    answers: {
        questionId: string;
        questionText: string;
        answer: string | boolean;
    }[];
}

export interface RiskResponse {
    riskLevel: RiskLevel;
    error?: string;
}
