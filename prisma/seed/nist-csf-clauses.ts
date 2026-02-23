import { PrismaClient } from "@prisma/client"

// ---------------------------------------------------------------------------
// NIST CSF 2.0 -- Cybersecurity Framework Version 2.0 (February 2024)
// ---------------------------------------------------------------------------

export async function seedNISTCSF(prisma: PrismaClient) {
  const framework = await prisma.framework.upsert({
    where: { code: "NIST_CSF" },
    update: {
      name: "NIST Cybersecurity Framework 2.0",
      version: "2.0",
      status: "PUBLISHED",
    },
    create: {
      code: "NIST_CSF",
      name: "NIST Cybersecurity Framework 2.0",
      version: "2.0",
      description:
        "The NIST Cybersecurity Framework (CSF) 2.0 provides guidance to industry, government agencies, and other organizations to manage cybersecurity risks. It offers a taxonomy of high-level cybersecurity outcomes that can be used by any organization to better understand, assess, prioritize, and communicate its cybersecurity efforts. The CSF 2.0 is organized around six core Functions: Govern, Identify, Protect, Detect, Respond, and Recover.",
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

  interface FunctionDef {
    number: string
    title: string
    description: string
    category: string
    categories: ClauseDef[]
  }

  const functions: FunctionDef[] = [
    // ======================================================================
    // GV - GOVERN
    // ======================================================================
    {
      number: "GV",
      title: "Govern",
      description:
        "The organization's cybersecurity risk management strategy, expectations, and policy are established, communicated, and monitored. The GOVERN Function provides outcomes to inform what an organization may do to achieve and prioritize the outcomes of the other five Functions in the context of its mission and stakeholder expectations.",
      category: "Govern",
      categories: [
        // ── GV.OC: Organizational Context ──────────────────────────────
        {
          number: "GV.OC",
          title: "Organizational Context",
          description:
            "The circumstances — mission, stakeholder expectations, dependencies, and legal, regulatory, and contractual requirements — surrounding the organization's cybersecurity risk management decisions are understood.",
          category: "Govern",
          controls: [
            {
              number: "GV.OC-01",
              title: "Organizational mission is understood and informs cybersecurity risk management",
              objective:
                "The organizational mission is understood and consistently used as a basis for making cybersecurity risk management decisions, ensuring that cybersecurity activities support and align with the organization's primary objectives.",
              guidance: [
                "- Document the organization's mission, vision, and strategic objectives and make them accessible to all stakeholders involved in cybersecurity risk management",
                "- Map cybersecurity risk management activities to specific mission objectives to demonstrate alignment and prioritization",
                "- Establish a process for reviewing and updating cybersecurity priorities whenever the organizational mission or strategic direction changes",
                "- Communicate to leadership how cybersecurity risk decisions support or constrain mission achievement",
                "- Incorporate mission-driven criteria into the risk assessment methodology so that risks to core mission functions receive appropriate priority",
              ].join("\n"),
            },
            {
              number: "GV.OC-02",
              title: "Internal and external stakeholders are understood, and their needs and expectations regarding cybersecurity risk management are understood and considered",
              objective:
                "The organization identifies and understands the needs and expectations of internal and external stakeholders — including executive leadership, employees, customers, regulators, partners, and suppliers — and factors these into cybersecurity risk management decisions.",
              guidance: [
                "- Identify and maintain a registry of all internal and external stakeholders who have an interest in or are affected by the organization's cybersecurity posture",
                "- Conduct periodic stakeholder engagement sessions to gather, document, and validate their cybersecurity expectations and requirements",
                "- Integrate stakeholder requirements into the organization's cybersecurity risk management strategy and policies",
                "- Establish communication channels and reporting mechanisms tailored to different stakeholder groups",
                "- Review and update stakeholder expectations at least annually or when significant organizational or environmental changes occur",
              ].join("\n"),
            },
            {
              number: "GV.OC-03",
              title: "Legal, regulatory, and contractual requirements regarding cybersecurity are understood and managed",
              objective:
                "The organization identifies, documents, and manages its legal, regulatory, and contractual obligations related to cybersecurity, including applicable laws, industry regulations, and contractual commitments with partners and customers.",
              guidance: [
                "- Maintain an inventory of all applicable cybersecurity-related laws, regulations, standards, and contractual obligations",
                "- Assign responsibility for monitoring changes in the regulatory and legal landscape that may affect cybersecurity requirements",
                "- Map legal and regulatory requirements to specific cybersecurity controls and policies to ensure comprehensive coverage",
                "- Conduct periodic compliance assessments to verify adherence to all identified legal, regulatory, and contractual requirements",
                "- Establish escalation procedures for identified compliance gaps and track remediation to closure",
              ].join("\n"),
            },
            {
              number: "GV.OC-04",
              title: "Critical objectives, capabilities, and services that stakeholders depend on or expect are understood and communicated",
              objective:
                "The organization identifies and communicates the critical objectives, capabilities, and services that external and internal stakeholders depend on, ensuring these are prioritized in cybersecurity risk management activities.",
              guidance: [
                "- Identify and document the critical business services and capabilities that stakeholders depend on for continued operations",
                "- Classify services by criticality level and define associated cybersecurity protection requirements for each tier",
                "- Communicate the list of critical services and their protection requirements to relevant teams and stakeholders",
                "- Integrate critical service dependencies into business impact analysis and risk assessment processes",
                "- Periodically review and update the list of critical services as organizational operations and stakeholder dependencies evolve",
              ].join("\n"),
            },
            {
              number: "GV.OC-05",
              title: "Outcomes, capabilities, and services that the organization depends on are understood and communicated",
              objective:
                "The organization identifies and understands the outcomes, capabilities, and services provided by external parties — including partners, suppliers, and service providers — that the organization depends upon, and communicates the associated cybersecurity risks.",
              guidance: [
                "- Catalog all external services, platforms, and capabilities on which the organization depends for its operations",
                "- Assess the cybersecurity posture and risk profile of each external dependency",
                "- Establish contractual cybersecurity requirements and service-level expectations for critical external dependencies",
                "- Communicate identified dependency risks to leadership and incorporate them into the overall risk management strategy",
                "- Develop contingency plans for scenarios in which critical external dependencies become unavailable or compromised",
              ].join("\n"),
            },
          ],
        },

        // ── GV.RM: Risk Management Strategy ────────────────────────────
        {
          number: "GV.RM",
          title: "Risk Management Strategy",
          description:
            "The organization's priorities, constraints, risk tolerance and appetite statements, and assumptions are established, communicated, and used to support operational risk decisions.",
          category: "Govern",
          controls: [
            {
              number: "GV.RM-01",
              title: "Risk management objectives are established and agreed upon by organizational stakeholders",
              objective:
                "The organization establishes, documents, and gains agreement from key stakeholders on cybersecurity risk management objectives that align with the overall enterprise risk management strategy.",
              guidance: [
                "- Define cybersecurity risk management objectives in alignment with enterprise-wide risk management goals and organizational strategy",
                "- Obtain formal approval and agreement from executive leadership and the board of directors on risk management objectives",
                "- Document risk appetite and risk tolerance levels for different categories of cybersecurity risk",
                "- Communicate approved risk management objectives across the organization so all teams understand priorities and boundaries",
                "- Review and update risk management objectives at least annually or when significant changes to the threat landscape or business environment occur",
              ].join("\n"),
            },
            {
              number: "GV.RM-02",
              title: "Risk appetite and risk tolerance statements are established, communicated, and maintained",
              objective:
                "The organization defines and maintains clear risk appetite and risk tolerance statements that guide cybersecurity investment decisions and operational risk acceptance across the enterprise.",
              guidance: [
                "- Develop quantitative and qualitative risk appetite statements that define the level of cybersecurity risk the organization is willing to accept",
                "- Establish risk tolerance thresholds for specific risk categories, business units, and system classifications",
                "- Communicate risk appetite and tolerance statements to all relevant stakeholders, including operational staff and third-party partners",
                "- Integrate risk tolerance criteria into risk assessment and decision-making processes across the organization",
                "- Review and adjust risk appetite and tolerance statements periodically based on changes in the threat landscape, business strategy, and incident history",
              ].join("\n"),
            },
            {
              number: "GV.RM-03",
              title: "Cybersecurity risk management activities and outcomes are included in enterprise risk management processes",
              objective:
                "Cybersecurity risk management is integrated into broader enterprise risk management processes so that cybersecurity risks are assessed, communicated, and managed alongside financial, operational, and strategic risks.",
              guidance: [
                "- Integrate cybersecurity risk registers and reporting into the enterprise risk management framework and governance structures",
                "- Ensure cybersecurity risk metrics are included in enterprise-level risk dashboards and board reporting",
                "- Align cybersecurity risk assessment methodologies with the enterprise risk management methodology for consistency",
                "- Participate in enterprise risk committees and governance forums to represent cybersecurity risk perspectives",
                "- Conduct cross-functional risk assessments that consider the interplay between cybersecurity risks and other enterprise risks",
              ].join("\n"),
            },
            {
              number: "GV.RM-04",
              title: "Strategic direction that describes appropriate risk response options is established and communicated",
              objective:
                "The organization establishes and communicates strategic direction for responding to cybersecurity risks, including acceptable risk response options such as acceptance, avoidance, mitigation, and transfer.",
              guidance: [
                "- Define and document the risk response options available to the organization: accept, avoid, mitigate, and transfer",
                "- Establish criteria for selecting appropriate risk response strategies based on risk severity, cost-benefit analysis, and organizational priorities",
                "- Communicate approved risk response strategies and decision-making authority across the organization",
                "- Ensure risk response decisions are documented, tracked, and reviewed for effectiveness",
                "- Periodically evaluate the appropriateness of existing risk response strategies in light of evolving threats and organizational changes",
              ].join("\n"),
            },
          ],
        },

        // ── GV.RR: Roles, Responsibilities, and Authorities ───────────
        {
          number: "GV.RR",
          title: "Roles, Responsibilities, and Authorities",
          description:
            "Cybersecurity roles, responsibilities, and authorities to foster accountability, performance assessment, and continuous improvement are established and communicated.",
          category: "Govern",
          controls: [
            {
              number: "GV.RR-01",
              title: "Organizational leadership is responsible and accountable for cybersecurity risk and fosters a culture that is risk-aware, ethical, and continually improving",
              objective:
                "Organizational leadership takes responsibility and accountability for cybersecurity risk management and actively fosters a culture of risk awareness, ethical behavior, and continuous improvement throughout the organization.",
              guidance: [
                "- Assign explicit cybersecurity risk management accountability to senior leadership roles, including the CEO, CIO, CISO, and board of directors",
                "- Establish leadership expectations for promoting cybersecurity awareness and ethical behavior throughout the organization",
                "- Include cybersecurity risk management performance metrics in leadership evaluations and organizational performance reviews",
                "- Ensure leadership regularly communicates the importance of cybersecurity and its connection to organizational success",
                "- Provide executive training on cybersecurity risk management trends, threats, and governance responsibilities",
              ].join("\n"),
            },
            {
              number: "GV.RR-02",
              title: "Roles, responsibilities, and authorities related to cybersecurity risk management are established, communicated, understood, and enforced",
              objective:
                "The organization clearly defines, documents, and communicates cybersecurity roles, responsibilities, and authorities across all levels, ensuring that individuals understand their obligations and are held accountable for fulfilling them.",
              guidance: [
                "- Define and document cybersecurity roles and responsibilities for all positions that have a part in cybersecurity risk management",
                "- Assign clear authority levels for cybersecurity decision-making, including risk acceptance, incident response, and policy enforcement",
                "- Communicate roles and responsibilities through onboarding processes, job descriptions, and organizational charts",
                "- Conduct periodic reviews to ensure roles remain current and that responsible individuals have the competencies and resources to fulfill their duties",
                "- Enforce accountability through performance management processes and escalation procedures for non-compliance",
              ].join("\n"),
            },
            {
              number: "GV.RR-03",
              title: "Adequate resources are allocated commensurate with the cybersecurity risk strategy, roles, responsibilities, and policies",
              objective:
                "The organization allocates sufficient financial, technical, and human resources to support the execution of cybersecurity risk management activities in line with its strategy and policies.",
              guidance: [
                "- Conduct resource needs assessments based on the cybersecurity risk strategy, identified threats, and compliance obligations",
                "- Develop and maintain a cybersecurity budget that addresses staffing, technology, training, and third-party services",
                "- Align resource allocation decisions with prioritized cybersecurity risks and organizational strategic objectives",
                "- Monitor resource utilization and effectiveness, adjusting allocations based on emerging risks and operational needs",
                "- Report resource adequacy and gaps to leadership with recommendations for investment and reallocation",
              ].join("\n"),
            },
            {
              number: "GV.RR-04",
              title: "Cybersecurity is included in human resources practices",
              objective:
                "The organization integrates cybersecurity considerations into human resources practices, including personnel screening, onboarding, training, role changes, and offboarding, to reduce insider risk and ensure workforce competence.",
              guidance: [
                "- Include cybersecurity background checks and screening in the hiring process for roles with access to sensitive systems and data",
                "- Incorporate cybersecurity awareness and acceptable use expectations into employee onboarding processes",
                "- Ensure that access rights are reviewed and adjusted promptly when employees change roles or leave the organization",
                "- Implement offboarding procedures that include timely revocation of system access, return of assets, and knowledge transfer",
                "- Conduct periodic cybersecurity training and awareness programs tailored to different roles and responsibilities",
                "- Include cybersecurity responsibilities and performance expectations in job descriptions and performance reviews",
              ].join("\n"),
            },
          ],
        },

        // ── GV.PO: Policy ──────────────────────────────────────────────
        {
          number: "GV.PO",
          title: "Policy",
          description:
            "Organizational cybersecurity policy is established, communicated, and enforced.",
          category: "Govern",
          controls: [
            {
              number: "GV.PO-01",
              title: "Policy for managing cybersecurity risks is established based on organizational context, cybersecurity strategy, and priorities and is communicated and enforced",
              objective:
                "The organization establishes, communicates, and enforces a comprehensive cybersecurity policy that reflects the organizational context, risk management strategy, legal requirements, and stakeholder expectations.",
              guidance: [
                "- Develop a comprehensive cybersecurity policy framework that addresses governance, risk management, operations, and compliance requirements",
                "- Ensure policies are informed by the organization's mission, risk appetite, legal and regulatory requirements, and threat landscape",
                "- Obtain executive-level approval for cybersecurity policies and communicate them to all personnel and relevant third parties",
                "- Implement mechanisms to monitor compliance with cybersecurity policies, including automated controls and periodic audits",
                "- Establish consequences for policy violations and enforce them consistently across the organization",
              ].join("\n"),
            },
            {
              number: "GV.PO-02",
              title: "Policy for managing cybersecurity risks is reviewed, updated, communicated, and enforced to reflect changes in requirements, threats, technology, and organizational mission",
              objective:
                "The organization maintains a process for regularly reviewing and updating its cybersecurity policy to ensure it remains aligned with evolving requirements, emerging threats, technological changes, and shifts in organizational mission.",
              guidance: [
                "- Establish a defined review cycle for cybersecurity policies, at minimum annually, with provisions for event-triggered reviews",
                "- Monitor changes in the threat landscape, regulatory environment, technology stack, and organizational operations that may necessitate policy updates",
                "- Engage relevant stakeholders in the policy review process to ensure completeness and organizational alignment",
                "- Communicate policy changes through appropriate channels and confirm understanding through acknowledgment processes",
                "- Maintain version control and an audit trail for all policy documents, including change history and approval records",
              ].join("\n"),
            },
          ],
        },

        // ── GV.SC: Supply Chain Risk Management ────────────────────────
        {
          number: "GV.SC",
          title: "Supply Chain Risk Management",
          description:
            "Cyber supply chain risk management processes are identified, established, managed, monitored, and improved by organizational stakeholders.",
          category: "Govern",
          controls: [
            {
              number: "GV.SC-01",
              title: "A cybersecurity supply chain risk management program, strategy, objectives, policies, and processes are established and agreed to by organizational stakeholders",
              objective:
                "The organization establishes and maintains a formal cybersecurity supply chain risk management (C-SCRM) program with documented strategy, objectives, policies, and processes that are endorsed by organizational stakeholders.",
              guidance: [
                "- Develop a formal C-SCRM program with defined scope, objectives, and governance structure aligned with the enterprise risk management strategy",
                "- Document C-SCRM policies and procedures that address supplier assessment, onboarding, monitoring, and offboarding",
                "- Obtain executive endorsement and stakeholder agreement on the C-SCRM strategy and program objectives",
                "- Establish roles and responsibilities for supply chain risk management activities across the organization",
                "- Allocate dedicated resources for the C-SCRM program including tools, personnel, and budget",
              ].join("\n"),
            },
            {
              number: "GV.SC-02",
              title: "Cybersecurity roles and responsibilities for suppliers, customers, and partners are established, communicated, and coordinated internally and externally",
              objective:
                "The organization defines, communicates, and coordinates cybersecurity roles and responsibilities with suppliers, customers, and partners to ensure shared accountability for cybersecurity risk management across the supply chain.",
              guidance: [
                "- Define cybersecurity expectations, roles, and responsibilities for suppliers, partners, and customers in written agreements and contracts",
                "- Include cybersecurity requirements in procurement processes, requests for proposals, and vendor evaluation criteria",
                "- Establish coordination mechanisms such as joint security reviews, shared incident response protocols, and regular security status meetings",
                "- Communicate organizational cybersecurity policies and standards to supply chain partners and verify understanding",
                "- Maintain contact registries and escalation paths for supply chain cybersecurity communications",
              ].join("\n"),
            },
            {
              number: "GV.SC-03",
              title: "Cybersecurity supply chain risk management is integrated into cybersecurity and enterprise risk management, risk assessment, and improvement processes",
              objective:
                "The organization integrates supply chain cybersecurity risk management into its broader cybersecurity and enterprise risk management processes, ensuring supply chain risks are identified, assessed, and treated alongside other organizational risks.",
              guidance: [
                "- Include supply chain risks in the organization's risk register and risk assessment methodology",
                "- Assess supply chain risks as part of enterprise-wide risk assessments and cybersecurity risk reviews",
                "- Incorporate supply chain risk metrics into enterprise risk dashboards and reporting to leadership",
                "- Ensure supply chain risk treatment plans are coordinated with broader cybersecurity and enterprise risk mitigation efforts",
                "- Conduct periodic supply chain risk assessments that consider geopolitical, financial, and technical risk factors",
              ].join("\n"),
            },
            {
              number: "GV.SC-04",
              title: "Suppliers are known and prioritized by criticality",
              objective:
                "The organization maintains an inventory of its suppliers and categorizes them by criticality based on the importance of the products and services they provide, enabling risk-proportionate oversight and management.",
              guidance: [
                "- Maintain a comprehensive inventory of all suppliers, service providers, and partners with cybersecurity relevance",
                "- Classify suppliers by criticality tiers based on the sensitivity of data shared, the importance of services provided, and the potential impact of a compromise",
                "- Conduct cybersecurity due diligence assessments proportionate to each supplier's criticality tier",
                "- Establish differentiated monitoring and oversight requirements based on supplier criticality classifications",
                "- Review and update supplier criticality classifications periodically and when significant changes occur in the supplier relationship or threat environment",
              ].join("\n"),
            },
          ],
        },
      ],
    },

    // ======================================================================
    // ID - IDENTIFY
    // ======================================================================
    {
      number: "ID",
      title: "Identify",
      description:
        "The organization's current cybersecurity risks are understood. Understanding its assets, suppliers, and related cybersecurity risks enables an organization to prioritize its efforts consistent with its risk management strategy and the mission needs identified under GOVERN.",
      category: "Identify",
      categories: [
        // ── ID.AM: Asset Management ────────────────────────────────────
        {
          number: "ID.AM",
          title: "Asset Management",
          description:
            "Assets (e.g., data, hardware, software, systems, facilities, services, people) that enable the organization to achieve business purposes are identified and managed consistent with their relative importance to organizational objectives and the organization's risk strategy.",
          category: "Identify",
          controls: [
            {
              number: "ID.AM-01",
              title: "Inventories of hardware managed by the organization are maintained",
              objective:
                "The organization creates and maintains accurate, complete, and current inventories of all hardware assets under its management, including servers, workstations, mobile devices, network equipment, and IoT devices.",
              guidance: [
                "- Deploy automated asset discovery tools to continuously identify and catalog hardware assets across the network",
                "- Establish a hardware asset management process that includes acquisition, registration, tracking, and decommissioning procedures",
                "- Maintain key attributes for each hardware asset including owner, location, classification, network address, and lifecycle status",
                "- Reconcile automated discovery results with the asset inventory at regular intervals to identify unauthorized or unmanaged devices",
                "- Integrate the hardware asset inventory with vulnerability management and configuration management processes",
              ].join("\n"),
            },
            {
              number: "ID.AM-02",
              title: "Inventories of software, services, and systems managed by the organization are maintained",
              objective:
                "The organization creates and maintains accurate, complete, and current inventories of all software, services, and systems under its management, including installed applications, cloud services, and operating systems.",
              guidance: [
                "- Implement automated software inventory tools that discover and catalog all installed software, versions, and licenses across managed systems",
                "- Maintain an inventory of cloud services, SaaS applications, and externally hosted systems used by the organization",
                "- Record key attributes for each software asset including owner, version, license status, criticality, and end-of-life dates",
                "- Establish processes for approving and registering new software and services before deployment",
                "- Conduct periodic reviews to identify unauthorized software installations and shadow IT usage",
              ].join("\n"),
            },
            {
              number: "ID.AM-03",
              title: "Representations of the organization's authorized network communication and internal and external network data flows are maintained",
              objective:
                "The organization creates and maintains accurate representations of authorized network architecture, communication paths, and data flows between internal systems and external entities.",
              guidance: [
                "- Create and maintain network architecture diagrams that depict all authorized network segments, connections, and communication paths",
                "- Document internal and external data flows including the types of data transferred, source and destination systems, protocols, and ports",
                "- Identify and document all network boundaries, trust zones, and interconnection points with external networks",
                "- Review and update network diagrams and data flow documentation whenever significant changes to the network architecture occur",
                "- Use network monitoring tools to validate that actual traffic patterns align with documented authorized data flows",
              ].join("\n"),
            },
            {
              number: "ID.AM-04",
              title: "Inventories of services provided by suppliers are maintained",
              objective:
                "The organization maintains an accurate inventory of services provided by external suppliers, including cloud services, managed services, and outsourced functions, along with their cybersecurity relevance and criticality.",
              guidance: [
                "- Catalog all third-party services, including cloud platforms, managed security services, outsourced IT functions, and SaaS applications",
                "- Record key attributes for each supplier service including provider name, service description, data types processed, contractual terms, and criticality rating",
                "- Map supplier services to the organizational assets and business processes they support",
                "- Integrate the supplier services inventory with the supply chain risk management and vendor management programs",
                "- Review and update the supplier services inventory at least annually or upon significant changes to supplier relationships",
              ].join("\n"),
            },
            {
              number: "ID.AM-05",
              title: "Assets are prioritized based on classification, criticality, resources, and impact to the mission",
              objective:
                "The organization classifies and prioritizes its assets based on their criticality to the mission, the sensitivity of data they process, and the potential impact of their compromise or loss.",
              guidance: [
                "- Establish an asset classification scheme that categorizes assets by data sensitivity, business criticality, and regulatory requirements",
                "- Assign criticality ratings to all inventoried assets based on their role in supporting mission-critical business processes",
                "- Use asset classification and criticality ratings to prioritize cybersecurity protection efforts and resource allocation",
                "- Ensure asset classification is considered in risk assessments, vulnerability management, and incident response prioritization",
                "- Review and update asset classifications periodically and when significant changes to the business environment or threat landscape occur",
              ].join("\n"),
            },
          ],
        },

        // ── ID.RA: Risk Assessment ─────────────────────────────────────
        {
          number: "ID.RA",
          title: "Risk Assessment",
          description:
            "The cybersecurity risk to the organization, assets, and individuals is understood.",
          category: "Identify",
          controls: [
            {
              number: "ID.RA-01",
              title: "Vulnerabilities in assets are identified, validated, and recorded",
              objective:
                "The organization identifies, validates, and records vulnerabilities in its assets through systematic scanning, testing, and analysis to support informed risk management decisions.",
              guidance: [
                "- Implement automated vulnerability scanning across all managed hardware, software, and network assets on a regular schedule",
                "- Validate identified vulnerabilities through manual analysis or penetration testing to confirm exploitability and potential impact",
                "- Record all confirmed vulnerabilities in a centralized vulnerability management system with severity ratings, affected assets, and remediation status",
                "- Prioritize vulnerability remediation based on exploitability, asset criticality, and potential business impact",
                "- Integrate vulnerability data with the asset inventory and risk register to provide a comprehensive view of organizational risk exposure",
              ].join("\n"),
            },
            {
              number: "ID.RA-02",
              title: "Cyber threat intelligence is received from information sharing forums and sources",
              objective:
                "The organization receives and processes cyber threat intelligence from external information sharing forums, industry groups, government sources, and commercial feeds to enhance situational awareness and risk assessment.",
              guidance: [
                "- Subscribe to relevant cyber threat intelligence feeds, information sharing and analysis centers (ISACs), and government advisories",
                "- Establish processes for receiving, triaging, and analyzing threat intelligence from multiple sources",
                "- Correlate threat intelligence with the organization's asset inventory and vulnerability data to assess relevance and potential impact",
                "- Share relevant threat intelligence with internal teams responsible for risk assessment, vulnerability management, and incident response",
                "- Contribute to information sharing communities by providing anonymized threat data and incident information where appropriate",
              ].join("\n"),
            },
            {
              number: "ID.RA-03",
              title: "Internal and external threats to the organization are identified and recorded",
              objective:
                "The organization systematically identifies, documents, and maintains awareness of internal and external threats that could affect its cybersecurity posture, including threat actors, attack vectors, and emerging threat trends.",
              guidance: [
                "- Conduct periodic threat assessments that consider both internal threats (insider risk, human error) and external threats (nation-states, cybercriminals, hacktivists)",
                "- Maintain a threat catalog that documents known threat actors, their motivations, capabilities, and targeted attack vectors relevant to the organization",
                "- Monitor threat intelligence sources for emerging threats and changes in the threat landscape that are relevant to the organization's industry and operations",
                "- Integrate threat identification outputs into the risk assessment process to ensure threats are considered alongside vulnerabilities and potential impacts",
                "- Update the threat catalog regularly based on new intelligence, incident investigations, and changes in the organization's attack surface",
              ].join("\n"),
            },
            {
              number: "ID.RA-04",
              title: "Potential impacts and likelihoods of threats exploiting vulnerabilities are identified and recorded",
              objective:
                "The organization assesses and records the potential impacts and likelihoods of identified threats exploiting known vulnerabilities, providing quantitative or qualitative risk ratings to support prioritized risk treatment decisions.",
              guidance: [
                "- Establish a risk assessment methodology that considers threat likelihood, vulnerability exploitability, and potential business impact",
                "- Assess the potential impact of successful exploitation across dimensions including financial loss, operational disruption, reputational damage, and regulatory penalties",
                "- Assign risk ratings using a consistent framework that combines likelihood and impact assessments",
                "- Document risk assessment results in the organizational risk register with supporting rationale and evidence",
                "- Review and update risk ratings when new threat intelligence, vulnerability data, or environmental changes warrant reassessment",
              ].join("\n"),
            },
            {
              number: "ID.RA-05",
              title: "Threats, vulnerabilities, likelihoods, and impacts are used to understand inherent risk and inform risk response prioritization",
              objective:
                "The organization uses the results of threat, vulnerability, likelihood, and impact analyses to calculate inherent risk levels and prioritize risk response activities commensurate with organizational risk appetite and tolerance.",
              guidance: [
                "- Aggregate threat, vulnerability, likelihood, and impact data to calculate inherent risk levels for each identified risk",
                "- Prioritize risk response activities based on inherent risk levels, organizational risk tolerance, and available resources",
                "- Develop risk treatment plans that specify the selected response option (mitigate, transfer, accept, avoid) for each prioritized risk",
                "- Communicate prioritized risk response plans to leadership and responsible stakeholders for approval and resource allocation",
                "- Track the implementation and effectiveness of risk response activities and adjust priorities as the risk landscape evolves",
              ].join("\n"),
            },
            {
              number: "ID.RA-06",
              title: "Risk responses are chosen, prioritized, planned, tracked, and communicated",
              objective:
                "The organization selects, prioritizes, plans, tracks, and communicates risk responses for identified cybersecurity risks, ensuring that risk treatment activities are executed effectively and their progress is visible to stakeholders.",
              guidance: [
                "- Select risk response strategies (mitigate, transfer, accept, avoid) for each identified risk based on cost-benefit analysis and organizational priorities",
                "- Develop detailed risk response plans with clear objectives, responsible owners, timelines, resource requirements, and success criteria",
                "- Track the execution of risk response plans using a centralized tracking system and report progress to leadership regularly",
                "- Communicate risk response decisions, plans, and status to relevant stakeholders through established governance channels",
                "- Evaluate the effectiveness of implemented risk responses and adjust plans as necessary based on residual risk assessments",
              ].join("\n"),
            },
          ],
        },

        // ── ID.IM: Improvement ─────────────────────────────────────────
        {
          number: "ID.IM",
          title: "Improvement",
          description:
            "Improvements to organizational cybersecurity risk management processes, procedures, and activities are identified across all CSF Functions.",
          category: "Identify",
          controls: [
            {
              number: "ID.IM-01",
              title: "Improvements are identified from evaluations",
              objective:
                "The organization identifies opportunities for improving its cybersecurity risk management processes, controls, and practices through systematic evaluations, including assessments, audits, reviews, and exercises.",
              guidance: [
                "- Conduct regular cybersecurity assessments, audits, and reviews to evaluate the effectiveness of risk management processes and controls",
                "- Perform tabletop exercises, simulations, and red team engagements to identify gaps in detection, response, and recovery capabilities",
                "- Analyze evaluation results to identify systemic weaknesses, recurring issues, and opportunities for improvement",
                "- Document improvement recommendations with clear descriptions, rationale, expected benefits, and implementation priority",
                "- Establish a formal process for tracking identified improvements from evaluation to implementation and verification",
              ].join("\n"),
            },
            {
              number: "ID.IM-02",
              title: "Improvements are identified from security tests and exercises, including those done in coordination with suppliers and relevant third parties",
              objective:
                "The organization identifies cybersecurity improvements from security testing and exercises conducted both internally and in coordination with suppliers, partners, and relevant third parties.",
              guidance: [
                "- Conduct regular security testing including penetration tests, vulnerability assessments, and security control validation exercises",
                "- Coordinate security exercises with key suppliers and partners to test the effectiveness of shared incident response and communication procedures",
                "- Analyze security test and exercise outcomes to identify control gaps, process weaknesses, and areas requiring improvement",
                "- Document lessons learned from security tests and exercises and translate them into actionable improvement plans",
                "- Share relevant findings from coordinated exercises with participating suppliers and partners to enable mutual improvement",
              ].join("\n"),
            },
            {
              number: "ID.IM-03",
              title: "Improvements are identified from execution of operational processes, procedures, and activities",
              objective:
                "The organization identifies opportunities for cybersecurity improvement through ongoing analysis of operational processes, procedures, and day-to-day activities, including incident handling, change management, and access management.",
              guidance: [
                "- Collect and analyze operational metrics and key performance indicators to identify trends, inefficiencies, and areas for improvement",
                "- Conduct post-incident reviews and root cause analyses to identify process and control improvements that would prevent recurrence",
                "- Solicit feedback from operational staff on process friction points, tool effectiveness, and training needs",
                "- Review change management records and access management activities for patterns that indicate process improvement opportunities",
                "- Implement a continuous improvement cycle that systematically incorporates lessons learned from operations into updated processes and controls",
              ].join("\n"),
            },
          ],
        },
      ],
    },

    // ======================================================================
    // PR - PROTECT
    // ======================================================================
    {
      number: "PR",
      title: "Protect",
      description:
        "Safeguards to manage the organization's cybersecurity risks are used. Once assets and risks are identified and prioritized, PROTECT supports the ability to secure those assets to prevent or lower the likelihood and impact of adverse cybersecurity events.",
      category: "Protect",
      categories: [
        // ── PR.AA: Identity Management, Authentication, and Access Control
        {
          number: "PR.AA",
          title: "Identity Management, Authentication, and Access Control",
          description:
            "Access to physical and logical assets is limited to authorized users, services, and hardware and managed commensurate with the assessed risk of unauthorized access.",
          category: "Protect",
          controls: [
            {
              number: "PR.AA-01",
              title: "Identities and credentials for authorized users, services, and hardware are managed by the organization",
              objective:
                "The organization manages identities and credentials for all authorized users, services, and hardware devices throughout their lifecycle, including provisioning, maintenance, and deprovisioning.",
              guidance: [
                "- Implement a centralized identity management system that governs the lifecycle of all user, service, and device identities",
                "- Establish identity provisioning processes that verify authorization before granting credentials and access rights",
                "- Enforce credential management policies including password complexity, rotation schedules, and prohibition of shared accounts",
                "- Implement automated deprovisioning processes that revoke identities and credentials promptly upon termination or role change",
                "- Maintain an authoritative identity directory and regularly reconcile it with active accounts across all systems",
              ].join("\n"),
            },
            {
              number: "PR.AA-02",
              title: "Identities are proofed and bound to credentials based on the context of interactions",
              objective:
                "The organization verifies identities through appropriate proofing methods and binds them to credentials with strength commensurate to the sensitivity and risk of the systems and data being accessed.",
              guidance: [
                "- Establish identity proofing procedures that verify the identity of users before issuing credentials, with rigor proportional to the access level granted",
                "- Implement risk-based authentication that adjusts credential strength requirements based on the sensitivity of resources being accessed",
                "- Use strong credential binding mechanisms such as hardware tokens, biometrics, or certificate-based authentication for high-risk access",
                "- Maintain records of identity proofing activities and credential issuance for audit and compliance purposes",
                "- Review identity proofing and credential binding practices periodically to ensure they remain appropriate for the current threat environment",
              ].join("\n"),
            },
            {
              number: "PR.AA-03",
              title: "Users, services, and hardware are authenticated",
              objective:
                "The organization implements authentication mechanisms for all users, services, and hardware that access organizational systems and data, using methods appropriate to the risk level of the resources being accessed.",
              guidance: [
                "- Implement multi-factor authentication (MFA) for all remote access, privileged accounts, and access to sensitive systems and data",
                "- Deploy appropriate authentication mechanisms for service accounts and machine-to-machine communications, such as certificates or API keys",
                "- Establish authentication policies that specify required authentication strength for different resource classifications",
                "- Monitor authentication events for anomalies including failed attempts, unusual locations, and impossible travel patterns",
                "- Regularly review and update authentication mechanisms to address emerging threats and adopt stronger methods as they become available",
              ].join("\n"),
            },
            {
              number: "PR.AA-04",
              title: "Identity assertions are protected, conveyed, and verified",
              objective:
                "The organization ensures that identity assertions — such as tokens, tickets, and certificates — are protected against tampering and interception, securely conveyed between parties, and verified before granting access.",
              guidance: [
                "- Implement secure protocols for conveying identity assertions, such as SAML, OAuth 2.0, or OpenID Connect, with appropriate encryption",
                "- Protect identity assertion tokens with signing, encryption, and expiration controls to prevent tampering and replay attacks",
                "- Validate identity assertions at each point of consumption to ensure authenticity, integrity, and currency",
                "- Implement token lifecycle management including issuance, refresh, and revocation capabilities",
                "- Monitor for anomalous identity assertion usage patterns that may indicate credential theft or abuse",
              ].join("\n"),
            },
            {
              number: "PR.AA-05",
              title: "Access permissions, entitlements, and authorizations are defined in a policy, managed, enforced, and reviewed, and incorporate the principles of least privilege and separation of duties",
              objective:
                "The organization defines, manages, enforces, and regularly reviews access permissions and authorizations based on policies that implement the principles of least privilege and separation of duties.",
              guidance: [
                "- Establish access control policies that enforce least privilege and separation of duties principles across all systems and applications",
                "- Implement role-based access control (RBAC) or attribute-based access control (ABAC) to manage entitlements systematically",
                "- Conduct periodic access reviews and recertification campaigns to verify that permissions remain appropriate for current roles and responsibilities",
                "- Automate access provisioning and deprovisioning workflows to reduce errors and ensure timely enforcement of access changes",
                "- Monitor for and investigate privilege escalation, excessive access accumulation, and violations of separation of duties policies",
                "- Document access control exceptions with business justification and compensating controls, and review them periodically",
              ].join("\n"),
            },
          ],
        },

        // ── PR.AT: Awareness and Training ──────────────────────────────
        {
          number: "PR.AT",
          title: "Awareness and Training",
          description:
            "The organization's personnel are provided cybersecurity awareness and training so that they can perform their cybersecurity-related tasks.",
          category: "Protect",
          controls: [
            {
              number: "PR.AT-01",
              title: "Personnel are provided with awareness and training so that they possess the knowledge and skills to perform general tasks with cybersecurity risks in mind",
              objective:
                "The organization provides cybersecurity awareness and training to all personnel so they understand cybersecurity risks relevant to their work, can recognize common threats, and follow organizational security policies and procedures.",
              guidance: [
                "- Develop a comprehensive cybersecurity awareness program that covers organizational policies, common threats, and expected security behaviors",
                "- Deliver mandatory cybersecurity awareness training to all employees during onboarding and at regular intervals thereafter",
                "- Include practical topics such as phishing recognition, password hygiene, social engineering, physical security, and data handling practices",
                "- Use varied training methods including interactive modules, simulated phishing campaigns, and security awareness communications",
                "- Track training completion rates, assessment scores, and behavioral metrics to measure program effectiveness and identify areas for improvement",
              ].join("\n"),
            },
            {
              number: "PR.AT-02",
              title: "Individuals in specialized roles are provided with awareness and training so that they possess the knowledge and skills to perform relevant tasks with cybersecurity risks in mind",
              objective:
                "The organization provides targeted cybersecurity training to individuals in specialized roles — including IT staff, developers, security analysts, and system administrators — so they have the skills to manage cybersecurity risks within their areas of responsibility.",
              guidance: [
                "- Identify specialized roles that require targeted cybersecurity training and define the competencies and skills needed for each role",
                "- Develop role-specific training curricula that address the cybersecurity knowledge and skills required for specialized functions",
                "- Provide advanced technical training on topics such as secure coding, incident response, threat hunting, security architecture, and forensic analysis as appropriate",
                "- Support professional development through certifications, conferences, and hands-on training exercises relevant to specialized roles",
                "- Assess the effectiveness of role-specific training through practical exercises, skills assessments, and on-the-job performance evaluation",
              ].join("\n"),
            },
          ],
        },

        // ── PR.DS: Data Security ───────────────────────────────────────
        {
          number: "PR.DS",
          title: "Data Security",
          description:
            "Data are managed consistent with the organization's risk strategy to protect the confidentiality, integrity, and availability of information.",
          category: "Protect",
          controls: [
            {
              number: "PR.DS-01",
              title: "The confidentiality, integrity, and availability of data-at-rest are protected",
              objective:
                "The organization implements controls to protect the confidentiality, integrity, and availability of data stored in databases, file systems, cloud storage, removable media, and other repositories.",
              guidance: [
                "- Classify all data assets by sensitivity level and apply protection controls commensurate with each classification tier",
                "- Implement encryption for sensitive data at rest using industry-standard algorithms and key management practices",
                "- Deploy access controls that restrict data access to authorized users and processes based on the principle of least privilege",
                "- Implement integrity controls such as checksums, digital signatures, and tamper detection mechanisms for critical data stores",
                "- Establish backup and recovery procedures that ensure data availability and test them regularly to verify recoverability",
                "- Monitor data repositories for unauthorized access, modification, or exfiltration attempts",
              ].join("\n"),
            },
            {
              number: "PR.DS-02",
              title: "The confidentiality, integrity, and availability of data-in-transit are protected",
              objective:
                "The organization implements controls to protect the confidentiality, integrity, and availability of data transmitted across internal and external networks, including wired, wireless, and internet communications.",
              guidance: [
                "- Encrypt all sensitive data in transit using strong cryptographic protocols such as TLS 1.2 or higher, IPsec, or equivalent standards",
                "- Implement network segmentation and secure communication channels for transmitting sensitive data between internal systems",
                "- Use VPN or equivalent secure tunneling technologies for remote access and data transmission over untrusted networks",
                "- Implement integrity verification mechanisms for data in transit such as message authentication codes and digital signatures",
                "- Monitor network traffic for indicators of data interception, manipulation, or unauthorized exfiltration",
              ].join("\n"),
            },
          ],
        },

        // ── PR.PS: Platform Security ───────────────────────────────────
        {
          number: "PR.PS",
          title: "Platform Security",
          description:
            "The hardware, software, and services of physical and virtual platforms are managed consistent with the organization's risk strategy to protect their confidentiality, integrity, and availability.",
          category: "Protect",
          controls: [
            {
              number: "PR.PS-01",
              title: "Configuration management practices are established and applied",
              objective:
                "The organization establishes and applies configuration management practices to maintain the security, integrity, and consistency of hardware, software, and system configurations across the environment.",
              guidance: [
                "- Establish secure baseline configurations for all hardware, software, and system components based on industry benchmarks and organizational requirements",
                "- Implement configuration management tools to automate the deployment, monitoring, and enforcement of approved configurations",
                "- Maintain a configuration management database (CMDB) that tracks the approved configuration state of all managed assets",
                "- Monitor for configuration drift and unauthorized changes using automated detection mechanisms",
                "- Review and update baseline configurations periodically and when new vulnerabilities or threats are identified",
              ].join("\n"),
            },
            {
              number: "PR.PS-02",
              title: "Software is maintained, replaced, and removed commensurate with risk",
              objective:
                "The organization maintains, updates, replaces, and removes software in a timely manner based on risk, ensuring that patches are applied, end-of-life software is replaced, and unnecessary software is removed.",
              guidance: [
                "- Establish a patch management program that ensures timely identification, testing, and deployment of security patches across all managed software",
                "- Define patching timelines based on vulnerability severity and asset criticality, with accelerated timelines for critical vulnerabilities",
                "- Maintain awareness of software end-of-life and end-of-support dates and plan for timely replacement or migration",
                "- Remove unauthorized, unnecessary, or end-of-life software from managed systems to reduce the attack surface",
                "- Track and report on patch compliance metrics and remediation timelines to leadership",
              ].join("\n"),
            },
            {
              number: "PR.PS-03",
              title: "Hardware is maintained, replaced, and removed commensurate with risk",
              objective:
                "The organization maintains, replaces, and removes hardware in a timely manner based on risk, ensuring that firmware is updated, end-of-life hardware is replaced, and decommissioned hardware is securely disposed of.",
              guidance: [
                "- Establish a hardware lifecycle management program that tracks assets from acquisition through decommissioning",
                "- Apply firmware and hardware-level security updates in a timely manner based on risk and vendor advisories",
                "- Plan for and execute timely replacement of hardware that is approaching or has reached end-of-life or end-of-support",
                "- Implement secure disposal procedures for decommissioned hardware, including data sanitization and physical destruction as appropriate",
                "- Maintain hardware maintenance records and warranty information to support lifecycle management decisions",
              ].join("\n"),
            },
            {
              number: "PR.PS-04",
              title: "Log records are generated and made available for continuous monitoring",
              objective:
                "The organization generates, collects, and retains log records from systems, networks, and applications to support continuous monitoring, incident detection, and forensic analysis.",
              guidance: [
                "- Define logging requirements that specify which events must be captured across systems, applications, and network devices",
                "- Configure systems to generate log records for security-relevant events including authentication, authorization, configuration changes, and administrative actions",
                "- Centralize log collection using a SIEM or log management platform that aggregates, normalizes, and stores logs from all sources",
                "- Establish log retention policies that comply with legal, regulatory, and organizational requirements",
                "- Protect log integrity through access controls, tamper detection, and secure storage mechanisms",
                "- Make log data available to security operations teams for real-time monitoring, alerting, and incident investigation",
              ].join("\n"),
            },
          ],
        },

        // ── PR.IR: Technology Infrastructure Resilience ────────────────
        {
          number: "PR.IR",
          title: "Technology Infrastructure Resilience",
          description:
            "Security architectures are managed with the organization's risk strategy to protect asset confidentiality, integrity, and availability, and organizational resilience.",
          category: "Protect",
          controls: [
            {
              number: "PR.IR-01",
              title: "Networks and environments are protected from unauthorized logical access and usage",
              objective:
                "The organization implements network security controls to protect networks and environments from unauthorized logical access, lateral movement, and misuse, supporting defense-in-depth principles.",
              guidance: [
                "- Implement network segmentation to isolate critical assets, sensitive data environments, and different trust zones",
                "- Deploy firewalls, intrusion prevention systems, and network access control mechanisms at network boundaries and between segments",
                "- Implement zero-trust network architecture principles where feasible, requiring verification for every access request regardless of source",
                "- Monitor network traffic for unauthorized access attempts, lateral movement, and policy violations",
                "- Review and update network access control rules and segmentation policies regularly based on changes to the environment and threat landscape",
              ].join("\n"),
            },
            {
              number: "PR.IR-02",
              title: "The organization's technology assets are protected from environmental threats and natural disasters",
              objective:
                "The organization implements physical and environmental controls to protect technology infrastructure from environmental threats, natural disasters, and physical hazards that could disrupt operations.",
              guidance: [
                "- Implement environmental controls in data centers and critical facilities including fire suppression, climate control, and water detection systems",
                "- Assess and mitigate risks from natural disasters, power outages, and other environmental hazards through redundancy and geographic distribution",
                "- Implement uninterruptible power supplies (UPS) and backup generators to ensure continued operations during power disruptions",
                "- Establish disaster recovery sites and capabilities that enable timely restoration of critical technology services",
                "- Test environmental controls and disaster recovery capabilities regularly to verify their effectiveness",
              ].join("\n"),
            },
          ],
        },
      ],
    },

    // ======================================================================
    // DE - DETECT
    // ======================================================================
    {
      number: "DE",
      title: "Detect",
      description:
        "Possible cybersecurity attacks and compromises are found and analyzed. DETECT enables timely discovery and analysis of anomalies, indicators of compromise, and other potentially adverse cybersecurity events that may indicate that cybersecurity attacks and compromises are occurring.",
      category: "Detect",
      categories: [
        // ── DE.CM: Continuous Monitoring ────────────────────────────────
        {
          number: "DE.CM",
          title: "Continuous Monitoring",
          description:
            "Assets are monitored to find anomalies, indicators of compromise, and other potentially adverse events.",
          category: "Detect",
          controls: [
            {
              number: "DE.CM-01",
              title: "Networks and network services are monitored to find potentially adverse events",
              objective:
                "The organization continuously monitors networks and network services to detect potentially adverse events, including unauthorized access, malicious traffic, and anomalous behavior.",
              guidance: [
                "- Deploy network monitoring tools including intrusion detection systems (IDS), network traffic analysis, and flow monitoring across all network segments",
                "- Establish baseline network behavior profiles and configure alerts for deviations that may indicate adverse events",
                "- Monitor network perimeter, internal segments, and cloud network environments for unauthorized connections and suspicious traffic patterns",
                "- Integrate network monitoring data with the SIEM platform for correlation with other security event data",
                "- Review and tune network monitoring rules and alert thresholds regularly to reduce false positives and improve detection accuracy",
              ].join("\n"),
            },
            {
              number: "DE.CM-02",
              title: "The physical environment is monitored to find potentially adverse events",
              objective:
                "The organization monitors the physical environment of facilities housing critical technology assets to detect potentially adverse events, including unauthorized physical access, environmental anomalies, and equipment failures.",
              guidance: [
                "- Deploy physical security monitoring systems including surveillance cameras, access control systems, and intrusion detection sensors at critical facilities",
                "- Implement environmental monitoring for temperature, humidity, water, and power conditions in data centers and server rooms",
                "- Establish alerting thresholds and escalation procedures for physical security and environmental anomalies",
                "- Integrate physical security monitoring with security operations for coordinated awareness and response",
                "- Review physical access logs and surveillance records regularly to identify unauthorized access attempts or anomalous activity",
              ].join("\n"),
            },
            {
              number: "DE.CM-03",
              title: "Personnel activity and technology usage are monitored to find potentially adverse events",
              objective:
                "The organization monitors personnel activity and technology usage to detect potentially adverse events, including insider threats, policy violations, and compromised accounts.",
              guidance: [
                "- Implement user activity monitoring and user behavior analytics (UBA) to detect anomalous behavior patterns that may indicate insider threats or compromised accounts",
                "- Monitor privileged user activities with enhanced scrutiny including session recording and command logging for administrative access",
                "- Establish baseline user behavior profiles and configure alerts for significant deviations from normal patterns",
                "- Ensure personnel monitoring activities comply with applicable privacy laws, regulations, and organizational policies",
                "- Correlate personnel activity data with other security event data in the SIEM to improve detection of multi-stage attacks",
              ].join("\n"),
            },
            {
              number: "DE.CM-04",
              title: "Computing hardware and software, runtime environments, and their data are monitored to find potentially adverse events",
              objective:
                "The organization monitors computing hardware, software, runtime environments, and their associated data to detect potentially adverse events including malware, unauthorized changes, and anomalous system behavior.",
              guidance: [
                "- Deploy endpoint detection and response (EDR) solutions across all managed computing devices to detect malware, suspicious processes, and unauthorized activities",
                "- Implement file integrity monitoring (FIM) on critical systems to detect unauthorized changes to system files, configurations, and application binaries",
                "- Monitor runtime environments including containers, virtual machines, and cloud workloads for anomalous behavior and configuration changes",
                "- Collect and analyze system logs, application logs, and security events from computing assets for indicators of compromise",
                "- Integrate endpoint and system monitoring data with centralized security monitoring for comprehensive threat detection",
              ].join("\n"),
            },
            {
              number: "DE.CM-05",
              title: "External service provider activities and services are monitored to find potentially adverse events",
              objective:
                "The organization monitors the activities and services of external service providers to detect potentially adverse events that could affect the organization's cybersecurity posture.",
              guidance: [
                "- Establish monitoring requirements for external service providers in contracts and service-level agreements",
                "- Collect and analyze security logs and event data from external service providers, including cloud platforms and managed services",
                "- Monitor external service provider security posture through continuous monitoring tools, security ratings, and periodic assessments",
                "- Establish alerting and escalation procedures for adverse events detected in external service provider environments",
                "- Coordinate with external service providers on shared monitoring and threat intelligence to improve mutual detection capabilities",
              ].join("\n"),
            },
            {
              number: "DE.CM-06",
              title: "Images, containers, and deployed software are monitored to find potentially adverse events",
              objective:
                "The organization monitors container images, deployed containers, and software artifacts to detect potentially adverse events including vulnerable components, unauthorized modifications, and runtime anomalies.",
              guidance: [
                "- Scan container images and software artifacts for known vulnerabilities, malware, and misconfigurations before and after deployment",
                "- Implement runtime monitoring for deployed containers and software to detect anomalous behavior, unauthorized process execution, and network communication",
                "- Enforce policies that prevent the deployment of images or software that do not meet security requirements",
                "- Monitor software supply chain integrity by verifying signatures, checksums, and provenance of deployed artifacts",
                "- Integrate container and software monitoring data with centralized security operations for comprehensive threat detection and response",
              ].join("\n"),
            },
          ],
        },

        // ── DE.AE: Adverse Event Analysis ──────────────────────────────
        {
          number: "DE.AE",
          title: "Adverse Event Analysis",
          description:
            "Anomalies, indicators of compromise, and other potentially adverse events are analyzed to characterize the events and detect cybersecurity incidents.",
          category: "Detect",
          controls: [
            {
              number: "DE.AE-01",
              title: "The estimated impact and scope of adverse events are understood",
              objective:
                "The organization analyzes detected adverse events to understand their estimated impact and scope, including affected assets, data, users, and business processes, to support appropriate response decisions.",
              guidance: [
                "- Develop and maintain playbooks for assessing the impact and scope of common adverse event types",
                "- Establish processes for rapidly determining the assets, data, and business processes affected by a detected adverse event",
                "- Use threat intelligence and contextual information to assess the potential severity and extent of adverse events",
                "- Communicate impact and scope assessments to incident response teams and leadership to inform response prioritization",
                "- Document impact and scope analysis for each adverse event to support post-incident review and continuous improvement",
              ].join("\n"),
            },
            {
              number: "DE.AE-02",
              title: "Potentially adverse events are analyzed to better understand associated activities",
              objective:
                "The organization conducts detailed analysis of potentially adverse events to understand the associated activities, techniques, and objectives of threat actors, enabling more effective detection and response.",
              guidance: [
                "- Investigate potentially adverse events using structured analysis methodologies to determine root cause, attack vectors, and threat actor techniques",
                "- Correlate adverse event data across multiple sources including network logs, endpoint telemetry, and threat intelligence to build comprehensive attack narratives",
                "- Map observed adversary activities to established threat frameworks such as MITRE ATT&CK to understand tactics, techniques, and procedures",
                "- Document analysis findings including indicators of compromise, timeline of activities, and attribution assessments",
                "- Use analysis results to improve detection rules, monitoring capabilities, and threat models",
              ].join("\n"),
            },
            {
              number: "DE.AE-03",
              title: "Information is correlated from multiple sources",
              objective:
                "The organization correlates information from multiple monitoring sources — including network, endpoint, application, and threat intelligence — to improve the accuracy and completeness of adverse event analysis.",
              guidance: [
                "- Implement a centralized SIEM platform that aggregates and correlates security event data from diverse sources across the environment",
                "- Develop correlation rules that identify complex attack patterns spanning multiple systems, network segments, and time periods",
                "- Integrate external threat intelligence feeds with internal security event data to enrich context and improve detection accuracy",
                "- Automate correlation processes where possible to reduce analyst workload and improve time-to-detection",
                "- Regularly review and refine correlation rules based on new threat intelligence, attack trends, and false positive analysis",
              ].join("\n"),
            },
            {
              number: "DE.AE-04",
              title: "The estimated impact and scope of adverse events are understood",
              objective:
                "When adverse events are confirmed as cybersecurity incidents, the organization declares them according to established criteria and initiates the incident response process with clear understanding of severity and scope.",
              guidance: [
                "- Establish clear incident declaration criteria that define when an adverse event qualifies as a cybersecurity incident requiring formal response",
                "- Implement incident classification and severity rating schemes that guide the level of response effort and escalation required",
                "- Ensure that incident declarations are communicated to all relevant stakeholders including incident response teams, leadership, and affected business units",
                "- Document the basis for incident declarations including the analysis performed, evidence gathered, and classification rationale",
                "- Review incident declaration criteria periodically to ensure they remain appropriate for the organization's risk environment and operational context",
              ].join("\n"),
            },
          ],
        },
      ],
    },

    // ======================================================================
    // RS - RESPOND
    // ======================================================================
    {
      number: "RS",
      title: "Respond",
      description:
        "Actions regarding a detected cybersecurity incident are taken. RESPOND supports the ability to contain the effects of cybersecurity incidents. Outcomes within this Function cover incident management, analysis, mitigation, reporting, and communication.",
      category: "Respond",
      categories: [
        // ── RS.MA: Incident Management ─────────────────────────────────
        {
          number: "RS.MA",
          title: "Incident Management",
          description:
            "Responses to detected cybersecurity incidents are managed.",
          category: "Respond",
          controls: [
            {
              number: "RS.MA-01",
              title: "The incident response plan is executed in coordination with relevant third parties once an incident is declared",
              objective:
                "The organization executes its incident response plan promptly upon incident declaration and coordinates response activities with relevant third parties, including service providers, law enforcement, and regulatory bodies as appropriate.",
              guidance: [
                "- Maintain a documented and tested incident response plan that defines roles, responsibilities, procedures, and communication protocols",
                "- Activate the incident response plan immediately upon incident declaration and assemble the incident response team",
                "- Coordinate with relevant third parties including managed security service providers, forensic investigators, legal counsel, and law enforcement as required",
                "- Maintain pre-established communication channels and contact information for third-party coordination during incidents",
                "- Document all response actions, decisions, and communications throughout the incident lifecycle for post-incident review",
              ].join("\n"),
            },
            {
              number: "RS.MA-02",
              title: "Incident reports are triaged and validated",
              objective:
                "The organization triages and validates incoming incident reports to determine their accuracy, severity, and priority, ensuring that response resources are allocated appropriately.",
              guidance: [
                "- Establish a structured triage process for incoming incident reports that assesses validity, severity, scope, and required response urgency",
                "- Define triage criteria and decision trees that guide analysts in validating and prioritizing incident reports consistently",
                "- Verify the accuracy of incident reports through preliminary investigation and correlation with available monitoring data",
                "- Assign severity and priority ratings based on validated impact assessment and organizational risk tolerance",
                "- Escalate validated high-severity incidents to senior incident response personnel and leadership according to established procedures",
              ].join("\n"),
            },
            {
              number: "RS.MA-03",
              title: "Incidents are categorized and prioritized",
              objective:
                "The organization categorizes confirmed incidents by type and prioritizes them based on severity, impact, and urgency to ensure that response resources are focused on the most critical incidents.",
              guidance: [
                "- Implement an incident categorization scheme that classifies incidents by type such as malware, unauthorized access, data breach, denial of service, and insider threat",
                "- Establish incident prioritization criteria that consider business impact, data sensitivity, regulatory implications, and threat actor capability",
                "- Assign priority levels that determine response timelines, resource allocation, and escalation requirements",
                "- Re-evaluate incident categorization and priority as additional information is gathered during the response process",
                "- Maintain incident categorization data for trend analysis, reporting, and continuous improvement of detection capabilities",
              ].join("\n"),
            },
            {
              number: "RS.MA-04",
              title: "Incidents are escalated or elevated as needed",
              objective:
                "The organization establishes and follows escalation procedures to ensure that incidents are elevated to appropriate management levels and specialized resources when the scope, severity, or complexity exceeds current response capabilities.",
              guidance: [
                "- Define escalation criteria and thresholds that trigger elevation to senior management, specialized teams, or external resources",
                "- Establish clear escalation paths and communication protocols for different incident types and severity levels",
                "- Ensure escalation procedures include notification to legal, compliance, public relations, and executive leadership when required",
                "- Document all escalation decisions including the rationale, timing, and recipients of escalation notifications",
                "- Review escalation procedures after significant incidents to identify opportunities for improvement",
              ].join("\n"),
            },
            {
              number: "RS.MA-05",
              title: "The criteria for initiating incident recovery are applied",
              objective:
                "The organization establishes and applies criteria for transitioning from incident response to recovery, ensuring that containment is complete, threats are eradicated, and systems are safe to restore before initiating recovery activities.",
              guidance: [
                "- Define criteria for transitioning from response to recovery, including confirmation that the threat has been contained and eradicated",
                "- Verify that compromised systems have been isolated, malicious artifacts removed, and attack vectors closed before beginning recovery",
                "- Conduct a readiness assessment before restoring systems to production, including integrity verification of recovery data and configurations",
                "- Coordinate recovery initiation with affected business units, IT operations, and management to align on timing and priorities",
                "- Document the transition from response to recovery including the evidence and rationale supporting the recovery decision",
              ].join("\n"),
            },
          ],
        },

        // ── RS.AN: Incident Analysis ───────────────────────────────────
        {
          number: "RS.AN",
          title: "Incident Analysis",
          description:
            "Investigations are conducted to ensure effective response and support forensics and recovery activities.",
          category: "Respond",
          controls: [
            {
              number: "RS.AN-01",
              title: "Investigations are conducted to support effective response and identify root cause",
              objective:
                "The organization conducts thorough investigations of cybersecurity incidents to understand the root cause, attack vectors, techniques used, and full scope of compromise, supporting effective response and preventing recurrence.",
              guidance: [
                "- Establish investigation procedures that preserve evidence integrity while enabling rapid analysis of incident scope and root cause",
                "- Conduct forensic analysis of affected systems, network traffic, and log data to reconstruct the attack timeline and identify root cause",
                "- Determine the initial attack vector, lateral movement techniques, persistence mechanisms, and data exfiltration methods used by the threat actor",
                "- Document investigation findings comprehensively, including technical evidence, timeline, affected assets, and root cause analysis",
                "- Use investigation results to inform containment actions, eradication steps, and long-term remediation efforts",
              ].join("\n"),
            },
            {
              number: "RS.AN-02",
              title: "Actions performed during an investigation are logged and the integrity of those actions is preserved",
              objective:
                "The organization logs all actions performed during incident investigations and preserves the integrity of those logs to maintain chain of custody and support potential legal proceedings.",
              guidance: [
                "- Establish chain-of-custody procedures for all evidence collected and analyzed during incident investigations",
                "- Log all investigative actions including system accesses, tool usage, evidence collection, and analysis activities with timestamps and responsible individuals",
                "- Preserve the integrity of investigation logs and evidence through write-protection, hashing, and secure storage mechanisms",
                "- Use forensically sound tools and methodologies that preserve evidence integrity and are admissible in legal proceedings",
                "- Retain investigation logs and evidence in accordance with legal, regulatory, and organizational retention requirements",
              ].join("\n"),
            },
            {
              number: "RS.AN-03",
              title: "Cyber threat intelligence and other contextual information are integrated into the analysis",
              objective:
                "The organization integrates cyber threat intelligence and contextual information into incident analysis to enhance understanding of threat actor motivations, techniques, and potential next steps.",
              guidance: [
                "- Correlate incident indicators of compromise with external threat intelligence to identify known threat actors, campaigns, and attack patterns",
                "- Use threat intelligence to anticipate potential next steps by the attacker and proactively harden related systems",
                "- Integrate contextual information about affected assets, business processes, and data sensitivity into the incident analysis",
                "- Share relevant incident indicators and findings with trusted threat intelligence sharing communities",
                "- Maintain updated threat intelligence resources and ensure analysts have access to current information during investigations",
              ].join("\n"),
            },
          ],
        },

        // ── RS.CO: Incident Response Reporting and Communication ───────
        {
          number: "RS.CO",
          title: "Incident Response Reporting and Communication",
          description:
            "Response activities are coordinated with internal and external stakeholders as required by laws, regulations, or policies.",
          category: "Respond",
          controls: [
            {
              number: "RS.CO-01",
              title: "Internal and external stakeholders are notified of incidents",
              objective:
                "The organization notifies appropriate internal and external stakeholders of cybersecurity incidents in a timely manner, in accordance with established communication plans and applicable legal and regulatory requirements.",
              guidance: [
                "- Establish incident notification procedures that specify who must be notified, when, and through which communication channels for different incident types and severity levels",
                "- Notify internal stakeholders including executive leadership, legal counsel, affected business units, and communications teams according to the notification plan",
                "- Notify external stakeholders including regulators, law enforcement, affected customers, and partners as required by law, regulation, or contractual obligation",
                "- Prepare template communications and press statements in advance to enable rapid and accurate stakeholder notification during incidents",
                "- Document all notification activities including timing, recipients, content, and delivery confirmation",
              ].join("\n"),
            },
            {
              number: "RS.CO-02",
              title: "Internal and external stakeholders are provided with status updates on incidents",
              objective:
                "The organization provides timely and accurate status updates to internal and external stakeholders throughout the incident lifecycle, keeping them informed of response progress, impact changes, and expected resolution timelines.",
              guidance: [
                "- Establish a cadence for status updates based on incident severity and stakeholder needs, with more frequent updates for higher-severity incidents",
                "- Develop standardized status update templates that convey key information including current status, actions taken, impact assessment, and next steps",
                "- Designate authorized spokespersons for internal and external communications to ensure consistency and accuracy of messaging",
                "- Use appropriate communication channels for different stakeholder groups, ensuring secure transmission of sensitive incident information",
                "- Track stakeholder feedback and questions to ensure concerns are addressed in subsequent updates",
              ].join("\n"),
            },
            {
              number: "RS.CO-03",
              title: "Information is shared with designated internal and external stakeholders",
              objective:
                "The organization shares relevant incident information with designated internal and external stakeholders, including threat intelligence communities and sector partners, to support collective defense and improve the broader cybersecurity ecosystem.",
              guidance: [
                "- Establish policies and procedures for sharing incident information with external parties, including what information may be shared and with whom",
                "- Share indicators of compromise, attack techniques, and lessons learned with trusted threat intelligence sharing communities and sector partners",
                "- Coordinate information sharing with legal counsel to ensure compliance with confidentiality obligations and data protection requirements",
                "- Participate in government and industry information sharing programs to contribute to collective cybersecurity defense",
                "- Maintain records of information shared externally for accountability and audit purposes",
              ].join("\n"),
            },
          ],
        },

        // ── RS.MI: Incident Mitigation ─────────────────────────────────
        {
          number: "RS.MI",
          title: "Incident Mitigation",
          description:
            "Activities are performed to prevent expansion of an event and mitigate its effects.",
          category: "Respond",
          controls: [
            {
              number: "RS.MI-01",
              title: "Incidents are contained",
              objective:
                "The organization takes immediate action to contain cybersecurity incidents, preventing the spread of the threat to additional systems, data, and network segments while preserving evidence for investigation.",
              guidance: [
                "- Develop and maintain containment procedures for common incident types, including network isolation, account disabling, and system quarantine techniques",
                "- Execute containment actions rapidly to limit the spread of the incident while minimizing disruption to unaffected business operations",
                "- Implement both short-term containment (immediate threat isolation) and long-term containment (sustained controls while remediation is prepared) strategies",
                "- Preserve forensic evidence during containment activities by following established evidence handling procedures",
                "- Verify the effectiveness of containment measures by monitoring for continued adversary activity and adjusting containment strategies as needed",
              ].join("\n"),
            },
            {
              number: "RS.MI-02",
              title: "Incidents are eradicated",
              objective:
                "The organization performs eradication activities to completely remove the threat from the environment, including eliminating malware, closing vulnerabilities, and removing unauthorized access, before restoring affected systems.",
              guidance: [
                "- Identify all artifacts of the compromise including malware, backdoors, unauthorized accounts, and persistence mechanisms across the environment",
                "- Remove all identified malicious artifacts and close the vulnerabilities and access paths that enabled the initial compromise and lateral movement",
                "- Verify eradication completeness through scanning, integrity checking, and monitoring for residual adversary activity",
                "- Harden systems and apply compensating controls to prevent re-compromise through the same or related attack vectors",
                "- Document all eradication actions taken and confirm successful removal before authorizing system restoration",
              ].join("\n"),
            },
          ],
        },
      ],
    },

    // ======================================================================
    // RC - RECOVER
    // ======================================================================
    {
      number: "RC",
      title: "Recover",
      description:
        "Assets and operations affected by a cybersecurity incident are restored. RECOVER supports timely restoration of normal operations to reduce the effects of cybersecurity incidents and enable appropriate communication during recovery efforts.",
      category: "Recover",
      categories: [
        // ── RC.RP: Incident Recovery Plan Execution ────────────────────
        {
          number: "RC.RP",
          title: "Incident Recovery Plan Execution",
          description:
            "Restoration activities are performed to ensure operational availability of systems and services affected by cybersecurity incidents.",
          category: "Recover",
          controls: [
            {
              number: "RC.RP-01",
              title: "The recovery portion of the incident response plan is executed once initiated from the incident response process",
              objective:
                "The organization executes the recovery portion of the incident response plan to restore affected systems, services, and operations to normal functioning once the response process authorizes the transition to recovery.",
              guidance: [
                "- Activate the recovery plan once incident response leadership confirms that containment and eradication are complete and recovery criteria are met",
                "- Assign recovery tasks to designated personnel with clear priorities, timelines, and dependencies based on business criticality",
                "- Execute recovery procedures in a controlled and coordinated manner, restoring systems in priority order aligned with business impact analysis",
                "- Coordinate recovery activities across IT operations, business units, and third-party service providers to ensure alignment",
                "- Document all recovery actions, decisions, and outcomes for post-incident review and plan improvement",
              ].join("\n"),
            },
            {
              number: "RC.RP-02",
              title: "Recovery actions are selected, scoped, and prioritized considering the trade-offs between the possible collection of forensic data and the speed of recovery",
              objective:
                "The organization selects and prioritizes recovery actions while balancing the need for forensic evidence preservation with the urgency of restoring business operations, making informed trade-off decisions.",
              guidance: [
                "- Assess forensic evidence collection requirements before initiating recovery actions and preserve critical evidence where possible",
                "- Develop decision criteria for balancing evidence preservation with operational recovery based on incident severity, legal requirements, and business impact",
                "- Prioritize recovery actions based on business criticality, interdependencies, and the sequence that minimizes overall operational disruption",
                "- Coordinate forensic and recovery teams to ensure evidence is collected or preserved before systems are rebuilt or restored",
                "- Document trade-off decisions made during recovery, including the rationale and any evidence that may be lost as a result",
              ].join("\n"),
            },
            {
              number: "RC.RP-03",
              title: "The integrity of backups and other restoration assets is verified before using them for restoration",
              objective:
                "The organization verifies the integrity and safety of backups, images, and other restoration assets before using them to restore affected systems, ensuring that compromised or corrupted data is not reintroduced into the environment.",
              guidance: [
                "- Verify the integrity of backup data through checksum validation, integrity scanning, and comparison with known-good baselines before restoration",
                "- Scan backup data and restoration images for malware and indicators of compromise to prevent reintroduction of threats",
                "- Validate that backups were created before the estimated compromise date or that they are confirmed to be free of malicious artifacts",
                "- Test restoration procedures in an isolated environment before deploying restored systems to production",
                "- Maintain multiple backup copies with different retention periods to ensure availability of clean restoration points",
              ].join("\n"),
            },
            {
              number: "RC.RP-04",
              title: "Critical functions and cybersecurity risk management are considered to establish post-incident operational norms",
              objective:
                "The organization considers the restoration of critical business functions and updated cybersecurity risk management requirements when establishing post-incident operational norms, ensuring that resumed operations incorporate lessons learned.",
              guidance: [
                "- Prioritize the restoration of critical business functions based on the organization's business continuity and disaster recovery plans",
                "- Incorporate lessons learned from the incident into updated security configurations, monitoring rules, and access controls before resuming normal operations",
                "- Conduct a risk reassessment following significant incidents to identify new or changed risks that should be addressed in post-incident operations",
                "- Establish enhanced monitoring and verification procedures for recently restored systems during a defined observation period",
                "- Update cybersecurity risk management processes, policies, and controls based on incident findings before fully returning to normal operational status",
              ].join("\n"),
            },
          ],
        },

        // ── RC.CO: Incident Recovery Communication ─────────────────────
        {
          number: "RC.CO",
          title: "Incident Recovery Communication",
          description:
            "Restoration activities and progress in restoring operational capabilities are communicated to designated internal and external stakeholders.",
          category: "Recover",
          controls: [
            {
              number: "RC.CO-01",
              title: "Recovery activities and progress are communicated to designated internal and external stakeholders",
              objective:
                "The organization communicates recovery activities, progress, and expected timelines to designated internal and external stakeholders to manage expectations, coordinate support, and maintain trust.",
              guidance: [
                "- Establish a communication plan for recovery activities that identifies stakeholders, communication channels, update frequency, and responsible communicators",
                "- Provide regular recovery status updates to internal stakeholders including leadership, affected business units, and IT operations teams",
                "- Communicate recovery progress to external stakeholders including customers, partners, regulators, and the public as appropriate and required",
                "- Include key information in recovery communications such as current status, systems restored, expected timelines, and any ongoing limitations",
                "- Coordinate recovery communications with incident response communications to ensure consistency and avoid conflicting messages",
              ].join("\n"),
            },
            {
              number: "RC.CO-02",
              title: "Public communications about incident recovery are managed",
              objective:
                "The organization manages public communications regarding incident recovery to provide accurate, timely, and consistent information while protecting sensitive details about the incident and the organization's security posture.",
              guidance: [
                "- Designate authorized spokespersons and establish approval processes for all public communications related to incident recovery",
                "- Prepare public communication templates in advance that can be rapidly customized for specific incidents",
                "- Coordinate public communications with legal counsel, public relations, and executive leadership to ensure accuracy, consistency, and compliance",
                "- Monitor public discourse and media coverage related to the incident and adjust communications strategy as needed to address misinformation",
                "- Conduct post-incident review of public communications to identify areas for improvement in future incident communication plans",
              ].join("\n"),
            },
          ],
        },
      ],
    },
  ]

  let sortOrder = 0

  for (const func of functions) {
    const funcClause = await prisma.clause.create({
      data: {
        frameworkId: fwId,
        number: func.number,
        title: func.title,
        description: func.description,
        isAnnex: false,
        sortOrder: sortOrder++,
      },
    })

    for (const cat of func.categories) {
      const catClause = await prisma.clause.create({
        data: {
          frameworkId: fwId,
          parentId: funcClause.id,
          number: cat.number,
          title: cat.title,
          description: cat.description,
          isAnnex: false,
          sortOrder: sortOrder++,
        },
      })

      for (const ctrl of cat.controls) {
        await prisma.control.create({
          data: {
            clauseId: catClause.id,
            number: ctrl.number,
            title: ctrl.title,
            category: func.category,
            objective: ctrl.objective,
            guidance: ctrl.guidance,
          },
        })
      }
    }
  }

  const clauseCount = await prisma.clause.count({ where: { frameworkId: fwId } })
  const controlCount = await prisma.control.count({ where: { clause: { frameworkId: fwId } } })

  console.log(`[seed] NIST CSF 2.0 seeded -- ${clauseCount} clauses, ${controlCount} controls`)
}
