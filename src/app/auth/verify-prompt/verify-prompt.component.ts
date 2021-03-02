import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verify-prompt',
  templateUrl: './verify-prompt.component.html',
  styleUrls: ['./verify-prompt.component.scss'],
})
export class VerifyPromptComponent implements OnInit {
  isLoading: Boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
