import config from '../../utils/configs'
import key from '../../utils/keys'
import GameObjectState from '../../../engine/objects/base-classes/GameObjectState'
import Mai from './Mai'
import Vector2D from '../../../engine/types/Vector2D'
import Message from '../../../engine/controllers/Message'
import Collider from '../../../engine/components/Collider'

const MaiColliderList = [
    new Collider(new Vector2D(4, 12), 0, 0)
]

class MaiRunningState extends GameObjectState {
    private rotateForward: boolean

    constructor() {
        super()
        this.rotateForward = false
    }

    public handleInput(obj: Mai, message: Message): void {
        const e = message.getEvent()
        if (e instanceof Event) {
            if (e instanceof KeyboardEvent && e.type == 'keydown') {
                if (e.keyCode == key.SPACE || e.keyCode == key.ARROW_UP) {
                    if (!e.repeat) {
                        obj.setAngle(80)
                        obj.setState(new MaiJumpingState())
                        obj.setVelocityY(config.TREX_JUMPING_VELOCITY)
                        obj.setAccelerationEffect(true)
                    }
                }
            }
        } else if (e == 'gameover') {
            obj.setState(new MaiGameOverState())
        }
    }

    public update(obj: Mai, timeInterval: number): void {
        if (this.rotateForward) {
            if (obj.getAngle() < 100) {
                obj.setAngle(obj.getAngle() + 1);
            } 
            else {
                this.rotateForward = false
            }
        }
        else {
            if (obj.getAngle() > 60) {
                obj.setAngle(obj.getAngle() - 1);
            } 
            else {
                this.rotateForward = true
            }
        }
    }
}

class MaiJumpingState extends GameObjectState {
    constructor() {
        super()
    }

    public handleInput(obj: Mai, message: Message): void {
        const e = message.getEvent()
        if (e == 'gameover') {
            obj.setState(new MaiGameOverState())
        }
    }

    public update(obj: Mai, timeInterval: number): void {
        let shiftY = obj.getShiftY()

        let location = obj.getLocation().copy()
        if (location.getY() - shiftY > config.MAI_CANVAS_LOCATION.getY() || location.getY() < 0) {
            location.setY(config.MAI_CANVAS_LOCATION.getY())
            obj.setLocation(location)
            obj.setVelocityY(0)
            obj.setAccelerationEffect(false)
            obj.setState(new MaiRunningState())
        } else {
            location.setY(location.getY() - shiftY)
            obj.setLocation(location)
        }
    }
}

class MaiGameOverState extends GameObjectState {
    constructor() {
        super()
    }

    public handleInput(obj: Mai, message: Message): void {
        const e = message.getEvent()
        if (e == 'play') {
            obj.setY(config.MAI_CANVAS_LOCATION.getY())
            obj.setState(new MaiRunningState())
            obj.setColliderList(MaiColliderList)
        }
    }

    public update(obj: Mai, timeInterval: number): void {
    }
}

class MaiStartState extends GameObjectState {
    constructor() {
        super()
    }

    public handleInput(obj: Mai, message: Message): void {
        const e = message.getEvent()
        if (e instanceof Event) {
            if (e instanceof KeyboardEvent) {
                if (e.keyCode == key.SPACE || e.keyCode == key.ARROW_UP) {
                    if (!e.repeat) {
                        obj.setState(new MaiJumpingState())
                        obj.setColliderList(MaiColliderList)
                        obj.setVelocityY(config.TREX_JUMPING_VELOCITY)
                        obj.setAccelerationEffect(true)
                    }
                }
            }
        }
    }

    public update(obj: Mai, timeInterval: number): void {
        // obj.animate(timeInterval)
    }
}

export default {
    MaiGameOverState,
    MaiJumpingState,
    MaiRunningState,
    MaiStartState,
}
