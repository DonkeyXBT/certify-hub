import type { TaskPriority } from "@prisma/client"

export interface CertificationTaskTemplate {
  title: string
  description: string
  priority: TaskPriority
  phase: number // 1=foundation, 2=implementation, 3=evidence, 4=audit-prep
}

export const CERTIFICATION_TASKS: Record<string, CertificationTaskTemplate[]> = {
  // ─── ISO 27001:2022 ─────────────────────────────────────────────────────────
  ISO27001: [
    // Phase 1: Foundation & Governance
    {
      title: "Define the ISMS scope and boundaries",
      description:
        "Document the scope of your Information Security Management System. Identify which business units, locations, information assets, and technologies are included. Consider external/internal issues (clause 4.1) and interested party requirements (clause 4.2). Produce a formal ISMS Scope Statement document and get management sign-off.",
      priority: "HIGH",
      phase: 1,
    },
    {
      title: "Draft and approve the Information Security Policy",
      description:
        "Write a top-level information security policy that includes: commitment to satisfying applicable requirements, commitment to continual improvement of the ISMS, and a framework for setting information security objectives. Have top management formally sign off. Communicate the policy to all employees and make it available to interested parties.",
      priority: "HIGH",
      phase: 1,
    },
    {
      title: "Assign ISMS roles and responsibilities",
      description:
        "Appoint an ISMS Manager or Information Security Officer. Define and document responsibilities for: risk owners, asset owners, process owners, and the management representative. Ensure top management demonstrates leadership and commitment per clause 5. Create an RACI matrix for all ISMS activities.",
      priority: "HIGH",
      phase: 1,
    },
    {
      title: "Conduct an information asset inventory",
      description:
        "Identify and catalogue all information assets: data stores, hardware, software, cloud services, personnel, facilities, and third-party services. Assign an owner to each asset. Classify assets by sensitivity level (e.g., public, internal, confidential, restricted). Record results in a formal asset register.",
      priority: "HIGH",
      phase: 1,
    },
    {
      title: "Perform a comprehensive risk assessment",
      description:
        "Define a risk assessment methodology (e.g., qualitative 5x5 matrix). Identify threats and vulnerabilities for each information asset. Assess likelihood and impact for each risk scenario. Calculate risk levels and compare against the risk acceptance criteria. Document all identified risks in the risk register. This satisfies clause 6.1.2.",
      priority: "CRITICAL",
      phase: 1,
    },
    {
      title: "Create the risk treatment plan",
      description:
        "For each risk above the acceptable threshold, select a treatment option: mitigate, transfer, avoid, or accept. Map each treatment action to the relevant Annex A controls. Document justifications, timelines, and responsible persons. Obtain management approval for all residual risks. This satisfies clause 6.1.3.",
      priority: "CRITICAL",
      phase: 1,
    },
    {
      title: "Produce the Statement of Applicability (SoA)",
      description:
        "List all 93 Annex A controls from ISO 27001:2022. For each control, state whether it is applicable or not applicable and provide justification. For applicable controls, reference the current implementation status (implemented, partially implemented, planned). This is a mandatory certification document.",
      priority: "HIGH",
      phase: 1,
    },

    // Phase 2: Policy & Procedure Implementation
    {
      title: "Write an Access Control policy and procedure",
      description:
        "Define who gets access to what, based on business need and least privilege. Cover: user registration and deregistration, access provisioning, privileged access management, password/authentication policy, and periodic access reviews. Map to Annex A controls A.5.15\u2013A.5.18 and A.8.2\u2013A.8.5. Get the policy approved and communicate to all staff.",
      priority: "HIGH",
      phase: 2,
    },
    {
      title: "Establish an Incident Management procedure",
      description:
        "Document how security incidents are reported, triaged, investigated, contained, eradicated, and recovered from. Define severity levels, escalation paths, communication protocols, and evidence preservation steps. Include post-incident review requirements. Map to Annex A controls A.5.24\u2013A.5.28. Train the incident response team.",
      priority: "HIGH",
      phase: 2,
    },
    {
      title: "Create a Business Continuity and Disaster Recovery plan",
      description:
        "Conduct a business impact analysis (BIA) to identify critical processes. Define recovery time objectives (RTO) and recovery point objectives (RPO) for each. Document backup procedures, failover processes, and continuity test schedules. Map to Annex A controls A.5.29\u2013A.5.30 and A.8.13\u2013A.8.14. Test the plan at least annually.",
      priority: "HIGH",
      phase: 2,
    },
    {
      title: "Implement a Change Management procedure",
      description:
        "Define how changes to information systems, infrastructure, and processes are requested, risk-assessed, approved, implemented, tested, and reviewed. Include rollback procedures and emergency change processes. Map to Annex A control A.8.32. Ensure all changes are logged and traceable.",
      priority: "MEDIUM",
      phase: 2,
    },
    {
      title: "Develop a Supplier Security Management process",
      description:
        "Create criteria for evaluating supplier security posture. Include information security requirements in all supplier contracts and SLAs. Establish a periodic supplier review cadence (at least annually). Maintain a supplier risk register. Map to Annex A controls A.5.19\u2013A.5.23.",
      priority: "MEDIUM",
      phase: 2,
    },
    {
      title: "Define a Human Resources security lifecycle",
      description:
        "Document security requirements for the full employment lifecycle: pre-employment screening and background checks, onboarding (security awareness training, acceptable use agreement signing), during employment (ongoing training, disciplinary process for violations), and offboarding (access revocation, asset return, NDA reminders). Map to Annex A controls A.6.1\u2013A.6.8.",
      priority: "MEDIUM",
      phase: 2,
    },
    {
      title: "Establish Physical and Environmental security controls",
      description:
        "Define physical security perimeters and entry controls for offices, data centres, and secure areas. Address equipment security, power supply protection, cabling security, and secure disposal/reuse of equipment. Document clean desk and clear screen rules. Map to Annex A controls A.7.1\u2013A.7.14.",
      priority: "MEDIUM",
      phase: 2,
    },

    // Phase 3: Evidence Collection & Monitoring
    {
      title: "Deploy security awareness training for all staff",
      description:
        "Create or procure a security awareness training program covering: phishing recognition, password hygiene, social engineering, data handling procedures, and incident reporting. All employees must complete initial training within 30 days and annual refreshers. Track completion rates and maintain records as evidence.",
      priority: "HIGH",
      phase: 3,
    },
    {
      title: "Set up security monitoring and logging",
      description:
        "Configure centralized log collection (SIEM or equivalent) for all critical systems: firewalls, servers, endpoints, cloud services, and applications. Define which events to log (authentication, access, configuration changes, errors). Set log retention periods (minimum 12 months). Establish alerting rules for suspicious activities. Map to Annex A controls A.8.15\u2013A.8.16.",
      priority: "HIGH",
      phase: 3,
    },
    {
      title: "Collect and organize evidence for all implemented controls",
      description:
        "For each applicable Annex A control, gather evidence of implementation: policy documents, screenshots of configurations, system exports, training records, meeting minutes, audit logs, and vendor agreements. Organize evidence by control number in the evidence repository. Ensure evidence is dated and attributable.",
      priority: "HIGH",
      phase: 3,
    },
    {
      title: "Perform a vulnerability assessment and penetration test",
      description:
        "Conduct a technical vulnerability scan of all in-scope systems, networks, and applications. Commission an external penetration test for internet-facing services. Document all findings with severity ratings. Remediate critical and high vulnerabilities and record evidence of remediation. Map to Annex A control A.8.8.",
      priority: "MEDIUM",
      phase: 3,
    },

    // Phase 4: Audit Preparation
    {
      title: "Conduct a full internal audit of the ISMS",
      description:
        "Plan and execute an internal audit covering all ISO 27001 clauses (4\u201310) and all applicable Annex A controls. Use auditors who are independent of the areas being audited. Document the audit plan, audit checklist, findings (conformities, minor/major nonconformities, observations), and the final audit report. This is mandatory per clause 9.2.",
      priority: "CRITICAL",
      phase: 4,
    },
    {
      title: "Hold a Management Review meeting",
      description:
        "Conduct a formal management review with top management. The agenda must include: internal audit results, status of risk treatment actions, information security performance metrics, feedback from interested parties, nonconformities and corrective actions, opportunities for improvement, and any changes that could affect the ISMS. Document meeting minutes and all decisions. Mandatory per clause 9.3.",
      priority: "CRITICAL",
      phase: 4,
    },
    {
      title: "Address all nonconformities with corrective actions",
      description:
        "For each nonconformity identified during the internal audit: react to contain the issue, perform root cause analysis (e.g., 5 Whys, Ishikawa), define and implement corrective actions, verify effectiveness after implementation, and update the risk assessment if needed. Document everything in the CAPA register. Mandatory per clause 10.2.",
      priority: "HIGH",
      phase: 4,
    },
    {
      title: "Prepare the Stage 1 audit documentation package",
      description:
        "Compile all mandatory documents for the certification body's Stage 1 review: ISMS scope statement, information security policy, risk assessment methodology and results, risk treatment plan, Statement of Applicability, internal audit report, management review minutes, corrective action records, and evidence of staff training. Schedule the Stage 1 audit with the certification body.",
      priority: "HIGH",
      phase: 4,
    },
  ],

  // ─── NIS2 Directive (EU 2022/2555) ──────────────────────────────────────────
  NIS2: [
    // Phase 1: Governance & Compliance Mapping
    {
      title: "Determine your NIS2 entity classification",
      description:
        "Review Annexes I and II of the NIS2 Directive to determine if your organization is an essential entity (energy, transport, health, banking, digital infrastructure, ICT service management, public administration, space) or an important entity (postal services, waste management, chemicals, food, manufacturing, digital providers, research). Your classification determines the supervisory regime and maximum penalties.",
      priority: "CRITICAL",
      phase: 1,
    },
    {
      title: "Register with the national competent authority",
      description:
        "Identify the designated competent authority and CSIRT in each EU Member State where you operate. Complete entity registration with required information: entity name, address, sector/sub-sector, contact details, IP ranges, and list of Member States where services are provided. Verify compliance with national transposition deadlines.",
      priority: "HIGH",
      phase: 1,
    },
    {
      title: "Appoint a cybersecurity governance body",
      description:
        "Per Article 20, management bodies must approve and oversee cybersecurity risk-management measures. Formally assign cybersecurity governance to a board-level committee or designated management body. Ensure members undergo regular cybersecurity training. Document accountability and decision-making authority. Management can be held personally liable for non-compliance.",
      priority: "HIGH",
      phase: 1,
    },
    {
      title: "Map all network and information systems for essential services",
      description:
        "Create a comprehensive inventory of all network and information systems used to provide your essential or important services. Document: system architecture, data flows, interconnections, third-party dependencies, and single points of failure. This inventory is foundational for all subsequent risk assessment activities.",
      priority: "HIGH",
      phase: 1,
    },

    // Phase 2: Risk Management Measures (Article 21)
    {
      title: "Implement a risk analysis and information system security policy",
      description:
        "Per Article 21(2)(a), develop and approve a formal risk analysis methodology. Conduct a comprehensive risk assessment of your network and information systems covering all services in scope. Document a security policy addressing: asset management, access control, encryption, network security, and secure development. Review and update at least annually or after significant incidents.",
      priority: "CRITICAL",
      phase: 2,
    },
    {
      title: "Establish an incident handling procedure",
      description:
        "Per Article 21(2)(b), create a formal incident handling process covering: detection and monitoring, initial analysis and triage, containment and eradication, recovery and restoration, and post-incident lessons learned. Define severity levels and escalation criteria. Ensure alignment with the Article 23 notification timelines. Train incident response staff and conduct regular tabletop exercises.",
      priority: "HIGH",
      phase: 2,
    },
    {
      title: "Set up business continuity and crisis management",
      description:
        "Per Article 21(2)(c), establish business continuity management including: business impact analysis for essential services, backup management with tested restoration procedures, disaster recovery plans with defined RTOs/RPOs, and crisis management procedures. Test recovery procedures at least annually. Document lessons learned from tests.",
      priority: "HIGH",
      phase: 2,
    },
    {
      title: "Implement supply chain security measures",
      description:
        "Per Article 21(2)(d), assess security risks in your entire supply chain including ICT service providers. Include security clauses in all supplier contracts. Monitor supplier compliance with security requirements. Address sector-specific supply chain vulnerabilities identified by cooperation groups. Maintain a register of critical suppliers and their risk assessments.",
      priority: "HIGH",
      phase: 2,
    },
    {
      title: "Establish vulnerability handling and disclosure processes",
      description:
        "Per Article 21(2)(e), implement secure acquisition, development, and maintenance practices for network and information systems. Establish a coordinated vulnerability disclosure (CVD) policy. Monitor for published CVEs affecting your technology stack. Define patching timelines by severity: critical within 48 hours, high within 1 week, medium within 1 month.",
      priority: "MEDIUM",
      phase: 2,
    },
    {
      title: "Deploy cybersecurity training and basic cyber hygiene practices",
      description:
        "Per Article 21(2)(g), implement mandatory cybersecurity awareness training for all personnel. Provide specialized training for management bodies per Article 20(2). Cover: phishing recognition, password security, multi-factor authentication usage, secure communications, social engineering defences, and data handling. Track completion and refresh annually.",
      priority: "HIGH",
      phase: 2,
    },
    {
      title: "Implement cryptography and encryption controls",
      description:
        "Per Article 21(2)(h), establish policies and procedures for the use of cryptography and encryption. Cover: encryption of data at rest and in transit, key management lifecycle (generation, distribution, storage, rotation, destruction), certificate management, and approved cryptographic algorithms. Ensure compliance with current best practices (e.g., AES-256, TLS 1.3).",
      priority: "MEDIUM",
      phase: 2,
    },
    {
      title: "Implement access control and asset management policies",
      description:
        "Per Article 21(2)(i), define human resources security requirements, access control policies, and asset management procedures. Implement: role-based access control, least privilege principle, periodic access reviews (quarterly for privileged accounts), secure onboarding and offboarding, and asset lifecycle management. Maintain evidence of all access reviews.",
      priority: "HIGH",
      phase: 2,
    },
    {
      title: "Deploy multi-factor authentication and secure communications",
      description:
        "Per Article 21(2)(j), implement multi-factor authentication or continuous authentication for all critical systems and remote access. Deploy secured voice, video, and text communication solutions for sensitive discussions. Establish secured emergency communication channels that function independently of primary systems.",
      priority: "HIGH",
      phase: 2,
    },

    // Phase 3: Incident Notification Readiness
    {
      title: "Build the Article 23 incident notification workflow",
      description:
        "Implement the mandatory multi-phase notification process: (1) Early warning to CSIRT within 24 hours of becoming aware of a significant incident, (2) Incident notification within 72 hours with initial assessment, severity, and impact, (3) Final report within one month with root cause, mitigation, and cross-border impact. Create templates for each phase. Define internal triggers, responsible persons, and approval chains. Conduct a tabletop notification exercise.",
      priority: "CRITICAL",
      phase: 3,
    },
    {
      title: "Assess and document proportionality of cybersecurity measures",
      description:
        "Per Article 21(3), conduct and document a proportionality analysis ensuring your measures are appropriate to: your entity's degree of exposure to risks, your entity's size, the likelihood and severity of potential incidents, and the societal and economic impact. This documented analysis must demonstrate that your investment in security is commensurate with the risks.",
      priority: "HIGH",
      phase: 3,
    },

    // Phase 4: Supervision Preparation
    {
      title: "Prepare evidence package for supervisory authority inspections",
      description:
        "Compile comprehensive evidence of all Article 21 measures for potential: on-site inspections, off-site supervisions, targeted security audits, and ad hoc inspections triggered by incidents. Organize documentation by article reference. Ensure rapid access to all policies, procedures, risk assessments, incident logs, supplier assessments, training records, and audit reports. Essential entities face proactive supervision; important entities face reactive supervision after incidents.",
      priority: "MEDIUM",
      phase: 4,
    },
  ],

  // ─── ISO 9001:2015 ──────────────────────────────────────────────────────────
  ISO9001: [
    // Phase 1: QMS Foundation
    {
      title: "Define the QMS scope and create a process map",
      description:
        "Determine the boundaries and applicability of your Quality Management System. Identify all processes needed for the QMS: core processes (that deliver value to customers), support processes (that enable core processes), and management processes (that govern the system). Create a process interaction map showing inputs, outputs, and interdependencies (use turtle diagrams or SIPOC). Document any scope exclusions with justification. Satisfies clauses 4.3 and 4.4.",
      priority: "HIGH",
      phase: 1,
    },
    {
      title: "Draft and approve the Quality Policy",
      description:
        "Top management must establish a quality policy that: is appropriate to the organization's purpose and context, includes a commitment to satisfy applicable requirements, includes a commitment to continual improvement of the QMS, and provides a framework for setting quality objectives. Have it formally approved and signed by top management. Communicate it to all employees and make it available to relevant interested parties. Satisfies clause 5.2.",
      priority: "HIGH",
      phase: 1,
    },
    {
      title: "Establish measurable quality objectives",
      description:
        "Set quality objectives at relevant functions, levels, and processes. Each objective must be: measurable, consistent with the quality policy, relevant to product/service conformity and customer satisfaction, monitored and communicated. For each objective, document: what will be done, what resources are needed, who is responsible, the target completion date, and how results will be evaluated. Satisfies clause 6.2.",
      priority: "HIGH",
      phase: 1,
    },
    {
      title: "Assign QMS roles, responsibilities, and authorities",
      description:
        "Define and communicate responsibilities for: QMS process ownership, quality objectives achievement, customer focus champion, management representative duties (reporting QMS performance to top management, promoting customer focus awareness). Create an organizational chart and RACI matrix. Ensure top management retains overall QMS accountability. Satisfies clause 5.3.",
      priority: "HIGH",
      phase: 1,
    },
    {
      title: "Conduct a context and interested party analysis",
      description:
        "Identify internal issues: organizational culture, knowledge, governance, performance capabilities. Identify external issues: legal/regulatory, technological, competitive, market, cultural, social, economic. List all interested parties: customers, regulators, suppliers, employees, shareholders, community. For each interested party, document their relevant requirements and determine which ones become obligations of the QMS. Satisfies clauses 4.1 and 4.2.",
      priority: "MEDIUM",
      phase: 1,
    },
    {
      title: "Perform a risks and opportunities assessment for the QMS",
      description:
        "Based on the context analysis (4.1) and interested party requirements (4.2), identify risks that could prevent the QMS from achieving its intended results, and opportunities for improvement. Plan actions to address each risk and opportunity. Integrate these actions into QMS processes. Define how to evaluate the effectiveness of actions taken. Satisfies clause 6.1.",
      priority: "HIGH",
      phase: 1,
    },

    // Phase 2: Operational Procedures
    {
      title: "Establish a customer communication procedure",
      description:
        "Define how your organization communicates with customers regarding: product and service information and inquiries, contracts and order handling (including amendments), customer feedback collection and complaints handling, handling of customer property, and specific requirements for contingency actions when relevant. Satisfies clause 8.2.1.",
      priority: "HIGH",
      phase: 2,
    },
    {
      title: "Document the design and development process",
      description:
        "If your organization designs products or services, document the full design and development lifecycle: planning (stages, reviews, verification, validation), inputs (functional and performance requirements, regulatory requirements, lessons from previous designs), controls (review, verification, and validation at appropriate stages), outputs (meet input requirements, are adequate for subsequent processes), and change management. Maintain complete design records. Satisfies clause 8.3.",
      priority: "MEDIUM",
      phase: 2,
    },
    {
      title: "Create a supplier management and procurement process",
      description:
        "Define criteria for evaluation, selection, performance monitoring, and re-evaluation of external providers. Determine the type and extent of control to apply based on the supplier's impact on your product/service quality. Include quality requirements in supplier contracts and purchase orders. Maintain records of supplier evaluations and performance. Satisfies clause 8.4.",
      priority: "MEDIUM",
      phase: 2,
    },
    {
      title: "Document production and service provision controls",
      description:
        "Ensure controlled conditions for all production and service provision: documented information defining product/service characteristics and activities to be performed, availability of suitable monitoring and measurement resources, competent personnel, process validation (for outputs that cannot be verified by subsequent monitoring), and implementation of actions to prevent human error. Satisfies clause 8.5.",
      priority: "HIGH",
      phase: 2,
    },
    {
      title: "Establish a control of nonconforming outputs procedure",
      description:
        "Document how nonconforming products, services, or process outputs are identified, controlled, and prevented from unintended use or delivery. Define dispositions: correction, segregation, containment, return to supplier, informing the customer, or obtaining authorization for acceptance under concession. Maintain records of all nonconformities, actions taken, and any concessions obtained. Satisfies clause 8.7.",
      priority: "HIGH",
      phase: 2,
    },
    {
      title: "Implement a document and record control system",
      description:
        "Establish a system for creating, updating, and controlling all QMS documented information. Define processes for: approval before issue, review and update as necessary, identification and version control, distribution and access control, storage and preservation, retention and disposition. Cover both internally-created documents and documents of external origin. Satisfies clause 7.5.",
      priority: "HIGH",
      phase: 2,
    },

    // Phase 3: Monitoring & Measurement
    {
      title: "Set up customer satisfaction measurement",
      description:
        "Implement methods to monitor customer perceptions of whether their needs and expectations have been fulfilled. Methods may include: customer satisfaction surveys, product/service quality data, market share analysis, compliments and complaints analysis, warranty claims, dealer reports, and direct customer communication. Analyse trends and report results at management reviews. Satisfies clause 9.1.2.",
      priority: "HIGH",
      phase: 3,
    },
    {
      title: "Calibrate and control monitoring and measurement equipment",
      description:
        "Identify all monitoring and measurement equipment needed to provide evidence of product/service conformity. Establish a calibration or verification schedule against traceable standards. Maintain calibration records including: equipment ID, calibration date, results, next calibration date, and calibration provider. Define actions when equipment is found to be out of calibration (assess validity of previous measurements). Satisfies clause 7.1.5.",
      priority: "MEDIUM",
      phase: 3,
    },
    {
      title: "Deploy a competence management and training program",
      description:
        "Determine the necessary competence for all persons doing work that affects quality performance and QMS effectiveness. Where current competence is insufficient, take actions: provide training, mentoring, reassignment, or hire competent persons. Evaluate the effectiveness of all training actions. Maintain documented evidence of competence: qualifications, training records, certifications, and performance evaluations. Satisfies clause 7.2.",
      priority: "HIGH",
      phase: 3,
    },

    // Phase 4: Audit & Continual Improvement
    {
      title: "Conduct a full internal audit of the QMS",
      description:
        "Plan and execute internal audits at planned intervals covering all QMS processes and ISO 9001 requirements. Define audit criteria, scope, frequency, and methods. Select auditors who are objective and impartial (independent of the area being audited). Report findings to relevant management. Track corrective actions through to closure and verify effectiveness. Maintain complete audit records. Satisfies clause 9.2.",
      priority: "CRITICAL",
      phase: 4,
    },
    {
      title: "Conduct a Management Review meeting",
      description:
        "Hold a formal management review with top management covering all required inputs: status of actions from previous reviews, changes in internal/external issues, QMS performance and effectiveness (customer satisfaction, quality objectives, process performance, nonconformities and corrective actions, monitoring and measurement results, audit results, supplier performance), resource adequacy, risk and opportunity actions effectiveness, and improvement opportunities. Document all decisions and action items. Satisfies clause 9.3.",
      priority: "CRITICAL",
      phase: 4,
    },
    {
      title: "Implement corrective actions for all nonconformities",
      description:
        "For each nonconformity from audits, customer complaints, or process failures: (1) React to control and correct it, (2) Evaluate the need for action to eliminate the root cause, (3) Determine the root cause using appropriate methods (5 Whys, fishbone diagram, etc.), (4) Implement corrective action, (5) Review effectiveness, (6) Update risks and opportunities if needed. Maintain complete CAPA records. Satisfies clause 10.2.",
      priority: "HIGH",
      phase: 4,
    },
    {
      title: "Compile the certification audit documentation package",
      description:
        "Prepare all required documented information for the certification body's Stage 1 review: quality policy, quality objectives and evidence of achievement, QMS scope with justification for any exclusions, process interaction map, all mandatory procedures and records, internal audit programme and reports, management review minutes, corrective action log with status, and evidence of customer satisfaction monitoring. Schedule the Stage 1 (documentation review) audit with the certification body.",
      priority: "HIGH",
      phase: 4,
    },
  ],
}
