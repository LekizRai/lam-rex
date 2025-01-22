import Image from '../../../engine/objects/Image'
import Message from '../../../engine/controllers/Message'
import Vector2D from '../../../engine/types/Vector2D'
import sprite from '../../utils/sprites'

class GameOver extends Image {
    constructor() {
        super(new Vector2D(350, 160), sprite.GAMEOVER_1_SPRITE.clip)
        this.setTex(this.resourceManager.getTex(6))
    }

    public handleInput(message: Message): void {}

    public update(timeInterval: number): void {}

    protected contentToSpriteList(): void {
        // this.spriteList.length = 0
        // this.spriteList.push(sprite.GAMEOVER_SPRITE.clip)
    }
}

export default GameOver
