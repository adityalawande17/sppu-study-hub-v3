export const branchMeta = {
  cs:  { key:'cs',  name:'Computer Science Engineering',                short:'Computer Science',    abbr:'CS', color:'var(--cs-color)',  pale:'var(--cs-pale)',  dark:'var(--cs-dark)'  },
  it:  { key:'it',  name:'Information Technology Engineering',          short:'Information Technology', abbr:'IT', color:'var(--it-color)', pale:'var(--it-pale)', dark:'var(--it-dark)'  },
  me:  { key:'me',  name:'Mechanical Engineering',                      short:'Mechanical',          abbr:'ME', color:'var(--me-color)',  pale:'var(--me-pale)',  dark:'var(--me-dark)'  },
  ce:  { key:'ce',  name:'Civil Engineering',                           short:'Civil',               abbr:'CE', color:'var(--ce-color)',  pale:'var(--ce-pale)',  dark:'var(--ce-dark)'  },
  ee:  { key:'ee',  name:'Electrical Engineering',                      short:'Electrical',          abbr:'EE', color:'var(--ee-color)',  pale:'var(--ee-pale)',  dark:'var(--ee-dark)'  },
  etc: { key:'etc', name:'Electronics and Telecommunication Engineering',short:'E and TC',           abbr:'EC', color:'var(--etc-color)', pale:'var(--etc-pale)', dark:'var(--etc-dark)' },
}

// ── subjects per pattern ──────────────────────────────────────────────────────
const cs2019 = {
  SE:{ label:'Second Year (SE)', semesters:[
    { label:'Semester 3', subjects:[
      {code:'SE-CS-301',name:'Discrete Mathematics',credits:3,updated:'Jan 2025'},
      {code:'SE-CS-302',name:'Data Structures',credits:4,updated:'Feb 2025'},
      {code:'SE-CS-303',name:'Digital Electronics and Computer Organization',credits:3,updated:'Jan 2025'},
      {code:'SE-CS-304',name:'Computer Graphics',credits:3,updated:'Dec 2024'},
      {code:'SE-CS-305',name:'Object Oriented Programming',credits:3,updated:'Feb 2025'},
    ]},
    { label:'Semester 4', subjects:[
      {code:'SE-CS-401',name:'Analysis of Algorithms',credits:3,updated:'Jan 2025'},
      {code:'SE-CS-402',name:'Database Management Systems',credits:4,updated:'Feb 2025'},
      {code:'SE-CS-403',name:'Operating Systems',credits:3,updated:'Jan 2025'},
      {code:'SE-CS-404',name:'Software Engineering',credits:3,updated:'Dec 2024'},
      {code:'SE-CS-405',name:'Microprocessor',credits:3,updated:'Nov 2024'},
    ]},
  ]},
  TE:{ label:'Third Year (TE)', semesters:[
    { label:'Semester 5', subjects:[
      {code:'TE-CS-501',name:'Theory of Computation',credits:3,updated:'Jan 2025'},
      {code:'TE-CS-502',name:'Computer Networks',credits:4,updated:'Mar 2025'},
      {code:'TE-CS-503',name:'System Programming and OS',credits:3,updated:'Feb 2025'},
      {code:'TE-CS-504',name:'Data Warehouse and Mining',credits:3,updated:'Jan 2025'},
      {code:'TE-CS-505',name:'Web Technologies',credits:3,updated:'Feb 2025'},
    ]},
    { label:'Semester 6', subjects:[
      {code:'TE-CS-601',name:'Compiler Design',credits:3,updated:'Jan 2025'},
      {code:'TE-CS-602',name:'Distributed Systems',credits:3,updated:'Dec 2024'},
      {code:'TE-CS-603',name:'Artificial Intelligence',credits:3,updated:'Jan 2025'},
      {code:'TE-CS-604',name:'Information Security',credits:3,updated:'Dec 2024'},
      {code:'TE-CS-605',name:'Machine Learning',credits:3,updated:'Feb 2025'},
    ]},
  ]},
  BE:{ label:'Final Year (BE)', semesters:[
    { label:'Semester 7', subjects:[
      {code:'BE-CS-701',name:'Big Data Analytics',credits:3,updated:'Jan 2025'},
      {code:'BE-CS-702',name:'High Performance Computing',credits:3,updated:'Dec 2024'},
      {code:'BE-CS-703',name:'Natural Language Processing',credits:3,updated:'Jan 2025'},
      {code:'BE-CS-704',name:'Blockchain Technology',credits:3,updated:'Nov 2024'},
    ]},
    { label:'Semester 8', subjects:[
      {code:'BE-CS-801',name:'Deep Learning',credits:3,updated:'Feb 2025'},
      {code:'BE-CS-802',name:'Cloud Computing',credits:3,updated:'Jan 2025'},
      {code:'BE-CS-803',name:'Internet of Things',credits:3,updated:'Dec 2024'},
    ]},
  ]},
}

