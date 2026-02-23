import { PrismaClient } from "@prisma/client"

// ---------------------------------------------------------------------------
// DORA -- Regulation (EU) 2022/2554 on digital operational resilience for
// the financial sector
// ---------------------------------------------------------------------------

export async function seedDORA(prisma: PrismaClient) {
  const framework = await prisma.framework.upsert({
    where: { code: "DORA" },
    update: {
      name: "DORA",
      version: "2022/2554",
      status: "PUBLISHED",
    },
    create: {
      code: "DORA",
      name: "DORA",
      version: "2022/2554",
      description:
        "Digital Operational Resilience Act — EU regulation establishing a comprehensive framework for digital operational resilience in the financial sector, covering ICT risk management, incident reporting, resilience testing, and third-party risk management.",
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
    // ── Chapter II: ICT Risk Management (Articles 5-16) ──────────────────
    {
      number: "II",
      title: "ICT Risk Management",
      description:
        "Internal governance and control frameworks for ICT risk management, including identification, protection, detection, response, recovery, and learning processes.",
      category: "ICT Risk Management",
      controls: [
        {
          number: "Art.5-6",
          title: "ICT Risk Management Framework",
          objective:
            "Establish and maintain a sound, comprehensive and well-documented ICT risk management framework as part of the overall risk management system, enabling the financial entity to address ICT risk quickly, efficiently and comprehensively.",
          guidance:
            "- Establish an ICT risk management framework aligned with business strategy\n- Define roles and responsibilities for ICT risk management\n- Implement ICT risk identification and assessment processes\n- Document and maintain ICT risk management policies and procedures\n- Report ICT risk status to management body regularly",
        },
        {
          number: "Art.5(2)",
          title: "ICT Governance",
          objective:
            "Ensure the management body defines, approves, oversees and is accountable for the implementation and maintenance of all arrangements related to the ICT risk management framework.",
          guidance:
            "- Assign ultimate responsibility for ICT risk to the management body\n- Establish an ICT risk management function with sufficient authority and independence\n- Define clear reporting lines for ICT risk management\n- Ensure management body members maintain adequate knowledge and skills on ICT risk\n- Review and approve ICT risk management policies at least annually",
        },
        {
          number: "Art.7",
          title: "ICT Systems, Protocols and Tools",
          objective:
            "Use and maintain updated ICT systems, protocols and tools that are appropriate to support critical operations, are reliable and have sufficient capacity, and are technologically resilient.",
          guidance:
            "- Maintain an inventory of all ICT systems, protocols and tools\n- Ensure ICT systems are appropriately sized and have sufficient capacity\n- Implement redundancy for critical ICT systems\n- Keep ICT systems updated with latest security patches\n- Test ICT systems regularly to verify performance and resilience\n- Document minimum ICT system requirements for critical or important functions",
        },
        {
          number: "Art.8",
          title: "Identification",
          objective:
            "Identify, classify and adequately document all ICT-supported business functions, information assets, ICT assets and their dependencies, including those provided by ICT third-party service providers.",
          guidance:
            "- Create and maintain an inventory of all ICT assets and information assets\n- Classify information assets based on criticality and sensitivity\n- Map dependencies between business functions and supporting ICT assets\n- Identify all ICT-supported business functions and assess their criticality\n- Perform regular reviews and updates of asset inventories and dependency maps\n- Document and assess risks associated with legacy ICT systems",
        },
        {
          number: "Art.9",
          title: "Protection and Prevention",
          objective:
            "Design, procure and implement ICT security policies, procedures, protocols and tools that aim to ensure the resilience, continuity and availability of ICT systems, and to maintain high standards of data security, confidentiality and integrity.",
          guidance:
            "- Develop and implement ICT security policies covering all critical areas\n- Deploy network security measures including firewalls and intrusion prevention\n- Implement strong authentication mechanisms and access control policies\n- Encrypt data at rest and in transit using current cryptographic standards\n- Conduct regular security awareness training for all staff\n- Establish a patch management process with defined timelines",
        },
        {
          number: "Art.10",
          title: "Detection",
          objective:
            "Implement mechanisms to promptly detect anomalous activities, including ICT network performance issues and ICT-related incidents, and to identify potential single points of failure.",
          guidance:
            "- Deploy security monitoring tools covering network, system and application layers\n- Implement a Security Information and Event Management (SIEM) system\n- Establish baseline behaviour profiles for critical systems and networks\n- Configure automated alerting for anomalous activities and threshold breaches\n- Conduct regular reviews and tuning of detection mechanisms\n- Test detection capabilities through simulated attack scenarios",
        },
        {
          number: "Art.11-12",
          title: "Response and Recovery",
          objective:
            "Put in place a comprehensive ICT business continuity policy and associated ICT response and recovery plans to ensure continuity of critical functions, quick and effective response to ICT-related incidents, and timely activation of containment measures.",
          guidance:
            "- Develop and maintain ICT business continuity and disaster recovery plans\n- Define response procedures for different types and severity of ICT incidents\n- Establish recovery time objectives (RTOs) and recovery point objectives (RPOs)\n- Conduct regular testing of response and recovery plans at least annually\n- Implement incident containment measures to limit the impact of ICT disruptions\n- Document lessons learned from incidents and update plans accordingly",
        },
        {
          number: "Art.12",
          title: "Backup and Restoration",
          objective:
            "Establish backup policies and procedures specifying the scope, frequency and retention of backups, and ensure the ability to restore ICT systems from backups in a timely manner.",
          guidance:
            "- Define backup policies specifying scope, frequency and retention periods\n- Implement automated backup procedures for all critical data and systems\n- Store backups in geographically separated and physically secure locations\n- Test restoration procedures regularly to verify data integrity and recovery times\n- Ensure backup systems are segregated from primary production environments\n- Document and regularly review backup and restoration procedures",
        },
        {
          number: "Art.13",
          title: "Learning and Evolving",
          objective:
            "Gather information on vulnerabilities and cyber threats, ICT-related incidents, and analyse their impact, and draw lessons from post-incident reviews, testing and real events to continuously improve the ICT risk management framework.",
          guidance:
            "- Conduct post-incident reviews for all major ICT-related incidents\n- Collect and analyse threat intelligence from internal and external sources\n- Integrate lessons learned into ICT risk management policies and procedures\n- Track and trend ICT incidents to identify recurring issues and systemic weaknesses\n- Share relevant findings and best practices across the organisation",
        },
        {
          number: "Art.14",
          title: "Communication",
          objective:
            "Establish communication plans to enable responsible disclosure of ICT-related incidents or major vulnerabilities to clients, counterparts and the public, and define internal escalation procedures.",
          guidance:
            "- Develop internal and external communication plans for ICT incidents\n- Define roles and responsibilities for incident communication\n- Establish escalation procedures with clear timelines and thresholds\n- Implement secure communication channels for incident-related information sharing\n- Prepare communication templates for different incident severity levels\n- Coordinate with public relations and legal teams for external disclosures",
        },
      ],
    },

    // ── Chapter III: ICT-Related Incident Management (Articles 17-23) ────
    {
      number: "III",
      title: "ICT-Related Incident Management",
      description:
        "Requirements for the management, classification and reporting of ICT-related incidents, including major incidents and significant cyber threats.",
      category: "Incident Management",
      controls: [
        {
          number: "Art.17",
          title: "Incident Management Process",
          objective:
            "Define, establish and implement an ICT-related incident management process to detect, manage and notify ICT-related incidents, including early warning indicators, procedures for identification and classification, and incident response plans.",
          guidance:
            "- Establish a formal ICT incident management process with defined stages\n- Implement early warning indicators and automated detection mechanisms\n- Define roles and responsibilities for incident management teams\n- Create incident response playbooks for common incident types\n- Establish communication protocols for internal and external stakeholders\n- Conduct regular incident response drills and tabletop exercises",
        },
        {
          number: "Art.18",
          title: "Classification of ICT-Related Incidents",
          objective:
            "Classify ICT-related incidents based on the number of clients affected, duration, geographical spread, data losses, criticality of services affected, and economic impact, distinguishing major incidents from other incidents.",
          guidance:
            "- Define classification criteria aligned with DORA Article 18 requirements\n- Implement a severity matrix covering number of affected clients, duration and geographic spread\n- Assess data loss impact including confidentiality, integrity and availability\n- Evaluate criticality of affected services and business functions\n- Estimate economic impact for each classified incident\n- Review and update classification thresholds regularly based on regulatory guidance",
        },
        {
          number: "Art.19",
          title: "Reporting Major Incidents",
          objective:
            "Report major ICT-related incidents to the relevant competent authority using initial notification, intermediate report and final report, within the prescribed timeframes.",
          guidance:
            "- Submit initial notification to competent authority within 4 hours of classification as major\n- Provide intermediate report within 72 hours with updated status and root cause analysis\n- Deliver final report within one month of the incident including root cause and remediation\n- Establish internal processes to collect information required for each report stage\n- Maintain templates and checklists aligned with regulatory reporting requirements\n- Track reporting deadlines and ensure compliance with prescribed timeframes",
        },
        {
          number: "Art.20",
          title: "Harmonisation of Reporting Content and Templates",
          objective:
            "Apply common reporting standards, templates and procedures for incident reporting as developed by the European Supervisory Authorities (ESAs) to ensure consistency and comparability.",
          guidance:
            "- Adopt standardised reporting templates issued by the ESAs\n- Align internal incident documentation with harmonised reporting fields\n- Implement data quality checks for consistency before submission\n- Train incident management staff on harmonised reporting requirements\n- Monitor regulatory updates for changes to reporting standards and templates",
        },
        {
          number: "Art.19(4)",
          title: "Voluntary Notification",
          objective:
            "Enable the voluntary notification to competent authorities of significant cyber threats that the financial entity deems relevant, even where they have not resulted in a major incident.",
          guidance:
            "- Establish criteria for identifying significant cyber threats warranting voluntary notification\n- Define an internal process for evaluating and escalating notable cyber threats\n- Create streamlined reporting templates for voluntary notifications\n- Ensure clear communication channels with the competent authority for voluntary reports\n- Document all voluntary notifications and track authority feedback",
        },
        {
          number: "Art.21",
          title: "Centralised Reporting",
          objective:
            "Support and contribute to the development of centralised reporting mechanisms at EU level, enabling efficient aggregation and analysis of ICT-related incident reports by competent authorities and ESAs.",
          guidance:
            "- Prepare systems and processes for connection to centralised EU reporting hubs\n- Ensure internal reporting formats are compatible with centralised reporting requirements\n- Implement automated data extraction for seamless submission to central platforms\n- Monitor ESA guidance on the establishment and operation of centralised reporting\n- Participate in industry consultations on centralised reporting standards",
        },
      ],
    },

    // ── Chapter IV: Digital Operational Resilience Testing (Articles 24-27)
    {
      number: "IV",
      title: "Digital Operational Resilience Testing",
      description:
        "Requirements for testing ICT systems, tools and processes through a risk-based programme, including advanced threat-led penetration testing (TLPT).",
      category: "Resilience Testing",
      controls: [
        {
          number: "Art.24",
          title: "General Requirements for Testing",
          objective:
            "Establish, maintain and review a sound and comprehensive digital operational resilience testing programme as an integral part of the ICT risk management framework, proportionate to the size, business and risk profiles of the financial entity.",
          guidance:
            "- Develop a risk-based digital operational resilience testing programme\n- Define scope, frequency and methodology for resilience tests\n- Ensure the testing programme covers all critical ICT systems and applications\n- Allocate sufficient resources and budget for testing activities\n- Document testing results and track remediation of identified vulnerabilities\n- Review and update the testing programme at least annually",
        },
        {
          number: "Art.25",
          title: "Testing of ICT Tools and Systems",
          objective:
            "Perform a range of tests including vulnerability assessments, open-source analyses, network security assessments, gap analyses, physical security reviews, software composition analyses, and source code reviews as appropriate.",
          guidance:
            "- Conduct regular vulnerability assessments and penetration tests on ICT systems\n- Perform network security assessments including port scanning and configuration reviews\n- Execute source code reviews and software composition analyses for critical applications\n- Carry out gap analyses against regulatory requirements and industry standards\n- Review physical security controls for data centres and critical ICT infrastructure\n- Prioritise and remediate findings based on risk severity and business impact",
        },
        {
          number: "Art.26",
          title: "Advanced Testing Through TLPT",
          objective:
            "Carry out threat-led penetration testing (TLPT) at least every three years, covering critical functions and live production systems, using qualified external testers and following recognised frameworks such as TIBER-EU.",
          guidance:
            "- Identify critical or important functions in scope for TLPT\n- Engage qualified and independent external testers with relevant certifications\n- Base testing scenarios on current and credible threat intelligence\n- Execute TLPT on live production systems covering end-to-end attack paths\n- Conduct purple-teaming activities following red-team testing phases\n- Share TLPT results with the competent authority and implement remediation plans",
        },
        {
          number: "Art.27(1)",
          title: "Requirements for Testers",
          objective:
            "Ensure that external testers performing TLPT possess the highest professional suitability and reputation, possess technical and organisational capabilities, and are certified or accredited by a relevant body.",
          guidance:
            "- Verify external testers hold recognised certifications (e.g., CREST, OSCP, STAR)\n- Assess testers for technical capability, independence and relevant experience\n- Require professional indemnity insurance and appropriate security clearances\n- Include contractual clauses for confidentiality and responsible handling of findings\n- Evaluate and rotate testing providers periodically to ensure fresh perspectives",
        },
        {
          number: "Art.27(2)",
          title: "Mutual Recognition of TLPT Results",
          objective:
            "Enable mutual recognition of threat-led penetration testing results across Member States to reduce duplicative testing burdens for financial entities operating in multiple jurisdictions.",
          guidance:
            "- Document TLPT results in formats aligned with TIBER-EU or equivalent frameworks\n- Coordinate with competent authorities in relevant jurisdictions before commencing TLPT\n- Ensure test reports contain sufficient detail for cross-border recognition\n- Maintain records demonstrating compliance with mutual recognition requirements\n- Engage with supervisory authorities to confirm acceptance of TLPT results across borders",
        },
      ],
    },

    // ── Chapter V: Managing ICT Third-Party Risk (Articles 28-44) ────────
    {
      number: "V",
      title: "Managing ICT Third-Party Risk",
      description:
        "Principles and requirements for managing risks arising from ICT third-party service providers, including key contractual provisions, subcontracting, concentration risk, and the oversight framework for critical providers.",
      category: "Third-Party Risk",
      controls: [
        {
          number: "Art.28",
          title: "General Principles for ICT Third-Party Risk",
          objective:
            "Manage ICT third-party risk as an integral component of ICT risk within the ICT risk management framework, maintaining at all times full responsibility and accountability for compliance with regulatory obligations.",
          guidance:
            "- Integrate ICT third-party risk management into the overall ICT risk management framework\n- Maintain a register of all ICT third-party service arrangements\n- Ensure the management body approves and reviews the ICT third-party risk strategy\n- Define and enforce policies for the use of ICT services provided by third parties\n- Retain full accountability for regulatory compliance regardless of outsourcing arrangements\n- Report annually to competent authorities on new ICT third-party arrangements",
        },
        {
          number: "Art.28(4)",
          title: "Preliminary Assessment of ICT Third-Party Providers",
          objective:
            "Conduct due diligence and risk assessment before entering into contractual arrangements with ICT third-party service providers, identifying and assessing all relevant risks including concentration risk.",
          guidance:
            "- Perform comprehensive due diligence on prospective ICT third-party providers\n- Assess the provider's financial stability, security posture and operational resilience\n- Evaluate potential concentration risk and dependency on specific providers\n- Verify the provider's compliance with applicable regulatory and legal requirements\n- Document the risk assessment outcome and approval by appropriate governance bodies\n- Define exit strategies before entering into contractual arrangements",
        },
        {
          number: "Art.30",
          title: "Key Contractual Provisions",
          objective:
            "Ensure contractual arrangements with ICT third-party service providers contain comprehensive provisions covering service levels, data security, audit rights, exit strategies, incident reporting, business continuity, and termination rights.",
          guidance:
            "- Include clear service level descriptions with quantitative and qualitative metrics\n- Define data security requirements including encryption, access control and data localisation\n- Ensure unrestricted audit and inspection rights for the entity and its competent authority\n- Establish incident notification obligations aligned with DORA reporting timelines\n- Include business continuity and disaster recovery requirements and testing obligations\n- Define termination rights, transition assistance obligations and adequate notice periods",
        },
        {
          number: "Art.29",
          title: "Subcontracting of Critical or Important Functions",
          objective:
            "Ensure that where ICT third-party service providers subcontract critical or important functions, the financial entity is informed, retains oversight, and the same contractual and security requirements apply throughout the subcontracting chain.",
          guidance:
            "- Require prior notification and approval for subcontracting of critical functions\n- Ensure subcontractors are subject to equivalent security and resilience requirements\n- Maintain visibility of the full subcontracting chain including fourth-party providers\n- Include contractual provisions enabling the entity to object to or restrict subcontracting\n- Monitor and assess risks arising from subcontracting arrangements regularly\n- Ensure audit rights extend to subcontractors supporting critical or important functions",
        },
        {
          number: "Art.29(2)",
          title: "Concentration Risk",
          objective:
            "Identify, assess and manage ICT concentration risk arising from the use of the same or closely connected ICT third-party service providers, considering the substitutability and consequences of disruption.",
          guidance:
            "- Map all ICT third-party dependencies and identify concentration points\n- Assess the substitutability of critical ICT third-party service providers\n- Evaluate the potential impact of a major disruption at concentrated providers\n- Develop contingency plans and diversification strategies for high-concentration risks\n- Report concentration risk assessments to the management body and competent authorities\n- Monitor market developments that may increase or decrease concentration risk",
        },
        {
          number: "Art.31-37",
          title: "Oversight Framework for Critical ICT Third-Party Providers",
          objective:
            "Support the EU oversight framework under which ESAs designate and oversee critical ICT third-party service providers, including powers to request information, conduct inspections, and issue recommendations.",
          guidance:
            "- Understand the designation criteria for critical ICT third-party providers (CTPPs)\n- Cooperate with the Lead Overseer and competent authorities in oversight activities\n- Ensure critical providers are aware of their obligations under the oversight framework\n- Facilitate information requests and on-site inspections by the Lead Overseer\n- Monitor and act upon recommendations issued by the Lead Overseer to CTPPs\n- Assess the impact on the entity if a critical provider fails to comply with recommendations",
        },
        {
          number: "Art.38-44",
          title: "Designation of Critical ICT Third-Party Providers",
          objective:
            "Understand and prepare for the process by which ESAs designate critical ICT third-party service providers based on systemic impact, substitutability, and the number and nature of financial entities relying on them.",
          guidance:
            "- Monitor ESA publications on the designation of critical ICT third-party providers\n- Evaluate whether current ICT providers may be designated as critical\n- Assess the implications of provider designation on existing contractual arrangements\n- Prepare for enhanced oversight obligations applicable to designated providers\n- Engage with providers on their compliance with oversight requirements\n- Incorporate designation outcomes into ICT third-party risk assessments",
        },
      ],
    },

    // ── Chapter VI: Information Sharing (Article 45) ─────────────────────
    {
      number: "VI",
      title: "Information Sharing",
      description:
        "Arrangements for sharing cyber threat information and intelligence among financial entities to enhance collective digital operational resilience.",
      category: "Information Sharing",
      controls: [
        {
          number: "Art.45(1)",
          title: "Cyber Threat Information Sharing",
          objective:
            "Exchange cyber threat information and intelligence among financial entities, including indicators of compromise, tactics, techniques and procedures, cybersecurity alerts and configuration tools, to enhance digital operational resilience.",
          guidance:
            "- Establish processes for collecting and sharing cyber threat intelligence\n- Participate in relevant financial sector ISACs and information sharing communities\n- Define what types of information can be shared (IOCs, TTPs, alerts, vulnerabilities)\n- Implement secure mechanisms for receiving and disseminating threat intelligence\n- Integrate threat intelligence into detection, prevention and response capabilities\n- Evaluate and enrich shared threat information before acting upon it",
        },
        {
          number: "Art.45(2)",
          title: "Arrangements for Information Sharing",
          objective:
            "Set up information-sharing arrangements within trusted communities of financial entities, specifying the conditions for participation, involvement of competent authorities, and operational elements of the sharing mechanism.",
          guidance:
            "- Define the scope, membership and governance of information-sharing arrangements\n- Establish trust frameworks and data handling agreements among participants\n- Implement traffic light protocol (TLP) or equivalent classification for shared information\n- Ensure sharing arrangements comply with data protection and competition law\n- Designate information sharing coordinators within the organisation\n- Review the effectiveness and value of sharing arrangements periodically",
        },
        {
          number: "Art.45(3)",
          title: "Notification to Competent Authorities",
          objective:
            "Notify competent authorities of participation in information-sharing arrangements, ensuring transparency and enabling supervisory oversight of collaborative threat intelligence activities.",
          guidance:
            "- Notify the competent authority upon joining an information-sharing arrangement\n- Provide details of the arrangement including participants and scope\n- Report any material changes to information-sharing arrangements\n- Maintain records of information shared and received through the arrangements\n- Cooperate with competent authorities on supervisory inquiries about sharing activities",
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
  const controlCount = await prisma.control.count({
    where: { clause: { frameworkId: fwId } },
  })

  console.log(
    `[seed] DORA seeded -- ${clauseCount} clauses, ${controlCount} controls`
  )
}
