import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Observer }     from 'rxjs';

@Injectable()
export class AssetsLoader {
  private shaderUrl = 'src/assets/shader';
  private textureUrl = "src/assets/texture/tiles.png"  // URL to web API

  constructor (private http: Http) {}
  
  getFragmentShader () {
    return this.http.get(this.shaderUrl + "/fragmentShader.c")
                    .map(this.extractTextData)
                    .catch(this.handleError);
  }

  getVertexShader () {
    return this.http.get(this.shaderUrl + "/vertexShader.c")
                    .map(this.extractTextData)
                    .catch(this.handleError);
  }

  getTexture() {
  	return Observable.create((observer: Observer<any>) => {
     var texture = new Image();
     texture.src = this.textureUrl;
     texture.onload = function(){
       observer.next(texture);
       observer.complete();
     }
   });
  }

  private extractImageData(res: Response) {
  	let body = res.arrayBuffer();
    return body;
  }

  private extractTextData(res: Response) {
  	let body = res.text();
    return body;
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || { };
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}