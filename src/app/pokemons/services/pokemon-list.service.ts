import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { EMPTY, Observable, catchError, forkJoin, map, retry } from 'rxjs';
import { Ability } from '../interfaces/pokemon-abilities.interface';
import { Statistics } from '../interfaces/pokemon-statistics.interface';
import { DisplayPokemon, Pokemon } from '../interfaces/pokemon.interface';
import { transformSpecialPowers } from '../utilities/transform-special-powers.util';

const PAGE_SIZE = 10;

@Injectable({
  providedIn: 'root'
})
export class PokemonListService {
  private readonly httpClient = inject(HttpClient);

  currentPage = signal(0);

  getPage(pokemonId: number): number {
    return Math.ceil(pokemonId / PAGE_SIZE);
  }

  getPokemons(): Observable<DisplayPokemon[]> {
    const pageSize = PAGE_SIZE;
    const pokemonIds = [...Array(pageSize).keys()]
      .map((n) => {
        return pageSize * this.currentPage() + (n + 1)
      });

      console.log(pokemonIds)
    return forkJoin(pokemonIds.map((id, index) => this.get(id, index)));
  }

  private pokemonTransformer(pokemon: Pokemon, index: number): DisplayPokemon {
    const { id, name, height, weight, sprites, abilities: a, stats: statistics } = pokemon;

    const { abilities, stats }: { abilities: Ability[]; stats: Statistics[]; } = transformSpecialPowers(a, statistics);

    return {
      id,
      name,
      height,
      weight,
      abilities,
      stats,
      frontShiny: sprites.other.dream_world.front_default,
      index
    }
  }

  private get(id: number, index: number): Observable<DisplayPokemon> {
    return this.httpClient
      .get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .pipe(
        map((pokemon) => this.pokemonTransformer(pokemon, index)),
        retry(3),
        catchError((err) => {
          console.error(err);
          return EMPTY;
        }),
      );
  }
}
