export const feSubjects = {
  '2019': {
    sem1:[
      {code:'FEC101',name:'Engineering Mathematics I',   credits:3,type:'Theory',            updated:'Jan 2025'},
      {code:'FEC102',name:'Engineering Physics',         credits:3,type:'Theory + Practical', updated:'Dec 2024'},
      {code:'FEC103',name:'Engineering Chemistry',       credits:3,type:'Theory + Practical', updated:'Dec 2024'},
      {code:'FEC104',name:'Basic Electronics Engineering',credits:3,type:'Theory + Practical',updated:'Nov 2024'},
      {code:'FEC105',name:'Basic Electrical Engineering',credits:3,type:'Theory + Practical', updated:'Nov 2024'},
      {code:'FEC106',name:'Engineering Mechanics',       credits:4,type:'Theory',             updated:'Jan 2025'},
    ],
    sem2:[
      {code:'FEC201',name:'Engineering Mathematics II',     credits:3,type:'Theory',            updated:'Jan 2025'},
      {code:'FEC202',name:'Engineering Graphics',           credits:3,type:'Theory + Practical',updated:'Nov 2024'},
      {code:'FEC203',name:'Programming and Problem Solving',credits:3,type:'Theory + Practical',updated:'Dec 2024'},
      {code:'FEC204',name:'Communication Skills',           credits:2,type:'Theory',            updated:'Oct 2024'},
      {code:'FEC205',name:'Workshop Practice',              credits:2,type:'Practical',         updated:'Oct 2024'},
    ],
  },
  '2024': {
    sem1:[
      {code:'FEC101-24',name:'Engineering Mathematics I',   credits:3,type:'Theory',            updated:'Aug 2024'},
      {code:'FEC102-24',name:'Engineering Physics',         credits:3,type:'Theory + Practical', updated:'Aug 2024'},
      {code:'FEC103-24',name:'Engineering Chemistry',       credits:3,type:'Theory + Practical', updated:'Aug 2024'},
      {code:'FEC104-24',name:'Basic Electronics Engineering',credits:3,type:'Theory + Practical',updated:'Aug 2024'},
      {code:'FEC105-24',name:'Basic Electrical Engineering',credits:3,type:'Theory + Practical', updated:'Aug 2024'},
      {code:'FEC106-24',name:'Engineering Mechanics',       credits:4,type:'Theory',             updated:'Aug 2024'},
    ],
    sem2:[
      {code:'FEC201-24',name:'Engineering Mathematics II',     credits:3,type:'Theory',            updated:'Jan 2025'},
      {code:'FEC202-24',name:'Engineering Graphics',           credits:3,type:'Theory + Practical',updated:'Jan 2025'},
      {code:'FEC203-24',name:'Programming with Python',        credits:3,type:'Theory + Practical',updated:'Jan 2025'},
      {code:'FEC204-24',name:'Communication Skills',           credits:2,type:'Theory',            updated:'Jan 2025'},
      {code:'FEC205-24',name:'Workshop and Manufacturing',     credits:2,type:'Practical',         updated:'Jan 2025'},
    ],
  },
}

export const feSearchIndex = ['2019','2024'].flatMap(pat =>
  ['sem1','sem2'].flatMap((s, i) =>
    feSubjects[pat][s].map(sub => ({
      ...sub, branch:'First Year', branchKey:'fe',
      yearKey:'FE', sem:`Semester ${i+1}`, pattern: pat
    }))
  )
)
