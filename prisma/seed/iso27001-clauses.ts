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
    guidance: string;
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
          guidance:
            "- Draft an information security policy aligned with business objectives and regulatory requirements\n- Obtain formal approval from top management and document the approval date\n- Communicate the policy to all employees and relevant external parties through onboarding and intranet\n- Define topic-specific policies (e.g., access control, data classification) that support the overarching policy\n- Review and update the policy at planned intervals or when significant changes occur\n- Maintain version control and distribution records for all policy documents",
        },
        {
          number: "A.5.2",
          title: "Information security roles and responsibilities",
          objective:
            "To establish a defined and approved structure for the implementation, operation and management of information security within the organization.",
          guidance:
            "- Define and document all information security roles including CISO, asset owners, risk owners and security champions\n- Assign responsibilities using a RACI matrix for each key security process\n- Ensure each role has a named individual and a documented backup or deputy\n- Communicate role assignments to relevant stakeholders and include them in job descriptions\n- Review and update role assignments at least annually or upon organizational changes",
        },
        {
          number: "A.5.3",
          title: "Segregation of duties",
          objective:
            "To reduce the risk of fraud, error and bypassing of information security controls by ensuring conflicting duties and responsibilities are segregated.",
          guidance:
            "- Map all critical business processes and identify duties that must be separated (e.g., request vs. approval, development vs. deployment)\n- Implement technical controls such as role-based access to enforce segregation in IT systems\n- Where full segregation is not possible due to team size, implement compensating controls such as audit logging and periodic reviews\n- Document all segregation decisions and exceptions with management approval\n- Review segregation of duties arrangements at least annually or when roles change",
        },
        {
          number: "A.5.4",
          title: "Management responsibilities",
          objective:
            "To ensure management directs all personnel to apply information security in accordance with the established policies and procedures of the organization.",
          guidance:
            "- Include information security responsibilities in management performance objectives\n- Require managers to ensure their teams complete mandatory security awareness training\n- Hold managers accountable for enforcing security policies within their departments\n- Provide managers with regular security briefings and reporting dashboards\n- Include security compliance as a factor in management reviews and performance appraisals",
        },
        {
          number: "A.5.5",
          title: "Contact with authorities",
          objective:
            "To maintain appropriate contact with relevant authorities for the timely exchange of information regarding information security issues.",
          guidance:
            "- Identify all relevant authorities including data protection regulators, law enforcement, sector-specific regulators and CERT teams\n- Maintain a contact register with names, phone numbers, email addresses and escalation procedures\n- Define when and how to report incidents to each authority including mandatory breach notification timelines\n- Assign responsibility for managing authority relationships to specific roles\n- Test the authority notification process at least annually through tabletop exercises",
        },
        {
          number: "A.5.6",
          title: "Contact with special interest groups",
          objective:
            "To maintain appropriate contacts with special interest groups or other specialist security forums and professional associations to improve knowledge and practice of information security.",
          guidance:
            "- Identify relevant industry groups, ISACs, professional associations and security forums for the organization's sector\n- Assign staff members to actively participate in selected groups and report back findings\n- Subscribe to threat intelligence feeds, mailing lists and vulnerability advisories from trusted groups\n- Share non-sensitive threat information and lessons learned with peer organizations where appropriate\n- Review memberships annually to ensure they remain relevant and provide value",
        },
        {
          number: "A.5.7",
          title: "Threat intelligence",
          objective:
            "To provide awareness of the organization's threat environment so that appropriate mitigating actions can be taken.",
          guidance:
            "- Subscribe to threat intelligence feeds relevant to the organization's industry and technology stack\n- Establish a process to collect, analyse and disseminate threat intelligence across strategic, tactical and operational levels\n- Integrate threat intelligence into risk assessment and vulnerability management processes\n- Brief senior management on significant threat developments and their potential business impact\n- Review and act on threat intelligence reports at least weekly and distribute actionable indicators to security operations",
        },
        {
          number: "A.5.8",
          title: "Information security in project management",
          objective:
            "To ensure that information security is integrated into project management regardless of the type of project.",
          guidance:
            "- Include information security requirements gathering as a mandatory step in the project initiation phase\n- Require a security risk assessment for every project, proportionate to the project's scope and data sensitivity\n- Assign a security advisor or checkpoint reviewer for projects handling sensitive data or critical systems\n- Include security acceptance criteria in project deliverables and gate reviews\n- Conduct a security review at project closure to verify all requirements have been met and document lessons learned",
        },
        {
          number: "A.5.9",
          title: "Inventory of information and other associated assets",
          objective:
            "To identify the organization's information and other associated assets and define appropriate protection responsibilities.",
          guidance:
            "- Create and maintain a comprehensive asset inventory covering information assets, hardware, software, cloud services and personnel\n- Assign a designated owner for each asset who is responsible for its protection throughout its lifecycle\n- Record key attributes for each asset including classification level, location, custodian and business criticality\n- Integrate the asset inventory with configuration management and procurement processes to keep it current\n- Review and reconcile the asset inventory at least quarterly and upon significant infrastructure changes",
        },
        {
          number: "A.5.10",
          title: "Acceptable use of information and other associated assets",
          objective:
            "To ensure information and other associated assets are appropriately protected, used and handled.",
          guidance:
            "- Draft an acceptable use policy covering email, internet, mobile devices, cloud services and social media\n- Require all employees and contractors to acknowledge the policy before being granted access to organizational assets\n- Define permitted and prohibited uses with clear examples relevant to the organization\n- Implement technical controls such as web filtering and DLP to support policy enforcement\n- Review the acceptable use policy annually and update it to address new technologies and working practices",
        },
        {
          number: "A.5.11",
          title: "Return of assets",
          objective:
            "To protect the organization's assets as part of the process of changing or terminating employment, contract or agreement.",
          guidance:
            "- Include asset return requirements in employment contracts and contractor agreements\n- Maintain a per-person asset register that lists all physical and logical assets assigned to each individual\n- Create a standardized offboarding checklist that covers laptops, access badges, keys, tokens, mobile devices and cloud account deprovisioning\n- Verify asset return on or before the last working day and obtain signed confirmation\n- Conduct remote wipe of corporate data on personal devices used under BYOD arrangements upon departure",
        },
        {
          number: "A.5.12",
          title: "Classification of information",
          objective:
            "To ensure that information receives an appropriate level of protection in accordance with its importance to the organization.",
          guidance:
            "- Define a classification scheme with clear levels (e.g., Public, Internal, Confidential, Restricted) and criteria for each level\n- Provide practical examples of each classification level relevant to the organization's data types\n- Train all personnel on how to classify information they create or handle\n- Map each classification level to specific handling, storage, transmission and disposal requirements\n- Review classification assignments when information changes context or sensitivity, and at least annually for key data sets",
        },
        {
          number: "A.5.13",
          title: "Labelling of information",
          objective:
            "To facilitate the communication of information classification and support automation of information processing and management.",
          guidance:
            "- Define labelling standards for both physical media (stamps, cover sheets, color-coded folders) and digital assets (metadata tags, headers, footers, watermarks)\n- Implement automated labelling tools that apply classification metadata to documents and emails at creation\n- Ensure labels are visible and persistent through format conversions and transfers\n- Train staff on correct labelling procedures and the significance of each label\n- Audit labelling compliance periodically through random sampling of documents and communications",
        },
        {
          number: "A.5.14",
          title: "Information transfer",
          objective:
            "To maintain the security of information transferred within the organization and with any external entity.",
          guidance:
            "- Define approved methods and channels for transferring information at each classification level\n- Implement encryption for all transfers of confidential and restricted data (e.g., TLS for email, SFTP for files, encrypted messaging)\n- Establish formal information transfer agreements with external parties that specify security controls and responsibilities\n- Maintain audit logs of significant information transfers including sender, recipient, date and method\n- Prohibit the use of unapproved personal channels (e.g., personal email, consumer file-sharing) for organizational data",
        },
        {
          number: "A.5.15",
          title: "Access control",
          objective:
            "To ensure authorized access and to prevent unauthorized access to information and other associated assets.",
          guidance:
            "- Define and document an access control policy based on business and security requirements, applying the principle of least privilege\n- Implement role-based access control (RBAC) aligned with job functions and segregation of duties requirements\n- Establish formal access request, approval and provisioning workflows with documented approvals\n- Review user access rights at least quarterly for privileged accounts and semi-annually for standard accounts\n- Promptly revoke or modify access rights upon role changes, transfers or terminations",
        },
        {
          number: "A.5.16",
          title: "Identity management",
          objective:
            "To allow identification of individuals and systems accessing the organization's information and other associated assets and to assign appropriate access rights.",
          guidance:
            "- Implement a centralized identity management system (e.g., Active Directory, Okta, Azure AD) as the single source of truth\n- Assign unique identifiers to every user, service account and system component -- prohibit shared or generic accounts\n- Establish identity lifecycle processes covering creation, modification, suspension and deletion of identities\n- Integrate identity management with HR systems to automate provisioning and deprovisioning based on employment status\n- Regularly reconcile identities against HR records and deactivate orphaned or dormant accounts within defined timeframes",
        },
        {
          number: "A.5.17",
          title: "Authentication information",
          objective:
            "To ensure proper authentication of the entity and prevent failures of authentication processes that could lead to unauthorized access.",
          guidance:
            "- Enforce strong password policies with minimum length, complexity and expiration requirements as baseline controls\n- Implement multi-factor authentication (MFA) for all remote access, privileged accounts and cloud services\n- Store authentication credentials using salted hashes and never in plaintext\n- Establish a secure process for initial credential issuance, resets and recovery that verifies user identity\n- Monitor for compromised credentials using breach intelligence feeds and force resets when matches are found",
        },
        {
          number: "A.5.18",
          title: "Access rights",
          objective:
            "To ensure access to information and other associated assets is defined and authorized in accordance with business and information security requirements.",
          guidance:
            "- Implement a formal access request process requiring documented business justification and manager approval\n- Provision access rights strictly based on the principle of least privilege and need-to-know\n- Conduct periodic access reviews with asset owners who validate each user's continued need for access\n- Maintain an auditable log of all access right grants, modifications and revocations\n- Automatically flag and escalate dormant accounts or access rights that have not been used within a defined period",
        },
        {
          number: "A.5.19",
          title: "Information security in supplier relationships",
          objective:
            "To maintain an agreed level of information security in supplier relationships.",
          guidance:
            "- Develop a supplier information security policy that defines requirements for different supplier risk tiers\n- Conduct security risk assessments of suppliers before engagement, proportionate to their access to organizational data\n- Require suppliers to demonstrate compliance through certifications (e.g., ISO 27001, SOC 2) or completed security questionnaires\n- Maintain a register of all suppliers with access to organizational information, their risk tier and assessment status\n- Include the right to audit and the obligation to report security incidents in supplier contracts",
        },
        {
          number: "A.5.20",
          title:
            "Addressing information security within supplier agreements",
          objective:
            "To establish and mutually agree on relevant information security requirements with each supplier based on the type of supplier relationship.",
          guidance:
            "- Include specific information security clauses in all supplier contracts covering data protection, access controls and incident notification\n- Define data handling, retention and destruction requirements that the supplier must follow\n- Specify sub-processing restrictions and require the supplier to notify the organization of any subcontractor changes\n- Include service level agreements for security incident response times and breach notification timelines\n- Require contractual commitments to comply with the organization's security policies and applicable regulations",
        },
        {
          number: "A.5.21",
          title:
            "Managing information security in the ICT supply chain",
          objective:
            "To maintain an agreed level of information security in supplier relationships throughout the ICT product and service supply chain.",
          guidance:
            "- Map the ICT supply chain to identify all suppliers and sub-suppliers that handle organizational data or provide critical components\n- Assess the security posture of key supply chain participants using standardized questionnaires or third-party ratings\n- Require suppliers to propagate security requirements to their own sub-suppliers contractually\n- Monitor supply chain risks including geopolitical factors, single points of failure and component authenticity\n- Establish contingency plans for critical supply chain disruptions including alternative sourcing arrangements",
        },
        {
          number: "A.5.22",
          title:
            "Monitoring, review and change management of supplier services",
          objective:
            "To maintain an agreed level of information security and service delivery in line with supplier agreements.",
          guidance:
            "- Establish a regular cadence (e.g., quarterly or semi-annually) for reviewing supplier security performance and compliance\n- Monitor supplier service reports, audit results and incident notifications against agreed SLAs\n- Require suppliers to notify the organization in advance of significant changes to their services, infrastructure or subcontractors\n- Conduct periodic on-site or remote audits of high-risk suppliers to verify control effectiveness\n- Maintain a supplier risk dashboard and escalate non-compliance issues through a formal remediation process",
        },
        {
          number: "A.5.23",
          title: "Information security for use of cloud services",
          objective:
            "To specify and manage information security for the use of cloud services.",
          guidance:
            "- Develop a cloud security policy that defines approved cloud providers, deployment models and data classification restrictions\n- Conduct due diligence on cloud providers including reviewing their certifications, data residency options and shared responsibility model\n- Configure cloud security controls including encryption at rest and in transit, identity federation and logging\n- Implement cloud security posture management (CSPM) tools to continuously monitor configuration drift and misconfigurations\n- Define exit strategies including data portability, backup procedures and contractual rights to retrieve or delete data upon termination",
        },
        {
          number: "A.5.24",
          title:
            "Information security incident management planning and preparation",
          objective:
            "To ensure a quick, effective and orderly response to information security incidents including communication on information security events.",
          guidance:
            "- Develop and document an incident response plan that defines roles, responsibilities, escalation paths and communication channels\n- Establish an incident response team with clearly assigned members, contact details and on-call rotation schedules\n- Define incident severity levels with corresponding response timeframes, notification requirements and escalation criteria\n- Prepare incident response toolkits including forensic tools, communication templates and evidence collection checklists\n- Conduct incident response drills and tabletop exercises at least twice per year and update the plan based on lessons learned",
        },
        {
          number: "A.5.25",
          title:
            "Assessment and decision on information security events",
          objective:
            "To ensure that information security events are assessed and decided upon whether to categorize them as information security incidents.",
          guidance:
            "- Define clear criteria and thresholds for triaging security events into categories (false positive, event, incident)\n- Establish a single point of contact or ticketing system for receiving and logging all security events\n- Train first responders and SOC analysts on the triage criteria and decision flowchart\n- Document every assessment decision including the rationale for categorization and the assigned severity level\n- Escalate events that meet incident thresholds immediately to the incident response team following defined escalation procedures",
        },
        {
          number: "A.5.26",
          title: "Response to information security incidents",
          objective:
            "To ensure that information security incidents are responded to in accordance with documented procedures.",
          guidance:
            "- Activate the incident response plan and assign an incident commander for each confirmed incident\n- Contain the incident promptly by isolating affected systems, revoking compromised credentials and blocking malicious traffic\n- Collect and preserve evidence following forensically sound procedures with documented chain of custody\n- Communicate with stakeholders according to the communication plan including internal leadership, affected parties and regulators as required\n- Conduct eradication and recovery activities, verify system integrity before restoring services, and document all actions taken with timestamps",
        },
        {
          number: "A.5.27",
          title: "Learning from information security incidents",
          objective:
            "To reduce the likelihood or consequences of future information security incidents by making use of knowledge gained from information security incidents.",
          guidance:
            "- Conduct a post-incident review for every significant incident within two weeks of closure\n- Identify root causes using structured analysis techniques (e.g., 5 Whys, fishbone diagrams)\n- Document lessons learned including what worked well, what failed and specific improvement recommendations\n- Track remediation actions to completion with assigned owners and deadlines\n- Share anonymized incident summaries and lessons learned across the organization to improve security awareness",
        },
        {
          number: "A.5.28",
          title: "Collection of evidence",
          objective:
            "To ensure proper identification, collection, acquisition and preservation of information related to information security events for evidence purposes.",
          guidance:
            "- Define evidence collection procedures that comply with applicable legal and regulatory requirements for admissibility\n- Train incident responders on forensically sound evidence handling including write-blocking, imaging and hashing\n- Maintain a documented chain of custody for all evidence from collection through storage and eventual disposal\n- Use tamper-evident storage and access controls for physical and digital evidence repositories\n- Preserve system logs, network captures and disk images with cryptographic integrity verification (e.g., SHA-256 hashes)",
        },
        {
          number: "A.5.29",
          title: "Information security during disruption",
          objective:
            "To protect information and other associated assets during disruption.",
          guidance:
            "- Identify information security requirements that must be maintained during business disruptions and crisis situations\n- Include information security controls in business continuity plans and disaster recovery procedures\n- Ensure backup security controls (e.g., manual access control, alternate communication channels) are documented and tested\n- Conduct business impact analysis to identify critical information assets and their protection priorities during disruption\n- Test continuity arrangements at least annually to verify that security controls remain effective under disruption scenarios",
        },
        {
          number: "A.5.30",
          title: "ICT readiness for business continuity",
          objective:
            "To ensure the availability of the organization's information and other associated assets during disruption.",
          guidance:
            "- Identify ICT services and infrastructure critical to business operations and define recovery time objectives (RTOs) and recovery point objectives (RPOs)\n- Implement redundant systems, failover mechanisms and backup infrastructure for critical ICT services\n- Develop and document ICT disaster recovery plans with step-by-step procedures for each critical system\n- Test ICT recovery plans at least annually through failover tests and full recovery simulations\n- Review and update ICT continuity plans after every significant infrastructure change, incident or test finding",
        },
        {
          number: "A.5.31",
          title:
            "Legal, statutory, regulatory and contractual requirements",
          objective:
            "To ensure compliance with legal, statutory, regulatory and contractual requirements related to information security and the organization's approach to meet these requirements.",
          guidance:
            "- Identify and document all applicable legal, regulatory and contractual requirements related to information security for each jurisdiction of operation\n- Maintain a compliance register that maps each requirement to responsible owners, applicable controls and compliance status\n- Engage legal counsel to review obligations when entering new markets, jurisdictions or contractual arrangements\n- Conduct periodic compliance assessments to verify adherence to identified requirements\n- Update the compliance register whenever new legislation, regulations or contractual obligations are introduced",
        },
        {
          number: "A.5.32",
          title: "Intellectual property rights",
          objective:
            "To ensure compliance with legal, statutory, regulatory and contractual requirements related to intellectual property rights and the use of proprietary products.",
          guidance:
            "- Maintain a register of all intellectual property assets including patents, trademarks, copyrights and licensed software\n- Implement software asset management tools to track license compliance and detect unauthorized software installations\n- Define procedures for acquiring, using and disposing of third-party intellectual property including open-source components\n- Train employees on intellectual property policies including restrictions on copying, distributing or reverse-engineering proprietary materials\n- Conduct periodic license audits and reconcile usage against entitlements to ensure compliance",
        },
        {
          number: "A.5.33",
          title: "Protection of records",
          objective:
            "To ensure protection of records from loss, destruction, falsification, unauthorized access and unauthorized release in accordance with legal, statutory, regulatory, contractual and business requirements.",
          guidance:
            "- Define a records retention schedule that specifies retention periods for each record type based on legal and business requirements\n- Implement access controls to restrict record modification and deletion to authorized personnel only\n- Store records in systems that provide integrity protection such as write-once storage, audit logging or blockchain-based verification\n- Ensure records are backed up regularly and that backup copies are stored securely in a separate location\n- Establish procedures for the secure disposal of records that have exceeded their retention period",
        },
        {
          number: "A.5.34",
          title: "Privacy and protection of PII",
          objective:
            "To ensure compliance with legal, statutory, regulatory and contractual requirements related to the privacy and protection of personally identifiable information (PII).",
          guidance:
            "- Conduct a data inventory and mapping exercise to identify all PII collected, processed, stored and shared by the organization\n- Appoint a Data Protection Officer or privacy lead and define their responsibilities and reporting lines\n- Implement privacy impact assessments (PIAs) for new projects, systems or processing activities involving PII\n- Establish processes for handling data subject rights requests (access, rectification, erasure, portability) within regulatory timeframes\n- Implement technical controls including encryption, pseudonymization, access controls and data minimization for PII processing",
        },
        {
          number: "A.5.35",
          title: "Independent review of information security",
          objective:
            "To ensure the continuing suitability, adequacy and effectiveness of the organization's approach to managing information security.",
          guidance:
            "- Schedule independent reviews of the ISMS at planned intervals (at least annually) or when significant changes occur\n- Engage qualified independent reviewers such as external auditors, consultants or internal audit teams not involved in ISMS operations\n- Define the scope of each review to cover policy compliance, control effectiveness and alignment with business objectives\n- Report review findings and recommendations to top management and track remediation actions to completion\n- Use review results as input to the management review process and continual improvement planning",
        },
        {
          number: "A.5.36",
          title:
            "Compliance with policies, rules and standards for information security",
          objective:
            "To ensure that information security is implemented and operated in accordance with the organization's policies, rules and standards.",
          guidance:
            "- Assign managers the responsibility to regularly verify that information security practices comply with organizational policies within their areas\n- Implement automated compliance monitoring tools to detect deviations from security baselines and policies\n- Conduct periodic compliance checks and internal audits across all departments and systems\n- Maintain records of compliance assessments, non-conformities identified and corrective actions taken\n- Escalate persistent non-compliance to senior management and include compliance status in management reporting",
        },
        {
          number: "A.5.37",
          title: "Documented operating procedures",
          objective:
            "To ensure the correct and secure operation of information processing facilities.",
          guidance:
            "- Document operating procedures for all critical information processing activities including system administration, backup, monitoring and incident handling\n- Ensure procedures specify who is authorized to perform each activity and what approval is required\n- Store operating procedures in a centralized, version-controlled repository accessible to all relevant personnel\n- Review and update procedures whenever systems, processes or organizational structures change\n- Train relevant personnel on updated procedures and verify their understanding through practical assessments",
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
          guidance:
            "- Define screening requirements proportionate to the role's sensitivity, data access level and business criticality\n- Conduct background verification checks including identity verification, employment history, educational qualifications and criminal record checks where legally permitted\n- Verify professional references from previous employers with specific questions about security conduct\n- Repeat screening at defined intervals for personnel in high-risk or high-privilege roles\n- Document all screening results and store them securely in compliance with privacy regulations",
        },
        {
          number: "A.6.2",
          title: "Terms and conditions of employment",
          objective:
            "To ensure employees and contractors understand and fulfil their information security responsibilities.",
          guidance:
            "- Include information security responsibilities, acceptable use obligations and confidentiality clauses in all employment contracts\n- Require employees to acknowledge and sign the organization's information security policies before commencing work\n- Define consequences of policy violations in the terms and conditions, referencing the disciplinary process\n- Include clauses addressing post-employment obligations such as continued confidentiality and return of assets\n- Review and update employment terms when security policies change to ensure ongoing alignment",
        },
        {
          number: "A.6.3",
          title:
            "Information security awareness, education and training",
          objective:
            "To ensure personnel and relevant interested parties are aware and fulfil their information security responsibilities through appropriate awareness, education and training.",
          guidance:
            "- Develop a mandatory security awareness training program covering phishing, social engineering, password hygiene, data handling and incident reporting\n- Require all employees to complete security awareness training upon joining and at least annually thereafter\n- Provide role-specific training for personnel with elevated security responsibilities (e.g., developers, system administrators, incident responders)\n- Use varied delivery methods including e-learning, live sessions, simulated phishing campaigns and security newsletters\n- Track completion rates, assessment scores and phishing simulation results and report metrics to management",
        },
        {
          number: "A.6.4",
          title: "Disciplinary process",
          objective:
            "To ensure there is a formal and communicated disciplinary process to take action against personnel who have committed an information security policy violation.",
          guidance:
            "- Establish a formal disciplinary process for information security violations that is documented and approved by HR and legal\n- Define graduated consequences proportionate to the severity and intent of the violation (e.g., warning, retraining, suspension, termination)\n- Communicate the disciplinary process to all personnel during onboarding and reinforce it through security awareness programs\n- Ensure the process is applied consistently and fairly across all personnel levels\n- Document all disciplinary actions taken, maintaining records in accordance with employment law and privacy requirements",
        },
        {
          number: "A.6.5",
          title:
            "Responsibilities after termination or change of employment",
          objective:
            "To protect the organization's interests as part of the process of changing or terminating employment.",
          guidance:
            "- Clearly define post-employment security obligations in contracts including confidentiality, non-disclosure and non-compete clauses\n- Conduct an exit interview that reminds departing personnel of their continuing obligations regarding confidential information\n- Revoke all logical access (email, VPN, cloud services, application accounts) on or before the last working day\n- Recover all physical assets and access tokens following the asset return checklist\n- For role changes within the organization, conduct an access rights review and adjust permissions to match the new role immediately",
        },
        {
          number: "A.6.6",
          title: "Confidentiality or non-disclosure agreements",
          objective:
            "To maintain confidentiality of information accessible by personnel or external parties.",
          guidance:
            "- Develop standard NDA templates reviewed by legal counsel that cover organizational confidential information and trade secrets\n- Require signed NDAs from all employees, contractors, temporary workers and third parties before granting access to confidential information\n- Define the scope, duration and obligations of confidentiality in each agreement, including post-engagement obligations\n- Maintain a register of all signed NDAs with dates, parties and expiration terms\n- Review and update NDA templates when legal requirements, business circumstances or information sensitivity classifications change",
        },
        {
          number: "A.6.7",
          title: "Remote working",
          objective:
            "To ensure the security of information when personnel are working remotely.",
          guidance:
            "- Develop a remote working policy that specifies security requirements for home offices, co-working spaces and travel\n- Require the use of VPN or zero-trust network access for connecting to organizational resources from remote locations\n- Mandate full-disk encryption and endpoint protection on all devices used for remote work\n- Define rules for physical security of devices and documents including screen locking, secure storage and prohibition of working in public areas for sensitive information\n- Provide guidance on securing home Wi-Fi networks including WPA3 encryption, unique passwords and disabling remote management",
        },
        {
          number: "A.6.8",
          title: "Information security event reporting",
          objective:
            "To support timely, consistent and effective reporting of information security events that can be identified by personnel.",
          guidance:
            "- Establish clear, easy-to-use reporting channels (e.g., dedicated email address, web form, hotline, Slack channel) for security events\n- Train all personnel to recognize potential security events including phishing attempts, suspicious behavior, lost devices and unauthorized access\n- Define expected reporting timeframes and communicate that prompt reporting is critical and will not result in punishment for good-faith reports\n- Acknowledge receipt of reports promptly and keep reporters informed of outcomes where appropriate\n- Analyse reported events to identify trends and feed insights back into awareness training and control improvements",
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
          guidance:
            "- Define physical security perimeters around areas containing sensitive information and critical information processing facilities\n- Construct perimeter barriers (walls, fences, locked doors) that are appropriate to the classification of the assets within\n- Install access control mechanisms (card readers, biometric scanners, mantraps) at all entry points to secure areas\n- Ensure perimeter boundaries are continuous with no gaps and that emergency exits are alarmed and monitored\n- Review and test perimeter security measures at least annually and after any construction or layout changes",
        },
        {
          number: "A.7.2",
          title: "Physical entry",
          objective:
            "To ensure only authorized access to secure areas occurs by applying appropriate entry controls.",
          guidance:
            "- Implement access control systems (badge readers, PINs, biometrics) for all entry points to secure areas\n- Maintain visitor management procedures including pre-registration, photo ID verification, visitor badges and escort requirements\n- Log all physical access events including entry and exit times with sufficient detail for audit and investigation\n- Issue access credentials only after formal authorization and revoke them promptly upon termination or role change\n- Review physical access rights quarterly, removing access for personnel who no longer require it",
        },
        {
          number: "A.7.3",
          title: "Securing offices, rooms and facilities",
          objective:
            "To prevent unauthorized physical access, damage and interference to the organization's information and other associated assets in offices, rooms and facilities.",
          guidance:
            "- Apply physical security measures to offices and rooms based on the sensitivity of the information and assets they contain\n- Lock offices containing sensitive information when unoccupied and restrict key distribution to authorized personnel\n- Position sensitive workstations away from windows and public-facing areas to prevent visual eavesdropping\n- Secure server rooms, network closets and storage rooms with dedicated access controls separate from general office access\n- Install intrusion detection sensors on doors and windows of high-security rooms and connect them to a monitored alarm system",
        },
        {
          number: "A.7.4",
          title: "Physical security monitoring",
          objective:
            "To detect and deter unauthorized physical access by applying monitoring and surveillance measures.",
          guidance:
            "- Install CCTV cameras at all entry/exit points, perimeters, parking areas and sensitive internal zones with appropriate coverage\n- Ensure CCTV recordings are retained for a minimum period defined by policy and regulatory requirements (typically 30-90 days)\n- Implement 24/7 monitoring of security systems through a security operations center or contracted security service\n- Deploy intrusion detection systems (motion sensors, door contacts, glass-break detectors) in sensitive areas\n- Review monitoring system effectiveness quarterly, test alarm responses and address any coverage gaps identified",
        },
        {
          number: "A.7.5",
          title:
            "Protecting against physical and environmental threats",
          objective:
            "To prevent or reduce the consequences of events arising from physical and environmental threats.",
          guidance:
            "- Conduct a risk assessment of physical and environmental threats including fire, flood, earthquake, storms and nearby hazards\n- Install fire detection and suppression systems appropriate to the assets being protected (e.g., gas suppression for server rooms)\n- Implement water detection sensors in areas housing critical equipment, particularly below raised floors and near cooling systems\n- Position critical equipment away from areas susceptible to flooding, and above ground floor level where feasible\n- Test protective systems (fire alarms, suppression systems, emergency lighting) at manufacturer-recommended intervals and maintain service records",
        },
        {
          number: "A.7.6",
          title: "Working in secure areas",
          objective:
            "To protect information and other associated assets in secure areas from damage and unauthorized interference by personnel working in and around these areas.",
          guidance:
            "- Restrict knowledge of the location and function of secure areas to authorized personnel on a need-to-know basis\n- Prohibit unsupervised work in secure areas and require a minimum of two authorized persons for critical operations\n- Prohibit recording devices (cameras, phones) in secure areas unless specifically authorized and logged\n- Post and enforce rules for working in secure areas including no food/drink near equipment and no unauthorized removal of assets\n- Supervise all third-party work (maintenance, cleaning, construction) in secure areas and log all activities performed",
        },
        {
          number: "A.7.7",
          title: "Clear desk and clear screen",
          objective:
            "To reduce the risks of unauthorized access, loss and damage to information on desks, screens and in other accessible locations during and outside normal working hours.",
          guidance:
            "- Implement a clear desk policy requiring all sensitive documents and removable media to be locked away when not in use and at end of day\n- Configure automatic screen lock on all workstations to activate after a maximum of 5 minutes of inactivity\n- Provide lockable drawers, cabinets or secure shredding bins at each workstation for securing or disposing of sensitive materials\n- Require personnel to log off or lock their screens when leaving their desks, even briefly\n- Conduct periodic clear desk audits (announced and unannounced) and report results to management",
        },
        {
          number: "A.7.8",
          title: "Equipment siting and protection",
          objective:
            "To reduce the risks from environmental threats and hazards and from opportunities for unauthorized access.",
          guidance:
            "- Locate critical equipment (servers, network gear, UPS) in dedicated rooms with controlled environmental conditions\n- Position equipment to minimize risks from environmental hazards such as water pipes, direct sunlight and electromagnetic interference\n- Restrict physical access to equipment rooms to authorized maintenance and operations personnel only\n- Implement environmental monitoring (temperature, humidity, water leak sensors) with automated alerts for out-of-range conditions\n- Ensure adequate ventilation and cooling capacity with redundancy for critical equipment rooms",
        },
        {
          number: "A.7.9",
          title: "Security of assets off-premises",
          objective:
            "To prevent loss, damage, theft or compromise of off-site assets and interruption to the organization's operations.",
          guidance:
            "- Establish policies governing the use and protection of organizational assets (laptops, mobile devices, documents) taken off-premises\n- Require full-disk encryption and remote wipe capability on all portable devices taken off-site\n- Instruct personnel never to leave equipment unattended in vehicles, hotel rooms or public places\n- Maintain a log of assets taken off-premises including the responsible person, dates and destinations\n- Require personnel to report loss or theft of off-premises assets immediately through the incident reporting process",
        },
        {
          number: "A.7.10",
          title: "Storage media",
          objective:
            "To prevent unauthorized disclosure, modification, removal or destruction of information stored on storage media.",
          guidance:
            "- Classify all storage media (USB drives, external hard drives, tapes, optical discs) according to the sensitivity of the information they contain\n- Encrypt all removable storage media containing confidential or restricted information\n- Implement endpoint controls to restrict the use of unauthorized removable storage media on organizational systems\n- Store media containing sensitive information in locked, access-controlled storage when not in active use\n- Securely dispose of storage media using approved methods (degaussing, shredding, secure erasure) with documented certificates of destruction",
        },
        {
          number: "A.7.11",
          title: "Supporting utilities",
          objective:
            "To prevent loss, damage or compromise of information and other associated assets or interruption to business operations caused by failures and disruptions of supporting utilities.",
          guidance:
            "- Install uninterruptible power supplies (UPS) for all critical information processing equipment with capacity for graceful shutdown\n- Deploy backup power generators for data centers and critical facilities with automatic failover capability\n- Implement redundant network and telecommunications connections from diverse providers and physical paths\n- Monitor utility systems (power, cooling, water) continuously with automated alerting for failures or anomalies\n- Test backup power and utility failover systems at least quarterly and maintain service contracts for all critical utility equipment",
        },
        {
          number: "A.7.12",
          title: "Cabling security",
          objective:
            "To prevent interception, interference or damage to power and telecommunications cabling carrying data or supporting information services.",
          guidance:
            "- Route power and telecommunications cabling through protected conduits, cable trays or ducts to prevent physical damage and interception\n- Separate power cables from communications cables to prevent electromagnetic interference\n- Label cables clearly and maintain up-to-date cable plant documentation and diagrams\n- Restrict access to patch panels, cable distribution rooms and junction boxes to authorized personnel\n- Use fiber optic cabling for high-sensitivity connections where interception risk is elevated, and inspect cabling infrastructure periodically for signs of tampering",
        },
        {
          number: "A.7.13",
          title: "Equipment maintenance",
          objective:
            "To prevent loss, damage, theft or compromise of information and other associated assets and interruption to the organization's operations caused by lack of maintenance.",
          guidance:
            "- Establish a preventive maintenance schedule for all critical equipment based on manufacturer recommendations\n- Maintain service records documenting all maintenance performed, including dates, personnel and work completed\n- Ensure only authorized and vetted maintenance personnel perform work on equipment, with appropriate supervision\n- Verify that sensitive data is protected before equipment is released for off-site maintenance (e.g., by removing storage media or encrypting data)\n- Test equipment functionality after maintenance to confirm proper operation before returning it to production use",
        },
        {
          number: "A.7.14",
          title: "Secure disposal or re-use of equipment",
          objective:
            "To prevent leakage of information from equipment that is to be disposed of or re-used.",
          guidance:
            "- Establish procedures for sanitizing all storage media before equipment disposal or re-use, appropriate to the data classification\n- Use approved data destruction methods (e.g., NIST 800-88 guidelines) including secure erasure, degaussing or physical destruction\n- Obtain certificates of destruction from contracted disposal vendors and retain them for audit purposes\n- Maintain a disposal register recording the asset identifier, destruction method, date and responsible person\n- Verify that all licensed software is properly decommissioned or transferred before equipment disposal",
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
          guidance:
            "- Deploy endpoint protection platforms (EPP/EDR) with anti-malware, host-based firewall and behavioral detection on all user devices\n- Enforce full-disk encryption on all laptops and mobile devices using solutions such as BitLocker or FileVault\n- Implement mobile device management (MDM) to enforce security policies, remotely wipe devices and control application installations\n- Maintain a hardened baseline configuration for each device type and enforce it through automated configuration management\n- Require automatic operating system and application patching with compliance reporting for all endpoint devices",
        },
        {
          number: "A.8.2",
          title: "Privileged access rights",
          objective:
            "To ensure only authorized users, software components and services are provided with privileged access rights and to restrict and manage the allocation and use of privileged access rights.",
          guidance:
            "- Maintain a formal register of all privileged accounts including system administrators, database administrators and root/service accounts\n- Implement privileged access management (PAM) solutions to vault credentials, enforce check-out procedures and record sessions\n- Require separate accounts for privileged and day-to-day activities, prohibiting the use of admin accounts for routine tasks\n- Enforce multi-factor authentication for all privileged access and implement just-in-time privilege elevation where possible\n- Review privileged access rights at least quarterly, removing accounts that are no longer required and investigating any anomalies",
        },
        {
          number: "A.8.3",
          title: "Information access restriction",
          objective:
            "To ensure authorized access only and prevent unauthorized access to information and other associated assets.",
          guidance:
            "- Implement access controls at the application, database and file system level based on the principle of least privilege\n- Use role-based or attribute-based access control mechanisms that enforce business rules and data classification requirements\n- Restrict access to sensitive data fields (e.g., PII, financial records) using field-level security controls within applications\n- Log all access to sensitive information and regularly review access logs for unauthorized or anomalous access patterns\n- Implement time-based access restrictions where appropriate, limiting access to business hours for non-critical systems",
        },
        {
          number: "A.8.4",
          title: "Access to source code",
          objective:
            "To prevent the introduction of unauthorized functionality and to avoid unintentional or deliberate changes to source code.",
          guidance:
            "- Store all source code in a centralized version control system (e.g., Git) with authentication and authorization controls\n- Restrict write access to source code repositories to authorized developers and enforce branch protection rules\n- Require code reviews and pull request approvals from at least one independent reviewer before merging changes\n- Implement code signing for release builds to verify the authenticity and integrity of deployed code\n- Audit repository access logs periodically and remove access for personnel who no longer require it",
        },
        {
          number: "A.8.5",
          title: "Secure authentication",
          objective:
            "To ensure a user or entity is securely authenticated when access to systems, applications and services is granted.",
          guidance:
            "- Implement multi-factor authentication (MFA) for all user-facing applications, VPN access and administrative interfaces\n- Use industry-standard authentication protocols (e.g., OAuth 2.0, SAML, FIDO2) and avoid custom authentication implementations\n- Enforce account lockout policies after a defined number of failed authentication attempts with progressive delays\n- Implement single sign-on (SSO) where feasible to reduce password fatigue and centralize authentication control\n- Monitor authentication events for anomalies such as impossible travel, brute force attempts and credential stuffing, and trigger automated responses",
        },
        {
          number: "A.8.6",
          title: "Capacity management",
          objective:
            "To ensure that required information processing facilities, human resources, offices and other facilities capacity is adequate for current and projected capacity requirements.",
          guidance:
            "- Monitor resource utilization (CPU, memory, storage, bandwidth) across all critical systems with automated alerting for threshold breaches\n- Establish capacity baselines and conduct trend analysis to forecast future requirements\n- Define capacity thresholds that trigger scaling actions or procurement processes with sufficient lead time\n- Implement auto-scaling for cloud-hosted services to handle demand spikes and prevent service degradation\n- Review capacity plans at least quarterly and align them with business growth projections and planned system changes",
        },
        {
          number: "A.8.7",
          title: "Protection against malware",
          objective:
            "To ensure that information and other associated assets are protected against malware.",
          guidance:
            "- Deploy anti-malware solutions on all endpoints, servers and email gateways with real-time scanning and automatic updates\n- Implement application whitelisting on critical servers and endpoints to prevent execution of unauthorized software\n- Configure email filtering to block executable attachments, malicious links and known malware signatures\n- Conduct regular malware scans of file shares, removable media and backup repositories\n- Educate users on malware risks including phishing, drive-by downloads and social engineering tactics through ongoing awareness training",
        },
        {
          number: "A.8.8",
          title: "Management of technical vulnerabilities",
          objective:
            "To prevent exploitation of technical vulnerabilities and to reduce the risks arising from exploitation of published technical vulnerabilities.",
          guidance:
            "- Establish a vulnerability management program with defined scanning schedules (at least monthly for internal, weekly for internet-facing assets)\n- Subscribe to vendor security advisories, CVE feeds and threat intelligence sources relevant to the technology stack\n- Define SLAs for vulnerability remediation based on severity: critical within 48 hours, high within 7 days, medium within 30 days\n- Implement a patching process with testing in non-production environments before production deployment\n- Track vulnerability remediation progress through a centralized dashboard and report metrics to management regularly",
        },
        {
          number: "A.8.9",
          title: "Configuration management",
          objective:
            "To ensure that hardware, software, services and networks are correctly configured and that configurations are properly managed and controlled throughout their lifecycle.",
          guidance:
            "- Define and document secure baseline configurations (hardening standards) for all system types based on CIS Benchmarks or vendor guidelines\n- Implement configuration management tools (e.g., Ansible, Puppet, Terraform) to enforce and maintain baseline configurations consistently\n- Monitor for configuration drift using automated scanning tools and remediate deviations promptly\n- Maintain a configuration management database (CMDB) with current configuration records for all assets\n- Review and update baseline configurations when new vulnerabilities, patches or architectural changes require modifications",
        },
        {
          number: "A.8.10",
          title: "Information deletion",
          objective:
            "To prevent unnecessary exposure of information and to comply with legal, statutory, regulatory and contractual requirements for information deletion.",
          guidance:
            "- Define information deletion rules for each data type based on the records retention schedule and regulatory requirements\n- Implement automated deletion mechanisms in systems and databases to purge data that has exceeded its retention period\n- Verify that deletion processes remove data from all locations including backups, replicas, caches and archive systems within defined timeframes\n- Use secure deletion methods appropriate to the storage medium and data classification (e.g., cryptographic erasure for encrypted data)\n- Maintain deletion logs that record what was deleted, when, by whom and the method used for audit purposes",
        },
        {
          number: "A.8.11",
          title: "Data masking",
          objective:
            "To limit the exposure of sensitive data including PII and to comply with legal, statutory, regulatory and contractual requirements.",
          guidance:
            "- Identify all data sets containing sensitive information that require masking in non-production environments or when displayed to unauthorized roles\n- Implement data masking techniques (pseudonymization, tokenization, redaction, shuffling) appropriate to the data type and use case\n- Ensure masked data remains functionally usable for its intended purpose (testing, analytics, support) while protecting the original values\n- Apply dynamic data masking at the application or database layer to control what different user roles can see in real time\n- Test masking effectiveness to verify that original data cannot be reverse-engineered from masked outputs",
        },
        {
          number: "A.8.12",
          title: "Data leakage prevention",
          objective:
            "To detect and prevent the unauthorized disclosure and extraction of information by individuals or systems.",
          guidance:
            "- Deploy DLP solutions that monitor data in transit (email, web uploads, file transfers), at rest (file servers, databases) and in use (endpoints)\n- Define DLP policies based on data classification labels, content patterns (e.g., credit card numbers, PII formats) and contextual rules\n- Configure DLP to block or quarantine high-risk transfers and alert security teams for investigation\n- Monitor and control data exfiltration channels including USB devices, cloud storage, personal email and screen capture tools\n- Review DLP alerts regularly, tune rules to reduce false positives and escalate confirmed incidents through the incident response process",
        },
        {
          number: "A.8.13",
          title: "Information backup",
          objective:
            "To allow recovery from loss of data or systems in accordance with the backup policy.",
          guidance:
            "- Define a backup policy specifying backup frequency, retention periods, storage locations and encryption requirements for each system and data type\n- Implement the 3-2-1 backup rule: at least three copies, on two different media types, with one stored off-site or in a separate cloud region\n- Encrypt all backup data both in transit and at rest using strong encryption algorithms\n- Test backup restoration procedures at least quarterly by performing full recovery drills for critical systems\n- Monitor backup jobs daily for failures, address issues promptly and maintain backup success/failure reports for management review",
        },
        {
          number: "A.8.14",
          title: "Redundancy of information processing facilities",
          objective:
            "To ensure the required availability of information processing facilities.",
          guidance:
            "- Identify all critical information processing facilities and systems that require redundancy based on business impact analysis\n- Implement redundant components (power supplies, network links, servers, storage) for critical systems using active-active or active-passive configurations\n- Deploy geographically distributed redundancy for disaster recovery with failover to a secondary site or cloud region\n- Test failover mechanisms at least semi-annually to verify seamless transition and acceptable recovery times\n- Monitor the health and synchronization status of redundant systems continuously and alert operations staff to any degradation",
        },
        {
          number: "A.8.15",
          title: "Logging",
          objective:
            "To record events, generate evidence, ensure the integrity of log information, prevent against unauthorized access, identify information security events and to support investigations.",
          guidance:
            "- Enable logging on all critical systems including servers, network devices, applications, databases and security tools\n- Define a logging standard that specifies which events to log (authentication, authorization, changes, errors, administrative actions) and the minimum detail required\n- Centralize log collection using a SIEM or log management platform with tamper-evident storage and defined retention periods\n- Protect log data integrity using write-once storage, digital signatures or hash chains to prevent unauthorized modification\n- Synchronize log timestamps across all systems using a reliable time source to enable accurate event correlation",
        },
        {
          number: "A.8.16",
          title: "Monitoring activities",
          objective:
            "To detect anomalous behaviour and potential information security incidents.",
          guidance:
            "- Implement continuous security monitoring using SIEM tools with correlation rules, anomaly detection and alerting\n- Define monitoring use cases covering key threats such as brute force attacks, privilege escalation, data exfiltration and lateral movement\n- Establish a SOC or managed security service to monitor alerts 24/7, triage events and escalate confirmed incidents\n- Tune monitoring rules regularly to reduce false positives and ensure high-priority alerts receive timely attention\n- Review monitoring coverage periodically to ensure new systems, applications and attack techniques are covered",
        },
        {
          number: "A.8.17",
          title: "Clock synchronization",
          objective:
            "To enable the correlation of events and other recorded data and to support investigations of information security incidents.",
          guidance:
            "- Configure all systems, network devices and security tools to synchronize their clocks with a designated authoritative time source (e.g., NTP servers)\n- Use at least two independent NTP sources for redundancy and accuracy verification\n- Define and enforce a consistent time zone reference (preferably UTC) for all log records across the organization\n- Monitor NTP synchronization status and alert on systems that drift beyond acceptable thresholds (e.g., more than one second)\n- Document the time synchronization architecture and include it in the system hardening baseline configuration",
        },
        {
          number: "A.8.18",
          title: "Use of privileged utility programs",
          objective:
            "To prevent the unauthorized or unintended use of utility programs that might be capable of overriding system and application controls.",
          guidance:
            "- Identify and inventory all privileged utility programs (e.g., system recovery tools, disk editors, network sniffers, registry editors) present in the environment\n- Restrict access to privileged utilities to authorized administrators only, using application whitelisting or file system permissions\n- Remove or disable unnecessary privileged utilities from production systems as part of the system hardening process\n- Log all usage of privileged utility programs with details including the user, timestamp and actions performed\n- Require formal authorization and documented justification before installing or using any privileged utility program",
        },
        {
          number: "A.8.19",
          title: "Installation of software on operational systems",
          objective:
            "To ensure the integrity of operational systems and to prevent exploitation of technical vulnerabilities.",
          guidance:
            "- Establish a software installation policy that restricts installation rights on production systems to authorized personnel only\n- Implement application whitelisting to prevent unauthorized software from executing on production servers and endpoints\n- Require all software installations on production systems to follow the change management process with proper testing and approval\n- Verify the integrity of software packages using digital signatures or checksums from the vendor before installation\n- Maintain an inventory of all installed software on production systems and reconcile it against the authorized software list regularly",
        },
        {
          number: "A.8.20",
          title: "Networks security",
          objective:
            "To protect information in networks and supporting information processing facilities from compromise via the network.",
          guidance:
            "- Implement network security controls including firewalls, intrusion detection/prevention systems and network access control at all network boundaries\n- Define and enforce network security architecture with DMZs separating public-facing services from internal networks\n- Implement network segmentation to isolate critical systems, sensitive data stores and different trust zones\n- Monitor network traffic for anomalies, unauthorized connections and suspicious patterns using network detection tools\n- Review firewall rules and network access control lists at least quarterly, removing obsolete rules and validating business justifications",
        },
        {
          number: "A.8.21",
          title: "Security of network services",
          objective:
            "To ensure the security of network services and to protect the information transferred over networks.",
          guidance:
            "- Define security requirements for all network services (DNS, DHCP, email, web, VPN) in service level agreements with internal teams and external providers\n- Implement encryption (TLS 1.2+) for all network services transmitting sensitive information\n- Authenticate network service endpoints using certificates and mutual TLS where appropriate\n- Monitor the availability, performance and security of network services continuously\n- Conduct periodic security assessments of network services including vulnerability scanning and penetration testing",
        },
        {
          number: "A.8.22",
          title: "Segregation of networks",
          objective:
            "To divide the network into security-defined perimeters and to control the traffic between them based on business needs.",
          guidance:
            "- Design network segmentation based on trust levels, data classification and functional requirements using VLANs, subnets or micro-segmentation\n- Implement firewall rules between network segments that follow the principle of least privilege, allowing only necessary traffic flows\n- Isolate critical systems (e.g., payment processing, domain controllers, databases) in dedicated network segments with strict access controls\n- Separate guest and IoT networks from the corporate network with no direct routing to internal resources\n- Document the network segmentation architecture, maintain network diagrams and review segmentation effectiveness at least annually",
        },
        {
          number: "A.8.23",
          title: "Web filtering",
          objective:
            "To protect systems from being compromised by malware and to prevent access to unauthorized web resources.",
          guidance:
            "- Deploy web filtering solutions (proxy servers, secure web gateways or DNS filtering) for all internet-bound traffic\n- Define URL categorization policies that block known malicious sites, phishing domains and inappropriate content categories\n- Block downloads of high-risk file types (executables, scripts, macros) from uncategorized or untrusted websites\n- Implement SSL/TLS inspection to detect threats in encrypted web traffic while maintaining user privacy in compliance with applicable laws\n- Review web filtering logs and blocked site reports regularly to tune policies and identify potential security events",
        },
        {
          number: "A.8.24",
          title: "Use of cryptography",
          objective:
            "To ensure proper and effective use of cryptography to protect the confidentiality, authenticity and integrity of information.",
          guidance:
            "- Develop a cryptographic policy that specifies approved algorithms, key lengths and protocols (e.g., AES-256, RSA-2048+, TLS 1.2+)\n- Implement a key management lifecycle covering key generation, distribution, storage, rotation, revocation and destruction\n- Store cryptographic keys securely using hardware security modules (HSMs), key vaults or equivalent trusted key storage mechanisms\n- Prohibit the use of deprecated or weak cryptographic algorithms (e.g., DES, MD5, SHA-1, SSL 3.0) and scan for their presence\n- Review the cryptographic policy annually or when new vulnerabilities in cryptographic implementations are discovered",
        },
        {
          number: "A.8.25",
          title: "Secure development life cycle",
          objective:
            "To ensure information security is designed and implemented within the development life cycle of software and systems.",
          guidance:
            "- Adopt a secure software development lifecycle (SSDLC) framework that integrates security activities into every phase from requirements through deployment\n- Conduct threat modelling during the design phase to identify and address security risks before implementation begins\n- Require security training for all developers covering secure coding, common vulnerabilities (OWASP Top 10) and the organization's SSDLC process\n- Integrate automated security testing (SAST, DAST, SCA) into CI/CD pipelines with defined quality gates\n- Conduct security architecture reviews for significant new systems or major changes to existing systems before development begins",
        },
        {
          number: "A.8.26",
          title: "Application security requirements",
          objective:
            "To ensure all information security requirements are identified and addressed when developing or acquiring applications.",
          guidance:
            "- Define standard security requirements templates for common application types (web applications, APIs, mobile apps, microservices)\n- Include requirements for authentication, authorization, input validation, encryption, logging, session management and error handling\n- Derive application-specific security requirements from risk assessments, data classification, regulatory requirements and threat models\n- Include security requirements in procurement specifications when acquiring third-party applications or SaaS services\n- Verify that all security requirements are met through testing and review before granting production deployment approval",
        },
        {
          number: "A.8.27",
          title: "Secure system architecture and engineering principles",
          objective:
            "To ensure that information systems are securely designed and engineered across the entire development life cycle.",
          guidance:
            "- Document and maintain secure architecture principles (defense in depth, least privilege, fail-safe defaults, zero trust) as organizational standards\n- Apply secure design patterns including input validation at trust boundaries, separation of concerns and secure defaults for all new systems\n- Require architecture security reviews for all new systems and significant changes, conducted by qualified security architects\n- Maintain reference architectures for common deployment patterns (web applications, APIs, microservices, cloud-native) that embed security controls\n- Review and update secure engineering principles annually to address emerging threats, technologies and industry best practices",
        },
        {
          number: "A.8.28",
          title: "Secure coding",
          objective:
            "To ensure that software is written securely to reduce the number of potential information security vulnerabilities in the software.",
          guidance:
            "- Establish secure coding standards based on industry guidelines (e.g., OWASP, CERT, SANS) tailored to the programming languages used\n- Implement mandatory peer code reviews with specific security review checklists for critical changes\n- Integrate static application security testing (SAST) tools into the development workflow to catch vulnerabilities before code is merged\n- Prohibit hard-coded credentials, secrets and sensitive data in source code and enforce this through automated secret scanning\n- Provide developers with access to secure coding reference materials, vulnerability databases and just-in-time security guidance in their IDEs",
        },
        {
          number: "A.8.29",
          title: "Security testing in development and acceptance",
          objective:
            "To validate that information security requirements are met when applications or code are deployed to the production environment.",
          guidance:
            "- Define mandatory security testing requirements for each release including SAST, DAST, SCA and manual penetration testing for major releases\n- Include security test cases derived from the application's security requirements and threat model in the acceptance testing plan\n- Conduct penetration testing by qualified testers (internal or external) for all internet-facing applications before go-live and at least annually thereafter\n- Establish security acceptance criteria that must be met before code is promoted to production, including no critical or high-severity findings\n- Document security testing results, track remediation of findings and obtain sign-off from the security team before production deployment",
        },
        {
          number: "A.8.30",
          title: "Outsourced development",
          objective:
            "To ensure that information security measures required by the organization are implemented in outsourced system development.",
          guidance:
            "- Include security requirements, secure coding standards and testing obligations in all outsourced development contracts\n- Require outsourced developers to follow the organization's SSDLC and submit to security code reviews and testing\n- Conduct security assessments of outsourced development vendors before engagement and periodically during the relationship\n- Require the vendor to provide security testing reports (SAST, DAST, penetration testing) for all deliverables before acceptance\n- Retain intellectual property and source code access rights to enable independent security audits of outsourced code",
        },
        {
          number: "A.8.31",
          title:
            "Separation of development, test and production environments",
          objective:
            "To protect the production environment and data from compromise by development and test activities.",
          guidance:
            "- Maintain physically or logically separated environments for development, testing, staging and production\n- Restrict developer access to production environments and data, requiring formal approval and logging for any production access\n- Prohibit the use of real production data in development and test environments; use masked or synthetic data instead\n- Implement separate authentication credentials and network segments for each environment\n- Control the promotion of code between environments through automated CI/CD pipelines with defined approval gates",
        },
        {
          number: "A.8.32",
          title: "Change management",
          objective:
            "To ensure that information security is not compromised when changes are executed in the information processing facilities and systems.",
          guidance:
            "- Implement a formal change management process that requires documentation, risk assessment, testing and approval before any change to production systems\n- Classify changes by risk level (standard, normal, emergency) with appropriate approval workflows for each category\n- Require security impact assessments for changes that affect security controls, access rights, network architecture or data flows\n- Maintain an auditable change log recording the requester, approver, implementer, date, description and rollback plan for each change\n- Review emergency changes retrospectively to ensure they met security requirements and document any corrective actions needed",
        },
        {
          number: "A.8.33",
          title: "Test information",
          objective:
            "To ensure the appropriate protection of information used for testing.",
          guidance:
            "- Prohibit the use of production data containing PII or sensitive information in test environments without proper masking or anonymization\n- Implement data masking or synthetic data generation to create realistic but non-sensitive test data sets\n- Apply the same access controls and data protection measures to test data that match the classification of the original data\n- Securely delete test data sets when testing is complete and they are no longer required\n- Maintain a log of test data provisioning requests including the source, masking method applied and approval obtained",
        },
        {
          number: "A.8.34",
          title:
            "Protection of information systems during audit testing",
          objective:
            "To minimize the impact of audit and other assurance activities on operational systems and business processes.",
          guidance:
            "- Plan and agree audit testing activities with system owners in advance, including scope, timing and potential impact on operations\n- Schedule intrusive audit tests (penetration testing, vulnerability scanning) during maintenance windows or low-activity periods\n- Restrict auditor access to the minimum necessary using time-limited, read-only accounts with full activity logging\n- Monitor audit testing activities in real time to detect and respond to any unintended impact on production systems\n- Review audit tool outputs before they leave the organization to ensure they do not contain sensitive data beyond what is necessary for the audit report",
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
          guidance: ctrl.guidance,
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
