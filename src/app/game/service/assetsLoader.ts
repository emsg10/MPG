import { Observable, Observer } from 'rxjs';
import { LoadHelper } from './loadHelper';
import { Constants } from './constants';
import { TextureResource, TileAsset } from '../map/model/';

export class AssetsLoader {
  private shaderUrl = 'src/assets/shader/';
  private textureUrl = "src/assets/texture/";
  private levelUrl = "src/app/game/map/";
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

  public getTileTextures(name: string): Observable<Map<number, TileAsset>> {
    return Observable.create((obs: Observer<Map<number, TileAsset>>) => {
      let textures = new Map<number, TileAsset>();
      let count = 0;
      for (let textureResource of this.constants.textureResources) {
        let texture = new Image();
        texture.src = this.textureUrl + textureResource.name;
        texture.onload = () => {
          count++;
          let key = +textureResource.name.split(name)[0];
          textures.set(key, new TileAsset(key, texture, textureResource.size));

          if (count >= this.constants.textureResources.length) {
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
    } catch (e) {
      console.log("Invalid level: " + e);
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