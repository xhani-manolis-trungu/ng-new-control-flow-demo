import { Resolve } from "@angular/router";
import { DisplayPokemon } from "../interfaces/pokemon.interface";
import { PokemonListService } from "./pokemon-list.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class PokemonResolver {
  constructor(private service: PokemonListService) {}

  resolve(): Observable<DisplayPokemon[]> {
    return this.service.getPokemons();
  }
}
