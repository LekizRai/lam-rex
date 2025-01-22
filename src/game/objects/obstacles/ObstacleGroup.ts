import config from '../../utils/configs'
import Cactus from './cactus/Cactus'
import utils from '../../../engine/utils/utils'
import GameObject from '../../../engine/objects/base-classes/GameObject'
import Image from '../../../engine/objects/Image'
import Animation from '../../../engine/objects/Animation'
import Vector2D from '../../../engine/types/Vector2D'
import TRex from '../lamrex/LamRex'
import Message from '../../../engine/controllers/Message'
import SceneManager from '../../../engine/controllers/SceneManager'

const state = {
    START: 'start',
    PLAY: 'play',
    GAMEOVER: 'gameover',
}

class ObstacleGroup extends GameObject {
    private objectList: GameObject[]
    private obstacleGeneratingInterval: number
    private velocityChangingInterval: number

    private trex: TRex

    constructor(trex: TRex) {
        const relativeLocation: Vector2D = new Vector2D(0, 0)
        super(relativeLocation)
        this.objectList = []
        this.obstacleGeneratingInterval = config.OBSTACLE_GENERATING_INTERVAL
        this.setVelocityX(config.GROUND_VELOCITY_X)
        this.velocityChangingInterval = config.VELOCITY_CHANGING_INTERVAL

        this.trex = trex
    }

    private addObject(obj: GameObject): void {
        this.objectList.push(obj)
    }

    private removeObject(obj: GameObject): void {
        const index: number = this.objectList.indexOf(obj)
        if (index > -1) {
            this.objectList.splice(index, 1)
        }
    }

    public clearObjectList(): void {
        this.objectList.length = 0
    }

    public update(timeInterval: number): void {
        for (let i = 0; i < this.objectList.length; i++) {
            if (this.trex.isColliedWith(this.objectList[i])) {
                this.getScene().setState(state.GAMEOVER)
                this.trex.handleInput(new Message(this.getScene().getState()))
                SceneManager.getInstance().startScene(1)
                SceneManager.getInstance().pauseScene(0)
                return
            }
        }

        if (this.obstacleGeneratingInterval - timeInterval < 0) {
            let timeShift: number = utils.randomInt(-1000, 1000)
            this.obstacleGeneratingInterval = config.OBSTACLE_GENERATING_INTERVAL + timeShift
            this.obstacleGeneratingInterval = Math.floor(
                (this.obstacleGeneratingInterval * 450) / this.getVelocityX()
            )
            this.spawn()
        } else {
            this.obstacleGeneratingInterval -= timeInterval
        }

        if (this.velocityChangingInterval - timeInterval < 0) {
            this.velocityChangingInterval = config.VELOCITY_CHANGING_INTERVAL
            this.setVelocityX(this.getVelocityX() + 1)
            this.objectList.forEach((obj) => {
                obj.setVelocityX(this.getVelocityX())
            })
        } else {
            this.velocityChangingInterval -= timeInterval
        }

        let removedObjectList: GameObject[] = []
        this.objectList.forEach((obj: GameObject) => {
            if (obj instanceof Image || obj instanceof Animation) {
                if (obj.getX() + obj.getWidth() < 0) {
                    removedObjectList.push(obj)
                }
            }
        })
        removedObjectList.forEach((obj: GameObject) => {
            this.removeObject(obj)
            this.getScene().removeObject(obj)
            obj.destroy()
        })
    }

    public spawn(): void {
        let newObstacle: GameObject
        newObstacle = new Cactus(config.CACTUS_CANVAS_LOCATION)
        newObstacle.setVelocityX(this.getVelocityX())
        this.addObject(newObstacle)
        this.getScene().addObject(newObstacle)
    }
}

export default ObstacleGroup
