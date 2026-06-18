export const quizData = {
  categories: [
    {
      id: 'general-knowledge',
      name: 'General Knowledge',
      icon: '🧠',
      questions: [
        {
          question: "In what year did the Berlin Wall fall?",
          options: ["1987", "1989", "1991", "1993"],
          correctAnswerIndex: 1,
          explanation: "The Berlin Wall fell on November 9, 1989, marking the beginning of German reunification and the end of the Cold War era."
        },
        {
          question: "What is the chemical symbol for gold?",
          options: ["Go", "Gd", "Au", "Ag"],
          correctAnswerIndex: 2,
          explanation: "Au comes from the Latin word 'Aurum', meaning 'shining dawn'. Fun fact: South Africa was once the world's largest gold producer!"
        },
        {
          question: "What is the largest ocean on Earth?",
          options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
          correctAnswerIndex: 2,
          explanation: "The Pacific Ocean covers about 63 million square miles — more than all of Earth's land area combined!"
        },
        {
          question: "Which planet is known as the Red Planet?",
          options: ["Venus", "Mars", "Jupiter", "Saturn"],
          correctAnswerIndex: 1,
          explanation: "Mars gets its reddish appearance from iron oxide (rust) on its surface. It's our closest neighbour and a target for future human missions!"
        },
        {
          question: "Who painted the Mona Lisa?",
          options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"],
          correctAnswerIndex: 1,
          explanation: "Leonardo da Vinci painted the Mona Lisa between 1503-1519. It now hangs in the Louvre Museum in Paris and is the world's most visited painting."
        }
      ]
    },
    {
      id: 'south-african-trivia',
      name: 'South African Trivia',
      icon: '🇿🇦',
      questions: [
        {
          question: "How many official languages does South Africa have?",
          options: ["9", "10", "11", "12"],
          correctAnswerIndex: 2,
          explanation: "South Africa has 11 official languages, the most of any country in Africa! They include Zulu, Xhosa, Afrikaans, English, and more."
        },
        {
          question: "What is 'biltong' traditionally made from?",
          options: ["Chicken", "Fish", "Dried cured meat", "Vegetables"],
          correctAnswerIndex: 2,
          explanation: "Biltong is a form of dried, cured meat that originated in Southern Africa. It's usually made from beef but can be made from game meats like kudu or ostrich!"
        },
        {
          question: "What is the highest mountain in South Africa?",
          options: ["Table Mountain", "Drakensberg Peak", "Mafadi", "Kilimanjaro"],
          correctAnswerIndex: 2,
          explanation: "Mafadi stands at 3,450m and is located in the Drakensberg range on the border of KwaZulu-Natal and Lesotho. Table Mountain is only about 1,085m!"
        },
        {
          question: "Which South African city is known as the 'City of Gold'?",
          options: ["Cape Town", "Durban", "Johannesburg", "Pretoria"],
          correctAnswerIndex: 2,
          explanation: "Johannesburg got this nickname from the gold rush of 1886. The Witwatersrand Basin beneath Joburg holds the world's largest known gold deposits!"
        },
        {
          question: "Who was the first democratically elected president of South Africa?",
          options: ["F.W. de Klerk", "Thabo Mbeki", "Nelson Mandela", "Desmond Tutu"],
          correctAnswerIndex: 2,
          explanation: "Nelson Mandela was elected in 1994 after spending 27 years in prison. He served one term and remains a global symbol of peace and reconciliation."
        }
      ]
    },
    {
      id: 'campus-life',
      name: 'Campus Life',
      icon: '🏫',
      questions: [
        {
          question: "In what year was the University of the Witwatersrand founded?",
          options: ["1896", "1922", "1910", "1945"],
          correctAnswerIndex: 1,
          explanation: "Wits was founded in 1922, but its roots go back to 1896 as the South African School of Mines in Kimberley. It moved to Johannesburg in 1904."
        },
        {
          question: "What are the Wits University colours?",
          options: ["Red and White", "Blue and Gold", "Blue and White", "Green and Gold"],
          correctAnswerIndex: 1,
          explanation: "Wits' official colours are blue and gold (or yellow). You'll see these everywhere from academic gowns to the Wits rugby team!"
        },
        {
          question: "What is the name of the main Wits campus in Braamfontein?",
          options: ["East Campus", "West Campus", "Main Campus", "Education Campus"],
          correctAnswerIndex: 0,
          explanation: "The East Campus in Braamfontein is where most undergraduate lectures take place. Wits also has a West Campus, Education Campus, and Medical Campus."
        },
        {
          question: "What is the Wits motto 'Scientia et Labore' translated to English?",
          options: ["Knowledge is Power", "Through Science and Labour", "Learning and Leading", "Wisdom and Work"],
          correctAnswerIndex: 1,
          explanation: "'Scientia et Labore' means 'Through Science and Labour'. It reflects Wits' roots in mining education and its commitment to knowledge through hard work."
        },
        {
          question: "Which famous fossil discovery is associated with Wits University?",
          options: ["Lucy", "Mrs Ples", "Little Foot", "Taung Child"],
          correctAnswerIndex: 2,
          explanation: "Little Foot is a nearly complete Australopithecus skeleton discovered in the Sterkfontein Caves, studied extensively by Wits professor Ron Clarke."
        }
      ]
    },
    {
      id: 'current-affairs',
      name: 'Current Affairs',
      icon: '📰',
      questions: [
        {
          question: "What does the acronym BRICS stand for?",
          options: ["Brazil, Russia, India, China, South Africa", "Britain, Russia, Indonesia, Canada, Sweden", "Brazil, Romania, India, Chile, Spain", "Belgium, Russia, Ireland, China, Singapore"],
          correctAnswerIndex: 0,
          explanation: "BRICS is a group of major emerging economies. South Africa joined in 2010. The group recently expanded to include more members like Egypt and Ethiopia."
        },
        {
          question: "What is ChatGPT's parent company?",
          options: ["Google", "Meta", "OpenAI", "Microsoft"],
          correctAnswerIndex: 2,
          explanation: "OpenAI created ChatGPT, which was launched in November 2022. It sparked a global AI race and became the fastest-growing consumer app in history!"
        },
        {
          question: "Which country hosted the 2022 FIFA World Cup?",
          options: ["Russia", "Qatar", "USA", "Japan"],
          correctAnswerIndex: 1,
          explanation: "Qatar became the first Middle Eastern country to host the World Cup. Argentina won the tournament, with Messi finally lifting the trophy!"
        },
        {
          question: "Which stage of load shedding has South Africa historically experienced?",
          options: ["Stage 4 maximum", "Stage 6 maximum", "Stage 8 maximum", "Stage 10 maximum"],
          correctAnswerIndex: 1,
          explanation: "South Africa has experienced up to Stage 6 load shedding, which means shedding up to 6,000MW from the grid. Eskom has plans for up to Stage 8 but it hasn't been implemented."
        }
      ]
    },
    {
      id: 'science-technology',
      name: 'Science & Technology',
      icon: '🔬',
      questions: [
        {
          question: "What does AI stand for?",
          options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Integration", "Algorithmic Interface"],
          correctAnswerIndex: 1,
          explanation: "Artificial Intelligence refers to computer systems that can perform tasks typically requiring human intelligence, like learning, reasoning, and problem-solving."
        },
        {
          question: "What does DNA stand for?",
          options: ["Deoxyribonucleic Acid", "Dinitrogen Acid", "Dynamic Neural Algorithm", "Digital Network Architecture"],
          correctAnswerIndex: 0,
          explanation: "DNA (Deoxyribonucleic Acid) carries the genetic instructions for all living organisms. It was first described by Watson and Crick in 1953."
        },
        {
          question: "What is the name of SpaceX's reusable rocket?",
          options: ["Atlas V", "Falcon 9", "Saturn V", "New Glenn"],
          correctAnswerIndex: 1,
          explanation: "Falcon 9 was the first orbital-class rocket capable of re-flight. SpaceX has landed and reused Falcon 9 boosters over 200 times, revolutionizing space travel!"
        },
        {
          question: "What programming language is most associated with data science?",
          options: ["Java", "C++", "Python", "Ruby"],
          correctAnswerIndex: 2,
          explanation: "Python is the go-to language for data science thanks to libraries like pandas, NumPy, and scikit-learn. It's beginner-friendly and incredibly versatile!"
        }
      ]
    }
  ],
  degreeCategories: [
    {
      id: 'accounting',
      name: 'Accounting & Accounting Science',
      faculty: 'Commerce, Law & Management',
      icon: '📊',
      questions: [
        {
          question: "What does IFRS stand for?",
          options: ["International Finance Reporting System", "International Financial Reporting Standards", "Integrated Financial Review Standards", "International Fiscal Regulatory Standards"],
          correctAnswerIndex: 1,
          explanation: "IFRS are the global accounting standards issued by the International Accounting Standards Board (IASB). South Africa adopted IFRS in 2005!"
        },
        {
          question: "What is an audit in accounting?",
          options: ["A tax calculation", "An independent examination of financial statements", "A budget forecast", "A cost analysis"],
          correctAnswerIndex: 1,
          explanation: "An audit is an independent examination of financial information to express an opinion on whether the financial statements are fairly presented. The Big Four firms do most large company audits."
        },
        {
          question: "What is the accounting equation?",
          options: ["Revenue - Expenses = Profit", "Assets = Liabilities + Equity", "Debits = Credits", "Cash In - Cash Out = Net Cash"],
          correctAnswerIndex: 1,
          explanation: "Assets = Liabilities + Equity is the foundation of double-entry bookkeeping. Every transaction must keep this equation balanced. This is day one of accounting!"
        },
        {
          question: "Which of the Big Four accounting firms is currently the largest by revenue globally?",
          options: ["PwC", "Deloitte", "EY", "KPMG"],
          correctAnswerIndex: 1,
          explanation: "Deloitte has consistently been the largest of the Big Four by revenue. However, PwC often leads in specific markets like South Africa where it has a very strong presence!"
        },
        {
          question: "Which professional body governs chartered accountants in South Africa?",
          options: ["ACCA", "CIMA", "SAICA", "SAIPA"],
          correctAnswerIndex: 2,
          explanation: "SAICA (South African Institute of Chartered Accountants) is the premier accounting body in SA. Becoming a CA(SA) through SAICA is one of the most respected qualifications in the country!"
        }
      ]
    },
    {
      id: 'law',
      name: 'Law (LLB)',
      faculty: 'Commerce, Law & Management',
      icon: '⚖️',
      questions: [
        {
          question: "What does 'pro bono' mean in legal practice?",
          options: ["For profit", "For the public good", "For the prosecution", "For the defence"],
          correctAnswerIndex: 1,
          explanation: "Pro bono comes from Latin 'pro bono publico' meaning 'for the public good'. Lawyers provide free legal services to those who can't afford representation."
        },
        {
          question: "What is the Latin term for 'let the decision stand' in law?",
          options: ["Habeas corpus", "Stare decisis", "Pro bono", "Res judicata"],
          correctAnswerIndex: 1,
          explanation: "Stare decisis means courts should follow precedent. It creates consistency and predictability in the legal system — a fundamental principle you'll learn in LLB!"
        },
        {
          question: "What is the supreme law of South Africa?",
          options: ["Roman-Dutch Law", "The Constitution", "Common Law", "Customary Law"],
          correctAnswerIndex: 1,
          explanation: "The Constitution of the Republic of South Africa (1996) is the supreme law. Any law or conduct inconsistent with it is invalid. It's one of the most progressive constitutions in the world!"
        },
        {
          question: "Which chapter of the SA Constitution contains the Bill of Rights?",
          options: ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4"],
          correctAnswerIndex: 1,
          explanation: "Chapter 2 contains the Bill of Rights, which is the cornerstone of democracy in South Africa. It enshrines rights like equality, dignity, freedom of expression and more."
        },
        {
          question: "Which court is the highest court in South Africa for constitutional matters?",
          options: ["Supreme Court of Appeal", "High Court", "Constitutional Court", "Magistrate's Court"],
          correctAnswerIndex: 2,
          explanation: "The Constitutional Court, based in Johannesburg on Constitution Hill, is the highest court for constitutional matters and the final court of appeal since 2013."
        }
      ]
    },
    {
      id: 'commerce',
      name: 'Commerce (General/Finance/HR/Management)',
      faculty: 'Commerce, Law & Management',
      icon: '🏢',
      questions: [
        {
          question: "What are the four P's of Marketing?",
          options: ["Price, Profit, Place, Promotion", "Product, Price, Place, Promotion", "Product, Profit, People, Process", "Price, Place, People, Promotion"],
          correctAnswerIndex: 1,
          explanation: "Product, Price, Place, and Promotion — this is the classic Marketing Mix developed by E. Jerome McCarthy. Every BCom marketing student needs to know this by heart!"
        },
        {
          question: "What does JSE stand for?",
          options: ["Johannesburg Stock Exchange", "Japan Securities Exchange", "Joint Savings Enterprise", "Johannesburg Securities Entity"],
          correctAnswerIndex: 0,
          explanation: "The JSE (Johannesburg Stock Exchange) is the largest stock exchange in Africa. It was founded in 1887 during the gold rush and lists over 300 companies!"
        },
        {
          question: "What is a SWOT analysis?",
          options: ["A financial ratio calculation", "A human resources framework", "An analysis of Strengths, Weaknesses, Opportunities, and Threats", "A supply chain management tool"],
          correctAnswerIndex: 2,
          explanation: "SWOT analysis is a strategic planning tool used to identify internal Strengths and Weaknesses, and external Opportunities and Threats. It's one of the most widely used business frameworks!"
        },
        {
          question: "Who is often called the 'father of management'?",
          options: ["Adam Smith", "Peter Drucker", "Henry Ford", "Warren Buffett"],
          correctAnswerIndex: 1,
          explanation: "Peter Drucker revolutionised modern management theory. He coined concepts like 'management by objectives' and predicted the rise of the knowledge worker."
        }
      ]
    },
    {
      id: 'economics',
      name: 'Economics & Economic Science',
      faculty: 'Commerce, Law & Management',
      icon: '📈',
      questions: [
        {
          question: "What does the 'invisible hand' concept in economics refer to?",
          options: ["Government regulation", "Self-regulating nature of free markets", "Central bank interventions", "Tax policy effects"],
          correctAnswerIndex: 1,
          explanation: "Adam Smith's 'invisible hand' suggests that individuals' self-interested actions in a free market unintentionally benefit society. It's a cornerstone of classical economics!"
        },
        {
          question: "What is GDP?",
          options: ["General Domestic Product", "Gross Domestic Product", "Government Development Plan", "Global Distribution Program"],
          correctAnswerIndex: 1,
          explanation: "GDP (Gross Domestic Product) measures the total value of goods and services produced in a country. It's the most common measure of a country's economic health."
        },
        {
          question: "What is inflation?",
          options: ["The increase in the money supply", "A general increase in prices over time", "An increase in employment", "A rise in the stock market"],
          correctAnswerIndex: 1,
          explanation: "Inflation is the rate at which the general level of prices for goods and services rises, eroding purchasing power. The SA Reserve Bank targets inflation between 3-6%."
        },
        {
          question: "What is the South African Reserve Bank's primary mandate?",
          options: ["Job creation", "Price stability", "Economic growth", "Wealth redistribution"],
          correctAnswerIndex: 1,
          explanation: "SARB's primary mandate is to protect the value of the rand and maintain price stability (keeping inflation in check). It does this mainly through adjusting the repo rate."
        }
      ]
    },
    {
      id: 'information-systems',
      name: 'Information Systems',
      faculty: 'Commerce, Law & Management',
      icon: '💻',
      questions: [
        {
          question: "What does ERP stand for in business IT?",
          options: ["Enterprise Resource Planning", "Electronic Records Processing", "Efficient Reporting Protocol", "Enterprise Risk Platform"],
          correctAnswerIndex: 0,
          explanation: "ERP (Enterprise Resource Planning) systems like SAP and Oracle integrate all business processes — finance, HR, supply chain — into one unified system."
        },
        {
          question: "What is 'agile methodology' in software development?",
          options: ["A waterfall approach", "An iterative approach with short sprints", "A documentation-heavy process", "A single-developer workflow"],
          correctAnswerIndex: 1,
          explanation: "Agile uses short development cycles called 'sprints' (usually 2 weeks) to deliver working software incrementally. It's the most popular development methodology today!"
        },
        {
          question: "Which of these is a common database query language?",
          options: ["HTML", "CSS", "SQL", "XML"],
          correctAnswerIndex: 2,
          explanation: "SQL (Structured Query Language) is used to manage and query relational databases. It's essential for any Information Systems professional!"
        }
      ]
    },
    {
      id: 'politics-philosophy-economics',
      name: 'Politics, Philosophy & Economics',
      faculty: 'Commerce, Law & Management',
      icon: '📚',
      questions: [
        {
          question: "What is utilitarianism?",
          options: ["A legal theory", "An ethical theory that maximises overall happiness", "An economic model", "A political system"],
          correctAnswerIndex: 1,
          explanation: "Utilitarianism, developed by Bentham and Mill, judges actions by their outcomes — the greatest good for the greatest number. It's a key ethical framework in PPE studies!"
        },
        {
          question: "Who wrote 'The Republic', a foundational text in political philosophy?",
          options: ["Aristotle", "Plato", "Socrates", "Machiavelli"],
          correctAnswerIndex: 1,
          explanation: "Plato wrote 'The Republic' around 375 BC. It explores justice, the ideal state, and the famous 'Allegory of the Cave'. Essential reading for PPE students!"
        }
      ]
    },
    {
      id: 'computer-science',
      name: 'Computer Science',
      faculty: 'Science',
      icon: '💻',
      questions: [
        {
          question: "What data structure uses FIFO (First In, First Out)?",
          options: ["Stack", "Queue", "Tree", "Hash Map"],
          correctAnswerIndex: 1,
          explanation: "A Queue follows FIFO — like a line at the campus cafeteria! The first person in line is the first one served. Stacks use LIFO (Last In, First Out)."
        },
        {
          question: "What does API stand for?",
          options: ["Advanced Program Interface", "Application Programming Interface", "Automated Processing Integration", "Application Process Interaction"],
          correctAnswerIndex: 1,
          explanation: "API (Application Programming Interface) allows different software applications to communicate with each other. When you use an app that shows weather data, it's using an API!"
        },
        {
          question: "What does O(n) mean in algorithm complexity?",
          options: ["The algorithm runs once", "Time grows linearly with input size", "The algorithm is optimal", "It requires n computers"],
          correctAnswerIndex: 1,
          explanation: "Big O notation O(n) means the algorithm's time grows linearly with the input size. Understanding algorithmic complexity is fundamental to writing efficient code!"
        },
        {
          question: "What is recursion in programming?",
          options: ["A loop that runs forever", "A function that calls itself", "A type of variable", "A sorting algorithm"],
          correctAnswerIndex: 1,
          explanation: "Recursion is when a function calls itself to solve a problem by breaking it into smaller sub-problems. Classic example: calculating factorial — 5! = 5 × 4! = 5 × 4 × 3!..."
        },
        {
          question: "What programming paradigm does Java primarily use?",
          options: ["Functional programming", "Object-Oriented Programming", "Procedural programming", "Logic programming"],
          correctAnswerIndex: 1,
          explanation: "Java is primarily an Object-Oriented Programming (OOP) language. OOP organises code into objects with properties and methods. Wits CS students learn Java early on!"
        }
      ]
    },
    {
      id: 'actuarial-science',
      name: 'Actuarial Science',
      faculty: 'Science',
      icon: '📊',
      questions: [
        {
          question: "What does an actuary primarily assess?",
          options: ["Marketing strategies", "Financial risk and uncertainty", "Legal compliance", "Product design"],
          correctAnswerIndex: 1,
          explanation: "Actuaries use mathematics, statistics, and financial theory to study uncertain future events, especially in insurance and pensions. It's one of the highest-paying professions in SA!"
        },
        {
          question: "What is the present value of future cash flows called in actuarial science?",
          options: ["Net worth", "Discounted cash flow", "Gross value", "Market value"],
          correctAnswerIndex: 1,
          explanation: "Discounted Cash Flow (DCF) calculates the present value of expected future cash flows using a discount rate. It's a fundamental concept in actuarial valuations and corporate finance!"
        }
      ]
    },
    {
      id: 'biological-sciences',
      name: 'Biological Sciences',
      faculty: 'Science',
      icon: '🧬',
      questions: [
        {
          question: "What is DNA replication?",
          options: ["Protein synthesis", "The process of copying DNA before cell division", "Gene mutation", "RNA transcription"],
          correctAnswerIndex: 1,
          explanation: "DNA replication creates an identical copy of the DNA molecule before a cell divides. It's semi-conservative — each new molecule keeps one original strand. Discovered by Meselson & Stahl!"
        },
        {
          question: "What organelle is known as the 'powerhouse of the cell'?",
          options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"],
          correctAnswerIndex: 2,
          explanation: "Mitochondria produce ATP (energy currency) through cellular respiration. Fun fact: they have their own DNA, supporting the endosymbiotic theory — they were once independent organisms!"
        }
      ]
    },
    {
      id: 'chemistry-materials',
      name: 'Chemistry & Materials Science',
      faculty: 'Science',
      icon: '🧪',
      questions: [
        {
          question: "What is the periodic table element with atomic number 1?",
          options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
          correctAnswerIndex: 1,
          explanation: "Hydrogen is the simplest and most abundant element in the universe. It has just one proton and one electron. Stars like our Sun are mostly hydrogen!"
        },
        {
          question: "What is the pH of a neutral solution?",
          options: ["0", "7", "14", "1"],
          correctAnswerIndex: 1,
          explanation: "pH 7 is neutral (like pure water). Below 7 is acidic, above 7 is basic/alkaline. The pH scale is logarithmic — each unit represents a 10-fold change!"
        }
      ]
    },
    {
      id: 'civil-engineering',
      name: 'Civil Engineering',
      faculty: 'Engineering & Built Environment',
      icon: '🏗️',
      questions: [
        {
          question: "What is the primary material used in reinforced concrete?",
          options: ["Wood and nails", "Steel and concrete", "Glass and plastic", "Brick and mortar"],
          correctAnswerIndex: 1,
          explanation: "Reinforced concrete combines concrete's compressive strength with steel's tensile strength. It's the most widely used construction material in the world — civil engineers design with it daily!"
        },
        {
          question: "What type of stress does a beam experience when a load is applied at its centre?",
          options: ["Only tension", "Only compression", "Both tension and compression (bending)", "Only shear"],
          correctAnswerIndex: 2,
          explanation: "A loaded beam experiences bending — the top compresses while the bottom stretches in tension. Understanding this is fundamental to structural engineering!"
        }
      ]
    },
    {
      id: 'electrical-engineering',
      name: 'Electrical Engineering',
      faculty: 'Engineering & Built Environment',
      icon: '⚡',
      questions: [
        {
          question: "What is Kirchhoff's Current Law?",
          options: ["Current flows from high to low voltage", "Total current entering a junction equals total current leaving", "Resistance increases with temperature", "Power equals voltage times current"],
          correctAnswerIndex: 1,
          explanation: "Kirchhoff's Current Law (KCL) states that the sum of currents entering a node must equal the sum of currents leaving it. It's based on conservation of charge — fundamental to circuit analysis!"
        },
        {
          question: "What unit is electrical resistance measured in?",
          options: ["Volts", "Amps", "Ohms", "Watts"],
          correctAnswerIndex: 2,
          explanation: "Ohms (Ω), named after Georg Ohm, measure electrical resistance. Ohm's Law (V = IR) is one of the first things you learn in electrical engineering!"
        }
      ]
    },
    {
      id: 'mechanical-engineering',
      name: 'Mechanical Engineering',
      faculty: 'Engineering & Built Environment',
      icon: '🔧',
      questions: [
        {
          question: "What are the three laws of thermodynamics about in engineering?",
          options: ["Motion and forces", "Energy, heat, and entropy", "Electrical circuits", "Fluid dynamics"],
          correctAnswerIndex: 1,
          explanation: "Thermodynamics deals with energy, heat transfer, and entropy. The laws govern everything from engines to refrigerators — absolutely core to mechanical engineering!"
        },
        {
          question: "What does CAD stand for in engineering design?",
          options: ["Computer Aided Design", "Central Analysis Database", "Certified Advanced Development", "Computer Automated Drafting"],
          correctAnswerIndex: 0,
          explanation: "CAD (Computer-Aided Design) software like SolidWorks and AutoCAD lets engineers create precise 2D and 3D models. It's replaced hand-drawing and is essential for all mechanical engineers!"
        }
      ]
    },
    {
      id: 'chemical-engineering',
      name: 'Chemical Engineering',
      faculty: 'Engineering & Built Environment',
      icon: '🧪',
      questions: [
        {
          question: "What is a unit operation in chemical engineering?",
          options: ["A military operation", "A basic step in a chemical process like distillation or filtration", "A financial calculation", "A coding function"],
          correctAnswerIndex: 1,
          explanation: "Unit operations are fundamental steps in chemical processes — distillation, filtration, heat exchange, etc. They're the building blocks chemical engineers use to design industrial processes!"
        },
        {
          question: "What is the Haber process used for?",
          options: ["Refining petroleum", "Synthesising ammonia", "Making steel", "Purifying water"],
          correctAnswerIndex: 1,
          explanation: "The Haber process combines nitrogen and hydrogen to produce ammonia at high temperature and pressure. It's crucial for fertiliser production and feeds nearly half the world's population!"
        }
      ]
    },
    {
      id: 'mining-engineering',
      name: 'Mining Engineering',
      faculty: 'Engineering & Built Environment',
      icon: '⛏️',
      questions: [
        {
          question: "South Africa is the world's largest producer of which mineral?",
          options: ["Gold", "Platinum", "Diamonds", "Copper"],
          correctAnswerIndex: 1,
          explanation: "South Africa produces about 70% of the world's platinum from the Bushveld Igneous Complex. The mining industry contributes significantly to SA's economy!"
        },
        {
          question: "What is the difference between an open-pit mine and an underground mine?",
          options: ["There is no difference", "Open-pit is surface mining; underground has tunnels below the surface", "Open-pit is smaller", "Underground mines use water, open-pit uses explosives"],
          correctAnswerIndex: 1,
          explanation: "Open-pit mining removes material from the surface in a large pit, while underground mining accesses ore through shafts and tunnels. SA uses both — gold mines go over 3km deep!"
        }
      ]
    },
    {
      id: 'biomedical-engineering',
      name: 'Biomedical Engineering',
      faculty: 'Engineering & Built Environment',
      icon: '🏥',
      questions: [
        {
          question: "What does an MRI machine use to create images of the body?",
          options: ["X-rays", "Ultrasound waves", "Magnetic fields and radio waves", "Gamma rays"],
          correctAnswerIndex: 2,
          explanation: "MRI (Magnetic Resonance Imaging) uses powerful magnets and radio waves to create detailed images of organs and tissues. It's a key tool in biomedical engineering!"
        }
      ]
    },
    {
      id: 'architecture',
      name: 'Architecture & Built Environment',
      faculty: 'Engineering & Built Environment',
      icon: '🏛️',
      questions: [
        {
          question: "Who designed the Constitutional Court building in Johannesburg?",
          options: ["Norman Foster", "OMM Design Workshop & Urban Solutions", "Zaha Hadid", "Le Corbusier"],
          correctAnswerIndex: 1,
          explanation: "The Constitutional Court was designed by OMM Design Workshop and Urban Solutions. It's built on the site of the Old Fort Prison, symbolising SA's transition from oppression to democracy."
        }
      ]
    },
    {
      id: 'aeronautical-engineering',
      name: 'Aeronautical Engineering',
      faculty: 'Engineering & Built Environment',
      icon: '✈️',
      questions: [
        {
          question: "What is Mach number in aeronautics?",
          options: ["Engine power rating", "The ratio of aircraft speed to the speed of sound", "Wing span measurement", "Fuel efficiency rating"],
          correctAnswerIndex: 1,
          explanation: "Mach 1 = the speed of sound (≈343 m/s at sea level). Mach 2 = twice the speed of sound. The Concorde flew at Mach 2.04! Understanding Mach numbers is crucial for aeronautical engineers."
        },
        {
          question: "What principle allows aircraft wings to generate lift?",
          options: ["Newton's Third Law only", "Bernoulli's Principle and Newton's Laws", "Gravitational force", "Electromagnetic force"],
          correctAnswerIndex: 1,
          explanation: "Lift is generated through a combination of Bernoulli's Principle (pressure differences) and Newton's Third Law (action-reaction). The wing shape deflects air downward, pushing the plane up!"
        }
      ]
    },
    {
      id: 'industrial-engineering',
      name: 'Industrial Engineering',
      faculty: 'Engineering & Built Environment',
      icon: '🏭',
      questions: [
        {
          question: "What does operations research focus on?",
          options: ["Marketing strategies", "Making better decisions using mathematical models", "Human resources management", "Product design"],
          correctAnswerIndex: 1,
          explanation: "Operations Research (OR) uses mathematical modelling, statistics, and algorithms to find optimal solutions. Industrial engineers use OR to optimise supply chains, scheduling, and logistics!"
        },
        {
          question: "What is a Gantt chart used for?",
          options: ["Financial reporting", "Project scheduling and timeline visualization", "Chemical analysis", "Circuit design"],
          correctAnswerIndex: 1,
          explanation: "Gantt charts visually display project tasks against a timeline, showing start/end dates and dependencies. Industrial engineers use them extensively for project management!"
        }
      ]
    },
    {
      id: 'medicine',
      name: 'Medicine (MBChB)',
      faculty: 'Health Sciences',
      icon: '🩺',
      questions: [
        {
          question: "Chris Barnard, a South African, performed the world's first what in 1967?",
          options: ["Brain surgery", "Heart transplant", "Kidney transplant", "Lung transplant"],
          correctAnswerIndex: 1,
          explanation: "Dr Christiaan Barnard performed the first human heart transplant at Groote Schuur Hospital in Cape Town. South African medicine made world history that day!"
        },
        {
          question: "What is the Hippocratic Oath?",
          options: ["A legal contract", "An ethical oath taken by doctors", "A medical textbook", "A surgical procedure"],
          correctAnswerIndex: 1,
          explanation: "The Hippocratic Oath is an ethical pledge traditionally taken by physicians. Its core principle: 'First, do no harm' (primum non nocere). Medical students at Wits take a modern version!"
        },
        {
          question: "Which bone is the longest in the human body?",
          options: ["Humerus", "Tibia", "Femur", "Fibula"],
          correctAnswerIndex: 2,
          explanation: "The femur (thigh bone) is the longest and strongest bone in the body. It can support up to 30 times the weight of an adult — that's engineering at its finest, by nature!"
        },
        {
          question: "Which organ produces insulin in the body?",
          options: ["Liver", "Kidney", "Pancreas", "Spleen"],
          correctAnswerIndex: 2,
          explanation: "The pancreas produces insulin through its beta cells in the islets of Langerhans. When this fails, it leads to diabetes — a major health concern in South Africa."
        }
      ]
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy',
      faculty: 'Health Sciences',
      icon: '💊',
      questions: [
        {
          question: "What does 'pharmacokinetics' study?",
          options: ["Drug manufacturing", "How the body processes drugs", "Drug pricing", "Drug marketing"],
          correctAnswerIndex: 1,
          explanation: "Pharmacokinetics studies how drugs move through the body — absorption, distribution, metabolism, and excretion (ADME). It determines dosing and drug interactions!"
        },
        {
          question: "What is a contraindication?",
          options: ["A reason to take a medication", "A reason NOT to use a drug due to potential harm", "A drug interaction", "A side effect"],
          correctAnswerIndex: 1,
          explanation: "A contraindication is a condition that makes a particular treatment inadvisable. For example, aspirin is contraindicated in children due to the risk of Reye's syndrome."
        }
      ]
    },
    {
      id: 'nursing',
      name: 'Nursing',
      faculty: 'Health Sciences',
      icon: '👩‍⚕️',
      questions: [
        {
          question: "What are the 'vital signs' nurses routinely check?",
          options: ["Height, weight, BMI", "Temperature, pulse, respiration, blood pressure", "Blood type, allergies, medications", "Vision, hearing, reflexes"],
          correctAnswerIndex: 1,
          explanation: "The four main vital signs are temperature, pulse rate, respiratory rate, and blood pressure. These are the foundation of patient assessment in nursing!"
        },
        {
          question: "What does the abbreviation 'BP' stand for in nursing observations?",
          options: ["Body Position", "Blood Pressure", "Breathing Pattern", "Basic Procedure"],
          correctAnswerIndex: 1,
          explanation: "BP stands for Blood Pressure — one of the vital signs nurses monitor. Normal adult BP is around 120/80 mmHg. It's one of the first things you learn to measure!"
        }
      ]
    },
    {
      id: 'dentistry',
      name: 'Dentistry & Oral Health',
      faculty: 'Health Sciences',
      icon: '🦷',
      questions: [
        {
          question: "What are the two types of tooth decay bacteria?",
          options: ["E. coli and Salmonella", "Streptococcus mutans and Lactobacillus", "Staphylococcus and Streptococcus", "MRSA and C. diff"],
          correctAnswerIndex: 1,
          explanation: "Streptococcus mutans initiates tooth decay by producing acid, and Lactobacillus progresses it. That's why dentists always say to brush after eating sugar!"
        }
      ]
    },
    {
      id: 'physiotherapy',
      name: 'Physiotherapy & Occupational Therapy',
      faculty: 'Health Sciences',
      icon: '💪',
      questions: [
        {
          question: "What is the primary goal of physiotherapy?",
          options: ["Performing surgery", "Restoring movement and function", "Prescribing medication", "Mental health counselling"],
          correctAnswerIndex: 1,
          explanation: "Physiotherapy focuses on restoring, maintaining, and maximising movement and physical function. Physios work with everyone from sports injuries to post-stroke rehabilitation!"
        }
      ]
    },
    {
      id: 'biomedical-health',
      name: 'Biomedical & Health Sciences',
      faculty: 'Health Sciences',
      icon: '🔬',
      questions: [
        {
          question: "What is biokinetics?",
          options: ["Study of biomes", "Exercise science for health and rehabilitation", "Genetic engineering", "Biochemical analysis"],
          correctAnswerIndex: 1,
          explanation: "Biokinetics is a South African-unique profession focused on using exercise as medicine for health, rehabilitation, and performance. Biokineticists prescribe individualised exercise programs!"
        }
      ]
    },
    {
      id: 'humanities',
      name: 'Humanities',
      faculty: 'Humanities',
      icon: '📚',
      questions: [
        {
          question: "What does IR stand for in political studies?",
          options: ["Internal Revenue", "International Relations", "Industrial Regulation", "Information Resources"],
          correctAnswerIndex: 1,
          explanation: "International Relations studies how countries and global actors interact — diplomacy, conflict, trade, and global governance. It's a popular BA major at Wits!"
        },
        {
          question: "What is the study of psychology primarily concerned with?",
          options: ["Physical health", "Mind and behaviour", "Political systems", "Economic models"],
          correctAnswerIndex: 1,
          explanation: "Psychology is the scientific study of mind and behaviour. BA students at Wits can major in Psychology — it's one of the most popular majors!"
        },
        {
          question: "Who is the father of sociology?",
          options: ["Sigmund Freud", "Karl Marx", "Auguste Comte", "Max Weber"],
          correctAnswerIndex: 2,
          explanation: "Auguste Comte coined the term 'sociology' in 1838. He believed society could be studied scientifically, just like the natural world. Marx and Weber came later!"
        }
      ]
    },
    {
      id: 'education',
      name: 'Education',
      faculty: 'Humanities',
      icon: '📖',
      questions: [
        {
          question: "What does 'CAPS' stand for in South African education?",
          options: ["Central Academic Planning System", "Curriculum and Assessment Policy Statement", "Comprehensive Academic Program Standards", "Core Assessment and Planning Strategy"],
          correctAnswerIndex: 1,
          explanation: "CAPS (Curriculum and Assessment Policy Statement) is the current curriculum framework for South African schools. Education students at Wits learn to teach within this framework!"
        },
        {
          question: "What teaching methodology emphasises learning by doing?",
          options: ["Rote learning", "Experiential learning", "Lecture-based learning", "Memorisation"],
          correctAnswerIndex: 1,
          explanation: "Experiential learning, championed by David Kolb, emphasises learning through experience and reflection. It's a cornerstone of modern education theory at Wits School of Education!"
        }
      ]
    },
    {
      id: 'film-theatre',
      name: 'Film, Theatre & Fine Arts',
      faculty: 'Humanities',
      icon: '🎭',
      questions: [
        {
          question: "What is the 'fourth wall' in theatre?",
          options: ["The back wall of the stage", "The imaginary wall between performers and audience", "The lighting rig", "The wings of the stage"],
          correctAnswerIndex: 1,
          explanation: "The fourth wall is the invisible barrier between the stage and the audience. 'Breaking the fourth wall' means directly addressing the audience — a powerful dramatic technique!"
        },
        {
          question: "Who directed the South African film 'Tsotsi' that won an Academy Award?",
          options: ["Neill Blomkamp", "Gavin Hood", "Oliver Hermanus", "John Trengrove"],
          correctAnswerIndex: 1,
          explanation: "Gavin Hood directed Tsotsi (2005), which won the Oscar for Best Foreign Language Film. It's set in Soweto and is a must-watch for any SA film student!"
        }
      ]
    },
    {
      id: 'music',
      name: 'Music',
      faculty: 'Humanities',
      icon: '🎵',
      questions: [
        {
          question: "How many notes are in a chromatic scale?",
          options: ["7", "8", "12", "14"],
          correctAnswerIndex: 2,
          explanation: "A chromatic scale has 12 notes (semitones) before repeating at the octave. The major and minor scales select 7 of these 12 notes!"
        }
      ]
    },
    {
      id: 'social-work',
      name: 'Social Work & Community Development',
      faculty: 'Humanities',
      icon: '🤝',
      questions: [
        {
          question: "What is the primary role of a social worker?",
          options: ["Teaching children", "Supporting vulnerable individuals and communities", "Medical treatment", "Legal representation"],
          correctAnswerIndex: 1,
          explanation: "Social workers support individuals, families, and communities facing challenges like poverty, abuse, and mental health issues. They're essential for social justice in South Africa!"
        }
      ]
    },
    {
      id: 'speech-pathology',
      name: 'Speech-Language Pathology & Audiology',
      faculty: 'Humanities',
      icon: '🗣️',
      questions: [
        {
          question: "What is the difference between a speech disorder and a language disorder?",
          options: ["They are the same thing", "Speech = producing sounds; Language = understanding/using words and grammar", "Speech = written; Language = spoken", "Speech = adults; Language = children"],
          correctAnswerIndex: 1,
          explanation: "Speech disorders affect how sounds are produced (like stuttering), while language disorders affect understanding or using words and sentences. Speech-Language Pathologists treat both!"
        }
      ]
    },
    {
      id: 'geological-sciences',
      name: 'Geological & Geographical Sciences',
      faculty: 'Science',
      icon: '🌍',
      questions: [
        {
          question: "What is GIS?",
          options: ["General Internet Service", "Geographic Information System", "Global Investment Strategy", "Geological Investigation Service"],
          correctAnswerIndex: 1,
          explanation: "GIS (Geographic Information System) captures, stores, and analyses spatial and geographic data. It's used in urban planning, environmental science, and mining — huge in SA!"
        },
        {
          question: "What is the Mohs scale used to measure?",
          options: ["Earthquake intensity", "Mineral hardness", "Wind speed", "Temperature"],
          correctAnswerIndex: 1,
          explanation: "The Mohs scale ranks minerals from 1 (talc, softest) to 10 (diamond, hardest). Geologists use it in the field to identify minerals — essential for SA's mining geology!"
        }
      ]
    },
    {
      id: 'environmental-studies',
      name: 'Environmental Studies',
      faculty: 'Science',
      icon: '🌿',
      questions: [
        {
          question: "What is biodiversity?",
          options: ["The study of biology", "The variety of life in an ecosystem", "A type of biofuel", "A conservation organisation"],
          correctAnswerIndex: 1,
          explanation: "Biodiversity refers to the variety of all living things in an ecosystem. South Africa is one of the world's most biodiverse countries, with three biodiversity hotspots!"
        },
        {
          question: "What is the greenhouse effect?",
          options: ["Plants growing in greenhouses", "Trapping of heat in Earth's atmosphere by certain gases", "UV radiation damage", "Acid rain formation"],
          correctAnswerIndex: 1,
          explanation: "The greenhouse effect occurs when gases like CO₂ and methane trap heat in the atmosphere. A natural greenhouse effect keeps Earth warm, but human activity is enhancing it, causing climate change!"
        }
      ]
    },
    {
      id: 'mathematics',
      name: 'Mathematics & Applied Maths',
      faculty: 'Science',
      icon: '➗',
      questions: [
        {
          question: "What is a prime number?",
          options: ["A number divisible by 2", "A number only divisible by 1 and itself", "Any odd number", "A negative number"],
          correctAnswerIndex: 1,
          explanation: "Prime numbers (2, 3, 5, 7, 11...) are only divisible by 1 and themselves. They're the building blocks of number theory and are crucial in modern cryptography!"
        },
        {
          question: "What is the Pythagorean theorem?",
          options: ["a + b = c", "a² + b² = c²", "a × b = c", "a/b = c"],
          correctAnswerIndex: 1,
          explanation: "In a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides. Ancient but still fundamental in engineering, physics, and architecture!"
        }
      ]
    },
    {
      id: 'physics-astronomy',
      name: 'Physics & Astronomy',
      faculty: 'Science',
      icon: '🌌',
      questions: [
        {
          question: "What is Schrödinger's cat thought experiment about?",
          options: ["Animal behaviour", "Quantum superposition", "Classical mechanics", "Thermodynamics"],
          correctAnswerIndex: 1,
          explanation: "Schrödinger's cat illustrates the concept of quantum superposition — the cat is both alive and dead until observed. It shows how quantum mechanics defies everyday intuition!"
        },
        {
          question: "What is the speed of light in a vacuum (approximately)?",
          options: ["300,000 m/s", "300,000 km/s", "300,000,000 m/s", "3,000 km/s"],
          correctAnswerIndex: 1,
          explanation: "Light travels at approximately 300,000 km/s (or 3 × 10⁸ m/s). Einstein showed nothing with mass can reach this speed — it's the cosmic speed limit!"
        }
      ]
    },
    {
      id: 'digital-arts',
      name: 'Digital Arts (Engineering)',
      faculty: 'Engineering & Built Environment',
      icon: '🎨',
      questions: [
        {
          question: "What software is industry-standard for 3D modelling and animation?",
          options: ["Photoshop", "Blender / Maya", "Excel", "PowerPoint"],
          correctAnswerIndex: 1,
          explanation: "Blender (free & open-source) and Maya (industry standard) are the go-to tools for 3D modelling, animation, and visual effects in the digital arts world."
        }
      ]
    }
  ]
};
