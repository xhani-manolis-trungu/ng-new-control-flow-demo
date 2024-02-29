import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject, numberAttribute } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PokemonListService } from '../services/pokemon-list.service';
import { PokemonDetails } from './interfaces/pokemon-details.interface';
import { PokemonAbilitiesComponent } from './pokemon-abilities/pokemon-abilities.component';
import { PokemonPhysicalComponent } from './pokemon-physical/pokemon-physical.component';
import { PokemonStatisticsComponent } from './pokemon-statistics/pokemon-statistics.component';
import { PokemonDetailsService } from './services/pokemon-details.service';
import { PlaceholderComponent } from '../placeholder/placeholder.component';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [AsyncPipe, PokemonStatisticsComponent, PokemonAbilitiesComponent, PokemonPhysicalComponent, PlaceholderComponent],
  template: `
    <div class="content">
      @if (pokemonDetails$ | async; as pokemonDetails) {
        @defer (prefetch on immediate) {
          <app-pokemon-physical [pokemonDetails]="pokemonDetails" />
          <app-pokemon-statistics [statistics]="pokemonDetails.stats" />
          <app-pokemon-abilities [abilities]="pokemonDetails.abilities" />
        } @loading (after 150ms; minimum 100ms) {
          <p>Loading....</p>
        } @error {
          <p>Failed to load dependencies</p>
        }
      }
    </div>
    <div class="button-bar">
      <button (click)="backToPage()">Go back</button>
    </div>
  `,
  styles: [`
    .content {
      padding: 1rem;
      display: flex;
      flex-direction: column;
    }

    .button-bar {
      padding: 1rem;
    }

    button {
      padding: 0.25rem;
      border-radius: 4px;
    }

    app-pokemon-statistics,
    app-pokemon-physical,
    app-pokemon-abilities {
      margin-bottom: 0.5rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonComponent implements OnInit {
  @Input({ required: true, transform: (id: string) => numberAttribute(id, 1) })
  id = 1;

  pokemonDetailsService = inject(PokemonDetailsService);
  router = inject(Router);
  pokemonDetails$!: Observable<PokemonDetails | undefined>;
  page = 0;

  constructor(pokemonListService: PokemonListService) {
    this.page = pokemonListService.getPage(this.id);
    pokemonListService.currentPage.set(this.page - 1);
  }

  ngOnInit(): void {
    this.pokemonDetails$ = this.pokemonDetailsService.getPokemonDetails(this.id, history.state?.pokemon);
  }

  backToPage() {
    const currentPage = parseInt(sessionStorage.getItem('currentPage') as unknown as string);
    this.router.navigate(['/list'], { queryParams: { page: currentPage + 1 }});
  }
}
