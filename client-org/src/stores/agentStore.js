import { reactive } from 'vue'

/**
 * A plain reactive() store. No Pinia/Vuex required for a demo of this size —
 * if the app grows, this shape maps 1:1 onto a Pinia store later.
 */
export const agentStore = reactive({
  isAuthenticated: false,
  agent: {
    name: '',
    email: '',
    phone: '',
    title: '',
    initials: '',
    status: 'Online', // Online | Away | Offline
  },

  pendingChats: [
    {
      id: 'p1',
      name: 'Ada Obi',
      contact: 'ada.obi@gmail.com',
      topic: 'Company Registration',
      message: 'Need to register my company as soon as possible, do you handle same-week filings?',
      requestedAt: '2 min ago',
    },
    {
      id: 'p2',
      name: 'Tunde Adebayo',
      contact: '+234 801 234 5678',
      topic: 'Tax Clearance Certificate',
      message: 'How long does a TCC normally take once documents are submitted?',
      requestedAt: '6 min ago',
    },
    {
      id: 'p3',
      name: 'Blessing Nwachukwu',
      contact: 'blessing.n@outlook.com',
      topic: 'Foundation / NGO Registration',
      message: 'Want to register a new NGO focused on primary education in Enugu.',
      requestedAt: '11 min ago',
    },
    {
      id: 'p4',
      name: 'Farouk Musa',
      contact: '+234 705 552 0091',
      topic: 'Filing of Annual Returns',
      message: "I think we've missed two years of annual returns — how bad is it?",
      requestedAt: '18 min ago',
    },
  ],

  activeChats: [
    {
      id: 'a1',
      name: 'Chinedu Kalu',
      contact: 'chinedu.k@gmail.com',
      topic: 'Business Name Registration',
      requestedAt: 'Yesterday',
      messages: [
        {
          id: 1,
          from: 'customer',
          text: 'Hi, I filled the business name form yesterday, just checking on status.',
          time: '09:14',
        },
        {
          id: 2,
          from: 'agent',
          text: 'Hi Chinedu, checking now — I can see it in the queue for approval.',
          time: '09:16',
        },
      ],
    },
  ],
})

export function acceptChat(id) {
  const idx = agentStore.pendingChats.findIndex((c) => c.id === id)
  if (idx === -1) return null
  const [chat] = agentStore.pendingChats.splice(idx, 1)
  agentStore.activeChats.unshift({
    ...chat,
    requestedAt: 'Just now',
    messages: [{ id: Date.now(), from: 'customer', text: chat.message, time: chat.requestedAt }],
  })
  return chat
}

export function login({ email }) {
  const displayName = 'Ifeoma Adaeze'
  const initials =
    displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('') || 'A'

  agentStore.agent = {
    name: titleCase(displayName),
    email,
    phone: '+234 800 000 0000',
    title: 'Filing Agent',
    initials,
    status: 'Online',
  }
  agentStore.isAuthenticated = true
}

export function logout() {
  agentStore.isAuthenticated = false
  agentStore.agent = { name: '', email: '', phone: '', title: '', initials: '', status: 'Online' }
}

function titleCase(str) {
  return str.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
}
