import { PrismaClient } from "@prisma/client"

export async function seedISO9001(prisma: PrismaClient) {
  const existing = await prisma.framework.findUnique({ where: { code: "ISO9001" } })
  if (existing) {
    console.log("ISO 9001 already seeded, skipping...")
    return
  }

  const framework = await prisma.framework.create({
    data: {
      code: "ISO9001",
      name: "ISO 9001:2015",
      version: "2015",
      description: "Quality management systems — Requirements",
      status: "PUBLISHED",
    },
  })

  const fId = framework.id

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
  for (const sub of c4Subs) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c4.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "QMS Context", objective: `Ensure the organization addresses ${sub.title.toLowerCase()}.` },
    })
  }

  // Clause 5: Leadership
  const c5 = await prisma.clause.create({
    data: { frameworkId: fId, number: "5", title: "Leadership", sortOrder: 5 },
  })
  const c51 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c5.id, number: "5.1", title: "Leadership and commitment", sortOrder: 51 },
  })
  for (const sub of [
    { number: "5.1.1", title: "General" },
    { number: "5.1.2", title: "Customer focus" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c51.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Leadership", objective: `Leadership commitment regarding ${sub.title.toLowerCase()}.` },
    })
  }
  const c52 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c5.id, number: "5.2", title: "Policy", sortOrder: 52 },
  })
  for (const sub of [
    { number: "5.2.1", title: "Establishing the quality policy" },
    { number: "5.2.2", title: "Communicating the quality policy" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c52.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Leadership", objective: `Ensure ${sub.title.toLowerCase()}.` },
    })
  }
  const c53Clause = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c5.id, number: "5.3", title: "Organizational roles, responsibilities and authorities", sortOrder: 53 },
  })
  await prisma.control.create({
    data: { clauseId: c53Clause.id, number: "5.3", title: "Organizational roles, responsibilities and authorities", category: "Leadership", objective: "Ensure relevant roles, responsibilities and authorities are assigned, communicated and understood." },
  })

  // Clause 6: Planning
  const c6 = await prisma.clause.create({
    data: { frameworkId: fId, number: "6", title: "Planning", sortOrder: 6 },
  })
  for (const sub of [
    { number: "6.1", title: "Actions to address risks and opportunities" },
    { number: "6.2", title: "Quality objectives and planning to achieve them" },
    { number: "6.3", title: "Planning of changes" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c6.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Planning", objective: `Address ${sub.title.toLowerCase()}.` },
    })
  }

  // Clause 7: Support
  const c7 = await prisma.clause.create({
    data: { frameworkId: fId, number: "7", title: "Support", sortOrder: 7 },
  })
  const c71 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c7.id, number: "7.1", title: "Resources", sortOrder: 71 },
  })
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
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Support", objective: `Manage ${sub.title.toLowerCase()} effectively.` },
    })
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
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Support", objective: `Ensure ${sub.title.toLowerCase()} is managed.` },
    })
  }
  const c75 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c7.id, number: "7.5", title: "Documented information", sortOrder: 75 },
  })
  for (const sub of [
    { number: "7.5.1", title: "General" },
    { number: "7.5.2", title: "Creating and updating" },
    { number: "7.5.3", title: "Control of documented information" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c75.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Support", objective: `Manage documented information: ${sub.title.toLowerCase()}.` },
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
    data: { clauseId: c81Clause.id, number: "8.1", title: "Operational planning and control", category: "Operation", objective: "Plan, implement and control processes needed to meet requirements." },
  })

  const c82 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c8.id, number: "8.2", title: "Requirements for products and services", sortOrder: 82 },
  })
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
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Operation", objective: `Ensure ${sub.title.toLowerCase()}.` },
    })
  }

  const c83 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c8.id, number: "8.3", title: "Design and development of products and services", sortOrder: 83 },
  })
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
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Operation", objective: `Manage ${sub.title.toLowerCase()}.` },
    })
  }

  const c84 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c8.id, number: "8.4", title: "Control of externally provided processes, products and services", sortOrder: 84 },
  })
  for (const sub of [
    { number: "8.4.1", title: "General" },
    { number: "8.4.2", title: "Type and extent of control" },
    { number: "8.4.3", title: "Information for external providers" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c84.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Operation", objective: `Control externally provided: ${sub.title.toLowerCase()}.` },
    })
  }

  const c85 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c8.id, number: "8.5", title: "Production and service provision", sortOrder: 85 },
  })
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
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Operation", objective: `Ensure ${sub.title.toLowerCase()}.` },
    })
  }

  const c86Clause = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c8.id, number: "8.6", title: "Release of products and services", sortOrder: 86 },
  })
  await prisma.control.create({
    data: { clauseId: c86Clause.id, number: "8.6", title: "Release of products and services", category: "Operation", objective: "Implement planned arrangements to verify that product and service requirements have been met." },
  })
  const c87Clause = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c8.id, number: "8.7", title: "Control of nonconforming outputs", sortOrder: 87 },
  })
  await prisma.control.create({
    data: { clauseId: c87Clause.id, number: "8.7", title: "Control of nonconforming outputs", category: "Operation", objective: "Ensure outputs not conforming to requirements are identified and controlled." },
  })

  // Clause 9: Performance evaluation
  const c9 = await prisma.clause.create({
    data: { frameworkId: fId, number: "9", title: "Performance evaluation", sortOrder: 9 },
  })
  const c91 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c9.id, number: "9.1", title: "Monitoring, measurement, analysis and evaluation", sortOrder: 91 },
  })
  for (const sub of [
    { number: "9.1.1", title: "General" },
    { number: "9.1.2", title: "Customer satisfaction" },
    { number: "9.1.3", title: "Analysis and evaluation" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c91.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Performance Evaluation", objective: `Ensure ${sub.title.toLowerCase()}.` },
    })
  }

  const c92 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c9.id, number: "9.2", title: "Internal audit", sortOrder: 92 },
  })
  for (const sub of [
    { number: "9.2.1", title: "General" },
    { number: "9.2.2", title: "Audit programme" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c92.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Performance Evaluation", objective: `Internal audit: ${sub.title.toLowerCase()}.` },
    })
  }

  const c93 = await prisma.clause.create({
    data: { frameworkId: fId, parentId: c9.id, number: "9.3", title: "Management review", sortOrder: 93 },
  })
  for (const sub of [
    { number: "9.3.1", title: "General" },
    { number: "9.3.2", title: "Management review inputs" },
    { number: "9.3.3", title: "Management review outputs" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c93.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Performance Evaluation", objective: `Management review: ${sub.title.toLowerCase()}.` },
    })
  }

  // Clause 10: Improvement
  const c10 = await prisma.clause.create({
    data: { frameworkId: fId, number: "10", title: "Improvement", sortOrder: 10 },
  })
  for (const sub of [
    { number: "10.1", title: "General" },
    { number: "10.2", title: "Nonconformity and corrective action" },
    { number: "10.3", title: "Continual improvement" },
  ]) {
    const clause = await prisma.clause.create({
      data: { frameworkId: fId, parentId: c10.id, number: sub.number, title: sub.title, sortOrder: parseFloat(sub.number) * 10 },
    })
    await prisma.control.create({
      data: { clauseId: clause.id, number: sub.number, title: sub.title, category: "Improvement", objective: `Ensure ${sub.title.toLowerCase()}.` },
    })
  }

  console.log(`ISO 9001 seeded: ${framework.id}`)
}
