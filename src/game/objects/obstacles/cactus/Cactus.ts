import utils from '../../../../engine/utils/utils'
import sprite from '../../../utils/sprites'
import config from '../../../utils/configs'
import Image from '../../../../engine/objects/Image'
import Collider from '../../../../engine/components/Collider'
import RigidBody from '../../../../engine/components/RigidBody'
import Vector2D from '../../../../engine/types/Vector2D'
import Message from '../../../../engine/controllers/Message'

const cactusColliderList = [
    new Collider(new Vector2D(3, 9), 38, 40)
]

class Cactus extends Image {
    constructor(location: Vector2D) {
        super(location, sprite.OBSTACLE_SPRITE.clip)
        this.setTex(this.resourceManager.getTex(3))
        this.setColliderList(cactusColliderList)
        this.setVelocityX(config.CACTUS_VELOCITY_X)
    }

    public handleInput(message: Message): void {}

    public update(timeInterval: number): void {
        let shiftX = this.getShiftX()
        this.setX(this.getX() - shiftX)
    }
}

export default Cactus
