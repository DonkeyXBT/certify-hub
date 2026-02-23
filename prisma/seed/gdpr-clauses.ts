import { PrismaClient } from "@prisma/client"

// ---------------------------------------------------------------------------
// GDPR -- General Data Protection Regulation (EU) 2016/679
// ---------------------------------------------------------------------------

export async function seedGDPR(prisma: PrismaClient) {
  const framework = await prisma.framework.upsert({
    where: { code: "GDPR" },
    update: {
      name: "GDPR",
      version: "2016/679",
      status: "PUBLISHED",
    },
    create: {
      code: "GDPR",
      name: "GDPR",
      version: "2016/679",
      description:
        "General Data Protection Regulation — European Union regulation on data protection and privacy for individuals within the EU and EEA.",
      status: "PUBLISHED",
    },
  })

  const fwId = framework.id

  // Delete existing clauses so the seed is idempotent
  await prisma.clause.deleteMany({ where: { frameworkId: fwId } })

  interface ControlDef {
    number: string
    title: string
    objective: string
    guidance: string
  }

  interface ClauseDef {
    number: string
    title: string
    description: string
    category: string
    controls: ControlDef[]
  }

  const chapters: ClauseDef[] = [
    // ── Chapter II: Principles (Articles 5-11) ──────────────────────────
    {
      number: "II",
      title: "Principles",
      description:
        "Principles relating to processing of personal data, lawfulness, fairness, transparency, purpose limitation, data minimisation, accuracy, storage limitation, integrity, confidentiality and accountability.",
      category: "Principles",
      controls: [
        {
          number: "Art.5",
          title: "Principles relating to processing of personal data",
          objective:
            "Ensure personal data is processed lawfully, fairly and transparently; collected for specified, explicit and legitimate purposes; adequate, relevant and limited to what is necessary; accurate and kept up to date; kept no longer than necessary; and processed with appropriate security.",
          guidance:
            "- Document every processing activity in a central register, mapping each activity to one or more of the six data-protection principles.\n- Implement a data-minimisation review for every new project or feature that collects personal data, requiring sign-off before launch.\n- Establish a scheduled accuracy check (at least annually) where data subjects are prompted to review and update their personal data.\n- Define and enforce retention periods per data category, with automated deletion or anonymisation when the retention period expires.\n- Deploy encryption at rest and in transit for all personal data stores, and log access to demonstrate integrity and confidentiality.\n- Maintain an accountability file containing policies, training records, DPIA reports, and audit results to demonstrate compliance on request.",
        },
        {
          number: "Art.6",
          title: "Lawfulness of processing",
          objective:
            "Ensure processing is lawful by establishing at least one legal basis: consent, contract, legal obligation, vital interests, public interest, or legitimate interests.",
          guidance:
            "- For each processing activity, formally document the chosen legal basis in the Record of Processing Activities (ROPA) before processing begins.\n- Where legitimate interest is relied upon, conduct and document a Legitimate Interest Assessment (LIA) that weighs the controller's interests against the data subject's rights.\n- Implement a consent management platform that captures, timestamps, and stores proof of consent, including the specific purpose and version of the privacy notice shown.\n- Review legal bases annually or when processing purposes change, updating records and privacy notices accordingly.\n- Train all staff who handle personal data on the six lawful bases and when each applies, with refresher training at least once per year.",
        },
        {
          number: "Art.7",
          title: "Conditions for consent",
          objective:
            "Ensure the controller can demonstrate that the data subject has consented to processing, that the request for consent is presented clearly and distinctly, and that consent can be withdrawn at any time.",
          guidance:
            "- Design consent forms using plain language with a separate, unticked opt-in checkbox for each distinct processing purpose -- never bundle consent with terms of service acceptance.\n- Store immutable consent records that capture the identity of the data subject, the timestamp, the exact wording presented, and the method of consent (e.g. web form, paper).\n- Provide a clearly visible and easily accessible mechanism for withdrawing consent (e.g. a one-click unsubscribe link or account settings toggle) that is as simple as giving consent.\n- Audit consent records quarterly to verify they are complete, that withdrawn consents have been actioned, and that no processing continues without a valid basis.\n- When updating privacy notices or consent wording, re-obtain consent from affected data subjects rather than relying on prior consent for new or changed purposes.",
        },
        {
          number: "Art.8",
          title: "Conditions applicable to child's consent",
          objective:
            "Ensure processing of a child's personal data is lawful only where the child is at least 16 years old, or consent is given by the holder of parental responsibility.",
          guidance:
            "- Implement an age-verification gate at the point of data collection that asks the user's date of birth or age bracket before accepting personal data.\n- Where the user is under the applicable age threshold (16, or lower if set by the member state), present a parental-consent workflow that requires a verifiable action from the parent or guardian.\n- Store evidence of parental consent separately, including the parent's identity, method of verification, and timestamp.\n- Review age-gate and parental-consent mechanisms at least annually for effectiveness, updating them as technology and regulatory guidance evolve.\n- Train customer-facing and product teams on the requirements specific to children's data so that new features are designed with these safeguards from the outset.",
        },
        {
          number: "Art.9",
          title: "Processing of special categories of personal data",
          objective:
            "Prohibit processing of special categories of data (racial/ethnic origin, political opinions, religious beliefs, genetic data, biometric data, health data, sex life/orientation) unless a specific exemption applies.",
          guidance:
            "- Maintain a special-category data inventory that identifies every system and process handling sensitive data, the applicable exemption, and the responsible data owner.\n- Apply heightened access controls to special-category data, restricting access to only those personnel with a documented need and enforcing multi-factor authentication.\n- Where explicit consent is the relied-upon exemption, use a separate, purpose-specific consent flow that clearly names the special category involved and allows granular withdrawal.\n- Conduct a Data Protection Impact Assessment before initiating any new processing of special-category data, and document mitigation measures.\n- Encrypt special-category data with dedicated encryption keys, and store it in logically or physically segregated databases to reduce the blast radius of any breach.",
        },
        {
          number: "Art.10",
          title: "Processing of personal data relating to criminal convictions",
          objective:
            "Ensure processing of personal data relating to criminal convictions and offences is carried out only under the control of official authority or when authorised by law.",
          guidance:
            "- Identify and document every processing activity that involves criminal-conviction or offence data, and record the specific legal authorisation that permits each activity.\n- Restrict access to criminal-records data to a named set of authorised personnel, enforced through role-based access controls and audit logging.\n- Store criminal-conviction data in a segregated and encrypted data store with retention periods aligned to the authorising law, and automate deletion once the retention period expires.\n- Include criminal-conviction data handling in your annual GDPR compliance audit, verifying that no unauthorised processing has occurred and that legal bases remain valid.",
        },
        {
          number: "Art.11",
          title: "Processing which does not require identification",
          objective:
            "Where purposes do not require identification of a data subject, the controller shall not be obliged to maintain additional information solely to identify the data subject.",
          guidance:
            "- Audit data stores to identify datasets where the processing purpose does not require linking data back to an identifiable individual, and flag them for anonymisation or pseudonymisation.\n- Implement technical measures (e.g. hashing, tokenisation, aggregation) to strip direct identifiers from data that does not need to be personally identifiable.\n- Document in the ROPA which processing activities fall under Art.11, noting that data-subject rights under Arts 15-20 may not apply when identification is not possible.\n- Where a data subject provides additional information to enable identification in order to exercise their rights, process that additional information only for the purpose of fulfilling the request.\n- Review anonymisation techniques annually to confirm they remain effective against re-identification risks given advances in technology.",
        },
      ],
    },

    // ── Chapter III: Rights of the data subject (Articles 12-23) ────────
    {
      number: "III",
      title: "Rights of the data subject",
      description:
        "Transparency, information, access, rectification, erasure, restriction of processing, data portability, right to object, and automated decision-making rights.",
      category: "Data Subject Rights",
      controls: [
        {
          number: "Art.12",
          title: "Transparent information, communication and modalities",
          objective:
            "Provide information relating to processing in a concise, transparent, intelligible and easily accessible form, using clear and plain language.",
          guidance:
            "- Publish a layered privacy notice on your website: a short summary with key points up front, linked to a detailed version covering all required information.\n- Write all privacy communications at a reading level accessible to your audience, avoiding legal jargon; test readability with tools such as the Flesch-Kincaid scale.\n- Provide privacy information in the same language(s) in which your service is offered, and ensure notices are accessible to users with disabilities (e.g. screen-reader compatible).\n- Establish a documented process to respond to data-subject requests within one month, with a mechanism to extend by two months for complex requests and a template for notifying the data subject of the extension.\n- Review and update all public-facing privacy communications at least annually, or immediately when processing activities change.",
        },
        {
          number: "Art.13",
          title: "Information to be provided where data is collected from the data subject",
          objective:
            "At the time personal data is obtained, provide the data subject with identity of the controller, purposes and legal basis for processing, recipients, transfer information, retention period, and data subject rights.",
          guidance:
            "- Present a just-in-time privacy notice at every data-collection point (web form, mobile screen, paper form) that includes the controller's identity, contact details, and DPO contact.\n- Clearly state the specific purpose and legal basis for each piece of data collected, directly adjacent to the collection field or in a linked notice visible before submission.\n- List all categories of recipients (including processors and third parties) and disclose any planned international transfers along with the safeguard mechanism used.\n- State the retention period or the criteria used to determine it, and inform the data subject of their rights to access, rectification, erasure, restriction, portability, and objection.\n- Automate delivery of these notices so they cannot be bypassed, and version-control the notice text so you can demonstrate what was shown at any given point in time.",
        },
        {
          number: "Art.14",
          title: "Information to be provided where data has not been obtained from the data subject",
          objective:
            "Within a reasonable period after obtaining data from other sources, provide the data subject with the required information including the source of the personal data.",
          guidance:
            "- Maintain a register of all data sources from which personal data is obtained indirectly (e.g. third-party data brokers, public registers, partner organisations) including the categories of data received.\n- Send a proactive notification to data subjects within one month of obtaining their data (or at first communication if the data will be used for contact), containing all Art.14 required information.\n- Include the source of the personal data and whether it came from publicly accessible sources, so the data subject can verify and contest accuracy.\n- Create standardised notification templates for each indirect data source that pre-populate the required information fields, reducing the risk of omissions.\n- Track delivery and acknowledgement of these notifications, and document any exemptions relied upon (e.g. disproportionate effort) with a justification and a public privacy notice as a fallback.",
        },
        {
          number: "Art.15",
          title: "Right of access by the data subject",
          objective:
            "Ensure data subjects can obtain confirmation as to whether personal data is being processed, access to the data, and information about the processing.",
          guidance:
            "- Build a self-service data-access portal (or documented manual process) that allows data subjects to submit a Subject Access Request (SAR) and receive their data in a commonly used electronic format.\n- Implement an identity-verification step for SARs that is proportionate to the sensitivity of the data, preventing unauthorised disclosure while not creating unnecessary barriers.\n- Compile responses that include all required supplementary information: purposes, categories of data, recipients, retention periods, rights, source of data, and automated decision-making details.\n- Set up internal SLA tracking so that SARs are acknowledged within 48 hours and fulfilled within one calendar month, with escalation procedures for complex requests.\n- Provide the first copy of the data free of charge; document a reasonable fee schedule for additional copies and communicate it transparently in the SAR acknowledgement.",
        },
        {
          number: "Art.16",
          title: "Right to rectification",
          objective:
            "Ensure data subjects have the right to obtain rectification of inaccurate personal data and completion of incomplete personal data.",
          guidance:
            "- Provide data subjects with a clear channel (e.g. account settings page, dedicated form, or email address) to request corrections to their personal data.\n- Upon receiving a rectification request, verify the data subject's identity, then correct the data in all primary and backup systems within one month.\n- Notify all recipients to whom the inaccurate data was previously disclosed of the rectification, in line with Art.19.\n- Log every rectification action including the original value, the corrected value, the date of change, and the identity of the person who performed the correction.\n- Where rectification is refused (e.g. the data is already accurate), inform the data subject in writing of the reasons and their right to lodge a complaint with the supervisory authority.",
        },
        {
          number: "Art.17",
          title: "Right to erasure ('right to be forgotten')",
          objective:
            "Ensure data subjects can obtain the erasure of personal data when data is no longer necessary, consent is withdrawn, the subject objects, data was unlawfully processed, or erasure is required by law.",
          guidance:
            "- Develop and maintain a data-deletion procedure that maps every system and backup where personal data resides, ensuring erasure requests propagate to all locations including third-party processors.\n- Implement an automated or semi-automated erasure workflow triggered by a verified request, with status tracking visible to the handling team and confirmation sent to the data subject upon completion.\n- Where data has been made public, take reasonable steps to inform other controllers processing the data that the data subject has requested erasure of any links, copies, or replications.\n- Document the grounds under which erasure may be refused (e.g. legal obligation to retain, freedom of expression, public health, archiving in the public interest, legal claims) and communicate the specific ground to the data subject when a request is declined.\n- Test the erasure process at least annually with simulated requests to confirm data is fully removed from production systems, backups, and analytics pipelines within the documented timeframe.",
        },
        {
          number: "Art.18",
          title: "Right to restriction of processing",
          objective:
            "Ensure data subjects can restrict processing when accuracy is contested, processing is unlawful, the controller no longer needs the data, or the subject has objected to processing.",
          guidance:
            "- Implement a technical mechanism (e.g. a status flag or dedicated restricted-data store) that halts all processing of the affected data except storage, while the restriction is in place.\n- Define clear internal procedures for each restriction trigger: accuracy dispute, unlawful processing, controller no longer needs data, and pending objection verification.\n- Notify the data subject before lifting any restriction, giving them the opportunity to respond or take further action.\n- Communicate the restriction to all recipients to whom the data was disclosed, in compliance with Art.19.\n- Log all restriction events with timestamps, the reason for restriction, and the date and rationale for any subsequent lifting of the restriction.",
        },
        {
          number: "Art.19",
          title: "Notification obligation regarding rectification or erasure",
          objective:
            "Communicate any rectification, erasure, or restriction of processing to each recipient to whom personal data has been disclosed.",
          guidance:
            "- Maintain an up-to-date register of all recipients (internal teams, processors, third parties) to whom personal data has been disclosed, linked to each data category and data subject.\n- Automate recipient notifications where possible by integrating rectification, erasure, and restriction events with downstream systems via APIs or message queues.\n- Use standardised notification templates that include the data subject identifier (pseudonymised if appropriate), the action taken, and the effective date.\n- Track acknowledgement of notifications from each recipient and follow up if confirmation is not received within a defined timeframe.\n- Upon request from the data subject, provide a list of the recipients who have been notified of the rectification, erasure, or restriction.",
        },
        {
          number: "Art.20",
          title: "Right to data portability",
          objective:
            "Ensure data subjects can receive their personal data in a structured, commonly used and machine-readable format and have the right to transmit that data to another controller.",
          guidance:
            "- Implement a data-export function that generates the data subject's personal data in a structured, commonly used, machine-readable format such as JSON, CSV, or XML.\n- Ensure the export includes all data provided by the data subject (both actively provided and observed data) that is processed on the basis of consent or contract.\n- Where technically feasible, offer a direct controller-to-controller transfer mechanism (e.g. an API endpoint) to transmit the data to another controller at the data subject's request.\n- Make the data-export feature easily discoverable in the user interface (e.g. account settings) and fulfil requests within one month.\n- Test the portability export regularly to verify completeness, format validity, and that it does not inadvertently include data belonging to other data subjects.",
        },
        {
          number: "Art.21",
          title: "Right to object",
          objective:
            "Ensure data subjects can object at any time to processing of personal data based on public interest or legitimate interests, including profiling.",
          guidance:
            "- Present the right to object explicitly and separately from other information at the point of first communication with the data subject and in the privacy notice.\n- Provide a straightforward mechanism (e.g. an unsubscribe link, account setting, or web form) for data subjects to register an objection, and cease the contested processing immediately upon receipt.\n- Where the objection relates to direct marketing (including profiling for direct marketing), stop processing without exception and confirm cessation to the data subject.\n- For objections to other processing, document and assess whether there are compelling legitimate grounds that override the data subject's interests, and communicate the outcome with reasoning within one month.\n- Log all objections, the assessment performed, the decision, and the date processing was stopped or the justification for continuing, to maintain an auditable record.",
        },
        {
          number: "Art.22",
          title: "Automated individual decision-making, including profiling",
          objective:
            "Ensure data subjects have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects or similarly significantly affects them.",
          guidance:
            "- Inventory all automated decision-making processes and profiling activities, classifying each by whether it produces legal or similarly significant effects on individuals.\n- For each solely-automated decision that falls under Art.22, implement at least one safeguard: the right to obtain human intervention, the right to express a point of view, and the right to contest the decision.\n- Provide meaningful information about the logic involved, the significance, and the envisaged consequences of the processing in the privacy notice and upon individual request.\n- Ensure that automated decisions involving special-category data are only made with explicit consent or where necessary for substantial public interest, with suitable safeguards in place.\n- Conduct regular bias and accuracy audits on automated decision-making models, document the results, and remediate any identified discriminatory outcomes.",
        },
      ],
    },

    // ── Chapter IV: Controller and processor (Articles 24-43) ───────────
    {
      number: "IV",
      title: "Controller and processor",
      description:
        "Obligations of controllers and processors including data protection by design and by default, records of processing, security of processing, data breach notification, DPIA, and DPO.",
      category: "Controller & Processor Obligations",
      controls: [
        {
          number: "Art.24",
          title: "Responsibility of the controller",
          objective:
            "Implement appropriate technical and organisational measures to ensure and demonstrate that processing is performed in accordance with the GDPR.",
          guidance:
            "- Establish a data-protection governance framework with defined roles, responsibilities, and reporting lines up to senior management.\n- Adopt and enforce internal data-protection policies covering data collection, storage, access, sharing, retention, and deletion.\n- Implement technical controls (access management, encryption, logging) and organisational controls (training, procedures, audits) proportionate to the risk profile of each processing activity.\n- Conduct periodic compliance reviews (at least annually) against GDPR requirements, documenting findings and remediation actions with deadlines.\n- Maintain evidence of compliance measures (policies, training records, audit reports, DPIA results) in a centralised accountability file available for supervisory authority inspection.",
        },
        {
          number: "Art.25",
          title: "Data protection by design and by default",
          objective:
            "Implement appropriate technical and organisational measures designed to implement data-protection principles and integrate safeguards into processing, both at the time of design and by default.",
          guidance:
            "- Integrate a privacy-by-design checklist into your software development lifecycle (SDLC) and project initiation process, requiring sign-off before development begins.\n- Configure default settings on all products and services to the most privacy-friendly option (e.g. minimal data collection, no optional tracking enabled, shortest retention).\n- Apply pseudonymisation and data minimisation techniques at the architecture level, ensuring that only necessary data fields are collected and stored.\n- Conduct threat modelling and privacy reviews during the design phase of new systems or significant changes, involving the DPO or privacy team.\n- Document design decisions that implement data-protection principles and retain them as part of the project record to demonstrate compliance.",
        },
        {
          number: "Art.26",
          title: "Joint controllers",
          objective:
            "Where two or more controllers jointly determine the purposes and means of processing, transparently determine their respective responsibilities for compliance.",
          guidance:
            "- Execute a written joint-controller agreement that clearly allocates responsibilities for each GDPR obligation, including responding to data-subject requests, providing privacy notices, and managing breaches.\n- Make the essence of the joint-controller arrangement available to data subjects, regardless of the internal allocation of responsibilities.\n- Designate a single contact point for data subjects to exercise their rights, and ensure requests are routed to the responsible party as defined in the agreement.\n- Review the joint-controller arrangement whenever the processing purposes, means, or parties change, and update the agreement accordingly.\n- Maintain audit trails showing which controller performed which obligation, to resolve any disputes and demonstrate compliance to supervisory authorities.",
        },
        {
          number: "Art.27",
          title: "Representatives of controllers or processors not established in the Union",
          objective:
            "Designate in writing a representative in the Union where the controller or processor is not established in the Union but processes data of EU data subjects.",
          guidance:
            "- Assess whether your organisation falls within the territorial scope of GDPR (Art.3(2)) by reviewing whether you offer goods or services to, or monitor the behaviour of, EU data subjects.\n- If in scope, formally appoint an EU representative in writing, selecting a natural or legal person established in one of the member states where the data subjects are located.\n- Publish the representative's contact details in your privacy notice and ensure they are provided to data subjects and supervisory authorities upon request.\n- Empower the representative with access to relevant processing records and the authority to act as a liaison with supervisory authorities on your behalf.\n- Review the appointment annually to confirm the representative remains available, adequately resourced, and established in an appropriate member state.",
        },
        {
          number: "Art.28",
          title: "Processor",
          objective:
            "Ensure processing by a processor is governed by a contract or legal act that binds the processor to the controller and sets out the subject-matter, duration, nature and purpose of processing.",
          guidance:
            "- Execute a Data Processing Agreement (DPA) with every processor before any personal data is shared, covering all mandatory Art.28(3) clauses: subject matter, duration, nature and purpose, data types, categories of data subjects, and obligations.\n- Include clauses requiring the processor to process data only on documented instructions, ensure personnel confidentiality, implement appropriate security measures, assist with data-subject requests, and delete or return data upon termination.\n- Require processors to obtain prior written authorisation before engaging sub-processors, and ensure the same data-protection obligations are imposed on sub-processors.\n- Conduct due diligence on processors before engagement (security certifications, audit reports, breach history) and perform periodic audits or request audit reports to verify ongoing compliance.\n- Maintain a central register of all processors and sub-processors, including the data processed, the DPA version in effect, and the date of the last compliance review.",
        },
        {
          number: "Art.29",
          title: "Processing under the authority of the controller or processor",
          objective:
            "Ensure any person acting under the authority of the controller or processor who has access to personal data does not process it except on instructions from the controller.",
          guidance:
            "- Implement role-based access controls so that employees and contractors can only access the personal data necessary for their assigned tasks.\n- Include data-protection obligations and confidentiality clauses in employment contracts and contractor agreements, referencing the requirement to act only on documented instructions.\n- Provide mandatory onboarding training and annual refresher training on data-handling procedures, emphasising that personal data must only be processed in accordance with the controller's documented instructions.\n- Maintain audit logs of data access and processing activities, and review them periodically to detect any unauthorised or instruction-deviating processing.",
        },
        {
          number: "Art.30",
          title: "Records of processing activities",
          objective:
            "Maintain a record of processing activities under the controller's or processor's responsibility, including purposes, categories of data, recipients, transfers, retention, and security measures.",
          guidance:
            "- Create and maintain a Record of Processing Activities (ROPA) for every processing activity, capturing: controller/processor name, purposes, data categories, data-subject categories, recipients, international transfers, retention periods, and a general description of security measures.\n- Assign a data owner to each processing activity who is responsible for keeping the ROPA entry accurate and up to date.\n- Use a centralised tool or register (spreadsheet, GRC platform, or dedicated privacy tool) to manage ROPA entries, enabling easy search, export, and reporting.\n- Review each ROPA entry at least annually or whenever the processing activity changes, and obtain sign-off from the data owner confirming accuracy.\n- Ensure the ROPA is available in writing (including electronic form) and can be produced promptly upon request from the supervisory authority.",
        },
        {
          number: "Art.31",
          title: "Cooperation with the supervisory authority",
          objective:
            "Cooperate, on request, with the supervisory authority in the performance of its tasks.",
          guidance:
            "- Designate a primary point of contact (typically the DPO) responsible for receiving and coordinating responses to supervisory authority enquiries.\n- Maintain readily accessible documentation (ROPA, DPIAs, breach records, policies) that can be shared with the supervisory authority within a reasonable timeframe upon request.\n- Establish an internal escalation procedure for supervisory authority communications, ensuring legal counsel and senior management are notified promptly.\n- Train relevant staff on how to handle supervisory authority inspections or information requests, including preserving evidence and avoiding obstruction.\n- Log all interactions with supervisory authorities, including requests received, responses sent, and timelines, to maintain a complete cooperation record.",
        },
        {
          number: "Art.32",
          title: "Security of processing",
          objective:
            "Implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk, including pseudonymisation, encryption, confidentiality, integrity, availability, resilience, and regular testing.",
          guidance:
            "- Conduct a risk assessment for each processing activity to determine the appropriate level of security, considering the nature, scope, context, and purposes of processing as well as the risks to data subjects.\n- Implement encryption of personal data both at rest and in transit using industry-standard algorithms and key-management practices.\n- Apply pseudonymisation where feasible to reduce risk, ensuring that the additional information needed for re-identification is kept separately under strict access controls.\n- Establish and test business-continuity and disaster-recovery plans to ensure the ability to restore availability and access to personal data in a timely manner following a physical or technical incident.\n- Perform regular security testing (penetration tests, vulnerability scans, and security audits) at least annually and after significant system changes, and remediate identified vulnerabilities within defined SLAs.",
        },
        {
          number: "Art.33",
          title: "Notification of a personal data breach to the supervisory authority",
          objective:
            "Notify the supervisory authority of a personal data breach without undue delay and where feasible within 72 hours of becoming aware, unless the breach is unlikely to result in a risk to rights and freedoms.",
          guidance:
            "- Establish a breach-detection and response plan that defines what constitutes a breach, how to assess risk, and the roles responsible for escalation and notification.\n- Implement monitoring and alerting tools (SIEM, intrusion detection, DLP) to detect breaches promptly, and ensure 24/7 on-call coverage for incident response.\n- Create a breach-notification template pre-approved by legal that includes: nature of the breach, categories and approximate number of data subjects affected, DPO contact details, likely consequences, and measures taken or proposed to address the breach.\n- Document any decision not to notify the supervisory authority with a written risk assessment explaining why the breach is unlikely to result in a risk to rights and freedoms.\n- Conduct a post-incident review after every breach, update the response plan with lessons learned, and maintain a breach register recording all incidents regardless of whether notification was required.",
        },
        {
          number: "Art.34",
          title: "Communication of a personal data breach to the data subject",
          objective:
            "Communicate a personal data breach to the data subject without undue delay when the breach is likely to result in a high risk to their rights and freedoms.",
          guidance:
            "- Define criteria in your breach-response plan for determining when a breach is likely to result in a high risk to individuals (e.g. breach of unencrypted financial data, health data, or credentials).\n- Prepare communication templates in clear, plain language that describe the nature of the breach, the likely consequences, the measures taken to address it, and specific advice for the data subject to protect themselves.\n- Communicate directly and individually with affected data subjects using the most effective channel available (email, letter, phone), rather than relying solely on public notices.\n- Document the rationale if communication to data subjects is not required (e.g. data was encrypted, subsequent measures eliminate the high risk, or disproportionate effort applies with a public communication as a fallback).\n- Test the data-subject notification process periodically through breach simulations to ensure communications can be issued promptly and accurately.",
        },
        {
          number: "Art.35",
          title: "Data protection impact assessment",
          objective:
            "Carry out a data protection impact assessment where processing is likely to result in a high risk to the rights and freedoms of natural persons, particularly using new technologies.",
          guidance:
            "- Develop a DPIA screening checklist based on the Art.35(3) criteria and supervisory authority guidance to determine when a DPIA is required (e.g. systematic monitoring, large-scale processing of special categories, automated decision-making).\n- Follow a structured DPIA methodology that includes: a systematic description of the processing, assessment of necessity and proportionality, identification and assessment of risks to data subjects, and identification of measures to mitigate those risks.\n- Involve the DPO in the DPIA process and seek input from data subjects or their representatives where appropriate.\n- Document the DPIA outcome, including the risk assessment, mitigation measures, and the decision to proceed, modify, or halt the processing, and obtain sign-off from a senior accountable owner.\n- Review the DPIA whenever the processing changes materially or when new risks are identified, and retain all DPIA records as part of the accountability file.",
        },
        {
          number: "Art.36",
          title: "Prior consultation",
          objective:
            "Consult the supervisory authority prior to processing where a data protection impact assessment indicates that the processing would result in a high risk in the absence of mitigating measures.",
          guidance:
            "- Incorporate a prior-consultation trigger into the DPIA process: if residual risk remains high after all feasible mitigations, escalate to the DPO and legal team for supervisory authority consultation.\n- Prepare a consultation submission that includes the DPIA report, the purposes and means of processing, safeguards and measures implemented, DPO contact details, and any other information requested by the authority.\n- Engage with the supervisory authority promptly and cooperatively, providing any additional information they request within the specified timeframes.\n- Do not commence the high-risk processing until the supervisory authority has provided its advice or the statutory response period has elapsed.\n- Document the supervisory authority's response, any conditions or recommendations imposed, and the actions taken to address them before proceeding with the processing.",
        },
        {
          number: "Art.37",
          title: "Designation of the data protection officer",
          objective:
            "Designate a data protection officer where processing is carried out by a public authority, core activities require regular and systematic monitoring of data subjects on a large scale, or core activities involve large scale processing of special categories of data.",
          guidance:
            "- Assess whether your organisation is required to appoint a DPO based on the three mandatory criteria (public authority, large-scale systematic monitoring, large-scale special-category processing), and document the assessment even if a DPO is not required.\n- Where a DPO is required, appoint an individual with expert knowledge of data protection law and practices, either as an employee or under a service contract.\n- Publish the DPO's contact details and communicate them to the supervisory authority.\n- Ensure the DPO is accessible to data subjects and supervisory authorities, and can be reached through a dedicated and monitored communication channel.\n- If a group of undertakings appoints a single DPO, ensure the DPO is easily accessible from each establishment and has the capacity to serve all entities effectively.",
        },
        {
          number: "Art.38",
          title: "Position of the data protection officer",
          objective:
            "Ensure the DPO is involved in all issues relating to the protection of personal data, is provided with necessary resources, does not receive instructions regarding the exercise of their tasks, and reports directly to the highest management level.",
          guidance:
            "- Establish formal procedures requiring that the DPO is consulted at the earliest stage on all data-protection matters, including new projects, policy changes, and breach investigations.\n- Allocate a dedicated budget and resources (staff, tools, training, external legal support) to the DPO function, proportionate to the organisation's size and processing activities.\n- Protect the DPO's independence by ensuring they do not receive instructions on how to carry out their tasks and cannot be dismissed or penalised for performing their duties.\n- Ensure the DPO reports directly to the highest management level (e.g. the board or CEO) and has a standing invitation to relevant governance and risk committees.\n- Avoid assigning the DPO additional tasks or duties that would result in a conflict of interest (e.g. the DPO should not also serve as head of IT, HR, or marketing).",
        },
        {
          number: "Art.39",
          title: "Tasks of the data protection officer",
          objective:
            "Ensure the DPO informs and advises the controller/processor, monitors compliance, provides advice on DPIAs, cooperates with the supervisory authority, and acts as a contact point.",
          guidance:
            "- Define and document the DPO's tasks in a formal role description, covering at minimum: informing and advising, monitoring compliance, advising on DPIAs, cooperating with the supervisory authority, and acting as a contact point.\n- Establish a schedule for the DPO to conduct compliance monitoring activities, including policy reviews, processing audits, and training effectiveness assessments.\n- Require the DPO to provide written advice on all DPIAs and maintain a log of DPIA consultations and recommendations.\n- Facilitate the DPO's role as the primary contact point for the supervisory authority by ensuring they receive copies of all regulatory correspondence and have authority to respond.\n- Have the DPO present a periodic compliance report (at least annually) to senior management, summarising the state of data protection, risks identified, and recommended actions.",
        },
        {
          number: "Art.40",
          title: "Codes of conduct",
          objective:
            "Encourage the drawing up of codes of conduct intended to contribute to the proper application of the GDPR, taking account of the specific features of the various processing sectors.",
          guidance:
            "- Identify industry associations or sector bodies that have developed approved GDPR codes of conduct relevant to your processing activities, and evaluate them for adoption.\n- Where adopting a code of conduct, formally commit to adherence, implement its requirements, and register with the designated monitoring body.\n- Use adherence to an approved code of conduct as a mechanism to demonstrate compliance with specific GDPR obligations (e.g. Art.28 processor requirements, Art.46 international transfers).\n- Monitor updates to adopted codes of conduct and adjust internal practices promptly when the code is amended.\n- If no suitable code exists for your sector, consider collaborating with industry peers and the relevant supervisory authority to develop one, addressing the specific processing characteristics of your sector.",
        },
        {
          number: "Art.42",
          title: "Certification",
          objective:
            "Encourage the establishment of data protection certification mechanisms, seals and marks for the purpose of demonstrating compliance with the GDPR.",
          guidance:
            "- Evaluate available GDPR certification schemes (e.g. EuroPriSe, approved national schemes) to determine which are relevant and valuable for your organisation's processing activities.\n- Prepare for certification by conducting an internal gap assessment against the certification criteria and remediating any deficiencies before the formal audit.\n- Engage an accredited certification body to perform the assessment, and provide full access to documentation, systems, and personnel as required.\n- Use the certification seal or mark in communications with data subjects, business partners, and supervisory authorities as evidence of compliance, while ensuring claims are accurate and up to date.\n- Schedule re-certification before the maximum three-year validity period expires, and maintain continuous compliance with the certification criteria between assessments through internal monitoring.",
        },
      ],
    },

    // ── Chapter V: Transfers of personal data to third countries (44-49) ─
    {
      number: "V",
      title: "Transfers of personal data to third countries or international organisations",
      description:
        "Rules governing the transfer of personal data to third countries or international organisations, including adequacy decisions, appropriate safeguards, and derogations.",
      category: "International Transfers",
      controls: [
        {
          number: "Art.44",
          title: "General principle for transfers",
          objective:
            "Ensure any transfer of personal data to a third country or international organisation takes place only if conditions in Chapter V are complied with.",
          guidance:
            "- Map all data flows that involve transfers of personal data outside the EEA, documenting the destination country, recipient entity, categories of data, and the transfer mechanism relied upon.\n- For each transfer, verify and document that a valid transfer mechanism is in place (adequacy decision, SCCs, BCRs, or a derogation) before the transfer commences.\n- Include transfer assessments as a mandatory step in the procurement and vendor-onboarding process for any supplier or partner located outside the EEA.\n- Review all international transfer mechanisms at least annually, or when there are changes in the legal landscape (e.g. invalidation of an adequacy decision), and update safeguards accordingly.\n- Maintain a central transfer register accessible to the DPO and legal team, linked to the ROPA, to provide a complete picture of international data flows.",
        },
        {
          number: "Art.45",
          title: "Transfers on the basis of an adequacy decision",
          objective:
            "Verify that transfers to third countries take place based on an adequacy decision by the European Commission, where the third country ensures an adequate level of protection.",
          guidance:
            "- Check the European Commission's current list of adequate countries before initiating any new transfer, and document the applicable adequacy decision reference for each destination.\n- Monitor the European Commission and EDPB communications for any changes to adequacy decisions (reviews, amendments, or revocations) that affect your transfers.\n- Where an adequacy decision covers transfers to a specific sector or under specific conditions (e.g. the EU-U.S. Data Privacy Framework), verify that the recipient is certified or otherwise within scope.\n- Document reliance on the adequacy decision in the ROPA and in your privacy notice's international transfers section.\n- Establish a contingency plan for each adequacy-based transfer in case the adequacy decision is invalidated, identifying alternative transfer mechanisms that could be deployed quickly.",
        },
        {
          number: "Art.46",
          title: "Transfers subject to appropriate safeguards",
          objective:
            "In the absence of an adequacy decision, ensure transfers are subject to appropriate safeguards such as standard contractual clauses, binding corporate rules, or approved codes of conduct.",
          guidance:
            "- For each transfer without an adequacy decision, select and implement an appropriate safeguard: Standard Contractual Clauses (SCCs), Binding Corporate Rules (BCRs), an approved code of conduct, or an approved certification mechanism.\n- When using SCCs, execute the correct module(s) from the European Commission's approved clauses (controller-to-controller, controller-to-processor, etc.) without modifying the core clauses.\n- Conduct a Transfer Impact Assessment (TIA) for each transfer to evaluate whether the laws of the destination country provide an essentially equivalent level of protection, and document supplementary measures if they do not.\n- Implement supplementary technical measures where the TIA identifies gaps (e.g. strong encryption where the importer cannot access keys, pseudonymisation, split processing).\n- Review and renew SCCs or other safeguards when the transfer circumstances change, when new EU guidance is issued, or at least every two years.",
        },
        {
          number: "Art.47",
          title: "Binding corporate rules",
          objective:
            "Where binding corporate rules are used, ensure they are legally binding, expressly confer enforceable rights on data subjects, and meet specific requirements regarding application, structure and content.",
          guidance:
            "- Draft BCRs that cover all required elements under Art.47(2): application, structure, contact details, data-protection principles, data-subject rights, mechanisms for ensuring compliance, complaint procedures, and cooperation with supervisory authorities.\n- Submit the BCRs for approval through the consistency mechanism, working with the lead supervisory authority and obtaining the opinion of the EDPB.\n- Make the BCRs legally binding on all members of the group of undertakings through internal corporate policies, intra-group agreements, or other enforceable instruments.\n- Train all group entities on the BCRs, ensuring employees understand their obligations and the rights conferred on data subjects, including the right to enforce the BCRs as third-party beneficiaries.\n- Conduct regular audits of BCR compliance across group entities, report the results to the lead supervisory authority as required, and update the BCRs when the group structure or processing activities change.",
        },
        {
          number: "Art.49",
          title: "Derogations for specific situations",
          objective:
            "Where no adequacy decision or appropriate safeguards exist, transfers may take place based on explicit consent, contractual necessity, important public interest, legal claims, vital interests, or from a public register.",
          guidance:
            "- Treat derogations as a last resort: first attempt to establish an adequate transfer mechanism under Art.45 or Art.46 before relying on any Art.49 derogation.\n- Where explicit consent is relied upon, ensure the data subject has been informed of the specific risks of the transfer due to the absence of an adequacy decision and appropriate safeguards, and that consent is freely given, specific, informed, and unambiguous.\n- For contract-based derogations, verify that the transfer is truly necessary for the performance of the contract and is not merely convenient, documenting the necessity assessment.\n- Limit the scope and frequency of derogation-based transfers, ensuring they are not used for systematic or large-scale transfers, which is not the intended purpose of Art.49.\n- Document each derogation-based transfer in the ROPA, including the specific derogation relied upon, the assessment of necessity, and the safeguards applied to protect the data subjects' rights.",
        },
      ],
    },
  ]

  let sortOrder = 0

  for (const chapter of chapters) {
    const parentClause = await prisma.clause.create({
      data: {
        frameworkId: fwId,
        number: chapter.number,
        title: chapter.title,
        description: chapter.description,
        isAnnex: false,
        sortOrder: sortOrder++,
      },
    })

    for (const ctrl of chapter.controls) {
      // Create a sub-clause for each article
      const clause = await prisma.clause.create({
        data: {
          frameworkId: fwId,
          parentId: parentClause.id,
          number: ctrl.number,
          title: ctrl.title,
          isAnnex: false,
          sortOrder: sortOrder++,
        },
      })

      await prisma.control.create({
        data: {
          clauseId: clause.id,
          number: ctrl.number,
          title: ctrl.title,
          category: chapter.category,
          objective: ctrl.objective,
          guidance: ctrl.guidance,
        },
      })
    }
  }

  const clauseCount = await prisma.clause.count({ where: { frameworkId: fwId } })
  const controlCount = await prisma.control.count({ where: { clause: { frameworkId: fwId } } })

  console.log(`[seed] GDPR seeded -- ${clauseCount} clauses, ${controlCount} controls`)
}
