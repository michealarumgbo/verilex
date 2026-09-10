<script setup>
import { ref, computed } from 'vue'
import { adminStore } from '@/stores/adminStore'

const search = ref('')

const filteredClients = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return adminStore.clients
    return adminStore.clients.filter((c) =>
        `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(q)
    )
})
</script>

<template>
    <div class="flex-1 overflow-y-auto">
        <!-- top bar -->
        <div class="h-19.5 flex items-center px-8 border-b border-rule bg-paper/90 backdrop-blur-md sticky top-0 z-10">
            <div>
                <div class="font-mono2 text-[10.5px] tracking-[0.14em] uppercase text-emerald font-medium">RECORDS</div>
                <h1 class="font-display font-semibold text-[20px] text-ink leading-tight mt-0.5">Clients</h1>
            </div>
        </div>

        <div class="p-8 max-w-240">
            <input v-model="search" type="text" placeholder="Search clients by name or email…"
                class="w-full max-w-90 border border-rule bg-card px-4 py-3 text-[14px] mb-6 focus:outline-none focus:border-brass">

            <div class="border border-rule bg-card overflow-hidden">
                <table class="w-full text-left">
                    <thead>
                        <tr class="border-b border-rule bg-paper-2">
                            <th class="font-mono2 text-[10.5px] uppercase tracking-wider text-muted px-5 py-3">First
                                Name</th>
                            <th class="font-mono2 text-[10.5px] uppercase tracking-wider text-muted px-5 py-3">Last Name
                            </th>
                            <th class="font-mono2 text-[10.5px] uppercase tracking-wider text-muted px-5 py-3">Email
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in filteredClients" :key="c.id"
                            class="border-b border-rule last:border-b-0 hover:bg-white transition-colors">
                            <td class="px-5 py-4 text-[14.5px] text-charcoal font-medium">{{ c.firstName }}</td>
                            <td class="px-5 py-4 text-[14.5px] text-charcoal font-medium">{{ c.lastName }}</td>
                            <td class="px-5 py-4 text-[13.5px] font-mono2 text-muted">{{ c.email }}</td>
                        </tr>

                        <tr v-if="!filteredClients.length">
                            <td colspan="3" class="px-5 py-10 text-center text-[14px] text-muted-light">No clients match
                                "{{ search }}".</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
