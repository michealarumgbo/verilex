<script setup>
import router from '@/router'
import { reactive, ref, onMounted, onUnmounted, nextTick } from 'vue'

/* ---------------------------------------------------------------- */
/*  Data                                                             */
/* ---------------------------------------------------------------- */

const serviceOptions = [
    'Company Registration',
    'Business Name Registration',
    'Foundation / NGO Registration',
    'Club Registration',
    'Association Registration',
    'Tax Clearance Certificate',
    'Tax Clearance Registration',
    'TIN Application',
    'Filing of Annual Returns',
    'Other CAC Filing',
]

const marqueeItems = [
    'Company Registration', 'Business Name Registration', 'NGO / Foundation Registration',
    'Club Registration', 'Association Registration', 'Tax Clearance Certificate',
    'TIN Application', 'Annual Returns',
]
const marqueeLoop = [...marqueeItems, ...marqueeItems]

const services = [
    { code: 'FILE / 01', agency: 'CAC', title: 'Company Registration', desc: 'Incorporate a limited liability company, from name reservation to your certificate of incorporation.' },
    { code: 'FILE / 02', agency: 'CAC', title: 'Business Name Registration', desc: 'Register a sole proprietorship or enterprise name and get your business name certificate.' },
    { code: 'FILE / 03', agency: 'CAC', title: 'Foundation / NGO Registration', desc: 'Incorporate trustees for a foundation or non-profit, with constitution and objectives drafted for you.' },
    { code: 'FILE / 04', agency: 'CAC', title: 'Club Registration', desc: 'Formal incorporation for social, sports, or interest clubs seeking legal recognition.' },
    { code: 'FILE / 05', agency: 'CAC', title: 'Association Registration', desc: 'Register trustees for professional bodies, cooperatives, and community associations.' },
    { code: 'FILE / 06', agency: 'FIRS', title: 'Tax Clearance Certificate', desc: 'Obtain your TCC for individuals or companies, verified and ready for tenders or applications.' },
    { code: 'FILE / 07', agency: 'FIRS', title: 'Tax Clearance Registration', desc: 'Get set up correctly with FIRS so future clearance renewals are fast and straightforward.' },
    { code: 'FILE / 08', agency: 'FIRS', title: 'TIN Application', desc: 'Secure a Tax Identification Number for individuals, companies, or enterprises.' },
    { code: 'FILE / 09', agency: 'CAC', title: 'Filing of Annual Returns', desc: 'Keep your company in good standing with timely, accurate yearly returns to the CAC.' },
    { code: 'FILE / 10', agency: 'CAC', title: 'Other CAC Filings', desc: 'Director changes, registered address updates, share allotments, and other post-incorporation filings.' },
]

const processSteps = [
    { num: '01', title: 'Consult', desc: "Tell us what you're registering. We confirm eligibility and the exact documents required." },
    { num: '02', title: 'Prepare', desc: 'We draft your forms, constitution, or resolutions and send them back for your sign-off.' },
    { num: '03', title: 'File', desc: 'We submit directly to the CAC or FIRS and track the application on your behalf.' },
    { num: '04', title: 'Certify', desc: 'You receive your certificate or registration number, plus copies for your records.' },
]

const whyItems = [
    { icon: '§', title: 'Accredited filing agents', desc: 'We file directly with the CAC and FIRS portals — no third-party runners, no guesswork.' },
    { icon: '₦', title: 'Transparent, fixed pricing', desc: 'You get one quote covering government fees and our service fee, before we start.' },
    { icon: '↻', title: 'Status you can check', desc: 'A named contact and reference number for every filing, so you always know where things stand.' },
    { icon: '✓', title: 'Compliance after registration', desc: 'Reminders for annual returns and clearance renewals, so your entity stays in good standing.' },
]

/* ---------------------------------------------------------------- */
/*  Nav / mobile menu                                                */
/* ---------------------------------------------------------------- */

const mobileMenuOpen = ref(false)

/* ---------------------------------------------------------------- */
/*  Contact form (bottom of page)                                    */
/* ---------------------------------------------------------------- */

const contactForm = reactive({ name: '', contact: '', service: serviceOptions[0], msg: '' })
const contactSubmitted = ref(false)

