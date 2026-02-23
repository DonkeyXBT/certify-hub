import { PrismaClient } from "@prisma/client"

// ---------------------------------------------------------------------------
// HIPAA -- Health Insurance Portability and Accountability Act of 1996
// ---------------------------------------------------------------------------

export async function seedHIPAA(prisma: PrismaClient) {
  const framework = await prisma.framework.upsert({
    where: { code: "HIPAA" },
    update: {
      name: "HIPAA",
      version: "1996 (2013 Omnibus)",
      status: "PUBLISHED",
    },
    create: {
      code: "HIPAA",
      name: "HIPAA",
      version: "1996 (2013 Omnibus)",
      description:
        "Health Insurance Portability and Accountability Act — United States federal law that establishes national standards for the protection of individually identifiable health information (PHI), ensuring the confidentiality, integrity, and availability of electronic protected health information (ePHI).",
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

  const sections: ClauseDef[] = [
    // ── Administrative Safeguards (§164.308) ──────────────────────────
    {
      number: "§164.308",
      title: "Administrative Safeguards",
      description:
        "Administrative actions, policies, and procedures to manage the selection, development, implementation, and maintenance of security measures to protect electronic protected health information and to manage the conduct of the covered entity's or business associate's workforce.",
      category: "Administrative Safeguards",
      controls: [
        {
          number: "§164.308(a)(1)",
          title: "Security Management Process",
          objective:
            "Implement policies and procedures to prevent, detect, contain, and correct security violations involving electronic protected health information.",
          guidance:
            "- Conduct a comprehensive risk assessment to identify threats and vulnerabilities to ePHI\n- Implement security measures sufficient to reduce risks and vulnerabilities to a reasonable and appropriate level\n- Develop and apply a sanction policy against workforce members who fail to comply with security policies\n- Implement procedures to regularly review records of information system activity such as audit logs, access reports, and security incident tracking reports\n- Document the risk analysis including threats identified and measures implemented\n- Review and update the risk assessment periodically or when significant changes occur",
        },
        {
          number: "§164.308(a)(2)",
          title: "Assigned Security Responsibility",
          objective:
            "Identify the security official who is responsible for the development and implementation of the policies and procedures required by the Security Rule for the covered entity or business associate.",
          guidance:
            "- Designate a qualified individual as the HIPAA Security Officer responsible for overall security program management\n- Define and document the roles, responsibilities, and authority of the Security Officer\n- Ensure the Security Officer has adequate resources, training, and access to senior leadership\n- Communicate the Security Officer's identity and contact information to all workforce members\n- Review the designation periodically and update as necessary when personnel changes occur",
        },
        {
          number: "§164.308(a)(3)",
          title: "Workforce Security",
          objective:
            "Implement policies and procedures to ensure that all members of the workforce have appropriate access to electronic protected health information and to prevent those who do not have access from obtaining access.",
          guidance:
            "- Implement procedures for the authorization and supervision of workforce members who work with ePHI\n- Establish a workforce clearance procedure to determine that the access of a workforce member to ePHI is appropriate\n- Implement procedures for terminating access to ePHI when employment or engagement ends or access is no longer required\n- Maintain documentation of access authorizations and clearance decisions\n- Conduct periodic reviews of workforce access to ensure continued appropriateness",
        },
        {
          number: "§164.308(a)(4)",
          title: "Information Access Management",
          objective:
            "Implement policies and procedures for authorizing access to electronic protected health information that are consistent with the applicable requirements of the Privacy Rule.",
          guidance:
            "- Establish policies and procedures for granting access to ePHI, such as through access to a workstation, transaction, program, or process\n- Implement policies and procedures that are based upon the entity's access authorization policies and that restrict access to only those persons or software programs that have been granted access rights\n- Implement policies and procedures for establishing, documenting, reviewing, and modifying a user's right of access to a workstation, transaction, program, or process\n- Ensure access authorizations align with the minimum necessary standard under the Privacy Rule",
        },
        {
          number: "§164.308(a)(5)",
          title: "Security Awareness and Training",
          objective:
            "Implement a security awareness and training program for all members of the workforce, including management.",
          guidance:
            "- Provide periodic security reminders and updates to all workforce members about current threats and best practices\n- Implement procedures for guarding against, detecting, and reporting malicious software\n- Establish procedures for monitoring login attempts and reporting discrepancies\n- Develop and implement procedures for creating, changing, and safeguarding passwords\n- Conduct initial security training for new workforce members and provide ongoing refresher training\n- Document all training activities, attendance, and content delivered",
        },
        {
          number: "§164.308(a)(6)",
          title: "Security Incident Procedures",
          objective:
            "Implement policies and procedures to address security incidents involving electronic protected health information.",
          guidance:
            "- Develop an incident response plan that defines what constitutes a security incident and establishes escalation procedures\n- Implement procedures to identify, respond to, mitigate harmful effects of, and document security incidents\n- Establish a process for reporting security incidents to the designated Security Officer\n- Conduct post-incident analysis to determine root cause and implement corrective actions\n- Maintain records of all security incidents, responses, and outcomes",
        },
        {
          number: "§164.308(a)(7)",
          title: "Contingency Plan",
          objective:
            "Establish and implement as needed policies and procedures for responding to an emergency or other occurrence that damages systems that contain electronic protected health information.",
          guidance:
            "- Develop and implement a data backup plan that creates and maintains retrievable exact copies of ePHI\n- Establish and implement a disaster recovery plan with procedures to restore any loss of data\n- Create an emergency mode operations plan with procedures for the continuation of critical business processes during and after an emergency\n- Implement procedures for periodic testing and revision of contingency plans to ensure effectiveness\n- Perform an analysis to determine the criticality of applications and data in support of contingency plan components\n- Ensure contingency plans address natural disasters, system failures, and cyber attacks",
        },
        {
          number: "§164.308(a)(8)",
          title: "Evaluation",
          objective:
            "Perform a periodic technical and nontechnical evaluation, based initially upon the standards implemented under the Security Rule, and subsequently in response to environmental or operational changes affecting the security of electronic protected health information.",
          guidance:
            "- Conduct periodic technical and nontechnical evaluations of security policies and procedures\n- Assess whether security measures are effective in achieving compliance with the Security Rule\n- Evaluate the impact of environmental or operational changes on the security of ePHI\n- Document evaluation findings, including identified gaps and recommended corrective actions\n- Implement corrective actions based on evaluation results and track remediation progress",
        },
        {
          number: "§164.308(b)(1)",
          title: "Business Associate Contracts",
          objective:
            "Ensure that any agent, including a subcontractor, to whom the covered entity provides electronic protected health information agrees to implement appropriate safeguards to protect the information through a written contract or other arrangement.",
          guidance:
            "- Identify all business associates that create, receive, maintain, or transmit ePHI on behalf of the covered entity\n- Execute written business associate agreements that establish the permitted uses and disclosures of ePHI\n- Require business associates to implement appropriate administrative, physical, and technical safeguards\n- Include provisions requiring business associates to report security incidents and breaches\n- Ensure contracts address the return or destruction of ePHI upon termination of the agreement\n- Review and update business associate agreements periodically to ensure continued compliance",
        },
      ],
    },

    // ── Physical Safeguards (§164.310) ────────────────────────────────
    {
      number: "§164.310",
      title: "Physical Safeguards",
      description:
        "Physical measures, policies, and procedures to protect electronic information systems and related buildings and equipment from natural and environmental hazards and unauthorized intrusion.",
      category: "Physical Safeguards",
      controls: [
        {
          number: "§164.310(a)",
          title: "Facility Access Controls",
          objective:
            "Implement policies and procedures to limit physical access to electronic information systems and the facilities in which they are housed, while ensuring that properly authorized access is allowed.",
          guidance:
            "- Develop and implement a facility security plan that documents safeguards to protect the facility and equipment from unauthorized access, tampering, and theft\n- Implement procedures for controlling and validating a person's access to facilities based on their role or function\n- Establish contingency operations procedures that allow facility access in support of restoration of lost data under the disaster recovery and emergency mode operations plans\n- Implement policies and procedures to document repairs and modifications to the physical components of a facility related to security\n- Maintain visitor logs and escort requirements for non-authorized personnel",
        },
        {
          number: "§164.310(b)",
          title: "Workstation Use",
          objective:
            "Implement policies and procedures that specify the proper functions to be performed, the manner in which those functions are to be performed, and the physical attributes of the surroundings of a specific workstation or class of workstation that can access electronic protected health information.",
          guidance:
            "- Define acceptable use policies for workstations that access ePHI, including desktop computers, laptops, tablets, and mobile devices\n- Specify the physical environment requirements for workstations, such as positioning screens away from public view\n- Implement automatic screen lock and logoff policies for unattended workstations\n- Restrict the ability to install unauthorized software on workstations that access ePHI\n- Establish guidelines for the use of workstations in remote or home office environments",
        },
        {
          number: "§164.310(c)",
          title: "Workstation Security",
          objective:
            "Implement physical safeguards for all workstations that access electronic protected health information, to restrict access to authorized users.",
          guidance:
            "- Implement physical security measures such as cable locks, locked rooms, or secure areas for workstations that access ePHI\n- Restrict physical access to workstations to authorized personnel only\n- Position workstations in secure areas where screens cannot be viewed by unauthorized individuals\n- Implement policies for securing portable workstations such as laptops and tablets when in transit or storage\n- Conduct periodic inspections of workstation physical security controls",
        },
        {
          number: "§164.310(d)",
          title: "Device and Media Controls",
          objective:
            "Implement policies and procedures that govern the receipt and removal of hardware and electronic media that contain electronic protected health information into and out of a facility, and the movement of these items within the facility.",
          guidance:
            "- Implement policies and procedures for the final disposition of ePHI and the hardware or electronic media on which it is stored\n- Maintain records of the movements of hardware and electronic media containing ePHI, including the persons responsible\n- Establish procedures for removing ePHI from electronic media before the media are made available for reuse\n- Create and maintain retrievable exact copies of ePHI before movement of equipment\n- Implement a media sanitization process using approved methods such as degaussing, overwriting, or physical destruction\n- Track all removable media containing ePHI through an inventory management system",
        },
      ],
    },

    // ── Technical Safeguards (§164.312) ───────────────────────────────
    {
      number: "§164.312",
      title: "Technical Safeguards",
      description:
        "Technology and the policies and procedures for its use that protect electronic protected health information and control access to it.",
      category: "Technical Safeguards",
      controls: [
        {
          number: "§164.312(a)",
          title: "Access Control",
          objective:
            "Implement technical policies and procedures for electronic information systems that maintain electronic protected health information to allow access only to those persons or software programs that have been granted access rights.",
          guidance:
            "- Assign a unique name and/or number for identifying and tracking user identity across all systems containing ePHI\n- Establish and implement procedures for obtaining necessary ePHI during an emergency, including emergency access procedures\n- Implement electronic procedures that terminate an electronic session after a predetermined time of inactivity through automatic logoff\n- Implement a mechanism to encrypt and decrypt electronic protected health information at rest\n- Implement role-based access controls that limit access to ePHI based on job function and the minimum necessary standard\n- Review and update access control lists periodically to ensure continued appropriateness",
        },
        {
          number: "§164.312(b)",
          title: "Audit Controls",
          objective:
            "Implement hardware, software, and procedural mechanisms that record and examine activity in information systems that contain or use electronic protected health information.",
          guidance:
            "- Deploy audit logging mechanisms on all systems that create, store, process, or transmit ePHI\n- Define specific auditable events including logins, access attempts, data modifications, and administrative actions\n- Implement procedures for regular review and analysis of audit logs to detect suspicious activity\n- Establish retention policies for audit log data that meet regulatory and organizational requirements\n- Protect audit logs from unauthorized modification or deletion through access controls and integrity mechanisms",
        },
        {
          number: "§164.312(c)",
          title: "Integrity",
          objective:
            "Implement policies and procedures to protect electronic protected health information from improper alteration or destruction.",
          guidance:
            "- Implement electronic mechanisms to corroborate that ePHI has not been altered or destroyed in an unauthorized manner\n- Deploy integrity verification tools such as checksums, hash functions, or digital signatures for ePHI in transit and at rest\n- Implement version control and change tracking for systems and databases containing ePHI\n- Establish procedures for detecting and responding to integrity violations\n- Conduct periodic integrity checks on critical ePHI data stores",
        },
        {
          number: "§164.312(d)",
          title: "Person or Entity Authentication",
          objective:
            "Implement procedures to verify that a person or entity seeking access to electronic protected health information is the one claimed.",
          guidance:
            "- Implement authentication mechanisms that verify the identity of users before granting access to ePHI\n- Require multi-factor authentication for remote access and privileged accounts accessing ePHI systems\n- Establish policies for password complexity, expiration, and reuse prevention\n- Implement procedures for managing authentication credentials including issuance, revocation, and recovery\n- Consider biometric or token-based authentication for high-security environments containing sensitive ePHI",
        },
        {
          number: "§164.312(e)",
          title: "Transmission Security",
          objective:
            "Implement technical security measures to guard against unauthorized access to electronic protected health information that is being transmitted over an electronic communications network.",
          guidance:
            "- Implement encryption for ePHI transmitted over open networks such as the internet using protocols like TLS 1.2 or higher\n- Implement integrity controls to ensure that ePHI is not improperly modified without detection during transmission\n- Establish policies that define when encryption is required for ePHI transmissions based on risk assessment\n- Monitor and log all ePHI transmissions to detect unauthorized access or interception attempts\n- Prohibit the transmission of unencrypted ePHI via email or messaging unless appropriate safeguards are in place",
        },
      ],
    },

    // ── Organizational Requirements (§164.314) ───────────────────────
    {
      number: "§164.314",
      title: "Organizational Requirements",
      description:
        "Requirements for covered entities and business associates regarding business associate contracts and arrangements, and requirements for group health plans.",
      category: "Organizational Requirements",
      controls: [
        {
          number: "§164.314(a)",
          title: "Business Associate Contracts",
          objective:
            "Ensure that business associate contracts or other arrangements require the business associate to comply with the applicable requirements of the Security Rule, report security incidents, and ensure that any subcontractors agree to the same obligations.",
          guidance:
            "- Require business associates to implement administrative, physical, and technical safeguards that reasonably and appropriately protect the confidentiality, integrity, and availability of ePHI\n- Include contract provisions requiring business associates to report any security incident of which they become aware, including breaches of unsecured PHI\n- Require business associates to ensure that any subcontractors that create, receive, maintain, or transmit ePHI agree to the same restrictions and conditions\n- Specify that the business associate will make its practices, books, and records available to the Secretary of HHS for compliance determination\n- Include provisions for termination of the contract if the business associate violates a material term",
        },
        {
          number: "§164.314(b)",
          title: "Requirements for Group Health Plans",
          objective:
            "Ensure that group health plan documents require the plan sponsor to implement reasonable and appropriate administrative, physical, and technical safeguards to protect ePHI and to ensure adequate separation between the group health plan and the plan sponsor.",
          guidance:
            "- Amend plan documents to require the plan sponsor to implement safeguards to protect ePHI created, received, maintained, or transmitted on behalf of the group health plan\n- Ensure plan documents require the plan sponsor to ensure adequate separation between the plan and the plan sponsor is supported by reasonable and appropriate security measures\n- Require the plan sponsor to report any security incident of which it becomes aware to the group health plan\n- Ensure that only authorized employees of the plan sponsor have access to ePHI and only for plan administration functions\n- Document the firewalls and access restrictions between plan sponsor functions and other business functions",
        },
      ],
    },

    // ── Breach Notification (§164.400-414) ────────────────────────────
    {
      number: "§164.400-414",
      title: "Breach Notification",
      description:
        "Requirements for covered entities and business associates to provide notification following a breach of unsecured protected health information.",
      category: "Breach Notification",
      controls: [
        {
          number: "§164.404",
          title: "Breach Notification to Individuals",
          objective:
            "Notify each individual whose unsecured protected health information has been, or is reasonably believed to have been, accessed, acquired, used, or disclosed as a result of a breach without unreasonable delay and no later than 60 days from discovery.",
          guidance:
            "- Establish procedures to identify and investigate potential breaches of unsecured PHI promptly upon discovery\n- Provide written notification to affected individuals by first-class mail or email (if the individual has agreed to electronic notice) within 60 calendar days of discovering the breach\n- Include in the notification a description of what happened, the types of information involved, steps individuals should take to protect themselves, what the entity is doing to investigate and mitigate, and contact procedures\n- If contact information is insufficient or out of date for 10 or more individuals, provide substitute notice through a conspicuous posting on the home page of the entity's website or through major print or broadcast media\n- Maintain documentation of all breach notifications sent, including dates, recipients, and content",
        },
        {
          number: "§164.408",
          title: "Notification to the Secretary",
          objective:
            "Notify the Secretary of the U.S. Department of Health and Human Services of breaches of unsecured protected health information.",
          guidance:
            "- For breaches affecting 500 or more individuals, notify the Secretary of HHS contemporaneously with individual notification and no later than 60 days from discovery\n- For breaches affecting fewer than 500 individuals, maintain a log of breaches and submit it to the Secretary annually within 60 days after the end of the calendar year\n- Submit breach notifications to the Secretary through the HHS breach reporting portal at the designated website\n- Include in the notification the same information required for individual notifications plus the number of individuals affected\n- Retain documentation of all Secretary notifications and breach logs for a minimum of six years",
        },
        {
          number: "§164.406",
          title: "Notification to Media",
          objective:
            "Provide notification to prominent media outlets serving the state or jurisdiction when a breach of unsecured protected health information affects more than 500 residents of a state or jurisdiction.",
          guidance:
            "- Identify prominent media outlets that serve the affected state or jurisdiction when a breach affects more than 500 residents\n- Provide notice to the media without unreasonable delay and no later than 60 days from discovery of the breach\n- Include in the media notification the same content elements required for individual notifications\n- Coordinate media notification timing with individual notification and Secretary notification\n- Document all media notifications including outlets contacted, dates, and content provided",
        },
        {
          number: "§164.404(c)",
          title: "Content of Notification",
          objective:
            "Ensure that breach notification content includes all required elements to adequately inform individuals and enable them to take protective action.",
          guidance:
            "- Include a brief description of what happened, including the date of the breach and the date of discovery\n- Describe the types of unsecured protected health information involved in the breach, such as full name, Social Security number, date of birth, home address, account number, diagnosis, or disability code\n- Describe the steps individuals should take to protect themselves from potential harm resulting from the breach\n- Provide a description of what the covered entity is doing to investigate the breach, mitigate losses, and protect against further breaches\n- Include contact procedures for individuals to ask questions or obtain additional information, including a toll-free telephone number, email address, website, or postal address",
        },
      ],
    },

    // ── Privacy Rule (§164.500-534) ───────────────────────────────────
    {
      number: "§164.500-534",
      title: "Privacy Rule",
      description:
        "Standards for the use and disclosure of individuals' protected health information, establishing individual rights regarding their health information, and administrative requirements for covered entities.",
      category: "Privacy Rule",
      controls: [
        {
          number: "§164.502",
          title: "Uses and Disclosures",
          objective:
            "Establish standards for when and how covered entities and business associates may use or disclose protected health information, including permitted uses for treatment, payment, and health care operations.",
          guidance:
            "- Develop and implement policies defining permitted uses and disclosures of PHI for treatment, payment, and health care operations\n- Establish procedures for obtaining individual authorization before using or disclosing PHI for purposes not otherwise permitted or required\n- Implement controls to track and document all disclosures of PHI, including the date, recipient, purpose, and description of the information disclosed\n- Ensure that workforce members understand the distinction between permitted and non-permitted uses and disclosures\n- Review and update use and disclosure policies regularly to reflect changes in law and organizational practices",
        },
        {
          number: "§164.502(b)",
          title: "Minimum Necessary",
          objective:
            "Ensure that when using or disclosing protected health information or when requesting protected health information from another covered entity or business associate, the covered entity makes reasonable efforts to limit the information to the minimum necessary to accomplish the intended purpose.",
          guidance:
            "- Identify the workforce members or classes of workforce members who need access to PHI to carry out their duties and the categories of PHI to which access is needed\n- Develop policies that limit access to PHI based on specific roles and responsibilities to the minimum amount necessary\n- For routine and recurring disclosures, implement standard protocols that limit the PHI disclosed to the minimum necessary\n- For non-routine disclosures, develop criteria for reviewing requests on an individual basis to determine the minimum necessary information\n- Train workforce members on the minimum necessary standard and monitor compliance through periodic audits",
        },
        {
          number: "§164.520",
          title: "Notice of Privacy Practices",
          objective:
            "Provide individuals with adequate notice of the uses and disclosures of protected health information that may be made by the covered entity, and of the individual's rights and the covered entity's legal duties with respect to protected health information.",
          guidance:
            "- Develop a Notice of Privacy Practices (NPP) that describes how PHI may be used and disclosed, individual rights, and the entity's legal duties\n- Provide the NPP to individuals no later than the date of first service delivery and make it available at the covered entity's premises and on its website\n- Obtain a written acknowledgment of receipt of the NPP from individuals, or document good faith efforts to obtain the acknowledgment\n- Include in the NPP the right to file a complaint with the covered entity and with the Secretary of HHS\n- Revise the NPP whenever there is a material change to uses, disclosures, individual rights, or legal duties and distribute the revised notice promptly\n- Post the NPP prominently on the entity's website if the entity maintains a website",
        },
        {
          number: "§164.524-§164.528",
          title: "Individual Rights",
          objective:
            "Ensure individuals can exercise their rights under the Privacy Rule, including the right to access, amend, and receive an accounting of disclosures of their protected health information.",
          guidance:
            "- Implement procedures to provide individuals with access to their PHI in a designated record set within 30 days of a request, with a possible 30-day extension\n- Establish a process for individuals to request amendments to their PHI and respond to such requests within 60 days\n- Maintain an accounting of disclosures of PHI made during the six years prior to the date of the request, excluding certain categories of disclosures\n- Allow individuals to request restrictions on certain uses and disclosures of their PHI and to request confidential communications\n- Implement a process for individuals to designate a personal representative to exercise their privacy rights on their behalf\n- Document all requests and responses related to individual rights and retain records for a minimum of six years",
        },
        {
          number: "§164.530",
          title: "Administrative Requirements",
          objective:
            "Implement administrative requirements to ensure compliance with the Privacy Rule, including the designation of a privacy official, workforce training, safeguards, complaints processes, and documentation and record retention.",
          guidance:
            "- Designate a privacy official (Privacy Officer) responsible for the development and implementation of privacy policies and procedures\n- Designate a contact person responsible for receiving complaints and provide a process for individuals to make complaints\n- Train all workforce members on privacy policies and procedures as necessary and appropriate for them to carry out their functions\n- Apply appropriate sanctions against workforce members who violate privacy policies and procedures\n- Implement administrative, technical, and physical safeguards to reasonably protect PHI from intentional or unintentional use or disclosure in violation of the Privacy Rule\n- Retain all privacy policies, procedures, communications, actions, activities, and designations for six years from the date of creation or the date last in effect",
        },
      ],
    },
  ]

  let sortOrder = 0

  for (const section of sections) {
    const parentClause = await prisma.clause.create({
      data: {
        frameworkId: fwId,
        number: section.number,
        title: section.title,
        description: section.description,
        isAnnex: false,
        sortOrder: sortOrder++,
      },
    })

    for (const ctrl of section.controls) {
      // Create a sub-clause for each control
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
          category: section.category,
          objective: ctrl.objective,
          guidance: ctrl.guidance,
        },
      })
    }
  }

  const clauseCount = await prisma.clause.count({ where: { frameworkId: fwId } })
  const controlCount = await prisma.control.count({ where: { clause: { frameworkId: fwId } } })

  console.log(`[seed] HIPAA seeded -- ${clauseCount} clauses, ${controlCount} controls`)
}
