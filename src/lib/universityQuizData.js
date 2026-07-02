// University-specific degree quiz data based on each university's faculties

export const universityQuizData = {
  'wits': {
    name: 'University of the Witwatersrand',
    icon: '🏛️',
    degrees: [
      {
        id: 'wits-commerce',
        name: 'Commerce, Law & Management',
        icon: '💼',
        questions: [
          {
            question: "What does the acronym CA(SA) stand for?",
            options: ["Certified Accountant (South Africa)", "Chartered Accountant (South Africa)", "Certified Auditor (South Africa)", "Chartered Auditor (South Africa)"],
            correctAnswerIndex: 1,
            explanation: "CA(SA) stands for Chartered Accountant (South Africa), which is the professional designation awarded by SAICA."
          },
          {
            question: "Which South African court is the highest court for constitutional matters?",
            options: ["Supreme Court of Appeal", "High Court", "Constitutional Court", "Magistrate's Court"],
            correctAnswerIndex: 2,
            explanation: "The Constitutional Court, located in Johannesburg on Constitution Hill, is the highest court for constitutional matters in South Africa."
          }
        ]
      },
      {
        id: 'wits-engineering',
        name: 'Engineering & the Built Environment',
        icon: '🔧',
        questions: [
          {
            question: "What is the primary material used in reinforced concrete?",
            options: ["Steel and concrete", "Wood and nails", "Glass and plastic", "Brick and mortar"],
            correctAnswerIndex: 0,
            explanation: "Reinforced concrete combines concrete's compressive strength with steel's tensile strength to create a strong building material."
          },
          {
            question: "What does CAD stand for in engineering design?",
            options: ["Computer Aided Design", "Central Analysis Database", "Certified Advanced Development", "Computer Automated Drafting"],
            correctAnswerIndex: 0,
            explanation: "CAD (Computer-Aided Design) software like SolidWorks and AutoCAD allows engineers to create precise 2D and 3D models."
          }
        ]
      },
      {
        id: 'wits-health',
        name: 'Health Sciences',
        icon: '🏥',
        questions: [
          {
            question: "Who performed the world's first heart transplant in 1967?",
            options: ["Dr Christiaan Barnard", "Dr Hamilton Naki", "Dr Chris Barnard", "Dr Marius Barnard"],
            correctAnswerIndex: 0,
            explanation: "Dr Christiaan Barnard performed the first human heart transplant at Groote Schuur Hospital in Cape Town."
          }
        ]
      },
      {
        id: 'wits-science',
        name: 'Science',
        icon: '🔬',
        questions: [
          {
            question: "Which famous fossil discovery is associated with Wits University?",
            options: ["Lucy", "Mrs Ples", "Little Foot", "Taung Child"],
            correctAnswerIndex: 2,
            explanation: "Little Foot is a nearly complete Australopithecus skeleton discovered in the Sterkfontein Caves, studied by Wits professor Ron Clarke."
          }
        ]
      }
    ]
  },
  'uct': {
    name: 'University of Cape Town',
    icon: '🏔️',
    degrees: [
      {
        id: 'uct-commerce',
        name: 'Commerce',
        icon: '💼',
        questions: [
          {
            question: "Which of the following is a key concept in microeconomics taught at UCT?",
            options: ["Supply and demand", "Fiscal policy", "Monetary policy", "Inflation targeting"],
            correctAnswerIndex: 0,
            explanation: "Supply and demand is a fundamental microeconomic concept that explains how prices are determined in markets."
          }
        ]
      },
      {
        id: 'uct-engineering',
        name: 'Engineering & the Built Environment',
        icon: '🔧',
        questions: [
          {
            question: "What type of engineering focuses on the design and construction of infrastructure like roads and bridges?",
            options: ["Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Chemical Engineering"],
            correctAnswerIndex: 1,
            explanation: "Civil Engineering deals with the design, construction, and maintenance of infrastructure such as roads, bridges, and buildings."
          }
        ]
      },
      {
        id: 'uct-health',
        name: 'Health Sciences',
        icon: '🏥',
        questions: [
          {
            question: "What is the Hippocratic Oath?",
            options: ["A legal contract", "An ethical oath taken by doctors", "A medical textbook", "A surgical procedure"],
            correctAnswerIndex: 1,
            explanation: "The Hippocratic Oath is an ethical pledge traditionally taken by physicians, with the core principle: 'First, do no harm.'"
          }
        ]
      },
      {
        id: 'uct-science',
        name: 'Science',
        icon: '🔬',
        questions: [
          {
            question: "What organelle is known as the 'powerhouse of the cell'?",
            options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"],
            correctAnswerIndex: 2,
            explanation: "Mitochondria produce ATP (energy currency) through cellular respiration."
          }
        ]
      }
    ]
  },
  'stellies': {
    name: 'Stellenbosch University',
    icon: '🍷',
    degrees: [
      {
        id: 'stellies-agri',
        name: 'AgriSciences',
        icon: '🌾',
        questions: [
          {
            question: "What is the study of viticulture?",
            options: ["Wine making", "Grape growing", "Soil science", "Plant breeding"],
            correctAnswerIndex: 1,
            explanation: "Viticulture is the science and practice of growing grapes, particularly for wine production."
          }
        ]
      },
      {
        id: 'stellies-commerce',
        name: 'Economic and Management Sciences',
        icon: '💼',
        questions: [
          {
            question: "What is GDP?",
            options: ["Gross Domestic Product", "General Domestic Product", "Government Development Plan", "Global Distribution Program"],
            correctAnswerIndex: 0,
            explanation: "GDP measures the total value of goods and services produced in a country."
          }
        ]
      },
      {
        id: 'stellies-health',
        name: 'Medicine and Health Sciences',
        icon: '🏥',
        questions: [
          {
            question: "What does 'pharmacokinetics' study?",
            options: ["Drug manufacturing", "How the body processes drugs", "Drug pricing", "Drug marketing"],
            correctAnswerIndex: 1,
            explanation: "Pharmacokinetics studies how drugs move through the body — absorption, distribution, metabolism, and excretion."
          }
        ]
      }
    ]
  },
  'up': {
    name: 'University of Pretoria',
    icon: '🐘',
    degrees: [
      {
        id: 'up-vet',
        name: 'Veterinary Science',
        icon: '🐕',
        questions: [
          {
            question: "What is the name of the disease that affects cattle and is caused by a prion?",
            options: ["Mad Cow Disease", "Foot and Mouth Disease", "Bovine Tuberculosis", "Brucellosis"],
            correctAnswerIndex: 0,
            explanation: "Mad Cow Disease (Bovine Spongiform Encephalopathy) is caused by a prion and is a serious concern in the cattle industry."
          }
        ]
      },
      {
        id: 'up-commerce',
        name: 'Economic and Management Sciences',
        icon: '💼',
        questions: [
          {
            question: "What does the acronym JSE stand for?",
            options: ["Johannesburg Stock Exchange", "Japan Securities Exchange", "Joint Savings Enterprise", "Johannesburg Securities Entity"],
            correctAnswerIndex: 0,
            explanation: "The JSE is the largest stock exchange in Africa, founded in 1887 during the gold rush."
          }
        ]
      },
      {
        id: 'up-engineering',
        name: 'Engineering, Built Environment and IT',
        icon: '🔧',
        questions: [
          {
            question: "What is Kirchhoff's Current Law?",
            options: ["Current flows from high to low voltage", "Total current entering a junction equals total current leaving", "Resistance increases with temperature", "Power equals voltage times current"],
            correctAnswerIndex: 1,
            explanation: "Kirchhoff's Current Law (KCL) states that the sum of currents entering a node equals the sum of currents leaving it."
          }
        ]
      }
    ]
  },
  'ukzn': {
    name: 'University of KwaZulu-Natal',
    icon: '🌊',
    degrees: [
      {
        id: 'ukzn-health',
        name: 'Health Sciences',
        icon: '🏥',
        questions: [
          {
            question: "What is the primary function of red blood cells?",
            options: ["Fighting infections", "Carrying oxygen", "Clotting blood", "Producing antibodies"],
            correctAnswerIndex: 1,
            explanation: "Red blood cells contain haemoglobin and are responsible for carrying oxygen from the lungs to the body's tissues."
          }
        ]
      },
      {
        id: 'ukzn-engineering',
        name: 'Engineering, Science and Agriculture',
        icon: '🔧',
        questions: [
          {
            question: "What is the Haber process used for?",
            options: ["Refining petroleum", "Synthesising ammonia", "Making steel", "Purifying water"],
            correctAnswerIndex: 1,
            explanation: "The Haber process combines nitrogen and hydrogen to produce ammonia, crucial for fertiliser production."
          }
        ]
      },
      {
        id: 'ukzn-commerce',
        name: 'Commerce, Administration and Law',
        icon: '💼',
        questions: [
          {
            question: "What does the term 'pro bono' mean in legal practice?",
            options: ["For profit", "For the public good", "For the prosecution", "For the defence"],
            correctAnswerIndex: 1,
            explanation: "Pro bono comes from Latin 'pro bono publico' meaning 'for the public good'."
          }
        ]
      }
    ]
  },
  'uj': {
    name: 'University of Johannesburg',
    icon: '🏙️',
    degrees: [
      {
        id: 'uj-art-design',
        name: 'Art, Design and Architecture',
        icon: '🎨',
        questions: [
          {
            question: "What software is industry-standard for 3D modelling and animation?",
            options: ["Photoshop", "Blender / Maya", "Excel", "PowerPoint"],
            correctAnswerIndex: 1,
            explanation: "Blender (free & open-source) and Maya (industry standard) are the go-to tools for 3D modelling and animation."
          }
        ]
      },
      {
        id: 'uj-commerce',
        name: 'Business and Economics',
        icon: '💼',
        questions: [
          {
            question: "What are the four P's of Marketing?",
            options: ["Price, Profit, Place, Promotion", "Product, Price, Place, Promotion", "Product, Profit, People, Process", "Price, Place, People, Promotion"],
            correctAnswerIndex: 1,
            explanation: "Product, Price, Place, and Promotion — this is the classic Marketing Mix developed by E. Jerome McCarthy."
          }
        ]
      },
      {
        id: 'uj-engineering',
        name: 'Engineering & the Built Environment',
        icon: '🔧',
        questions: [
          {
            question: "What is the unit of electrical resistance?",
            options: ["Volts", "Amps", "Ohms", "Watts"],
            correctAnswerIndex: 2,
            explanation: "Ohms (Ω) measure electrical resistance, named after Georg Ohm."
          }
        ]
      }
    ]
  },
  'nmu': {
    name: 'Nelson Mandela University',
    icon: '🐚',
    degrees: [
      {
        id: 'nmu-commerce',
        name: 'Business and Economic Sciences',
        icon: '💼',
        questions: [
          {
            question: "What is a SWOT analysis?",
            options: ["A financial ratio calculation", "A human resources framework", "An analysis of Strengths, Weaknesses, Opportunities, and Threats", "A supply chain management tool"],
            correctAnswerIndex: 2,
            explanation: "SWOT analysis is a strategic planning tool used to identify internal Strengths and Weaknesses, and external Opportunities and Threats."
          }
        ]
      },
      {
        id: 'nmu-engineering',
        name: 'Engineering, Built Environment and Technology',
        icon: '🔧',
        questions: [
          {
            question: "What is the first law of thermodynamics about?",
            options: ["Conservation of energy", "Entropy", "Heat transfer", "Work and power"],
            correctAnswerIndex: 0,
            explanation: "The first law of thermodynamics states that energy cannot be created or destroyed, only transferred or converted."
          }
        ]
      }
    ]
  },
  'nwu': {
    name: 'North-West University',
    icon: '🦁',
    degrees: [
      {
        id: 'nwu-theology',
        name: 'Theology',
        icon: '✝️',
        questions: [
          {
            question: "Who is considered the father of the Protestant Reformation?",
            options: ["John Calvin", "Martin Luther", "John Wesley", "Dietrich Bonhoeffer"],
            correctAnswerIndex: 1,
            explanation: "Martin Luther's posting of the 95 Theses in 1517 is considered the start of the Protestant Reformation."
          }
        ]
      },
      {
        id: 'nwu-commerce',
        name: 'Economic and Management Sciences',
        icon: '💼',
        questions: [
          {
            question: "Who is often called the 'father of management'?",
            options: ["Adam Smith", "Peter Drucker", "Henry Ford", "Warren Buffett"],
            correctAnswerIndex: 1,
            explanation: "Peter Drucker revolutionised modern management theory with concepts like 'management by objectives.'"
          }
        ]
      }
    ]
  },
  'ufs': {
    name: 'University of the Free State',
    icon: '🌅',
    degrees: [
      {
        id: 'ufs-theology',
        name: 'Theology and Religion',
        icon: '✝️',
        questions: [
          {
            question: "What is the study of the Bible called?",
            options: ["Theology", "Biblical Studies", "Divinity", "Hermeneutics"],
            correctAnswerIndex: 1,
            explanation: "Biblical Studies is the academic study of the Bible, including its historical, literary, and theological dimensions."
          }
        ]
      },
      {
        id: 'ufs-commerce',
        name: 'Economic and Management Sciences',
        icon: '💼',
        questions: [
          {
            question: "What is inflation?",
            options: ["A decrease in prices", "A general increase in prices over time", "An increase in employment", "A rise in the stock market"],
            correctAnswerIndex: 1,
            explanation: "Inflation is the rate at which the general level of prices for goods and services rises, eroding purchasing power."
          }
        ]
      }
    ]
  },
  'uwc': {
    name: 'University of the Western Cape',
    icon: '🌊',
    degrees: [
      {
        id: 'uwc-dentistry',
        name: 'Dentistry',
        icon: '🦷',
        questions: [
          {
            question: "What are the two types of tooth decay bacteria?",
            options: ["E. coli and Salmonella", "Streptococcus mutans and Lactobacillus", "Staphylococcus and Streptococcus", "MRSA and C. diff"],
            correctAnswerIndex: 1,
            explanation: "Streptococcus mutans initiates tooth decay by producing acid, and Lactobacillus progresses it."
          }
        ]
      },
      {
        id: 'uwc-community-health',
        name: 'Community and Health Sciences',
        icon: '🏥',
        questions: [
          {
            question: "What is the primary goal of physiotherapy?",
            options: ["Performing surgery", "Restoring movement and function", "Prescribing medication", "Mental health counselling"],
            correctAnswerIndex: 1,
            explanation: "Physiotherapy focuses on restoring, maintaining, and maximising movement and physical function."
          }
        ]
      }
    ]
  },
  'unisa': {
    name: 'University of South Africa',
    icon: '📚',
    degrees: [
      {
        id: 'unisa-accounting',
        name: 'Accounting Sciences',
        icon: '📊',
        questions: [
          {
            question: "What is the accounting equation?",
            options: ["Revenue - Expenses = Profit", "Assets = Liabilities + Equity", "Debits = Credits", "Cash In - Cash Out = Net Cash"],
            correctAnswerIndex: 1,
            explanation: "Assets = Liabilities + Equity is the foundation of double-entry bookkeeping."
          }
        ]
      },
      {
        id: 'unisa-education',
        name: 'Education',
        icon: '📖',
        questions: [
          {
            question: "What does 'CAPS' stand for in South African education?",
            options: ["Curriculum and Assessment Policy Statement", "Central Academic Planning System", "Comprehensive Academic Program Standards", "Core Assessment and Planning Strategy"],
            correctAnswerIndex: 0,
            explanation: "CAPS is the current curriculum framework for South African schools."
          }
        ]
      }
    ]
  },
  'tut': {
    name: 'Tshwane University of Technology',
    icon: '⚙️',
    degrees: [
      {
        id: 'tut-ict',
        name: 'Information and Communication Technology',
        icon: '💻',
        questions: [
          {
            question: "What does API stand for?",
            options: ["Application Programming Interface", "Advanced Program Interface", "Automated Processing Integration", "Application Process Interaction"],
            correctAnswerIndex: 0,
            explanation: "API allows different software applications to communicate with each other."
          }
        ]
      },
      {
        id: 'tut-engineering',
        name: 'Engineering and the Built Environment',
        icon: '🔧',
        questions: [
          {
            question: "What is a unit operation in chemical engineering?",
            options: ["A basic step in a chemical process like distillation or filtration", "A military operation", "A financial calculation", "A coding function"],
            correctAnswerIndex: 0,
            explanation: "Unit operations are fundamental steps in chemical processes like distillation, filtration, and heat exchange."
          }
        ]
      }
    ]
  },
  'cput': {
    name: 'Cape Peninsula University of Technology',
    icon: '🌊',
    degrees: [
      {
        id: 'cput-design',
        name: 'Informatics and Design',
        icon: '🎨',
        questions: [
          {
            question: "What is the difference between a speech disorder and a language disorder?",
            options: ["They are the same thing", "Speech = producing sounds; Language = understanding/using words and grammar", "Speech = written; Language = spoken", "Speech = adults; Language = children"],
            correctAnswerIndex: 1,
            explanation: "Speech disorders affect how sounds are produced, while language disorders affect understanding or using words and sentences."
          }
        ]
      },
      {
        id: 'cput-engineering',
        name: 'Engineering',
        icon: '🔧',
        questions: [
          {
            question: "What is the speed of light in a vacuum (approximately)?",
            options: ["300,000 m/s", "300,000 km/s", "300,000,000 m/s", "3,000 km/s"],
            correctAnswerIndex: 1,
            explanation: "Light travels at approximately 300,000 km/s (or 3 × 10⁸ m/s)."
          }
        ]
      }
    ]
  },
  'dut': {
    name: 'Durban University of Technology',
    icon: '🌴',
    degrees: [
      {
        id: 'dut-accounting',
        name: 'Accounting & Informatics',
        icon: '📊',
        questions: [
          {
            question: "What does IFRS stand for?",
            options: ["International Financial Reporting Standards", "International Finance Reporting System", "Integrated Financial Review Standards", "International Fiscal Regulatory Standards"],
            correctAnswerIndex: 0,
            explanation: "IFRS are the global accounting standards issued by the International Accounting Standards Board."
          }
        ]
      },
      {
        id: 'dut-engineering',
        name: 'Engineering & the Built Environment',
        icon: '🔧',
        questions: [
          {
            question: "What principle allows aircraft wings to generate lift?",
            options: ["Bernoulli's Principle and Newton's Laws", "Newton's Third Law only", "Gravitational force", "Electromagnetic force"],
            correctAnswerIndex: 0,
            explanation: "Lift is generated through a combination of Bernoulli's Principle (pressure differences) and Newton's Third Law (action-reaction)."
          }
        ]
      }
    ]
  },
  'rhodes': {
    name: 'Rhodes University',
    icon: '📖',
    degrees: [
      {
        id: 'rhodes-pharmacy',
        name: 'Pharmacy',
        icon: '💊',
        questions: [
          {
            question: "What is a contraindication?",
            options: ["A reason to take a medication", "A reason NOT to use a drug due to potential harm", "A drug interaction", "A side effect"],
            correctAnswerIndex: 1,
            explanation: "A contraindication is a condition that makes a particular treatment inadvisable, like aspirin in children due to the risk of Reye's syndrome."
          }
        ]
      },
      {
        id: 'rhodes-commerce',
        name: 'Commerce',
        icon: '💼',
        questions: [
          {
            question: "What does the 'invisible hand' concept in economics refer to?",
            options: ["Self-regulating nature of free markets", "Government regulation", "Central bank interventions", "Tax policy effects"],
            correctAnswerIndex: 0,
            explanation: "Adam Smith's 'invisible hand' suggests that individuals' self-interested actions in a free market unintentionally benefit society."
          }
        ]
      }
    ]
  }
};

// Get university-specific degree quiz
export const getUniversityDegrees = (universityId) => {
  return universityQuizData[universityId] || null;
};
