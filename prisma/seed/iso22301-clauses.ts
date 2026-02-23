import { PrismaClient } from "@prisma/client"

// ---------------------------------------------------------------------------
// ISO 22301:2019 -- Business continuity management systems — Requirements
// ---------------------------------------------------------------------------

export async function seedISO22301(prisma: PrismaClient) {
  const framework = await prisma.framework.upsert({
    where: { code: "ISO22301" },
    update: {
      name: "ISO 22301:2019",
      version: "2019",
      status: "PUBLISHED",
    },
    create: {
      code: "ISO22301",
      name: "ISO 22301:2019",
      version: "2019",
      description:
        "Business continuity management systems — Requirements. International standard specifying requirements to plan, establish, implement, operate, monitor, review, maintain and continually improve a business continuity management system (BCMS).",
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

  interface SubClauseDef {
    number: string
    title: string
    description: string
  }

  interface MainClauseDef {
    number: string
    title: string
    description: string
    children: SubClauseDef[]
    controls: ControlDef[]
  }

  const mainClauses: MainClauseDef[] = [
    // ── Clause 4: Context of the organization ─────────────────────────────
    {
      number: "4",
      title: "Context of the organization",
      description:
        "Understanding the organization, its context, the needs and expectations of interested parties, and determining the scope and requirements of the business continuity management system.",
      children: [
        {
          number: "4.1",
          title: "Understanding the organization and its context",
          description:
            "The organization shall determine external and internal issues that are relevant to its purpose and that affect its ability to achieve the intended outcome(s) of its BCMS.",
        },
        {
          number: "4.2",
          title: "Understanding the needs and expectations of interested parties",
          description:
            "The organization shall determine the interested parties that are relevant to the BCMS, their requirements, and applicable legal and regulatory requirements.",
        },
        {
          number: "4.3",
          title: "Determining the scope of the BCMS",
          description:
            "The organization shall determine the boundaries and applicability of the BCMS to establish its scope, considering internal and external issues and requirements of interested parties.",
        },
        {
          number: "4.4",
          title: "Business continuity management system",
          description:
            "The organization shall establish, implement, maintain and continually improve a BCMS, including the processes needed and their interactions, in accordance with the requirements of this document.",
        },
      ],
      controls: [
        {
          number: "4.1-C1",
          title: "Understanding the organization and its context",
          objective:
            "Determine external and internal issues relevant to the organization's purpose and that affect the ability to achieve intended BCMS outcomes.",
          guidance:
            "- Identify external issues such as regulatory, legal, technological, competitive, cultural, social and economic environment\n- Identify internal issues such as organizational culture, capabilities, governance structure and strategic direction\n- Assess the impact of these issues on the BCMS scope and objectives\n- Review and update the context analysis at planned intervals or when significant changes occur\n- Document the results of context analysis and communicate to relevant stakeholders",
        },
        {
          number: "4.2-C1",
          title: "Understanding needs and expectations of interested parties",
          objective:
            "Identify interested parties relevant to the BCMS and determine their requirements including applicable legal, regulatory and contractual obligations.",
          guidance:
            "- Identify all interested parties including customers, employees, regulators, shareholders, suppliers and the community\n- Determine the specific requirements and expectations of each interested party\n- Identify applicable legal, regulatory and contractual obligations related to business continuity\n- Prioritise interested party requirements based on their influence and impact on the BCMS\n- Review interested party requirements periodically and when changes occur",
        },
        {
          number: "4.3-C1",
          title: "Determining the scope of the BCMS",
          objective:
            "Define the boundaries and applicability of the BCMS considering the organization's context, interested party requirements and its products and services.",
          guidance:
            "- Define the scope considering internal and external issues identified in clause 4.1\n- Consider the requirements of interested parties identified in clause 4.2\n- Identify the parts of the organization, locations, products and services included in the scope\n- Document the scope and make it available as documented information\n- Ensure the scope covers all activities, services and products critical to the organization's mission",
        },
        {
          number: "4.4-C1",
          title: "Business continuity management system",
          objective:
            "Establish, implement, maintain and continually improve a BCMS including the processes needed and their interactions in accordance with ISO 22301.",
          guidance:
            "- Define the processes needed for the BCMS and their sequence and interaction\n- Determine the inputs and outputs of each process\n- Assign roles, responsibilities and authorities for each process\n- Address risks and opportunities associated with each process\n- Evaluate the processes and implement changes needed to ensure intended outcomes\n- Maintain and retain documented information to support process operation",
        },
        {
          number: "5.1-C1",
          title: "Leadership commitment",
          objective:
            "Ensure top management demonstrates leadership and commitment with respect to the BCMS by integrating requirements into business processes and providing adequate resources.",
          guidance:
            "- Ensure top management establishes the business continuity policy and objectives compatible with the strategic direction\n- Integrate BCMS requirements into the organization's business processes\n- Ensure adequate resources are available for the BCMS\n- Communicate the importance of effective business continuity management\n- Direct and support persons to contribute to the effectiveness of the BCMS\n- Promote continual improvement of the BCMS",
        },
      ],
    },

    // ── Clause 5: Leadership ──────────────────────────────────────────────
    {
      number: "5",
      title: "Leadership",
      description:
        "Requirements for top management leadership and commitment, establishing the business continuity policy, and assigning organizational roles, responsibilities and authorities.",
      children: [
        {
          number: "5.1",
          title: "Leadership and commitment",
          description:
            "Top management shall demonstrate leadership and commitment with respect to the BCMS by ensuring policies and objectives are established, resources are available, and the BCMS achieves its intended outcomes.",
        },
        {
          number: "5.2",
          title: "Policy",
          description:
            "Top management shall establish a business continuity policy that is appropriate to the purpose of the organization, provides a framework for setting objectives, and includes a commitment to continual improvement.",
        },
        {
          number: "5.3",
          title: "Organizational roles, responsibilities and authorities",
          description:
            "Top management shall ensure that the responsibilities and authorities for relevant roles are assigned and communicated within the organization.",
        },
      ],
      controls: [
        {
          number: "5.1-C2",
          title: "Leadership and commitment",
          objective:
            "Demonstrate top management leadership and commitment by ensuring the BCMS achieves its intended outcomes and promoting continual improvement.",
          guidance:
            "- Ensure the business continuity policy and objectives are established and are compatible with the strategic direction\n- Ensure integration of BCMS requirements into the organization's business processes\n- Ensure resources needed for the BCMS are available\n- Communicate the importance of effective business continuity management and conforming to BCMS requirements\n- Promote continual improvement",
        },
        {
          number: "5.2-C1",
          title: "Management commitment",
          objective:
            "Establish and communicate a business continuity management commitment that is embedded in the organizational culture and governance.",
          guidance:
            "- Ensure management actively participates in BCMS governance meetings and reviews\n- Allocate budget and resources for BCMS implementation and maintenance\n- Visibly champion business continuity initiatives across the organization\n- Include business continuity considerations in strategic decision-making processes\n- Hold management accountable for business continuity performance within their areas of responsibility",
        },
        {
          number: "5.2-C2",
          title: "Business continuity policy",
          objective:
            "Establish a business continuity policy that is appropriate to the purpose of the organization and provides a framework for setting business continuity objectives.",
          guidance:
            "- Develop a policy that is appropriate to the purpose and context of the organization\n- Ensure the policy provides a framework for setting business continuity objectives\n- Include a commitment to satisfy applicable requirements\n- Include a commitment to continual improvement of the BCMS\n- Communicate the policy within the organization and make it available to interested parties as appropriate\n- Review the policy at planned intervals to ensure continued suitability",
        },
        {
          number: "5.3-C1",
          title: "Organizational roles responsibilities and authorities",
          objective:
            "Assign and communicate responsibilities and authorities for relevant BCMS roles to ensure the system conforms to requirements and reports on performance.",
          guidance:
            "- Assign responsibility for ensuring the BCMS conforms to the requirements of ISO 22301\n- Assign responsibility for reporting on BCMS performance to top management\n- Define roles for business continuity coordinators, team leaders and response team members\n- Ensure authorities are sufficient to carry out assigned responsibilities\n- Document and communicate all role assignments and ensure personnel understand their duties",
        },
      ],
    },

    // ── Clause 6: Planning ────────────────────────────────────────────────
    {
      number: "6",
      title: "Planning",
      description:
        "Planning for the BCMS including actions to address risks and opportunities, business continuity objectives and planning to achieve them, and planning of changes.",
      children: [
        {
          number: "6.1",
          title: "Actions to address risks and opportunities",
          description:
            "When planning for the BCMS, the organization shall consider the issues and requirements and determine the risks and opportunities that need to be addressed to ensure the BCMS achieves its intended outcomes.",
        },
        {
          number: "6.2",
          title: "Business continuity objectives and planning to achieve them",
          description:
            "The organization shall establish business continuity objectives at relevant functions, levels and processes, ensuring they are consistent with the policy, measurable, monitored and communicated.",
        },
        {
          number: "6.3",
          title: "Planning of changes",
          description:
            "When the organization determines the need for changes to the BCMS, the changes shall be carried out in a planned manner considering the purpose, consequences, integrity and resource availability.",
        },
      ],
      controls: [
        {
          number: "6.1-C1",
          title: "Actions to address risks and opportunities",
          objective:
            "Determine and plan actions to address risks and opportunities that could affect the BCMS's ability to achieve its intended outcomes.",
          guidance:
            "- Consider external and internal issues from clause 4.1 and interested party requirements from clause 4.2\n- Identify risks that could prevent the BCMS from achieving intended outcomes\n- Identify opportunities for improving the effectiveness of the BCMS\n- Plan actions to address identified risks and opportunities\n- Integrate actions into BCMS processes and evaluate their effectiveness\n- Ensure actions are proportionate to the potential impact on BCMS objectives",
        },
        {
          number: "6.2-C1",
          title: "Business continuity objectives",
          objective:
            "Establish measurable business continuity objectives at relevant functions and levels that are consistent with the business continuity policy.",
          guidance:
            "- Ensure objectives are consistent with the business continuity policy\n- Make objectives measurable where practicable\n- Take into account applicable requirements and results of risk assessments\n- Determine what will be done, what resources are required, who will be responsible, when it will be completed, and how results will be evaluated\n- Monitor, communicate and update objectives as appropriate",
        },
        {
          number: "6.3-C1",
          title: "Planning of changes",
          objective:
            "Ensure changes to the BCMS are carried out in a planned and systematic manner to maintain the integrity of the management system.",
          guidance:
            "- Identify the purpose and potential consequences of any proposed change to the BCMS\n- Assess the impact of the change on the integrity of the BCMS\n- Determine the availability of resources to implement the change\n- Allocate or re-allocate responsibilities and authorities as needed\n- Implement changes in a controlled manner and verify effectiveness",
        },
        {
          number: "6.1-C2",
          title: "Determining and addressing risks",
          objective:
            "Systematically identify, analyse and evaluate risks that could disrupt the organization's prioritised activities and determine appropriate treatment measures.",
          guidance:
            "- Establish a systematic risk identification process covering internal and external threats\n- Analyse the likelihood and consequences of identified risks\n- Evaluate risks against the organization's risk acceptance criteria\n- Determine risk treatment options including avoidance, mitigation, transfer and acceptance\n- Document risk assessment results and communicate to decision-makers\n- Review and update the risk assessment at planned intervals or after significant changes",
        },
      ],
    },

    // ── Clause 7: Support ─────────────────────────────────────────────────
    {
      number: "7",
      title: "Support",
      description:
        "Requirements for resources, competence, awareness, communication and documented information necessary to support the BCMS.",
      children: [
        {
          number: "7.1",
          title: "Resources",
          description:
            "The organization shall determine and provide the resources needed for the establishment, implementation, maintenance and continual improvement of the BCMS.",
        },
        {
          number: "7.2",
          title: "Competence",
          description:
            "The organization shall determine the necessary competence of persons doing work under its control that affects BCMS performance and ensure these persons are competent.",
        },
        {
          number: "7.3",
          title: "Awareness",
          description:
            "Persons doing work under the organization's control shall be aware of the business continuity policy, their contribution to the BCMS, and the implications of not conforming.",
        },
        {
          number: "7.4",
          title: "Communication",
          description:
            "The organization shall determine the need for internal and external communications relevant to the BCMS including what, when, with whom, and how to communicate.",
        },
        {
          number: "7.5",
          title: "Documented information",
          description:
            "The organization's BCMS shall include documented information required by this document and determined by the organization as necessary for BCMS effectiveness.",
        },
      ],
      controls: [
        {
          number: "7.1-C1",
          title: "Resources",
          objective:
            "Determine and provide the resources needed for the establishment, implementation, maintenance and continual improvement of the BCMS.",
          guidance:
            "- Identify resource requirements including personnel, technology, facilities and financial resources\n- Allocate sufficient budget for BCMS activities including training, exercises and maintenance\n- Ensure resources are available for incident response and recovery operations\n- Review resource adequacy at planned intervals and after incidents\n- Address resource gaps through recruitment, training, outsourcing or technology investment",
        },
        {
          number: "7.2-C1",
          title: "Competence",
          objective:
            "Ensure persons doing work under the organization's control that affects BCMS performance are competent on the basis of appropriate education, training or experience.",
          guidance:
            "- Determine the necessary competence of persons involved in BCMS activities\n- Ensure competence through education, training or experience\n- Where applicable, take actions to acquire the necessary competence and evaluate the effectiveness of those actions\n- Maintain records of competence including qualifications, training and experience\n- Identify and address competence gaps through targeted development programmes",
        },
        {
          number: "7.3-C1",
          title: "Awareness",
          objective:
            "Ensure persons doing work under the organization's control are aware of the business continuity policy, their roles, and the implications of not conforming to BCMS requirements.",
          guidance:
            "- Communicate the business continuity policy to all relevant personnel\n- Ensure personnel understand their contribution to the effectiveness of the BCMS\n- Ensure personnel understand the implications of not conforming to BCMS requirements\n- Conduct regular awareness campaigns and briefings on business continuity\n- Include business continuity awareness in new employee induction programmes",
        },
        {
          number: "7.4-C1",
          title: "Communication",
          objective:
            "Determine and implement internal and external communication processes relevant to the BCMS including what, when, with whom and how to communicate.",
          guidance:
            "- Determine what needs to be communicated about the BCMS internally and externally\n- Determine when communications should occur including during normal operations and incidents\n- Identify the audiences for each type of communication\n- Establish communication methods and channels including backup communication systems\n- Ensure communication procedures are tested during exercises\n- Include procedures for communicating with media, regulators and other external stakeholders during incidents",
        },
        {
          number: "7.5-C1",
          title: "Documented information",
          objective:
            "Maintain and control documented information required by ISO 22301 and determined by the organization as necessary for BCMS effectiveness.",
          guidance:
            "- Identify the documented information required by ISO 22301 and any additional documentation needed\n- Ensure documented information is appropriately identified, described, formatted and reviewed\n- Ensure documented information is available and suitable for use where and when it is needed\n- Protect documented information from loss of confidentiality, improper use or loss of integrity\n- Control the distribution, access, retrieval, storage, preservation and disposition of documented information\n- Maintain version control and ensure obsolete documents are appropriately managed",
        },
      ],
    },

    // ── Clause 8: Operation ───────────────────────────────────────────────
    {
      number: "8",
      title: "Operation",
      description:
        "Operational planning and control, business impact analysis and risk assessment, business continuity strategies and solutions, business continuity plans and procedures, and the exercise programme.",
      children: [
        {
          number: "8.1",
          title: "Operational planning and control",
          description:
            "The organization shall plan, implement and control the processes needed to meet BCMS requirements and implement actions to address risks and opportunities.",
        },
        {
          number: "8.2",
          title: "Business impact analysis and risk assessment",
          description:
            "The organization shall implement and maintain a business impact analysis and risk assessment process that establishes the context, identifies and analyses the impacts of disruptions.",
        },
        {
          number: "8.3",
          title: "Business continuity strategies and solutions",
          description:
            "The organization shall identify and select business continuity strategies and solutions based on outputs from the BIA and risk assessment to protect prioritised activities.",
        },
        {
          number: "8.4",
          title: "Business continuity plans and procedures",
          description:
            "The organization shall establish and implement business continuity plans and procedures to manage disruptions and continue or recover its prioritised activities.",
        },
        {
          number: "8.5",
          title: "Exercise programme",
          description:
            "The organization shall implement and maintain an exercise programme that validates the consistency of business continuity plans and procedures with the BCMS objectives.",
        },
      ],
      controls: [
        {
          number: "8.1-C1",
          title: "Operational planning and control",
          objective:
            "Plan, implement and control the processes needed to meet BCMS requirements by establishing criteria, implementing control of processes, and maintaining documented information.",
          guidance:
            "- Establish criteria for BCMS processes based on the business continuity policy and objectives\n- Implement control of processes in accordance with the established criteria\n- Control planned changes and review the consequences of unintended changes\n- Ensure outsourced processes are controlled and monitored\n- Maintain documented information to demonstrate that processes have been carried out as planned",
        },
        {
          number: "8.2-C1",
          title: "Business impact analysis",
          objective:
            "Implement and maintain a formal business impact analysis process to identify prioritised activities, assess impacts of disruption, and set recovery timeframes.",
          guidance:
            "- Identify all activities that support the delivery of key products and services\n- Determine the impact of disruption to each activity over time\n- Set prioritised timeframes for resuming activities (RTO, RPO)\n- Identify dependencies including suppliers, partners, and resources\n- Document the BIA results and communicate to senior management",
        },
        {
          number: "8.2-C2",
          title: "Risk assessment",
          objective:
            "Implement and maintain a systematic process of risk assessment to identify, analyse and evaluate the risk of disruptive incidents to the organization's prioritised activities.",
          guidance:
            "- Identify risks of disruption to the organization's prioritised activities and their resources\n- Analyse risks systematically considering likelihood and impact\n- Evaluate risks against the organization's risk criteria and tolerance levels\n- Determine which risks require treatment through business continuity strategies\n- Document the risk assessment methodology, results and treatment decisions\n- Review the risk assessment at planned intervals or after significant changes",
        },
        {
          number: "8.3-C1",
          title: "Business continuity strategy and solutions",
          objective:
            "Identify and select appropriate business continuity strategies and solutions to protect prioritised activities, manage impacts and continue operations during disruptions.",
          guidance:
            "- Identify strategies to protect prioritised activities based on BIA and risk assessment outputs\n- Consider strategies for before, during and after a disruption\n- Evaluate resource requirements for each strategy including people, information, technology, facilities and supplies\n- Select strategies that meet the recovery time and recovery point objectives\n- Obtain approval from top management for the selected strategies and required resources\n- Implement solutions that address identified dependencies and single points of failure",
        },
        {
          number: "8.4-C1",
          title: "Business continuity plans and procedures",
          objective:
            "Establish, implement and maintain business continuity plans and procedures that provide a framework for managing disruptions and recovering prioritised activities.",
          guidance:
            "- Define the purpose, scope and objectives of each business continuity plan\n- Establish roles, responsibilities and authorities for personnel involved in response and recovery\n- Include activation and escalation procedures with defined trigger criteria\n- Document detailed response and recovery procedures for each prioritised activity\n- Include internal and external communication procedures for use during a disruption\n- Ensure plans are accessible during a disruption including when primary systems are unavailable",
        },
        {
          number: "8.5-C1",
          title: "Exercise programme",
          objective:
            "Implement and maintain an exercise programme to validate business continuity plans and procedures, identify improvements, and build team competence.",
          guidance:
            "- Develop an exercise programme that covers all critical business continuity plans over a defined cycle\n- Use a variety of exercise types including tabletop, simulation, and full-scale exercises\n- Define clear objectives, scope and scenarios for each exercise\n- Conduct exercises at planned intervals and after significant changes to the organization\n- Document exercise results including lessons learned and corrective actions\n- Update business continuity plans and procedures based on exercise outcomes",
        },
        {
          number: "8.4-C2",
          title: "Evaluation of business continuity documentation",
          objective:
            "Evaluate business continuity documentation for completeness, accuracy and alignment with the organization's BCMS objectives and the outputs of the BIA and risk assessment.",
          guidance:
            "- Review business continuity plans for completeness against ISO 22301 requirements\n- Verify that plans accurately reflect current organizational structure and processes\n- Ensure plans are consistent with BIA and risk assessment outputs\n- Validate that recovery time objectives and recovery point objectives are achievable\n- Ensure plans are reviewed and approved by appropriate management personnel",
        },
        {
          number: "8.4-C3",
          title: "Business continuity response structure",
          objective:
            "Establish a response structure that enables timely warning, communication, activation and coordination during a disruptive incident.",
          guidance:
            "- Define a clear incident response structure with roles, responsibilities and authorities\n- Establish procedures for assessing the nature and extent of a disruptive incident\n- Define activation and escalation thresholds for different levels of response\n- Establish communication protocols for internal and external stakeholders during an incident\n- Ensure the response structure integrates with relevant emergency services and authorities\n- Test the response structure regularly through exercises and update based on lessons learned",
        },
      ],
    },

    // ── Clause 9: Performance evaluation ──────────────────────────────────
    {
      number: "9",
      title: "Performance evaluation",
      description:
        "Monitoring, measurement, analysis and evaluation of the BCMS, internal audit, and management review to assess performance and effectiveness.",
      children: [
        {
          number: "9.1",
          title: "Monitoring, measurement, analysis and evaluation",
          description:
            "The organization shall determine what needs to be monitored and measured, the methods for monitoring, when monitoring and measuring shall be performed, and when results shall be analysed and evaluated.",
        },
        {
          number: "9.2",
          title: "Internal audit",
          description:
            "The organization shall conduct internal audits at planned intervals to provide information on whether the BCMS conforms to requirements and is effectively implemented and maintained.",
        },
        {
          number: "9.3",
          title: "Management review",
          description:
            "Top management shall review the BCMS at planned intervals to ensure its continuing suitability, adequacy and effectiveness.",
        },
      ],
      controls: [
        {
          number: "9.1-C1",
          title: "Monitoring measurement analysis and evaluation",
          objective:
            "Determine what needs to be monitored and measured, establish methods, and evaluate BCMS performance and effectiveness at planned intervals.",
          guidance:
            "- Determine what aspects of the BCMS need to be monitored and measured\n- Define methods for monitoring, measurement, analysis and evaluation to ensure valid results\n- Determine when monitoring and measuring shall be performed\n- Determine when results shall be analysed and evaluated\n- Evaluate the performance and effectiveness of the BCMS against policy and objectives\n- Retain documented information as evidence of monitoring and measurement results",
        },
        {
          number: "9.2-C1",
          title: "Internal audit",
          objective:
            "Conduct internal audits at planned intervals to determine whether the BCMS conforms to planned arrangements, ISO 22301 requirements, and is effectively implemented and maintained.",
          guidance:
            "- Plan, establish, implement and maintain an audit programme including frequency, methods, responsibilities and reporting\n- Define audit criteria and scope for each audit\n- Select auditors who are objective and impartial for the process being audited\n- Ensure audit results are reported to relevant management\n- Take appropriate corrective actions without undue delay to address nonconformities\n- Retain documented information as evidence of audit programme implementation and audit results",
        },
        {
          number: "9.3-C1",
          title: "Management review",
          objective:
            "Conduct management reviews at planned intervals to ensure the BCMS's continuing suitability, adequacy and effectiveness.",
          guidance:
            "- Review the status of actions from previous management reviews\n- Consider changes in external and internal issues relevant to the BCMS\n- Review information on BCMS performance including nonconformities, audit results, and exercise outcomes\n- Evaluate opportunities for continual improvement\n- Determine if changes are needed to the BCMS including policy, objectives, and resources\n- Retain documented information as evidence of management review results and decisions",
        },
        {
          number: "9.1-C2",
          title: "Evaluation of business continuity procedures",
          objective:
            "Evaluate the procedures and capabilities of the BCMS to ensure they remain consistent with business continuity objectives.",
          guidance:
            "- Evaluate business continuity procedures against the outputs of the BIA and risk assessment\n- Assess whether procedures are still appropriate following organizational or environmental changes\n- Review the results of exercises and real incidents to identify procedure gaps\n- Verify that procedures meet the recovery time and recovery point objectives\n- Update procedures based on evaluation findings and communicate changes to relevant personnel",
        },
      ],
    },

    // ── Clause 10: Improvement ────────────────────────────────────────────
    {
      number: "10",
      title: "Improvement",
      description:
        "Requirements for addressing nonconformities, taking corrective actions, and driving continual improvement of the BCMS suitability, adequacy and effectiveness.",
      children: [
        {
          number: "10.1",
          title: "Nonconformity and corrective action",
          description:
            "When a nonconformity occurs, the organization shall react, evaluate the need for action to eliminate the causes, implement corrective actions, review effectiveness, and make changes to the BCMS if necessary.",
        },
        {
          number: "10.2",
          title: "Continual improvement",
          description:
            "The organization shall continually improve the suitability, adequacy and effectiveness of the BCMS.",
        },
      ],
      controls: [
        {
          number: "10.1-C1",
          title: "Nonconformity and corrective action",
          objective:
            "React to nonconformities, evaluate the need for action to eliminate root causes, implement corrective actions and review their effectiveness.",
          guidance:
            "- React to nonconformities by taking action to control and correct them and deal with the consequences\n- Evaluate the need for action to eliminate the root cause so the nonconformity does not recur or occur elsewhere\n- Implement corrective actions appropriate to the effects of the nonconformities encountered\n- Review the effectiveness of corrective actions taken\n- Make changes to the BCMS if necessary\n- Retain documented information as evidence of the nature of nonconformities, actions taken and results of corrective actions",
        },
        {
          number: "10.2-C1",
          title: "Continual improvement",
          objective:
            "Continually improve the suitability, adequacy and effectiveness of the BCMS through the use of policy, objectives, audit results, analysis of data, corrective actions and management review.",
          guidance:
            "- Use the business continuity policy and objectives as drivers for improvement\n- Analyse monitoring, measurement and audit results to identify improvement opportunities\n- Implement improvements identified through exercises, incidents and management reviews\n- Benchmark against industry best practices and emerging standards\n- Track and measure the effectiveness of improvement initiatives",
        },
        {
          number: "10.2-C2",
          title: "Preventive actions",
          objective:
            "Proactively identify potential nonconformities and opportunities for improvement to prevent issues from occurring and enhance BCMS effectiveness.",
          guidance:
            "- Analyse trends in monitoring data, audit findings and incident reports to identify potential issues\n- Conduct proactive risk assessments to identify emerging threats and vulnerabilities\n- Implement preventive measures before potential nonconformities materialise\n- Share lessons learned across the organization to prevent recurrence in different areas\n- Review the effectiveness of preventive actions and adjust the approach as needed",
        },
      ],
    },
  ]

  let sortOrder = 0

  for (const main of mainClauses) {
    const parentClause = await prisma.clause.create({
      data: {
        frameworkId: fwId,
        number: main.number,
        title: main.title,
        description: main.description,
        isAnnex: false,
        sortOrder: sortOrder++,
      },
    })

    for (const sub of main.children) {
      await prisma.clause.create({
        data: {
          frameworkId: fwId,
          parentId: parentClause.id,
          number: sub.number,
          title: sub.title,
          description: sub.description,
          isAnnex: false,
          sortOrder: sortOrder++,
        },
      })
    }

    for (const ctrl of main.controls) {
      const ctrlClause = await prisma.clause.create({
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
          clauseId: ctrlClause.id,
          number: ctrl.number,
          title: ctrl.title,
          category: "BCMS",
          objective: ctrl.objective,
          guidance: ctrl.guidance,
        },
      })
    }
  }

  const clauseCount = await prisma.clause.count({ where: { frameworkId: fwId } })
  const controlCount = await prisma.control.count({ where: { clause: { frameworkId: fwId } } })

  console.log(`[seed] ISO 22301:2019 seeded -- ${clauseCount} clauses, ${controlCount} controls`)
}
