import { z } from "zod";

// 2. SCHÉMAS ZOD POUR EXTRACTION IA (AVEC LE NOUVEAU BDOM & DESCRIPTIONS)
// ============================================================================

export const aiBdomItemSchema = z.object({
    partNumber: z.string().describe("Part number or catalog reference code, e.g., PSR37-600-70 or 3RT2027-1BB40"),
    name: z.string().describe("Name/Title of the component, e.g., Soft Starter 37A or Motor Circuit Breaker"),
    description: z.string().optional().describe("Technical summary and key ratings (e.g., 15kW 400V 3-phase, IP20)"),
    category: z.string().optional().describe("Component category, e.g., Power Distribution, Control Logic, Protection, Enclosure"),
    manufacturer: z.string().optional().describe("Brand or Manufacturer name, e.g., ABB, Siemens, Schneider Electric"),
    type: z.string().optional().describe("Sub-type or series, e.g., Soft Starter, Miniature Circuit Breaker, PLC CPU"),
    distributor: z.string().optional().describe("Recommended supplier or distributor if mentioned, e.g., Rexel, Farnell, RS Components"),
    availability: z.string().optional().describe("Lead time or availability status, e.g., In Stock, 2 Weeks, On Request"),
    unitPrice: z.string().optional().describe("Estimated or specified unit cost if mentioned in document, e.g., 250 EUR or N/A"),
});

export const aiRfqItemSchema = z.object({
    componentTag: z.string().optional().describe("Component Tag inside the panel, e.g., Q0, Q1, U1, PS1, HS1, PLC"),
    description: z.string().describe("Detailed description of the component"),
    recommendedMfrOrModel: z.string().optional().describe("Recommended Manufacturer or Model"),
    qty: z.number().int().min(1).default(1),
    unit: z.string().default("EA").describe("Unit of measurement"),
    techSpec: z.string().optional().describe("Extracted specs, dimensions, voltage rating, or thermal ranges"),
    status: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

export const aiBatteryLimitSchema = z.object({
    code: z.string().describe("Unique code or reference, e.g., INC-01, EXC-02"),
    subsystem: z.string().describe("Subsystem, e.g., Engineering, Panel Fabrication, Field Cabling, Civil Works"),
    description: z.string().describe("Detailed statement of inclusion, exclusion, or boundary limit"),
    type: z.enum(["INCLUSION", "EXCLUSION", "BATTERY_LIMIT"]),
    locationPoint: z.string().optional().describe("Physical boundary point"),
    responsibleParty: z.string().describe("Responsible entity: Contractor, Client, Subcontractor, Others"),
    interfaceType: z.enum(["PIPING", "ELECTRICAL", "INSTRUMENTATION", "CIVIL", "SOFTWARE", "OTHER"]),
});

export const aiAssumptionSchema = z.object({
    refCode: z.string().optional().describe("Reference ID, e.g., HYP-ELEC-01"),
    parameter: z.string().describe("Parameter name, e.g., Main Power Supply, Motor FLA, Control Voltage"),
    assumedValue: z.string().describe("Assumed quantitative or qualitative value (e.g., 400 VAC, 28.5 A, IP54)"),
    category: z.enum(["PROCESS", "ELECTRICAL", "INSTRUMENTATION", "CIVIL_WORKS", "REGULATORY", "SITE_CONDITIONS", "COMMERCIAL"]),
    rationale: z.string().describe("Engineering justification for making this assumption"),
    impactIfFalse: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    status: z.enum(["PENDING_CONFIRMATION", "CONFIRMED", "INVALIDATED"]).default("PENDING_CONFIRMATION"),
});

export const aiRiskAnomalySchema = z.object({
    flagCode: z.string().describe("Code, e.g., SAF-01, RSK-02"),
    detectedBy: z.enum(["AI_AGENT", "ENGINEER_REVIEW", "CLIENT_FEEDBACK"]).default("AI_AGENT"),
    itemType: z.enum(["RISK", "ANOMALY", "DISCREPANCY", "SAFETY_HAZARD"]),
    affectedComponentTag: z.string().optional().describe("Affected component or function"),
    hazardOrRiskDescription: z.string().describe("Description of the risk, design hazard, or inconsistency"),
    severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    mitigationStrategy: z.string().describe("Engineering mitigation applied or recommended"),
    status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "ACCEPTED_RISK"]).default("OPEN"),
});

export const aiRfiItemSchema = z.object({
    rfiNumber: z.number().int(),
    topic: z.string().describe("Topic requiring clarification"),
    question: z.string().describe("Specific technical question asked to the client"),
    importance: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("HIGH"),
});

// ============================================================================
// 🚀 SCHÉMA UNIFIÉ FINAL
// ============================================================================

export const engineeringAiOutputSchema = z.object({
    projectSummary: z.object({
        title: z.string().describe("System title, e.g., Duplex Pump Control Panel (2 x 15 kW)"),
        controlPhilosophy: z.string().describe("Brief summary of operational logic (e.g., Lead/Lag/Standby, 24h rotation)"),
    }),

    bdom: z.object({
        sectionDescription: z.string().describe("Executive overview of the master BDOM catalog, summarizing the core component breakdown, manufacturers, and hardware specifications."),
        items: z.array(aiBdomItemSchema).describe("Full extracted Bill of Data Components with part numbers and catalog details"),
    }),

    rfq: z.object({
        sectionDescription: z.string().describe("A brief narrative explaining the component selection, panel BOM scope, and hardware standards."),
        items: z.array(aiRfqItemSchema).describe("Complete extracted Bill of Materials / RFQ items with panel tags"),
    }),

    batteryLimits: z.object({
        sectionDescription: z.string().describe("Clear summary of contractual boundaries, detailing contractor inclusions vs client exclusions."),
        items: z.array(aiBatteryLimitSchema).describe("Detailed list of Scope Inclusions and Exclusions"),
    }),

    assumptions: z.object({
        sectionDescription: z.string().describe("Overview of the technical design basis, engineering assumptions, and electrical sizing rules applied."),
        items: z.array(aiAssumptionSchema).describe("Technical design basis assumptions and justifications"),
    }),

    risksAndAnomalies: z.object({
        sectionDescription: z.string().describe("Synthesis of safety reviews, potential operational hazards (like dry-run or water hammer), and mitigation plans."),
        items: z.array(aiRiskAnomalySchema).describe("Safety reviews, hazards identified, and mitigation measures"),
    }),

    rfis: z.object({
        sectionDescription: z.string().describe("Introductory overview of critical design questions and missing site data required from the client."),
        items: z.array(aiRfiItemSchema).describe("Requests for Information (RFIs) to be sent to the client"),
    }),
});

export type EngineeringAiOutput = z.infer<typeof engineeringAiOutputSchema>;