function submitContactForm() {
    contactSubmitted.value = true
}

/* ---------------------------------------------------------------- */
/*  Agent modal                                                      */
/* ---------------------------------------------------------------- */

const agentModalOpen = ref(false)
const agentStep = ref('form') // 'form' | 'success'
const agentConnected = ref(false)
const connectedAgentName = ref('')
const agentForm = reactive({ firstname: '', lastname: '', contact: '', topic: serviceOptions[0], msg: '' })
const agentNameInput = ref(null)
// const agentLastnameInput = ref()
const agentPool = ['Chidinma', 'Emeka', 'Blessing', 'Ifeoma']

function openAgentModal() {
    agentModalOpen.value = true
    document.body.style.overflow = 'hidden'
    nextTick(() => agentNameInput.value && agentNameInput.value.focus())
}

function closeAgentModal() {
    agentModalOpen.value = false
    document.body.style.overflow = ''
    setTimeout(() => {
        agentStep.value = 'form'
        agentConnected.value = false
        agentForm.name = ''
        agentForm.contact = ''
        agentForm.topic = serviceOptions[0]
        agentForm.msg = ''
    }, 300)
}

function submitAgentForm() {
    agentStep.value = 'success'
    setTimeout(() => {
        connectedAgentName.value = agentPool[Math.floor(Math.random() * agentPool.length)]
        router.push("/chats/agent/")
    }, 5000)
}

function onOverlayClick(e) {
    if (e.target === e.currentTarget) closeAgentModal()
}

function onKeydown(e) {
    if (e.key === 'Escape' && agentModalOpen.value) closeAgentModal()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

/* ---------------------------------------------------------------- */
/*  Reveal-on-scroll directive                                       */
/* ---------------------------------------------------------------- */

const vReveal = {
    mounted(el) {
        el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700', 'ease-out')
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    el.classList.remove('opacity-0', 'translate-y-4')
                    el.classList.add('opacity-100', 'translate-y-0')
                    observer.unobserve(el)
                }
            })
        }, { threshold: 0.12 })
        observer.observe(el)
    },
}
</script>