const cs2024 = {
  SE:{ label:'Second Year (SE)', semesters:[
    { label:'Semester 3', subjects:[
      {code:'SE-CS-301-24',name:'Engineering Mathematics III',credits:3,updated:'Aug 2024'},
      {code:'SE-CS-302-24',name:'Data Structures and Algorithms',credits:4,updated:'Aug 2024'},
      {code:'SE-CS-303-24',name:'Computer Organization and Architecture',credits:3,updated:'Aug 2024'},
      {code:'SE-CS-304-24',name:'Object Oriented Programming with Java',credits:3,updated:'Aug 2024'},
      {code:'SE-CS-305-24',name:'Discrete Mathematics',credits:3,updated:'Aug 2024'},
    ]},
    { label:'Semester 4', subjects:[
      {code:'SE-CS-401-24',name:'Design and Analysis of Algorithms',credits:3,updated:'Jan 2025'},
      {code:'SE-CS-402-24',name:'Database Management Systems',credits:4,updated:'Jan 2025'},
      {code:'SE-CS-403-24',name:'Operating Systems',credits:3,updated:'Jan 2025'},
      {code:'SE-CS-404-24',name:'Software Engineering and Project Management',credits:3,updated:'Jan 2025'},
      {code:'SE-CS-405-24',name:'Computer Networks',credits:3,updated:'Jan 2025'},
    ]},
  ]},
  TE:{ label:'Third Year (TE)', semesters:[
    { label:'Semester 5', subjects:[
      {code:'TE-CS-501-24',name:'Theory of Computation',credits:3,updated:'Aug 2024'},
      {code:'TE-CS-502-24',name:'Artificial Intelligence',credits:3,updated:'Aug 2024'},
      {code:'TE-CS-503-24',name:'Machine Learning',credits:3,updated:'Aug 2024'},
      {code:'TE-CS-504-24',name:'Web Application Development',credits:3,updated:'Aug 2024'},
      {code:'TE-CS-505-24',name:'Information and Cyber Security',credits:3,updated:'Aug 2024'},
    ]},
    { label:'Semester 6', subjects:[
      {code:'TE-CS-601-24',name:'Deep Learning',credits:3,updated:'Jan 2025'},
      {code:'TE-CS-602-24',name:'Cloud Computing',credits:3,updated:'Jan 2025'},
      {code:'TE-CS-603-24',name:'Internet of Things',credits:3,updated:'Jan 2025'},
      {code:'TE-CS-604-24',name:'Compiler Design',credits:3,updated:'Jan 2025'},
    ]},
  ]},
  BE:{ label:'Final Year (BE)', semesters:[
    { label:'Semester 7', subjects:[
      {code:'BE-CS-701-24',name:'Big Data Analytics',credits:3,updated:'Aug 2024'},
      {code:'BE-CS-702-24',name:'Blockchain and Distributed Ledger',credits:3,updated:'Aug 2024'},
      {code:'BE-CS-703-24',name:'Natural Language Processing',credits:3,updated:'Aug 2024'},
    ]},
    { label:'Semester 8', subjects:[
      {code:'BE-CS-801-24',name:'High Performance Computing',credits:3,updated:'Jan 2025'},
      {code:'BE-CS-802-24',name:'Quantum Computing',credits:3,updated:'Jan 2025'},
    ]},
  ]},
}

