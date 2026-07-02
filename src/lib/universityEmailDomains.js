// University student email domain formats
// When a user signs up, their email must match the domain format for their selected university

export const universityEmailDomains = {
  'wits': {
    name: 'University of the Witwatersrand',
    domains: ['students.wits.ac.za', 'wits.ac.za'],
    format: 'studentnumber@students.wits.ac.za',
    description: 'Wits student email (e.g., 1234567@students.wits.ac.za)'
  },
  'uct': {
    name: 'University of Cape Town',
    domains: ['myuct.ac.za', 'uct.ac.za'],
    format: 'studentnumber@myuct.ac.za',
    description: 'UCT student email (e.g., 123456@myuct.ac.za)'
  },
  'stellies': {
    name: 'Stellenbosch University',
    domains: ['sun.ac.za'],
    format: 'studentnumber@sun.ac.za',
    description: 'Stellenbosch student email (e.g., 12345678@sun.ac.za)'
  },
  'up': {
    name: 'University of Pretoria',
    domains: ['tuks.co.za', 'up.ac.za'],
    format: 'u12345678@tuks.co.za',
    description: 'UP student email (e.g., u12345678@tuks.co.za)'
  },
  'ukzn': {
    name: 'University of KwaZulu-Natal',
    domains: ['stu.ukzn.ac.za', 'ukzn.ac.za'],
    format: 'studentnumber@stu.ukzn.ac.za',
    description: 'UKZN student email (e.g., 123456789@stu.ukzn.ac.za)'
  },
  'uj': {
    name: 'University of Johannesburg',
    domains: ['student.uj.ac.za', 'uj.ac.za'],
    format: 'studentnumber@student.uj.ac.za',
    description: 'UJ student email (e.g., 123456789@student.uj.ac.za)'
  },
  'nmu': {
    name: 'Nelson Mandela University',
    domains: ['mandela.ac.za'],
    format: 'studentnumber@mandela.ac.za',
    description: 'NMU student email (e.g., s123456789@mandela.ac.za)'
  },
  'nwu': {
    name: 'North-West University',
    domains: ['mynwu.ac.za', 'nwu.ac.za'],
    format: 'studentnumber@mynwu.ac.za',
    description: 'NWU student email (e.g., 12345678@mynwu.ac.za)'
  },
  'ufs': {
    name: 'University of the Free State',
    domains: ['ufs4life.ac.za', 'ufs.ac.za'],
    format: 'studentnumber@ufs4life.ac.za',
    description: 'UFS student email (e.g., 1234567890@ufs4life.ac.za)'
  },
  'uwc': {
    name: 'University of the Western Cape',
    domains: ['myuwc.ac.za', 'uwc.ac.za'],
    format: 'studentnumber@myuwc.ac.za',
    description: 'UWC student email (e.g., 1234567@myuwc.ac.za)'
  },
  'ul': {
    name: 'University of Limpopo',
    domains: ['myturf.ul.ac.za', 'ul.ac.za'],
    format: 'studentnumber@myturf.ul.ac.za',
    description: 'UL student email (e.g., 12345678@myturf.ul.ac.za)'
  },
  'univen': {
    name: 'University of Venda',
    domains: ['mvula.univen.ac.za', 'univen.ac.za'],
    format: 'studentnumber@mvula.univen.ac.za',
    description: 'Univen student email (e.g., 12345678@mvula.univen.ac.za)'
  },
  'unizulu': {
    name: 'University of Zululand',
    domains: ['unizulu.ac.za'],
    format: 'studentnumber@unizulu.ac.za',
    description: 'Unizulu student email (e.g., 12345678@unizulu.ac.za)'
  },
  'tut': {
    name: 'Tshwane University of Technology',
    domains: ['tut4life.ac.za', 'tut.ac.za'],
    format: 'studentnumber@tut4life.ac.za',
    description: 'TUT student email (e.g., 123456789@tut4life.ac.za)'
  },
  'cput': {
    name: 'Cape Peninsula University of Technology',
    domains: ['mycput.ac.za', 'cput.ac.za'],
    format: 'studentnumber@mycput.ac.za',
    description: 'CPUT student email (e.g., 123456789@mycput.ac.za)'
  },
  'dut': {
    name: 'Durban University of Technology',
    domains: ['dut4life.ac.za', 'dut.ac.za'],
    format: 'studentnumber@dut4life.ac.za',
    description: 'DUT student email (e.g., 12345678@dut4life.ac.za)'
  },
  'vut': {
    name: 'Vaal University of Technology',
    domains: ['edu.vut.ac.za', 'vut.ac.za'],
    format: 'studentnumber@edu.vut.ac.za',
    description: 'VUT student email (e.g., 12345678@edu.vut.ac.za)'
  },
  'muts': {
    name: 'Mangosuthu University of Technology',
    domains: ['live.mut.ac.za', 'mut.ac.za'],
    format: 'studentnumber@live.mut.ac.za',
    description: 'MUT student email (e.g., 12345678@live.mut.ac.za)'
  },
  'unisa': {
    name: 'University of South Africa',
    domains: ['mylife.unisa.ac.za', 'unisa.ac.za'],
    format: 'studentnumber@mylife.unisa.ac.za',
    description: 'UNISA student email (e.g., 12345678@mylife.unisa.ac.za)'
  },
  'sol-plaatje': {
    name: 'Sol Plaatje University',
    domains: ['spu.ac.za'],
    format: 'studentnumber@spu.ac.za',
    description: 'SPU student email (e.g., 123456789@spu.ac.za)'
  },
  'ump': {
    name: 'University of Mpumalanga',
    domains: ['ump.ac.za'],
    format: 'studentnumber@ump.ac.za',
    description: 'UMP student email (e.g., 12345678@ump.ac.za)'
  },
  'smu': {
    name: 'Sefako Makgatho Health Sciences University',
    domains: ['smu.ac.za'],
    format: 'studentnumber@smu.ac.za',
    description: 'SMU student email (e.g., 12345678@smu.ac.za)'
  },
  'wsu': {
    name: 'Walter Sisulu University',
    domains: ['mywsu.ac.za', 'wsu.ac.za'],
    format: 'studentnumber@mywsu.ac.za',
    description: 'WSU student email (e.g., 12345678@mywsu.ac.za)'
  },
  'rhodes': {
    name: 'Rhodes University',
    domains: ['campus.ru.ac.za', 'ru.ac.za'],
    format: 'studentnumber@campus.ru.ac.za',
    description: 'Rhodes student email (e.g., g12s1234@campus.ru.ac.za)'
  }
};

// Get allowed domains for a specific university
export const getUniversityDomains = (universityId) => {
  return universityEmailDomains[universityId] || null;
};

// Check if an email matches a university's domain format
export const isValidUniversityEmail = (email, universityId) => {
  const uni = universityEmailDomains[universityId];
  if (!uni) return false;
  
  const emailParts = email.split('@');
  if (emailParts.length !== 2) return false;
  
  const domain = emailParts[1].toLowerCase();
  return uni.domains.some(d => domain === d || domain.endsWith('.' + d));
};
