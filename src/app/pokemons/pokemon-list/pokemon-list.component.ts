import { PlaceholderComponent } from './../placeholder/placeholder.component';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EnvironmentInjector,
  Input,
  OnChanges,
  Signal,
  SimpleChange,
  SimpleChanges,
  ViewChild,
  computed,
  effect,
  inject,
  numberAttribute,
  runInInjectionContext,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, distinctUntilChanged, map, switchMap, tap } from 'rxjs';
import { DisplayPokemon } from '../interfaces/pokemon.interface';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { PokemonPaginationComponent } from '../pokemon-pagination/pokemon-pagination.component';
import { PokemonListService } from '../services/pokemon-list.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    PokemonCardComponent,
    PokemonPaginationComponent,
    PlaceholderComponent,
  ],
  template: `
    <div class="container">
      <header style="display: flex; flex-direction: column; text-align: center">
        <h2>Pokemon , I've gotta catch em all</h2>
        <span
          style="display:flex; flex-direction: row; justify-content: center; align-items: center"
        >
          <span><img src="assets/pokeball.png" alt="pokeball" /></span>
        </span>
      </header>
      @defer {
        <app-pokemon-pagination />
      }
      <div #cardLayout class="cards-container">
        @defer (prefetch on immediate) {
          @for (pokemon of pokemons(); track $index) {
            <app-pokemon-card [pokemon]="pokemon" />
          }
        } @placeholder (minimum 800ms) {
          @for (i of [1,2,3,4,5,6,7,8,9,10]; track $index) {
            @defer (on immediate) {
              <app-pokemon-placeholder />
            }
          }
        } @loading (after 150ms; minimum 100ms) {
          <p>Loading....</p>
        } @error {
          <p>Failed to load dependencies</p>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .cards-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(290px, 2fr)); /* Adjust the minmax values as needed */
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

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnChanges(change: SimpleChanges) {
    runInInjectionContext(this.environmentInjector, () => {
      if (change['_page'].currentValue > 1) {
        this.pokemons = this.getPokemonsOnPageChange();
      } else {
        this.pokemons = toSignal(this.getPokemonResolvedData(), {
          initialValue: [] as DisplayPokemon[],
        });
      }
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

  getPokemonResolvedData(): Observable<DisplayPokemon[]> {
    return this.activatedRoute.data.pipe(
      switchMap(async (data) => data),
      map((data) => data['pokemon'])
    );
  }
}
