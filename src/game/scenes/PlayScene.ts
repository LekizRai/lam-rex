import Scene from '../../engine/scene/Scene'
import Message from '../../engine/controllers/Message'
import config from '../utils/configs'
import ScoreBoard from '../objects/scoreboard/ScoreBoard'
import TRex from '../objects/lamrex/LamRex'
import Mai from '../objects/lamrex/Mai'
import ObstacleGroup from '../objects/obstacles/ObstacleGroup'
import CloudGroup from '../objects/cloud/CloudGroup'
import GroundGroup from '../objects/ground/GroundGroup'
import Background from '../objects/ground/Background'

const state = {
    START: 'start',
    PLAY: 'play',
    GAMEOVER: 'gameover',
}

class PlayScene extends Scene {
    private obstacleGroup: ObstacleGroup

    private cloudGroup: CloudGroup

    private groundGroup: GroundGroup

    private background: Background

    private trex: TRex

    private mai: Mai

    private scoreBoard: ScoreBoard

    constructor() {
        super()
        this.setState(state.START)
        this.audio = new Audio("../../assets/sounds/theme.mp3")
        this.audio.loop = true
    }

    public handleInput(message: Message) {
        const e = message.getEvent()
        if (e == state.PLAY) {
            this.setState(state.PLAY)
            this.reload()
        }
    }

    public reload(): void {
        if (!this.played) {
            this.audio.play()
            this.played = true
        }
        this.setState(state.PLAY)
        this.obstacleGroup.setVelocityX(config.GROUND_VELOCITY_X)
        this.groundGroup.setVelocityX(config.GROUND_VELOCITY_X)

        this.getObjectList().forEach((obj) => {
            if (!(obj instanceof TRex) && !(obj instanceof ScoreBoard) && !(obj instanceof Mai)) {
                obj.destroy()
            }
        })
        this.objectList.length = 0

        this.addObject(this.obstacleGroup)
        this.obstacleGroup.clearObjectList()

        this.addObject(this.cloudGroup)
        this.cloudGroup.clearObjectList()

        this.addObject(this.groundGroup)
        this.groundGroup.clearObjectList()
        this.groundGroup.setup()

        this.addObject(this.background)

        this.scoreBoard.reload()
        this.scoreBoard.setIsRendered(true)
        this.scoreBoard.setIsUpdated(true)
        this.addObject(this.scoreBoard)

        this.trex.handleInput(new Message(this.getState()))
        this.addObject(this.trex)

        this.mai.handleInput(new Message(this.getState()))
        this.addObject(this.mai)
    }

    public setup(): void {
        this.background = new Background(config.BACKGROUND_CANVAS_LOCATION)
        this.addObject(this.background)

        this.mai = new Mai(config.MAI_CANVAS_LOCATION, 1)
        this.addObject(this.mai)
        this.inputHandler.attachKeyboardEvent(this.mai)

        this.trex = new TRex(config.TREX_CANVAS_LOCATION, 2)
        this.addObject(this.trex)
        this.inputHandler.attachKeyboardEvent(this.trex)

        this.obstacleGroup = new ObstacleGroup(this.trex)
        this.cloudGroup = new CloudGroup()
        this.groundGroup = new GroundGroup()

        this.scoreBoard = new ScoreBoard(config.SCOREBOARD_CANVAS_LOCATION, 1)
        this.scoreBoard.setIsRendered(false)
        this.scoreBoard.setIsUpdated(false)
        this.addObject(this.scoreBoard)
    }
}

export default PlayScene
