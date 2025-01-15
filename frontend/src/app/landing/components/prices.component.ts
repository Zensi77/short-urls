import { Component } from '@angular/core';

@Component({
  selector: 'app-prices',
  template: `
    <div class="w-full mx-auto bg-white px-5 py-10 text-gray-600 mb-10">
      <div class="max-w-5xl mx-auto md:flex justify-between">
        <div class="md:w-1/4 md:flex md:flex-col">
          <div class="text-left w-full flex-grow md:pr-5">
            <h1 class="text-4xl font-bold mb-4 text-blue-600">Precios</h1>
            <h3 class="text-lg font-medium mb-5 text-gray-500">
              Elige el plan que mejor se adapte a tus necesidades
            </h3>
          </div>
          <div class="w-full mb-4">
            <p class="text-xs text-gray-500">
              *Todos los precios tienen el IVA incluido
            </p>
          </div>
        </div>
        <div class="md:w-3/4">
          <div class="max-w-4xl mx-auto md:flex justify-between gap-6">
            <div
              class="w-full md:w-1/3 bg-white px-8 md:px-10 py-8 md:py-10 mb-3 rounded-lg shadow-md shadow-gray-300 hover:shadow-xl transition-shadow"
            >
              <div class="w-full flex-grow">
                <h2 class="text-center font-bold uppercase text-gray-800 mb-4">
                  Free
                </h2>
                <h3 class="text-center font-bold text-4xl text-blue-500 mb-5">
                  $0<span class="text-sm text-gray-500">/mo</span>
                </h3>
                <ul class="text-sm text-gray-600 mb-8">
                  <li class="leading-tight mb-2">
                    <i class="pi pi-check text-lg text-green-500"></i> Máximo 10
                    links
                  </li>
                  <li class="leading-tight mb-2">
                    <i class="pi pi-times text-lg text-red-500"></i>
                    Estadísticas
                  </li>
                  <li class="leading-tight mb-2">
                    <i class="pi pi-times text-lg text-red-500"></i> Links
                    personalizados
                  </li>
                </ul>
              </div>
              <div class="w-full">
                <button
                  class="font-bold bg-gray-600 hover:bg-gray-700 text-white rounded-md px-10 py-2 transition-colors w-full"
                >
                  Comprar
                </button>
              </div>
            </div>

            <div
              class="w-full md:w-1/3 bg-white px-8 md:px-10 py-8 md:py-10 mb-3 rounded-lg shadow-md shadow-gray-300 hover:shadow-xl transition-shadow"
            >
              <div class="w-full flex-grow">
                <h2 class="text-center font-bold uppercase text-gray-800 mb-4">
                  Pro
                </h2>
                <h3 class="text-center font-bold text-4xl text-blue-500 mb-5">
                  $15<span class="text-sm text-gray-500">/mo</span>
                </h3>
                <ul class="text-sm text-gray-600 mb-8">
                  <li class="leading-tight mb-2">
                    <i class="pi pi-check text-lg text-green-500"></i> Links
                    ilimitados
                  </li>
                  <li class="leading-tight mb-2">
                    <i class="pi pi-check text-lg text-green-500"></i> Links
                    personalizados
                  </li>
                  <li class="leading-tight mb-2">
                    <i class="pi pi-times text-lg text-red-500"></i>
                    Estadísticas avanzadas
                  </li>
                </ul>
              </div>
              <div class="w-full">
                <button
                  class="font-bold bg-gray-600 hover:bg-gray-700 text-white rounded-md px-10 py-2 transition-colors w-full"
                >
                  Comprar
                </button>
              </div>
            </div>

            <div
              class="w-full md:w-1/3 bg-white px-8 md:px-10 py-8 md:py-10 mb-3 rounded-lg shadow-md shadow-gray-300 hover:shadow-xl transition-shadow"
            >
              <div class="w-full flex-grow">
                <h2 class="text-center font-bold uppercase text-gray-800 mb-4">
                  Company
                </h2>
                <h3 class="text-center font-bold text-4xl text-blue-500 mb-5">
                  $50<span class="text-sm text-gray-500">/mo</span>
                </h3>
                <ul class="text-sm text-gray-600 mb-8">
                  <li class="leading-tight mb-2">
                    <i class="pi pi-check text-lg text-green-500"></i> Links
                    ilimitados
                  </li>
                  <li class="leading-tight mb-2">
                    <i class="pi pi-check text-lg text-green-500"></i> Links
                    personalizados
                  </li>
                  <li class="leading-tight mb-2">
                    <i class="pi pi-check text-lg text-green-500"></i>
                    Estadísticas avanzadas
                  </li>
                </ul>
              </div>
              <div class="w-full">
                <button
                  class="font-bold bg-gray-600 hover:bg-gray-700 text-white rounded-md px-10 py-2 transition-colors w-full"
                >
                  Comprar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PricesComponent {}
