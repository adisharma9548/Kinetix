import { DeconstructedBridgePayload } from "./schemas";

export interface DemoScenarioPreset {
  id: "scholarship" | "tenancy" | "architecture";
  label: string;
  tag: string;
  sampleVoiceIntent: string;
  rawDocumentSnippet: string;
  fallbackPayload: DeconstructedBridgePayload;
}

export const DEMO_SCENARIOS: Record<
  "scholarship" | "tenancy" | "architecture",
  DemoScenarioPreset
> = {
  scholarship: {
    id: "scholarship",
    label: "National Technical Merit Fellowship Gazette",
    tag: "GOVT GRANT // 14 PAGES",
    sampleVoiceIntent:
      "My household income is $42,000 per year and I am a first-year engineering undergraduate. Do I qualify for this fellowship and what exact documents must I file?",
    rawDocumentSnippet: `DEPARTMENT OF HIGHER EDUCATION GAZETTE NOTIFICATION NO. F.24-9/2026-TS.III: Pursuant to Clause 4.2(b) of the Revised Technical Fellowship Directive, applicants matriculated in accredited undergraduate engineering institutions (1st Year or 2nd Year via Lateral Entry) whose gross annual familial emoluments from all verifiable sources do not exceed USD 65,000 per annum during the preceding fiscal assessment year shall be deemed eligible, subject to the non-availment of concurrent federal stipends and submission of Annexure-IV Revenue-attested income certification prior to October 31.`,
    fallbackPayload: {
      dossierId: "DOS-2026-SCH-01",
      title: "National Technical Merit Fellowship Dossier",
      domainTag: "PUBLIC_GRANT // HIGHER_EDUCATION",
      sourceComplexityScore: 92,
      bridgedClarityScore: 99,
      rawJargonCount: 64,
      estimatedTimeSavedMinutes: 145,
      telemetryLog: [
        {
          stepIndex: "T-01",
          phaseName: "LEXICAL_STRIP",
          rawTokenSample: "gross annual familial emoluments <= USD 65,000",
          resolvedMeaning: "Total household income under $65,000/yr (Verified at $42,000)",
          latencyMs: 14,
        },
        {
          stepIndex: "T-02",
          phaseName: "CLAUSE_CROSS_REF",
          rawTokenSample: "Clause 4.2(b) non-availment of concurrent stipends",
          resolvedMeaning: "Applicant cannot hold another federal merit fellowship simultaneously",
          latencyMs: 19,
        },
        {
          stepIndex: "T-03",
          phaseName: "ARTIFACT_SYNTHESIS",
          rawTokenSample: "Annexure-IV Revenue-attested certification",
          resolvedMeaning: "Auto-generating Annexure-IV Statutory Affidavit & Dean Verification Memo",
          latencyMs: 22,
        },
      ],
      globalSummary: {
        PLAIN: "You qualify 100% for this $10,000/year grant. Your family income ($42,000) is well under the $65,000 cap. You just need 3 signed forms before October 31.",
        DIRECT: "ELIGIBILITY CONFIRMED ($42K vs $65K statutory cap). Disbursement: $10,000/yr direct deposit. Action required: File Annexure-IV Revenue Certificate + Dean L1 Bonafide before Oct 31.",
        STATUTORY: "Applicant satisfies Clause 4.2(b) gross familial emolument threshold ($42,000 <= $65,000 ceiling) and Clause 2.1 matriculation criteria. Subject to Annexure-IV attestation and L1 Nodal verification.",
      },
      eligibilityChecklist: [
        {
          id: "ELIG-01",
          criterion: "Gross household annual income strictly under $65,000 (Verified: $42,000)",
          isMetByDefault: true,
          clauseReference: "SEC 4.2(b)",
        },
        {
          id: "ELIG-02",
          criterion: "Enrolled full-time in 1st Year Engineering at an accredited institution",
          isMetByDefault: true,
          clauseReference: "SEC 2.1(a)",
        },
        {
          id: "ELIG-03",
          criterion: "Not receiving any concurrent Federal/State merit stipend",
          isMetByDefault: true,
          clauseReference: "SEC 5.4",
        },
      ],
      nodes: [
        {
          id: "node-01",
          indexLabel: "01",
          category: "ELIGIBILITY",
          status: "VERIFIED",
          confidenceScore: 99,
          estimatedMinutes: 5,
          dependencies: [],
          tiers: {
            tier1_eli10: {
              headline: "You Pass the Income Rule With Room to Spare",
              summary: "The fellowship awards $10,000 every year if your family earns less than $65,000. At $42,000, you are $23,000 safely below the cutoff.",
              registerVariants: {
                PLAIN: "Your family earns $42,000, which is way below the $65,000 limit. You pass the main check easily.",
                DIRECT: "Income check passed: $42,000 declared vs. $65,000 maximum cap ($23,000 safety margin).",
                STATUTORY: "Gross familial emoluments of USD 42,000 satisfy the Clause 4.2(b) statutory ceiling of USD 65,000.",
              },
              actionableBullets: [
                "Your $42,000 household income leaves a $23,000 safety buffer below the cap.",
                "Covers tuition, hardware equipment, and residential books with zero repayment.",
              ],
              audioScript: "Good news. Your household income of 42,000 dollars is well below the 65,000 dollar ceiling. You qualify for the full annual grant.",
              autoDraftedArtifact: {
                artifactType: "CHECKLIST_PROTOCOL",
                title: "Household Readiness Verification",
                bodyContent: "1. Confirm prior-year tax transcript shows AGI <= $65,000.\n2. Ensure student checking account has direct-deposit routing enabled.",
              },
            },
            tier2_executive: {
              headline: "Clause 4.2(b) Income Threshold & Matriculation Audit",
              summary: "Gross household emoluments of $42,000 satisfy the ≤$65,000 statutory cap. First-year regular matriculation qualifies for full lump-sum annual disbursement.",
              registerVariants: {
                PLAIN: "You meet both the income cap and the first-year enrollment rule for the full annual payout.",
                DIRECT: "Clause 4.2(b) Audit: COMPLIANT. Combined parental income ($42K) clears the $65K ceiling.",
                STATUTORY: "Verified compliance with Directive F.24-9/2026-TS.III Sec 4.2(b) regarding combined parental fiscal assessment.",
              },
              actionableBullets: [
                "Gross income calculated across all earning household guardians for FY 2025-26.",
                "Grant funds disburse directly to the student's beneficiary routing account.",
              ],
              audioScript: "Executive audit complete: Clause 4.2b verifies your eligibility at 42,000 dollars gross income against the 65,000 dollar statutory cap.",
              autoDraftedArtifact: {
                artifactType: "CHECKLIST_PROTOCOL",
                title: "Clause 4.2(b) Compliance Matrix",
                bodyContent: "STATUTORY CAP: USD 65,000\nAPPLICANT DECLARED: USD 42,000\nCOMPLIANCE MARGIN: +USD 23,000 (VERIFIED ELIGIBLE)",
              },
            },
            tier3_autoExecute: {
              headline: "Auto-Generated Annexure-IV Statutory Income Affidavit",
              summary: "Pre-filled statutory declaration citing Clause 4.2(b) and Clause 5.4 ready for digital signature and portal upload.",
              registerVariants: {
                PLAIN: "We wrote the official income promise letter for you—just print and sign it.",
                DIRECT: "Ready-to-sign Annexure-IV affidavit generated with pre-filled income and non-stipend declarations.",
                STATUTORY: "Executed Annexure-IV Statutory Undertaking formatted per Gazette F.24-9/2026-TS.III specifications.",
              },
              actionableBullets: [
                "Pre-formatted for instant portal PDF upload.",
                "Includes mandatory Clause 5.4 non-concurrent stipend undertaking.",
              ],
              audioScript: "Tier 3 Auto-Execute ready. Your Annexure 4 income declaration affidavit has been compiled for immediate signature.",
              autoDraftedArtifact: {
                artifactType: "APPLICATION_LETTER",
                title: "ANNEXURE-IV: STATUTORY INCOME & NON-STIPEND UNDERTAKING",
                bodyContent: `TO: THE NODAL OFFICER, NATIONAL TECHNICAL MERIT FELLOWSHIP CELL\nREF: GAZETTE NOTIFICATION F.24-9/2026-TS.III // CLAUSE 4.2(b)\n\nI hereby solemnly affirm that my gross annual familial income from all verifiable sources for FY 2025-26 is USD 42,000.00, which falls strictly within the statutory ceiling of USD 65,000.00.\n\nI further declare under Clause 5.4 that I am not in receipt of any concurrent Federal or State merit stipend.\n\n[DIGITAL STAMP READY // REVENUE ATTESTATION BLOCK]`,
              },
            },
          },
        },
        {
          id: "node-02",
          indexLabel: "02",
          category: "RISK_TRAP",
          status: "WARNING",
          confidenceScore: 96,
          estimatedMinutes: 20,
          dependencies: ["node-01"],
          tiers: {
            tier1_eli10: {
              headline: "Watch Out: A Raw Tax Return Alone Gets Rejected",
              summary: "Most applicants upload a raw employer W-2 or unsigned tax form and get rejected automatically. You must attach a certified Revenue Transcript or notarized Annexure-IV.",
              registerVariants: {
                PLAIN: "Do not upload just a pay stub! You need an official certified income transcript.",
                DIRECT: "REJECTION TRAP: Raw pay stubs/unverified tax forms fail automated portal screening.",
                STATUTORY: "Clause 4.2(b) invalidates unattested employer wage statements lacking Revenue Authority verification.",
              },
              actionableBullets: [
                "Do not upload standalone employer pay stubs.",
                "Attach the barcode-verified Revenue Transcript alongside Annexure-IV.",
              ],
              audioScript: "Warning: do not upload a raw pay stub alone. You must submit a certified revenue transcript with your Annexure 4 form.",
              autoDraftedArtifact: {
                artifactType: "CHECKLIST_PROTOCOL",
                title: "Rejection Avoidance Protocol",
                bodyContent: "REJECTED ALONE: Pay Stubs, Unverified Worksheets.\nACCEPTED: Barcode-Verified Revenue Transcript + Signed Annexure-IV.",
              },
            },
            tier2_executive: {
              headline: "Annexure-IV Revenue Attestation Mandate",
              summary: "Clause 4.2(b) explicitly invalidates unverified wage filings. Official Revenue Transcript certification with a verifiable document control number is a hard gate.",
              registerVariants: {
                PLAIN: "Make sure your income proof has an official government verification barcode.",
                DIRECT: "Mandatory Gate: Income proof must carry a verifiable Revenue Barcode issued in FY 2025-26.",
                STATUTORY: "Strict evidentiary standard under Sec 4.2(b): requires cryptographically verifiable Revenue Authority attestation.",
              },
              actionableBullets: [
                "Document must bear a verifiable digital barcode or control serial.",
                "PDF file size must remain under 200KB at 150 DPI grayscale.",
              ],
              audioScript: "Clause 4.2b requires a barcode-verified Revenue Authority certificate. Standalone employer forms are rejected.",
              autoDraftedArtifact: {
                artifactType: "CHECKLIST_PROTOCOL",
                title: "Portal Upload Specification",
                bodyContent: "VERIFICATION: Digital Barcode Required\nVALIDITY WINDOW: FY 2025-26\nFORMAT: PDF < 200KB (150 DPI)",
              },
            },
            tier3_autoExecute: {
              headline: "Expedited Revenue Certification Request Letter",
              summary: "Pre-drafted cover request to the Regional Revenue Officer requesting 48-hour expedited income verification citing the October 31 statutory deadline.",
              registerVariants: {
                PLAIN: "Use this letter to get your official income certificate fast-tracked in 48 hours.",
                DIRECT: "Expedited 48-hour priority processing request drafted for Regional Revenue Office submission.",
                STATUTORY: "Formal administrative petition requesting priority issuance of Annexure-IV certification prior to statutory closing.",
              },
              actionableBullets: [
                "Enclose prior-year tax return and university enrollment proof.",
                "Cites October 31 statutory deadline for priority queue routing.",
              ],
              audioScript: "We have drafted an expedited request letter to fast-track your certified income verification within 48 hours.",
              autoDraftedArtifact: {
                artifactType: "APPLICATION_LETTER",
                title: "EXPEDITED REVENUE ATTESTATION REQUEST",
                bodyContent: `TO: THE REGIONAL REVENUE VERIFICATION OFFICER\nSUBJECT: URGENT ISSUANCE OF INCOME ATTESTATION FOR NATIONAL FELLOWSHIP (DEADLINE: OCT 31)\n\nRespectfully,\nI am a 1st-year Engineering undergraduate applying for the National Technical Fellowship under Gazette Notification F.24-9/2026-TS.III. Kindly issue my certified familial income attestation (Verified Gross Income: USD 42,000.00) on an expedited basis prior to the statutory closing date of October 31.\n\nEnclosures: 1. Tax Transcript  2. Government ID  3. University Matriculation Letter`,
              },
            },
          },
        },
        {
          id: "node-03",
          indexLabel: "03",
          category: "EXECUTION_PAYLOAD",
          status: "READY",
          confidenceScore: 98,
          estimatedMinutes: 10,
          dependencies: ["node-01", "node-02"],
          tiers: {
            tier1_eli10: {
              headline: "Get Your University Dean's Stamp & Lock Your Application",
              summary: "Take our 1-page cover memo to your University Registrar, get their digital L1 approval clicked, and submit all 3 PDFs before October 31.",
              registerVariants: {
                PLAIN: "Hand this sheet to your college office so they click 'Approve' on your scholarship.",
                DIRECT: "Final Step: Obtain University L1 Nodal approval using the attached cover manifest.",
                STATUTORY: "Execute Institute-Level L1 Nodal Officer verification prior to October 31 portal lock.",
              },
              actionableBullets: [
                "Get the Bonafide Student Certificate stamped at the Registrar's office.",
                "Click 'Final Lock & Submit' on the fellowship portal before October 31.",
              ],
              audioScript: "Final step: get your university registrar's stamp on the bonafide sheet and lock your portal submission before October 31.",
              autoDraftedArtifact: {
                artifactType: "APPLICATION_LETTER",
                title: "University Registrar Bonafide Request",
                bodyContent: "Dear University Nodal Officer,\nPlease sign and verify my Level-1 Bonafide Student Certificate in the Fellowship Portal so my application can advance to final disbursement.",
              },
            },
            tier2_executive: {
              headline: "Institute-Level L1 Nodal Verification Protocol",
              summary: "Following applicant upload, the University Nodal Officer must execute L1 digital verification on the portal before Federal L2 merit disbursement.",
              registerVariants: {
                PLAIN: "Your college has to approve your uploaded files online before the money is sent.",
                DIRECT: "Pipeline Gate: Applicant Upload -> University L1 Sign-off -> Federal L2 Direct Deposit.",
                STATUTORY: "Mandatory two-tier institutional verification workflow per Section 6.1 Disbursement Protocol.",
              },
              actionableBullets: [
                "Deliver physical dossier copy to your University Financial Aid Nodal Officer.",
                "Track L1 -> L2 -> ACH Direct Benefit Transfer status.",
              ],
              audioScript: "Ensure your University Nodal Officer completes Level 1 portal verification immediately after your online upload.",
              autoDraftedArtifact: {
                artifactType: "CHECKLIST_PROTOCOL",
                title: "L1-to-Disbursement Execution Pipeline",
                bodyContent: "STEP 1: Applicant Portal Upload & Lock\nSTEP 2: University L1 Digital Verification\nSTEP 3: Federal L2 Merit Scrub\nSTEP 4: Direct ACH Disbursement ($10,000)",
              },
            },
            tier3_autoExecute: {
              headline: "Complete Submission Packet & Nodal Officer Cover Memo",
              summary: "Ready-to-print cover dossier for your University Nodal Officer containing your verified document manifest and statutory compliance checklist.",
              registerVariants: {
                PLAIN: "Print this cover page and staple it to your forms so your college approves it immediately.",
                DIRECT: "Turnkey L1 Verification Cover Memo ready for physical printout and Registrar sign-off.",
                STATUTORY: "Formal Institutional L1 Verification Dossier Manifest compliant with Directive F.24-9/2026-TS.III.",
              },
              actionableBullets: [
                "Print in Swiss Receipt mode and clip to your physical certificates.",
                "Eliminates administrative back-and-forth with university staff.",
              ],
              audioScript: "Your complete submission cover memo and verification packet are ready for one-click printing.",
              autoDraftedArtifact: {
                artifactType: "APPLICATION_LETTER",
                title: "UNIVERSITY NODAL OFFICER (L1) VERIFICATION MEMO",
                bodyContent: `MEMORANDUM FOR L1 INSTITUTIONAL NODAL VERIFICATION\nSCHEME: NATIONAL TECHNICAL MERIT FELLOWSHIP 2026\n\nATTACHED VERIFIED MANIFEST:\n[x] 1. Certified Revenue Income Attestation ($42,000 <= $65,000 Cap)\n[x] 2. Accredited 1st-Year Engineering Matriculation & Fee Receipt\n[x] 3. Direct-Deposit Routing Verification Slip\n[x] 4. Signed Annexure-IV Non-Concurrent Stipend Declaration\n\nRequesting immediate L1 Digital Signature forwarding on Fellowship Portal.`,
              },
            },
          },
        },
      ],
    },
  },
  tenancy: {
    id: "tenancy",
    label: "Commercial & Student Co-Living Lease Indemnity Deed",
    tag: "LEGAL CONTRACT // 22 CLAUSES",
    sampleVoiceIntent:
      "The landlord wrote an 11-month lock-in with 100% security deposit forfeiture plus a 2-month penalty even if the roof leaks. Is this enforceable and how do I counter it?",
    rawDocumentSnippet: `SECTION 14.3 (LIQUIDATED DAMAGES & FORFEITURE): Notwithstanding anything contained herein, in the event the Lessee vacates the Demised Premises prior to the expiration of the 11-month Lock-In Period for any cause whatsoever, including uninhabitable structural seepage, the Lessor shall unconditionally forfeit 100% of the Security Deposit (equivalent to 3 months' license fee) PLUS levy an additional 2-month structural restoration surcharge without prior arbitral adjudication.`,
    fallbackPayload: {
      dossierId: "DOS-2026-LEG-02",
      title: "Co-Living Lease Indemnity & Deposit Audit",
      domainTag: "CONTRACT_LAW // TENANCY_PROTECTION",
      sourceComplexityScore: 95,
      bridgedClarityScore: 98,
      rawJargonCount: 81,
      estimatedTimeSavedMinutes: 180,
      telemetryLog: [
        {
          stepIndex: "T-01",
          phaseName: "PREDATORY_SCAN",
          rawTokenSample: "forfeit 100% Security Deposit + 2-month surcharge",
          resolvedMeaning: "Unlawful double-penalty trap (5 months total rent forfeiture)",
          latencyMs: 16,
        },
        {
          stepIndex: "T-02",
          phaseName: "STATUTORY_CHECK",
          rawTokenSample: "Unconscionable Liquidated Damages Doctrine",
          resolvedMeaning: "Penalties exceeding actual reasonable loss are legally unenforceable",
          latencyMs: 21,
        },
        {
          stepIndex: "T-03",
          phaseName: "REDLINE_SYNTHESIS",
          rawTokenSample: "including uninhabitable structural seepage",
          resolvedMeaning: "Drafting Habitability Carve-Out & 30-Day Mutual Notice Rider",
          latencyMs: 18,
        },
      ],
      globalSummary: {
        PLAIN: "DANGER IN SECTION 14.3: The landlord can take 5 months of rent if you leave early—even if the ceiling collapses or leaks. Do not sign until you replace Section 14.3 with our protective rider.",
        DIRECT: "CRITICAL CONTRACT TRAP (Sec 14.3): Imposes a 5-month punitive forfeiture (3-mo deposit + 2-mo surcharge) and waives landlord habitability duties. Send our Redline Addendum before signing.",
        STATUTORY: "Section 14.3 constitutes an unenforceable punitive penalty clause contrary to established liquidated damages doctrine and statutory implied warranty of habitability.",
      },
      eligibilityChecklist: [
        {
          id: "LEG-01",
          criterion: "Cap security deposit strictly at 2 months' rent (Standard Tenancy Benchmark)",
          isMetByDefault: false,
          clauseReference: "SEC 14.3",
        },
        {
          id: "LEG-02",
          criterion: "Insert 30-day mutual notice exit after an initial 3-month lock-in period",
          isMetByDefault: false,
          clauseReference: "SEC 14.3(a)",
        },
      ],
      nodes: [
        {
          id: "node-01",
          indexLabel: "01",
          category: "RISK_TRAP",
          status: "CRITICAL_ACTION",
          confidenceScore: 99,
          estimatedMinutes: 10,
          dependencies: [],
          tiers: {
            tier1_eli10: {
              headline: "Trap: Leaving Early Costs You 5 Months of Rent",
              summary: "If you move out before 11 months—even if the apartment floods or has severe mold—the landlord wants to keep your 3-month deposit AND charge 2 extra months of rent.",
              registerVariants: {
                PLAIN: "If you leave early for any reason, the landlord takes 5 months of rent. Never sign this as-is.",
                DIRECT: "5-Month Penalty Trap detected in Sec 14.3. Demands full 11-month lock-in even during structural failure.",
                STATUTORY: "Clause 14.3 imposes cumulative deposit forfeiture plus a 2-month restoration levy while waiving constructive eviction defenses.",
              },
              actionableBullets: [
                "Never sign an 11-month lock-in that forces you to pay even if the unit becomes unlivable.",
                "Counter with a 3-month initial lock-in followed by a standard 30-day notice period.",
              ],
              audioScript: "Warning! This lease lets the landlord take 5 months of rent if you leave early, even if the room is damaged. Do not sign without changing Section 14.3.",
              autoDraftedArtifact: {
                artifactType: "LEGAL_COUNTER_NOTICE",
                title: "Direct Message to Landlord / Leasing Agent",
                bodyContent: "Hi! I am ready to move forward with the apartment, but Section 14.3 has an 11-month lock-in with a 5-month penalty. Let's update that to a standard 3-month lock-in with 30 days' notice thereafter.",
              },
            },
            tier2_executive: {
              headline: "Unenforceable Double-Forfeiture & Habitability Waiver",
              summary: "Section 14.3 combines total deposit forfeiture with a 2-month restoration surcharge and waives landlord habitability obligations—violating statutory protections against punitive liquidated damages.",
              registerVariants: {
                PLAIN: "Charging double penalties and forcing you to live in a leaking room is legally invalid.",
                DIRECT: "Sec 14.3 violates statutory habitability warranties and liquidated damages caps. Strike out immediately.",
                STATUTORY: "Cumulative forfeiture + surcharge exceeds reasonable pre-estimate of loss; waiver of structural habitability is void against public policy.",
              },
              actionableBullets: [
                "Strike out 'including uninhabitable structural seepage' immediately.",
                "Limit wear-and-tear deductions strictly to itemized third-party repair invoices.",
              ],
              audioScript: "Section 14.3 violates contract law by imposing punitive double liquidated damages and waiving habitability.",
              autoDraftedArtifact: {
                artifactType: "LEGAL_COUNTER_NOTICE",
                title: "Executive Redline Audit Points",
                bodyContent: "1. DELETE: 11-month absolute lock-in & 2-month restoration surcharge.\n2. INSERT: 3-month lock-in + 30-day mutual termination notice.\n3. INSERT: Immediate penalty-free exit if structural seepage goes unrepaired for 7 days.",
              },
            },
            tier3_autoExecute: {
              headline: "Substitute Legal Addendum Clause (Ready to Paste)",
              summary: "Drop-in replacement legal text for Section 14.3 enforcing a 3-month lock-in, habitability protections, and instant security deposit refund upon key handover.",
              registerVariants: {
                PLAIN: "Copy and paste this exact paragraph into the lease to replace the unfair rule.",
                DIRECT: "Drop-in Replacement Section 14.3 drafted. Caps lock-in at 90 days and mandates 100% deposit refund.",
                STATUTORY: "Formal Protective Lease Rider amending Section 14.3 to enforce mutual termination symmetry and habitability remedies.",
              },
              actionableBullets: [
                "Send directly to the landlord or broker to replace Section 14.3 before execution.",
                "Mandates full deposit refund upon key handover without arbitrary surcharges.",
              ],
              audioScript: "Tier 3 Auto-Execute ready. Copy our replacement Section 14.3 addendum and send it to your landlord to neutralize the deposit trap.",
              autoDraftedArtifact: {
                artifactType: "LEGAL_COUNTER_NOTICE",
                title: "REPLACEMENT CLAUSE 14.3 (PROTECTIVE TENANCY RIDER)",
                bodyContent: `AMENDED SECTION 14.3 (LOCK-IN & DEPOSIT REFUND):\n"The initial Lock-In Period shall be strictly three (3) months from commencement. Thereafter, either Party may terminate this Agreement by serving thirty (30) days' written notice. In the event of structural seepage, utility failure, or uninhabitability persisting beyond seven (7) days, the Lessee may terminate immediately with full 100% refund of the Security Deposit upon key handover, payable via instant bank transfer without arbitrary restoration surcharges."`,
              },
            },
          },
        },
      ],
    },
  },
  architecture: {
    id: "architecture",
    label: "Distributed Payment Webhook Idempotency RFC-09",
    tag: "SYSTEM SPEC // P0 INCIDENT",
    sampleVoiceIntent:
      "Webhook retries are causing double balance deductions for customers during peak load. Turn this RFC into clear root-cause steps and a drop-in production code fix.",
    rawDocumentSnippet: `RFC-09 SECTION 3.1 (AT-LEAST-ONCE DELIVERY & SERIALIZABLE ISOLATION): Upstream payment gateway dispatches asynchronous webhook payloads with exponential backoff upon HTTP >299 or socket timeout (>3000ms). Because the downstream ledger mutation handler executes non-atomic read-then-write balance decrements prior to committing the idempotency token in Redis, concurrent retry threads induce race-condition double-debits under peak p99 latency.`,
    fallbackPayload: {
      dossierId: "DOS-2026-SYS-03",
      title: "Payment Webhook Idempotency & Race Fix",
      domainTag: "DISTRIBUTED_SYSTEMS // FINTECH_CORE",
      sourceComplexityScore: 97,
      bridgedClarityScore: 100,
      rawJargonCount: 73,
      estimatedTimeSavedMinutes: 210,
      telemetryLog: [
        {
          stepIndex: "T-01",
          phaseName: "RACE_DETECTION",
          rawTokenSample: "non-atomic read-then-write prior to Redis commit",
          resolvedMeaning: "Two webhook retries pass the check at the exact same millisecond",
          latencyMs: 11,
        },
        {
          stepIndex: "T-02",
          phaseName: "LOCK_SYNTHESIS",
          rawTokenSample: "SET NX EX + PostgreSQL ON CONFLICT DO NOTHING",
          resolvedMeaning: "Atomic idempotency lock + DB unique constraint generated",
          latencyMs: 17,
        },
      ],
      globalSummary: {
        PLAIN: "WHY USERS GET CHARGED TWICE: Your server takes over 3 seconds to reply, so the payment gateway sends a second copy of the same charge while the first one is still running. Both copies charge the user. Fix: Stamp every payment ID in the database first so duplicates are blocked at the door.",
        DIRECT: "ROOT CAUSE: Non-atomic read-then-write race condition under >3000ms webhook timeouts. REMEDIATION: Enforce PostgreSQL \`INSERT ... ON CONFLICT DO NOTHING\` on \`event_id\` + single-statement atomic balance decrement.",
        STATUTORY: "Violation of serializable isolation under at-least-once webhook delivery semantics; concurrent worker threads bypass post-hoc Redis token commits during p99 latency spikes.",
      },
      eligibilityChecklist: [
        {
          id: "SYS-01",
          criterion: "Enforce UNIQUE constraint on `webhook_event_id` in PostgreSQL ledger table",
          isMetByDefault: true,
          clauseReference: "RFC 3.1",
        },
        {
          id: "SYS-02",
          criterion: "Acknowledge webhook with HTTP 202 within <250ms before heavy downstream tasks",
          isMetByDefault: true,
          clauseReference: "RFC 3.4",
        },
      ],
      nodes: [
        {
          id: "node-01",
          indexLabel: "01",
          category: "EXECUTION_PAYLOAD",
          status: "CRITICAL_ACTION",
          confidenceScore: 100,
          estimatedMinutes: 15,
          dependencies: [],
          tiers: {
            tier1_eli10: {
              headline: "Why Users Are Charged Twice (And How to Stop It)",
              summary: "Imagine a cashier pressing 'Charge Card' twice because the terminal froze for 3 seconds. We fix this by checking the receipt number at the very beginning—if that receipt number was already used, we ignore the duplicate.",
              registerVariants: {
                PLAIN: "Give every payment a unique ticket number at the front door so duplicate messages get ignored.",
                DIRECT: "Block duplicate webhook retries at ingress using a unique event ID lock before touching user balances.",
                STATUTORY: "Enforce ingress idempotency deduplication prior to executing ledger state mutations.",
              },
              actionableBullets: [
                "Record every incoming payment webhook's unique `event_id` before touching balances.",
                "Reply '200 OK' to the payment gateway in under 250ms so it stops re-sending.",
              ],
              audioScript: "Your server is slow to reply, so the payment gateway sends the same charge twice. Lock every unique event ID at the gate so duplicates are ignored.",
              autoDraftedArtifact: {
                artifactType: "SYSTEM_SCRIPT",
                title: "3-Step Duplicate Blocker Logic",
                bodyContent: "1. Insert unique `event_id` into database first.\n2. If `event_id` already exists -> stop immediately and return 200 OK.\n3. If new -> deduct balance once inside the same database transaction.",
              },
            },
            tier2_executive: {
              headline: "Atomic Idempotency Gate & Single-Statement Ledger Mutation",
              summary: "Replace read-then-write application logic with an atomic PostgreSQL transaction combining `INSERT ... ON CONFLICT DO NOTHING` and an in-place `UPDATE accounts SET balance = balance - $1`.",
              registerVariants: {
                PLAIN: "Combine the duplicate check and the balance deduction into one unbreakable database step.",
                DIRECT: "Replace app-level balance math with a single transactional Postgres upsert + atomic decrement.",
                STATUTORY: "Implement transactional idempotency locking via `ON CONFLICT DO NOTHING` paired with atomic row-level ledger mutation.",
              },
              actionableBullets: [
                "Eliminates race conditions between concurrent retry worker threads.",
                "Reduces p99 webhook acknowledgement latency from 3,200ms to 18ms.",
              ],
              audioScript: "Replace non-atomic read-then-write logic with a single PostgreSQL serializable upsert and atomic balance decrement.",
              autoDraftedArtifact: {
                artifactType: "SYSTEM_SCRIPT",
                title: "Architectural Remediation Checklist",
                bodyContent: "1. Redis SET NX lock (TTL 60s)\n2. Postgres UNIQUE index on processed_webhooks(event_id)\n3. Atomic SQL decrement (zero application-memory balance math)",
              },
            },
            tier3_autoExecute: {
              headline: "Production TypeScript + PostgreSQL Idempotent Webhook Handler",
              summary: "Drop-in Next.js / Node.js production patch enforcing atomic idempotency locking and zero-race balance deduction.",
              registerVariants: {
                PLAIN: "Copy and paste this finished code into your server to stop double charges permanently.",
                DIRECT: "Production-ready TypeScript + SQL transaction patch ready for immediate deployment.",
                STATUTORY: "RFC-09 compliant transactional webhook handler enforcing exactly-once ledger mutation semantics.",
              },
              actionableBullets: [
                "Copy-paste directly into your payment webhook route handler.",
                "Guaranteed zero double-debits even under 1,000 concurrent retries.",
              ],
              audioScript: "Tier 3 Auto-Execute ready. Production TypeScript and SQL patch generated for immediate deployment.",
              autoDraftedArtifact: {
                artifactType: "SYSTEM_SCRIPT",
                title: "patch-idempotent-webhook.ts",
                bodyContent: `// PRODUCTION IDEMPOTENT WEBHOOK HANDLER (RFC-09 COMPLIANT)
export async function handlePaymentWebhook(db: Pool, eventId: string, userId: string, amountCents: number) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    // 1. Atomic Idempotency Gate: blocks concurrent duplicate threads instantly
    const lockRes = await client.query(
      \`INSERT INTO processed_webhooks (event_id, created_at)
       VALUES ($1, NOW()) ON CONFLICT (event_id) DO NOTHING RETURNING event_id\`,
      [eventId]
    );
    if (lockRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return { status: 200, message: 'IDEMPOTENT_NO_OP_ALREADY_PROCESSED' };
    }
    // 2. Atomic In-Place Balance Mutation (Zero Read-Then-Write Race)
    await client.query(
      \`UPDATE accounts SET balance_cents = balance_cents - $1 WHERE user_id = $2 AND balance_cents >= $1\`,
      [amountCents, userId]
    );
    await client.query('COMMIT');
    return { status: 200, message: 'LEDGER_COMMITTED_EXACTLY_ONCE' };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}`,
              },
            },
          },
        },
      ],
    },
  },
};
