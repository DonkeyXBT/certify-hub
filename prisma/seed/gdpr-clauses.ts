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
        },
        {
          number: "Art.6",
          title: "Lawfulness of processing",
          objective:
            "Ensure processing is lawful by establishing at least one legal basis: consent, contract, legal obligation, vital interests, public interest, or legitimate interests.",
        },
        {
          number: "Art.7",
          title: "Conditions for consent",
          objective:
            "Ensure the controller can demonstrate that the data subject has consented to processing, that the request for consent is presented clearly and distinctly, and that consent can be withdrawn at any time.",
        },
        {
          number: "Art.8",
          title: "Conditions applicable to child's consent",
          objective:
            "Ensure processing of a child's personal data is lawful only where the child is at least 16 years old, or consent is given by the holder of parental responsibility.",
        },
        {
          number: "Art.9",
          title: "Processing of special categories of personal data",
          objective:
            "Prohibit processing of special categories of data (racial/ethnic origin, political opinions, religious beliefs, genetic data, biometric data, health data, sex life/orientation) unless a specific exemption applies.",
        },
        {
          number: "Art.10",
          title: "Processing of personal data relating to criminal convictions",
          objective:
            "Ensure processing of personal data relating to criminal convictions and offences is carried out only under the control of official authority or when authorised by law.",
        },
        {
          number: "Art.11",
          title: "Processing which does not require identification",
          objective:
            "Where purposes do not require identification of a data subject, the controller shall not be obliged to maintain additional information solely to identify the data subject.",
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
        },
        {
          number: "Art.13",
          title: "Information to be provided where data is collected from the data subject",
          objective:
            "At the time personal data is obtained, provide the data subject with identity of the controller, purposes and legal basis for processing, recipients, transfer information, retention period, and data subject rights.",
        },
        {
          number: "Art.14",
          title: "Information to be provided where data has not been obtained from the data subject",
          objective:
            "Within a reasonable period after obtaining data from other sources, provide the data subject with the required information including the source of the personal data.",
        },
        {
          number: "Art.15",
          title: "Right of access by the data subject",
          objective:
            "Ensure data subjects can obtain confirmation as to whether personal data is being processed, access to the data, and information about the processing.",
        },
        {
          number: "Art.16",
          title: "Right to rectification",
          objective:
            "Ensure data subjects have the right to obtain rectification of inaccurate personal data and completion of incomplete personal data.",
        },
        {
          number: "Art.17",
          title: "Right to erasure ('right to be forgotten')",
          objective:
            "Ensure data subjects can obtain the erasure of personal data when data is no longer necessary, consent is withdrawn, the subject objects, data was unlawfully processed, or erasure is required by law.",
        },
        {
          number: "Art.18",
          title: "Right to restriction of processing",
          objective:
            "Ensure data subjects can restrict processing when accuracy is contested, processing is unlawful, the controller no longer needs the data, or the subject has objected to processing.",
        },
        {
          number: "Art.19",
          title: "Notification obligation regarding rectification or erasure",
          objective:
            "Communicate any rectification, erasure, or restriction of processing to each recipient to whom personal data has been disclosed.",
        },
        {
          number: "Art.20",
          title: "Right to data portability",
          objective:
            "Ensure data subjects can receive their personal data in a structured, commonly used and machine-readable format and have the right to transmit that data to another controller.",
        },
        {
          number: "Art.21",
          title: "Right to object",
          objective:
            "Ensure data subjects can object at any time to processing of personal data based on public interest or legitimate interests, including profiling.",
        },
        {
          number: "Art.22",
          title: "Automated individual decision-making, including profiling",
          objective:
            "Ensure data subjects have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects or similarly significantly affects them.",
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
        },
        {
          number: "Art.25",
          title: "Data protection by design and by default",
          objective:
            "Implement appropriate technical and organisational measures designed to implement data-protection principles and integrate safeguards into processing, both at the time of design and by default.",
        },
        {
          number: "Art.26",
          title: "Joint controllers",
          objective:
            "Where two or more controllers jointly determine the purposes and means of processing, transparently determine their respective responsibilities for compliance.",
        },
        {
          number: "Art.27",
          title: "Representatives of controllers or processors not established in the Union",
          objective:
            "Designate in writing a representative in the Union where the controller or processor is not established in the Union but processes data of EU data subjects.",
        },
        {
          number: "Art.28",
          title: "Processor",
          objective:
            "Ensure processing by a processor is governed by a contract or legal act that binds the processor to the controller and sets out the subject-matter, duration, nature and purpose of processing.",
        },
        {
          number: "Art.29",
          title: "Processing under the authority of the controller or processor",
          objective:
            "Ensure any person acting under the authority of the controller or processor who has access to personal data does not process it except on instructions from the controller.",
        },
        {
          number: "Art.30",
          title: "Records of processing activities",
          objective:
            "Maintain a record of processing activities under the controller's or processor's responsibility, including purposes, categories of data, recipients, transfers, retention, and security measures.",
        },
        {
          number: "Art.31",
          title: "Cooperation with the supervisory authority",
          objective:
            "Cooperate, on request, with the supervisory authority in the performance of its tasks.",
        },
        {
          number: "Art.32",
          title: "Security of processing",
          objective:
            "Implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk, including pseudonymisation, encryption, confidentiality, integrity, availability, resilience, and regular testing.",
        },
        {
          number: "Art.33",
          title: "Notification of a personal data breach to the supervisory authority",
          objective:
            "Notify the supervisory authority of a personal data breach without undue delay and where feasible within 72 hours of becoming aware, unless the breach is unlikely to result in a risk to rights and freedoms.",
        },
        {
          number: "Art.34",
          title: "Communication of a personal data breach to the data subject",
          objective:
            "Communicate a personal data breach to the data subject without undue delay when the breach is likely to result in a high risk to their rights and freedoms.",
        },
        {
          number: "Art.35",
          title: "Data protection impact assessment",
          objective:
            "Carry out a data protection impact assessment where processing is likely to result in a high risk to the rights and freedoms of natural persons, particularly using new technologies.",
        },
        {
          number: "Art.36",
          title: "Prior consultation",
          objective:
            "Consult the supervisory authority prior to processing where a data protection impact assessment indicates that the processing would result in a high risk in the absence of mitigating measures.",
        },
        {
          number: "Art.37",
          title: "Designation of the data protection officer",
          objective:
            "Designate a data protection officer where processing is carried out by a public authority, core activities require regular and systematic monitoring of data subjects on a large scale, or core activities involve large scale processing of special categories of data.",
        },
        {
          number: "Art.38",
          title: "Position of the data protection officer",
          objective:
            "Ensure the DPO is involved in all issues relating to the protection of personal data, is provided with necessary resources, does not receive instructions regarding the exercise of their tasks, and reports directly to the highest management level.",
        },
        {
          number: "Art.39",
          title: "Tasks of the data protection officer",
          objective:
            "Ensure the DPO informs and advises the controller/processor, monitors compliance, provides advice on DPIAs, cooperates with the supervisory authority, and acts as a contact point.",
        },
        {
          number: "Art.40",
          title: "Codes of conduct",
          objective:
            "Encourage the drawing up of codes of conduct intended to contribute to the proper application of the GDPR, taking account of the specific features of the various processing sectors.",
        },
        {
          number: "Art.42",
          title: "Certification",
          objective:
            "Encourage the establishment of data protection certification mechanisms, seals and marks for the purpose of demonstrating compliance with the GDPR.",
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
        },
        {
          number: "Art.45",
          title: "Transfers on the basis of an adequacy decision",
          objective:
            "Verify that transfers to third countries take place based on an adequacy decision by the European Commission, where the third country ensures an adequate level of protection.",
        },
        {
          number: "Art.46",
          title: "Transfers subject to appropriate safeguards",
          objective:
            "In the absence of an adequacy decision, ensure transfers are subject to appropriate safeguards such as standard contractual clauses, binding corporate rules, or approved codes of conduct.",
        },
        {
          number: "Art.47",
          title: "Binding corporate rules",
          objective:
            "Where binding corporate rules are used, ensure they are legally binding, expressly confer enforceable rights on data subjects, and meet specific requirements regarding application, structure and content.",
        },
        {
          number: "Art.49",
          title: "Derogations for specific situations",
          objective:
            "Where no adequacy decision or appropriate safeguards exist, transfers may take place based on explicit consent, contractual necessity, important public interest, legal claims, vital interests, or from a public register.",
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
        },
      })
    }
  }

  const clauseCount = await prisma.clause.count({ where: { frameworkId: fwId } })
  const controlCount = await prisma.control.count({ where: { clause: { frameworkId: fwId } } })

  console.log(`[seed] GDPR seeded -- ${clauseCount} clauses, ${controlCount} controls`)
}
