import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-pokemon-placeholder',
  standalone: true,
  template: `
    <div class="placeholder-wrapper">
      <div class="load-wraper">
        <div class="activity"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .placeholder-wrapper {
        border: 1px solid black;
        display: flex;
        padding: 0.75rem;
        margin: 0 0.25rem 0.25rem 0;
        height: 160px;
        border-radius: 20px;
        width: auto;
      }

      .load-wraper {
        position: relative;
        height: 100%;
        width: 100%;
        background-color: rgb(155, 149, 149);
        z-index: 44;
        overflow: hidden;
        border-radius: 5px;
      }
      .activity {
        position: absolute;
        left: -45%;
        height: 100%;
        width: 100%;
        background-image: linear-gradient(
          to left,
          rgba(251, 251, 251, 0.05),
          rgba(251, 251, 251, 0.3),
          rgba(251, 251, 251, 0.6),
          rgba(251, 251, 251, 0.3),
          rgba(251, 251, 251, 0.05)
        );
        background-image: -moz-linear-gradient(
          to left,
          rgba(251, 251, 251, 0.05),
          rgba(251, 251, 251, 0.3),
          rgba(251, 251, 251, 0.6),
          rgba(251, 251, 251, 0.3),
          rgba(251, 251, 251, 0.05)
        );
        background-image: -webkit-linear-gradient(
          to left,
          rgba(251, 251, 251, 0.05),
          rgba(251, 251, 251, 0.3),
          rgba(251, 251, 251, 0.6),
          rgba(251, 251, 251, 0.3),
          rgba(251, 251, 251, 0.05)
        );
        animation: loading 1s infinite;
        z-index: 45;
      }

      @keyframes loading {
        0% {
          left: -45%;
        }
        100% {
          left: 100%;
        }
      }
    `,
  ]
})
export class PlaceholderComponent {}
