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

  apiUrl = 'http://localhost:8080/api/images/3DPrintPhotos/';
  animationType = AnimationType.Slide;

  slides: Slide[] = [
    {
      headline: 'Gauge Enclosure',
      src: `${this.apiUrl}/box.jpg`,
    },
    {
      headline: 'Gauge Enclosure',
      src: `${this.apiUrl}/gaugebox.jpg`,
    },
    {
      headline: 'Front Dome Mirror Lever Arm Replica',
      src: `${this.apiUrl}/leverarm.jpg`,
    },
    {
      headline: 'Ninebot Max Fender Support Arm',
      src: `${this.apiUrl}/ninebot1.jpg`,
    },
    {
      headline: 'Ninebot Max Front Mud Flap',
      src: `${this.apiUrl}/ninebot2.jpg`,
    },
    {
      headline: '3D Printed HTD Pulley',
      src: `${this.apiUrl}/pulley.jpg`,
    },
    {
      headline: 'Hole Drill Template Tooling Fixture',
      src: `${this.apiUrl}/template1.jpg`,
    },
    {
      headline: 'Hole Drill Template Tooling Fixture',
      src: `${this.apiUrl}/template2.jpg`,
    },
    {
      headline: '3D Printed Vectored Intake Wheels',
      src: `${this.apiUrl}/viws.jpg`,
    },
    {
      headline: '3D Printed Vectored Intake Wheels',
      src: `${this.apiUrl}/viws2.jpg`,
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
