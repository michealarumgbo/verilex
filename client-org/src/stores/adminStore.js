import { reactive } from 'vue'

/**
 * Plain reactive() store — no Pinia needed at this size. Swap the arrays
 * below for real API calls when this connects to a backend; the shape
 * (agents / clients / closedChats) can stay the same.
 */
export const adminStore = reactive({
  agents: [
    {
      id: 'ag1',
      firstName: 'Chidinma',
      lastName: 'Okafor',
      email: 'chidinma.okafor@verilex.ng',
      status: 'Active',
    },
    {
      id: 'ag2',
      firstName: 'Emeka',
      lastName: 'Nwosu',
      email: 'emeka.nwosu@verilex.ng',
      status: 'Active',
    },
    {
      id: 'ag3',
      firstName: 'Blessing',
      lastName: 'Adeyemi',
      email: 'blessing.adeyemi@verilex.ng',
      status: 'Inactive',
    },
    {
      id: 'ag4',
      firstName: 'Ifeoma',
      lastName: 'Eze',
      email: 'ifeoma.eze@verilex.ng',
      status: 'Active',
    },
    {
      id: 'ag5',
      firstName: 'Segun',
      lastName: 'Bakare',
      email: 'segun.bakare@verilex.ng',
      status: 'Inactive',
    },
  ],

  clients: [
    { id: 'c1', firstName: 'Ada', lastName: 'Obi', email: 'ada.obi@gmail.com' },
    { id: 'c2', firstName: 'Tunde', lastName: 'Adebayo', email: 'tunde.adebayo@yahoo.com' },
    { id: 'c3', firstName: 'Blessing', lastName: 'Nwachukwu', email: 'blessing.n@outlook.com' },
    { id: 'c4', firstName: 'Farouk', lastName: 'Musa', email: 'farouk.musa@gmail.com' },
    { id: 'c5', firstName: 'Chinedu', lastName: 'Kalu', email: 'chinedu.k@gmail.com' },
    { id: 'c6', firstName: 'Amaka', lastName: 'Igwe', email: 'amaka.igwe@gmail.com' },
  ],

  closedChats: [
    {
      id: 'cc1',
      clientName: 'Ngozi Umeh',
      agentName: 'Chidinma Okafor',
      topic: 'Company Registration',
      closedAt: 'Sep 6, 2026 · 3:42 PM',
    },
    {
      id: 'cc2',
      clientName: 'Bayo Ogundipe',
      agentName: 'Emeka Nwosu',
      topic: 'Tax Clearance Certificate',
      closedAt: 'Sep 5, 2026 · 11:05 AM',
    },
    {
      id: 'cc3',
      clientName: 'Halima Bello',
      agentName: 'Ifeoma Eze',
      topic: 'Business Name Registration',
      closedAt: 'Sep 4, 2026 · 4:18 PM',
    },
    {
      id: 'cc4',
      clientName: 'Chinedu Kalu',
      agentName: 'Chidinma Okafor',
      topic: 'Business Name Registration',
      closedAt: 'Sep 2, 2026 · 9:30 AM',
    },
    {
      id: 'cc5',
      clientName: 'Amaka Igwe',
      agentName: 'Emeka Nwosu',
      topic: 'Foundation / NGO Registration',
      closedAt: 'Aug 30, 2026 · 2:12 PM',
    },
  ],
})

export function toggleAgentStatus(id) {
  const agent = adminStore.agents.find((a) => a.id === id)
  if (!agent) return
  agent.status = agent.status === 'Active' ? 'Inactive' : 'Active'
}

export function addAgent({ firstName, lastName, email }) {
  const id = 'ag' + (adminStore.agents.length + 1) + '-' + Date.now()
  const agent = { id, firstName, lastName, email, status: 'Active' }
  adminStore.agents.unshift(agent)
  return agent
}
