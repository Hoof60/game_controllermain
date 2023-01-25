let weaponPower = 6
let energyPower = 6
let thrustPower = 6

let paused = 0
drawbars()

function drawbars(){
    
    led.plotBarGraph(0, 100)
    led.unplot(2,4)
    plotBar(energyPower, 0)
    plotBar(thrustPower, 2)
    plotBar(weaponPower, 4)
}

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

radio.onReceivedString(function (receivedString) {

    if (receivedString.charAt(0) == 't'){
        let splitstring = receivedString.split(":")
        let thrustValue = parseFloat(splitstring[1]) * (thrustPower/10)

        serial.writeLine("t:" + thrustValue)
    } else {
    serial.writeLine(receivedString)
    }
})

input.onPinPressed(TouchPin.P2, function () {
    if (paused == 0){
        serial.writeLine("p:1")
        paused = 1
    } else {
        serial.writeLine("p:0")
        paused = 0
    }
})



let BPressed = 0
let APressed = 0
let LPressed = 0
let shieldActive = 0
let LHoldTime = 50
let LPressedTimer = LHoldTime
radio.setGroup(24)



basic.forever(function () {
    if (APressed == 0 && input.buttonIsPressed(Button.A)) {
        APressed = 1
        if (energyPower < 10) {
            energyPower += 2
            thrustPower--
            weaponPower--
            drawbars()
            serial.writeLine("er:" + energyPower)
            serial.writeLine("wr:" + weaponPower)
        }
    } else {
        if (APressed == 1 && !(input.buttonIsPressed(Button.A))) {
            APressed = 0
        }
    }
    if (BPressed == 0 && input.buttonIsPressed(Button.B)) {
        BPressed = 1
        if (weaponPower < 10) {
            weaponPower += 2
            thrustPower--
            energyPower--
            drawbars()
            serial.writeLine("er:" + energyPower)
            serial.writeLine("wr:" + weaponPower)
        }
    } else {
        if (BPressed == 1 && !(input.buttonIsPressed(Button.B))) {
            BPressed = 0
        }
    }

    if (LPressed == 1 && !input.logoIsPressed()){
        LPressed = 0
        if (LPressedTimer > 0 && thrustPower < 10) {
            thrustPower += 2
            energyPower--
            weaponPower--
            drawbars()
            serial.writeLine("er:" + energyPower)
            serial.writeLine("wr:" + weaponPower)
        }
        LPressedTimer = LHoldTime

    }

    if (input.logoIsPressed()){
        LPressed = 1
        LPressedTimer--
        if (LPressedTimer == 0){
            energyPower = 6
            weaponPower = 6
            thrustPower = 6
            drawbars()

            music.playTone(Note.C, music.beat(BeatFraction.Eighth))
        }
    }

})
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function() {

    let line = ""
    do{   
        line = serial.readLine()
    } while (line.charAt(0) != 'e')
    radio.sendString(line)

})