import { PrismaClient } from "@prisma/client"

// ---------------------------------------------------------------------------
// NIS2 -- Directive (EU) 2022/2555 on measures for a high common level of
// cybersecurity across the Union
// ---------------------------------------------------------------------------

export async function seedNIS2(prisma: PrismaClient) {
  const framework = await prisma.framework.upsert({
    where: { code: "NIS2" },
    update: {
      name: "NIS2 Directive",
      version: "2022/2555",
      status: "PUBLISHED",
    },
    create: {
      code: "NIS2",
      name: "NIS2 Directive",
      version: "2022/2555",
      description:
        "Directive (EU) 2022/2555 on measures for a high common level of cybersecurity across the Union, repealing Directive (EU) 2016/1148 (NIS Directive).",
      status: "PUBLISHED",
    },
  })

  const fwId = framework.id

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
    // ── Chapter II: Coordinated cybersecurity frameworks ────────────────
    {
      number: "II",
      title: "Coordinated cybersecurity frameworks",
      description:
        "National cybersecurity strategies, competent authorities, CSIRTs, and coordinated vulnerability disclosure.",
      category: "Governance & Strategy",
      controls: [
        {
          number: "Art.7",
          title: "National cybersecurity strategy",
          objective:
            "Adopt a national cybersecurity strategy that defines strategic objectives, governance framework, policy framework for enhanced coordination, and identifies relevant assets and risks.",
          guidance:
            "- Review and map your organisation's activities against the national cybersecurity strategy of each Member State where you operate\n- Identify which strategic objectives and policy measures directly affect your entity's obligations\n- Align internal cybersecurity policies with the governance framework defined in the national strategy\n- Establish a liaison role or function responsible for tracking updates to the national strategy\n- Document how your risk management approach addresses the assets and risk categories identified in the strategy",
        },
        {
          number: "Art.8",
          title: "Competent authorities and single points of contact",
          objective:
            "Designate or establish one or more competent authorities responsible for cybersecurity and a single point of contact for cross-border cooperation.",
          guidance:
            "- Identify the competent authority and single point of contact designated by each Member State where your entity operates\n- Register your entity with the relevant competent authority as required\n- Establish internal contact procedures for communicating with the competent authority\n- Maintain up-to-date records of competent authority contact details and reporting channels\n- Ensure your designated contact person is trained on cross-border cooperation procedures",
        },
        {
          number: "Art.9",
          title: "Computer security incident response teams (CSIRTs)",
          objective:
            "Designate or establish one or more CSIRTs responsible for incident handling in accordance with requirements including availability, redundancy, and secure communication.",
          guidance:
            "- Identify the national CSIRT designated for your sector and establish a communication channel\n- Ensure your incident response team knows how to reach the designated CSIRT during and outside business hours\n- Verify that your entity's communication tools meet the CSIRT's requirements for secure information exchange\n- Conduct joint exercises or tabletop drills with the CSIRT at least annually\n- Maintain a documented escalation path from internal incident detection to CSIRT notification",
        },
        {
          number: "Art.10",
          title: "Requirements and tasks of CSIRTs",
          objective:
            "Ensure CSIRTs have adequate resources, operate in secure premises, handle incidents effectively, participate in the CSIRTs network, and carry out vulnerability disclosure coordination.",
          guidance:
            "- Understand the specific tasks and capabilities of the CSIRT responsible for your sector\n- Establish agreements or protocols for information sharing with the CSIRT during incident handling\n- Participate in vulnerability disclosure coordination programmes facilitated by the CSIRT\n- Review CSIRT advisories and threat intelligence regularly and integrate findings into your risk assessments\n- Provide feedback to the CSIRT on incident handling effectiveness to support continuous improvement",
        },
        {
          number: "Art.12",
          title: "Coordinated vulnerability disclosure and vulnerability database",
          objective:
            "Establish policies for coordinated vulnerability disclosure and maintain or contribute to a European vulnerability database for known vulnerabilities in ICT products and services.",
          guidance:
            "- Implement a coordinated vulnerability disclosure (CVD) policy for your products and services\n- Publish a security.txt file and clear reporting channel so researchers can report vulnerabilities\n- Define internal timelines for triaging, remediating, and publicly disclosing reported vulnerabilities\n- Monitor the European vulnerability database for advisories affecting ICT products and services you rely on\n- Integrate vulnerability database feeds into your patch management and risk assessment processes\n- Contribute discovered vulnerability information to the national CSIRT and the European database",
        },
      ],
    },

    // ── Chapter III: Cooperation ────────────────────────────────────────
    {
      number: "III",
      title: "Cooperation",
      description:
        "Cooperation Group, CSIRTs network, EU-CyCLONe, international cooperation, and peer reviews.",
      category: "Cooperation",
      controls: [
        {
          number: "Art.14",
          title: "Cooperation Group",
          objective:
            "Support and facilitate strategic cooperation and the exchange of information between Member States, including guidance on risk management measures and incident reporting.",
          guidance:
            "- Monitor guidance documents and best practices published by the NIS Cooperation Group\n- Align your risk management measures with recommendations issued by the Cooperation Group\n- Incorporate Cooperation Group guidance on incident reporting into your reporting procedures\n- Participate in sector-specific consultations or working streams when invited\n- Track Cooperation Group outputs on supply chain security and incorporate relevant recommendations",
        },
        {
          number: "Art.15",
          title: "CSIRTs network",
          objective:
            "Contribute to developing trust and confidence and promote swift and effective operational cooperation among Member States through the CSIRTs network.",
          guidance:
            "- Ensure your incident response contacts are known to your national CSIRT for inclusion in cross-border cooperation\n- Share anonymised threat intelligence and indicators of compromise through established channels with the CSIRT\n- Participate in cross-border incident response exercises coordinated through the CSIRTs network\n- Review shared situational awareness reports from the CSIRTs network and adjust defences accordingly\n- Establish internal procedures for acting on urgent alerts disseminated through the CSIRTs network",
        },
        {
          number: "Art.16",
          title: "European cyber crisis liaison organisation network (EU-CyCLONe)",
          objective:
            "Support the coordinated management of large-scale cybersecurity incidents and crises at the operational level and ensure regular exchange of information among Member States and EU institutions.",
          guidance:
            "- Develop an internal large-scale incident and crisis management plan aligned with EU-CyCLONe coordination protocols\n- Identify and train key personnel who would be involved in crisis communication during a large-scale incident\n- Establish secure communication channels that can be used for crisis coordination with national authorities\n- Conduct at least one crisis simulation exercise per year covering large-scale cross-border scenarios\n- Maintain an up-to-date situational awareness capability that can feed information to national crisis management",
        },
        {
          number: "Art.19",
          title: "Peer reviews",
          objective:
            "Conduct peer reviews to assess the level and consistency of Member States' cybersecurity capabilities and policies.",
          guidance:
            "- Prepare documentation demonstrating your entity's compliance posture to support national peer review assessments\n- Participate in voluntary peer learning exercises organised by competent authorities or industry groups\n- Use peer review findings published at the EU level to benchmark your security capabilities\n- Address any areas of weakness highlighted through peer review recommendations relevant to your sector\n- Maintain evidence of continuous improvement in cybersecurity measures to facilitate future reviews",
        },
      ],
    },

    // ── Chapter IV: Cybersecurity risk-management measures and reporting ─
    {
      number: "IV",
      title: "Cybersecurity risk-management measures and reporting obligations",
      description:
        "Risk-management measures for essential and important entities, incident reporting, use of European cybersecurity certification schemes, and supervisory obligations.",
      category: "Risk Management & Reporting",
      controls: [
        {
          number: "Art.20",
          title: "Governance",
          objective:
            "Ensure management bodies of essential and important entities approve cybersecurity risk-management measures, oversee their implementation, and can be held liable for infringements. Members of management bodies shall follow training.",
          guidance:
            "- Present cybersecurity risk-management measures to the management body for formal approval at least annually\n- Establish board-level reporting on cybersecurity posture including risk register summaries and incident trends\n- Require management body members to complete NIS2-specific cybersecurity training upon appointment and periodically thereafter\n- Document management body oversight activities including meeting minutes, decisions, and follow-up actions\n- Ensure the management body understands its liability exposure under NIS2 Article 20 and national transposition\n- Assign clear accountability for cybersecurity risk management to a named member of the management body",
        },
        {
          number: "Art.21(a)",
          title: "Policies on risk analysis and information system security",
          objective:
            "Establish and maintain policies on risk analysis and information system security as part of an all-hazards approach to cybersecurity risk management.",
          guidance:
            "- Conduct a gap analysis against NIS2 Article 21 requirements for your network and information systems\n- Document a formal risk analysis policy defining methodology, scope, frequency, and responsibilities\n- Establish and maintain a risk register covering all critical network and information systems\n- Implement regular risk assessments using a defined methodology such as ISO 27005 or NIST SP 800-30\n- Submit risk analysis findings to the management body for review and approval\n- Review and update risk analysis policies at least annually or after significant changes to systems or threat landscape",
        },
        {
          number: "Art.21(b)",
          title: "Incident handling",
          objective:
            "Implement processes and procedures for the prevention, detection and response to cybersecurity incidents.",
          guidance:
            "- Develop and document an incident response plan covering detection, triage, containment, eradication, and recovery phases\n- Deploy monitoring and detection capabilities such as SIEM, EDR, and network intrusion detection across critical systems\n- Define incident classification criteria and severity levels aligned with NIS2 significant incident thresholds\n- Establish a dedicated incident response team with clearly defined roles and escalation procedures\n- Conduct incident response exercises and tabletop simulations at least twice per year\n- Implement post-incident review processes and feed lessons learned back into prevention measures",
        },
        {
          number: "Art.21(c)",
          title: "Business continuity and crisis management",
          objective:
            "Ensure business continuity including backup management, disaster recovery, and crisis management capabilities.",
          guidance:
            "- Develop and maintain a business continuity plan (BCP) covering all essential services and critical information systems\n- Implement a backup strategy with defined RPO and RTO targets, regular backup testing, and off-site or immutable storage\n- Create a disaster recovery plan with documented procedures for restoring systems and services within defined timeframes\n- Establish a crisis management team and communication plan for large-scale incidents affecting service delivery\n- Test business continuity and disaster recovery plans at least annually through realistic simulations\n- Ensure backup and recovery procedures account for ransomware scenarios including isolated recovery environments",
        },
        {
          number: "Art.21(d)",
          title: "Supply chain security",
          objective:
            "Address security-related aspects concerning the relationships between each entity and its direct suppliers or service providers, including security requirements in contracts and due diligence.",
          guidance:
            "- Inventory all direct suppliers and service providers with access to or impact on your network and information systems\n- Conduct cybersecurity due diligence assessments of critical suppliers before onboarding and periodically thereafter\n- Include specific cybersecurity requirements in supplier contracts covering security measures, incident notification, and audit rights\n- Monitor supplier security posture through regular assessments, certifications, or continuous monitoring tools\n- Develop contingency plans for critical supplier failures including alternative sourcing and service continuity\n- Evaluate supply chain risks holistically, considering dependencies between suppliers and potential cascading effects",
        },
        {
          number: "Art.21(e)",
          title: "Security in network and information systems acquisition, development and maintenance",
          objective:
            "Ensure security in the acquisition, development and maintenance of network and information systems, including vulnerability handling and disclosure.",
          guidance:
            "- Define security requirements for all new system acquisitions and include them in procurement specifications\n- Implement a secure software development lifecycle (SDLC) with security reviews at each phase\n- Conduct vulnerability assessments and penetration testing before deploying new systems and after significant changes\n- Establish a patch management process with defined timelines based on vulnerability severity\n- Maintain an inventory of all network and information system components and their security update status\n- Implement vulnerability handling procedures including monitoring for advisories, assessing impact, and applying remediations",
        },
        {
          number: "Art.21(f)",
          title: "Policies and procedures to assess cybersecurity risk-management measures",
          objective:
            "Establish policies and procedures to assess the effectiveness of cybersecurity risk-management measures.",
          guidance:
            "- Define a policy for regular assessment of cybersecurity risk-management measure effectiveness\n- Conduct internal audits of cybersecurity controls at least annually against NIS2 requirements\n- Commission independent external audits or assessments periodically to validate internal findings\n- Establish key performance indicators (KPIs) and metrics to measure cybersecurity risk-management effectiveness\n- Report assessment results to the management body with recommendations for improvement\n- Track remediation of identified weaknesses and verify corrective actions are implemented within defined timelines",
        },
        {
          number: "Art.21(g)",
          title: "Basic cyber hygiene practices and cybersecurity training",
          objective:
            "Implement basic cyber hygiene practices and provide regular cybersecurity training to staff, including awareness of social engineering threats.",
          guidance:
            "- Implement foundational cyber hygiene measures including regular patching, strong password policies, and least privilege access\n- Deliver mandatory cybersecurity awareness training to all employees upon onboarding and at least annually\n- Provide targeted training on social engineering threats including phishing, vishing, and pretexting\n- Conduct simulated phishing campaigns to measure employee awareness and identify areas needing improvement\n- Establish role-based training for staff with elevated access or security-critical responsibilities\n- Track training completion rates and assessment scores, reporting gaps to management",
        },
        {
          number: "Art.21(h)",
          title: "Policies and procedures regarding the use of cryptography and encryption",
          objective:
            "Establish policies and procedures regarding the use of cryptography and, where appropriate, encryption to protect the confidentiality and integrity of data.",
          guidance:
            "- Develop a cryptography policy defining approved algorithms, key lengths, and use cases for data at rest and in transit\n- Implement encryption for all sensitive data at rest using approved standards such as AES-256\n- Enforce TLS 1.2 or higher for all data in transit across networks and between services\n- Establish a key management lifecycle covering generation, distribution, storage, rotation, and destruction of cryptographic keys\n- Conduct periodic reviews of cryptographic implementations to ensure they remain aligned with current best practices\n- Maintain an inventory of systems and data flows where cryptography is applied and identify any gaps",
        },
        {
          number: "Art.21(i)",
          title: "Human resources security, access control and asset management",
          objective:
            "Implement appropriate human resources security measures, access control policies, and asset management practices.",
          guidance:
            "- Implement HR security controls including background checks, security clauses in employment contracts, and offboarding procedures\n- Enforce role-based access control (RBAC) with least privilege principles for all systems and data\n- Conduct regular access reviews at least quarterly for privileged accounts and semi-annually for all users\n- Maintain a comprehensive asset inventory covering hardware, software, data, and network components\n- Classify assets by criticality and sensitivity and apply appropriate protection measures for each classification level\n- Implement procedures for secure asset disposal and data sanitisation when assets are retired or reassigned",
        },
        {
          number: "Art.21(j)",
          title: "Multi-factor authentication and secured communication",
          objective:
            "Use multi-factor authentication or continuous authentication solutions, secured voice, video and text communications, and secured emergency communication systems.",
          guidance:
            "- Deploy multi-factor authentication (MFA) for all remote access, privileged accounts, and access to critical systems\n- Implement phishing-resistant MFA methods such as FIDO2/WebAuthn where feasible\n- Deploy end-to-end encrypted communication tools for sensitive voice, video, and text communications\n- Establish secured emergency communication channels that remain operational during cyber incidents\n- Review and test emergency communication systems regularly to ensure availability and integrity\n- Evaluate continuous authentication solutions for high-risk environments and implement where appropriate",
        },
        {
          number: "Art.23",
          title: "Reporting obligations",
          objective:
            "Notify the competent authority or CSIRT of any significant incident without undue delay: early warning within 24 hours, incident notification within 72 hours, and final report within one month.",
          guidance:
            "- Establish an internal incident reporting procedure that maps to the NIS2 three-stage reporting timeline (24h, 72h, 1 month)\n- Define criteria for what constitutes a significant incident based on NIS2 thresholds including affected users, duration, and impact\n- Prepare reporting templates for early warnings, incident notifications, and final reports aligned with CSIRT/competent authority requirements\n- Designate and train personnel responsible for submitting incident reports within the prescribed deadlines\n- Implement tooling to track incident timelines and ensure reporting deadlines are not missed\n- Conduct reporting drills to verify the end-to-end process from incident detection to authority notification",
        },
        {
          number: "Art.24",
          title: "Use of European cybersecurity certification schemes",
          objective:
            "Use certified ICT products, services and processes under European cybersecurity certification schemes to demonstrate compliance with specific cybersecurity requirements.",
          guidance:
            "- Identify ICT products, services, and processes in your environment that fall under European cybersecurity certification schemes\n- Evaluate whether using certified products can streamline demonstrating compliance with NIS2 requirements\n- Include certification requirements in procurement policies for critical ICT components\n- Maintain records of certifications held by your ICT products and services, including expiry dates and scope\n- Monitor developments in EU cybersecurity certification schemes (e.g., EUCC, EUCS) for new applicable schemes",
        },
      ],
    },

    // ── Chapter V: Jurisdiction and registration ────────────────────────
    {
      number: "V",
      title: "Jurisdiction and registration",
      description:
        "Jurisdiction, registration of entities, and the creation and maintenance of a registry of essential and important entities.",
      category: "Jurisdiction & Registration",
      controls: [
        {
          number: "Art.26",
          title: "Jurisdiction and territoriality",
          objective:
            "Determine the jurisdiction and territorial scope for essential and important entities, including that entities providing services in more than one Member State fall under the jurisdiction of each respective Member State.",
          guidance:
            "- Map all Member States where your entity provides services or has its main establishment\n- Determine which Member State holds primary jurisdiction based on your main establishment location\n- Identify additional jurisdictional obligations in each Member State where services are provided\n- Ensure compliance with the national transposition of NIS2 in each relevant Member State\n- Maintain a register of jurisdictional obligations and designated competent authorities per Member State\n- Seek legal advice on cross-border jurisdictional questions, particularly for DNS, TLD, and cloud service providers",
        },
        {
          number: "Art.27",
          title: "Registry of essential and important entities",
          objective:
            "Ensure essential and important entities submit required information to competent authorities including name, sector, sub-sector, contact details, Member States where services are provided, and IP address ranges.",
          guidance:
            "- Determine whether your entity qualifies as essential or important under NIS2 Annexes I and II\n- Compile the registration information required: entity name, sector, sub-sector, address, contact details, IP ranges, and Member States of operation\n- Submit registration information to the competent authority within the deadline set by national transposition\n- Establish a process to update registration details promptly when changes occur\n- Maintain internal records of registration submissions and any acknowledgements received from authorities",
        },
      ],
    },

    // ── Chapter VI: Information sharing ─────────────────────────────────
    {
      number: "VI",
      title: "Information sharing",
      description:
        "Cybersecurity information-sharing arrangements between essential and important entities.",
      category: "Information Sharing",
      controls: [
        {
          number: "Art.29",
          title: "Cybersecurity information-sharing arrangements",
          objective:
            "Enable essential and important entities to exchange relevant cybersecurity information on a voluntary basis, including cyber threats, vulnerabilities, indicators of compromise, tactics, techniques and procedures, and cybersecurity alerts.",
          guidance:
            "- Join sector-specific or cross-sector information sharing and analysis centres (ISACs) or similar trusted communities\n- Establish internal procedures for receiving, evaluating, and acting on shared threat intelligence\n- Define what information your entity can share, applying traffic light protocol (TLP) or similar classification\n- Implement automated ingestion of shared indicators of compromise (IoCs) into detection and blocking systems\n- Contribute threat intelligence back to sharing communities while protecting sensitive business information\n- Review information-sharing arrangements periodically to ensure they remain effective and compliant with data protection requirements",
        },
      ],
    },

    // ── Chapter VII: Supervision and enforcement ────────────────────────
    {
      number: "VII",
      title: "Supervision and enforcement",
      description:
        "Supervisory measures, enforcement actions, administrative fines, and penalties for essential and important entities.",
      category: "Supervision & Enforcement",
      controls: [
        {
          number: "Art.32",
          title: "Supervisory measures for essential entities",
          objective:
            "Ensure competent authorities can conduct on-site inspections, off-site supervision, security audits, security scans, and request evidence of cybersecurity policies for essential entities.",
          guidance:
            "- Maintain audit-ready documentation of all cybersecurity policies, risk assessments, and incident records\n- Prepare an evidence pack covering each NIS2 Article 21 requirement that can be provided to authorities on request\n- Establish internal procedures for cooperating with on-site inspections including designated liaison personnel\n- Conduct regular internal security audits and vulnerability scans to identify and remediate issues before supervisory review\n- Ensure logs and records are retained for the periods required by national transposition to support off-site supervision\n- Brief relevant staff on supervisory powers and the expected process for inspections and audit requests",
        },
        {
          number: "Art.33",
          title: "Supervisory measures for important entities",
          objective:
            "Ensure competent authorities can take supervisory actions for important entities including inspections, audits, and security scans when evidence or indication of non-compliance exists.",
          guidance:
            "- Maintain documentation demonstrating compliance with NIS2 requirements proportionate to your entity's risk profile\n- Monitor for communications from the competent authority indicating concerns or requests for information\n- Conduct periodic self-assessments against NIS2 requirements to identify and address non-compliance proactively\n- Implement a remediation tracking system to address findings from any supervisory actions promptly\n- Ensure cooperation procedures are in place for responding to authority requests for evidence, audits, or scans",
        },
        {
          number: "Art.34",
          title: "Administrative fines",
          objective:
            "Establish rules on administrative fines: for essential entities up to EUR 10 million or 2% of worldwide turnover; for important entities up to EUR 7 million or 1.4% of worldwide turnover.",
          guidance:
            "- Assess your entity's maximum financial exposure under NIS2 administrative fine provisions based on classification and turnover\n- Ensure the management body is informed of the financial risk associated with non-compliance\n- Implement a compliance monitoring programme to minimise the risk of infringements leading to fines\n- Document all compliance efforts and remediation actions as mitigating evidence in case of enforcement proceedings\n- Review the national transposition for specific fine calculation criteria and aggravating or mitigating factors\n- Include NIS2 fine exposure in enterprise risk management and ensure adequate budgets for compliance activities",
        },
        {
          number: "Art.36",
          title: "Penalties",
          objective:
            "Lay down rules on penalties applicable to infringements and take all measures necessary to ensure they are implemented effectively, proportionately and dissuasively.",
          guidance:
            "- Review the national transposition of NIS2 for specific penalty rules beyond administrative fines\n- Identify which infringements carry the most severe penalties and prioritise compliance efforts accordingly\n- Ensure the management body understands personal liability implications under national penalty provisions\n- Maintain comprehensive compliance records to demonstrate good faith and due diligence in the event of enforcement\n- Engage legal counsel to review penalty exposure and advise on risk mitigation strategies",
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

  console.log(`[seed] NIS2 Directive seeded -- ${clauseCount} clauses, ${controlCount} controls`)
}
