import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="p-6 flex flex-col gap-6">
      <h2 class="text-xl font-medium tracking-wide text-amber-400">Dashboard</h2>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div class="border border-zinc-800 rounded-lg p-4 bg-[#161616]">
          <h3 class="text-sm font-semibold mb-2 text-zinc-200">Utenti</h3>
          <p class="text-xs text-zinc-500">Placeholder stato utenti / metriche.</p>
        </div>
        <div class="border border-zinc-800 rounded-lg p-4 bg-[#161616]">
          <h3 class="text-sm font-semibold mb-2 text-zinc-200">Ruoli</h3>
          <p class="text-xs text-zinc-500">Placeholder stato ruoli / permessi.</p>
        </div>
        <div class="border border-zinc-800 rounded-lg p-4 bg-[#161616] md:col-span-2 xl:col-span-1">
          <h3 class="text-sm font-semibold mb-2 text-zinc-200">Attività</h3>
          <p class="text-xs text-zinc-500">Widget attività recente in arrivo.</p>
        </div>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {}
