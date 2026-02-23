import { PrismaClient } from "@prisma/client"

export async function seedISO9001(prisma: PrismaClient) {
  const framework = await prisma.framework.upsert({
    where: { code: "ISO9001" },
    update: {
      name: "ISO 9001:2015",
      version: "2015",
      status: "PUBLISHED",
    },
    create: {
      code: "ISO9001",
      name: "ISO 9001:2015",
      version: "2015",
      description: "Quality management systems — Requirements",
      status: "PUBLISHED",
    },
  })

  const fId = framework.id

  await prisma.clause.deleteMany({ where: { frameworkId: fId } })

  // Clause 4: Context of the organization
  const c4 = await prisma.clause.create({
    data: { frameworkId: fId, number: "4", title: "Context of the organization", sortOrder: 4 },
  })
  const c4Subs = [
    { number: "4.1", title: "Understanding the organization and its context" },
    { number: "4.2", title: "Understanding the needs and expectations of interested parties" },
    { number: "4.3", title: "Determining the scope of the quality management system" },
    { number: "4.4", title: "Quality management system and its processes" },
  ]
  const c4Guidance: Record<string, string> = {
    "4.1": "- Identify internal and external issues relevant to the organization's purpose and strategic direction\n- Conduct PESTLE analysis (Political, Economic, Social, Technological, Legal, Environmental)\n- Monitor and review information about these issues regularly\n- Document the context analysis and link it to the QMS scope\n- Ensure the context is considered during management reviews",
    "4.2": "- Identify all interested parties relevant to the QMS (customers, suppliers, regulators, employees, shareholders)\n- Determine the requirements and expectations of each interested party\n- Assess which requirements will be addressed through the QMS\n- Monitor and review information about interested parties periodically\n- Maintain a register of interested parties and their relevant requirements",
    "4.3": "- Define the boundaries and applicability of the QMS\n- Consider the internal and external issues from 4.1 and interested party requirements from 4.2\n- Document and justify any exclusions from ISO 9001 requirements\n- Ensure the scope statement is available and maintained as documented information\n- Review the scope when the organization's context or interested party needs change",
    "4.4": "- Map all processes needed for the QMS including inputs, outputs, sequence, and interactions\n- Assign process owners and define responsibilities for each process\n- Determine criteria and methods for effective operation and control of processes\n- Identify resources needed and ensure their availability\n- Monitor, measure, and evaluate processes; implement changes to achieve intended results",
  }
  for (const sub of c4Subs) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c4.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "QMS Context", objective: `Ensure the organization addresses ${sub.title.toLowerCase()}.`, guidance: c4Guidance[sub.number] },
    })
  }

  // Clause 5: Leadership
  const c5 = await prisma.clause.create({
    data: { frameworkId: fId, number: "5", title: "Leadership", sortOrder: 5 },
  })
  const c51 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c5.id, number: "5.1", title: "Leadership and commitment", sortOrder: 51 },
  })
  const c51Guidance: Record<string, string> = {
    "5.1.1": "- Demonstrate top management accountability for the effectiveness of the QMS\n- Ensure the quality policy and quality objectives are established and aligned with strategic direction\n- Promote the use of the process approach and risk-based thinking throughout the organization\n- Ensure QMS requirements are integrated into the organization's business processes\n- Communicate the importance of effective quality management and conforming to QMS requirements",
    "5.1.2": "- Ensure customer requirements and applicable statutory and regulatory requirements are determined and met\n- Identify and address risks and opportunities that can affect product and service conformity\n- Maintain focus on enhancing customer satisfaction through regular feedback collection\n- Establish customer satisfaction metrics and review them at management reviews\n- Ensure customer complaint handling processes are effective and responsive",
  }
  for (const sub of [
    { number: "5.1.1", title: "General" },
    { number: "5.1.2", title: "Customer focus" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c51.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Leadership", objective: `Leadership commitment regarding ${sub.title.toLowerCase()}.`, guidance: c51Guidance[sub.number] },
    })
  }
  const c52 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c5.id, number: "5.2", title: "Policy", sortOrder: 52 },
  })
  const c52Guidance: Record<string, string> = {
    "5.2.1": "- Draft a quality policy that is appropriate to the purpose and context of the organization\n- Include a commitment to satisfy applicable requirements and to continual improvement\n- Ensure the policy provides a framework for setting quality objectives\n- Have top management formally approve and sign the quality policy\n- Review the quality policy for continued suitability during management reviews",
    "5.2.2": "- Make the quality policy available as documented information within the organization\n- Communicate the quality policy to all employees through training, intranet, posters, or meetings\n- Ensure the quality policy is understood and applied at all levels of the organization\n- Make the quality policy available to relevant interested parties as appropriate\n- Verify awareness of the quality policy through internal audits and employee interviews",
  }
  for (const sub of [
    { number: "5.2.1", title: "Establishing the quality policy" },
    { number: "5.2.2", title: "Communicating the quality policy" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c52.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Leadership", objective: `Ensure ${sub.title.toLowerCase()}.`, guidance: c52Guidance[sub.number] },
    })
  }
  const c53Clause = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c5.id, number: "5.3", title: "Organizational roles, responsibilities and authorities", sortOrder: 53 },
  })
  await prisma.control.create({
    data: {
      clauseId: c53Clause.id, number: "5.3", title: "Organizational roles, responsibilities and authorities", category: "Leadership", objective: "Ensure relevant roles, responsibilities and authorities are assigned, communicated and understood.",
      guidance: "- Define and document roles, responsibilities, and authorities for all QMS-related positions\n- Assign responsibility for ensuring the QMS conforms to ISO 9001 requirements\n- Assign responsibility for reporting on QMS performance and opportunities for improvement to top management\n- Ensure all employees understand their roles and how they contribute to quality objectives\n- Maintain an organizational chart and role descriptions as documented information\n- Review and update role assignments when organizational changes occur",
    },
  })

  // Clause 6: Planning
  const c6 = await prisma.clause.create({
    data: { frameworkId: fId, number: "6", title: "Planning", sortOrder: 6 },
  })
  const c6Guidance: Record<string, string> = {
    "6.1": "- Identify risks and opportunities by considering the issues from 4.1 and requirements from 4.2\n- Develop a risk register that documents risks, their likelihood, impact, and mitigation actions\n- Plan actions to address risks and opportunities and integrate them into QMS processes\n- Evaluate the effectiveness of risk mitigation actions periodically\n- Use risk-based thinking to prioritize process improvements and resource allocation",
    "6.2": "- Establish measurable quality objectives at relevant functions, levels, and processes\n- Ensure quality objectives are consistent with the quality policy and relevant to product/service conformity\n- Plan what will be done, what resources are needed, who is responsible, and when it will be completed\n- Monitor progress toward quality objectives and communicate results\n- Update quality objectives as needed based on performance data and changing circumstances",
    "6.3": "- Establish a change management process for planned changes to the QMS\n- Consider the purpose of changes and their potential consequences before implementation\n- Assess resource availability and reallocation of responsibilities when planning changes\n- Maintain the integrity of the QMS during and after changes are implemented\n- Document changes and communicate them to affected parties",
  }
  for (const sub of [
    { number: "6.1", title: "Actions to address risks and opportunities" },
    { number: "6.2", title: "Quality objectives and planning to achieve them" },
    { number: "6.3", title: "Planning of changes" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c6.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Planning", objective: `Address ${sub.title.toLowerCase()}.`, guidance: c6Guidance[sub.number] },
    })
  }

  // Clause 7: Support
  const c7 = await prisma.clause.create({
    data: { frameworkId: fId, number: "7", title: "Support", sortOrder: 7 },
  })
  const c71 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c7.id, number: "7.1", title: "Resources", sortOrder: 71 },
  })
  const c71Guidance: Record<string, string> = {
    "7.1.1": "- Determine and provide resources needed for the establishment, implementation, maintenance, and continual improvement of the QMS\n- Consider the capabilities and constraints of existing internal resources\n- Assess what needs to be obtained from external providers\n- Include resource planning in the annual budget and management review process",
    "7.1.2": "- Determine and provide the people necessary for effective implementation of the QMS\n- Conduct workforce planning to ensure adequate staffing for quality-critical processes\n- Plan for succession and cross-training to maintain process continuity\n- Evaluate workload distribution to prevent quality issues from understaffing",
    "7.1.3": "- Determine, provide, and maintain the infrastructure necessary for product and service conformity\n- Include buildings, workspace, utilities, equipment, hardware, software, and transportation\n- Establish preventive maintenance programs for critical infrastructure\n- Document infrastructure requirements and maintain asset inventories\n- Plan for infrastructure upgrades based on process needs and capacity planning",
    "7.1.4": "- Determine, provide, and maintain the environment necessary for operation of processes\n- Address physical factors such as temperature, humidity, lighting, airflow, and noise\n- Consider social and psychological factors such as stress reduction, burnout prevention, and conflict management\n- Monitor environmental conditions where they affect product or service quality\n- Document environmental requirements for quality-critical processes",
    "7.1.5": "- Identify the monitoring and measuring resources needed to verify conformity of products and services\n- Ensure measurement equipment is calibrated or verified at specified intervals against traceable standards\n- Maintain calibration records including dates, results, and next calibration due dates\n- Safeguard monitoring and measuring resources from damage and deterioration\n- Evaluate and record the validity of previous measurement results when equipment is found out of calibration",
    "7.1.6": "- Determine the knowledge necessary for the operation of processes and conformity of products and services\n- Maintain this knowledge through documentation, training records, and knowledge bases\n- Make organizational knowledge accessible to those who need it\n- Consider how to acquire or access additional knowledge when addressing changing needs and trends\n- Protect organizational knowledge from loss due to staff turnover or system failures",
  }
  for (const sub of [
    { number: "7.1.1", title: "General" },
    { number: "7.1.2", title: "People" },
    { number: "7.1.3", title: "Infrastructure" },
    { number: "7.1.4", title: "Environment for the operation of processes" },
    { number: "7.1.5", title: "Monitoring and measuring resources" },
    { number: "7.1.6", title: "Organizational knowledge" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c71.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Support", objective: `Manage ${sub.title.toLowerCase()} effectively.`, guidance: c71Guidance[sub.number] },
    })
  }
  const c7DirectGuidance: Record<string, string> = {
    "7.2": "- Determine the necessary competence of persons doing work that affects QMS performance and effectiveness\n- Ensure persons are competent on the basis of education, training, or experience\n- Take actions to acquire the necessary competence where gaps are identified (training, mentoring, reassignment)\n- Evaluate the effectiveness of actions taken to address competence gaps\n- Retain documented information as evidence of competence (certificates, training records, qualifications)",
    "7.3": "- Ensure persons doing work under the organization's control are aware of the quality policy\n- Communicate relevant quality objectives and their contribution to QMS effectiveness\n- Make employees aware of their contribution to QMS effectiveness including the benefits of improved performance\n- Ensure awareness of the implications of not conforming to QMS requirements\n- Reinforce awareness through induction programs, toolbox talks, and periodic refresher communications",
    "7.4": "- Determine the internal and external communications relevant to the QMS\n- Define what to communicate, when to communicate, with whom to communicate, and how to communicate\n- Establish communication channels for quality alerts, nonconformities, and process changes\n- Ensure two-way communication between management and operational staff regarding quality matters\n- Document the communication plan and review its effectiveness periodically",
  }
  for (const sub of [
    { number: "7.2", title: "Competence" },
    { number: "7.3", title: "Awareness" },
    { number: "7.4", title: "Communication" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c7.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Support", objective: `Ensure ${sub.title.toLowerCase()} is managed.`, guidance: c7DirectGuidance[sub.number] },
    })
  }
  const c75 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c7.id, number: "7.5", title: "Documented information", sortOrder: 75 },
  })
  const c75Guidance: Record<string, string> = {
    "7.5.1": "- Determine the documented information required by ISO 9001 and any additional documentation the organization deems necessary\n- Establish a document hierarchy (quality manual, procedures, work instructions, records)\n- Ensure documented information is appropriate to the size and complexity of the organization\n- Assign document owners responsible for maintaining currency and accuracy\n- Review the documentation structure periodically to remove obsolete or redundant documents",
    "7.5.2": "- Ensure appropriate identification and description when creating or updating documented information (title, date, author, revision number)\n- Define standard formats and templates for consistent documentation\n- Establish a review and approval process before documents are issued\n- Ensure the appropriate media and format (paper, electronic) is used for each type of document\n- Control version history and maintain a changelog for significant documents",
    "7.5.3": "- Ensure documented information is available and suitable for use where and when it is needed\n- Protect documented information against loss of confidentiality, improper use, or loss of integrity\n- Control distribution, access, retrieval, and use of documented information\n- Control storage, preservation, and disposition including retention periods\n- Manage documents of external origin (supplier specs, regulatory requirements) within the document control system",
  }
  for (const sub of [
    { number: "7.5.1", title: "General" },
    { number: "7.5.2", title: "Creating and updating" },
    { number: "7.5.3", title: "Control of documented information" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c75.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Support", objective: `Manage documented information: ${sub.title.toLowerCase()}.`, guidance: c75Guidance[sub.number] },
    })
  }

  // Clause 8: Operation
  const c8 = await prisma.clause.create({
    data: { frameworkId: fId, number: "8", title: "Operation", sortOrder: 8 },
  })
  const c81Clause = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c8.id, number: "8.1", title: "Operational planning and control", sortOrder: 81 },
  })
  await prisma.control.create({
    data: {
      clauseId: c81Clause.id, number: "8.1", title: "Operational planning and control", category: "Operation", objective: "Plan, implement and control processes needed to meet requirements.",
      guidance: "- Establish criteria for all operational processes including acceptance criteria for products and services\n- Implement control of processes in accordance with the established criteria\n- Determine and maintain documented information to demonstrate that processes have been carried out as planned\n- Plan for and manage outsourced processes to ensure they meet requirements\n- Control planned changes and review the consequences of unintended changes, taking action to mitigate adverse effects",
    },
  })

  const c82 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c8.id, number: "8.2", title: "Requirements for products and services", sortOrder: 82 },
  })
  const c82Guidance: Record<string, string> = {
    "8.2.1": "- Provide customers with information relating to products and services, including specifications and delivery terms\n- Establish processes for handling enquiries, contracts, and orders including amendments\n- Obtain customer feedback including complaints and implement a resolution process\n- Define requirements for handling and controlling customer property\n- Establish contingency action requirements when relevant to ensure product and service continuity",
    "8.2.2": "- Define product and service requirements including any statutory and regulatory requirements\n- Identify requirements not stated by the customer but necessary for the intended use\n- Ensure the organization can meet the claims it makes for the products and services it offers\n- Document all determined requirements clearly and unambiguously\n- Review requirements with cross-functional teams to ensure completeness",
    "8.2.3": "- Review requirements before committing to supply products and services to the customer\n- Ensure the organization has the ability to meet the defined requirements, including delivery and post-delivery\n- Resolve any requirements that differ from those previously expressed (e.g., contract vs. order discrepancies)\n- Confirm customer requirements when not provided in documented form\n- Retain documented information of review results and any new or changed requirements",
    "8.2.4": "- Ensure relevant documented information is amended when requirements for products and services are changed\n- Communicate changes to all relevant personnel affected by modified requirements\n- Re-review the impact of changes on the organization's ability to meet requirements\n- Update contracts, orders, and specifications to reflect the agreed changes\n- Maintain a change log to track requirement modifications and their approval status",
  }
  for (const sub of [
    { number: "8.2.1", title: "Customer communication" },
    { number: "8.2.2", title: "Determining the requirements for products and services" },
    { number: "8.2.3", title: "Review of the requirements for products and services" },
    { number: "8.2.4", title: "Changes to requirements for products and services" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c82.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Operation", objective: `Ensure ${sub.title.toLowerCase()}.`, guidance: c82Guidance[sub.number] },
    })
  }

  const c83 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c8.id, number: "8.3", title: "Design and development of products and services", sortOrder: 83 },
  })
  const c83Guidance: Record<string, string> = {
    "8.3.1": "- Establish, implement, and maintain a design and development process appropriate to the organization\n- Define the stages and controls for design and development activities\n- Ensure the process covers all phases from concept through to final design output\n- Integrate design and development with other QMS processes (risk management, purchasing, production)",
    "8.3.2": "- Consider the nature, duration, and complexity of design and development activities\n- Define required process stages including applicable design reviews, verification, and validation\n- Determine internal and external resource needs for design and development\n- Clarify responsibilities and authorities for the design and development process\n- Establish a design and development plan with milestones, deliverables, and timelines\n- Identify the need for involvement of customers and users in the design process",
    "8.3.3": "- Determine requirements essential for the specific types of products and services being designed\n- Include functional and performance requirements in the design inputs\n- Consider information derived from previous similar design and development activities\n- Address statutory and regulatory requirements applicable to the design\n- Evaluate and resolve incomplete, ambiguous, or conflicting inputs before proceeding",
    "8.3.4": "- Define the results to be achieved from the design and development process\n- Conduct design reviews at appropriate stages to evaluate the ability to meet requirements\n- Perform verification activities to confirm design outputs meet design input requirements\n- Perform validation activities to ensure the resulting products and services meet intended use requirements\n- Take necessary actions on problems identified during reviews, verification, or validation\n- Retain documented information of all control activities performed",
    "8.3.5": "- Ensure design and development outputs meet the input requirements\n- Ensure outputs are adequate for subsequent processes (e.g., production, service provision)\n- Include or reference monitoring and measuring requirements and acceptance criteria\n- Specify characteristics of products and services essential for their intended purpose and safe use\n- Approve design outputs through a formal sign-off process before release",
    "8.3.6": "- Identify, review, and control changes made during or after design and development\n- Evaluate the effect of changes on constituent parts and already-delivered products and services\n- Conduct reviews, verification, and validation as necessary before implementing changes\n- Obtain authorization for design changes before implementation\n- Retain documented information describing the changes, review results, authorization, and actions taken to prevent adverse impacts",
  }
  for (const sub of [
    { number: "8.3.1", title: "General" },
    { number: "8.3.2", title: "Design and development planning" },
    { number: "8.3.3", title: "Design and development inputs" },
    { number: "8.3.4", title: "Design and development controls" },
    { number: "8.3.5", title: "Design and development outputs" },
    { number: "8.3.6", title: "Design and development changes" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c83.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Operation", objective: `Manage ${sub.title.toLowerCase()}.`, guidance: c83Guidance[sub.number] },
    })
  }

  const c84 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c8.id, number: "8.4", title: "Control of externally provided processes, products and services", sortOrder: 84 },
  })
  const c84Guidance: Record<string, string> = {
    "8.4.1": "- Ensure externally provided processes, products, and services conform to requirements\n- Determine and apply criteria for the evaluation, selection, monitoring, and re-evaluation of external providers\n- Evaluate providers based on their ability to deliver in accordance with requirements\n- Maintain an approved supplier list and conduct periodic supplier performance reviews\n- Retain documented information of evaluation results and any necessary actions arising from evaluations",
    "8.4.2": "- Ensure externally provided processes remain within the control of the QMS\n- Define the controls to be applied to external providers and their resulting outputs\n- Consider the potential impact of externally provided processes on the organization's ability to meet customer requirements\n- Define verification or other activities necessary to ensure externally provided products and services meet requirements\n- Conduct incoming inspection, audits, or other verification activities as appropriate",
    "8.4.3": "- Communicate to external providers the requirements for the processes, products, and services to be provided\n- Define requirements for approval of products, services, methods, processes, and equipment\n- Communicate competence requirements including any required qualification of personnel\n- Define the interactions and control that the organization intends to apply to the external provider\n- Communicate verification or validation activities the organization or its customer intends to perform at the provider's premises",
  }
  for (const sub of [
    { number: "8.4.1", title: "General" },
    { number: "8.4.2", title: "Type and extent of control" },
    { number: "8.4.3", title: "Information for external providers" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c84.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Operation", objective: `Control externally provided: ${sub.title.toLowerCase()}.`, guidance: c84Guidance[sub.number] },
    })
  }

  const c85 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c8.id, number: "8.5", title: "Production and service provision", sortOrder: 85 },
  })
  const c85Guidance: Record<string, string> = {
    "8.5.1": "- Implement production and service provision under controlled conditions\n- Ensure the availability of documented information that defines product characteristics and activities to be performed\n- Use suitable monitoring and measuring resources at appropriate stages\n- Implement actions to prevent human error (poka-yoke, checklists, standard work instructions)\n- Validate and periodically revalidate processes where resulting output cannot be verified by subsequent monitoring or measurement\n- Implement product and service release, delivery, and post-delivery activities",
    "8.5.2": "- Use suitable means to identify outputs when necessary to ensure conformity of products and services\n- Identify the status of outputs with respect to monitoring and measurement requirements throughout production\n- Maintain unique identification of outputs when traceability is a requirement\n- Retain documented information necessary to enable traceability\n- Implement lot or batch tracking systems where required by customer or regulatory requirements",
    "8.5.3": "- Identify, verify, protect, and safeguard property belonging to customers or external providers while under the organization's control\n- Report to the customer or external provider when their property is lost, damaged, or otherwise found to be unsuitable\n- Maintain records of customer-supplied property received and its condition\n- Include intellectual property, personal data, and other intangible property in the scope of protection",
    "8.5.4": "- Preserve outputs during production and service provision to the extent necessary to ensure conformity to requirements\n- Address identification, handling, contamination control, packaging, storage, transmission, transportation, and protection\n- Define and implement shelf-life controls and FIFO (first in, first out) stock rotation where applicable\n- Ensure storage conditions are appropriate for the products being preserved\n- Monitor preservation conditions and take corrective action when deviations occur",
    "8.5.5": "- Determine the extent of post-delivery activities required, considering statutory and regulatory requirements\n- Consider potential undesired consequences associated with products and services\n- Evaluate the nature, use, and intended lifetime of products and services\n- Address customer requirements and feedback in post-delivery service design\n- Implement warranty management, repair services, and technical support as appropriate",
    "8.5.6": "- Review and control changes for production or service provision to ensure continuing conformity with requirements\n- Retain documented information describing the results of the review, authorization of changes, and any necessary actions\n- Assess the impact of changes on existing products and services in process or already delivered\n- Communicate changes to relevant personnel and, where necessary, to customers\n- Validate that changes achieve the intended results without introducing new nonconformities",
  }
  for (const sub of [
    { number: "8.5.1", title: "Control of production and service provision" },
    { number: "8.5.2", title: "Identification and traceability" },
    { number: "8.5.3", title: "Property belonging to customers or external providers" },
    { number: "8.5.4", title: "Preservation" },
    { number: "8.5.5", title: "Post-delivery activities" },
    { number: "8.5.6", title: "Control of changes" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c85.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Operation", objective: `Ensure ${sub.title.toLowerCase()}.`, guidance: c85Guidance[sub.number] },
    })
  }

  const c86Clause = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c8.id, number: "8.6", title: "Release of products and services", sortOrder: 86 },
  })
  await prisma.control.create({
    data: {
      clauseId: c86Clause.id, number: "8.6", title: "Release of products and services", category: "Operation", objective: "Implement planned arrangements to verify that product and service requirements have been met.",
      guidance: "- Implement planned arrangements at appropriate stages to verify that product and service requirements have been met\n- Define acceptance criteria and ensure they are documented and accessible\n- Do not release products and services to the customer until all planned arrangements are satisfactorily completed, unless otherwise approved by a relevant authority and, where applicable, by the customer\n- Retain documented information on the release of products and services including evidence of conformity with acceptance criteria\n- Ensure traceability to the person(s) authorizing the release",
    },
  })
  const c87Clause = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c8.id, number: "8.7", title: "Control of nonconforming outputs", sortOrder: 87 },
  })
  await prisma.control.create({
    data: {
      clauseId: c87Clause.id, number: "8.7", title: "Control of nonconforming outputs", category: "Operation", objective: "Ensure outputs not conforming to requirements are identified and controlled.",
      guidance: "- Identify nonconforming outputs and take action to prevent their unintended use or delivery\n- Deal with nonconforming outputs by correction, segregation, containment, return, or suspension of provision\n- Obtain concession approval from the customer where nonconforming product is proposed for use-as-is or rework\n- Verify conformity to requirements when nonconforming outputs are corrected\n- Retain documented information that describes the nonconformity, actions taken, concessions obtained, and the authority deciding the action",
    },
  })

  // Clause 9: Performance evaluation
  const c9 = await prisma.clause.create({
    data: { frameworkId: fId, number: "9", title: "Performance evaluation", sortOrder: 9 },
  })
  const c91 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c9.id, number: "9.1", title: "Monitoring, measurement, analysis and evaluation", sortOrder: 91 },
  })
  const c91Guidance: Record<string, string> = {
    "9.1.1": "- Determine what needs to be monitored and measured for QMS performance and effectiveness\n- Determine the methods for monitoring, measurement, analysis, and evaluation to ensure valid results\n- Determine when monitoring and measuring shall be performed\n- Determine when results from monitoring and measurement shall be analyzed and evaluated\n- Retain appropriate documented information as evidence of the results",
    "9.1.2": "- Monitor customers' perceptions of the degree to which their needs and expectations have been fulfilled\n- Determine the methods for obtaining, monitoring, and reviewing customer satisfaction information\n- Use customer surveys, feedback on delivered products, meetings with customers, market share analysis, and warranty claims\n- Analyze customer satisfaction trends and benchmark against industry standards\n- Use customer satisfaction data as an input to management review and improvement planning",
    "9.1.3": "- Analyze and evaluate appropriate data and information arising from monitoring and measurement\n- Evaluate conformity of products and services and the degree of customer satisfaction\n- Evaluate the performance and effectiveness of the QMS including trends in process performance\n- Assess whether planning has been implemented effectively and risk actions have been effective\n- Use statistical techniques where appropriate to analyze data and identify patterns",
  }
  for (const sub of [
    { number: "9.1.1", title: "General" },
    { number: "9.1.2", title: "Customer satisfaction" },
    { number: "9.1.3", title: "Analysis and evaluation" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c91.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Performance Evaluation", objective: `Ensure ${sub.title.toLowerCase()}.`, guidance: c91Guidance[sub.number] },
    })
  }

  const c92 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c9.id, number: "9.2", title: "Internal audit", sortOrder: 92 },
  })
  const c92Guidance: Record<string, string> = {
    "9.2.1": "- Conduct internal audits at planned intervals to provide information on whether the QMS conforms to requirements\n- Verify conformance to the organization's own QMS requirements and the requirements of ISO 9001\n- Determine whether the QMS is effectively implemented and maintained\n- Select auditors who are objective and impartial (auditors shall not audit their own work)\n- Retain documented information as evidence of the audit results",
    "9.2.2": "- Plan, establish, implement, and maintain an audit program including frequency, methods, responsibilities, and reporting\n- Take into account the importance of processes concerned, changes affecting the organization, and results of previous audits\n- Define the audit criteria and scope for each audit\n- Ensure the results of audits are reported to relevant management\n- Take appropriate correction and corrective actions without undue delay for nonconformities found during audits",
  }
  for (const sub of [
    { number: "9.2.1", title: "General" },
    { number: "9.2.2", title: "Audit programme" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c92.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Performance Evaluation", objective: `Internal audit: ${sub.title.toLowerCase()}.`, guidance: c92Guidance[sub.number] },
    })
  }

  const c93 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c9.id, number: "9.3", title: "Management review", sortOrder: 93 },
  })
  const c93Guidance: Record<string, string> = {
    "9.3.1": "- Top management shall review the QMS at planned intervals to ensure its continued suitability, adequacy, effectiveness, and alignment with strategic direction\n- Schedule management reviews at least annually, or more frequently if needed\n- Ensure all required participants attend including top management and process owners\n- Prepare a structured agenda covering all required inputs\n- Retain documented information as evidence of management review results",
    "9.3.2": "- Include the status of actions from previous management reviews as an input\n- Review changes in external and internal issues relevant to the QMS\n- Evaluate information on QMS performance and effectiveness including customer satisfaction, quality objectives, process performance, and nonconformities\n- Review the adequacy of resources and the effectiveness of actions taken to address risks and opportunities\n- Consider results of audits and feedback from relevant interested parties",
    "9.3.3": "- Document decisions and actions related to opportunities for improvement\n- Record any identified need for changes to the QMS including resource needs\n- Assign responsibilities and timeframes for management review action items\n- Communicate management review outcomes to relevant personnel\n- Track completion of management review actions and report progress at subsequent reviews",
  }
  for (const sub of [
    { number: "9.3.1", title: "General" },
    { number: "9.3.2", title: "Management review inputs" },
    { number: "9.3.3", title: "Management review outputs" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c93.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Performance Evaluation", objective: `Management review: ${sub.title.toLowerCase()}.`, guidance: c93Guidance[sub.number] },
    })
  }

  // Clause 10: Improvement
  const c10 = await prisma.clause.create({
    data: { frameworkId: fId, number: "10", title: "Improvement", sortOrder: 10 },
  })
  const c10Guidance: Record<string, string> = {
    "10.1": "- Determine and select opportunities for improvement and implement necessary actions to meet customer requirements and enhance satisfaction\n- Include improving products and services to meet current and anticipated requirements\n- Correct, prevent, or reduce undesired effects across all QMS processes\n- Improve the performance and effectiveness of the QMS through systematic analysis\n- Consider results from analysis and evaluation, management review outputs, and audit findings as inputs for improvement",
    "10.2": "- React to nonconformities by taking action to control and correct them and deal with the consequences\n- Evaluate the need for action to eliminate the root cause(s) so the nonconformity does not recur or occur elsewhere\n- Implement corrective actions appropriate to the effects of the nonconformities encountered\n- Review the effectiveness of corrective actions taken\n- Retain documented information as evidence of the nature of nonconformities, actions taken, and results of corrective actions\n- Update risks and opportunities determined during planning if necessary",
    "10.3": "- Continually improve the suitability, adequacy, and effectiveness of the QMS\n- Consider the results of analysis and evaluation and the outputs from management review to determine improvement needs\n- Use tools such as PDCA cycles, Lean, Six Sigma, or Kaizen for structured improvement\n- Set improvement targets and track progress through defined metrics\n- Foster a culture of continual improvement by recognizing and rewarding improvement contributions",
  }
  for (const sub of [
    { number: "10.1", title: "General" },
    { number: "10.2", title: "Nonconformity and corrective action" },
    { number: "10.3", title: "Continual improvement" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c10.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Improvement", objective: `Ensure ${sub.title.toLowerCase()}.`, guidance: c10Guidance[sub.number] },
    })
  }

  console.log(`ISO 9001 seeded: ${framework.id}`)
}
