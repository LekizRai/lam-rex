import sprite from '../../utils/sprites'
import config from '../../utils/configs'
import Image from '../../../engine/objects/Image'
import Vector2D from '../../../engine/types/Vector2D'
import Message from '../../../engine/controllers/Message'

class Ground extends Image {
    constructor(location: Vector2D) {
        super(location, sprite.BACKGROUND_SPRITE.clip, -10)
        this.setTex(this.resourceManager.getTex(5))
    }

    public handleInput(message: Message): void {}

    public update(timeInterval: number): void {
        // let shiftX: number = this.getShiftX()
        // this.setX(this.getX() - shiftX)
    }
}

export default Ground
