import { Component } from '@angular/core';

@Component({
  selector: 'auth-page-layout',
  imports: [],
  template: `
    <div
      class="flex flex-col justify-center bg-zinc-300 px-6 py-12 sm:mx-auto sm:max-w-md sm:bg-zinc-200 sm:shadow-lg lg:max-w-lg lg:px-8"
    >
      <div class="mx-auto rounded-xl bg-gray-800 px-28 py-5 text-center text-white font-extrabold">
        <!--<img src="app-logo-small.png" alt="App logo" class="w-36" />-->
        QUIZ
      </div>

      <div class="mt-12 sm:mx-auto sm:w-full sm:max-w-sm">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class AuthPageLayoutComponent {
  constructor() {}
}