<template>
    <div
        class="bg-[#EFEDE5] text-[#1B1B18] font-body antialiased selection:bg-[#A9834B] selection:text-white overflow-x-hidden">

        <!-- ============================= HEADER ============================= -->
        <header class="sticky top-0 z-50 bg-[#EFEDE5]/90 backdrop-blur-md border-b border-[#D6D1C0]">
            <div class="max-w-295 mx-auto px-5 sm:px-8 h-19.5 flex items-center justify-between">
                <a href="#"
                    class="flex items-center gap-2.5 font-display font-semibold text-[22px] tracking-tight text-[#101E2B]">
                    <span
                        class="w-7.5 h-7.5 rounded-full border-[1.4px] border-[#A9834B] flex items-center justify-center text-[14px] font-bold text-[#A9834B]">V</span>
                    Verilex
                </a>

                <nav class="hidden md:flex items-center gap-9">
                    <a v-for="link in [['Services', '#services'], ['Process', '#process'], ['Why Verilex', '#why'], ['Contact', '#contact']]"
                        :key="link[1]" :href="link[1]"
                        class="group relative py-1 text-[14.5px] font-medium text-[#6B6558] hover:text-[#101E2B] transition-colors">
                        {{ link[0] }}
                        <span
                            class="absolute left-0 bottom-0 h-px w-0 bg-[#A9834B] transition-all duration-300 group-hover:w-full"></span>
                    </a>
                </nav>

                <div class="hidden md:flex items-center gap-3.5">
                    <button type="button" @click="openAgentModal"
                        class="inline-flex items-center gap-2.5 border border-[#D6D1C0] text-[#101E2B] px-5 py-3 text-sm font-semibold hover:border-[#1E3B32] hover:text-[#1E3B32] transition-colors">
                        <span class="relative w-2 h-2 rounded-full bg-[#3E8E63]">
                            <span
                                class="absolute -inset-1 rounded-full border border-[#3E8E63] animate-pulse-ring"></span>
                        </span>
                        Speak with an Agent
                    </button>
                    <a href="#contact"
                        class="inline-flex items-center bg-[#101E2B] text-[#EFEDE5] px-5 py-3 text-sm font-semibold hover:bg-[#A9834B] transition-colors">
                        Book Consultation
                    </a>
                </div>

                <button type="button" class="md:hidden p-2 text-[#101E2B]" @click="mobileMenuOpen = !mobileMenuOpen"
                    aria-label="Toggle menu">
                    <svg v-if="!mobileMenuOpen" width="24" height="24" fill="none" stroke="currentColor"
                        stroke-width="1.6" viewBox="0 0 24 24">
                        <path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
                    </svg>
                    <svg v-else width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
                    </svg>
                </button>
            </div>

            <div v-if="mobileMenuOpen"
                class="md:hidden border-t border-[#D6D1C0] bg-[#EFEDE5] px-5 py-5 flex flex-col gap-4">
                <a v-for="link in [['Services', '#services'], ['Process', '#process'], ['Why Verilex', '#why'], ['Contact', '#contact']]"
                    :key="link[1]" :href="link[1]" class="text-[15px] font-medium text-[#101E2B]"
                    @click="mobileMenuOpen = false">{{ link[0] }}</a>
                <button type="button" @click="openAgentModal(); mobileMenuOpen = false"
                    class="w-full border border-[#D6D1C0] text-[#101E2B] px-5 py-3 text-sm font-semibold text-center">
                    Speak with an Agent
                </button>
                <a href="#contact" @click="mobileMenuOpen = false"
                    class="w-full bg-[#101E2B] text-[#EFEDE5] px-5 py-3 text-sm font-semibold text-center">
                    Book Consultation
                </a>
            </div>
        </header>

        <!-- ============================= HERO ============================= -->
        <section class="relative pt-16 pb-16 md:pt-24 overflow-hidden">
            <div class="max-w-295 mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-14 items-center">
                <div>
                    <div v-reveal
                        class="inline-flex items-center gap-2.5 font-mono2 text-[11.5px] tracking-[0.14em] uppercase text-[#1E3B32] font-medium mb-5">
                        <span class="w-4 h-px bg-[#A9834B] inline-block"></span>
                        CAC &amp; FIRS Accredited Filing Agents
                    </div>
                    <h1 v-reveal
                        class="font-display font-semibold text-[38px] sm:text-[48px] lg:text-[60px] leading-[1.06] text-[#101E2B] max-w-155">
                        Get registered.<br>
                        Stay <em class="italic text-[#A9834B] font-medium">compliant.</em><br>
                        Operate with proof.
                    </h1>
                    <p v-reveal class="mt-5 text-[17.5px] text-[#6B6558] max-w-120 leading-relaxed">
                        Verilex handles company incorporation, NGO and association registration, tax clearance, TIN, and
                        annual returns — every certificate your business needs, filed correctly the first time.
                    </p>
                    <div v-reveal class="flex flex-wrap gap-3.5 mt-8">
                        <a href="#contact"
                            class="inline-flex items-center bg-[#101E2B] text-[#EFEDE5] px-6 py-3.5 text-sm font-semibold hover:bg-[#A9834B] transition-colors">
                            Start a Registration
                        </a>
                        <a href="#services"
                            class="inline-flex items-center border border-[#D6D1C0] text-[#101E2B] px-6 py-3.5 text-sm font-semibold hover:border-[#A9834B] hover:text-[#A9834B] transition-colors">
                            See all services →
                        </a>
                    </div>
                    <div v-reveal class="flex flex-wrap gap-9 mt-14 pt-7 border-t border-[#D6D1C0] max-w-130">
                        <div>
                            <div class="font-display text-2xl font-semibold text-[#101E2B]">2,400+</div>
                            <div class="text-[12.5px] text-[#6B6558] mt-1">Filings completed</div>
                        </div>
                        <div>
                            <div class="font-display text-2xl font-semibold text-[#101E2B]">10</div>
                            <div class="text-[12.5px] text-[#6B6558] mt-1">Registration services</div>
                        </div>
                        <div>
                            <div class="font-display text-2xl font-semibold text-[#101E2B]">5–10</div>
                            <div class="text-[12.5px] text-[#6B6558] mt-1">Working days, typical</div>
                        </div>
                    </div>
                </div>

                <!-- Certificate stack visual -->
                <div v-reveal class="relative h-85 md:h-120 flex items-center justify-center mt-6 md:mt-0">
                    <div
                        class="absolute w-70 sm:w-75 bg-[#FBFAF6] border border-[#D6D1C0] shadow-[0_1px_2px_rgba(16,30,43,0.06),0_8px_24px_rgba(16,30,43,0.06)] p-7 font-mono2 -rotate-6 -translate-x-8">
                        <div class="flex justify-between text-[9.5px] text-[#9A9587] tracking-wider uppercase">
                            <span>CAC / RC</span><span>FILED</span>
                        </div>
                        <div class="font-display text-[19px] font-semibold text-[#101E2B] mt-4 mb-2.5 leading-tight">
                            Certificate of Incorporation</div>
                        <div class="h-1.75 bg-[#D6D1C0] mb-2"></div>
                        <div class="h-1.75 bg-[#D6D1C0] mb-2"></div>
                        <div class="h-1.75 bg-[#D6D1C0] mb-2"></div>
                        <div class="h-1.75 bg-[#D6D1C0] mb-2 w-[70%]"></div>
                        <div
                            class="mt-5 pt-4 border-t border-dashed border-[#D6D1C0] flex justify-between text-[9.5px] text-[#9A9587]">
                            <span>REF-0192-VLX</span><span>LAGOS, NG</span>
                        </div>
                    </div>

                    <div
                        class="relative z-2 w-70 sm:w-75 bg-[#FBFAF6] border border-[#D6D1C0] shadow-[0_1px_2px_rgba(16,30,43,0.06),0_8px_24px_rgba(16,30,43,0.06)] p-7 font-mono2 rotate-4 translate-x-8 translate-y-5">
                        <div class="flex justify-between text-[9.5px] text-[#9A9587] tracking-wider uppercase">
                            <span>FIRS / TIN</span><span>ISSUED</span>
                        </div>
                        <div class="font-display text-[19px] font-semibold text-[#101E2B] mt-4 mb-2.5 leading-tight">Tax
                            Clearance Certificate</div>
                        <div class="h-1.75 bg-[#D6D1C0] mb-2"></div>
                        <div class="h-1.75 bg-[#D6D1C0] mb-2"></div>
                        <div class="h-1.75 bg-[#D6D1C0] mb-2 w-[60%]"></div>
                    </div>

                    <svg class="absolute z-3 top-1/2 left-1/2 w-35 h-35 sm:w-37.5 sm:h-37.5 -translate-x-1/2 -translate-y-1/2 rotate-[-10deg] animate-seal-in"
                        viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="75" cy="75" r="70" fill="none" stroke="#A9834B" stroke-width="2" />
                        <circle cx="75" cy="75" r="60" fill="none" stroke="#A9834B" stroke-width="1" />
                        <path id="sealCircle" d="M 75,15 A 60,60 0 1 1 74.9,15" fill="none" />
                        <text font-family="IBM Plex Mono, monospace" font-size="8.4" letter-spacing="2.5"
                            fill="#A9834B">
                            <textPath href="#sealCircle" startOffset="0%">VERILEX · CHAMBERS · LAGOS · VERILEX ·
                                CHAMBERS · LAGOS ·</textPath>
                        </text>
                        <text x="75" y="70" text-anchor="middle" font-family="Fraunces, serif" font-size="30"
                            font-weight="600" fill="#101E2B">V</text>
                        <text x="75" y="92" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9"
                            letter-spacing="2" fill="#A9834B">APPROVED</text>
                    </svg>
                </div>
            </div>
        </section>

        <!-- ============================= MARQUEE ============================= -->
        <div class="bg-[#101E2B] text-[#EFEDE5] py-4 overflow-hidden whitespace-nowrap border-y border-[#A9834B]">
            <div class="inline-flex animate-marquee">
                <span v-for="(item, i) in marqueeLoop" :key="i"
                    class="inline-flex items-center gap-6 font-mono2 text-[13px] tracking-wide px-6 opacity-85 after:content-['◆'] after:text-[#A9834B] after:text-[8px]">
                    {{ item }}
                </span>
            </div>
        </div>

        <!-- ============================= SERVICES ============================= -->
        <section id="services" class="py-16 md:py-24">
            <div class="max-w-295 mx-auto px-5 sm:px-8">
                <div v-reveal class="max-w-160 mb-12 md:mb-14">
                    <div class="font-mono2 text-[11.5px] tracking-[0.14em] uppercase text-[#1E3B32] font-medium">
                        SERVICES</div>
                    <h2
                        class="font-display font-semibold text-[28px] sm:text-[36px] lg:text-[40px] text-[#101E2B] leading-tight mt-3">
                        Every filing, handled end to end
                    </h2>
                    <p class="text-[#6B6558] text-[16px] mt-4 leading-relaxed">
                        From first registration to yearly compliance, we prepare, submit, and track your paperwork with
                        the Corporate Affairs Commission and the Federal Inland Revenue Service — so you don't have to
                        learn the process yourself.
                    </p>
                </div>

                <div v-reveal class="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#D6D1C0] border border-[#D6D1C0]">
                    <div v-for="s in services" :key="s.code" class="bg-[#FBFAF6] hover:bg-white transition-colors p-7">
                        <div class="flex justify-between items-start mb-5">
                            <span class="font-mono2 text-[11px] text-[#A9834B] tracking-wide">{{ s.code }}</span>
                            <span
                                class="font-mono2 text-[9.5px] tracking-wider text-[#9A9587] border border-[#D6D1C0] px-2 py-0.5 rounded-full">{{
                                    s.agency }}</span>
                        </div>
                        <h3 class="text-[19px] text-[#101E2B] font-semibold leading-snug mb-2.5">{{ s.title }}</h3>
                        <p class="text-[14.5px] text-[#6B6558] leading-relaxed">{{ s.desc }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ============================= PROCESS ============================= -->
        <section id="process" class="bg-[#101E2B] text-[#EFEDE5] py-16 md:py-24">
            <div class="max-w-295 mx-auto px-5 sm:px-8">
                <div v-reveal class="max-w-160 mb-12 md:mb-14">
                    <div class="font-mono2 text-[11.5px] tracking-[0.14em] uppercase text-[#C9A467] font-medium">HOW IT
                        WORKS</div>
                    <h2 class="font-display font-semibold text-[28px] sm:text-[36px] lg:text-[40px] leading-tight mt-3">
                        Four steps, start to certificate</h2>
                    <p class="text-[rgba(239,237,229,0.65)] text-[16px] mt-4 leading-relaxed">
                        We built our process around what usually goes wrong with self-filing: missing documents,
                        rejected forms, and slow follow-up. Here's how we avoid all three.
                    </p>
                </div>
                <div v-reveal class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 mt-5">
                    <div v-for="(step, i) in processSteps" :key="step.num" class="lg:pl-5"
                        :class="i < processSteps.length - 1 ? 'lg:border-r lg:border-[rgba(239,237,229,0.15)]' : ''">
                        <div class="font-display text-[15px] text-[#C9A467] mb-4">{{ step.num }}</div>
                        <h3 class="font-display text-xl font-semibold mb-2.5">{{ step.title }}</h3>
                        <p class="text-sm text-[rgba(239,237,229,0.6)] leading-relaxed">{{ step.desc }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ============================= WHY VERILEX ============================= -->
        <section id="why" class="py-16 md:py-24">
            <div class="max-w-295 mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14 items-start">
                <div>
                    <div v-reveal class="max-w-160 mb-9">
                        <div class="font-mono2 text-[11.5px] tracking-[0.14em] uppercase text-[#1E3B32] font-medium">WHY
                            VERILEX</div>
                        <h2
                            class="font-display font-semibold text-[28px] sm:text-[36px] lg:text-[40px] text-[#101E2B] leading-tight mt-3">
                            Paperwork you don't have to worry about
                        </h2>
                    </div>
                    <div v-reveal>
                        <div v-for="(item, i) in whyItems" :key="item.title"
                            class="flex gap-5 py-6 border-t border-[#D6D1C0]"
                            :class="i === whyItems.length - 1 ? 'border-b' : ''">
                            <div
                                class="w-9.5 h-9.5 rounded-full border border-[#A9834B] shrink-0 flex items-center justify-center text-[#A9834B] font-display text-[15px]">
                                {{ item.icon }}
                            </div>
                            <div>
                                <h3 class="text-[17px] text-[#101E2B] font-semibold mb-1.5">{{ item.title }}</h3>
                                <p class="text-[14.5px] text-[#6B6558] leading-relaxed">{{ item.desc }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-reveal class="bg-[#E7E4D8] border border-[#D6D1C0] p-8 sm:p-11">
                    <div class="font-display text-6xl text-[#A9834B] leading-none">"</div>
                    <blockquote class="font-display text-[22px] leading-snug text-[#101E2B] mt-2.5 mb-6 font-medium">
                        Verilex registered our foundation and had the CAC certificate back to us in under two weeks. No
                        back-and-forth, no missing documents.
                    </blockquote>
                    <div class="text-[13.5px] text-[#6B6558]">
                        <strong class="text-[#101E2B] block mb-0.5">Adaeze O.</strong>Founder, community-based NGO
                    </div>
                    <div class="h-px bg-[#D6D1C0] my-7"></div>
                    <blockquote class="font-display text-[19px] leading-snug text-[#101E2B] mb-6 font-medium">
                        They caught an issue with our old business name filing before it became a problem at renewal
                        time.
                    </blockquote>
                    <div class="text-[13.5px] text-[#6B6558]">
                        <strong class="text-[#101E2B] block mb-0.5">Tunde A.</strong>Owner, retail enterprise
                    </div>
                </div>
            </div>
        </section>

        <!-- ============================= CONTACT / CTA ============================= -->
        <section id="contact" class="bg-[#1E3B32] text-[#EFEDE5]">
            <div class="max-w-295 mx-auto px-5 sm:px-8 py-16 md:py-24 grid lg:grid-cols-2 gap-14 items-center">
                <div v-reveal>
                    <div class="font-mono2 text-[11.5px] tracking-[0.14em] uppercase text-[#C9A467] font-medium">GET
                        STARTED</div>
                    <h2 class="font-display font-semibold text-[28px] sm:text-[36px] lg:text-[42px] leading-tight mt-3">
                        Ready to get registered?</h2>
                    <p class="mt-4 text-[rgba(239,237,229,0.7)] text-[16px] max-w-105 leading-relaxed">
                        Tell us which registration or filing you need. We'll reply within one business day with a fixed
                        quote and the documents to prepare.
                    </p>
                    <div class="mt-9 flex flex-col gap-2.5 text-[14.5px] text-[rgba(239,237,229,0.75)]">
                        <div>📍 12 Marina Business District, Lagos Island, Lagos</div>
                        <div>✉️ hello@verilex.ng</div>
                        <div>☎ +234 800 000 0000</div>
                    </div>
                </div>

                <form v-reveal @submit.prevent="submitContactForm"
                    class="bg-[#FBFAF6] text-[#1B1B18] p-8 border border-[rgba(239,237,229,0.15)]">
                    <div class="mb-4">
                        <label for="c-name" class="block text-xs text-[#6B6558] mb-1.5 font-medium">Full name</label>
                        <input id="c-name" v-model="contactForm.name" type="text" placeholder="Your name" required
                            class="w-full border border-[#D6D1C0] bg-white px-3.5 py-3 text-[14.5px] focus:outline-none focus:border-[#A9834B]">
                    </div>
                    <div class="mb-4">
                        <label for="c-contact" class="block text-xs text-[#6B6558] mb-1.5 font-medium">Phone or
                            email</label>
                        <input id="c-contact" v-model="contactForm.contact" type="text"
                            placeholder="How should we reach you?" required
                            class="w-full border border-[#D6D1C0] bg-white px-3.5 py-3 text-[14.5px] focus:outline-none focus:border-[#A9834B]">
                    </div>
                    <div class="mb-4">
                        <label for="c-service" class="block text-xs text-[#6B6558] mb-1.5 font-medium">Service
                            needed</label>
                        <select id="c-service" v-model="contactForm.service"
                            class="w-full border border-[#D6D1C0] bg-white px-3.5 py-3 text-[14.5px] focus:outline-none focus:border-[#A9834B]">
                            <option v-for="opt in serviceOptions" :key="opt">{{ opt }}</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label for="c-msg" class="block text-xs text-[#6B6558] mb-1.5 font-medium">Details
                            (optional)</label>
                        <textarea id="c-msg" v-model="contactForm.msg"
                            placeholder="Anything we should know before we call?"
                            class="w-full border border-[#D6D1C0] bg-white px-3.5 py-3 text-[14.5px] min-h-20 focus:outline-none focus:border-[#A9834B]"></textarea>
                    </div>
                    <button type="submit"
                        class="w-full flex items-center justify-center bg-[#101E2B] text-[#EFEDE5] px-6 py-3.5 text-sm font-semibold hover:bg-[#A9834B] transition-colors">
                        {{ contactSubmitted ? 'Request received ✓' : 'Request a Quote' }}
                    </button>
                </form>
            </div>
        </section>

        <!-- ============================= FOOTER ============================= -->
        <footer class="bg-[#101E2B] text-[rgba(239,237,229,0.6)] pt-16 pb-7">
            <div class="max-w-295 mx-auto px-5 sm:px-8">
                <div
                    class="grid sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 pb-12 border-b border-[rgba(239,237,229,0.12)]">
                    <div>
                        <div class="font-display font-semibold text-xl text-[#EFEDE5] mb-3.5">Verilex</div>
                        <p class="text-sm leading-relaxed max-w-70">
                            Company registration and CAC/FIRS filing agents based in Lagos, Nigeria. We handle the
                            paperwork so you can run the business.
                        </p>
                    </div>
                    <div>
                        <h4 class="text-xs tracking-wider uppercase text-[#EFEDE5] font-semibold mb-4">Services</h4>
                        <a href="#services" class="block text-sm py-1.5 hover:text-[#C9A467] transition-colors">Company
                            Registration</a>
                        <a href="#services" class="block text-sm py-1.5 hover:text-[#C9A467] transition-colors">NGO
                            Registration</a>
                        <a href="#services" class="block text-sm py-1.5 hover:text-[#C9A467] transition-colors">Tax
                            Clearance</a>
                        <a href="#services" class="block text-sm py-1.5 hover:text-[#C9A467] transition-colors">Annual
                            Returns</a>
                    </div>
                    <div>
                        <h4 class="text-xs tracking-wider uppercase text-[#EFEDE5] font-semibold mb-4">Firm</h4>
                        <a href="#process" class="block text-sm py-1.5 hover:text-[#C9A467] transition-colors">How it
                            works</a>
                        <a href="#why" class="block text-sm py-1.5 hover:text-[#C9A467] transition-colors">Why
                            Verilex</a>
                        <a href="#contact"
                            class="block text-sm py-1.5 hover:text-[#C9A467] transition-colors">Contact</a>
                    </div>
                    <div>
                        <h4 class="text-xs tracking-wider uppercase text-[#EFEDE5] font-semibold mb-4">Contact</h4>
                        <a href="mailto:hello@verilex.ng"
                            class="block text-sm py-1.5 hover:text-[#C9A467] transition-colors">hello@verilex.ng</a>
                        <a href="tel:+2348000000000"
                            class="block text-sm py-1.5 hover:text-[#C9A467] transition-colors">+234 800 000 0000</a>
                        <span class="block text-sm py-1.5">Lagos Island, Lagos</span>
                    </div>
                </div>
                <div class="flex flex-wrap justify-between items-center gap-3 pt-6 text-[12.5px]">
                    <span>© 2026 Verilex Chambers. All rights reserved.</span>
                    <span>Registered with the Corporate Affairs Commission, Nigeria.</span>
                </div>
            </div>
        </footer>

        <!-- ============================= AGENT MODAL ============================= -->
        <Transition enter-active-class="transition duration-250 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-250 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="agentModalOpen"
                class="fixed inset-0 z-100 bg-[rgba(16,30,43,0.55)] backdrop-blur-sm flex items-center justify-center p-6"
                @click="onOverlayClick" @mousedown="onOverlayClick">
                <Transition appear enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 translate-y-3 scale-[0.98]"
                    enter-to-class="opacity-100 translate-y-0 scale-100">
                    <div class="bg-[#FBFAF6] w-full max-w-110 p-8 sm:p-9 relative border border-[#D6D1C0] shadow-[0_24px_60px_rgba(16,30,43,0.25)] max-h-[88vh] overflow-y-auto"
                        role="dialog" aria-modal="true" aria-labelledby="agentModalTitle">
                        <button type="button" @click="closeAgentModal" aria-label="Close"
                            class="absolute top-4 right-4 w-7.5 h-7.5 border border-[#D6D1C0] rounded-full text-base text-[#6B6558] flex items-center justify-center hover:border-[#A9834B] hover:text-[#A9834B] transition-colors">
                            &times;
                        </button>

                        <div v-if="agentStep === 'form'">
                            <h3 id="agentModalTitle" class="font-display text-[23px] text-[#101E2B] font-semibold mb-2">
                                Speak with an agent</h3>
                            <p class="text-[14.5px] text-[#6B6558] leading-relaxed mb-6">
                                Share a few details and we'll connect you with the next available agent by phone, email,
                                or WhatsApp — whichever you prefer.
                            </p>
                            <form @submit.prevent="submitAgentForm">
                                <div class="mb-4">
                                    <label for="ag-name" class="block text-xs text-[#6B6558] mb-1.5 font-medium">First
                                        name</label>
                                    <input id="ag-name" ref="agentNameInput" v-model="agentForm.firstname" type="text"
                                        placeholder="Your First name" required
                                        class="w-full border border-[#D6D1C0] bg-white px-3.5 py-2.5 text-[14.5px] focus:outline-none focus:border-[#A9834B]">
                                </div>
                                <div class="mb-4">
                                    <label for="ag-name" class="block text-xs text-[#6B6558] mb-1.5 font-medium">Last
                                        name</label>
                                    <input id="ag-lname" v-model="agentForm.lastname" type="text"
                                        placeholder="Your Last name" required
                                        class="w-full border border-[#D6D1C0] bg-white px-3.5 py-2.5 text-[14.5px] focus:outline-none focus:border-[#A9834B]">
                                </div>
                                <div class="mb-4">
                                    <label for="ag-contact"
                                        class="block text-xs text-[#6B6558] mb-1.5 font-medium">Phone or email</label>
                                    <input id="ag-contact" v-model="agentForm.contact" type="text"
                                        placeholder="How should the agent reach you?" required
                                        class="w-full border border-[#D6D1C0] bg-white px-3.5 py-2.5 text-[14.5px] focus:outline-none focus:border-[#A9834B]">
                                </div>
                                <div class="mb-4">
                                    <label for="ag-topic" class="block text-xs text-[#6B6558] mb-1.5 font-medium">What's
                                        this about?</label>
                                    <select id="ag-topic" v-model="agentForm.topic"
                                        class="w-full border border-[#D6D1C0] bg-white px-3.5 py-2.5 text-[14.5px] focus:outline-none focus:border-[#A9834B]">
                                        <option v-for="opt in serviceOptions" :key="opt">{{ opt }}</option>
                                        <option>Something else</option>
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label for="ag-msg" class="block text-xs text-[#6B6558] mb-1.5 font-medium">Quick
                                        note (optional)</label>
                                    <textarea id="ag-msg" v-model="agentForm.msg"
                                        placeholder="Anything the agent should know before reaching out?"
                                        class="w-full border border-[#D6D1C0] bg-white px-3.5 py-2.5 text-[14.5px] min-h-16 focus:outline-none focus:border-[#A9834B]"></textarea>
                                </div>
                                <button type="submit"
                                    class="w-full flex items-center justify-center bg-[#101E2B] text-[#EFEDE5] px-6 py-3.5 text-sm font-semibold hover:bg-[#A9834B] transition-colors">
                                    Request an Agent
                                </button>
                            </form>
                        </div>

                        <div v-else class="text-center pt-3 pb-1">
                            <div
                                class="w-13 h-13 rounded-full border-[1.4px] border-[#1E3B32] text-[#1E3B32] flex items-center justify-center text-xl mx-auto mb-5">
                                ✓</div>
                            <h3 class="font-display text-[23px] text-[#101E2B] font-semibold mb-2.5">Request sent</h3>
                            <p class="text-[14.5px] text-[#6B6558] leading-relaxed mb-2">

                            <p>
                                We've notified our team. We will redirect you to the chat shortly.
                            </p>
                            </p>

                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>

    </div>
</template>

<style></style>
