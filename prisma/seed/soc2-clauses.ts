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
    guidance: string
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
          guidance:
            "- Develop and publish a code of conduct and ethics policy that applies to all personnel including contractors\n- Require annual acknowledgment of the code of conduct from every employee and board member\n- Establish a confidential reporting channel (e.g., ethics hotline) for reporting violations without retaliation\n- Conduct periodic assessments of adherence to ethical standards through surveys and management reviews\n- Document and track remediation of identified deviations with defined timelines and responsible owners",
        },
        {
          number: "CC1.2",
          title: "COSO Principle 2: Exercises oversight responsibility",
          objective:
            "The board of directors demonstrates independence from management and exercises oversight of the development and performance of internal control.",
          guidance:
            "- Establish a board of directors or advisory body with documented independence criteria for its members\n- Schedule and conduct regular board meetings (at least quarterly) with documented agendas and minutes\n- Create an audit committee or equivalent oversight function with a formal charter\n- Require the board to review and approve internal control policies, risk assessments, and audit findings annually\n- Maintain evidence of board oversight activities including meeting minutes, resolutions, and action items",
        },
        {
          number: "CC1.3",
          title: "COSO Principle 3: Establishes structure, authority, and responsibility",
          objective:
            "Management establishes, with board oversight, structures, reporting lines, and appropriate authorities and responsibilities in the pursuit of objectives.",
          guidance:
            "- Create and maintain an up-to-date organizational chart showing reporting lines and functional areas\n- Define and document roles and responsibilities for key positions including security, compliance, and IT functions\n- Establish a RACI matrix for critical business processes and internal control activities\n- Communicate authority limits and delegation policies to all relevant personnel\n- Review and update organizational structure at least annually or when significant changes occur",
        },
        {
          number: "CC1.4",
          title: "COSO Principle 4: Demonstrates commitment to competence",
          objective:
            "The entity demonstrates a commitment to attract, develop, and retain competent individuals in alignment with objectives.",
          guidance:
            "- Define minimum competency requirements and job descriptions for all positions that affect internal control\n- Implement a structured hiring process that includes background checks, reference verification, and skills assessment\n- Establish an annual training and professional development programme for employees in security and compliance roles\n- Conduct annual performance evaluations that assess competence relative to role requirements\n- Maintain records of certifications, training completions, and continuing education for relevant staff",
        },
        {
          number: "CC1.5",
          title: "COSO Principle 5: Enforces accountability",
          objective:
            "The entity holds individuals accountable for their internal control responsibilities in the pursuit of objectives.",
          guidance:
            "- Include internal control responsibilities in job descriptions and performance objectives for all relevant roles\n- Establish and communicate a disciplinary policy for violations of security policies and control procedures\n- Tie performance evaluations and compensation reviews to the fulfilment of control responsibilities\n- Require management sign-off on control attestations and compliance certifications at defined intervals\n- Track and report metrics on control ownership, completion of assigned tasks, and remediation timelines",
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
          guidance:
            "- Identify and document the information requirements for each internal control activity and process\n- Implement data quality checks and validation rules at input, processing, and output stages of critical systems\n- Establish a centralised logging and monitoring infrastructure that aggregates security-relevant data from all systems\n- Define data retention and archival policies that ensure information is available for control evaluation periods\n- Conduct periodic reviews of information sources to verify they remain relevant, accurate, and timely",
        },
        {
          number: "CC2.2",
          title: "COSO Principle 14: Communicates internally",
          objective:
            "The entity internally communicates information, including objectives and responsibilities for internal control, necessary to support the functioning of internal control.",
          guidance:
            "- Publish and maintain an internal security policy portal accessible to all employees\n- Conduct regular all-hands or department-level meetings to communicate control objectives, policy changes, and security updates\n- Distribute a periodic internal newsletter or bulletin covering compliance status, upcoming audits, and lessons learned\n- Implement an onboarding programme that includes training on internal control responsibilities and reporting channels\n- Maintain a communication matrix that maps control-related information to its intended internal audience and delivery method",
        },
        {
          number: "CC2.3",
          title: "COSO Principle 15: Communicates externally",
          objective:
            "The entity communicates with external parties regarding matters affecting the functioning of internal control.",
          guidance:
            "- Publish an externally accessible security and privacy page describing the entity's control commitments and certifications\n- Define and document communication procedures for notifying customers and regulators of security incidents\n- Establish standard contractual clauses and SLAs that communicate the entity's control responsibilities to customers and vendors\n- Provide SOC 2 reports or bridge letters to external stakeholders upon request through a defined distribution process\n- Maintain a log of external communications related to control matters including regulatory correspondence and customer inquiries",
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
          guidance:
            "- Document security, availability, processing integrity, confidentiality, and privacy objectives aligned with business goals\n- Define measurable criteria and thresholds for each Trust Services Criteria objective (e.g., uptime targets, data classification levels)\n- Communicate approved objectives to all control owners and relevant stakeholders\n- Review and update objectives at least annually or when there are significant changes to the business or technology environment\n- Map each objective to the specific Trust Services Criteria points of focus it supports",
        },
        {
          number: "CC3.2",
          title: "COSO Principle 7: Identifies and analyses risk",
          objective:
            "The entity identifies risks to the achievement of its objectives across the entity and analyses risks as a basis for determining how the risks should be managed.",
          guidance:
            "- Conduct a formal enterprise-wide risk assessment at least annually using a structured methodology (e.g., likelihood and impact scoring)\n- Maintain a risk register that catalogues identified risks, risk owners, inherent ratings, mitigating controls, and residual ratings\n- Incorporate input from cross-functional stakeholders including IT, legal, HR, and business operations during risk identification\n- Perform threat modelling for critical applications and infrastructure to identify technology-specific risks\n- Present risk assessment results and treatment plans to senior management and the board for review and approval",
        },
        {
          number: "CC3.3",
          title: "COSO Principle 8: Assesses fraud risk",
          objective:
            "The entity considers the potential for fraud in assessing risks to the achievement of objectives.",
          guidance:
            "- Include fraud risk scenarios (e.g., unauthorized transactions, data manipulation, management override) in the annual risk assessment\n- Implement segregation of duties controls for financial transactions, user provisioning, and change management\n- Deploy monitoring controls to detect anomalous behaviour patterns such as unusual access times, privilege escalation, or data exfiltration\n- Conduct periodic fraud awareness training for employees that covers common schemes and reporting obligations\n- Evaluate incentive and pressure factors that could motivate fraudulent activity and design controls to mitigate them",
        },
        {
          number: "CC3.4",
          title: "COSO Principle 9: Identifies and analyses significant change",
          objective:
            "The entity identifies and assesses changes that could significantly impact the system of internal control.",
          guidance:
            "- Establish a formal change management process that requires risk assessment for significant changes to systems, personnel, or operations\n- Define criteria for what constitutes a significant change (e.g., new product launch, major vendor change, infrastructure migration)\n- Require security and compliance review as a gate in the approval workflow for significant changes\n- Monitor external factors such as regulatory changes, emerging threats, and industry developments that could impact controls\n- Document the risk analysis and control impact assessment for each significant change and retain it for audit evidence",
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
          guidance:
            "- Implement continuous monitoring tools (e.g., SIEM, configuration management, automated compliance scanners) for ongoing evaluation of controls\n- Establish a schedule of separate evaluations such as internal audits, penetration tests, and vulnerability assessments at defined intervals\n- Define key control indicators (KCIs) and metrics to measure control effectiveness on an ongoing basis\n- Assign responsibility for monitoring activities to specific roles and document their evaluation procedures\n- Retain evidence of all evaluations including tool outputs, audit reports, and management review sign-offs",
        },
        {
          number: "CC4.2",
          title: "COSO Principle 17: Evaluates and communicates deficiencies",
          objective:
            "The entity evaluates and communicates internal control deficiencies in a timely manner to those parties responsible for taking corrective action, including senior management and the board of directors.",
          guidance:
            "- Define a severity classification scheme for control deficiencies (e.g., critical, high, medium, low) with associated response timelines\n- Implement a formal process for documenting, tracking, and remediating identified deficiencies in a centralised issue tracker\n- Establish escalation procedures that require timely reporting of significant deficiencies to senior management and the board\n- Conduct root cause analysis for recurring or critical deficiencies and implement preventive measures\n- Report on deficiency trends, remediation status, and overdue items in periodic management and board meetings",
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
          guidance:
            "- Map each identified risk to one or more control activities and document the linkage in a risk-control matrix\n- Select a mix of preventive and detective controls appropriate to the nature and severity of each risk\n- Design controls with clearly defined inputs, activities, outputs, and responsible parties\n- Evaluate the cost-benefit of each control activity relative to the risk it mitigates\n- Document control design specifications and obtain management approval before implementation",
        },
        {
          number: "CC5.2",
          title: "COSO Principle 11: Selects and develops general controls over technology",
          objective:
            "The entity selects and develops general control activities over technology to support the achievement of objectives.",
          guidance:
            "- Implement IT general controls (ITGCs) covering access management, change management, operations, and data backup\n- Deploy infrastructure-as-code and configuration management tools to enforce consistent and auditable system configurations\n- Establish automated deployment pipelines with built-in security scanning, code review, and approval gates\n- Define and enforce baseline security configurations (hardening standards) for servers, databases, and network devices\n- Monitor ITGC effectiveness through automated compliance checks and periodic manual reviews",
        },
        {
          number: "CC5.3",
          title: "COSO Principle 12: Deploys through policies and procedures",
          objective:
            "The entity deploys control activities through policies that establish what is expected and procedures that put policies into action.",
          guidance:
            "- Maintain a documented policy library covering information security, acceptable use, data classification, incident response, and change management\n- Develop detailed standard operating procedures (SOPs) for each control activity that specify step-by-step actions\n- Require policy acknowledgment from all employees during onboarding and at each annual policy refresh\n- Assign policy and procedure owners responsible for keeping documents current and aligned with operational reality\n- Conduct periodic policy compliance reviews to verify that procedures are being followed as documented",
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
          guidance:
            "- Deploy an identity provider (IdP) with single sign-on (SSO) and multi-factor authentication (MFA) for all production systems\n- Implement network segmentation using firewalls, VPNs, and virtual private clouds to isolate sensitive environments\n- Enforce encryption at rest and in transit for all data stores and communication channels handling protected information\n- Maintain a centralised inventory of all logical access control mechanisms and their configurations\n- Review and update access control architectures at least annually and after significant infrastructure changes",
        },
        {
          number: "CC6.2",
          title: "New internal and external user registration and authorisation",
          objective:
            "Prior to issuing system credentials and granting system access, the entity registers and authorises new internal and external users. User system credentials are removed when user access is no longer authorised.",
          guidance:
            "- Implement a formal access request and approval workflow that requires manager and system owner authorisation before provisioning\n- Automate user provisioning and deprovisioning through integration between HR systems, IdP, and application directories\n- Enforce a defined SLA for deactivating accounts upon termination (e.g., same business day for involuntary, last day for voluntary)\n- Maintain an auditable log of all provisioning and deprovisioning actions with timestamps and approver details\n- Conduct quarterly access reviews to identify and remove stale, orphaned, or unauthorized accounts",
        },
        {
          number: "CC6.3",
          title: "Role-based access and least privilege",
          objective:
            "The entity authorises, modifies, or removes access to data, software, functions, and other protected information assets based on roles, responsibilities, or the system design and changes, giving consideration to the concepts of least privilege and segregation of duties.",
          guidance:
            "- Define role-based access control (RBAC) profiles for all applications and infrastructure components based on job function\n- Enforce the principle of least privilege by granting only the minimum permissions required for each role\n- Implement segregation of duties controls that prevent any single individual from performing conflicting actions (e.g., code deployment and production access)\n- Require documented approval for any privilege elevation or access modification outside of standard role assignments\n- Perform semi-annual reviews of role definitions and access assignments to ensure they remain appropriate",
        },
        {
          number: "CC6.4",
          title: "Physical access restrictions",
          objective:
            "The entity restricts physical access to facilities and protected information assets to authorised personnel to meet the entity's objectives.",
          guidance:
            "- Implement physical access controls such as badge readers, biometric scanners, or key locks at all entry points to facilities housing protected assets\n- Maintain an up-to-date access list of personnel authorised to enter restricted areas including data centres and server rooms\n- Monitor physical access through security cameras and access logs with retention periods meeting audit requirements\n- Escort and log all visitor access to restricted areas and require visitors to sign a non-disclosure agreement\n- Review physical access authorisations quarterly and revoke access for personnel who no longer require it",
        },
        {
          number: "CC6.5",
          title: "Disposal of protected information assets",
          objective:
            "The entity discontinues logical and physical protections over physical assets only after the ability to read or recover data and software from those assets has been diminished.",
          guidance:
            "- Establish a formal asset disposal policy that defines approved data sanitisation methods (e.g., NIST SP 800-88 guidelines)\n- Maintain a chain-of-custody log for assets pending disposal from decommission through final destruction\n- Use certified data destruction services and retain certificates of destruction for all media containing sensitive data\n- Verify that all data has been irreversibly removed from storage media before release, resale, or recycling\n- Conduct periodic audits of the disposal process to ensure compliance with the policy",
        },
        {
          number: "CC6.6",
          title: "Logical access security measures against external threats",
          objective:
            "The entity implements logical access security measures to protect against threats from sources outside its system boundaries.",
          guidance:
            "- Deploy and maintain next-generation firewalls, web application firewalls (WAF), and intrusion detection/prevention systems (IDS/IPS) at network perimeters\n- Implement DDoS protection services for all internet-facing applications and APIs\n- Enforce strict inbound and outbound network rules that deny all traffic by default and allow only explicitly approved flows\n- Conduct regular external vulnerability scans and annual penetration tests by qualified independent assessors\n- Monitor and respond to threat intelligence feeds to proactively block known malicious IP addresses and domains",
        },
        {
          number: "CC6.7",
          title: "Transmission, movement, and removal restrictions",
          objective:
            "The entity restricts the transmission, movement, and removal of information to authorised internal and external users and processes, and protects it during transmission, movement, or removal.",
          guidance:
            "- Enforce TLS 1.2 or higher for all data transmissions and require certificate validation on all endpoints\n- Implement data loss prevention (DLP) tools to detect and block unauthorized transmission of sensitive data via email, cloud storage, or removable media\n- Require encryption for all portable storage devices and laptops that may contain protected information\n- Establish and enforce policies governing the transfer of data to third parties, including secure file transfer protocols and encryption requirements\n- Log and monitor all data transfer activities and flag anomalous patterns for investigation",
        },
        {
          number: "CC6.8",
          title: "Controls to prevent or detect against malicious software",
          objective:
            "The entity implements controls to prevent or detect and act upon the introduction of unauthorised or malicious software to meet the entity's objectives.",
          guidance:
            "- Deploy endpoint detection and response (EDR) software on all endpoints including servers, workstations, and mobile devices\n- Implement application whitelisting or software restriction policies to prevent execution of unauthorized applications on production systems\n- Configure automated malware signature updates and behavioral analysis engines with real-time scanning enabled\n- Establish email security controls including anti-phishing, anti-spam, and sandboxing of suspicious attachments\n- Monitor and alert on malware detection events and ensure a defined response procedure is followed for each detection",
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
          guidance:
            "- Implement configuration monitoring tools that detect and alert on unauthorized changes to system configurations in real time\n- Subscribe to vulnerability disclosure feeds (e.g., NVD, vendor advisories) and correlate them against the asset inventory\n- Conduct regular vulnerability scans of all systems (at least monthly for internal, quarterly for external) and track findings to closure\n- Establish baseline configurations for all system components and detect drift through automated comparison\n- Define SLAs for vulnerability remediation based on severity (e.g., critical within 72 hours, high within 30 days)",
        },
        {
          number: "CC7.2",
          title: "Monitoring system components for anomalies",
          objective:
            "The entity monitors system components and the operation of those components for anomalies that are indicative of malicious acts, natural disasters, and errors affecting the entity's ability to meet its objectives.",
          guidance:
            "- Deploy a SIEM platform that aggregates and correlates logs from all critical system components including servers, databases, network devices, and applications\n- Define and tune alert rules and thresholds for anomalous activity such as brute-force attempts, unusual data access patterns, and resource consumption spikes\n- Implement uptime and performance monitoring with automated alerting for service degradation or outages\n- Establish a 24/7 monitoring capability (in-house SOC or managed security service provider) to ensure timely detection\n- Review and refine monitoring rules at least quarterly based on incident trends and threat intelligence",
        },
        {
          number: "CC7.3",
          title: "Evaluation of security events",
          objective:
            "The entity evaluates security events to determine whether they could or have resulted in a failure of the entity to meet its objectives (security incidents) and, if so, takes actions to prevent or address such failures.",
          guidance:
            "- Define a security event triage process with documented criteria for classifying events as potential incidents\n- Assign trained analysts to investigate and escalate security events within defined response times based on severity\n- Maintain a security event log with disposition records showing analysis performed and conclusions reached\n- Integrate threat intelligence into the event evaluation process to provide context on attacker tactics and indicators of compromise\n- Conduct periodic tabletop exercises to validate that the event evaluation process correctly identifies and escalates true incidents",
        },
        {
          number: "CC7.4",
          title: "Incident response",
          objective:
            "The entity responds to identified security incidents by executing a defined incident response programme to understand, contain, remediate, and communicate security incidents, as appropriate.",
          guidance:
            "- Develop and maintain a formal incident response plan that defines roles, communication protocols, escalation paths, and response procedures\n- Establish an incident response team with clearly assigned responsibilities and contact information maintained in an out-of-band communication channel\n- Define incident severity levels and corresponding response actions including containment, eradication, and recovery steps\n- Conduct post-incident reviews for all significant incidents and document lessons learned, root cause analysis, and corrective actions\n- Test the incident response plan at least annually through simulations or tabletop exercises and update it based on findings",
        },
        {
          number: "CC7.5",
          title: "Incident recovery",
          objective:
            "The entity identifies, develops, and implements activities to recover from identified security incidents.",
          guidance:
            "- Define recovery procedures for each category of security incident including data restoration, system rebuild, and service failover\n- Maintain tested and validated backup and restore capabilities with documented recovery time objectives (RTO) and recovery point objectives (RPO)\n- Establish communication templates and procedures for notifying affected parties during and after recovery\n- Verify system integrity and confirm that vulnerabilities exploited during the incident have been remediated before returning systems to production\n- Update the incident response and recovery plans based on lessons learned from each recovery effort",
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
          guidance:
            "- Implement a formal change management policy that requires documented change requests, impact assessments, and approvals before any production change\n- Enforce separation of duties between change requestors, developers, testers, and approvers throughout the change lifecycle\n- Require testing in a non-production environment that mirrors production, including functional, regression, and security testing\n- Maintain an auditable change log that records the change description, requestor, approver, testing results, and deployment timestamp\n- Conduct post-implementation reviews for significant changes to confirm they achieved their intended outcome without adverse effects\n- Establish emergency change procedures that still require retrospective approval and documentation within a defined timeframe",
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
          guidance:
            "- Develop and maintain a business continuity plan (BCP) that addresses critical business processes and recovery priorities\n- Conduct a business impact analysis (BIA) to identify critical functions, dependencies, and acceptable downtime thresholds\n- Implement redundancy and failover mechanisms for critical infrastructure components and services\n- Test the BCP at least annually through tabletop exercises or full simulations and document results and improvements\n- Maintain insurance coverage appropriate to the entity's risk profile and review coverage annually",
        },
        {
          number: "CC9.2",
          title: "Vendor and business partner risk management",
          objective:
            "The entity assesses and manages risks associated with vendors and business partners.",
          guidance:
            "- Establish a vendor management programme that includes due diligence assessments prior to onboarding new vendors\n- Require vendors handling sensitive data to provide evidence of their security posture (e.g., SOC 2 report, ISO 27001 certificate, completed security questionnaire)\n- Include security and data protection requirements in all vendor contracts including breach notification obligations and right-to-audit clauses\n- Conduct periodic risk reassessments of existing vendors based on criticality and changes to the services they provide\n- Maintain a centralised vendor inventory that tracks risk ratings, contract terms, compliance evidence, and review dates",
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
          guidance:
            "- Implement real-time monitoring of CPU, memory, storage, and network utilisation across all production system components\n- Define capacity thresholds and configure automated alerts when utilisation approaches predefined limits (e.g., 80%)\n- Conduct quarterly capacity planning reviews that include demand forecasting based on historical trends and projected growth\n- Implement auto-scaling capabilities for cloud-hosted workloads to handle demand spikes without manual intervention\n- Document capacity management procedures and maintain records of capacity planning decisions and actions taken",
        },
        {
          number: "A1.2",
          title: "Environmental protections, backup, and recovery infrastructure",
          objective:
            "The entity authorises, designs, develops or acquires, implements, operates, approves, maintains, and monitors environmental protections, software, data backup processes, and recovery infrastructure to meet its objectives.",
          guidance:
            "- Implement environmental controls in data centres including fire suppression, climate control, uninterruptible power supplies (UPS), and redundant power feeds\n- Configure automated backups for all critical systems and data with schedules aligned to defined RPO requirements\n- Store backups in geographically separate locations with encryption at rest and access controls\n- Verify backup integrity through regular automated restoration tests (at least monthly) and document test results\n- Maintain disaster recovery infrastructure that can be activated within defined RTO targets and test failover procedures at least annually",
        },
        {
          number: "A1.3",
          title: "Recovery plan testing",
          objective:
            "The entity tests recovery plan procedures supporting system recovery to meet its objectives.",
          guidance:
            "- Develop a recovery testing schedule that covers all critical systems and business processes at least annually\n- Execute full recovery tests including data restoration, system failover, and application validation in an isolated environment\n- Document test scenarios, procedures, expected outcomes, actual results, and any deviations or failures observed\n- Track and remediate issues discovered during recovery testing with defined owners and timelines\n- Update recovery plans based on test findings, infrastructure changes, and lessons learned from actual incidents",
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
          guidance:
            "- Implement input validation controls including data type checks, range validations, format enforcement, and mandatory field requirements\n- Define and enforce data entry standards and business rules at the application layer to reject malformed or incomplete inputs\n- Maintain audit trails of all data inputs including timestamps, source identifiers, and user or system that submitted the data\n- Implement duplicate detection mechanisms to prevent processing of redundant or erroneous submissions\n- Conduct periodic reviews of input error logs to identify patterns and implement preventive improvements",
        },
        {
          number: "PI1.2",
          title: "Accuracy and completeness of system processing",
          objective:
            "The entity implements policies and procedures over system processing to result in products, services, and reporting to meet the entity's objectives.",
          guidance:
            "- Implement processing controls such as checksums, record counts, hash totals, and reconciliation procedures at each processing stage\n- Define expected processing outcomes and configure automated checks that flag deviations for investigation\n- Implement transaction logging that records processing steps, intermediate results, and completion status for auditability\n- Establish error handling procedures that halt or quarantine processing when integrity checks fail and notify appropriate personnel\n- Perform periodic end-to-end reconciliations between source data, intermediate processing stages, and final outputs",
        },
        {
          number: "PI1.3",
          title: "Accuracy and completeness of outputs",
          objective:
            "The entity implements policies and procedures over system outputs to result in products, services, and reporting to meet the entity's objectives.",
          guidance:
            "- Implement output validation controls that verify completeness and accuracy before data is delivered to consumers\n- Define output specifications including expected formats, record counts, and checksums for each critical data flow\n- Restrict access to output data and reports to authorised recipients only through access controls and distribution lists\n- Maintain output distribution logs that record what was sent, to whom, and when, for each delivery cycle\n- Conduct periodic spot-check reviews of system outputs against source data to verify end-to-end processing integrity",
        },
        {
          number: "PI1.4",
          title: "Tracing information inputs through the system to outputs",
          objective:
            "The entity implements policies and procedures to make available or deliver output completely, accurately, and timely in accordance with specifications to meet the entity's objectives.",
          guidance:
            "- Implement end-to-end traceability by assigning unique transaction identifiers that persist from input through processing to output\n- Maintain audit logs at each processing stage that can be correlated using the transaction identifier\n- Define and monitor SLAs for processing timeliness and configure alerts when processing exceeds defined thresholds\n- Implement dashboards or reports that show processing pipeline status, throughput, and latency in near-real time\n- Conduct periodic traceability audits by selecting sample transactions and verifying their path through the system",
        },
        {
          number: "PI1.5",
          title: "Processing integrity error handling",
          objective:
            "The entity implements policies and procedures to store inputs, items in processing, and outputs completely, accurately, and timely in accordance with system specifications to meet the entity's objectives.",
          guidance:
            "- Define error handling policies that specify how processing errors are detected, logged, escalated, and resolved\n- Implement automated retry logic with exponential backoff for transient processing failures\n- Maintain an error queue or dead-letter queue for transactions that cannot be processed automatically, with alerts to operations staff\n- Track error resolution through a ticketing system with defined SLAs for investigation and remediation\n- Analyse error trends periodically to identify systemic issues and implement root-cause fixes to reduce recurrence",
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
          guidance:
            "- Establish a data classification policy that defines confidentiality levels (e.g., public, internal, confidential, restricted) with handling requirements for each\n- Conduct a data inventory and mapping exercise to identify all repositories, systems, and flows that contain confidential information\n- Apply classification labels to data assets and enforce access controls commensurate with the assigned classification level\n- Implement DLP controls to monitor and prevent unauthorized access, copying, or transmission of confidential data\n- Review data classifications at least annually and update them when business requirements or regulatory obligations change",
        },
        {
          number: "C1.2",
          title: "Disposal of confidential information",
          objective:
            "The entity disposes of confidential information to meet the entity's objectives related to confidentiality.",
          guidance:
            "- Define retention periods for each category of confidential information aligned with legal, regulatory, and contractual requirements\n- Implement automated data lifecycle management tools that flag or delete data that has exceeded its retention period\n- Use secure deletion methods (e.g., cryptographic erasure, multi-pass overwriting) for electronic media containing confidential information\n- Require cross-cut shredding or certified destruction for physical documents containing confidential information\n- Maintain disposal logs and certificates of destruction as evidence of proper disposal for audit purposes",
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
          guidance:
            "- Publish a clear and accessible privacy notice on the entity's website and within applications where personal information is collected\n- Ensure the privacy notice covers all required elements: types of data collected, purposes of processing, retention periods, data sharing practices, and data subject rights\n- Translate the privacy notice into all languages relevant to the user base\n- Review and update the privacy notice at least annually or whenever there is a material change to privacy practices\n- Maintain version history of privacy notices and communicate material changes to data subjects before they take effect",
        },
        {
          number: "P2.1",
          title: "Choice and consent",
          objective:
            "The entity communicates choices available regarding the collection, use, retention, disclosure, and disposal of personal information to data subjects and obtains implicit or explicit consent.",
          guidance:
            "- Implement consent collection mechanisms (e.g., checkboxes, preference centres) that clearly present choices before personal information is collected\n- Record and store consent receipts that capture what the data subject consented to, when, and how consent was provided\n- Provide an easily accessible mechanism for data subjects to withdraw consent at any time\n- Ensure consent is granular, allowing data subjects to consent to specific processing purposes independently\n- Review consent mechanisms regularly to ensure they remain compliant with applicable privacy regulations (e.g., GDPR, CCPA)",
        },
        {
          number: "P3.1",
          title: "Collection limited to identified purposes",
          objective:
            "Personal information is collected consistent with the entity's objectives related to privacy.",
          guidance:
            "- Document the specific business purpose for each category of personal information collected and map it to the privacy notice\n- Implement technical controls that prevent the collection of personal information fields not required for the stated purpose\n- Conduct privacy impact assessments (PIAs) for new features or processes that involve the collection of personal information\n- Audit data collection points periodically to verify that only data necessary for identified purposes is being collected\n- Train product and engineering teams on data minimisation principles and privacy-by-design practices",
        },
        {
          number: "P3.2",
          title: "Explicit consent for sensitive information",
          objective:
            "For information requiring explicit consent, the entity communicates the need for such consent, as well as the consequences of a failure to provide consent, and obtains the consent prior to collection.",
          guidance:
            "- Define categories of sensitive personal information (e.g., health data, biometric data, financial data) that require explicit consent under applicable regulations\n- Implement separate and prominent consent flows for sensitive information that clearly explain the purpose and consequences of not providing consent\n- Store explicit consent records with sufficient detail to demonstrate compliance, including the specific data categories and processing purposes consented to\n- Implement access controls and encryption specific to sensitive data categories that exceed the protections applied to standard personal information\n- Review sensitive data consent practices with legal counsel at least annually to ensure ongoing regulatory compliance",
        },
        {
          number: "P4.1",
          title: "Limiting use of personal information",
          objective:
            "The entity limits the use of personal information to the purposes identified in the entity's objectives related to privacy.",
          guidance:
            "- Implement technical and organisational controls that restrict the use of personal information to the purposes specified in the privacy notice\n- Enforce purpose limitation through access controls, data tagging, and application-level restrictions that prevent repurposing data without authorisation\n- Require a privacy review and updated consent collection before using personal information for any new purpose not previously communicated\n- Monitor data access and usage patterns to detect and investigate potential purpose deviation\n- Document all approved uses of personal information in a data processing register",
        },
        {
          number: "P4.2",
          title: "Retention and disposal of personal information",
          objective:
            "The entity retains personal information consistent with the entity's objectives related to privacy and securely disposes of such information when it is no longer needed.",
          guidance:
            "- Define and document retention periods for each category of personal information based on legal, regulatory, and business requirements\n- Implement automated retention enforcement tools that flag or delete personal information that has exceeded its defined retention period\n- Apply secure disposal methods (e.g., cryptographic erasure, certified destruction) to personal information no longer needed\n- Conduct periodic audits to verify that personal information is not retained beyond the defined retention periods\n- Maintain disposal records as evidence of compliance with retention and disposal policies",
        },
        {
          number: "P4.3",
          title: "Access to personal information",
          objective:
            "The entity provides data subjects with access to their personal information for review and update.",
          guidance:
            "- Implement a self-service portal or documented process through which data subjects can request access to their personal information\n- Define and enforce SLAs for responding to data subject access requests (e.g., within 30 days as required by GDPR)\n- Verify the identity of the data subject before fulfilling access requests to prevent unauthorised disclosure\n- Provide personal information in a commonly used, machine-readable format when requested\n- Allow data subjects to correct, update, or annotate their personal information through the access mechanism",
        },
        {
          number: "P5.1",
          title: "Third-party disclosures and transfers",
          objective:
            "The entity discloses or transfers personal information to third parties only for the purposes identified in the entity's objectives related to privacy and with the implicit or explicit consent of the data subject.",
          guidance:
            "- Maintain a register of all third parties that receive personal information, including the categories of data shared and the purpose of each disclosure\n- Execute data processing agreements (DPAs) with all third parties that receive personal information, specifying permitted uses and security requirements\n- Verify that third-party recipients have adequate privacy and security controls before initiating transfers\n- Implement technical controls to ensure data is encrypted during transfer and that only authorised data fields are shared\n- Review third-party data sharing arrangements at least annually and terminate agreements with parties that do not meet requirements",
        },
        {
          number: "P5.2",
          title: "Authorised disclosures and transfers",
          objective:
            "The entity creates and retains a complete, accurate, and timely record of authorised disclosures and transfers of personal information.",
          guidance:
            "- Implement logging mechanisms that automatically record all disclosures and transfers of personal information including recipient, date, data categories, and authorisation basis\n- Maintain a centralised disclosure register that is updated in real time or near-real time\n- Require documented authorisation (e.g., approved request, contractual basis, consent record) before any disclosure or transfer is executed\n- Conduct periodic audits of the disclosure register to verify completeness and accuracy against actual transfer logs\n- Retain disclosure records for the period required by applicable regulations and contractual obligations",
        },
        {
          number: "P6.1",
          title: "Quality of personal information",
          objective:
            "The entity collects and maintains accurate, up-to-date, complete, and relevant personal information to meet the entity's objectives related to privacy.",
          guidance:
            "- Implement data validation rules at the point of collection to ensure accuracy and completeness of personal information\n- Provide mechanisms for data subjects to review and update their personal information on an ongoing basis\n- Conduct periodic data quality audits to identify and correct inaccurate, incomplete, or outdated personal information\n- Implement automated data quality monitoring that flags anomalies such as invalid formats, missing fields, or duplicate records\n- Define data quality metrics and report on them to management to drive continuous improvement",
        },
        {
          number: "P6.2",
          title: "Dispute resolution for personal information quality",
          objective:
            "The entity provides a process for data subjects to dispute the completeness and accuracy of their personal information maintained by the entity and to have it corrected.",
          guidance:
            "- Publish a clear procedure for data subjects to dispute the accuracy or completeness of their personal information\n- Implement a tracking mechanism for dispute requests that captures submission date, nature of dispute, resolution, and outcome\n- Define and enforce SLAs for investigating and resolving data quality disputes (e.g., within 30 days)\n- Notify the data subject of the outcome of their dispute and any corrections made, or provide a written explanation if the dispute is denied\n- If corrections are made, propagate updates to all downstream systems and third parties that received the inaccurate data",
        },
        {
          number: "P7.1",
          title: "Monitoring and enforcement of privacy policies",
          objective:
            "The entity monitors compliance with its privacy policies and procedures and has a process to address privacy-related inquiries, complaints, and disputes.",
          guidance:
            "- Assign a privacy officer or equivalent role with responsibility for monitoring compliance with privacy policies and handling inquiries\n- Implement regular privacy compliance assessments including internal audits, policy reviews, and process walkthroughs\n- Establish a documented process for receiving, tracking, and resolving privacy-related inquiries and complaints\n- Maintain a log of all privacy complaints and disputes including resolution details and any corrective actions taken\n- Report privacy compliance metrics and complaint trends to senior management at least quarterly",
        },
        {
          number: "P8.1",
          title: "Privacy incident and breach management",
          objective:
            "The entity implements a process for receiving, addressing, resolving, and communicating the resolution of inquiries, complaints, and disputes from data subjects and for notifying affected parties of privacy breaches and incidents.",
          guidance:
            "- Develop and maintain a privacy incident response plan that defines roles, escalation paths, and notification procedures specific to privacy breaches\n- Establish criteria for determining when a privacy incident constitutes a reportable breach under applicable regulations (e.g., GDPR 72-hour notification)\n- Implement a process for promptly notifying affected data subjects, regulators, and other required parties when a reportable breach occurs\n- Conduct root cause analysis for all privacy incidents and implement corrective actions to prevent recurrence\n- Test the privacy incident response plan at least annually through tabletop exercises and update it based on lessons learned and regulatory changes",
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
          guidance: ctrl.guidance,
        },
      })
    }
  }

  const clauseCount = await prisma.clause.count({ where: { frameworkId: fwId } })
  const controlCount = await prisma.control.count({ where: { clause: { frameworkId: fwId } } })

  console.log(`[seed] SOC 2 Type II seeded -- ${clauseCount} clauses, ${controlCount} controls`)
}
