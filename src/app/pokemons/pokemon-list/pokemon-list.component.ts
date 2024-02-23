import { ChangeDetectionStrategy, Component, ElementRef, EnvironmentInjector, Input, OnChanges, Signal, SimpleChange, SimpleChanges, ViewChild, computed, effect, inject, numberAttribute, runInInjectionContext } from '@angular/core';
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
  imports: [PokemonCardComponent, PokemonPaginationComponent],
  template: `
    <div class="container">
      <h2>Pokemon List</h2>
      <app-pokemon-pagination />
      <div #cardLayout class="card-layout">
        @defer (prefetch on immediate) {
          @for (pokemon of pokemons(); track $index) {
            <app-pokemon-card [pokemon]="pokemon" />
          }
        } @loading (minimum 500ms) {
        <p>Loading....</p>
        } @placeholder (minimum 300ms) {
        <p>Placeholder of Pokemon List</p>
        } @error {
        <p>Failed to load dependencies</p>
        }
      </div>

    </div>
  `,
  styles: [
    `
      h2 {
        text-decoration: underline;
        font-style: italic;
        margin-bottom: 2rem;
      }

      div.container {
        padding: 0.75rem;
        margin-bottom: 2rem;
      }

      .card-layout {
        display: flex;
        flex-wrap: wrap;
      }

      .card-layout > * {
        --num-cards: 7;
        flex-basis: calc((100% - 2 * 0.75rem) / var(--num-cards));
        flex-shrink: 1;
        flex-grow: 0;
      }

      @media (max-width: 1440px) {
        .card-layout > * {
          --num-cards: 6;
        }
      }

      @media (max-width: 1200px) {
        .card-layout > * {
          --num-cards: 5;
        }
      }

      @media (max-width: 992px) {
        .card-layout > * {
          --num-cards: 4;
        }
      }

      @media (max-width: 768px) {
        .card-layout > * {
          --num-cards: 3;
        }
      }

      @media (max-width: 576px) {
        .card-layout > * {
          --num-cards: 2;
        }
      }

      @media (max-width: 360px) {
        .card-layout > * {
          --num-cards: 1;
        }
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
    console.log(change);
    runInInjectionContext(this.environmentInjector, () => {
      if (change['_page'].currentValue > 1) {
        this.pokemons = toSignal(
          toObservable(this.currentPage).pipe(
            distinctUntilChanged((prev, curr) => prev !== curr),
            switchMap(() => this.pokemonLisService.getPokemons())
          ),
          { initialValue: [] as DisplayPokemon[] }
        );
      } else {
        this.pokemons = toSignal(this.getPokemonResolvedData(), {
          initialValue: [] as DisplayPokemon[],
        });
      }

    });
  }


  getPokemonsOnPageChange() {
    this.pokemons = toSignal(
      toObservable(this.currentPage).pipe(
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
