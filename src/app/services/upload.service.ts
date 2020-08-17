import { Model } from './../models/model.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = '/api/model';

  constructor(private httpClient: HttpClient) {}

  public upload(title: string, model: File, units: string) {
    console.log('\nUpload Service...');
    const modelData = new FormData();
    modelData.append('title', title);
    modelData.append('model', model, title);
    modelData.append('units', units);
    console.log('Model Data: ', modelData);
    return this.httpClient.post<{
      _id: string;
      user: string;
      title: string;
      filePath: string;
      units: string;
    }>(
      this.apiUrl,
      modelData
      //    {
      //   reportProgress: true,
      //   observe: 'events',
      // }
    );
  }
}
