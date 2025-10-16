import { Component, Input, input, OnInit, Pipe } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FeatureCard } from '../../models/utility';


@Component({
  selector: 'app-feature-card',
  templateUrl: './feature-card.component.html',
  styleUrls: ['./feature-card.component.scss'],
  standalone: false
})
export class FeatureCardComponent {
  data = input<FeatureCard>();
  @Input() isClickable: boolean = false;
  @Input() customClass: string = '';
  @Input() url?: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md'; // Nuova proprietà per la dimensione

  constructor(private sanitizer: DomSanitizer, private router: Router) {
  }

  // Calcola il limite del truncate in base alla dimensione
  get truncateLimit(): number {
    switch (this.size) {
      case 'sm':
        return 20;
      case 'lg':
        return 50;
      case 'md':
      default:
        return 20;
    }
  }

  // Limite specifico per il titolo (più corto)
  get titleTruncateLimit(): number {
    switch (this.size) {
      case 'sm':
        return 15;
      case 'lg':
        return 40;
      case 'md':
      default:
        return 25;
    }
  }

  // Limite specifico per le note (più corto del testo principale)
  get noteTruncateLimit(): number {
    switch (this.size) {
      case 'sm':
        return 15;
      case 'lg':
        return 40;
      case 'md':
      default:
        return 25;
    }
  }

  navigateToUrl() {
    if (this.url && this.isClickable) {
      // Se l'URL inizia con http/https, naviga esternamente
      if (this.url.startsWith('http://') || this.url.startsWith('https://')) {
        window.open(this.url, '_blank');
      } else {
        // Altrimenti naviga internamente con il router
        this.router.navigate([this.url]);
      }
    }
  }

  getSanitizedSVG(svgContent: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgContent);
  }

}
