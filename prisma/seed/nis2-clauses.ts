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
        },
        {
          number: "Art.8",
          title: "Competent authorities and single points of contact",
          objective:
            "Designate or establish one or more competent authorities responsible for cybersecurity and a single point of contact for cross-border cooperation.",
        },
        {
          number: "Art.9",
          title: "Computer security incident response teams (CSIRTs)",
          objective:
            "Designate or establish one or more CSIRTs responsible for incident handling in accordance with requirements including availability, redundancy, and secure communication.",
        },
        {
          number: "Art.10",
          title: "Requirements and tasks of CSIRTs",
          objective:
            "Ensure CSIRTs have adequate resources, operate in secure premises, handle incidents effectively, participate in the CSIRTs network, and carry out vulnerability disclosure coordination.",
        },
        {
          number: "Art.12",
          title: "Coordinated vulnerability disclosure and vulnerability database",
          objective:
            "Establish policies for coordinated vulnerability disclosure and maintain or contribute to a European vulnerability database for known vulnerabilities in ICT products and services.",
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
        },
        {
          number: "Art.15",
          title: "CSIRTs network",
          objective:
            "Contribute to developing trust and confidence and promote swift and effective operational cooperation among Member States through the CSIRTs network.",
        },
        {
          number: "Art.16",
          title: "European cyber crisis liaison organisation network (EU-CyCLONe)",
          objective:
            "Support the coordinated management of large-scale cybersecurity incidents and crises at the operational level and ensure regular exchange of information among Member States and EU institutions.",
        },
        {
          number: "Art.19",
          title: "Peer reviews",
          objective:
            "Conduct peer reviews to assess the level and consistency of Member States' cybersecurity capabilities and policies.",
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
        },
        {
          number: "Art.21(a)",
          title: "Policies on risk analysis and information system security",
          objective:
            "Establish and maintain policies on risk analysis and information system security as part of an all-hazards approach to cybersecurity risk management.",
        },
        {
          number: "Art.21(b)",
          title: "Incident handling",
          objective:
            "Implement processes and procedures for the prevention, detection and response to cybersecurity incidents.",
        },
        {
          number: "Art.21(c)",
          title: "Business continuity and crisis management",
          objective:
            "Ensure business continuity including backup management, disaster recovery, and crisis management capabilities.",
        },
        {
          number: "Art.21(d)",
          title: "Supply chain security",
          objective:
            "Address security-related aspects concerning the relationships between each entity and its direct suppliers or service providers, including security requirements in contracts and due diligence.",
        },
        {
          number: "Art.21(e)",
          title: "Security in network and information systems acquisition, development and maintenance",
          objective:
            "Ensure security in the acquisition, development and maintenance of network and information systems, including vulnerability handling and disclosure.",
        },
        {
          number: "Art.21(f)",
          title: "Policies and procedures to assess cybersecurity risk-management measures",
          objective:
            "Establish policies and procedures to assess the effectiveness of cybersecurity risk-management measures.",
        },
        {
          number: "Art.21(g)",
          title: "Basic cyber hygiene practices and cybersecurity training",
          objective:
            "Implement basic cyber hygiene practices and provide regular cybersecurity training to staff, including awareness of social engineering threats.",
        },
        {
          number: "Art.21(h)",
          title: "Policies and procedures regarding the use of cryptography and encryption",
          objective:
            "Establish policies and procedures regarding the use of cryptography and, where appropriate, encryption to protect the confidentiality and integrity of data.",
        },
        {
          number: "Art.21(i)",
          title: "Human resources security, access control and asset management",
          objective:
            "Implement appropriate human resources security measures, access control policies, and asset management practices.",
        },
        {
          number: "Art.21(j)",
          title: "Multi-factor authentication and secured communication",
          objective:
            "Use multi-factor authentication or continuous authentication solutions, secured voice, video and text communications, and secured emergency communication systems.",
        },
        {
          number: "Art.23",
          title: "Reporting obligations",
          objective:
            "Notify the competent authority or CSIRT of any significant incident without undue delay: early warning within 24 hours, incident notification within 72 hours, and final report within one month.",
        },
        {
          number: "Art.24",
          title: "Use of European cybersecurity certification schemes",
          objective:
            "Use certified ICT products, services and processes under European cybersecurity certification schemes to demonstrate compliance with specific cybersecurity requirements.",
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
        },
        {
          number: "Art.27",
          title: "Registry of essential and important entities",
          objective:
            "Ensure essential and important entities submit required information to competent authorities including name, sector, sub-sector, contact details, Member States where services are provided, and IP address ranges.",
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
        },
        {
          number: "Art.33",
          title: "Supervisory measures for important entities",
          objective:
            "Ensure competent authorities can take supervisory actions for important entities including inspections, audits, and security scans when evidence or indication of non-compliance exists.",
        },
        {
          number: "Art.34",
          title: "Administrative fines",
          objective:
            "Establish rules on administrative fines: for essential entities up to EUR 10 million or 2% of worldwide turnover; for important entities up to EUR 7 million or 1.4% of worldwide turnover.",
        },
        {
          number: "Art.36",
          title: "Penalties",
          objective:
            "Lay down rules on penalties applicable to infringements and take all measures necessary to ensure they are implemented effectively, proportionately and dissuasively.",
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
        },
      })
    }
  }

  const clauseCount = await prisma.clause.count({ where: { frameworkId: fwId } })
  const controlCount = await prisma.control.count({ where: { clause: { frameworkId: fwId } } })

  console.log(`[seed] NIS2 Directive seeded -- ${clauseCount} clauses, ${controlCount} controls`)
}
