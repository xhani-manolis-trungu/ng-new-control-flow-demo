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
          <a [routerLink]="['pokemon', pokemon.id]" [state]="{ pokemon }"><span id="name" name="name">{{ pokemon.name }}</span></a>
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
    .card {
      border: 1px solid black;
      display: flex;
      padding: 0.75rem;
      margin-bottom: 0.25rem;
      height: 150px;
      width: 240px;
    }

    .image {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: lightgrey;
    }

    .details {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 1rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonCardComponent {
  @Input({ required: true })
  pokemon!: DisplayPokemon;
}
