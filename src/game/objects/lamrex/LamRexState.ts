import config from '../../utils/configs'
import key from '../../utils/keys'
import GameObjectState from '../../../engine/objects/base-classes/GameObjectState'
import LamRex from './LamRex'
import Vector2D from '../../../engine/types/Vector2D'
import Message from '../../../engine/controllers/Message'
import Collider from '../../../engine/components/Collider'

const lamRexColliderList = [
    new Collider(new Vector2D(4, 12), 34, 40)
]

class LamRexRunningState extends GameObjectState {
    private rotateForward: boolean

    constructor() {
        super()
        this.rotateForward = true
    }

    public handleInput(obj: LamRex, message: Message): void {
        const e = message.getEvent()
        if (e instanceof Event) {
            if (e instanceof KeyboardEvent && e.type == 'keydown') {
                if (e.keyCode == key.SPACE || e.keyCode == key.ARROW_UP) {
                    if (!e.repeat) {
                        obj.setAngle(0.0)
                        obj.setState(new LamRexJumpingState())
                        obj.setVelocityY(config.TREX_JUMPING_VELOCITY)
                        obj.setAccelerationEffect(true)
                    }
                }
            }
        } else if (e == 'gameover') {
            obj.setState(new LamRexGameOverState())
        }
    }

    public update(obj: LamRex, timeInterval: number): void {
        if (this.rotateForward) {
            if (obj.getAngle() < 30) {
                obj.setAngle(obj.getAngle() + 1);
            } 
            else {
                this.rotateForward = false
            }
        }
        else {
            if (obj.getAngle() > -10) {
                obj.setAngle(obj.getAngle() - 1);
            } 
            else {
                this.rotateForward = true
            }
        }
    }
}

class LamRexJumpingState extends GameObjectState {
    constructor() {
        super()
    }

    public handleInput(obj: LamRex, message: Message): void {
        const e = message.getEvent()
        if (e == 'gameover') {
            obj.setState(new LamRexGameOverState())
        }
    }

    public update(obj: LamRex, timeInterval: number): void {
        let shiftY = obj.getShiftY()

        let location = obj.getLocation().copy()
        if (location.getY() - shiftY > config.TREX_CANVAS_LOCATION.getY() || location.getY() < 0) {
            location.setY(config.TREX_CANVAS_LOCATION.getY())
            obj.setLocation(location)
            obj.setVelocityY(0)
            obj.setAccelerationEffect(false)
            obj.setState(new LamRexRunningState())
        } else {
            location.setY(location.getY() - shiftY)
            obj.setLocation(location)
        }
    }
}

class LamRexGameOverState extends GameObjectState {
    constructor() {
        super()
    }

    public handleInput(obj: LamRex, message: Message): void {
        const e = message.getEvent()
        if (e == 'play') {
            obj.setY(config.TREX_CANVAS_LOCATION.getY())
            obj.setState(new LamRexRunningState())
            obj.setColliderList(lamRexColliderList)
        }
    }

    public update(obj: LamRex, timeInterval: number): void {
    }
}

class LamRexStartState extends GameObjectState {
    constructor() {
        super()
    }

    public handleInput(obj: LamRex, message: Message): void {
        const e = message.getEvent()
        if (e instanceof Event) {
            if (e instanceof KeyboardEvent) {
                if (e.keyCode == key.SPACE || e.keyCode == key.ARROW_UP) {
                    if (!e.repeat) {
                        obj.setState(new LamRexJumpingState())
                        obj.setColliderList(lamRexColliderList)
                        obj.setVelocityY(config.TREX_JUMPING_VELOCITY)
                        obj.setAccelerationEffect(true)
                        obj.getScene().handleInput(new Message("play"))
                    }
                }
            }
        }
    }

    public update(obj: LamRex, timeInterval: number): void {
        // obj.animate(timeInterval)
    }
}

export default {
    LamRexGameOverState,
    LamRexJumpingState,
    LamRexRunningState,
    LamRexStartState,
}
