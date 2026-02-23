import { PrismaClient } from "@prisma/client"

// ---------------------------------------------------------------------------
// PCI DSS v4.0 -- Payment Card Industry Data Security Standard
// ---------------------------------------------------------------------------

export async function seedPCIDSS(prisma: PrismaClient) {
  const framework = await prisma.framework.upsert({
    where: { code: "PCIDSS" },
    update: {
      name: "PCI DSS v4.0",
      version: "4.0",
      status: "PUBLISHED",
    },
    create: {
      code: "PCIDSS",
      name: "PCI DSS v4.0",
      version: "4.0",
      description:
        "Payment Card Industry Data Security Standard — A set of security standards designed to ensure that all companies that accept, process, store or transmit credit card information maintain a secure environment. PCI DSS v4.0 provides a baseline of technical and operational requirements to protect payment account data.",
      status: "PUBLISHED",
    },
  })

  const fwId = framework.id

  // Delete existing clauses so the seed is idempotent.
  // Controls are cascade-deleted when their parent clause is removed.
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

  interface GoalDef {
    number: string
    title: string
    description: string
    category: string
    requirements: ClauseDef[]
  }

  const goals: GoalDef[] = [
    // ── Goal 1: Build and Maintain a Secure Network and Systems ────────
    {
      number: "G1",
      title: "Build and Maintain a Secure Network and Systems",
      description:
        "Establish and maintain network security controls and secure configurations to protect cardholder data environments from unauthorized access and compromise.",
      category: "Network Security",
      requirements: [
        {
          number: "1",
          title: "Install and Maintain Network Security Controls",
          description:
            "Network security controls (NSCs) such as firewalls and other network security technologies are network policy enforcement points that typically control network traffic between two or more logical or physical network segments based on pre-defined policies or rules.",
          category: "Network Security",
          controls: [
            {
              number: "1.1",
              title: "Processes and mechanisms for network security controls are defined and understood",
              objective:
                "Ensure that network security control processes and mechanisms are formally defined, documented, kept up to date, and known to all affected parties.",
              guidance: [
                "- Review and document all network security control policies and procedures at least annually",
                "- Assign clear roles and responsibilities for managing network security controls",
                "- Ensure all personnel acknowledge and understand their responsibilities related to network security",
                "- Maintain a current list of all network security control technologies in use",
                "- Establish a formal change management process for network security control modifications",
              ].join("\n"),
            },
            {
              number: "1.2",
              title: "Network security controls are configured and maintained",
              objective:
                "Ensure that network security controls such as firewalls, routers, and other filtering technologies are properly configured to restrict traffic between trusted and untrusted networks.",
              guidance: [
                "- Configure firewalls and routers to deny all inbound and outbound traffic not explicitly permitted",
                "- Implement stateful inspection or application-level firewalls for all connections",
                "- Review firewall and router rule sets at least every six months",
                "- Ensure all configuration standards for network security controls are documented and aligned with industry best practices",
                "- Remove or disable any insecure services, protocols, or ports that are not required for business purposes",
              ].join("\n"),
            },
            {
              number: "1.3",
              title: "Network access to and from the cardholder data environment is restricted",
              objective:
                "Restrict inbound and outbound traffic to only that which is necessary for the cardholder data environment, and deny all other traffic by default.",
              guidance: [
                "- Implement a DMZ to limit inbound traffic to only system components that provide authorized publicly accessible services",
                "- Restrict inbound internet traffic to IP addresses within the DMZ",
                "- Implement anti-spoofing measures to detect and block forged source IP addresses",
                "- Do not allow unauthorized outbound traffic from the cardholder data environment to the internet",
                "- Permit only established connections into the internal network",
                "- Place system components that store cardholder data in an internal network zone segregated from the DMZ and other untrusted networks",
              ].join("\n"),
            },
            {
              number: "1.4",
              title: "Network connections between trusted and untrusted networks are controlled",
              objective:
                "Control network connections and traffic flows between trusted and untrusted networks using defined security policies and network segmentation.",
              guidance: [
                "- Install personal firewall software or equivalent functionality on all portable computing devices that connect to the internet outside the network and are used to access the CDE",
                "- Ensure personal firewalls are configured to specific standards and are not alterable by end users",
                "- Ensure firewall and router configurations restrict connections between untrusted networks and any system components in the cardholder data environment",
                "- Document and implement network segmentation to isolate the CDE from all other networks",
              ].join("\n"),
            },
            {
              number: "1.5",
              title: "Risks to the CDE from computing devices that connect to untrusted networks are mitigated",
              objective:
                "Ensure that computing devices connecting to both untrusted networks and the CDE have appropriate controls to prevent threats from being introduced into the entity's network.",
              guidance: [
                "- Implement personal firewall or equivalent functionality on portable devices used outside the corporate network",
                "- Ensure security controls are active and cannot be disabled by device users",
                "- Verify that security controls are automatically applied when devices connect to untrusted networks",
                "- Define policies governing the use of devices that connect to both trusted and untrusted networks",
              ].join("\n"),
            },
            {
              number: "1.6",
              title: "Network security control diagrams and documentation are maintained",
              objective:
                "Maintain up-to-date network diagrams that identify all connections between the cardholder data environment, wireless networks, and all other networks including documentation of all security controls.",
              guidance: [
                "- Create and maintain current network diagrams that show all connections to cardholder data, including wireless networks",
                "- Ensure diagrams identify the location of all network security controls between trusted and untrusted networks",
                "- Keep diagrams up to date following any network changes",
                "- Review diagrams at least annually and after any significant network changes",
                "- Document all data flows of cardholder data across systems and networks",
              ].join("\n"),
            },
          ],
        },
        {
          number: "2",
          title: "Apply Secure Configurations to All System Components",
          description:
            "Malicious individuals often use vendor-supplied default passwords and other default settings to compromise systems. These passwords and settings are well known among attacker communities and are easily determined via public information.",
          category: "Network Security",
          controls: [
            {
              number: "2.1",
              title: "Processes and mechanisms for secure configurations are defined and understood",
              objective:
                "Ensure that processes for applying secure configurations to all system components are formally defined, documented, and understood by all relevant personnel.",
              guidance: [
                "- Document configuration standards for all system components that address all known security vulnerabilities",
                "- Assign ownership and accountability for maintaining secure configuration standards",
                "- Review and update configuration standards at least annually or when significant changes occur",
                "- Ensure configuration standards are consistent with industry-accepted hardening standards from CIS, NIST, or vendor recommendations",
                "- Communicate configuration standards to all system administrators and relevant personnel",
              ].join("\n"),
            },
            {
              number: "2.2",
              title: "System components are configured and managed securely",
              objective:
                "Develop configuration standards for all system components that are consistent with industry-accepted hardening standards to address all known security vulnerabilities.",
              guidance: [
                "- Implement only one primary function per server to prevent functions requiring different security levels from co-existing on the same server",
                "- Enable only necessary services, protocols, daemons, and functions required for the operation of the system",
                "- Implement additional security features for any required services, protocols, or daemons that are considered insecure",
                "- Configure system security parameters to prevent misuse",
                "- Remove all unnecessary functionality such as scripts, drivers, features, subsystems, file systems, and web servers",
                "- Document and apply hardening standards before deploying systems to production",
              ].join("\n"),
            },
            {
              number: "2.3",
              title: "Wireless environments are configured and managed securely",
              objective:
                "Ensure that all wireless environments connected to the cardholder data environment or transmitting cardholder data are properly configured with strong encryption, authentication, and security controls.",
              guidance: [
                "- Change vendor-supplied default wireless encryption keys, passwords, and SNMP community strings at installation",
                "- Implement strong encryption such as WPA3 or WPA2-Enterprise for authentication and transmission over wireless networks",
                "- Disable wireless vendor defaults including default SSID broadcast names and default passwords",
                "- Implement a wireless analyzer at least quarterly to identify and investigate all authorized and unauthorized wireless access points",
                "- Maintain an inventory of all authorized wireless access points including documented business justification",
              ].join("\n"),
            },
            {
              number: "2.4",
              title: "Default passwords and settings are changed before deployment",
              objective:
                "Always change vendor-supplied defaults and remove or disable unnecessary default accounts before installing a system on the network.",
              guidance: [
                "- Change all vendor-supplied default passwords including operating systems, security software, application accounts, POS terminals, payment applications, and SNMP community strings",
                "- Remove or disable all unnecessary default accounts before production deployment",
                "- Maintain an inventory of all vendor-supplied defaults and verify they are changed prior to system deployment",
                "- Ensure default SNMP community strings are changed and simple network management protocol is configured securely",
              ].join("\n"),
            },
            {
              number: "2.5",
              title: "Vendor default accounts are managed and secured",
              objective:
                "Manage and secure all default vendor accounts on system components, including disabling accounts that are not needed and changing default credentials on accounts that must remain active.",
              guidance: [
                "- Inventory all vendor-supplied default accounts on all system components",
                "- Disable or remove default accounts that are not needed for system operation",
                "- Change default passwords for all vendor-supplied accounts that must remain active",
                "- Monitor default vendor accounts for unauthorized use or configuration changes",
                "- Include default account management in the system deployment checklist",
              ].join("\n"),
            },
            {
              number: "2.6",
              title: "System hardening standards are applied consistently",
              objective:
                "Ensure that system hardening standards based on industry-accepted sources are consistently applied across all system components in the cardholder data environment.",
              guidance: [
                "- Develop and maintain system hardening baselines derived from CIS Benchmarks, NIST, or vendor security recommendations",
                "- Validate that hardening baselines are applied to all new system deployments before production use",
                "- Perform periodic compliance checks to verify system configurations have not drifted from established baselines",
                "- Automate configuration management and drift detection where possible using tools such as configuration management databases or automated scanners",
                "- Remediate any deviations from hardening standards within defined timeframes based on risk severity",
              ].join("\n"),
            },
          ],
        },
      ],
    },

    // ── Goal 2: Protect Account Data ──────────────────────────────────
    {
      number: "G2",
      title: "Protect Account Data",
      description:
        "Protect stored account data and cardholder data with strong cryptography during transmission over open, public networks to prevent unauthorized disclosure and use.",
      category: "Data Protection",
      requirements: [
        {
          number: "3",
          title: "Protect Stored Account Data",
          description:
            "Protection methods such as encryption, truncation, masking, and hashing are critical components of cardholder data protection. If an intruder circumvents other security controls and gains access to encrypted data, the data is unreadable without the proper cryptographic keys.",
          category: "Data Protection",
          controls: [
            {
              number: "3.1",
              title: "Processes and mechanisms for protecting stored account data are defined and understood",
              objective:
                "Ensure that processes for protecting stored account data are formally defined, documented, kept up to date, and known to all affected parties.",
              guidance: [
                "- Document and maintain a data retention and disposal policy that limits storage amount and retention time to what is required for business, legal, and regulatory purposes",
                "- Define and communicate procedures for secure deletion of cardholder data when no longer needed",
                "- Assign clear roles and responsibilities for data protection processes",
                "- Review and update data protection policies and procedures at least annually",
              ].join("\n"),
            },
            {
              number: "3.2",
              title: "Storage of account data is kept to a minimum",
              objective:
                "Keep cardholder data storage to a minimum by implementing data retention and disposal policies, processes, and procedures that limit storage amount and retention time.",
              guidance: [
                "- Implement an automated process to identify and securely delete stored cardholder data exceeding defined retention periods",
                "- Define the retention period for each data store containing cardholder data and document the business justification",
                "- Ensure sensitive authentication data is not stored after authorization, even if encrypted",
                "- Remove or render unrecoverable any stored data that exceeds the defined retention period at least quarterly",
                "- Verify that all locations of stored cardholder data are included in data retention and disposal processes",
              ].join("\n"),
            },
            {
              number: "3.3",
              title: "Sensitive authentication data (SAD) is not stored after authorization",
              objective:
                "Do not store sensitive authentication data after authorization, even if encrypted. Sensitive authentication data includes full track data, card verification codes/values, and PINs/PIN blocks.",
              guidance: [
                "- Implement controls to prevent storage of full track data from the magnetic stripe or chip after authorization",
                "- Ensure card verification codes or values (CVV2, CVC2, CID, CAV2) are not stored after authorization",
                "- Ensure PINs and encrypted PIN blocks are not stored after authorization",
                "- Implement automated mechanisms to detect and alert on unauthorized SAD storage",
                "- Include SAD storage checks in regular security testing and code reviews",
              ].join("\n"),
            },
            {
              number: "3.4",
              title: "Access to displays of full PAN and ability to copy cardholder data are restricted",
              objective:
                "Mask PAN when displayed so that only personnel with a legitimate business need can see more than the first six and last four digits of the PAN. Restrict copying and relocation of cardholder data.",
              guidance: [
                "- Mask PAN when displayed, showing at most the first six and last four digits, with business justification for any full display",
                "- Implement role-based access controls that restrict full PAN visibility to only personnel with documented business need",
                "- Implement technical controls to prevent unauthorized copying, moving, or storing of PAN data",
                "- Log and monitor all access to full PAN data for anomalous or unauthorized activity",
              ].join("\n"),
            },
            {
              number: "3.5",
              title: "Primary account number (PAN) is secured wherever it is stored",
              objective:
                "Render PAN unreadable anywhere it is stored by using strong cryptography, truncation, tokenization, or one-way hashing with associated key management processes and procedures.",
              guidance: [
                "- Render PAN unreadable using strong cryptographic methods such as AES-256 or equivalent industry-tested algorithms",
                "- Implement and document cryptographic key management processes including key generation, distribution, storage, rotation, and destruction",
                "- Maintain separation of duties between key custodians so that no single person has access to the complete cryptographic key",
                "- Protect stored cryptographic keys against disclosure and misuse, storing keys in the fewest possible locations",
                "- Implement key rotation procedures and replace keys that have reached the end of their defined cryptoperiod",
                "- Document and enforce procedures for secure key destruction when keys are retired or no longer needed",
              ].join("\n"),
            },
            {
              number: "3.6",
              title: "Cryptographic keys used to protect stored account data are secured",
              objective:
                "Fully document and implement all key-management processes and procedures for cryptographic keys used for protection of stored cardholder data, including secure generation, distribution, protection, and periodic rotation.",
              guidance: [
                "- Restrict access to cryptographic keys to the fewest number of custodians necessary",
                "- Store cryptographic keys securely in as few locations as possible using a secure cryptographic device such as an HSM",
                "- Implement split knowledge and dual control procedures for manual key management operations",
                "- Prevent unauthorized substitution of cryptographic keys through access control and integrity verification",
                "- Require key custodians to formally acknowledge their key custodian responsibilities",
                "- Rotate cryptographic keys upon reaching the end of their defined cryptoperiod or when key integrity is suspected to be compromised",
              ].join("\n"),
            },
          ],
        },
        {
          number: "4",
          title: "Protect Cardholder Data with Strong Cryptography During Transmission",
          description:
            "Sensitive information must be encrypted during transmission over open, public networks because it is easy and common for malicious individuals to intercept and/or divert data while in transit.",
          category: "Data Protection",
          controls: [
            {
              number: "4.1",
              title: "Processes and mechanisms for protecting cardholder data in transit are defined and understood",
              objective:
                "Ensure that processes for protecting cardholder data during transmission over open, public networks are formally defined, documented, and known to all affected parties.",
              guidance: [
                "- Document policies and procedures for encrypting cardholder data during transmission over all open, public networks",
                "- Define which networks are considered open and public within the organization's context",
                "- Assign roles and responsibilities for maintaining encryption controls for data in transit",
                "- Review and update encryption policies at least annually or when significant infrastructure changes occur",
              ].join("\n"),
            },
            {
              number: "4.2",
              title: "PAN is protected with strong cryptography during transmission",
              objective:
                "Use strong cryptography and security protocols to safeguard sensitive cardholder data during transmission over open, public networks including the internet, wireless technologies, cellular technologies, and satellite communications.",
              guidance: [
                "- Use only trusted keys and certificates for all transmissions of cardholder data",
                "- Implement TLS 1.2 or higher for all transmissions of cardholder data over open, public networks",
                "- Verify that the certificate is valid, has not expired or been revoked, and matches the domain name of the site being accessed",
                "- Ensure wireless networks transmitting cardholder data use industry best practices for strong encryption and authentication",
                "- Never send unprotected PANs by end-user messaging technologies such as email, instant messaging, SMS, or chat",
                "- Document all trusted keys and certificates and maintain an inventory of their status and expiration dates",
              ].join("\n"),
            },
            {
              number: "4.3",
              title: "Certificates used to safeguard PAN during transmission are confirmed as trusted",
              objective:
                "Ensure that digital certificates used for protecting PAN during transmission over public networks are issued by trusted certificate authorities and are properly validated.",
              guidance: [
                "- Verify that all certificates used for PAN transmission are issued by a recognized trusted certificate authority",
                "- Implement certificate validation procedures that check for expiration, revocation, and correct domain name",
                "- Monitor certificate expiration dates and implement automated alerting for upcoming expirations",
                "- Maintain a certificate inventory that includes issuing CA, expiration date, and associated systems",
              ].join("\n"),
            },
            {
              number: "4.4",
              title: "Wireless networks transmitting cardholder data are encrypted",
              objective:
                "Ensure that all wireless networks connected to or transmitting cardholder data implement strong encryption using industry best practices and do not rely on insecure or deprecated wireless encryption protocols.",
              guidance: [
                "- Implement WPA3 or WPA2-Enterprise with AES encryption for all wireless networks that transmit cardholder data",
                "- Prohibit the use of WEP and other known-insecure wireless encryption protocols",
                "- Implement 802.1X authentication for enterprise wireless networks in the CDE",
                "- Periodically test wireless encryption strength and verify that only approved encryption protocols are in use",
                "- Document all wireless networks that transmit or could transmit cardholder data and ensure each is covered by encryption requirements",
              ].join("\n"),
            },
          ],
        },
      ],
    },

    // ── Goal 3: Maintain a Vulnerability Management Program ───────────
    {
      number: "G3",
      title: "Maintain a Vulnerability Management Program",
      description:
        "Protect all systems and networks from malicious software and maintain secure systems and applications by addressing vulnerabilities through timely patching and secure software development practices.",
      category: "Vulnerability Management",
      requirements: [
        {
          number: "5",
          title: "Protect All Systems and Networks from Malicious Software",
          description:
            "Malicious software, commonly referred to as malware, including viruses, worms, and Trojans, enters the network during many business-approved activities such as employee email and use of the internet, mobile computers, and storage devices, resulting in exploitation of system vulnerabilities.",
          category: "Vulnerability Management",
          controls: [
            {
              number: "5.1",
              title: "Processes and mechanisms for protecting against malware are defined and understood",
              objective:
                "Ensure that processes for protecting all systems and networks from malicious software are formally defined, documented, kept up to date, and known to all affected parties.",
              guidance: [
                "- Document and maintain anti-malware policies and procedures that address deployment, maintenance, and monitoring of anti-malware solutions",
                "- Assign clear roles and responsibilities for anti-malware management across the organization",
                "- Review anti-malware policies at least annually and update them when new threat vectors emerge",
                "- Define procedures for responding to malware detections including containment, eradication, and recovery",
              ].join("\n"),
            },
            {
              number: "5.2",
              title: "Malware is prevented or detected and addressed",
              objective:
                "Deploy anti-malware mechanisms on all systems commonly affected by malicious software, ensuring mechanisms are kept current, perform periodic scans, and generate audit logs.",
              guidance: [
                "- Deploy anti-malware software on all systems commonly affected by malware including servers, workstations, and laptops",
                "- Ensure anti-malware solutions are capable of detecting, removing, and protecting against all known types of malware",
                "- Ensure anti-malware mechanisms are current and actively running, with automatic updates enabled for definitions and engines",
                "- Configure anti-malware solutions to perform periodic scans and real-time scanning of all files from external sources",
                "- Ensure that anti-malware mechanisms generate audit logs and that logs are retained per Requirement 10",
              ].join("\n"),
            },
            {
              number: "5.3",
              title: "Anti-malware mechanisms and processes are active, maintained, and monitored",
              objective:
                "Ensure that anti-malware mechanisms cannot be disabled or altered by users unless specifically authorized on a case-by-case basis with documented management approval for a limited time period.",
              guidance: [
                "- Prevent users from disabling or modifying anti-malware software unless specifically authorized by management for a limited time period",
                "- Implement centralized management for anti-malware solutions to monitor status, enforce policies, and detect tampering",
                "- Configure alerts for anti-malware software that is disabled, out of date, or not functioning properly",
                "- Maintain audit logs of all changes to anti-malware configurations and any instances of disabling",
                "- Periodically verify that anti-malware solutions are operating correctly on all applicable systems",
              ].join("\n"),
            },
            {
              number: "5.4",
              title: "Anti-phishing mechanisms protect users against phishing attacks",
              objective:
                "Implement automated anti-phishing mechanisms to protect personnel against phishing attacks that could compromise cardholder data or system credentials.",
              guidance: [
                "- Deploy email filtering and anti-phishing technologies to detect and block phishing emails before they reach end users",
                "- Implement URL filtering and link analysis to identify and block access to known malicious websites",
                "- Provide regular phishing awareness training to all personnel with simulated phishing exercises",
                "- Implement DMARC, DKIM, and SPF email authentication protocols to prevent email spoofing",
                "- Establish clear procedures for personnel to report suspected phishing attempts",
              ].join("\n"),
            },
            {
              number: "5.5",
              title: "Removable media device controls are implemented",
              objective:
                "Ensure that the use of removable electronic media such as USB drives and portable hard drives is appropriately controlled and does not introduce malware into the CDE.",
              guidance: [
                "- Implement policies governing the use of removable media devices within the cardholder data environment",
                "- Configure systems to automatically scan removable media for malware upon insertion",
                "- Restrict the use of removable media on systems within the CDE to only authorized personnel and devices",
                "- Maintain logs of removable media usage on systems within the CDE",
                "- Consider implementing device control software to whitelist approved removable media devices",
              ].join("\n"),
            },
          ],
        },
        {
          number: "6",
          title: "Develop and Maintain Secure Systems and Software",
          description:
            "Unscrupulous individuals use security vulnerabilities to gain privileged access to systems. Many of these vulnerabilities are fixed by vendor-provided security patches. All critical systems must have the most recently released patches to protect against exploitation.",
          category: "Vulnerability Management",
          controls: [
            {
              number: "6.1",
              title: "Processes and mechanisms for developing and maintaining secure systems and software are defined and understood",
              objective:
                "Ensure that processes for developing, maintaining, and deploying secure systems and software are formally defined, documented, and understood by all relevant parties.",
              guidance: [
                "- Establish and document a process to identify security vulnerabilities using reputable outside sources for vulnerability information",
                "- Assign a risk ranking to newly discovered security vulnerabilities based on industry best practices and potential impact",
                "- Review and update secure development and patching policies at least annually",
                "- Maintain an inventory of all system components and software within the CDE scope",
              ].join("\n"),
            },
            {
              number: "6.2",
              title: "Bespoke and custom software is developed securely",
              objective:
                "Develop all bespoke and custom software securely by incorporating security throughout the software development lifecycle and in accordance with industry standards and best practices.",
              guidance: [
                "- Train developers in secure coding techniques at least annually, including prevention of common coding vulnerabilities aligned with OWASP Top 10",
                "- Develop applications based on secure coding guidelines that address common vulnerabilities such as injection flaws, XSS, CSRF, and broken authentication",
                "- Implement code review processes to verify that code follows secure coding practices before deployment",
                "- Separate development, testing, and production environments with appropriate access controls between them",
                "- Remove development, test, and custom application accounts, user IDs, and passwords before applications are deployed to production",
                "- Review custom code prior to release to production to identify any potential coding vulnerabilities using manual or automated methods",
              ].join("\n"),
            },
            {
              number: "6.3",
              title: "Security vulnerabilities are identified and addressed",
              objective:
                "Address all known security vulnerabilities by installing applicable vendor-supplied security patches within defined timeframes based on vulnerability risk ranking.",
              guidance: [
                "- Install critical security patches within one month of release for all system components in the CDE",
                "- Establish a process to identify and rank all newly discovered security vulnerabilities",
                "- Prioritize patching based on risk ranking, addressing critical and high vulnerabilities first",
                "- Test security patches before deployment in a non-production environment to verify they do not introduce instability",
                "- Maintain records of patch deployment including date applied, patch identifier, and systems patched",
              ].join("\n"),
            },
            {
              number: "6.4",
              title: "Public-facing web applications are protected against attacks",
              objective:
                "Protect public-facing web applications against known attacks by applying web application firewalls, security testing, or equivalent controls that detect and prevent web-based attacks.",
              guidance: [
                "- Install a web application firewall (WAF) in front of all public-facing web applications to detect and prevent web-based attacks",
                "- Ensure WAF rules are updated regularly to address new threats and vulnerabilities",
                "- Review public-facing web applications using manual or automated vulnerability security assessment tools at least annually and after any changes",
                "- Implement an automated technical solution that detects and prevents web-based attacks continuously",
                "- Generate alerts and logs for detected attacks and review them regularly",
              ].join("\n"),
            },
            {
              number: "6.5",
              title: "Changes to all system components are managed securely",
              objective:
                "Implement change control processes for all changes to system components in the production environment, ensuring changes are documented, tested, and approved before deployment.",
              guidance: [
                "- Document the impact of each change and obtain management approval before deployment to production",
                "- Test all changes in a non-production environment before deployment, including validation of security controls",
                "- Implement rollback procedures for all changes to enable recovery in case of failure",
                "- Separate duties between personnel who develop and test changes and those who deploy changes to production",
                "- Ensure that development and test environments are separated from production environments with appropriate access controls",
                "- Remove test data and accounts before production systems become active",
              ].join("\n"),
            },
          ],
        },
      ],
    },

    // ── Goal 4: Implement Strong Access Control Measures ──────────────
    {
      number: "G4",
      title: "Implement Strong Access Control Measures",
      description:
        "Implement strong access control measures to restrict access to cardholder data and system components based on business need to know, unique user identification, and physical security controls.",
      category: "Access Control",
      requirements: [
        {
          number: "7",
          title: "Restrict Access to System Components and Cardholder Data by Business Need to Know",
          description:
            "To ensure critical data can only be accessed by authorized personnel, systems and processes must be in place to limit access based on need to know and according to job responsibilities.",
          category: "Access Control",
          controls: [
            {
              number: "7.1",
              title: "Processes and mechanisms for restricting access are defined and understood",
              objective:
                "Ensure that processes for restricting access to system components and cardholder data by business need to know are formally defined, documented, and known to all affected parties.",
              guidance: [
                "- Define and document an access control policy that covers all system components in the CDE",
                "- Assign ownership for access control policy management and enforcement",
                "- Review and update access control policies at least annually",
                "- Communicate access control requirements to all personnel with system or data access",
              ].join("\n"),
            },
            {
              number: "7.2",
              title: "Access to system components and data is appropriately defined and assigned",
              objective:
                "Establish an access control model that restricts access based on business need to know and is set to deny all access by default unless specifically allowed by defined policy.",
              guidance: [
                "- Implement a role-based access control (RBAC) system that restricts access to system components and cardholder data based on job classification and function",
                "- Define access needs for each role including which system components and data resources each role requires access to and the level of privilege needed",
                "- Set default access to deny-all and grant access only as explicitly needed per documented business justification",
                "- Document approval from authorized parties for all access privileges granted specifying the required privileges",
                "- Review all user accounts and access privileges at least every six months",
              ].join("\n"),
            },
            {
              number: "7.3",
              title: "Access to system components and data is managed via an access control system",
              objective:
                "Ensure access to system components and data is managed through an access control system that enforces the principle of least privilege and restricts access based on documented business need.",
              guidance: [
                "- Implement automated access control systems that enforce least privilege across all system components in the CDE",
                "- Configure access control systems to restrict access based on individual user identities and role assignments",
                "- Ensure access control systems cover all system components including networks, servers, applications, and databases",
                "- Maintain audit logs of all access control changes and access attempts",
                "- Implement periodic access reviews to verify that granted access remains appropriate for current job responsibilities",
              ].join("\n"),
            },
          ],
        },
        {
          number: "8",
          title: "Identify Users and Authenticate Access to System Components",
          description:
            "Assigning a unique identification (ID) to each person with access ensures that actions taken on critical data and systems are performed by, and can be traced to, known and authorized users and processes.",
          category: "Access Control",
          controls: [
            {
              number: "8.1",
              title: "Processes and mechanisms for identification and authentication are defined and understood",
              objective:
                "Ensure that processes for identifying users and authenticating access to system components are formally defined, documented, and known to all affected parties.",
              guidance: [
                "- Document and maintain policies and procedures for user identification and authentication across all system components",
                "- Define requirements for unique user identification, password complexity, and account management",
                "- Assign roles and responsibilities for identity and access management processes",
                "- Review identification and authentication policies at least annually and update as needed",
                "- Ensure all personnel are informed of authentication policies and their responsibilities",
              ].join("\n"),
            },
            {
              number: "8.2",
              title: "User identification and related accounts are strictly managed",
              objective:
                "Assign all users a unique ID before allowing them to access system components or cardholder data. Manage all user accounts including adding, deleting, and modifying user IDs, credentials, and other identifier objects.",
              guidance: [
                "- Assign a unique ID to each individual with computer access to ensure each user is uniquely identifiable",
                "- Verify user identity before performing account operations such as password resets, new account provisioning, or privilege modifications",
                "- Immediately revoke access for any terminated users and disable inactive accounts within 90 days",
                "- Remove or disable inactive user accounts within 90 days and require re-enablement procedures",
                "- Manage all accounts used by third parties for remote access: enable only during the time period needed and monitor when in use",
                "- Limit repeated access attempts by locking out the user account after not more than ten invalid login attempts",
              ].join("\n"),
            },
            {
              number: "8.3",
              title: "Strong authentication for users and administrators is established and managed",
              objective:
                "Implement strong authentication mechanisms including complex passwords, multi-factor authentication, and secure credential management for all access to the CDE.",
              guidance: [
                "- Require a minimum password length of twelve characters or at least eight characters if the system does not support twelve",
                "- Require passwords to contain both numeric and alphabetic characters",
                "- Require passwords to be changed at least once every 90 days",
                "- Do not allow new passwords to be the same as any of the last four passwords used",
                "- Set the initial password to a unique value for each user and force a change upon first use",
                "- Implement multi-factor authentication (MFA) for all non-console administrative access and all remote network access",
              ].join("\n"),
            },
            {
              number: "8.4",
              title: "Multi-factor authentication (MFA) is implemented to secure access into the CDE",
              objective:
                "Implement multi-factor authentication for all access into the cardholder data environment, all non-console administrative access, and all remote network access originating from outside the entity's network.",
              guidance: [
                "- Implement MFA for all non-console access to the CDE for personnel with administrative access",
                "- Implement MFA for all remote network access originating from outside the entity's network",
                "- Ensure MFA mechanisms are not susceptible to replay attacks and cannot be bypassed by any users including administrators",
                "- Require at least two of the three authentication factors: something you know, something you have, or something you are",
                "- Ensure MFA is applied to each login session and not only at initial network connection",
              ].join("\n"),
            },
            {
              number: "8.5",
              title: "Single-factor authentication mechanisms are secured",
              objective:
                "Where single-factor authentication is used with passwords or passphrases, ensure they are set and managed in accordance with defined security parameters.",
              guidance: [
                "- For service accounts or system accounts where MFA cannot be used, implement additional compensating controls",
                "- Ensure passwords for single-factor authentication meet minimum complexity and length requirements",
                "- Rotate passwords for service and system accounts periodically and when compromise is suspected",
                "- Store all passwords using strong one-way cryptographic hashing with unique salts",
              ].join("\n"),
            },
            {
              number: "8.6",
              title: "Use of application and system accounts is strictly managed",
              objective:
                "Strictly manage the use of application and system accounts and the associated authentication factors, ensuring they are only used for their intended purpose and cannot be used for interactive login.",
              guidance: [
                "- Assign unique accounts for application and system processes rather than using shared or generic accounts",
                "- Prevent application and system accounts from being used for interactive login by operators",
                "- Periodically review application and system account privileges to verify appropriateness",
                "- Implement strong password management for application and system accounts including regular rotation",
                "- Document all application and system accounts with their associated purpose and the owner responsible for each",
              ].join("\n"),
            },
            {
              number: "8.7",
              title: "Session idle timeout and re-authentication are enforced",
              objective:
                "Implement session management controls that automatically lock or terminate idle sessions and require re-authentication to resume activity, thereby preventing unauthorized access to unattended sessions.",
              guidance: [
                "- Set session idle timeout to 15 minutes or less for all system components in the CDE",
                "- Require users to re-authenticate to reactivate a terminal or session after the idle timeout period has elapsed",
                "- Implement session locking mechanisms that blank or obscure the screen upon idle timeout",
                "- Ensure session management controls apply to all access methods including web applications, remote access, and console sessions",
              ].join("\n"),
            },
          ],
        },
        {
          number: "9",
          title: "Restrict Physical Access to Cardholder Data",
          description:
            "Any physical access to cardholder data or systems that store, process, or transmit cardholder data provides the opportunity for individuals to access and/or remove devices, data, systems, or hardcopies, and should be appropriately restricted.",
          category: "Access Control",
          controls: [
            {
              number: "9.1",
              title: "Processes and mechanisms for restricting physical access are defined and understood",
              objective:
                "Ensure that processes for restricting physical access to cardholder data and systems that store, process, or transmit cardholder data are formally defined, documented, and known to all affected parties.",
              guidance: [
                "- Document and maintain a physical security policy that covers all facilities housing systems that store, process, or transmit cardholder data",
                "- Define physical security perimeters and ensure all entry points to the CDE are controlled",
                "- Assign roles and responsibilities for physical security management and monitoring",
                "- Review and update physical security policies at least annually",
                "- Communicate physical security requirements to all personnel and visitors",
              ].join("\n"),
            },
            {
              number: "9.2",
              title: "Physical access controls manage entry into facilities and systems",
              objective:
                "Use appropriate facility entry controls to limit and monitor physical access to systems in the cardholder data environment, including video cameras, access control mechanisms, and badge readers.",
              guidance: [
                "- Implement physical access controls such as badge readers, lock and key, biometrics, or other mechanisms to restrict access to sensitive areas",
                "- Install video cameras or other surveillance mechanisms to monitor entry and exit points of sensitive areas and review collected data for at least three months",
                "- Restrict physical access to publicly accessible network jacks, wireless access points, gateways, and handheld devices",
                "- Implement access controls to distinguish between authorized personnel and visitors in the CDE",
                "- Maintain audit logs of physical access to sensitive areas and retain them for at least 12 months",
              ].join("\n"),
            },
            {
              number: "9.3",
              title: "Physical access for personnel and visitors is authorized and managed",
              objective:
                "Control and manage physical access for personnel and visitors to the cardholder data environment using identification badges, access lists, and visitor management procedures.",
              guidance: [
                "- Implement a visitor management process that requires visitors to be authorized, escorted at all times, identified with a visible badge, and have their access logged",
                "- Require visitors to surrender physical tokens such as badges before leaving the facility or at the date of expiration",
                "- Maintain a visitor log of all physical access to the facility, including the visitor name, firm represented, and the on-site personnel authorizing physical access",
                "- Retain visitor logs for a minimum of three months unless otherwise restricted by law",
                "- Implement procedures to readily distinguish between on-site personnel and visitors such as different badge colors or types",
              ].join("\n"),
            },
            {
              number: "9.4",
              title: "Media with cardholder data is secured, managed, and tracked",
              objective:
                "Physically secure all media containing cardholder data, control internal and external distribution, and ensure media is destroyed when no longer needed for business or legal reasons.",
              guidance: [
                "- Classify media containing cardholder data so it can be identified as confidential and handled accordingly",
                "- Maintain strict control over the internal or external distribution of any kind of media containing cardholder data",
                "- Implement tracking and inventorying of all media containing cardholder data, including secure courier for external distribution",
                "- Ensure management approves any and all media containing cardholder data that is moved from a secured area",
                "- Destroy media containing cardholder data when it is no longer needed using approved methods such as cross-cut shredding, incineration, or degaussing",
              ].join("\n"),
            },
            {
              number: "9.5",
              title: "Point-of-interaction (POI) devices are protected from tampering and unauthorized substitution",
              objective:
                "Protect point-of-interaction devices such as card readers and PIN entry terminals from tampering, unauthorized modification, and unauthorized substitution by maintaining a device inventory and performing periodic inspections.",
              guidance: [
                "- Maintain an up-to-date list of all point-of-interaction devices including make, model, location, and serial number",
                "- Periodically inspect device surfaces to detect tampering such as unexpected attachments or overlays and verify serial numbers",
                "- Train personnel to be aware of attempted tampering or replacement of devices and to verify the identity of third-party persons claiming to be repair or maintenance personnel",
                "- Ensure devices are not altered or replaced without proper authorization and verification",
                "- Implement tamper-evident controls on POI devices and immediately report any evidence of tampering",
              ].join("\n"),
            },
          ],
        },
      ],
    },

    // ── Goal 5: Regularly Monitor and Test Networks ───────────────────
    {
      number: "G5",
      title: "Regularly Monitor and Test Networks",
      description:
        "Regularly monitor and test networks to ensure security controls continue to operate effectively and to identify new vulnerabilities or unauthorized activity in the cardholder data environment.",
      category: "Monitoring & Testing",
      requirements: [
        {
          number: "10",
          title: "Log and Monitor All Access to System Components and Cardholder Data",
          description:
            "Logging mechanisms and the ability to track user activities are critical in preventing, detecting, or minimizing the impact of a data compromise. The presence of logs across all environments allows thorough tracking, alerting, and analysis when something does go wrong.",
          category: "Monitoring & Testing",
          controls: [
            {
              number: "10.1",
              title: "Processes and mechanisms for logging and monitoring are defined and understood",
              objective:
                "Ensure that processes for logging and monitoring all access to system components and cardholder data are formally defined, documented, and known to all affected parties.",
              guidance: [
                "- Document and maintain audit logging policies that define logging requirements for all system components in the CDE",
                "- Define which events must be logged including user access, administrative actions, and security events",
                "- Assign roles and responsibilities for log management including log review, retention, and protection",
                "- Review logging and monitoring policies at least annually and update as needed",
                "- Ensure all personnel understand the purpose and requirements of audit logging",
              ].join("\n"),
            },
            {
              number: "10.2",
              title: "Audit logs are implemented to support the detection of anomalies and suspicious activity",
              objective:
                "Implement automated audit trails for all system components to reconstruct events including all individual user accesses to cardholder data, all actions taken by any individual with root or administrative privileges, and access to all audit trails.",
              guidance: [
                "- Log all individual user access to cardholder data with user identification, type of event, date and time, success or failure, origination of event, and identity or name of affected data, system component, or resource",
                "- Log all actions taken by any individual with root or administrative privileges",
                "- Log access to all audit trails and any initialization, stopping, or pausing of audit logs",
                "- Log all invalid logical access attempts and all use of and changes to identification and authentication mechanisms",
                "- Log creation and deletion of system-level objects",
                "- Ensure audit trail entries include at minimum: user identification, type of event, date and time, success or failure indication, origination of event, and identity of affected resource",
              ].join("\n"),
            },
            {
              number: "10.3",
              title: "Audit logs are protected from destruction and unauthorized modifications",
              objective:
                "Protect audit trail files from unauthorized modifications by implementing access controls, integrity monitoring, and backup procedures to ensure log data is available for investigation.",
              guidance: [
                "- Implement access controls to limit viewing of audit trails to those with a job-related need",
                "- Protect audit trail files from unauthorized modification through access control mechanisms and integrity monitoring",
                "- Promptly back up audit trail files to a centralized log server or media that is difficult to alter",
                "- Write logs for external-facing technologies onto a secure, centralized, internal log server or media device",
                "- Implement file-integrity monitoring or change-detection mechanisms on logs to ensure existing log data cannot be changed without generating alerts",
              ].join("\n"),
            },
            {
              number: "10.4",
              title: "Audit logs are reviewed to identify anomalies or suspicious activity",
              objective:
                "Review logs of all system components at least daily, with particular attention to security-relevant events, using log harvesting, parsing, and alerting tools.",
              guidance: [
                "- Review all security events, logs of all system components that store, process, or transmit CHD and SAD, and logs of all critical system components at least daily",
                "- Review logs of all other system components periodically as defined by risk assessment",
                "- Implement automated mechanisms to alert on anomalous or suspicious activity detected in logs",
                "- Follow up on exceptions and anomalies identified during the review process with documented response procedures",
                "- Retain log review records and document findings from log analysis activities",
              ].join("\n"),
            },
            {
              number: "10.5",
              title: "Audit log history is retained and available for analysis",
              objective:
                "Retain audit trail history for at least one year with a minimum of three months immediately available for analysis to support incident investigation and compliance verification.",
              guidance: [
                "- Retain audit log history for at least 12 months with at least the most recent three months immediately available for analysis",
                "- Implement log archival procedures that ensure older logs can be restored promptly when needed for investigation",
                "- Define and implement log retention schedules that meet both PCI DSS requirements and applicable legal or regulatory obligations",
                "- Ensure archived logs maintain their integrity and are protected from unauthorized access or modification",
              ].join("\n"),
            },
            {
              number: "10.6",
              title: "Time-synchronization mechanisms support consistent time across all systems",
              objective:
                "Synchronize all critical system clocks and times using time-synchronization technology to ensure consistent and accurate timestamps in audit logs across all system components.",
              guidance: [
                "- Implement Network Time Protocol (NTP) or similar technology to synchronize all critical system clocks",
                "- Ensure time data is received from industry-accepted time sources such as NTP servers operated by national time authorities",
                "- Configure systems to accept time data only from specific, designated central time servers",
                "- Protect time data and time synchronization settings from unauthorized modification",
                "- Document the time synchronization standard in use and the designated time servers",
              ].join("\n"),
            },
          ],
        },
        {
          number: "11",
          title: "Test Security of Systems and Networks Regularly",
          description:
            "Vulnerabilities are being discovered continually by malicious individuals and researchers, and being introduced by new software. System components, processes, and bespoke and custom software should be tested frequently to ensure security controls continue to reflect a changing environment.",
          category: "Monitoring & Testing",
          controls: [
            {
              number: "11.1",
              title: "Processes and mechanisms for regular security testing are defined and understood",
              objective:
                "Ensure that processes for regularly testing the security of systems and networks are formally defined, documented, and known to all affected parties.",
              guidance: [
                "- Document and maintain a security testing policy that defines the scope, frequency, and methodology of all security tests",
                "- Assign roles and responsibilities for conducting, reviewing, and remediating findings from security tests",
                "- Review and update security testing policies at least annually",
                "- Maintain records of all security testing activities including scope, findings, and remediation actions",
              ].join("\n"),
            },
            {
              number: "11.2",
              title: "Wireless access points are identified and monitored",
              objective:
                "Test for the presence of unauthorized wireless access points and detect unauthorized wireless devices by implementing a wireless analyzer at least quarterly or deploying a wireless IDS/IPS.",
              guidance: [
                "- Implement processes to test for the presence of wireless access points at least quarterly using a wireless analyzer or equivalent tool",
                "- Maintain an inventory of all authorized wireless access points and document business justification for each",
                "- Configure automated alerts for detection of unauthorized wireless access points",
                "- Investigate and remediate any unauthorized wireless access points detected during testing",
                "- Consider deploying a wireless intrusion detection/prevention system for continuous monitoring",
              ].join("\n"),
            },
            {
              number: "11.3",
              title: "External and internal vulnerabilities are regularly identified, prioritized, and addressed",
              objective:
                "Run internal and external network vulnerability scans at least quarterly and after any significant change, using qualified personnel or an ASV for external scans.",
              guidance: [
                "- Perform internal vulnerability scans at least quarterly and after any significant change in the network",
                "- Perform external vulnerability scans at least quarterly and after any significant change using a PCI SSC Approved Scanning Vendor (ASV)",
                "- Address vulnerabilities and perform rescans until passing results are obtained for all high-risk vulnerabilities",
                "- Ensure scan results are reviewed by qualified personnel and all identified vulnerabilities are addressed based on risk ranking",
                "- Maintain records of scan results and remediation activities for compliance verification",
              ].join("\n"),
            },
            {
              number: "11.4",
              title: "External and internal penetration testing is regularly performed",
              objective:
                "Perform penetration testing at least annually and after any significant infrastructure or application upgrade or modification to identify and attempt to exploit security vulnerabilities.",
              guidance: [
                "- Perform external penetration testing at least annually and after any significant changes to the CDE perimeter",
                "- Perform internal penetration testing at least annually and after any significant changes to internal network infrastructure",
                "- Ensure penetration tests are performed by qualified internal resources or qualified external third parties that are organizationally independent of the entity",
                "- Address exploitable vulnerabilities found during penetration testing and retest to verify the issues are resolved",
                "- Include network-layer and application-layer penetration testing within the scope covering the entire CDE perimeter and critical systems",
                "- Ensure penetration testing methodology includes industry-accepted approaches such as NIST SP 800-115 or OWASP Testing Guide",
              ].join("\n"),
            },
            {
              number: "11.5",
              title: "Network intrusions and unexpected file changes are detected and responded to",
              objective:
                "Use intrusion detection and/or intrusion prevention techniques to detect and/or prevent intrusions into the network, and deploy change-detection mechanisms to alert personnel to unauthorized modification of critical files.",
              guidance: [
                "- Deploy intrusion-detection systems (IDS) and/or intrusion-prevention systems (IPS) at the perimeter and at critical points inside the CDE to monitor all network traffic",
                "- Keep all IDS/IPS engines, baselines, and signatures up to date",
                "- Configure IDS/IPS to generate alerts to appropriate personnel upon detection of suspicious activity",
                "- Implement a change-detection mechanism such as file-integrity monitoring to alert personnel to unauthorized modification of critical system files, configuration files, or content files",
                "- Configure the change-detection mechanism to perform critical file comparisons at least weekly and generate alerts when unauthorized changes are detected",
              ].join("\n"),
            },
            {
              number: "11.6",
              title: "Unauthorized changes on payment pages are detected and responded to",
              objective:
                "Deploy a change-and-tamper detection mechanism on payment pages to alert personnel to unauthorized modification of HTTP headers and content of payment pages received by consumer browsers.",
              guidance: [
                "- Implement a mechanism to detect unauthorized changes to HTTP headers and the contents of payment pages as received by consumer browsers",
                "- Configure the mechanism to evaluate the received HTTP headers and payment page content at least weekly or periodically at a defined frequency",
                "- Generate alerts when unauthorized modifications are detected on payment pages",
                "- Establish response procedures for investigating and remediating unauthorized changes to payment pages",
                "- Maintain an inventory of all scripts authorized to load and execute on payment pages and block unauthorized scripts",
              ].join("\n"),
            },
          ],
        },
      ],
    },

    // ── Goal 6: Maintain an Information Security Policy ───────────────
    {
      number: "G6",
      title: "Maintain an Information Security Policy",
      description:
        "Maintain a comprehensive information security policy that addresses all PCI DSS requirements, defines the organization's security posture, and is communicated to all relevant personnel and third parties.",
      category: "Security Policy",
      requirements: [
        {
          number: "12",
          title: "Support Information Security with Organizational Policies and Programs",
          description:
            "A strong security policy sets the tone for the whole entity and informs personnel what is expected of them. All personnel should be aware of the sensitivity of cardholder data and their responsibilities for protecting it.",
          category: "Security Policy",
          controls: [
            {
              number: "12.1",
              title: "A comprehensive information security policy is established and maintained",
              objective:
                "Establish, publish, maintain, and disseminate a comprehensive information security policy that addresses all PCI DSS requirements and is reviewed at least annually and updated when the environment changes.",
              guidance: [
                "- Establish a formal information security policy that is approved by management and addresses all twelve PCI DSS requirement areas",
                "- Review the information security policy at least annually and update it when the environment changes",
                "- Disseminate the information security policy to all relevant personnel and ensure their acknowledgment",
                "- Ensure the policy clearly defines information security responsibilities for all personnel",
                "- Define a formal process for policy exceptions that includes approval, documentation, and a defined expiration period",
              ].join("\n"),
            },
            {
              number: "12.2",
              title: "Acceptable use policies for end-user technologies are defined and implemented",
              objective:
                "Define and implement acceptable use policies for critical technologies and end-user technologies, including explicit approval by authorized parties and a list of approved uses.",
              guidance: [
                "- Document acceptable use policies for all end-user technologies including laptops, tablets, mobile devices, email, and internet usage",
                "- Require explicit management approval for use of technologies and define their acceptable uses",
                "- Require all authorized users to sign an acknowledgment that they have read and understand the acceptable use policies",
                "- Implement technical controls to enforce acceptable use policies where feasible",
                "- Define consequences for violation of acceptable use policies and communicate them to all users",
              ].join("\n"),
            },
            {
              number: "12.3",
              title: "Risks to the cardholder data environment are formally identified, evaluated, and managed",
              objective:
                "Perform a formal risk assessment at least annually and upon significant changes to the environment to identify threats and vulnerabilities that could impact the security of the CDE.",
              guidance: [
                "- Perform a formal risk assessment at least annually and upon significant changes to the cardholder data environment",
                "- Identify critical assets, threats, and vulnerabilities as part of the risk assessment process",
                "- Document and implement a risk mitigation plan that addresses identified risks with appropriate controls",
                "- Use an industry-accepted risk assessment methodology such as NIST SP 800-30, OCTAVE, or ISO 27005",
                "- Maintain records of risk assessment activities, findings, and risk treatment decisions",
                "- Assign risk owners and define timeframes for risk treatment activities",
              ].join("\n"),
            },
            {
              number: "12.4",
              title: "PCI DSS compliance is managed through a defined program",
              objective:
                "Implement a PCI DSS compliance program that defines how the organization manages its compliance obligations including assignment of responsibilities, monitoring, and reporting.",
              guidance: [
                "- Establish a formal PCI DSS compliance program with clearly assigned roles and responsibilities",
                "- Assign responsibility for PCI DSS compliance management to a qualified individual or team",
                "- Implement a charter or terms of reference for the compliance program that defines its scope, authority, and reporting structure",
                "- Perform quarterly reviews of compliance status across all PCI DSS requirements",
                "- Report compliance status to executive management at least annually",
              ].join("\n"),
            },
            {
              number: "12.5",
              title: "PCI DSS scope is documented and validated",
              objective:
                "Document and confirm PCI DSS scope at least annually and upon significant changes to the in-scope environment, identifying all locations and flows of cardholder data and all connected systems.",
              guidance: [
                "- Maintain documentation that describes the PCI DSS scope including all data flows, system components, networks, and connections to the CDE",
                "- Perform scope validation at least annually and after significant changes to confirm accuracy of the documented scope",
                "- Identify and document all locations where cardholder data is stored, processed, or transmitted",
                "- Identify all system components and network segments that are connected to or could impact the CDE",
                "- Confirm that all PCI DSS controls are applied to all in-scope system components and networks",
              ].join("\n"),
            },
            {
              number: "12.6",
              title: "Security awareness education is an ongoing activity",
              objective:
                "Implement a formal security awareness program to ensure all personnel are aware of the cardholder data security policy and procedures and their role in protecting cardholder data.",
              guidance: [
                "- Implement a formal security awareness program that is delivered to all personnel upon hire and at least annually thereafter",
                "- Include education about the importance of cardholder data security and each person's role in protecting it",
                "- Require personnel to acknowledge at least annually that they have read and understand the information security policy and procedures",
                "- Include awareness training on phishing and social engineering attacks with practical examples",
                "- Track and document security awareness training completion for all personnel",
                "- Tailor security awareness content based on personnel roles and their level of access to cardholder data",
              ].join("\n"),
            },
            {
              number: "12.7",
              title: "Personnel are screened to reduce risks from insider threats",
              objective:
                "Screen potential personnel prior to hire to minimize the risk of attacks from internal sources. Background checks should be performed within the constraints of local laws.",
              guidance: [
                "- Perform background checks on potential personnel prior to hire for positions with access to the CDE or cardholder data",
                "- Define screening requirements appropriate to each position based on the level of access to cardholder data and the CDE",
                "- Conduct background checks within the constraints of local laws and regulations",
                "- Document and maintain records of all background checks performed",
              ].join("\n"),
            },
            {
              number: "12.8",
              title: "Risk to information assets from third-party service providers is managed",
              objective:
                "Maintain and implement policies and procedures to manage service providers with whom cardholder data is shared or that could affect the security of cardholder data, including due diligence and contractual obligations.",
              guidance: [
                "- Maintain a list of all service providers with whom cardholder data is shared or that could affect the security of the CDE",
                "- Maintain a written agreement with service providers that includes their acknowledgment of responsibility for the security of cardholder data they possess or otherwise store, process, or transmit",
                "- Ensure there is an established process for engaging service providers including proper due diligence prior to engagement",
                "- Monitor the PCI DSS compliance status of service providers at least annually",
                "- Maintain information about which PCI DSS requirements are managed by each service provider and which are managed by the entity",
                "- Implement a process for immediately reporting and addressing any security breaches or incidents reported by service providers",
              ].join("\n"),
            },
            {
              number: "12.9",
              title: "Third-party service providers support their customers' PCI DSS compliance",
              objective:
                "Ensure that third-party service providers acknowledge their responsibility for securing cardholder data and provide transparency about which PCI DSS requirements they manage on behalf of their customers.",
              guidance: [
                "- Require service providers to provide written acknowledgment that they are responsible for the security of cardholder data they possess, store, process, or transmit",
                "- Require service providers to provide evidence of their PCI DSS compliance status including AOC or relevant compliance documentation",
                "- Establish clear delineation of PCI DSS responsibilities between the entity and each service provider",
                "- Include PCI DSS compliance obligations in contractual agreements with all service providers",
              ].join("\n"),
            },
            {
              number: "12.10",
              title: "Suspected and confirmed security incidents are responded to immediately",
              objective:
                "Implement an incident response plan to be prepared to respond immediately to a system breach, including procedures for detection, containment, eradication, recovery, and post-incident analysis.",
              guidance: [
                "- Create and maintain an incident response plan that can be initiated immediately in the event of a cardholder data breach",
                "- Include in the plan: roles, responsibilities, communication strategies, contact information for payment brands and acquirers, and procedures for notification of affected parties",
                "- Designate specific personnel to be available 24/7 to respond to suspected security incidents",
                "- Test the incident response plan at least annually through tabletop exercises or simulations",
                "- Include lessons learned from actual incidents and industry developments in plan updates",
                "- Define procedures for evidence preservation and forensic investigation that comply with legal requirements and payment brand requirements",
              ].join("\n"),
            },
          ],
        },
      ],
    },
  ]

  let sortOrder = 0

  for (const goal of goals) {
    const parentClause = await prisma.clause.create({
      data: {
        frameworkId: fwId,
        number: goal.number,
        title: goal.title,
        description: goal.description,
        isAnnex: false,
        sortOrder: sortOrder++,
      },
    })

    for (const req of goal.requirements) {
      const reqClause = await prisma.clause.create({
        data: {
          frameworkId: fwId,
          parentId: parentClause.id,
          number: req.number,
          title: req.title,
          description: req.description,
          isAnnex: false,
          sortOrder: sortOrder++,
        },
      })

      for (const ctrl of req.controls) {
        await prisma.control.create({
          data: {
            clauseId: reqClause.id,
            number: ctrl.number,
            title: ctrl.title,
            category: goal.category,
            objective: ctrl.objective,
            guidance: ctrl.guidance,
          },
        })
      }
    }
  }

  const clauseCount = await prisma.clause.count({ where: { frameworkId: fwId } })
  const controlCount = await prisma.control.count({ where: { clause: { frameworkId: fwId } } })

  console.log(`[seed] PCI DSS v4.0 seeded -- ${clauseCount} clauses, ${controlCount} controls`)
}
