import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EnvironmentInjector,
  Input,
  OnChanges,
  Signal,
  ViewChild,
  inject,
  numberAttribute,
  runInInjectionContext
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, switchMap } from 'rxjs';
import { DisplayPokemon } from '../interfaces/pokemon.interface';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { PokemonPaginationComponent } from '../pokemon-pagination/pokemon-pagination.component';
import { PokemonListService } from '../services/pokemon-list.service';
import { PlaceholderComponent } from './../placeholder/placeholder.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    PokemonCardComponent,
    PokemonPaginationComponent,
    PlaceholderComponent,
    NgOptimizedImage,
  ],
  template: `
    <div class="container">
      <div class="cards-container">
        @defer {
          @for (pokemon of pokemons(); track pokemon.index) {
            <app-pokemon-card [pokemon]="pokemon" />
          }
        } @placeholder (minimum 6s) {
          @for (i of [1,2,3,4,5,6,7,8,9,10]; track $index;) {
            @defer (on immediate) {
              <app-pokemon-placeholder />
            }
          }
        } @loading (after 100ms; minimum 2s) {
            <app-pokemon-placeholder />
        }
        <!--
          @loading (after 150ms; minimum 800ms) {
            @for (i of [1,2,3,4,5,6,7,8,9,10]; track $index) {
              <app-pokemon-placeholder />
            }
          } @error {
            <p>Failed to load dependencies</p>
          }
         -->
        <!--
          @loading (after 150ms; minimum 100ms) {
          <p>Loading....</p>
        } @error {
          <p>Failed to load dependencies</p>
        }
        -->
      </div>
    </div>
  `,
  styles: [
    `
      .cards-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); /* Adjust the minmax values as needed */
        gap: 20px;
        padding: 20px;
      }

      h2 {
        text-decoration: underline;
        font-style: italic;
      }

      div.container {
        padding: 0.75rem;
        margin-bottom: 2rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonListComponent implements OnChanges {
  @ViewChild('cardLayout') cardLayout!: ElementRef;

  private environmentInjector = inject(EnvironmentInjector);
  page = 1;
  pokemons!: Signal<DisplayPokemon[]>;

  @Input({
    transform: (value: string) => numberAttribute(value, 1),
    alias: 'page',
  })
  set _page(value: number) {
    this.page = value;
    this.currentPage.set(this.page - 1);
  }

  pokemonLisService = inject(PokemonListService);
  currentPage = this.pokemonLisService.currentPage;

  constructor() {}

  ngOnChanges() {
    runInInjectionContext(this.environmentInjector, () => {
      this.pokemons = this.getPokemonsOnPageChange();
    });
  }

  getPokemonsOnPageChange() {
    return toSignal(
      toObservable(this.currentPage).pipe(
        distinctUntilChanged((prev, curr) => prev !== curr),
        switchMap(() => this.pokemonLisService.getPokemons())
      ),
      { initialValue: [] as DisplayPokemon[] }
    );
  }
}
