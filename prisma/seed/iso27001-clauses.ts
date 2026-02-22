import { PrismaClient } from "@prisma/client";

// ---------------------------------------------------------------------------
// ISO/IEC 27001:2022 -- Complete clause & Annex A seed data
// ---------------------------------------------------------------------------

export async function seedISO27001(prisma: PrismaClient) {
  // ── 1. Upsert the Framework record ──────────────────────────────────────
  const framework = await prisma.framework.upsert({
    where: { code: "ISO27001" },
    update: {
      name: "ISO/IEC 27001:2022",
      version: "2022",
      status: "PUBLISHED",
    },
    create: {
      code: "ISO27001",
      name: "ISO/IEC 27001:2022",
      version: "2022",
      description:
        "Information security, cybersecurity and privacy protection -- Information security management systems -- Requirements",
      status: "PUBLISHED",
    },
  });

  const fwId = framework.id;

  // Helper: delete existing clauses & controls so the seed is idempotent.
  // Controls are cascade-deleted when their parent clause is removed.
  await prisma.clause.deleteMany({ where: { frameworkId: fwId } });

  // ── 2. Main clauses (4-10) with sub-clauses ─────────────────────────────

  interface SubClauseDef {
    number: string;
    title: string;
    description: string;
  }

  interface MainClauseDef {
    number: string;
    title: string;
    description: string;
    children: SubClauseDef[];
  }

  const mainClauses: MainClauseDef[] = [
    {
      number: "4",
      title: "Context of the organization",
      description:
        "Understanding the organization, its context, the needs and expectations of interested parties, and determining the scope of the ISMS.",
      children: [
        {
          number: "4.1",
          title: "Understanding the organization and its context",
          description:
            "Determine external and internal issues relevant to the organization's purpose that affect its ability to achieve the intended outcomes of the ISMS.",
        },
        {
          number: "4.2",
          title:
            "Understanding the needs and expectations of interested parties",
          description:
            "Determine interested parties relevant to the ISMS and their requirements, including legal, regulatory and contractual obligations.",
        },
        {
          number: "4.3",
          title: "Determining the scope of the information security management system",
          description:
            "Determine the boundaries and applicability of the ISMS, considering external and internal issues, requirements of interested parties, and interfaces and dependencies.",
        },
        {
          number: "4.4",
          title: "Information security management system",
          description:
            "Establish, implement, maintain and continually improve an ISMS in accordance with the requirements of this document.",
        },
      ],
    },
    {
      number: "5",
      title: "Leadership",
      description:
        "Top management commitment, information security policy, and organizational roles, responsibilities and authorities.",
      children: [
        {
          number: "5.1",
          title: "Leadership and commitment",
          description:
            "Top management shall demonstrate leadership and commitment with respect to the ISMS by ensuring policy and objectives are established, integrating ISMS requirements into processes, and ensuring resources are available.",
        },
        {
          number: "5.2",
          title: "Policy",
          description:
            "Top management shall establish an information security policy that is appropriate, includes objectives or a framework for setting objectives, includes commitment to satisfy applicable requirements, and includes commitment to continual improvement.",
        },
        {
          number: "5.3",
          title: "Organizational roles, responsibilities and authorities",
          description:
            "Top management shall ensure responsibilities and authorities for roles relevant to information security are assigned and communicated within the organization.",
        },
      ],
    },
    {
      number: "6",
      title: "Planning",
      description:
        "Actions to address risks and opportunities, information security objectives, and planning of changes.",
      children: [
        {
          number: "6.1",
          title: "Actions to address risks and opportunities",
          description:
            "When planning for the ISMS, consider issues and requirements and determine risks and opportunities that need to be addressed to ensure the ISMS achieves its intended outcomes, prevent or reduce undesired effects, and achieve continual improvement.",
        },
        {
          number: "6.2",
          title: "Information security objectives and planning to achieve them",
          description:
            "Establish information security objectives at relevant functions and levels that are consistent with the policy, measurable, take into account applicable requirements and risk assessment results, and are monitored, communicated and updated as appropriate.",
        },
        {
          number: "6.3",
          title: "Planning of changes",
          description:
            "When the organization determines the need for changes to the ISMS, the changes shall be carried out in a planned manner.",
        },
      ],
    },
    {
      number: "7",
      title: "Support",
      description:
        "Resources, competence, awareness, communication, and documented information required for the ISMS.",
      children: [
        {
          number: "7.1",
          title: "Resources",
          description:
            "Determine and provide the resources needed for the establishment, implementation, maintenance and continual improvement of the ISMS.",
        },
        {
          number: "7.2",
          title: "Competence",
          description:
            "Determine necessary competence of persons doing work under the organization's control that affects information security performance, and ensure they are competent on the basis of education, training or experience.",
        },
        {
          number: "7.3",
          title: "Awareness",
          description:
            "Persons doing work under the organization's control shall be aware of the information security policy, their contribution to ISMS effectiveness, and the implications of not conforming with ISMS requirements.",
        },
        {
          number: "7.4",
          title: "Communication",
          description:
            "Determine the need for internal and external communications relevant to the ISMS including what, when, with whom, and how to communicate.",
        },
        {
          number: "7.5",
          title: "Documented information",
          description:
            "The ISMS shall include documented information required by this document and determined by the organization as necessary for ISMS effectiveness. Creation, updating, and control of documented information shall be addressed.",
        },
      ],
    },
    {
      number: "8",
      title: "Operation",
      description:
        "Operational planning and control, information security risk assessment, and risk treatment.",
      children: [
        {
          number: "8.1",
          title: "Operational planning and control",
          description:
            "Plan, implement and control the processes needed to meet information security requirements and implement the actions determined in planning. Keep documented information to have confidence processes have been carried out as planned.",
        },
        {
          number: "8.2",
          title: "Information security risk assessment",
          description:
            "Perform information security risk assessments at planned intervals or when significant changes are proposed or occur, considering the criteria established earlier.",
        },
        {
          number: "8.3",
          title: "Information security risk treatment",
          description:
            "Implement the information security risk treatment plan and retain documented information of the results.",
        },
      ],
    },
    {
      number: "9",
      title: "Performance evaluation",
      description:
        "Monitoring, measurement, analysis, evaluation, internal audit, and management review of the ISMS.",
      children: [
        {
          number: "9.1",
          title: "Monitoring, measurement, analysis and evaluation",
          description:
            "Determine what needs to be monitored and measured, the methods for monitoring measurement analysis and evaluation, when monitoring and measuring shall be performed, and who shall analyse and evaluate the results.",
        },
        {
          number: "9.2",
          title: "Internal audit",
          description:
            "Conduct internal audits at planned intervals to provide information on whether the ISMS conforms to the organization's own requirements and the requirements of this document, and is effectively implemented and maintained.",
        },
        {
          number: "9.3",
          title: "Management review",
          description:
            "Top management shall review the ISMS at planned intervals to ensure its continuing suitability, adequacy and effectiveness. The review shall consider the status of actions from previous reviews, changes in external and internal issues, and information on ISMS performance.",
        },
      ],
    },
    {
      number: "10",
      title: "Improvement",
      description:
        "Continual improvement, nonconformity and corrective action for the ISMS.",
      children: [
        {
          number: "10.1",
          title: "Continual improvement",
          description:
            "Continually improve the suitability, adequacy and effectiveness of the ISMS.",
        },
        {
          number: "10.2",
          title: "Nonconformity and corrective action",
          description:
            "When a nonconformity occurs, react to the nonconformity, evaluate the need for action to eliminate causes, implement any action needed, review the effectiveness of corrective action, and make changes to the ISMS if necessary.",
        },
      ],
    },
  ];

  // Create main clauses and their children sequentially to obtain parent IDs.
  let sortOrder = 0;
  for (const mc of mainClauses) {
    const parent = await prisma.clause.create({
      data: {
        frameworkId: fwId,
        number: mc.number,
        title: mc.title,
        description: mc.description,
        isAnnex: false,
        sortOrder: sortOrder++,
      },
    });

    for (const child of mc.children) {
      await prisma.clause.create({
        data: {
          frameworkId: fwId,
          parentId: parent.id,
          number: child.number,
          title: child.title,
          description: child.description,
          isAnnex: false,
          sortOrder: sortOrder++,
        },
      });
    }
  }

  // ── 3. Annex A controls ─────────────────────────────────────────────────

  interface ControlDef {
    number: string;
    title: string;
    objective: string;
  }

  interface AnnexCategoryDef {
    number: string;
    title: string;
    description: string;
    category: string;
    controls: ControlDef[];
  }

  const annexCategories: AnnexCategoryDef[] = [
    // ── A.5 Organizational controls (37) ──────────────────────────────────
    {
      number: "A.5",
      title: "Organizational controls",
      description:
        "Controls related to organizational policies, procedures, roles, responsibilities and management of information security.",
      category: "Organizational",
      controls: [
        {
          number: "A.5.1",
          title: "Policies for information security",
          objective:
            "To provide management direction and support for information security in accordance with business requirements and relevant laws and regulations.",
        },
        {
          number: "A.5.2",
          title: "Information security roles and responsibilities",
          objective:
            "To establish a defined and approved structure for the implementation, operation and management of information security within the organization.",
        },
        {
          number: "A.5.3",
          title: "Segregation of duties",
          objective:
            "To reduce the risk of fraud, error and bypassing of information security controls by ensuring conflicting duties and responsibilities are segregated.",
        },
        {
          number: "A.5.4",
          title: "Management responsibilities",
          objective:
            "To ensure management directs all personnel to apply information security in accordance with the established policies and procedures of the organization.",
        },
        {
          number: "A.5.5",
          title: "Contact with authorities",
          objective:
            "To maintain appropriate contact with relevant authorities for the timely exchange of information regarding information security issues.",
        },
        {
          number: "A.5.6",
          title: "Contact with special interest groups",
          objective:
            "To maintain appropriate contacts with special interest groups or other specialist security forums and professional associations to improve knowledge and practice of information security.",
        },
        {
          number: "A.5.7",
          title: "Threat intelligence",
          objective:
            "To provide awareness of the organization's threat environment so that appropriate mitigating actions can be taken.",
        },
        {
          number: "A.5.8",
          title: "Information security in project management",
          objective:
            "To ensure that information security is integrated into project management regardless of the type of project.",
        },
        {
          number: "A.5.9",
          title: "Inventory of information and other associated assets",
          objective:
            "To identify the organization's information and other associated assets and define appropriate protection responsibilities.",
        },
        {
          number: "A.5.10",
          title: "Acceptable use of information and other associated assets",
          objective:
            "To ensure information and other associated assets are appropriately protected, used and handled.",
        },
        {
          number: "A.5.11",
          title: "Return of assets",
          objective:
            "To protect the organization's assets as part of the process of changing or terminating employment, contract or agreement.",
        },
        {
          number: "A.5.12",
          title: "Classification of information",
          objective:
            "To ensure that information receives an appropriate level of protection in accordance with its importance to the organization.",
        },
        {
          number: "A.5.13",
          title: "Labelling of information",
          objective:
            "To facilitate the communication of information classification and support automation of information processing and management.",
        },
        {
          number: "A.5.14",
          title: "Information transfer",
          objective:
            "To maintain the security of information transferred within the organization and with any external entity.",
        },
        {
          number: "A.5.15",
          title: "Access control",
          objective:
            "To ensure authorized access and to prevent unauthorized access to information and other associated assets.",
        },
        {
          number: "A.5.16",
          title: "Identity management",
          objective:
            "To allow identification of individuals and systems accessing the organization's information and other associated assets and to assign appropriate access rights.",
        },
        {
          number: "A.5.17",
          title: "Authentication information",
          objective:
            "To ensure proper authentication of the entity and prevent failures of authentication processes that could lead to unauthorized access.",
        },
        {
          number: "A.5.18",
          title: "Access rights",
          objective:
            "To ensure access to information and other associated assets is defined and authorized in accordance with business and information security requirements.",
        },
        {
          number: "A.5.19",
          title: "Information security in supplier relationships",
          objective:
            "To maintain an agreed level of information security in supplier relationships.",
        },
        {
          number: "A.5.20",
          title:
            "Addressing information security within supplier agreements",
          objective:
            "To establish and mutually agree on relevant information security requirements with each supplier based on the type of supplier relationship.",
        },
        {
          number: "A.5.21",
          title:
            "Managing information security in the ICT supply chain",
          objective:
            "To maintain an agreed level of information security in supplier relationships throughout the ICT product and service supply chain.",
        },
        {
          number: "A.5.22",
          title:
            "Monitoring, review and change management of supplier services",
          objective:
            "To maintain an agreed level of information security and service delivery in line with supplier agreements.",
        },
        {
          number: "A.5.23",
          title: "Information security for use of cloud services",
          objective:
            "To specify and manage information security for the use of cloud services.",
        },
        {
          number: "A.5.24",
          title:
            "Information security incident management planning and preparation",
          objective:
            "To ensure a quick, effective and orderly response to information security incidents including communication on information security events.",
        },
        {
          number: "A.5.25",
          title:
            "Assessment and decision on information security events",
          objective:
            "To ensure that information security events are assessed and decided upon whether to categorize them as information security incidents.",
        },
        {
          number: "A.5.26",
          title: "Response to information security incidents",
          objective:
            "To ensure that information security incidents are responded to in accordance with documented procedures.",
        },
        {
          number: "A.5.27",
          title: "Learning from information security incidents",
          objective:
            "To reduce the likelihood or consequences of future information security incidents by making use of knowledge gained from information security incidents.",
        },
        {
          number: "A.5.28",
          title: "Collection of evidence",
          objective:
            "To ensure proper identification, collection, acquisition and preservation of information related to information security events for evidence purposes.",
        },
        {
          number: "A.5.29",
          title: "Information security during disruption",
          objective:
            "To protect information and other associated assets during disruption.",
        },
        {
          number: "A.5.30",
          title: "ICT readiness for business continuity",
          objective:
            "To ensure the availability of the organization's information and other associated assets during disruption.",
        },
        {
          number: "A.5.31",
          title:
            "Legal, statutory, regulatory and contractual requirements",
          objective:
            "To ensure compliance with legal, statutory, regulatory and contractual requirements related to information security and the organization's approach to meet these requirements.",
        },
        {
          number: "A.5.32",
          title: "Intellectual property rights",
          objective:
            "To ensure compliance with legal, statutory, regulatory and contractual requirements related to intellectual property rights and the use of proprietary products.",
        },
        {
          number: "A.5.33",
          title: "Protection of records",
          objective:
            "To ensure protection of records from loss, destruction, falsification, unauthorized access and unauthorized release in accordance with legal, statutory, regulatory, contractual and business requirements.",
        },
        {
          number: "A.5.34",
          title: "Privacy and protection of PII",
          objective:
            "To ensure compliance with legal, statutory, regulatory and contractual requirements related to the privacy and protection of personally identifiable information (PII).",
        },
        {
          number: "A.5.35",
          title: "Independent review of information security",
          objective:
            "To ensure the continuing suitability, adequacy and effectiveness of the organization's approach to managing information security.",
        },
        {
          number: "A.5.36",
          title:
            "Compliance with policies, rules and standards for information security",
          objective:
            "To ensure that information security is implemented and operated in accordance with the organization's policies, rules and standards.",
        },
        {
          number: "A.5.37",
          title: "Documented operating procedures",
          objective:
            "To ensure the correct and secure operation of information processing facilities.",
        },
      ],
    },

    // ── A.6 People controls (8) ───────────────────────────────────────────
    {
      number: "A.6",
      title: "People controls",
      description:
        "Controls related to people prior to, during and after employment or engagement.",
      category: "People",
      controls: [
        {
          number: "A.6.1",
          title: "Screening",
          objective:
            "To ensure that all candidates for employment are suitable, understand their responsibilities and are fit for the roles for which they are considered.",
        },
        {
          number: "A.6.2",
          title: "Terms and conditions of employment",
          objective:
            "To ensure employees and contractors understand and fulfil their information security responsibilities.",
        },
        {
          number: "A.6.3",
          title:
            "Information security awareness, education and training",
          objective:
            "To ensure personnel and relevant interested parties are aware and fulfil their information security responsibilities through appropriate awareness, education and training.",
        },
        {
          number: "A.6.4",
          title: "Disciplinary process",
          objective:
            "To ensure there is a formal and communicated disciplinary process to take action against personnel who have committed an information security policy violation.",
        },
        {
          number: "A.6.5",
          title:
            "Responsibilities after termination or change of employment",
          objective:
            "To protect the organization's interests as part of the process of changing or terminating employment.",
        },
        {
          number: "A.6.6",
          title: "Confidentiality or non-disclosure agreements",
          objective:
            "To maintain confidentiality of information accessible by personnel or external parties.",
        },
        {
          number: "A.6.7",
          title: "Remote working",
          objective:
            "To ensure the security of information when personnel are working remotely.",
        },
        {
          number: "A.6.8",
          title: "Information security event reporting",
          objective:
            "To support timely, consistent and effective reporting of information security events that can be identified by personnel.",
        },
      ],
    },

    // ── A.7 Physical controls (14) ────────────────────────────────────────
    {
      number: "A.7",
      title: "Physical controls",
      description:
        "Controls related to physical security of premises, equipment, and supporting infrastructure.",
      category: "Physical",
      controls: [
        {
          number: "A.7.1",
          title: "Physical security perimeters",
          objective:
            "To prevent unauthorized physical access, damage and interference to the organization's information and other associated assets.",
        },
        {
          number: "A.7.2",
          title: "Physical entry",
          objective:
            "To ensure only authorized access to secure areas occurs by applying appropriate entry controls.",
        },
        {
          number: "A.7.3",
          title: "Securing offices, rooms and facilities",
          objective:
            "To prevent unauthorized physical access, damage and interference to the organization's information and other associated assets in offices, rooms and facilities.",
        },
        {
          number: "A.7.4",
          title: "Physical security monitoring",
          objective:
            "To detect and deter unauthorized physical access by applying monitoring and surveillance measures.",
        },
        {
          number: "A.7.5",
          title:
            "Protecting against physical and environmental threats",
          objective:
            "To prevent or reduce the consequences of events arising from physical and environmental threats.",
        },
        {
          number: "A.7.6",
          title: "Working in secure areas",
          objective:
            "To protect information and other associated assets in secure areas from damage and unauthorized interference by personnel working in and around these areas.",
        },
        {
          number: "A.7.7",
          title: "Clear desk and clear screen",
          objective:
            "To reduce the risks of unauthorized access, loss and damage to information on desks, screens and in other accessible locations during and outside normal working hours.",
        },
        {
          number: "A.7.8",
          title: "Equipment siting and protection",
          objective:
            "To reduce the risks from environmental threats and hazards and from opportunities for unauthorized access.",
        },
        {
          number: "A.7.9",
          title: "Security of assets off-premises",
          objective:
            "To prevent loss, damage, theft or compromise of off-site assets and interruption to the organization's operations.",
        },
        {
          number: "A.7.10",
          title: "Storage media",
          objective:
            "To prevent unauthorized disclosure, modification, removal or destruction of information stored on storage media.",
        },
        {
          number: "A.7.11",
          title: "Supporting utilities",
          objective:
            "To prevent loss, damage or compromise of information and other associated assets or interruption to business operations caused by failures and disruptions of supporting utilities.",
        },
        {
          number: "A.7.12",
          title: "Cabling security",
          objective:
            "To prevent interception, interference or damage to power and telecommunications cabling carrying data or supporting information services.",
        },
        {
          number: "A.7.13",
          title: "Equipment maintenance",
          objective:
            "To prevent loss, damage, theft or compromise of information and other associated assets and interruption to the organization's operations caused by lack of maintenance.",
        },
        {
          number: "A.7.14",
          title: "Secure disposal or re-use of equipment",
          objective:
            "To prevent leakage of information from equipment that is to be disposed of or re-used.",
        },
      ],
    },

    // ── A.8 Technological controls (34) ───────────────────────────────────
    {
      number: "A.8",
      title: "Technological controls",
      description:
        "Controls related to technology used in information processing and communication.",
      category: "Technological",
      controls: [
        {
          number: "A.8.1",
          title: "User endpoint devices",
          objective:
            "To protect information stored on, processed by or accessible via user endpoint devices.",
        },
        {
          number: "A.8.2",
          title: "Privileged access rights",
          objective:
            "To ensure only authorized users, software components and services are provided with privileged access rights and to restrict and manage the allocation and use of privileged access rights.",
        },
        {
          number: "A.8.3",
          title: "Information access restriction",
          objective:
            "To ensure authorized access only and prevent unauthorized access to information and other associated assets.",
        },
        {
          number: "A.8.4",
          title: "Access to source code",
          objective:
            "To prevent the introduction of unauthorized functionality and to avoid unintentional or deliberate changes to source code.",
        },
        {
          number: "A.8.5",
          title: "Secure authentication",
          objective:
            "To ensure a user or entity is securely authenticated when access to systems, applications and services is granted.",
        },
        {
          number: "A.8.6",
          title: "Capacity management",
          objective:
            "To ensure that required information processing facilities, human resources, offices and other facilities capacity is adequate for current and projected capacity requirements.",
        },
        {
          number: "A.8.7",
          title: "Protection against malware",
          objective:
            "To ensure that information and other associated assets are protected against malware.",
        },
        {
          number: "A.8.8",
          title: "Management of technical vulnerabilities",
          objective:
            "To prevent exploitation of technical vulnerabilities and to reduce the risks arising from exploitation of published technical vulnerabilities.",
        },
        {
          number: "A.8.9",
          title: "Configuration management",
          objective:
            "To ensure that hardware, software, services and networks are correctly configured and that configurations are properly managed and controlled throughout their lifecycle.",
        },
        {
          number: "A.8.10",
          title: "Information deletion",
          objective:
            "To prevent unnecessary exposure of information and to comply with legal, statutory, regulatory and contractual requirements for information deletion.",
        },
        {
          number: "A.8.11",
          title: "Data masking",
          objective:
            "To limit the exposure of sensitive data including PII and to comply with legal, statutory, regulatory and contractual requirements.",
        },
        {
          number: "A.8.12",
          title: "Data leakage prevention",
          objective:
            "To detect and prevent the unauthorized disclosure and extraction of information by individuals or systems.",
        },
        {
          number: "A.8.13",
          title: "Information backup",
          objective:
            "To allow recovery from loss of data or systems in accordance with the backup policy.",
        },
        {
          number: "A.8.14",
          title: "Redundancy of information processing facilities",
          objective:
            "To ensure the required availability of information processing facilities.",
        },
        {
          number: "A.8.15",
          title: "Logging",
          objective:
            "To record events, generate evidence, ensure the integrity of log information, prevent against unauthorized access, identify information security events and to support investigations.",
        },
        {
          number: "A.8.16",
          title: "Monitoring activities",
          objective:
            "To detect anomalous behaviour and potential information security incidents.",
        },
        {
          number: "A.8.17",
          title: "Clock synchronization",
          objective:
            "To enable the correlation of events and other recorded data and to support investigations of information security incidents.",
        },
        {
          number: "A.8.18",
          title: "Use of privileged utility programs",
          objective:
            "To prevent the unauthorized or unintended use of utility programs that might be capable of overriding system and application controls.",
        },
        {
          number: "A.8.19",
          title: "Installation of software on operational systems",
          objective:
            "To ensure the integrity of operational systems and to prevent exploitation of technical vulnerabilities.",
        },
        {
          number: "A.8.20",
          title: "Networks security",
          objective:
            "To protect information in networks and supporting information processing facilities from compromise via the network.",
        },
        {
          number: "A.8.21",
          title: "Security of network services",
          objective:
            "To ensure the security of network services and to protect the information transferred over networks.",
        },
        {
          number: "A.8.22",
          title: "Segregation of networks",
          objective:
            "To divide the network into security-defined perimeters and to control the traffic between them based on business needs.",
        },
        {
          number: "A.8.23",
          title: "Web filtering",
          objective:
            "To protect systems from being compromised by malware and to prevent access to unauthorized web resources.",
        },
        {
          number: "A.8.24",
          title: "Use of cryptography",
          objective:
            "To ensure proper and effective use of cryptography to protect the confidentiality, authenticity and integrity of information.",
        },
        {
          number: "A.8.25",
          title: "Secure development life cycle",
          objective:
            "To ensure information security is designed and implemented within the development life cycle of software and systems.",
        },
        {
          number: "A.8.26",
          title: "Application security requirements",
          objective:
            "To ensure all information security requirements are identified and addressed when developing or acquiring applications.",
        },
        {
          number: "A.8.27",
          title: "Secure system architecture and engineering principles",
          objective:
            "To ensure that information systems are securely designed and engineered across the entire development life cycle.",
        },
        {
          number: "A.8.28",
          title: "Secure coding",
          objective:
            "To ensure that software is written securely to reduce the number of potential information security vulnerabilities in the software.",
        },
        {
          number: "A.8.29",
          title: "Security testing in development and acceptance",
          objective:
            "To validate that information security requirements are met when applications or code are deployed to the production environment.",
        },
        {
          number: "A.8.30",
          title: "Outsourced development",
          objective:
            "To ensure that information security measures required by the organization are implemented in outsourced system development.",
        },
        {
          number: "A.8.31",
          title:
            "Separation of development, test and production environments",
          objective:
            "To protect the production environment and data from compromise by development and test activities.",
        },
        {
          number: "A.8.32",
          title: "Change management",
          objective:
            "To ensure that information security is not compromised when changes are executed in the information processing facilities and systems.",
        },
        {
          number: "A.8.33",
          title: "Test information",
          objective:
            "To ensure the appropriate protection of information used for testing.",
        },
        {
          number: "A.8.34",
          title:
            "Protection of information systems during audit testing",
          objective:
            "To minimize the impact of audit and other assurance activities on operational systems and business processes.",
        },
      ],
    },
  ];

  // Create each Annex A category clause and its controls.
  for (const cat of annexCategories) {
    const categoryClause = await prisma.clause.create({
      data: {
        frameworkId: fwId,
        number: cat.number,
        title: cat.title,
        description: cat.description,
        isAnnex: true,
        sortOrder: sortOrder++,
      },
    });

    for (const ctrl of cat.controls) {
      await prisma.control.create({
        data: {
          clauseId: categoryClause.id,
          number: ctrl.number,
          title: ctrl.title,
          category: cat.category,
          objective: ctrl.objective,
        },
      });
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────
  const clauseCount = await prisma.clause.count({
    where: { frameworkId: fwId },
  });
  const controlCount = await prisma.control.count({
    where: { clause: { frameworkId: fwId } },
  });

  console.log(
    `[seed] ISO 27001:2022 seeded -- ${clauseCount} clauses, ${controlCount} controls`
  );
}
