import { Observable, Observer } from 'rxjs';
import { LoadHelper } from './loadHelper';
import { Constants } from './constants';
import { TextureResource, TileAsset } from '../map/model/';

export class AssetsLoader {
  private shaderUrl = 'src/shader/';
  private textureUrl = "src/assets/texture/";
  private levelUrl = "src/maps/";
  private audioUrl = "src/assets/audio/"
  private constants = Constants.getInstance();


  constructor() { }

  public getShader(fileName: string) {
    return this.httpGet(this.shaderUrl + fileName)
      .catch(this.handleError);
  }

  public getTexture(fileName: string) {
    return Observable.create((observer: Observer<any>) => {
      var texture = new Image();
      texture.src = this.textureUrl + fileName;
      texture.onload = function () {
        observer.next(texture);
        observer.complete();
      }
    });
  }

  public getLevel(level: string) {
    return this.httpGet(this.levelUrl + level + ".json")
      .map(this.extractLevel)
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

  private httpGetBinary(url: string): Observable<ArrayBuffer> {
    return Observable.create((observer: Observer<ArrayBuffer>) => {
      let xmlHttp = new XMLHttpRequest();

      xmlHttp.responseType = 'arraybuffer';

      xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          observer.next(xmlHttp.response);
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

  public getTileTextures(name: string): Observable<Map<number, TileAsset>> {
    return this.getTextures(name, this.constants.tileResources);
  }

  public getUiTextures(name: string) {
    return this.getTextures(name, this.constants.uiResources);
  }

  private getAudioData(name: string) {
    return this.httpGetBinary(this.audioUrl + name);
  }

  public getAudio(audioResources: string[]) {
    return Observable.create((obs: Observer<Map<string, ArrayBuffer>>) => {
      let map = new Map<string, ArrayBuffer>()

      let count = 0;
      for (let auidoResource of audioResources) {
        this.getAudioData(auidoResource).subscribe(it => {
          count++;
          map.set(auidoResource, it);

          if (count >= audioResources.length) {
            obs.next(map);
            obs.complete();
          }
        });
      }
    });
  }

  private getTextures(name: string, textureResources: TextureResource[]) {
    return Observable.create((obs: Observer<Map<number, TileAsset>>) => {
      let textures = new Map<number, TileAsset>();
      let count = 0;
      for (let textureResource of textureResources) {
        let texture = new Image();
        texture.src = this.textureUrl + textureResource.name;
        texture.onload = () => {
          count++;
          let key = +textureResource.name.split(name)[0];
          textures.set(key, new TileAsset(key, texture, textureResource.size));

          if (count >= textureResources.length) {
            obs.next(textures);
            obs.complete();
          }
        }
      }
    });
  }

  private extractLevel(responseText: string) {
    let loadHelper = LoadHelper.getInstance();
    let body = JSON.parse(responseText);

    try {
      let valid = loadHelper.validateLevelData(body)
      if(!valid) {
        throw new Error("Validation error")
      }
    } catch (e) {
      console.log("Invalid level: " + e);
      return  {};
    }

    return body;
  }

  private handleError(error: any) {
    let errMsg: string;
    errMsg = error.message ? error.message : error.toString();
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}