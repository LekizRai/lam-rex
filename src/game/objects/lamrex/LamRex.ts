import sprite from '../../utils/sprites'
import config from '../../utils/configs'
import LamRexState from './LamRexState'
import Image from '../../../engine/objects/Image'
import Vector2D from '../../../engine/types/Vector2D'
import Message from '../../../engine/controllers/Message'
import GameObject from '../../../engine/objects/base-classes/GameObject'

class LamRex extends Image {
    private onCollideWithDictionary: {[obj: string]: (() => void)[]}
    private onCollideWithList: GameObject[]

    constructor(location: Vector2D, zIndex?: number) {
        if (zIndex) {
            super(location, sprite.LAM_SPRITE.clip, zIndex)
        } else {
            super(location, sprite.LAM_SPRITE.clip)
        }
        this.setTex(this.resourceManager.getTex(1))

        this.setState(new LamRexState.LamRexStartState())

        this.onCollideWithDictionary = {}
        this.onCollideWithList = []
    }

    public handleInput(message: Message): void {
        this.handleInputState(message)
    }

    public update(timeInterval: number): void {
        this.updateState(timeInterval)
        this.onCollideWithList.forEach((obj: GameObject) => {
            if (this.isColliedWith(obj)) {
                this.onCollideWithDictionary[JSON.stringify(obj)].forEach((callback: () => void) => {
                    callback()
                })
            }
        })
    }

    public onCollideWith(obj: GameObject, callback: () => void): void {
        if (!this.onCollideWithDictionary[JSON.stringify(obj)]) {
            this.onCollideWithDictionary[JSON.stringify(obj)] = []
        }
        this.onCollideWithDictionary[JSON.stringify(obj)].push(callback)
        if (this.onCollideWithList.indexOf(obj) < 0) {
            this.onCollideWithList.push(obj)
        }
    }
}

export default LamRex
