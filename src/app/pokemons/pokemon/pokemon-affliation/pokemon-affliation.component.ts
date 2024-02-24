import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AffiliationPipe } from './pipes/affiliation.pipe';
import { PokemonAffiliation } from './types/affiliation.type';

@Component({
  selector: 'app-pokemon-affliation',
  standalone: true,
  imports: [TitleCasePipe, AffiliationPipe],
  template: `
    @switch (affiliation.type) {
      @case ('pikachu') {
        <p class="team">{{ affiliation.type | titlecase | affiliation:affiliation.owner }}</p>
      } @case ('meowth') {
        <p class="team">{{ affiliation.type | titlecase | affiliation:affiliation.owner }}</p>
      } @case ('staryu') {
        <p class="team">{{ affiliation.type | titlecase | affiliation:affiliation.owner }}</p>
      } @case ('steelix') {
        <p class="team">{{ affiliation.type | titlecase | affiliation:affiliation.owner }}</p>
      } @case ('unknown') {
        <p class="team">{{ affiliation.warningMessage }}</p>
      } @default {
        <p class="team">This should not appear</p>
      }
    }
  `,
  styles: [`
    p.team {
      margin-bottom: 1rem;
      text-transform: capitalize;
      font-weight: 700;
      font-family: "Plus_Jakarta_Sans", "Roboto", -apple-system, "Segoe UI", sans-serif;
      color: #908d96;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonAffliationComponent {
  @Input({ required: true })
  affiliation!: PokemonAffiliation;
}
