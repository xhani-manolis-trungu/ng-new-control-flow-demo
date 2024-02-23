import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { PokemonResolver } from './pokemons/services/pokemon-resolver.service';

export const routes: Routes = [
    {
        path: 'list',
        loadComponent: () => import('./pokemons/pokemon-list/pokemon-list.component')
            .then((m) => m.PokemonListComponent),
        resolve: {'pokemon': PokemonResolver},
        title: 'Pokemon List'
    },
    {
        path: 'list/pokemon/:id',
        loadComponent: () => import('./pokemons/pokemon/pokemon.component')
            .then((m) => m.PokemonComponent),
        title: 'Pokemon Details'
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/list?limit=10&page=1',
    },
    {
        path: '**',
        redirectTo: '/list?limit=10&page=1',
    }
];
