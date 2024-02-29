import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokemonPaginationComponent } from './pokemons/pokemon-pagination/pokemon-pagination.component';
import { setTitle } from './pokemons/utilities/title';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PokemonPaginationComponent],
  template: `
    <header id="header">
        <h2>Pokemon , I've gotta catch em all</h2>
        <span id="header-span">
          <span><img src="/assets/pokeball.png" width="64" height="64" alt="pokeball" priority/></span>
        </span>
      </header>

      <div class="container">
        <app-pokemon-pagination />
      </div>
      <router-outlet></router-outlet>
  `,
  styles: [
    `
      div.container {
        padding: 0 2.15rem 0 2.15rem;
        margin-bottom: 2rem;
      }
      #header {
        display: flex;
        flex-direction: column;
        text-align: center
      }

      #header > #header-span {
        display:flex;
        flex-direction: row;
        justify-content: center;
        align-items: center
      }
    `,
  ],
})
export class AppComponent {
  constructor() {
    setTitle();
  }
}
