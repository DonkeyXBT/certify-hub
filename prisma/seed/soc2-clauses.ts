import { PrismaClient } from "@prisma/client"

// ---------------------------------------------------------------------------
// SOC 2 Type II -- AICPA Trust Services Criteria (2017)
// ---------------------------------------------------------------------------

export async function seedSOC2(prisma: PrismaClient) {
  const framework = await prisma.framework.upsert({
    where: { code: "SOC2" },
    update: {
      name: "SOC 2 Type II",
      version: "2017",
      status: "PUBLISHED",
    },
    create: {
      code: "SOC2",
      name: "SOC 2 Type II",
      version: "2017",
      description:
        "AICPA Service Organization Control 2 Type II — Trust Services Criteria for security, availability, processing integrity, confidentiality and privacy. Evaluates the design and operating effectiveness of controls over a period of time.",
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

  interface CategoryDef {
    number: string
    title: string
    description: string
    category: string
    controls: ControlDef[]
  }

  const categories: CategoryDef[] = [
    // ── CC1: Control Environment ────────────────────────────────────────
    {
      number: "CC1",
      title: "Control Environment",
      description:
        "The set of standards, processes, and structures that provide the basis for carrying out internal control across the organization.",
      category: "Common Criteria",
      controls: [
        {
          number: "CC1.1",
          title: "COSO Principle 1: Demonstrates commitment to integrity and ethical values",
          objective:
            "The entity demonstrates a commitment to integrity and ethical values through its board of directors and management, sets standards of conduct, evaluates adherence, and addresses deviations in a timely manner.",
        },
        {
          number: "CC1.2",
          title: "COSO Principle 2: Exercises oversight responsibility",
          objective:
            "The board of directors demonstrates independence from management and exercises oversight of the development and performance of internal control.",
        },
        {
          number: "CC1.3",
          title: "COSO Principle 3: Establishes structure, authority, and responsibility",
          objective:
            "Management establishes, with board oversight, structures, reporting lines, and appropriate authorities and responsibilities in the pursuit of objectives.",
        },
        {
          number: "CC1.4",
          title: "COSO Principle 4: Demonstrates commitment to competence",
          objective:
            "The entity demonstrates a commitment to attract, develop, and retain competent individuals in alignment with objectives.",
        },
        {
          number: "CC1.5",
          title: "COSO Principle 5: Enforces accountability",
          objective:
            "The entity holds individuals accountable for their internal control responsibilities in the pursuit of objectives.",
        },
      ],
    },

    // ── CC2: Communication and Information ──────────────────────────────
    {
      number: "CC2",
      title: "Communication and Information",
      description:
        "Information necessary for the entity to carry out internal control responsibilities and communication to support internal control.",
      category: "Common Criteria",
      controls: [
        {
          number: "CC2.1",
          title: "COSO Principle 13: Uses relevant information",
          objective:
            "The entity obtains or generates and uses relevant, quality information to support the functioning of internal control.",
        },
        {
          number: "CC2.2",
          title: "COSO Principle 14: Communicates internally",
          objective:
            "The entity internally communicates information, including objectives and responsibilities for internal control, necessary to support the functioning of internal control.",
        },
        {
          number: "CC2.3",
          title: "COSO Principle 15: Communicates externally",
          objective:
            "The entity communicates with external parties regarding matters affecting the functioning of internal control.",
        },
      ],
    },

    // ── CC3: Risk Assessment ────────────────────────────────────────────
    {
      number: "CC3",
      title: "Risk Assessment",
      description:
        "The entity's process for identifying, analysing, and managing risks that could affect the achievement of its objectives.",
      category: "Common Criteria",
      controls: [
        {
          number: "CC3.1",
          title: "COSO Principle 6: Specifies suitable objectives",
          objective:
            "The entity specifies objectives with sufficient clarity to enable the identification and assessment of risks relating to objectives.",
        },
        {
          number: "CC3.2",
          title: "COSO Principle 7: Identifies and analyses risk",
          objective:
            "The entity identifies risks to the achievement of its objectives across the entity and analyses risks as a basis for determining how the risks should be managed.",
        },
        {
          number: "CC3.3",
          title: "COSO Principle 8: Assesses fraud risk",
          objective:
            "The entity considers the potential for fraud in assessing risks to the achievement of objectives.",
        },
        {
          number: "CC3.4",
          title: "COSO Principle 9: Identifies and analyses significant change",
          objective:
            "The entity identifies and assesses changes that could significantly impact the system of internal control.",
        },
      ],
    },

    // ── CC4: Monitoring Activities ──────────────────────────────────────
    {
      number: "CC4",
      title: "Monitoring Activities",
      description:
        "Ongoing evaluations, separate evaluations, or some combination of the two are used to ascertain whether controls are present and functioning.",
      category: "Common Criteria",
      controls: [
        {
          number: "CC4.1",
          title: "COSO Principle 16: Selects, develops, and performs ongoing/separate evaluations",
          objective:
            "The entity selects, develops, and performs ongoing and/or separate evaluations to ascertain whether the components of internal control are present and functioning.",
        },
        {
          number: "CC4.2",
          title: "COSO Principle 17: Evaluates and communicates deficiencies",
          objective:
            "The entity evaluates and communicates internal control deficiencies in a timely manner to those parties responsible for taking corrective action, including senior management and the board of directors.",
        },
      ],
    },

    // ── CC5: Control Activities ─────────────────────────────────────────
    {
      number: "CC5",
      title: "Control Activities",
      description:
        "Actions established through policies and procedures that help ensure that management's directives to mitigate risks are carried out.",
      category: "Common Criteria",
      controls: [
        {
          number: "CC5.1",
          title: "COSO Principle 10: Selects and develops control activities",
          objective:
            "The entity selects and develops control activities that contribute to the mitigation of risks to the achievement of objectives to acceptable levels.",
        },
        {
          number: "CC5.2",
          title: "COSO Principle 11: Selects and develops general controls over technology",
          objective:
            "The entity selects and develops general control activities over technology to support the achievement of objectives.",
        },
        {
          number: "CC5.3",
          title: "COSO Principle 12: Deploys through policies and procedures",
          objective:
            "The entity deploys control activities through policies that establish what is expected and procedures that put policies into action.",
        },
      ],
    },

    // ── CC6: Logical and Physical Access Controls ───────────────────────
    {
      number: "CC6",
      title: "Logical and Physical Access Controls",
      description:
        "Controls over the logical and physical access to the system, including restrictions of access based on authorisation and the physical protection of assets.",
      category: "Common Criteria",
      controls: [
        {
          number: "CC6.1",
          title: "Logical access security software, infrastructure and architectures",
          objective:
            "The entity implements logical access security software, infrastructure, and architectures over protected information assets to protect them from security events.",
        },
        {
          number: "CC6.2",
          title: "New internal and external user registration and authorisation",
          objective:
            "Prior to issuing system credentials and granting system access, the entity registers and authorises new internal and external users. User system credentials are removed when user access is no longer authorised.",
        },
        {
          number: "CC6.3",
          title: "Role-based access and least privilege",
          objective:
            "The entity authorises, modifies, or removes access to data, software, functions, and other protected information assets based on roles, responsibilities, or the system design and changes, giving consideration to the concepts of least privilege and segregation of duties.",
        },
        {
          number: "CC6.4",
          title: "Physical access restrictions",
          objective:
            "The entity restricts physical access to facilities and protected information assets to authorised personnel to meet the entity's objectives.",
        },
        {
          number: "CC6.5",
          title: "Disposal of protected information assets",
          objective:
            "The entity discontinues logical and physical protections over physical assets only after the ability to read or recover data and software from those assets has been diminished.",
        },
        {
          number: "CC6.6",
          title: "Logical access security measures against external threats",
          objective:
            "The entity implements logical access security measures to protect against threats from sources outside its system boundaries.",
        },
        {
          number: "CC6.7",
          title: "Transmission, movement, and removal restrictions",
          objective:
            "The entity restricts the transmission, movement, and removal of information to authorised internal and external users and processes, and protects it during transmission, movement, or removal.",
        },
        {
          number: "CC6.8",
          title: "Controls to prevent or detect against malicious software",
          objective:
            "The entity implements controls to prevent or detect and act upon the introduction of unauthorised or malicious software to meet the entity's objectives.",
        },
      ],
    },

    // ── CC7: System Operations ──────────────────────────────────────────
    {
      number: "CC7",
      title: "System Operations",
      description:
        "Controls over the operation and monitoring of the system to detect and respond to vulnerabilities, anomalies, and security incidents.",
      category: "Common Criteria",
      controls: [
        {
          number: "CC7.1",
          title: "Detection and monitoring procedures",
          objective:
            "To meet its objectives, the entity uses detection and monitoring procedures to identify changes to configurations that result in the introduction of new vulnerabilities, and susceptibilities to newly discovered vulnerabilities.",
        },
        {
          number: "CC7.2",
          title: "Monitoring system components for anomalies",
          objective:
            "The entity monitors system components and the operation of those components for anomalies that are indicative of malicious acts, natural disasters, and errors affecting the entity's ability to meet its objectives.",
        },
        {
          number: "CC7.3",
          title: "Evaluation of security events",
          objective:
            "The entity evaluates security events to determine whether they could or have resulted in a failure of the entity to meet its objectives (security incidents) and, if so, takes actions to prevent or address such failures.",
        },
        {
          number: "CC7.4",
          title: "Incident response",
          objective:
            "The entity responds to identified security incidents by executing a defined incident response programme to understand, contain, remediate, and communicate security incidents, as appropriate.",
        },
        {
          number: "CC7.5",
          title: "Incident recovery",
          objective:
            "The entity identifies, develops, and implements activities to recover from identified security incidents.",
        },
      ],
    },

    // ── CC8: Change Management ──────────────────────────────────────────
    {
      number: "CC8",
      title: "Change Management",
      description:
        "Controls over the lifecycle of changes to the system, from design and development through to deployment, including authorisation and testing.",
      category: "Common Criteria",
      controls: [
        {
          number: "CC8.1",
          title: "Changes to infrastructure, data, software, and procedures",
          objective:
            "The entity authorises, designs, develops or acquires, configures, documents, tests, approves, and implements changes to infrastructure, data, software, and procedures to meet its objectives.",
        },
      ],
    },

    // ── CC9: Risk Mitigation ────────────────────────────────────────────
    {
      number: "CC9",
      title: "Risk Mitigation",
      description:
        "Controls to identify, select, and develop risk mitigation activities including vendor and business partner management.",
      category: "Common Criteria",
      controls: [
        {
          number: "CC9.1",
          title: "Risk mitigation through business process controls",
          objective:
            "The entity identifies, selects, and develops risk mitigation activities for risks arising from potential business disruptions.",
        },
        {
          number: "CC9.2",
          title: "Vendor and business partner risk management",
          objective:
            "The entity assesses and manages risks associated with vendors and business partners.",
        },
      ],
    },

    // ── A: Availability ─────────────────────────────────────────────────
    {
      number: "A",
      title: "Availability",
      description:
        "Additional criteria for availability — the system is available for operation and use as committed or agreed.",
      category: "Availability",
      controls: [
        {
          number: "A1.1",
          title: "Capacity management and demand forecasting",
          objective:
            "The entity maintains, monitors, and evaluates current processing capacity and use of system components to manage capacity demand and to enable the implementation of additional capacity to help meet its objectives.",
        },
        {
          number: "A1.2",
          title: "Environmental protections, backup, and recovery infrastructure",
          objective:
            "The entity authorises, designs, develops or acquires, implements, operates, approves, maintains, and monitors environmental protections, software, data backup processes, and recovery infrastructure to meet its objectives.",
        },
        {
          number: "A1.3",
          title: "Recovery plan testing",
          objective:
            "The entity tests recovery plan procedures supporting system recovery to meet its objectives.",
        },
      ],
    },

    // ── PI: Processing Integrity ────────────────────────────────────────
    {
      number: "PI",
      title: "Processing Integrity",
      description:
        "Additional criteria for processing integrity — system processing is complete, valid, accurate, timely, and authorised.",
      category: "Processing Integrity",
      controls: [
        {
          number: "PI1.1",
          title: "Accuracy and completeness of inputs",
          objective:
            "The entity implements policies and procedures over system inputs to result in products, services, and reporting to meet the entity's objectives.",
        },
        {
          number: "PI1.2",
          title: "Accuracy and completeness of system processing",
          objective:
            "The entity implements policies and procedures over system processing to result in products, services, and reporting to meet the entity's objectives.",
        },
        {
          number: "PI1.3",
          title: "Accuracy and completeness of outputs",
          objective:
            "The entity implements policies and procedures over system outputs to result in products, services, and reporting to meet the entity's objectives.",
        },
        {
          number: "PI1.4",
          title: "Tracing information inputs through the system to outputs",
          objective:
            "The entity implements policies and procedures to make available or deliver output completely, accurately, and timely in accordance with specifications to meet the entity's objectives.",
        },
        {
          number: "PI1.5",
          title: "Processing integrity error handling",
          objective:
            "The entity implements policies and procedures to store inputs, items in processing, and outputs completely, accurately, and timely in accordance with system specifications to meet the entity's objectives.",
        },
      ],
    },

    // ── C: Confidentiality ──────────────────────────────────────────────
    {
      number: "C",
      title: "Confidentiality",
      description:
        "Additional criteria for confidentiality — information designated as confidential is protected as committed or agreed.",
      category: "Confidentiality",
      controls: [
        {
          number: "C1.1",
          title: "Identification and maintenance of confidential information",
          objective:
            "The entity identifies and maintains confidential information to meet the entity's objectives related to confidentiality.",
        },
        {
          number: "C1.2",
          title: "Disposal of confidential information",
          objective:
            "The entity disposes of confidential information to meet the entity's objectives related to confidentiality.",
        },
      ],
    },

    // ── P: Privacy ──────────────────────────────────────────────────────
    {
      number: "P",
      title: "Privacy",
      description:
        "Additional criteria for privacy — personal information is collected, used, retained, disclosed, and disposed of in conformity with commitments and system requirements.",
      category: "Privacy",
      controls: [
        {
          number: "P1.1",
          title: "Privacy notice and communication",
          objective:
            "The entity provides notice to data subjects about its privacy practices to meet the entity's objectives related to privacy.",
        },
        {
          number: "P2.1",
          title: "Choice and consent",
          objective:
            "The entity communicates choices available regarding the collection, use, retention, disclosure, and disposal of personal information to data subjects and obtains implicit or explicit consent.",
        },
        {
          number: "P3.1",
          title: "Collection limited to identified purposes",
          objective:
            "Personal information is collected consistent with the entity's objectives related to privacy.",
        },
        {
          number: "P3.2",
          title: "Explicit consent for sensitive information",
          objective:
            "For information requiring explicit consent, the entity communicates the need for such consent, as well as the consequences of a failure to provide consent, and obtains the consent prior to collection.",
        },
        {
          number: "P4.1",
          title: "Limiting use of personal information",
          objective:
            "The entity limits the use of personal information to the purposes identified in the entity's objectives related to privacy.",
        },
        {
          number: "P4.2",
          title: "Retention and disposal of personal information",
          objective:
            "The entity retains personal information consistent with the entity's objectives related to privacy and securely disposes of such information when it is no longer needed.",
        },
        {
          number: "P4.3",
          title: "Access to personal information",
          objective:
            "The entity provides data subjects with access to their personal information for review and update.",
        },
        {
          number: "P5.1",
          title: "Third-party disclosures and transfers",
          objective:
            "The entity discloses or transfers personal information to third parties only for the purposes identified in the entity's objectives related to privacy and with the implicit or explicit consent of the data subject.",
        },
        {
          number: "P5.2",
          title: "Authorised disclosures and transfers",
          objective:
            "The entity creates and retains a complete, accurate, and timely record of authorised disclosures and transfers of personal information.",
        },
        {
          number: "P6.1",
          title: "Quality of personal information",
          objective:
            "The entity collects and maintains accurate, up-to-date, complete, and relevant personal information to meet the entity's objectives related to privacy.",
        },
        {
          number: "P6.2",
          title: "Dispute resolution for personal information quality",
          objective:
            "The entity provides a process for data subjects to dispute the completeness and accuracy of their personal information maintained by the entity and to have it corrected.",
        },
        {
          number: "P7.1",
          title: "Monitoring and enforcement of privacy policies",
          objective:
            "The entity monitors compliance with its privacy policies and procedures and has a process to address privacy-related inquiries, complaints, and disputes.",
        },
        {
          number: "P8.1",
          title: "Privacy incident and breach management",
          objective:
            "The entity implements a process for receiving, addressing, resolving, and communicating the resolution of inquiries, complaints, and disputes from data subjects and for notifying affected parties of privacy breaches and incidents.",
        },
      ],
    },
  ]

  let sortOrder = 0

  for (const cat of categories) {
    const parentClause = await prisma.clause.create({
      data: {
        frameworkId: fwId,
        number: cat.number,
        title: cat.title,
        description: cat.description,
        isAnnex: false,
        sortOrder: sortOrder++,
      },
    })

    for (const ctrl of cat.controls) {
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
          category: cat.category,
          objective: ctrl.objective,
        },
      })
    }
  }

  const clauseCount = await prisma.clause.count({ where: { frameworkId: fwId } })
  const controlCount = await prisma.control.count({ where: { clause: { frameworkId: fwId } } })

  console.log(`[seed] SOC 2 Type II seeded -- ${clauseCount} clauses, ${controlCount} controls`)
}
