import { TextureResource } from '../map/model/';

export class Constants {

    private static instance: Constants = new Constants();

    constrcuctor() {
        if (Constants.instance) {
            throw new Error("Static class cant be instanced!");
        }

        Constants.instance = this;
    }

    public static getInstance() {
        return Constants.instance;
    }

    public tileResources: TextureResource[] = [
        new TextureResource("1tile.png", [32, 32]),
        new TextureResource("2tile.png", [32, 32]),
        new TextureResource("3tile.png", [32, 32]),
        new TextureResource("4tile.png", [32, 32]),
        new TextureResource("5tile.png", [32, 32]),
        new TextureResource("6tile.png", [32, 32]),
        new TextureResource("7tile.png", [32, 32]),
        new TextureResource("8tile.png", [32, 32]),
        new TextureResource("9tile.png", [32, 32])
    ];

    public uiResources: TextureResource[] = [
        new TextureResource("100ui.png", [256, 128]),
        new TextureResource("101ui.png", [512, 512]),
        new TextureResource("102ui.png", [256, 256]),
        new TextureResource("103ui.png", [256, 256]),
        new TextureResource("104ui.png", [256, 256]),
        new TextureResource("105ui.png", [256, 256]),
        new TextureResource("106ui.png", [256, 256]),
        new TextureResource("107ui.png", [256, 256]),
        new TextureResource("108ui.png", [256, 256]),
        new TextureResource("109ui.png", [256, 256]),
        new TextureResource("110ui.png", [256, 256]),
        new TextureResource("111ui.png", [256, 256]),
        new TextureResource("112ui.png", [256, 256]),
        new TextureResource("113ui.png", [256, 256]),
        new TextureResource("114ui.png", [256, 256]),
        new TextureResource("115ui.png", [256, 256]),
        new TextureResource("116ui.png", [256, 256]),
        new TextureResource("117ui.png", [256, 256]),
        new TextureResource("118ui.png", [256, 256]),
        new TextureResource("119ui.png", [256, 256]),
        new TextureResource("120ui.png", [256, 256]),
        new TextureResource("121ui.png", [256, 256]),
        new TextureResource("122ui.png", [1024, 1024]),
        new TextureResource("123ui.png", [1024, 1024])
    ];

    public audioResources: string[] = [
        "explosion1.wav",
        "explosion2.wav",
        "flamethrower.ogg",
        "freeze.ogg",
        "shield.ogg",
        "foom.wav",
        "fireloop.ogg",
        "jump.ogg",
        "bow.wav",
        "arrowhit.wav",
        "playerhit.wav",
        "swordmanhit.wav",
        "swing3.wav",
        "shade9.wav",
        "shade15.wav",
        "shade2.wav",
        "swordmandeath.wav",
        "shade13.wav",
        "soundseffects.ogg",
        "shot2.ogg",
        "forcepush.ogg",
        "explode4.ogg",
        "ogre2.wav",
        "mnstr3.wav",
        "mnstr5.wav",
        "magic1.wav",
        "spellend.wav",
        "fireplace.wav",
        "shade11.wav",
        "shade12.wav",
        "step.flac",
        "menubackground.mp3",
        "gamebackground.ogg"
    ];

    public tileSize: [number, number] = [32, 32];
}