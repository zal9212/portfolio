import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetenceList } from '../competences/competence-list/competence-list';
import { ProjetList } from '../projets/projet-list/projet-list';
import { ParcoursList } from '../parcours/parcours-list/parcours-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CompetenceList, ProjetList, ParcoursList],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  profiles = [
    {
      name: 'Mamadou Saliou Diallo',
      role: 'Développeur Backend ',
      image: 'assets/saliou.jpg',
      cv: 'assets/resume-example.pdf'
    },
    {
      name: 'Gnima Sané',
      role: 'Développeuse Frontend ',
      image: 'assets/gnima.png',
      cv: 'assets/resume-example.pdf'
    }
  ];

  openCV(cvPath: string) {
    window.open(cvPath, '_blank');
  }

  scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
