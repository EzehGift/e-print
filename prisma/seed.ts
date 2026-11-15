import { PrismaClient, ItemType, ItemStatus, DivisionLevel, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ─── Clean existing data ───────────────────────────────────────────────────
  await prisma.itemKeyword.deleteMany()
  await prisma.itemSubject.deleteMany()
  await prisma.itemAuthor.deleteMany()
  await prisma.file.deleteMany()
  await prisma.item.deleteMany()
  await prisma.keyword.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.author.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()
  await prisma.division.deleteMany()

  // ─── University root ───────────────────────────────────────────────────────
  const university = await prisma.division.create({
    data: { name: 'Godfrey Okoye University', code: 'GOUNI', level: DivisionLevel.UNIVERSITY },
  })

  // ─── Faculties ─────────────────────────────────────────────────────────────
  const [mss, nse, cit, edu, art, law, med] = await Promise.all([
    prisma.division.create({ data: { name: 'Faculty of Management & Social Sciences',          code: 'MSS', level: DivisionLevel.FACULTY, parentId: university.id } }),
    prisma.division.create({ data: { name: 'Faculty of Natural Sciences & Environmental Studies', code: 'NSE', level: DivisionLevel.FACULTY, parentId: university.id } }),
    prisma.division.create({ data: { name: 'Faculty of Computing and Information Technology',  code: 'CIT', level: DivisionLevel.FACULTY, parentId: university.id } }),
    prisma.division.create({ data: { name: 'Faculty of Education',                             code: 'EDU', level: DivisionLevel.FACULTY, parentId: university.id } }),
    prisma.division.create({ data: { name: 'Faculty of Arts',                                  code: 'ART', level: DivisionLevel.FACULTY, parentId: university.id } }),
    prisma.division.create({ data: { name: 'Faculty of Law',                                   code: 'LAW', level: DivisionLevel.FACULTY, parentId: university.id } }),
    prisma.division.create({ data: { name: 'Faculty of Clinical Medicine',                     code: 'MED', level: DivisionLevel.FACULTY, parentId: university.id } }),
  ])

  // ─── Departments ───────────────────────────────────────────────────────────
  await Promise.all([
    // Faculty of Management & Social Sciences
    prisma.division.create({ data: { name: 'Accounting',            code: 'MSS-ACC', level: DivisionLevel.DEPARTMENT, parentId: mss.id } }),
    prisma.division.create({ data: { name: 'Banking and Finance',   code: 'MSS-BNF', level: DivisionLevel.DEPARTMENT, parentId: mss.id } }),
    prisma.division.create({ data: { name: 'Management',            code: 'MSS-MGT', level: DivisionLevel.DEPARTMENT, parentId: mss.id } }),
    prisma.division.create({ data: { name: 'Marketing',             code: 'MSS-MKT', level: DivisionLevel.DEPARTMENT, parentId: mss.id } }),
    prisma.division.create({ data: { name: 'Public Administration', code: 'MSS-PUA', level: DivisionLevel.DEPARTMENT, parentId: mss.id } }),
    prisma.division.create({ data: { name: 'Economics',             code: 'MSS-ECO', level: DivisionLevel.DEPARTMENT, parentId: mss.id } }),
    prisma.division.create({ data: { name: 'Political Science',     code: 'MSS-POL', level: DivisionLevel.DEPARTMENT, parentId: mss.id } }),
    prisma.division.create({ data: { name: 'International Relations', code: 'MSS-INT', level: DivisionLevel.DEPARTMENT, parentId: mss.id } }),
    prisma.division.create({ data: { name: 'Mass Communications',   code: 'MSS-MCM', level: DivisionLevel.DEPARTMENT, parentId: mss.id } }),
    prisma.division.create({ data: { name: 'Philosophy',            code: 'MSS-PHI', level: DivisionLevel.DEPARTMENT, parentId: mss.id } }),
    prisma.division.create({ data: { name: 'Psychology',            code: 'MSS-PSY', level: DivisionLevel.DEPARTMENT, parentId: mss.id } }),
    prisma.division.create({ data: { name: 'Religious Studies',     code: 'MSS-REL', level: DivisionLevel.DEPARTMENT, parentId: mss.id } }),
    prisma.division.create({ data: { name: 'Sociology',             code: 'MSS-SOC', level: DivisionLevel.DEPARTMENT, parentId: mss.id } }),

    // Faculty of Natural Sciences & Environmental Studies
    prisma.division.create({ data: { name: 'Applied Biology',    code: 'NSE-BIO', level: DivisionLevel.DEPARTMENT, parentId: nse.id } }),
    prisma.division.create({ data: { name: 'Biotechnology',      code: 'NSE-BTC', level: DivisionLevel.DEPARTMENT, parentId: nse.id } }),
    prisma.division.create({ data: { name: 'Microbiology',       code: 'NSE-MCB', level: DivisionLevel.DEPARTMENT, parentId: nse.id } }),
    prisma.division.create({ data: { name: 'Chemistry',          code: 'NSE-CHM', level: DivisionLevel.DEPARTMENT, parentId: nse.id } }),
    prisma.division.create({ data: { name: 'Biochemistry',       code: 'NSE-BCH', level: DivisionLevel.DEPARTMENT, parentId: nse.id } }),
    prisma.division.create({ data: { name: 'Industrial Chemistry', code: 'NSE-ICH', level: DivisionLevel.DEPARTMENT, parentId: nse.id } }),
    prisma.division.create({ data: { name: 'Physics',            code: 'NSE-PHY', level: DivisionLevel.DEPARTMENT, parentId: nse.id } }),
    prisma.division.create({ data: { name: 'Architecture',       code: 'NSE-ARC', level: DivisionLevel.DEPARTMENT, parentId: nse.id } }),
    prisma.division.create({ data: { name: 'Industrial Design',  code: 'NSE-IDN', level: DivisionLevel.DEPARTMENT, parentId: nse.id } }),

    // Faculty of Computing and Information Technology
    prisma.division.create({ data: { name: 'Computer Science',       code: 'CIT-CSC', level: DivisionLevel.DEPARTMENT, parentId: cit.id } }),
    prisma.division.create({ data: { name: 'Mathematics',            code: 'CIT-MTH', level: DivisionLevel.DEPARTMENT, parentId: cit.id } }),
    prisma.division.create({ data: { name: 'Statistics & Demography', code: 'CIT-STD', level: DivisionLevel.DEPARTMENT, parentId: cit.id } }),

    // Faculty of Education
    prisma.division.create({ data: { name: 'Biology Education',                       code: 'EDU-BIO', level: DivisionLevel.DEPARTMENT, parentId: edu.id } }),
    prisma.division.create({ data: { name: 'Chemistry Education',                     code: 'EDU-CHM', level: DivisionLevel.DEPARTMENT, parentId: edu.id } }),
    prisma.division.create({ data: { name: 'Mathematics Education',                   code: 'EDU-MTH', level: DivisionLevel.DEPARTMENT, parentId: edu.id } }),
    prisma.division.create({ data: { name: 'Physics Education',                       code: 'EDU-PHY', level: DivisionLevel.DEPARTMENT, parentId: edu.id } }),
    prisma.division.create({ data: { name: 'English & Lit Studies Education',         code: 'EDU-ENG', level: DivisionLevel.DEPARTMENT, parentId: edu.id } }),
    prisma.division.create({ data: { name: 'History/International Studies Education', code: 'EDU-HIS', level: DivisionLevel.DEPARTMENT, parentId: edu.id } }),
    prisma.division.create({ data: { name: 'Economics Education',                     code: 'EDU-ECO', level: DivisionLevel.DEPARTMENT, parentId: edu.id } }),
    prisma.division.create({ data: { name: 'Political Science & Government Education', code: 'EDU-POL', level: DivisionLevel.DEPARTMENT, parentId: edu.id } }),
    prisma.division.create({ data: { name: 'Social Studies Education',                code: 'EDU-SST', level: DivisionLevel.DEPARTMENT, parentId: edu.id } }),
    prisma.division.create({ data: { name: 'Business Education',                      code: 'EDU-BUS', level: DivisionLevel.DEPARTMENT, parentId: edu.id } }),
    prisma.division.create({ data: { name: 'Computer Science Education',              code: 'EDU-CSE', level: DivisionLevel.DEPARTMENT, parentId: edu.id } }),

    // Faculty of Arts
    prisma.division.create({ data: { name: 'History, International Relations & Diplomacy', code: 'ART-HIS', level: DivisionLevel.DEPARTMENT, parentId: art.id } }),
    prisma.division.create({ data: { name: 'Music',                    code: 'ART-MUS', level: DivisionLevel.DEPARTMENT, parentId: art.id } }),
    prisma.division.create({ data: { name: 'English and Literary Studies', code: 'ART-ENG', level: DivisionLevel.DEPARTMENT, parentId: art.id } }),
    prisma.division.create({ data: { name: 'Philosophy',               code: 'ART-PHI', level: DivisionLevel.DEPARTMENT, parentId: art.id } }),

    // Faculty of Law
    prisma.division.create({ data: { name: 'Juris & International Law', code: 'LAW-JIL', level: DivisionLevel.DEPARTMENT, parentId: law.id } }),
    prisma.division.create({ data: { name: 'Public Law',                code: 'LAW-PUL', level: DivisionLevel.DEPARTMENT, parentId: law.id } }),
    prisma.division.create({ data: { name: 'Private & Business Law',    code: 'LAW-PBL', level: DivisionLevel.DEPARTMENT, parentId: law.id } }),

    // Faculty of Clinical Medicine
    prisma.division.create({ data: { name: 'Medicine and Surgery', code: 'MED-MDS', level: DivisionLevel.DEPARTMENT, parentId: med.id } }),
    prisma.division.create({ data: { name: 'Nursing Sciences',     code: 'MED-NRS', level: DivisionLevel.DEPARTMENT, parentId: med.id } }),
  ])

  // ─── Subjects (Library of Congress) ────────────────────────────────────────
  const subjectData = [
    { code: 'A',  name: 'General Works' },
    { code: 'B',  name: 'Philosophy, Psychology, Religion' },
    { code: 'C',  name: 'Auxiliary Sciences of History' },
    { code: 'D',  name: 'World History' },
    { code: 'G',  name: 'Geography, Anthropology, Recreation' },
    { code: 'H',  name: 'Social Sciences' },
    { code: 'J',  name: 'Political Science' },
    { code: 'K',  name: 'Law' },
    { code: 'L',  name: 'Education' },
    { code: 'M',  name: 'Music' },
    { code: 'N',  name: 'Fine Arts' },
    { code: 'P',  name: 'Language and Literature' },
    { code: 'Q',  name: 'Science' },
    { code: 'QA', name: 'Mathematics' },
    { code: 'QB', name: 'Astronomy' },
    { code: 'QC', name: 'Physics' },
    { code: 'QD', name: 'Chemistry' },
    { code: 'QH', name: 'Natural History and Biology' },
    { code: 'QK', name: 'Botany' },
    { code: 'QP', name: 'Physiology' },
    { code: 'QR', name: 'Microbiology' },
    { code: 'R',  name: 'Medicine' },
    { code: 'RC', name: 'Internal Medicine' },
    { code: 'S',  name: 'Agriculture' },
    { code: 'T',  name: 'Technology' },
    { code: 'TA', name: 'Engineering' },
    { code: 'TK', name: 'Electrical Engineering' },
    { code: 'HB', name: 'Economics' },
    { code: 'HF', name: 'Commerce and Business' },
  ]
  const subjects = await Promise.all(
    subjectData.map(s => prisma.subject.create({ data: s }))
  )

  // ─── Users ─────────────────────────────────────────────────────────────────
  const adminHash      = await bcrypt.hash('admin1234', 12)
  const researcherHash = await bcrypt.hash('test1234',  12)

  const adminUser = await prisma.user.create({
    data: {
      email:         'admin@gouni.edu.ng',
      passwordHash:  adminHash,
      firstName:     'Repository',
      lastName:      'Admin',
      role:          Role.ADMIN,
      emailVerified: true,
      facultyId:     mss.id,
    },
  })

  const researcherUser = await prisma.user.create({
    data: {
      email:         'researcher@gouni.edu.ng',
      passwordHash:  researcherHash,
      firstName:     'Emeka',
      lastName:      'Okafor',
      role:          Role.RESEARCHER,
      emailVerified: true,
      facultyId:     nse.id,
    },
  })

  // ─── Authors ───────────────────────────────────────────────────────────────
  const authors = await Promise.all([
    prisma.author.create({ data: { firstName: 'Chukwuemeka', lastName: 'Okafor',      email: 'c.okafor@gouni.edu.ng',      orcid: '0000-0001-2345-6789' } }),
    prisma.author.create({ data: { firstName: 'Adaeze',      lastName: 'Nwosu',       email: 'a.nwosu@gouni.edu.ng' } }),
    prisma.author.create({ data: { firstName: 'Ikenna',      lastName: 'Eze',         email: 'i.eze@gouni.edu.ng',         orcid: '0000-0002-3456-7890' } }),
    prisma.author.create({ data: { firstName: 'Ngozi',       lastName: 'Obiora',      email: 'n.obiora@gouni.edu.ng' } }),
    prisma.author.create({ data: { firstName: 'Chidi',       lastName: 'Agbo',        email: 'c.agbo@gouni.edu.ng' } }),
    prisma.author.create({ data: { firstName: 'Amaka',       lastName: 'Ugwu',        email: 'a.ugwu@gouni.edu.ng' } }),
    prisma.author.create({ data: { firstName: 'Emeka',       lastName: 'Nnadi',       email: 'e.nnadi@gouni.edu.ng',       orcid: '0000-0003-4567-8901' } }),
    prisma.author.create({ data: { firstName: 'Chioma',      lastName: 'Onuoha',      email: 'c.onuoha@gouni.edu.ng' } }),
    prisma.author.create({ data: { firstName: 'Sunday',      lastName: 'Okeke',       email: 's.okeke@gouni.edu.ng' } }),
    prisma.author.create({ data: { firstName: 'Ifeoma',      lastName: 'Ezenwachi',   email: 'i.ezenwachi@gouni.edu.ng' } }),
    prisma.author.create({ data: { firstName: 'Bartholomew', lastName: 'Ugochukwu',   email: 'b.ugochukwu@gouni.edu.ng' } }),
    prisma.author.create({ data: { firstName: 'Stella',      lastName: 'Anozie',      email: 's.anozie@gouni.edu.ng' } }),
  ])

  const [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12] = authors

  // ─── Keywords ──────────────────────────────────────────────────────────────
  const kwMap: Record<string, string> = {}
  const kwValues = [
    'Nigeria', 'Enugu', 'sustainable development', 'biochemistry',
    'machine learning', 'neural networks', 'constitutional law', 'microfinance',
    'public health', 'malaria', 'renewable energy', 'solar power', 'accounting',
    'corporate governance', 'philosophy', 'ethics', 'theology', 'education policy',
    'curriculum development', 'water treatment', 'microbiology',
    'antibiotic resistance', 'economic growth', 'poverty alleviation',
    'information technology', 'computing', 'clinical medicine', 'nursing',
  ]
  for (const v of kwValues) {
    const kw = await prisma.keyword.create({ data: { value: v } })
    kwMap[v] = kw.id
  }

  // ─── Helper ────────────────────────────────────────────────────────────────
  let itemCounter = 0
  const makeUri = (year: number) => {
    itemCounter++
    return `gouni-eprint-${year}-${String(itemCounter).padStart(4, '0')}`
  }

  const allDepts = await prisma.division.findMany({ where: { level: DivisionLevel.DEPARTMENT } })
  const dept = Object.fromEntries(allDepts.map(d => [d.code, d]))

  // ─── Sample Items ──────────────────────────────────────────────────────────
  type SeedItem = {
    title: string
    abstract: string
    type: ItemType
    status: ItemStatus
    year: number
    divisionId: string
    authors: { author: typeof a1; order: number }[]
    subjectCodes: string[]
    keywords: string[]
  }

  const itemSeeds: SeedItem[] = [
    {
      title: 'Machine Learning Approaches for Early Detection of Malaria Parasite in Blood Smear Images',
      abstract: 'Malaria remains a significant public health challenge in sub-Saharan Africa. This paper presents a convolutional neural network (CNN) architecture for automated detection and classification of Plasmodium species in Giemsa-stained blood smear images. A dataset of 27,558 cell images was used for training and validation. The proposed model achieved an accuracy of 97.3%, sensitivity of 96.8%, and specificity of 97.7%, outperforming existing methods. The system is designed to operate on low-resource hardware suitable for deployment in rural Nigerian healthcare facilities.',
      type: ItemType.ARTICLE,
      status: ItemStatus.PUBLISHED,
      year: 2023,
      divisionId: dept['CIT-CSC'].id,
      authors: [{ author: a3, order: 0 }, { author: a5, order: 1 }],
      subjectCodes: ['T', 'QR'],
      keywords: ['machine learning', 'neural networks', 'malaria', 'Nigeria'],
    },
    {
      title: 'Corporate Governance and Financial Performance of Listed Firms on the Nigerian Stock Exchange',
      abstract: 'This study examines the relationship between corporate governance mechanisms and the financial performance of firms listed on the Nigerian Exchange Group (NGX). Using a panel dataset of 45 non-financial firms over a ten-year period (2013–2022), we employ fixed-effects regression analysis to investigate how board size, board independence, CEO duality, and audit committee effectiveness influence Return on Assets (ROA) and Tobin\'s Q. Findings reveal that board independence and audit committee effectiveness are positively and significantly associated with firm performance.',
      type: ItemType.ARTICLE,
      status: ItemStatus.PUBLISHED,
      year: 2023,
      divisionId: dept['MSS-ACC'].id,
      authors: [{ author: a4, order: 0 }, { author: a6, order: 1 }, { author: a7, order: 2 }],
      subjectCodes: ['HF', 'HB'],
      keywords: ['corporate governance', 'accounting', 'Nigeria', 'economic growth'],
    },
    {
      title: 'Constitutional Limitations on the Exercise of Emergency Powers in Nigeria: A Comparative Analysis',
      abstract: 'This thesis undertakes a comprehensive analysis of the constitutional framework governing the declaration and exercise of emergency powers in Nigeria, with comparative reference to South Africa, Ghana, and Kenya. It examines the provisions of Sections 305 and 306 of the 1999 Constitution of the Federal Republic of Nigeria (as amended) and evaluates their adequacy in safeguarding fundamental rights during states of emergency. The study employs doctrinal and comparative legal methodology, drawing on judicial decisions, executive proclamations, and legislative debates.',
      type: ItemType.THESIS,
      status: ItemStatus.PUBLISHED,
      year: 2021,
      divisionId: dept['LAW-PUL'].id,
      authors: [{ author: a8, order: 0 }],
      subjectCodes: ['K', 'J'],
      keywords: ['constitutional law', 'Nigeria'],
    },
    {
      title: 'Antibiotic Resistance Patterns of Uropathogens Isolated from Patients Attending Tertiary Health Facilities in Enugu, Nigeria',
      abstract: 'Antimicrobial resistance (AMR) is a growing global health crisis. This cross-sectional study characterised the antibiotic resistance profiles of uropathogens isolated from 324 patients with urinary tract infections at two tertiary hospitals in Enugu State between January and December 2022. Escherichia coli (43.2%) and Klebsiella pneumoniae (21.6%) were the predominant isolates. ESBL production was detected in 38% of E. coli isolates. Resistance rates to amoxicillin (89%), trimethoprim-sulfamethoxazole (78%), and ciprofloxacin (56%) were alarmingly high.',
      type: ItemType.ARTICLE,
      status: ItemStatus.PUBLISHED,
      year: 2023,
      divisionId: dept['NSE-MCB'].id,
      authors: [{ author: a9, order: 0 }, { author: a10, order: 1 }],
      subjectCodes: ['QR', 'R', 'RC'],
      keywords: ['antibiotic resistance', 'public health', 'Nigeria', 'microbiology'],
    },
    {
      title: 'Solar Photovoltaic Energy Potential and Optimal Sizing for Off-Grid Rural Electrification in South-Eastern Nigeria',
      abstract: 'Access to reliable electricity remains a major developmental challenge in rural South-Eastern Nigeria. This paper presents a techno-economic analysis of solar photovoltaic (PV) systems for off-grid electrification of five selected rural communities in Enugu State. Using NASA POWER satellite data and HOMER Pro simulation software, we determine the optimal PV-battery-diesel hybrid system configurations. Results indicate that a PV-dominant hybrid system with 20 kWp capacity and 48 kWh battery storage achieves an LCOE of ₦42.7/kWh, representing a 34% reduction compared to diesel-only systems.',
      type: ItemType.ARTICLE,
      status: ItemStatus.PUBLISHED,
      year: 2022,
      divisionId: dept['NSE-PHY'].id,
      authors: [{ author: a11, order: 0 }, { author: a3, order: 1 }],
      subjectCodes: ['TK', 'T'],
      keywords: ['renewable energy', 'solar power', 'Nigeria'],
    },
    {
      title: 'Microfinance and Women Entrepreneurship in South-Eastern Nigeria: Evidence from Enugu State',
      abstract: 'This study examines the impact of microfinance bank credit on the growth and sustainability of women-owned micro and small enterprises (MSEs) in Enugu State, Nigeria. Using primary data collected from 280 women entrepreneurs through stratified random sampling, and employing logistic regression and OLS models, the study finds that access to microfinance credit significantly increases business revenue, employment generation, and household income. High interest rates, stringent collateral requirements, and limited financial literacy remain key barriers.',
      type: ItemType.ARTICLE,
      status: ItemStatus.PUBLISHED,
      year: 2022,
      divisionId: dept['MSS-ECO'].id,
      authors: [{ author: a2, order: 0 }, { author: a4, order: 1 }],
      subjectCodes: ['HB', 'HF'],
      keywords: ['microfinance', 'economic growth', 'poverty alleviation', 'Nigeria'],
    },
    {
      title: 'Phytochemical Screening and Antimicrobial Activity of Azadirachta indica (Neem) Leaf Extracts Against Selected Bacterial Pathogens',
      abstract: 'The increasing prevalence of antibiotic-resistant pathogens has stimulated research into plant-derived antimicrobial agents. This study investigated the phytochemical composition and antimicrobial activity of aqueous and ethanolic extracts of Azadirachta indica (neem) leaves against Staphylococcus aureus, Escherichia coli, Salmonella typhi, and Pseudomonas aeruginosa. The ethanolic extract demonstrated superior antimicrobial activity, with minimum inhibitory concentrations ranging from 6.25 to 25 mg/mL. The study supports the ethnomedicinal use of neem.',
      type: ItemType.ARTICLE,
      status: ItemStatus.PUBLISHED,
      year: 2021,
      divisionId: dept['NSE-BCH'].id,
      authors: [{ author: a10, order: 0 }, { author: a9, order: 1 }, { author: a5, order: 2 }],
      subjectCodes: ['QD', 'QH', 'QR'],
      keywords: ['microbiology', 'biochemistry', 'Nigeria'],
    },
    {
      title: 'Teacher Motivation and Student Academic Achievement in Secondary Schools in Enugu State',
      abstract: 'This study investigated the relationship between teacher motivation and student academic achievement in public secondary schools in Enugu State, Nigeria. A correlational survey design was employed, with a sample of 520 teachers and 1,260 students. Data were collected using the Teacher Motivation Scale and students\' WAEC results for three consecutive years. Results indicate a significant positive correlation (r = 0.67, p < 0.01) between teacher motivation and student achievement. Salary satisfaction and professional development opportunities were the strongest predictors of teacher motivation.',
      type: ItemType.THESIS,
      status: ItemStatus.PUBLISHED,
      year: 2020,
      divisionId: dept['EDU-BIO'].id,
      authors: [{ author: a6, order: 0 }],
      subjectCodes: ['L'],
      keywords: ['education policy', 'Nigeria', 'curriculum development'],
    },
    {
      title: 'African Philosophy and the Challenge of Modernity: An Igbo Perspective',
      abstract: 'This paper interrogates the relationship between African philosophical thought, particularly within the Igbo tradition of south-eastern Nigeria, and the challenges posed by Western modernity. Drawing on the works of Kwame Gyekye, Ifeanyi Menkiti, and C. S. Momoh, the study explores how core Igbo metaphysical concepts—including Mmadu (personhood), Chi (personal spirit), and Odinani—can offer constructive responses to contemporary ethical crises. The paper argues for a dialogical rather than assimilationist approach to the encounter between African and Western philosophical traditions.',
      type: ItemType.ARTICLE,
      status: ItemStatus.PUBLISHED,
      year: 2022,
      divisionId: dept['ART-PHI'].id,
      authors: [{ author: a8, order: 0 }, { author: a12, order: 1 }],
      subjectCodes: ['B'],
      keywords: ['philosophy', 'ethics', 'Nigeria'],
    },
    {
      title: 'Prevalence and Risk Factors of Type 2 Diabetes Mellitus among Adults in Urban Enugu, Nigeria',
      abstract: 'The global burden of type 2 diabetes mellitus (T2DM) is rising rapidly, with sub-Saharan Africa experiencing an accelerated epidemiological transition. This hospital-based cross-sectional study determined the prevalence and risk factors of T2DM among adults aged 18–70 years attending the outpatient clinic of Enugu State University Teaching Hospital. Of 1,246 participants screened, 187 (15.0%) had T2DM. Multivariable logistic regression identified age above 45 years, overweight/obesity, family history of diabetes, and physical inactivity as independent risk factors.',
      type: ItemType.ARTICLE,
      status: ItemStatus.PUBLISHED,
      year: 2023,
      divisionId: dept['MED-MDS'].id,
      authors: [{ author: a12, order: 0 }, { author: a1, order: 1 }],
      subjectCodes: ['RC', 'R'],
      keywords: ['public health', 'Nigeria', 'clinical medicine'],
    },
    {
      title: 'Comparative Study of Spectrophotometric Methods for Determination of Iron in Groundwater Samples',
      abstract: 'Accurate determination of iron in groundwater is essential for monitoring water quality and ensuring compliance with drinking water standards. This study compares three spectrophotometric methods—1,10-phenanthroline, ferrozine, and thiocyanate complexation—for the determination of total iron in groundwater samples from Enugu State. The ferrozine method demonstrated superior sensitivity (LOD: 0.003 mg/L), linearity (R² = 0.9998), and resistance to common interferences. Method validation was performed using certified reference materials. The ferrozine method is recommended for routine groundwater iron monitoring in resource-limited laboratories.',
      type: ItemType.ARTICLE,
      status: ItemStatus.PUBLISHED,
      year: 2023,
      divisionId: dept['NSE-CHM'].id,
      authors: [{ author: a7, order: 0 }],
      subjectCodes: ['QD', 'Q'],
      keywords: ['biochemistry', 'Nigeria', 'water treatment'],
    },
    {
      title: 'Impact of Social Media on Political Participation Among Nigerian University Students',
      abstract: 'This study examines the influence of social media platforms on political participation among undergraduate students at Godfrey Okoye University, Enugu. Using a mixed-methods approach combining survey questionnaires (n = 450) and focus group discussions, the study finds that social media significantly increases political awareness and civic engagement among young people. However, exposure to misinformation and political polarisation online remains a concern. Recommendations include digital literacy programmes and platform accountability measures for Nigerian social media users.',
      type: ItemType.ARTICLE,
      status: ItemStatus.PUBLISHED,
      year: 2022,
      divisionId: dept['MSS-MCM'].id,
      authors: [{ author: a2, order: 0 }, { author: a8, order: 1 }],
      subjectCodes: ['J', 'H'],
      keywords: ['Nigeria', 'education policy'],
    },
    {
      title: 'Forensic Accounting Techniques in the Detection and Prevention of Financial Fraud in Nigerian Banks',
      abstract: 'Financial fraud in the banking sector poses significant risks to economic stability and investor confidence. This study evaluates the effectiveness of forensic accounting techniques—including data analytics, digital forensics, and investigative auditing—in detecting and preventing financial fraud in selected commercial banks in Nigeria. A survey of 200 forensic accountants and internal auditors revealed that data analytics and continuous auditing are the most effective fraud detection tools. The study recommends mandatory forensic accounting training for internal audit teams in Nigerian financial institutions.',
      type: ItemType.THESIS,
      status: ItemStatus.PUBLISHED,
      year: 2021,
      divisionId: dept['MSS-ACC'].id,
      authors: [{ author: a1, order: 0 }, { author: a6, order: 1 }],
      subjectCodes: ['HF', 'K'],
      keywords: ['accounting', 'corporate governance', 'Nigeria', 'economic growth'],
    },
    {
      title: 'Nursing Care Practices and Patient Outcomes in Tertiary Hospitals in Enugu State',
      abstract: 'Quality nursing care is central to positive patient outcomes in hospital settings. This cross-sectional study assessed nursing care practices and their relationship to patient outcomes across three tertiary hospitals in Enugu State, Nigeria. Data were collected from 180 nurses and 360 patients using validated instruments. Findings indicate that adherence to evidence-based nursing protocols significantly reduces post-operative complications, length of hospital stay, and readmission rates. Staffing ratios, continuing education, and nursing leadership were identified as key determinants of care quality.',
      type: ItemType.ARTICLE,
      status: ItemStatus.PUBLISHED,
      year: 2022,
      divisionId: dept['MED-NRS'].id,
      authors: [{ author: a10, order: 0 }, { author: a12, order: 1 }],
      subjectCodes: ['R', 'RC'],
      keywords: ['nursing', 'public health', 'Nigeria', 'clinical medicine'],
    },
    {
      title: 'Cybersecurity Threat Landscape in Nigerian Financial Institutions: A Quantitative Analysis',
      abstract: 'The rapid digitalisation of banking services in Nigeria has brought significant cybersecurity challenges. This study quantitatively analyses cybersecurity threats, vulnerabilities, and incident response capabilities in fifteen Nigerian deposit money banks between 2020 and 2023. Using structured questionnaires and secondary data from the Nigeria Computer Emergency Response Team (ngCERT), the study identifies phishing, ransomware, and insider threats as the dominant attack vectors. Banks with dedicated cybersecurity operations centres reported 63% fewer successful attacks. The findings inform a proposed national cybersecurity framework for the Nigerian banking sector.',
      type: ItemType.CONFERENCE_PAPER,
      status: ItemStatus.PUBLISHED,
      year: 2023,
      divisionId: dept['CIT-CSC'].id,
      authors: [{ author: a3, order: 0 }, { author: a5, order: 1 }, { author: a11, order: 2 }],
      subjectCodes: ['T', 'HF'],
      keywords: ['information technology', 'computing', 'Nigeria'],
    },
  ]

  // ─── Create items ──────────────────────────────────────────────────────────
  for (const seed of itemSeeds) {
    const subjectIds = seed.subjectCodes
      .map(code => subjects.find(s => s.code === code)?.id)
      .filter(Boolean) as string[]

    const item = await prisma.item.create({
      data: {
        title:           seed.title,
        abstract:        seed.abstract,
        type:            seed.type,
        status:          seed.status,
        year:            seed.year,
        divisionId:      seed.divisionId,
        submittedById:   researcherUser.id,
        uri:             makeUri(seed.year),
        language:        'English',
      },
    })

    for (const { author, order } of seed.authors) {
      await prisma.itemAuthor.create({ data: { itemId: item.id, authorId: author.id, order } })
    }

    for (const subjectId of subjectIds) {
      await prisma.itemSubject.create({ data: { itemId: item.id, subjectId } })
    }

    for (const kw of seed.keywords) {
      const kwId = kwMap[kw]
      if (kwId) await prisma.itemKeyword.create({ data: { itemId: item.id, keywordId: kwId } })
    }
  }

  console.log('✅ Seed complete!')
  console.log(`   → ${itemSeeds.length} items created`)
  console.log(`   → ${authors.length} authors created`)
  console.log(`   → ${subjectData.length} subjects created`)
  console.log('   → Admin:      admin@gouni.edu.ng   / admin1234')
  console.log('   → Researcher: researcher@gouni.edu.ng / test1234')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
