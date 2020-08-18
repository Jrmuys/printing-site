import { map } from 'rxjs/operators';
import { User } from './../models/user.model';
import { Model } from './../models/model.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = '/api/model';

  constructor(private httpClient: HttpClient) {}

  getModel(id: string) {
    return this.httpClient.get<{
      _id: string;
      user: User;
      title: string;
      filePath: string;
      units: string;
      comment: string;
      quantity: string;
    }>(this.apiUrl + '/' + id);
  }

  public upload(
    title: string,
    model: File,
    units: string,
    comment: string,
    quantity: number,
    user: User | null
  ) {
    console.log('\nUpload Service...');
    const modelData = new FormData();
    modelData.append('title', title);
    modelData.append('model', model, title);
    modelData.append('units', units);
    modelData.append('comment', comment);
    modelData.append('quantity', quantity.toString());
    console.log('User: ' + JSON.stringify(user) + ' type: ' + typeof user);
    if (user != null) {
      modelData.append('user', user.email);
    } else {
      modelData.append('user', null);
    }
    console.log('Model Data: ', JSON.stringify(modelData));

    return this.httpClient.post<{
      _id: string;
      user: User;
      title: string;
      filePath: string;
      units: string;
      comment: string;
      quantity: string;
    }>(
      this.apiUrl,
      modelData
      //    {
      //   reportProgress: true,
      //   observe: 'events',
      // }
    );
  }

  public updateModel(
    id: string,
    title: string,
    model: string,
    units: string,
    comment: string,
    quantity: number,
    user: User | null
  ) {
    console.log('Updating model...');
    let modelData: Model | FormData;
    if (typeof model === 'object') {
      const modelData = new FormData();
      modelData.append('title', title);
      modelData.append('model', model, title);
      modelData.append('units', units);
      modelData.append('comment', comment);
      modelData.append('quantity', quantity.toString());
    } else {
      modelData = {
        id: id,
        title: title,
        modelPath: model,
        units: units,
        comment: comment,
        quantity: quantity,
        user: user,
      };
    }
    console.log('Here');
    this.httpClient.put(this.apiUrl + '/' + id, modelData).subscribe(() => {
      console.log('Workdedded');
    });
    return this.httpClient.put<{
      _id: string;
      user: User | null;
      title: string;
      filePath: string;
      units: string;
      comment: string;
      quantity: string;
    }>(this.apiUrl, modelData);
  }
}
