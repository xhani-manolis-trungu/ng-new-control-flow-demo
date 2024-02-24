import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DisplayPokemon } from '../interfaces/pokemon.interface';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  template: `
    <div class="card">
      <div class="image">
        <img [ngSrc]="pokemon.frontShiny" width="80" height="80" priority placeholder/>
      </div>
      <div class="details">
        <label for="id">
          <span>Id: </span><span id="id" name="id">{{ pokemon.id }}</span>
        </label>
        <label for="name">
          <span>Name: </span>
          <button class="text-dark" [routerLink]="['pokemon', pokemon.id]" [state]="{ pokemon }"><span id="name" name="name">{{ pokemon.name }}</span></button>
        </label>
        <label for="weight">
          <span>Weight: </span><span id="weight" name="weight">{{ pokemon.weight }}</span>
        </label>
        <label for="height">
          <span>Height: </span><span id="height" name="height">{{ pokemon.height }}</span>
        </label>
      </div>
    </div>
  `,
  styles: [`
    .card, .image, .details {
      border-radius: 20px;
      display: flex;
    }

    .card {
      border: 1px solid #514646;
      background-color: #2f2b3a;
      padding: 0.75rem;
      margin: 0 0.25rem 0.25rem 0;
      height: 150px;
    }

    .image {
      justify-content: center;
      align-items: center;
      background-color: lightgrey;
      padding: 4px;
    }

    .details {
      flex-direction: column;
      justify-content: center;
      padding-left: 1rem;
    }

    #id, #weight, #height {
      color: #fff;
      font-weight: 600;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonCardComponent {
  @Input({ required: true })
  pokemon!: DisplayPokemon;
}
