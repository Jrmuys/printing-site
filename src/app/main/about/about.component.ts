import { Component, OnInit, ViewChild } from '@angular/core';

import { Slide } from '../carousel/carousel.interface';
import { AnimationType } from '../carousel/carousel.animations';
import { CarouselComponent } from '../carousel/carousel.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  @ViewChild(CarouselComponent) carousel: CarouselComponent;

  apiUrl = 'https://thriftyprint.io/api/images/3DPrintPhotos';
  animationType = AnimationType.Slide;

  slides: Slide[] = [
    {
      headline: 'Gauge Enclosure',
      src: `${this.apiUrl}/Box.jpg`,
    },
    {
      headline: 'Gauge Enclosure',
      src: `${this.apiUrl}/Gaugebox.jpg`,
    },
    {
      headline: 'Front Dome Mirror Lever Arm Replica',
      src: `${this.apiUrl}/LeverArm.jpg`,
    },
    {
      headline: 'Ninebot Max Fender Support Arm',
      src: `${this.apiUrl}/Ninebot1.jpg`,
    },
    {
      headline: 'Ninebot Max Front Mud Flap',
      src: `${this.apiUrl}/Ninebot2.jpg`,
    },
    {
      headline: '3D Printed HTD Pulley',
      src: `${this.apiUrl}/Pulley.jpg`,
    },
    {
      headline: 'Hole Drill Template Tooling Fixture',
      src: `${this.apiUrl}/Template1.jpg`,
    },
    {
      headline: 'Hole Drill Template Tooling Fixture',
      src: `${this.apiUrl}/Template2.jpg`,
    },
    {
      headline: '3D Printed Vectored Intake Wheels',
      src: `${this.apiUrl}/VIWs.jpg`,
    },
    {
      headline: '3D Printed Vectored Intake Wheels',
      src: `${this.apiUrl}/VIWs2.jpg`,
    },
  ];

  constructor() {}

  setAnimationType(type) {
    this.animationType = type.value;
    setTimeout(() => {
      this.carousel.onNextClick();
    });
  }

  ngOnInit(): void {}
}