// Simplified entries for other branches (2019 pattern)
const makeSimpleBranch = (prefix, se3, se4, te5, te6, be7, be8) => ({
  SE:{ label:'Second Year (SE)', semesters:[
    { label:'Semester 3', subjects: se3.map((n,i)=>({code:`${prefix}3${i+1}`,name:n,credits:i===1?4:3,updated:'Jan 2025'})) },
    { label:'Semester 4', subjects: se4.map((n,i)=>({code:`${prefix}4${i+1}`,name:n,credits:i===0?4:3,updated:'Jan 2025'})) },
  ]},
  TE:{ label:'Third Year (TE)', semesters:[
    { label:'Semester 5', subjects: te5.map((n,i)=>({code:`${prefix}5${i+1}`,name:n,credits:i===0?4:3,updated:'Jan 2025'})) },
    { label:'Semester 6', subjects: te6.map((n,i)=>({code:`${prefix}6${i+1}`,name:n,credits:i===0?4:3,updated:'Dec 2024'})) },
  ]},
  BE:{ label:'Final Year (BE)', semesters:[
    { label:'Semester 7', subjects: be7.map((n,i)=>({code:`${prefix}7${i+1}`,name:n,credits:3,updated:'Jan 2025'})) },
    { label:'Semester 8', subjects: be8.map((n,i)=>({code:`${prefix}8${i+1}`,name:n,credits:3,updated:'Dec 2024'})) },
  ]},
})

const it2019 = makeSimpleBranch('SE-IT-',
  ['Discrete Mathematics','Data Structures and Algorithms','Computer Organization','Object Oriented Programming'],
  ['Database Management Systems','Operating Systems','Software Engineering','Computer Networks'],
  ['Web Technologies','Information and Cyber Security','Enterprise Java','Data Science and Big Data Analytics'],
  ['Machine Learning','Cloud Computing','Wireless Networks'],
  ['Blockchain Technology','Artificial Intelligence','DevOps'],
  ['Deep Learning','Internet of Things']
)
const me2019 = makeSimpleBranch('SE-ME-',
  ['Engineering Mathematics III','Strength of Materials','Thermodynamics','Manufacturing Processes I'],
  ['Theory of Machines','Fluid Mechanics','Material Technology','Manufacturing Processes II'],
  ['Machine Design I','Heat Transfer','Metrology and Quality Control','Industrial Engineering'],
  ['Machine Design II','Refrigeration and Air Conditioning','Computer Aided Manufacturing'],
  ['Dynamics of Machinery','Automobile Engineering','Finite Element Analysis'],
  ['Robotics','Power Plant Engineering']
)
const ce2019 = makeSimpleBranch('SE-CE-',
  ['Surveying','Fluid Mechanics I','Structural Analysis I','Engineering Geology'],
  ['Design of Structures I','Geotechnical Engineering I','Transportation Engineering I'],
  ['Structural Analysis II','Water Supply Engineering','Advanced Surveying'],
  ['Design of Structures II','Environmental Engineering','Construction Management'],
  ['Advanced Concrete Technology','Remote Sensing and GIS'],
  ['Bridge Engineering','Disaster Management']
)
const ee2019 = makeSimpleBranch('SE-EE-',
  ['Circuit Theory','Electrical Machines I','Electronic Devices and Circuits'],
  ['Electrical Machines II','Power Systems I','Control Systems'],
  ['Power Electronics','Power Systems II','Electric Drives'],
  ['High Voltage Engineering','Utilization of Electrical Energy','Switchgear and Protection'],
  ['Renewable Energy Systems','Smart Grid Technology'],
  ['FACTS Devices','Flexible AC Transmission']
)
const etc2019 = makeSimpleBranch('SE-EC-',
  ['Electronic Circuits I','Digital Electronics','Signals and Systems'],
  ['Electronic Circuits II','Microcontrollers','Communication Engineering I'],
  ['Digital Communication','VLSI Design','Digital Signal Processing'],
  ['Wireless Communication','Embedded Systems','Satellite Communication'],
  ['Optical Fiber Communication','Image Processing'],
  ['Antenna and Wave Propagation','Internet of Things']
)

export const branchData = {
  '2019': { cs: cs2019, it: it2019, me: me2019, ce: ce2019, ee: ee2019, etc: etc2019 },
  '2024': { cs: cs2024, it: it2019, me: me2019, ce: ce2019, ee: ee2019, etc: etc2019 },
}

// Build search index for both patterns
export const searchIndex = []
;['2019','2024'].forEach(pat => {
  Object.keys(branchData[pat]).forEach(bk => {
    const meta = branchMeta[bk]
    Object.keys(branchData[pat][bk]).forEach(yr => {
      branchData[pat][bk][yr].semesters.forEach(sem => {
        sem.subjects.forEach(sub => {
          if (!searchIndex.find(s => s.code === sub.code))
            searchIndex.push({ ...sub, branch: meta.name, branchKey: bk, yearKey: yr, sem: sem.label, pattern: pat })
        })
      })
    })
  })
})
