function drawbars () {
    basic.clearScreen()
    plotBar(energyPower, 0)
plotBar(thrustPower, 2)
plotBar(weaponPower, 4)
}
input.onButtonPressed(Button.AB, function () {
    if (paused == 0) {
        serial.writeLine("p:1")
        paused = 1
    } else {
        serial.writeLine("p:0")
        paused = 0
    }
})
radio.onReceivedString(function (receivedString) {
    if (receivedString.charAt(0) == "t") {
        splitstring = receivedString.split(":")
        thrustValue = parseFloat(splitstring[1]) * thrustscale[thrustPower]
        serial.writeLine("t:" + thrustValue)
    } else {
        serial.writeLine(receivedString)
    }
})
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    do{   
        line = serial.readLine()
        if (line.charAt(0) == 'a'){
            let newalive = parseInt(line.split(":")[1])
            if (newalive == 0 && alive == 1){
                alive = 0 
                radio.sendString("a:0")
                basic.showIcon(IconNames.Skull)
            }
            if (newalive == 1 && alive == 0){
                reset()
                radio.sendString("a:1")
                alive = 1
            }
        }
       } while (line.charAt(0) != 'e')
radio.sendString("" + (line))
})
function reset () {
    energyPower = 6
    weaponPower = 6
    thrustPower = 6
    serial.writeLine("er:" + energyscale[energyPower])
    serial.writeLine("wr:" + weaponscale[weaponPower])
    drawbars()
}
let LPressed = 0
let BPressed = 0
let APressed = 0
let thrustValue = 0
let splitstring: string[] = []
let paused = 0
let thrustPower = 0
let energyPower = 0
let weaponPower = 0
let shieldActive = 0
let line = ""
weaponPower = 6
energyPower = 6
thrustPower = 6
let alive = 1
let weaponscale = [0,0.2,0.4,0.6,0.8,0.9,1,1.4,2,2.5, 3]
let energyscale = [0,0.2,0.4,1,1.25,1.5,1.75,2,3,4, 5]
let thrustscale = [0,0.2,0.4,0.6,0.8, 0.9,1,1.5,1.75,2,2.25]
drawbars()
function plotBar(power:any, column:any){
    let temp = power
    let ledRow = 4
    let ledColumn = column
    while (temp > 0) {
        if (temp >= 2) {
            temp -= 2
            led.plot(ledColumn, ledRow)
        } else {
            temp -= 1
            led.plotBrightness(ledColumn, ledRow, 255 / 6)
        }
        ledRow--
    }
}
let LHoldTime = 50
let LPressedTimer = LHoldTime
radio.setGroup(24)
basic.forever(function () {
    if (APressed == 0 && input.buttonIsPressed(Button.A)) {
        APressed = 1
        if (energyPower < 10 && alive == 1) {
            energyPower += 2
            thrustPower += -1
            weaponPower += -1
            drawbars()
            serial.writeLine("er:" + energyscale[energyPower])
            serial.writeLine("wr:" + weaponscale[weaponPower])
        }
    } else {
        if (APressed == 1 && !(input.buttonIsPressed(Button.A))) {
            APressed = 0
        }
    }
    if (BPressed == 0 && input.buttonIsPressed(Button.B)) {
        BPressed = 1
        if (weaponPower < 10 && alive == 1) {
            weaponPower += 2
            thrustPower += -1
            energyPower += -1
            drawbars()
            serial.writeLine("er:" + energyscale[energyPower])
            serial.writeLine("wr:" + weaponscale[weaponPower])
        }
    } else {
        if (BPressed == 1 && !(input.buttonIsPressed(Button.B))) {
            BPressed = 0
        }
    }
    if (LPressed == 1 && !(input.logoIsPressed())) {
        LPressed = 0
        if (LPressedTimer > 0 && thrustPower < 10 && alive == 1) {
            thrustPower += 2
            energyPower += -1
            weaponPower += -1
            drawbars()
            serial.writeLine("er:" + energyscale[energyPower])
            serial.writeLine("wr:" + weaponscale[weaponPower])
        }
        LPressedTimer = LHoldTime
    }
    if (input.logoIsPressed()) {
        LPressed = 1
        LPressedTimer += -1
        if (LPressedTimer == 0 && alive == 1) {
            reset()
            music.playTone(262, music.beat(BeatFraction.Eighth))
        }
    }
})
