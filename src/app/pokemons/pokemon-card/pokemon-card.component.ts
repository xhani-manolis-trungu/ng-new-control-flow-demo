import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayPokemon } from '../interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="image">
        <img [src]="pokemon.frontShiny" width="80" height="80" />
      </div>
      <div class="details">
        <label for="id">
          <span>Id: </span><span id="id" name="id">{{ pokemon.id }}</span>
        </label>
        <label for="name">
          <span>Name: </span><span id="name" name="name">{{ pokemon.name }}</span>
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
    :host {
      display: block;
    }

    .card {
      border: 1px solid black;
      display: flex;
      padding: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .image {
      display: flex;
      justify-content: center;
      align-item: center;
    }

    .details {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 1rem;
    }

    .details > label {
      margin-bottom: 0.25rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonCardComponent {
  @Input({ required: true })
  pokemon!: DisplayPokemon;
}
