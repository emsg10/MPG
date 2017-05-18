import { Observable, Observer } from 'rxjs';
import { LoadHelper } from './loadHelper';

export class AssetsLoader {
  private shaderUrl = 'src/assets/shader';
  private textureUrl = "src/assets/texture/tiles.png";
  private particleTextureUrl = "src/assets/texture/particleSprites.png";
  private genericParticleTextureUrl = "src/assets/texture/genericParticle.png";
  private levelUrl = "src/app/game/map";

  constructor() { }

  public getFragmentShader() {
    return this.httpGet(this.shaderUrl + "/fragmentShader.c")
      .catch(this.handleError);
  }

  public getVertexShader() {
    return this.httpGet(this.shaderUrl + "/vertexShader.c")
      .catch(this.handleError);
  }

  public getParticleVertexShader() {
    return this.httpGet(this.shaderUrl + "/particleVertexShader.c")
      .catch(this.handleError);
  }

  public getParticleFragmentShader() {
    return this.httpGet(this.shaderUrl + "/particleFragmentShader.c")
      .catch(this.handleError);
  }

  public getSimpleParticleVertexShader() {
    return this.httpGet(this.shaderUrl + "/simpleParticleVertexShader.c")
      .catch(this.handleError);
  }

  public getSimpleParticleFragmentShader() {
    return this.httpGet(this.shaderUrl + "/simpleParticleFragmentShader.c")
      .catch(this.handleError);
  }

  public getDynamicVertexShader() {
    return this.httpGet(this.shaderUrl + "/dynamicVertexShader.c")
      .catch(this.handleError);
  }

  public getDynamicFragmentShader() {
    return this.httpGet(this.shaderUrl + "/dynamicFragmentShader.c")
      .catch(this.handleError);
  }

  public getColorVertexShader() {
    return this.httpGet(this.shaderUrl + "/colorVertexShader.c")
      .catch(this.handleError);
  }

  public getColorFragmentShader() {
    return this.httpGet(this.shaderUrl + "/colorFragmentShader.c")
      .catch(this.handleError);
  }

  public getTexture(url: string) {
    return Observable.create((observer: Observer<any>) => {
      var texture = new Image();
      texture.src = url;
      texture.onload = function () {
        observer.next(texture);
        observer.complete();
      }
    });
  }

  public getParticleTexture() {
    return this.getTexture(this.particleTextureUrl);
  }

  public getGenericParticleTexture() {
    return this.getTexture(this.genericParticleTextureUrl);
  }

  public getTileTexture() {
    return this.getTexture(this.textureUrl);
  }

  public getLevel(level: string) {
    return this.httpGet(this.levelUrl + "/" + level + ".json")
      .map(this.extractData)
      .catch(this.handleError);
  }

  private httpGet(url: string): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
      let xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          observer.next(xmlHttp.responseText);
          observer.complete();
        };
      };

      xmlHttp.onerror = () => {
        observer.error(xmlHttp.responseText);
      };

      xmlHttp.open("GET", url, true);
      xmlHttp.send(null);
    });
  }

  private extractData(responseText: string) {
    let loadHelper = LoadHelper.getInstance();
    let body = JSON.parse(responseText);

    if (loadHelper.checkLevelType(body)) {
      return body;
    } else {
      throw new Error("Invalid data type");
    }
  }

  private handleError(error: any) {
    let errMsg: string;
    errMsg = error.message ? error.message : error.toString();
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}